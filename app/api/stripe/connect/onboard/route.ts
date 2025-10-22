import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's profile
    const { data: profile } = await supabase
      .from('users')
      .select('org_id, stripe_connect_id')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    let accountId = profile.stripe_connect_id

    // If no Stripe account exists, create one
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
          us_bank_account_ach_payments: { requested: true },
        },
        business_type: 'individual',
        metadata: {
          org_id: profile.org_id,
          user_id: user.id,
        },
      })

      accountId = account.id

      // Save the Stripe account ID to the user profile
      await supabase
        .from('users')
        .update({ stripe_connect_id: accountId })
        .eq('id', user.id)
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?stripe_refresh=true`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?stripe_onboarding=complete`,
      type: 'account_onboarding',
    })

    return NextResponse.json({ url: accountLink.url })
  } catch (error: any) {
    console.error('Stripe Connect onboarding error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create onboarding link' },
      { status: 500 }
    )
  }
}
