import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { resend, FROM_EMAIL } from '@/lib/email/client'
import { generateInvoiceEmail } from '@/lib/email/templates/invoice-notification'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const { sendEmail = true } = body // Default to true for backward compatibility

    const supabase = await createClient()

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's profile and org
    const { data: profile } = await supabase
      .from('users')
      .select('org_id, organizations(*)')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Fetch invoice with client details
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select(`
        *,
        clients (
          id,
          name,
          email
        )
      `)
      .eq('id', id)
      .eq('org_id', profile.org_id)
      .single()

    if (invoiceError || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Only validate client email if we're actually sending an email
    if (sendEmail && (!invoice.clients || !invoice.clients.email)) {
      return NextResponse.json(
        { error: 'Invoice must have a client with an email address to send via email' },
        { status: 400 }
      )
    }

    // Check if invoice is in draft status
    if (invoice.status !== 'draft') {
      return NextResponse.json(
        { error: 'Only draft invoices can be sent' },
        { status: 400 }
      )
    }

    // Generate payment link token if it doesn't exist
    let paymentLinkToken = invoice.payment_link_token
    if (!paymentLinkToken) {
      paymentLinkToken = crypto.randomUUID()

      const { error: updateError } = await supabase
        .from('invoices')
        .update({ payment_link_token: paymentLinkToken })
        .eq('id', id)

      if (updateError) {
        console.error('Error updating payment link token:', updateError)
        return NextResponse.json(
          { error: 'Failed to generate payment link' },
          { status: 500 }
        )
      }
    }

    // Create payment link
    const paymentLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pay/${paymentLinkToken}`

    // Send email via Resend if requested
    if (sendEmail) {
      // Format amounts
      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount)
      }

      const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      }

      // Generate email content
      const organization = profile.organizations as any
      const emailContent = generateInvoiceEmail({
        invoiceNumber: invoice.number,
        clientName: invoice.clients.name,
        amount: formatCurrency(invoice.total),
        dueDate: invoice.due_date ? formatDate(invoice.due_date) : undefined,
        paymentLink,
        merchantName: organization.name || 'BildOut',
        notes: invoice.notes || undefined,
      })

      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: invoice.clients.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        })
      } catch (emailError: any) {
        console.error('Error sending email:', emailError)
        return NextResponse.json(
          { error: 'Failed to send email', details: emailError.message },
          { status: 500 }
        )
      }
    }

    // Update invoice status to 'sent'
    const { error: statusError } = await supabase
      .from('invoices')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (statusError) {
      console.error('Error updating invoice status:', statusError)
      // Email was sent, but status update failed
      // We'll still return success since the main action (sending email) succeeded
    }

    // Record status change in history
    const historyNote = sendEmail && invoice.clients?.email
      ? `Invoice sent to ${invoice.clients.email}`
      : 'Invoice marked as sent (no email sent)'

    await supabase
      .from('invoice_status_history')
      .insert({
        invoice_id: id,
        status: 'sent',
        changed_at: new Date().toISOString(),
        changed_by: user.id,
        notes: historyNote,
      })

    return NextResponse.json({
      success: true,
      message: sendEmail ? 'Invoice sent successfully' : 'Invoice marked as sent',
      sentTo: sendEmail ? invoice.clients?.email : undefined,
    })
  } catch (error: any) {
    console.error('Error sending invoice:', error)
    return NextResponse.json(
      { error: 'Failed to send invoice', details: error.message },
      { status: 500 }
    )
  }
}
