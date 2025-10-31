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

    // If we have a stored account ID, verify it still exists in Stripe
    if (accountId) {
      try {
        console.log('Verifying stored Stripe account:', accountId)
        await stripe.accounts.retrieve(accountId)
        console.log('Stored Stripe account is valid')
      } catch (error: any) {
        if (error.code === 'resource_missing') {
          console.log('Stored Stripe account no longer exists, clearing and searching by email')
          accountId = null

          // Clear the stale ID from database
          await supabase
            .from('users')
            .update({ stripe_connect_id: null })
            .eq('id', user.id)
        } else {
          throw error
        }
      }
    }

    // If no valid Stripe account exists, check if one exists in Stripe by email
    if (!accountId) {
      console.log('No valid stripe_connect_id, searching Stripe by email:', user.email)

      // Search for existing Stripe Connect accounts with this email
      const existingAccounts = await stripe.accounts.list({
        limit: 100,
      })

      const matchingAccount = existingAccounts.data.find(
        account => account.email?.toLowerCase() === user.email?.toLowerCase()
      )

      if (matchingAccount) {
        // Found existing account - reuse it
        console.log('Found existing Stripe account:', matchingAccount.id)
        accountId = matchingAccount.id

        // Update metadata to current org/user
        await stripe.accounts.update(matchingAccount.id, {
          metadata: {
            org_id: profile.org_id,
            user_id: user.id,
          },
        })

        // Save the Stripe account ID to the user profile
        await supabase
          .from('users')
          .update({ stripe_connect_id: accountId })
          .eq('id', user.id)

        console.log('Linked existing Stripe account to user profile')
      } else {
        // No existing account found - create new one
        console.log('No existing Stripe account found, creating new one')

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

        console.log('Created new Stripe account:', accountId)
      }
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
