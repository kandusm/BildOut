import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { checkInvoiceLimit } from '@/lib/subscription/check-limits'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      org_id,
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

    // Verify user belongs to this org
    const { data: profile } = await supabase
      .from('users')
      .select('org_id')
      .eq('id', user.id)
      .single()

    if (!profile || profile.org_id !== org_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check invoice limit for subscription plan
    const limitCheck = await checkInvoiceLimit(org_id)
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

    // Get next invoice number for this organization
    const { data: lastInvoice } = await supabase
      .from('invoices')
      .select('number')
      .eq('org_id', org_id)
      .order('number', { ascending: false })
      .limit(1)
      .single()

    const nextNumber = lastInvoice ? parseInt(lastInvoice.number) + 1 : 1
    const invoiceNumber = nextNumber.toString().padStart(5, '0')

    // Generate payment link token
    const paymentLinkToken = crypto.randomUUID()

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        org_id,
        client_id,
        number: invoiceNumber,
        issue_date,
        due_date,
        subtotal,
        tax_total,
        discount_total,
        total,
        amount_paid: 0,
        amount_due: total,
        status: 'draft',
        notes,
        payment_link_token: paymentLinkToken,
        allow_partial: true,
        deposit_required: null,
      })
      .select()
      .single()

    if (invoiceError) {
      console.error('Error creating invoice:', invoiceError)
      return NextResponse.json({ error: invoiceError.message }, { status: 500 })
    }

    // Create line items
    if (line_items && line_items.length > 0) {
      const lineItemsData = line_items.map((item: any) => ({
        invoice_id: invoice.id,
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
        // Note: Invoice was created but line items failed
        // In production, you might want to roll back the invoice or handle this differently
      }
    }

    return NextResponse.json(invoice)
  } catch (error: any) {
    console.error('Invoice creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create invoice' },
      { status: 500 }
    )
  }
}
