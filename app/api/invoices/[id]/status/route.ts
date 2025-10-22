import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { resend } from '@/lib/email/client'
import { InvoiceSentEmail } from '@/emails/invoice-sent'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    // Get user's org_id
    const { data: profile } = await supabase
      .from('users')
      .select('org_id')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Verify invoice belongs to user's org
    const { data: existingInvoice } = await supabase
      .from('invoices')
      .select('org_id')
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (!existingInvoice || existingInvoice.org_id !== profile.org_id) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Update invoice status
    const { data: invoice, error } = await supabase
      .from('invoices')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating invoice status:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If status changed to 'sent', send email to client
    if (status === 'sent') {
      try {
        // Fetch invoice with client and items for email
        const { data: invoiceData } = await supabase
          .from('invoices')
          .select(`
            *,
            clients (name, email),
            organizations (name, email),
            invoice_items (name, quantity, line_total)
          `)
          .eq('id', id)
          .single()

        if (invoiceData?.clients?.email) {
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
          const paymentLink = `${appUrl}/pay/${invoiceData.payment_link_token}`

          await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>', // Use test domain for now
            to: [invoiceData.clients.email],
            subject: `Invoice ${invoiceData.number} from ${invoiceData.organizations?.name || 'BildOut'}`,
            react: InvoiceSentEmail({
              invoiceNumber: invoiceData.number,
              clientName: invoiceData.clients.name,
              merchantName: invoiceData.organizations?.name || 'BildOut',
              merchantEmail: invoiceData.organizations?.email,
              invoiceTotal: invoiceData.total,
              dueDate: invoiceData.due_date,
              issueDate: invoiceData.issue_date,
              paymentLink: paymentLink,
              items: invoiceData.invoice_items.map((item: any) => ({
                name: item.name,
                quantity: item.quantity,
                amount: item.line_total,
              })),
              notes: invoiceData.notes,
            }),
          })

          console.log(`✉️ Invoice sent email delivered to ${invoiceData.clients.email}`)
        }
      } catch (emailError) {
        // Don't fail the status update if email fails
        console.error('Failed to send invoice email:', emailError)
      }
    }

    return NextResponse.json(invoice)
  } catch (error: any) {
    console.error('Error updating invoice status:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update invoice status' },
      { status: 500 }
    )
  }
}
