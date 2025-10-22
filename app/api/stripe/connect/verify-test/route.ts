import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

// This endpoint is for TEST MODE ONLY - it bypasses verification requirements
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

    const accountId = profile.stripe_connect_id

    if (!accountId) {
      return NextResponse.json({ error: 'No Stripe account found. Please connect with Stripe first.' }, { status: 404 })
    }

    // Update the account with test data to bypass verification in test mode
    const account = await stripe.accounts.update(accountId, {
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

    // Add a test bank account (external account)
    await stripe.accounts.createExternalAccount(accountId, {
      external_account: {
        object: 'bank_account',
        country: 'US',
        currency: 'usd',
        account_holder_type: 'individual',
        routing_number: '110000000',
        account_number: '000123456789',
      },
    })

    // In test mode, you can also update capabilities
    await stripe.accounts.update(accountId, {
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    })

    // Check account status
    const updatedAccount = await stripe.accounts.retrieve(accountId)

    return NextResponse.json({
      success: true,
      account_id: accountId,
      charges_enabled: updatedAccount.charges_enabled,
      payouts_enabled: updatedAccount.payouts_enabled,
      details_submitted: updatedAccount.details_submitted,
      requirements: updatedAccount.requirements,
    })
  } catch (error: any) {
    console.error('Stripe test verification error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to verify test account' },
      { status: 500 }
    )
  }
}
