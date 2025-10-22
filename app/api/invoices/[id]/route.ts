import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's org_id
    const { data: profile } = await supabase
      .from('users')
      .select('org_id')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fetch invoice with line items
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(`
        *,
        clients (
          id,
          name,
          email
        ),
        invoice_items (*)
      `)
      .eq('id', id)
      .eq('org_id', profile.org_id)
      .is('deleted_at', null)
      .single()

    if (error) {
      console.error('Error fetching invoice:', error)
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    return NextResponse.json(invoice)
  } catch (error: any) {
    console.error('Error fetching invoice:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch invoice' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
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
    const {
      client_id,
      issue_date,
      due_date,
      subtotal,
      tax_total,
      discount_total,
      total,
      notes,
      line_items,
    } = body

    // Get user's org_id
    const { data: profile } = await supabase
      .from('users')
      .select('org_id')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Verify invoice belongs to user's org
    const { data: existingInvoice } = await supabase
      .from('invoices')
      .select('org_id, status')
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (!existingInvoice || existingInvoice.org_id !== profile.org_id) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Update invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .update({
        client_id,
        issue_date,
        due_date,
        subtotal,
        tax_total,
        discount_total,
        total,
        amount_due: total - (existingInvoice.status === 'paid' ? total : 0),
        notes,
      })
      .eq('id', id)
      .select()
      .single()

    if (invoiceError) {
      console.error('Error updating invoice:', invoiceError)
      return NextResponse.json({ error: invoiceError.message }, { status: 500 })
    }

    // Delete existing line items
    await supabase
      .from('invoice_items')
      .delete()
      .eq('invoice_id', id)

    // Create new line items
    if (line_items && line_items.length > 0) {
      const lineItemsData = line_items.map((item: any) => ({
        invoice_id: id,
        name: item.description,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total: item.total_price,
      }))

      const { error: lineItemsError } = await supabase
        .from('invoice_items')
        .insert(lineItemsData)

      if (lineItemsError) {
        console.error('Error creating line items:', lineItemsError)
      }
    }

    return NextResponse.json(invoice)
  } catch (error: any) {
    console.error('Error updating invoice:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update invoice' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's org_id
    const { data: profile } = await supabase
      .from('users')
      .select('org_id')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
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

    // Soft delete the invoice
    const { error } = await supabase
      .from('invoices')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('Error deleting invoice:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting invoice:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete invoice' },
      { status: 500 }
    )
  }
}
