import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { resend } from '@/lib/email/client'
import { PaymentReceiptEmail } from '@/emails/payment-receipt'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = (await headers()).get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  // Support multiple webhook secrets (one for connected accounts, one for platform)
  const webhookSecrets = [
    process.env.STRIPE_WEBHOOK_SECRET,
    process.env.STRIPE_WEBHOOK_SECRET_CONNECT,
  ].filter(Boolean) as string[]

  if (webhookSecrets.length === 0) {
    console.error('No webhook secrets configured')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event | null = null
  let lastError: Error | null = null

  // Try each webhook secret until one works
  for (const secret of webhookSecrets) {
    try {
      event = stripe.webhooks.constructEvent(body, signature, secret)
      break // Success! Stop trying
    } catch (err) {
      lastError = err as Error
      // Continue to next secret
    }
  }

  if (!event) {
    console.error('Webhook signature verification failed with all secrets:', lastError)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  // Use service role key for webhooks to bypass RLS
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Store event for idempotency
  const { error: eventError } = await supabase
    .from('stripe_events')
    .insert({
      id: event.id,
      type: event.type,
      payload: event as any,
      processed: false,
    })
    .select()
    .single()

  if (eventError) {
    // Event already processed (duplicate webhook)
    if (eventError.code === '23505') {
      console.log('Duplicate webhook event, skipping:', event.id)
      return NextResponse.json({ received: true })
    }
    console.error('Error storing event:', eventError)
    return NextResponse.json({ error: 'Failed to store event' }, { status: 500 })
  }

  try {
    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
        break

      case 'account.updated':
        await handleAccountUpdated(event.data.object as Stripe.Account)
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Mark event as processed
    await supabase
      .from('stripe_events')
      .update({ processed: true, processed_at: new Date().toISOString() })
      .eq('id', event.id)

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const invoiceId = paymentIntent.metadata.invoice_id
  const orgId = paymentIntent.metadata.org_id

  if (!invoiceId || !orgId) {
    console.error('Missing invoice_id or org_id in payment intent metadata')
    return
  }

  const amount = paymentIntent.amount / 100 // Convert from cents

  // Create payment record
  const { error: paymentError } = await supabase
    .from('payments')
    .insert({
      org_id: orgId,
      invoice_id: invoiceId,
      stripe_payment_intent: paymentIntent.id,
      stripe_charge_id: paymentIntent.latest_charge as string,
      amount: amount,
      currency: paymentIntent.currency,
      status: 'succeeded',
      method: paymentIntent.payment_method_types[0] || 'card',
    })

  if (paymentError) {
    console.error('Error creating payment record:', paymentError)
    throw paymentError
  }

  // Fetch current invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', invoiceId)
    .single()

  if (invoiceError || !invoice) {
    console.error('Error fetching invoice:', invoiceError)
    throw new Error('Invoice not found')
  }

  // Calculate new amounts
  const newAmountPaid = invoice.amount_paid + amount
  const newAmountDue = invoice.total - newAmountPaid

  // Determine new status
  let newStatus = invoice.status
  if (newAmountDue <= 0) {
    newStatus = 'paid'
  } else if (newAmountPaid > 0 && newAmountDue > 0) {
    newStatus = 'partial'
  }

  // Update invoice
  const { error: updateError } = await supabase
    .from('invoices')
    .update({
      amount_paid: newAmountPaid,
      amount_due: newAmountDue,
      status: newStatus,
      stripe_payment_intent: paymentIntent.id,
    })
    .eq('id', invoiceId)

  if (updateError) {
    console.error('Error updating invoice:', updateError)
    throw updateError
  }

  // Fetch invoice with client details for email
  const { data: invoiceWithClient } = await supabase
    .from('invoices')
    .select(`
      *,
      clients (name, email),
      organizations (name)
    `)
    .eq('id', invoiceId)
    .single()

  // Send payment receipt email
  if (invoiceWithClient?.clients?.email) {
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
      const paymentLink = `${appUrl}/pay/${invoiceWithClient.payment_link_token}`

      await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>', // Use test domain for now
        to: [invoiceWithClient.clients.email],
        subject: `Payment Receipt - Invoice ${invoiceWithClient.number}`,
        react: PaymentReceiptEmail({
          invoiceNumber: invoiceWithClient.number,
          clientName: invoiceWithClient.clients.name,
          merchantName: invoiceWithClient.organizations?.name || 'BildOut',
          paymentAmount: amount,
          paymentDate: new Date().toISOString(),
          paymentMethod: paymentIntent.payment_method_types[0] || 'card',
          invoiceTotal: invoiceWithClient.total,
          amountPaid: newAmountPaid,
          balanceRemaining: newAmountDue,
          invoiceLink: paymentLink,
        }),
      })

      console.log(`✉️ Payment receipt sent to ${invoiceWithClient.clients.email}`)
    } catch (emailError) {
      // Don't throw - email failure shouldn't break the webhook
      console.error('Failed to send payment receipt email:', emailError)
    }
  }

  console.log(`Payment succeeded for invoice ${invoiceId}: $${amount}`)
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const invoiceId = paymentIntent.metadata.invoice_id
  const orgId = paymentIntent.metadata.org_id

  if (!invoiceId || !orgId) {
    console.error('Missing invoice_id or org_id in payment intent metadata')
    return
  }

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Create failed payment record
  await supabase.from('payments').insert({
    org_id: orgId,
    invoice_id: invoiceId,
    stripe_payment_intent: paymentIntent.id,
    amount: paymentIntent.amount / 100,
    currency: paymentIntent.currency,
    status: 'failed',
    method: paymentIntent.payment_method_types[0] || 'card',
  })

  console.log(`Payment failed for invoice ${invoiceId}`)
}

