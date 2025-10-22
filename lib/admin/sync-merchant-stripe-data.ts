import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

/**
 * Sync merchant Stripe data from Stripe API to local database
 * Updates onboarding status, payout status, and account balance
 */
export async function syncMerchantStripeData(userId: string) {
  const supabase = await createClient()

  // Get user's Stripe Connect ID
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('stripe_connect_id')
    .eq('id', userId)
    .single()

  if (userError || !user?.stripe_connect_id) {
    throw new Error('No Stripe Connect account found for this user')
  }

  try {
    // Retrieve account from Stripe
    const account = await stripe.accounts.retrieve(user.stripe_connect_id)

    // Retrieve balance
    const balance = await stripe.balance.retrieve({
      stripeAccount: user.stripe_connect_id,
    })

    // Calculate total available balance (in dollars)
    const totalAvailableBalance = balance.available.reduce((sum, b) => sum + b.amount, 0) / 100

    // Determine onboarding status
    let onboardingStatus = 'pending'
    if (account.details_submitted && account.charges_enabled && account.payouts_enabled) {
      onboardingStatus = 'complete'
    } else if (account.details_submitted) {
      onboardingStatus = 'incomplete'
    }

    // Update local database with service role client (bypasses RLS)
    const { error: updateError } = await supabase
      .from('users')
      .update({
        onboarding_status: onboardingStatus,
        payouts_enabled: account.payouts_enabled || false,
        stripe_balance: totalAvailableBalance,
      })
      .eq('id', userId)

    if (updateError) {
      console.error('Error updating user Stripe data:', updateError)
      throw updateError
    }

    return {
      account,
      balance: totalAvailableBalance,
      onboardingStatus,
      payoutsEnabled: account.payouts_enabled,
    }
  } catch (error) {
    console.error('Error syncing Stripe data:', error)
    throw error
  }
}

/**
 * Sync all merchants' Stripe data
 * Useful for batch updates or cron jobs
 */
export async function syncAllMerchantsStripeData() {
  const supabase = await createClient()

  // Get all users with Stripe Connect accounts
  const { data: users, error } = await supabase
    .from('users')
    .select('id, stripe_connect_id')
    .not('stripe_connect_id', 'is', null)

  if (error || !users) {
    throw new Error('Error fetching users with Stripe accounts')
  }

  const results = []
  for (const user of users) {
    try {
      const result = await syncMerchantStripeData(user.id)
      results.push({ userId: user.id, success: true, result })
    } catch (error) {
      results.push({ userId: user.id, success: false, error })
    }
  }

  return results
}

/**
 * Get merchant financial summary from Stripe
 * Includes total charges, refunds, and net volume
 */
export async function getMerchantFinancialSummary(stripeConnectId: string) {
  try {
    // Get total charges for this account
    const charges = await stripe.charges.list(
      { limit: 100 },
      { stripeAccount: stripeConnectId }
    )

    const totalCharges = charges.data.reduce((sum, charge) => sum + charge.amount, 0) / 100
    const totalRefunded = charges.data.reduce((sum, charge) => sum + charge.amount_refunded, 0) / 100
    const netVolume = totalCharges - totalRefunded

    return {
      totalCharges,
      totalRefunded,
      netVolume,
      chargeCount: charges.data.length,
    }
  } catch (error) {
    console.error('Error fetching merchant financial summary:', error)
    throw error
  }
}
