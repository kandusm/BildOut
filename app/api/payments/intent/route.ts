import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, amount: customAmount } = body

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Fetch invoice by payment_link_token (public access, no auth required)
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select(`
        *,
        clients (
          name,
          email
        ),
        organizations:org_id (
          name,
          users!inner (
            stripe_connect_id
          )
        )
      `)
      .eq('payment_link_token', token)
      .single()

    if (invoiceError || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Check if invoice can accept payments
    if (invoice.status === 'paid' || invoice.status === 'void' || invoice.status === 'cancelled') {
      return NextResponse.json(
        { error: `Invoice is ${invoice.status} and cannot accept payments` },
        { status: 400 }
      )
    }

    // Determine payment amount
    let amount = customAmount ? parseFloat(customAmount) : invoice.amount_due

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 })
    }

    if (amount > invoice.amount_due) {
      return NextResponse.json(
        { error: `Amount cannot exceed balance due ($${invoice.amount_due})` },
        { status: 400 }
      )
    }

    // Check deposit requirement
    if (invoice.deposit_required && amount < invoice.deposit_required && amount < invoice.amount_due) {
      return NextResponse.json(
        { error: `Minimum payment amount is $${invoice.deposit_required}` },
        { status: 400 }
      )
    }

    // Get merchant's Stripe Connect account
    const organization = invoice.organizations as any
    const merchantUser = organization.users[0]

    if (!merchantUser || !merchantUser.stripe_connect_id) {
      return NextResponse.json(
        { error: 'Merchant payment processing not configured' },
        { status: 400 }
      )
    }

    // Calculate application fee (1.5% platform fee)
    const applicationFeeAmount = Math.round(amount * 100 * 0.015)

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: invoice.currency || 'usd',
      application_fee_amount: applicationFeeAmount,
      transfer_data: {
        destination: merchantUser.stripe_connect_id,
      },
      metadata: {
        invoice_id: invoice.id,
        org_id: invoice.org_id,
        payment_type: amount === invoice.total ? 'full' : 'partial',
      },
      description: `Payment for Invoice #${invoice.number}`,
      receipt_email: invoice.clients?.email || undefined,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: amount,
      currency: paymentIntent.currency,
    })
  } catch (error) {
    console.error('Payment intent error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