async function handleAccountUpdated(account: Stripe.Account) {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  console.log(`[Stripe Webhook] Processing account.updated for account: ${account.id}`)

  // Find user with this Stripe Connect account
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('id, display_name')
    .eq('stripe_connect_id', account.id)
    .single()

  if (fetchError || !user) {
    console.error(`[Stripe Webhook] User not found for account ${account.id}:`, fetchError)
    return
  }

  // Determine onboarding status based on Stripe account capabilities
  let onboardingStatus = 'pending'
  if (account.charges_enabled && account.payouts_enabled) {
    onboardingStatus = 'complete'
  } else if (account.details_submitted) {
    onboardingStatus = 'incomplete'
  }

  // Get account balance
  let balance = 0
  try {
    const { stripe } = await import('@/lib/stripe/server')
    const stripeBalance = await stripe.balance.retrieve({
      stripeAccount: account.id,
    })

    // Sum available balance (in cents, convert to dollars)
    balance = stripeBalance.available.reduce(
      (sum, bal) => sum + bal.amount,
      0
    ) / 100
  } catch (error: any) {
    console.error(`[Stripe Webhook] Error fetching balance for ${account.id}:`, error.message)
  }

  // Update user record with all merchant management fields
  const { error: updateError } = await supabase
    .from('users')
    .update({
      stripe_onboarding_complete: account.details_submitted || false,
      onboarding_status: onboardingStatus,
      payouts_enabled: account.payouts_enabled || false,
      stripe_balance: balance,
    })
    .eq('stripe_connect_id', account.id)

  if (updateError) {
    console.error(`[Stripe Webhook] Error updating user ${user.id}:`, updateError)
    throw updateError
  }

  console.log(`[Stripe Webhook] ✅ Updated user ${user.display_name} (${user.id}):`, {
    onboarding_complete: account.details_submitted,
    onboarding_status: onboardingStatus,
    charges_enabled: account.charges_enabled,
    payouts_enabled: account.payouts_enabled || false,
    stripe_balance: balance,
  })

  // Log to audit trail (system action)
  await supabase
    .from('admin_audit_log')
    .insert({
      admin_user_id: user.id, // Use merchant's own ID for system actions
      action: 'stripe_account_synced',
      target_type: 'merchant',
      target_id: user.id,
      metadata: {
        stripe_account_id: account.id,
        onboarding_status: onboardingStatus,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        balance: balance,
        triggered_by: 'stripe_webhook',
      },
    })
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const orgId = subscription.metadata.org_id
  if (!orgId) {
    console.error('Missing org_id in subscription metadata')
    return
  }

  // Determine plan from subscription
  const priceId = subscription.items.data[0]?.price.id
  let plan = 'free'
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
    plan = 'pro'
  } else if (priceId === process.env.STRIPE_AGENCY_PRICE_ID) {
    plan = 'agency'
  }

  // Update organization
  const subData = subscription as any
  const { error } = await supabase
    .from('organizations')
    .update({
      subscription_plan: plan,
      subscription_status: subscription.status,
      stripe_subscription_id: subscription.id,
      subscription_current_period_start: subData.current_period_start
        ? new Date(subData.current_period_start * 1000).toISOString()
        : null,
      subscription_current_period_end: subData.current_period_end
        ? new Date(subData.current_period_end * 1000).toISOString()
        : null,
    })
    .eq('id', orgId)

  if (error) {
    console.error('Error updating subscription:', error)
    throw error
  }

  console.log(`Subscription updated for org ${orgId}: ${plan}`)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const orgId = subscription.metadata.org_id
  if (!orgId) {
    console.error('Missing org_id in subscription metadata')
    return
  }

  // Downgrade to free plan
  const { error } = await supabase
    .from('organizations')
    .update({
      subscription_plan: 'free',
      subscription_status: 'canceled',
      stripe_subscription_id: null,
      subscription_current_period_start: null,
      subscription_current_period_end: null,
    })
    .eq('id', orgId)

  if (error) {
    console.error('Error canceling subscription:', error)
    throw error
  }

  console.log(`Subscription canceled for org ${orgId}`)
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const orgId = session.metadata?.org_id
  const plan = session.metadata?.plan

  if (!orgId || !plan) {
    console.error('Missing org_id or plan in checkout session metadata')
    return
  }

  // The subscription will be updated by the subscription.created webhook
  // This is just for logging
  console.log(`Checkout completed for org ${orgId}: ${plan}`)
}
