import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { OverdueReminderEmail } from '@/emails/overdue-reminder'

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron or contains the secret
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use service role key for cron jobs to bypass RLS
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get today's date (UTC)
    const today = new Date().toISOString().split('T')[0]

    // Find all invoices that are overdue
    // Status should be 'sent', 'viewed', or 'partial'
    // Due date should be before today
    const { data: overdueInvoices, error: fetchError } = await supabase
      .from('invoices')
      .select(`
        *,
        clients (
          id,
          name,
          email
        ),
        organizations (
          id,
          name,
          email
        )
      `)
      .in('status', ['sent', 'viewed', 'partial'])
      .lt('due_date', today)
      .is('deleted_at', null)

    if (fetchError) {
      console.error('Error fetching overdue invoices:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch overdue invoices' },
        { status: 500 }
      )
    }

    if (!overdueInvoices || overdueInvoices.length === 0) {
      return NextResponse.json({
        message: 'No overdue invoices found',
        count: 0,
      })
    }

    const results = {
      updated: 0,
      emailsSent: 0,
      errors: [] as string[],
    }

    // Process each overdue invoice
    for (const invoice of overdueInvoices) {
      try {
        // Update invoice status to 'overdue'
        const { error: updateError } = await supabase
          .from('invoices')
          .update({ status: 'overdue' })
          .eq('id', invoice.id)

        if (updateError) {
          console.error(`Error updating invoice ${invoice.id}:`, updateError)
          results.errors.push(`Failed to update invoice ${invoice.number}`)
          continue
        }

        results.updated++

        // Send reminder email to client if they have an email
        const client = invoice.clients as any
        const organization = invoice.organizations as any

        if (client?.email && resend) {
          try {
            const invoicePrefix = organization.metadata?.invoice_prefix || 'INV'
            const displayInvoiceNumber = `${invoicePrefix}-${invoice.number}`

            await resend.emails.send({
              from: `${organization.name} <invoices@bildout.com>`,
              to: client.email,
              subject: `Overdue Payment Reminder - Invoice ${displayInvoiceNumber}`,
              react: OverdueReminderEmail({
                invoiceNumber: displayInvoiceNumber,
                clientName: client.name,
                merchantName: organization.name,
                amountDue: invoice.amount_due,
                dueDate: invoice.due_date,
                paymentLink: `${process.env.NEXT_PUBLIC_APP_URL}/pay/${invoice.payment_link_token}`,
              }),
            })

            results.emailsSent++
          } catch (emailError) {
            console.error(`Error sending reminder email for invoice ${invoice.id}:`, emailError)
            results.errors.push(`Failed to send email for invoice ${invoice.number}`)
          }
        }
      } catch (error) {
        console.error(`Error processing invoice ${invoice.id}:`, error)
        results.errors.push(`Failed to process invoice ${invoice.number}`)
      }
    }

    return NextResponse.json({
      message: 'Overdue detection completed',
      totalFound: overdueInvoices.length,
      updated: results.updated,
      emailsSent: results.emailsSent,
      errors: results.errors,
    })
  } catch (error) {
    console.error('Overdue detection error:', error)
    return NextResponse.json(
      { error: 'Failed to process overdue invoices' },
      { status: 500 }
    )
  }
}
