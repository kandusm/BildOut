import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkInvoiceLimit } from '@/lib/subscription/check-limits'

export async function POST(
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

    // Get user's org_id
    const { data: profile } = await supabase
      .from('users')
      .select('org_id')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Fetch the original invoice with line items
    const { data: originalInvoice, error: invoiceError } = await supabase
      .from('invoices')
      .select(`
        *,
        invoice_items (*)
      `)
      .eq('id', id)
      .eq('org_id', profile.org_id)
      .single()

    if (invoiceError || !originalInvoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Check invoice limit for subscription plan
    const limitCheck = await checkInvoiceLimit(profile.org_id)
    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Invoice limit reached',
          message: `You've reached your plan's limit of ${limitCheck.limit} invoices per month. Upgrade to Pro for unlimited invoices.`,
          limit: limitCheck.limit,
          current: limitCheck.current,
          plan: limitCheck.plan,
          upgradeRequired: true,
        },
        { status: 403 }
      )
    }

    // Get the highest invoice number for this org
    const { data: latestInvoice } = await supabase
      .from('invoices')
      .select('number')
      .eq('org_id', profile.org_id)
      .order('number', { ascending: false })
      .limit(1)
      .single()

    const nextNumber = latestInvoice ? parseInt(latestInvoice.number) + 1 : 1
    const invoiceNumber = nextNumber.toString().padStart(5, '0')

    // Generate new payment link token
    const crypto = require('crypto')
    const paymentLinkToken = crypto.randomUUID()

    // Create new invoice (without line items)
    const { data: newInvoice, error: createError } = await supabase
      .from('invoices')
      .insert({
        org_id: profile.org_id,
        client_id: originalInvoice.client_id,
        number: invoiceNumber,
        issue_date: new Date().toISOString().split('T')[0], // Today's date
        due_date: originalInvoice.due_date, // Keep same payment terms
        status: 'draft', // Always start as draft
        subtotal: originalInvoice.subtotal,
        tax_total: originalInvoice.tax_total,
        total: originalInvoice.total,
        amount_due: originalInvoice.total, // Reset to full amount
        currency: originalInvoice.currency,
        notes: originalInvoice.notes,
        payment_terms: originalInvoice.payment_terms,
        payment_link_token: paymentLinkToken,
        deposit_required: originalInvoice.deposit_required,
      })
      .select()
      .single()

    if (createError || !newInvoice) {
      console.error('Error creating duplicated invoice:', createError)
      return NextResponse.json(
        { error: 'Failed to duplicate invoice' },
        { status: 500 }
      )
    }

    // Duplicate line items
    if (originalInvoice.invoice_items && originalInvoice.invoice_items.length > 0) {
      const newLineItems = originalInvoice.invoice_items.map((item: any) => ({
        invoice_id: newInvoice.id,
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: item.tax_rate,
        line_total: item.line_total,
      }))

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(newLineItems)

      if (itemsError) {
        console.error('Error duplicating line items:', itemsError)
        // Continue anyway - invoice is created, just without items
      }
    }

    return NextResponse.json({
      success: true,
      invoice: newInvoice,
    })
  } catch (error) {
    console.error('Duplicate invoice error:', error)
    return NextResponse.json(
      { error: 'Failed to duplicate invoice' },
      { status: 500 }
    )
  }
}
