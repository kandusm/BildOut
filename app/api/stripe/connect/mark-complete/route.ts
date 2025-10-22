import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

// Mark onboarding as complete if Stripe account is properly set up
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
      .select('stripe_connect_id')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    if (!profile.stripe_connect_id) {
      return NextResponse.json({ error: 'No Stripe account connected' }, { status: 404 })
    }

    // Check the account status in Stripe
    const account = await stripe.accounts.retrieve(profile.stripe_connect_id)

    // Update the database with the current status
    await supabase
      .from('users')
      .update({
        stripe_onboarding_complete: account.details_submitted || account.charges_enabled
      })
      .eq('id', user.id)

    return NextResponse.json({
      success: true,
      account_id: account.id,
      details_submitted: account.details_submitted,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      onboarding_complete: account.details_submitted || account.charges_enabled,
    })
  } catch (error: any) {
    console.error('Mark complete error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update status' },
      { status: 500 }
    )
  }
}
