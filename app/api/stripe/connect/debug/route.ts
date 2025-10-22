import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

// THIS ENDPOINT ONLY WORKS IN DEVELOPMENT MODE
export async function GET(request: Request) {
  // Block in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode' },
      { status: 403 }
    )
  }

  // Also check if using live Stripe keys
  const stripeKey = process.env.STRIPE_SECRET_KEY || ''
  if (!stripeKey.includes('_test_')) {
    return NextResponse.json(
      { error: 'This endpoint only works with test Stripe keys' },
      { status: 403 }
    )
  }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's profile
    const { data: profile } = await supabase
      .from('users')
      .select('id, org_id, stripe_connect_id')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Get organization details
    const { data: organization } = await supabase
      .from('organizations')
      .select('id, name')
      .eq('id', profile.org_id)
      .single()

    // List all connected accounts from Stripe
    const accounts = await stripe.accounts.list({ limit: 10 })

    // Find any accounts that match this user
    const matchingAccounts = accounts.data.filter(
      (acc) => acc.metadata?.user_id === user.id || acc.metadata?.org_id === profile.org_id
    )

    return NextResponse.json({
      user_id: user.id,
      user_email: user.email,
      org_id: profile.org_id,
      org_name: organization?.name,
      stripe_connect_id_in_db: profile.stripe_connect_id,
      matching_stripe_accounts: matchingAccounts.map((acc) => ({
        id: acc.id,
        email: acc.email,
        charges_enabled: acc.charges_enabled,
        payouts_enabled: acc.payouts_enabled,
        details_submitted: acc.details_submitted,
        metadata: acc.metadata,
      })),
      all_stripe_accounts: accounts.data.map((acc) => ({
        id: acc.id,
        email: acc.email,
        metadata: acc.metadata,
      })),
    })
  } catch (error: any) {
    console.error('Debug error:', error)
    return NextResponse.json(
      { error: error.message || 'Debug failed' },
      { status: 500 }
    )
  }
}
