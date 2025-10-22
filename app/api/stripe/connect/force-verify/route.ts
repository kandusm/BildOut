import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

// Force verification by creating a complete test account profile
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
      .select('stripe_connect_id')
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_connect_id) {
      return NextResponse.json({ error: 'No Stripe account connected' }, { status: 404 })
    }

    const accountId = profile.stripe_connect_id

    try {
      // Step 1: Update individual information
      await stripe.accounts.update(accountId, {
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
      })

      // Step 2: Update business profile
      await stripe.accounts.update(accountId, {
        business_profile: {
          mcc: '5734',
          url: 'https://bestcookieco.com',
        },
      })

      // Step 3: Update settings
      await stripe.accounts.update(accountId, {
        settings: {
          payments: {
            statement_descriptor: 'MYSTORE',
          },
        },
      })

      // Step 4: Add TOS acceptance
      await stripe.accounts.update(accountId, {
        tos_acceptance: {
          date: Math.floor(Date.now() / 1000),
          ip: '8.8.8.8',
        },
      })

      // Step 5: Add bank account
      // First check if there's already a bank account
      const externalAccounts = await stripe.accounts.listExternalAccounts(
        accountId,
        { object: 'bank_account', limit: 10 }
      )

      // Delete existing bank accounts
      for (const account of externalAccounts.data) {
        await stripe.accounts.deleteExternalAccount(accountId, account.id)
      }

      // Add test bank account
      await stripe.accounts.createExternalAccount(accountId, {
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

      // Step 6: Get updated account status
      const updatedAccount = await stripe.accounts.retrieve(accountId)

      // Step 7: Update database
      await supabase
        .from('users')
        .update({
          stripe_onboarding_complete: updatedAccount.details_submitted || false,
        })
        .eq('id', user.id)

      return NextResponse.json({
        success: true,
        account_id: accountId,
        charges_enabled: updatedAccount.charges_enabled,
        payouts_enabled: updatedAccount.payouts_enabled,
        details_submitted: updatedAccount.details_submitted,
        requirements: updatedAccount.requirements,
      })
    } catch (stripeError: any) {
      console.error('Stripe update error:', stripeError)
      return NextResponse.json(
        {
          error: `Stripe error: ${stripeError.message}`,
          details: stripeError.raw?.message || stripeError.message
        },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Force verify error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to verify account' },
      { status: 500 }
    )
  }
}
