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

    const body = await request.json()
    const { accountId } = body

    if (!accountId || typeof accountId !== 'string') {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 })
    }

    if (!accountId.startsWith('acct_')) {
      return NextResponse.json({ error: 'Invalid account ID format' }, { status: 400 })
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

    // Check if user already has a connected account
    if (profile.stripe_connect_id) {
      return NextResponse.json(
        { error: 'You already have a Stripe account connected. Please disconnect it first.' },
        { status: 400 }
      )
    }

    // Verify the account exists in Stripe
    let account
    try {
      account = await stripe.accounts.retrieve(accountId)
    } catch (error: any) {
      if (error.code === 'resource_missing') {
        return NextResponse.json(
          { error: 'Stripe account not found. Please check the account ID.' },
          { status: 404 }
        )
      }
      throw error
    }

    // Verify account type (must be Express or Standard)
    if (account.type !== 'express' && account.type !== 'standard') {
      return NextResponse.json(
        { error: `Account type "${account.type}" is not supported. Only Express and Standard accounts can be linked.` },
        { status: 400 }
      )
    }

    // Update metadata to link this account to the user
    await stripe.accounts.update(accountId, {
      metadata: {
        ...account.metadata,
        org_id: profile.org_id,
        user_id: user.id,
        linked_at: new Date().toISOString(),
      },
    })

    // Save the account ID to the database
    const { error: updateError } = await supabase
      .from('users')
      .update({
        stripe_connect_id: accountId,
        stripe_onboarding_complete: account.details_submitted || false,
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Database update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to save account to database' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      account_id: account.id,
      email: account.email,
      type: account.type,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      details_submitted: account.details_submitted,
      requirements: account.requirements,
    })
  } catch (error: any) {
    console.error('Link existing account error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to link account' },
      { status: 500 }
    )
  }
}
