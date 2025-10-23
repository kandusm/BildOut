import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's profile and org
    const { data: profile } = await supabase
      .from('users')
      .select('org_id')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Fetch invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .eq('org_id', profile.org_id)
      .single()

    if (invoiceError || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Check if invoice is already paid
    if (invoice.status === 'paid') {
      return NextResponse.json(
        { error: 'Invoice is already marked as paid' },
        { status: 400 }
      )
    }

    // Update invoice status to 'paid'
    const { error: updateError } = await supabase
      .from('invoices')
      .update({
        status: 'paid',
        amount_paid: invoice.total,
        amount_due: 0,
      })
      .eq('id', id)

    if (updateError) {
      console.error('Error updating invoice status:', updateError)
      return NextResponse.json(
        { error: 'Failed to mark invoice as paid' },
        { status: 500 }
      )
    }

    // Record status change in history
    await supabase
      .from('invoice_status_history')
      .insert({
        invoice_id: id,
        status: 'paid',
        changed_at: new Date().toISOString(),
        changed_by: user.id,
        notes: 'Invoice manually marked as paid',
      })

    return NextResponse.json({
      success: true,
      message: 'Invoice marked as paid successfully',
    })
  } catch (error: any) {
    console.error('Error marking invoice as paid:', error)
    return NextResponse.json(
      { error: 'Failed to mark invoice as paid', details: error.message },
      { status: 500 }
    )
  }
}
