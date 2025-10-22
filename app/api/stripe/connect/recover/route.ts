import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

// This endpoint finds any Stripe accounts created during onboarding and saves them to the database
// THIS ENDPOINT ONLY WORKS IN DEVELOPMENT MODE
export async function POST(request: Request) {
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
      .select('org_id, stripe_connect_id')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Check if already connected
    if (profile.stripe_connect_id) {
      return NextResponse.json({
        success: true,
        message: 'Already connected',
        account_id: profile.stripe_connect_id
      })
    }

    // List all connected accounts from Stripe and find ones matching this user
    const accounts = await stripe.accounts.list({ limit: 100 })

    const matchingAccount = accounts.data.find(
      (acc) =>
        acc.metadata?.user_id === user.id ||
        acc.metadata?.org_id === profile.org_id ||
        acc.email === user.email
    )

    if (!matchingAccount) {
      return NextResponse.json({
        error: 'No Stripe account found. Please start the onboarding process first.'
      }, { status: 404 })
    }

    // Save the account ID to the database
    await supabase
      .from('users')
      .update({ stripe_connect_id: matchingAccount.id })
      .eq('id', user.id)

    // Now fill in the test data to bypass verification
    await stripe.accounts.update(matchingAccount.id, {
      business_type: 'individual',
      individual: {
        first_name: 'Test',
        last_name: 'Merchant',
        email: user.email,
        phone: '+10000000000',
        dob: {
          day: 1,
          month: 1,
          year: 1990,
        },
        address: {
          line1: '123 Test St',
          city: 'Test City',
          state: 'CA',
          postal_code: '12345',
          country: 'US',
        },
        ssn_last_4: '0000',
      },
      business_profile: {
        mcc: '5734',
        url: 'https://example.com',
      },
      settings: {
        payments: {
          statement_descriptor: 'TEST',
        },
      },
      tos_acceptance: {
        date: Math.floor(Date.now() / 1000),
        ip: '127.0.0.1',
      },
    })

    // Add a test bank account (external account) if not already present
    const existingExternalAccounts = await stripe.accounts.listExternalAccounts(
      matchingAccount.id,
      { object: 'bank_account', limit: 1 }
    )

    if (existingExternalAccounts.data.length === 0) {
      await stripe.accounts.createExternalAccount(matchingAccount.id, {
        external_account: {
          object: 'bank_account',
          country: 'US',
          currency: 'usd',
          account_holder_type: 'individual',
          routing_number: '110000000',
          account_number: '000123456789',
        },
      })
    }

    // Check the updated account status
    const updatedAccount = await stripe.accounts.retrieve(matchingAccount.id)

    // Update onboarding status if complete
    if (updatedAccount.details_submitted) {
      await supabase
        .from('users')
        .update({ stripe_onboarding_complete: true })
        .eq('id', user.id)
    }

    return NextResponse.json({
      success: true,
      account_id: matchingAccount.id,
      charges_enabled: updatedAccount.charges_enabled,
      payouts_enabled: updatedAccount.payouts_enabled,
      details_submitted: updatedAccount.details_submitted,
      requirements: updatedAccount.requirements,
      message: 'Account recovered and updated successfully!'
    })
  } catch (error: any) {
    console.error('Stripe account recovery error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to recover account' },
      { status: 500 }
    )
  }
}
