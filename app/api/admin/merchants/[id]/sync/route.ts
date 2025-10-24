import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/server'
import { requireAdmin } from '@/lib/admin/require-admin'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()

    const { id } = await params
    const supabase = await createClient()

    // Get user with stripe_connect_id
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, display_name, stripe_connect_id')
      .eq('id', id)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.stripe_connect_id) {
      return NextResponse.json({ error: 'User has no Stripe Connect account' }, { status: 400 })
    }

    // Fetch account from Stripe
    const account = await stripe.accounts.retrieve(user.stripe_connect_id)

    // Determine onboarding status
    let onboardingStatus = 'pending'
    if (account.charges_enabled && account.payouts_enabled) {
      onboardingStatus = 'complete'
    } else if (account.details_submitted) {
      onboardingStatus = 'incomplete'
    }

    // Get account balance
    let balance = 0
    try {
      const stripeBalance = await stripe.balance.retrieve({
        stripeAccount: account.id,
      })
      balance = stripeBalance.available.reduce(
        (sum, bal) => sum + bal.amount,
        0
      ) / 100
    } catch (error: any) {
      console.error(`Error fetching balance: ${error.message}`)
    }

    // Update user record
    const { error: updateError } = await supabase
      .from('users')
      .update({
        stripe_onboarding_complete: account.details_submitted || false,
        onboarding_status: onboardingStatus,
        payouts_enabled: account.payouts_enabled || false,
        stripe_balance: balance,
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({
        error: 'Failed to update user',
        details: updateError
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      merchant: user.display_name,
      status: {
        onboarding_status: onboardingStatus,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        balance: balance,
      }
    })
  } catch (error: any) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync merchant', details: error.message },
      { status: 500 }
    )
  }
}
