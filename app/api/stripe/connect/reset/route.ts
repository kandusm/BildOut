import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

// Delete the current Stripe account and create a new Custom account for testing
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

    // Delete old account if it exists
    if (profile.stripe_connect_id) {
      try {
        await stripe.accounts.del(profile.stripe_connect_id)
      } catch (error) {
        console.log('Could not delete old account:', error)
      }
    }

    // Create a new Custom account (which we can fully control)
    const account = await stripe.accounts.create({
      type: 'custom',
      country: 'US',
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
      metadata: {
        org_id: profile.org_id,
        user_id: user.id,
      },
    })

    // Save to database
    await supabase
      .from('users')
      .update({
        stripe_connect_id: account.id,
        stripe_onboarding_complete: false,
      })
      .eq('id', user.id)

    // Now fill in all required fields for Standard account
    await stripe.accounts.update(account.id, {
      business_type: 'individual',
      individual: {
        first_name: 'Jenny',
        last_name: 'Rosen',
        email: user.email,
        phone: '+18888675309',
        ssn_last_4: '0000',
        dob: {
          day: 1,
          month: 1,
          year: 1901,
        },
        address: {
          line1: 'address_full_match',
          city: 'Schenectady',
          state: 'NY',
          postal_code: '12345',
          country: 'US',
        },
      },
      business_profile: {
        mcc: '5734',
        url: 'https://bestcookieco.com',
      },
      tos_acceptance: {
        date: Math.floor(Date.now() / 1000),
        ip: '8.8.8.8',
      },
    })

    // Add external account (bank account)
    await stripe.accounts.createExternalAccount(account.id, {
      external_account: {
        object: 'bank_account',
        country: 'US',
        currency: 'usd',
        account_holder_name: 'Jenny Rosen',
        account_holder_type: 'individual',
        routing_number: '110000000',
        account_number: '000123456789',
      },
    })

    // Enable capabilities
    await stripe.accounts.update(account.id, {
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    })

    // Get final account status
    const finalAccount = await stripe.accounts.retrieve(account.id)

    // Update database
    await supabase
      .from('users')
      .update({
        stripe_onboarding_complete: finalAccount.details_submitted || false,
      })
      .eq('id', user.id)

    return NextResponse.json({
      success: true,
      message: 'Created new Standard test account',
      account_id: finalAccount.id,
      type: finalAccount.type,
      charges_enabled: finalAccount.charges_enabled,
      payouts_enabled: finalAccount.payouts_enabled,
      details_submitted: finalAccount.details_submitted,
      requirements: finalAccount.requirements,
    })
  } catch (error: any) {
    console.error('Reset account error:', error)
    return NextResponse.json(
      {
        error: error.message || 'Failed to reset account',
        details: error.raw?.message || error.message,
      },
      { status: 500 }
    )
  }
}
