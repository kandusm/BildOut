import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function GET() {
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

    const accountId = profile.stripe_connect_id

    if (!accountId) {
      return NextResponse.json({
        connected: false,
        charges_enabled: false,
        details_submitted: false,
      })
    }

    // Get Stripe account details
    const account = await stripe.accounts.retrieve(accountId)

    return NextResponse.json({
      connected: true,
      charges_enabled: account.charges_enabled,
      details_submitted: account.details_submitted,
      payouts_enabled: account.payouts_enabled,
      requirements: account.requirements,
    })
  } catch (error: any) {
    console.error('Stripe Connect status error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get account status' },
      { status: 500 }
    )
  }
}
