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
    const customerId = formData.get('customer_id') as string

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID required' }, { status: 400 })
    }

    // Verify the customer belongs to this user's organization
    const { data: profile } = await supabase
      .from('users')
      .select('org_id, organizations!users_org_id_fkey(*)')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const organization = profile.organizations as any

    if (organization.stripe_customer_id !== customerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Create billing portal session
    console.log('Creating billing portal session:', {
      customer: customerId,
      return_url: `${request.nextUrl.origin}/dashboard/settings/subscription`,
    })

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${request.nextUrl.origin}/dashboard/settings/subscription`,
    })

    console.log('Billing portal session created:', {
      id: session.id,
      url: session.url,
    })

    // Redirect to billing portal (303 forces GET request)
    return NextResponse.redirect(session.url, 303)
  } catch (error: any) {
    console.error('Portal error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
