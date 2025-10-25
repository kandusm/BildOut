import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const formData = await request.formData()
    const plan = formData.get('plan') as string

    if (!plan || (plan !== 'pro' && plan !== 'agency')) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Get user's organization
    const { data: profile } = await supabase
      .from('users')
      .select('org_id, organizations!users_org_id_fkey(*)')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const organization = profile.organizations as any

    // Get or create Stripe customer
    let customerId = organization.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: {
          org_id: profile.org_id,
          user_id: user.id,
        },
      })

      customerId = customer.id

      // Save customer ID to organization
      await supabase
        .from('organizations')
        .update({ stripe_customer_id: customerId })
        .eq('id', profile.org_id)
    }

    // Get the price ID based on plan
    const priceId = plan === 'pro'
      ? process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID
      : process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID not configured' }, { status: 500 })
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/dashboard/settings/subscription?success=true`,
      cancel_url: `${request.nextUrl.origin}/dashboard/settings/subscription?canceled=true`,
      metadata: {
        org_id: profile.org_id,
        plan,
      },
    })

    // Redirect to Checkout
    return NextResponse.redirect(session.url!)
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
