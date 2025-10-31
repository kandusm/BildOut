import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/server'
import { NextRequest, NextResponse } from 'next/server'

// Delete a Stripe Connect account (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: adminUser } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!adminUser?.is_admin) {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 })
    }

    // Get account ID from request
    const { accountId } = await request.json()

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID required' }, { status: 400 })
    }

    console.log('Admin deleting Stripe account:', accountId)

    // Delete the account from Stripe
    const deletedAccount = await stripe.accounts.del(accountId)

    console.log('Stripe account deleted:', deletedAccount)

    return NextResponse.json({
      success: true,
      deleted: deletedAccount.deleted,
      id: deletedAccount.id,
      message: `Stripe account ${accountId} deleted successfully`,
    })
  } catch (error: any) {
    console.error('Error deleting Stripe account:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete account' },
      { status: 500 }
    )
  }
}

// List all Stripe Connect accounts (admin only)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: adminUser } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!adminUser?.is_admin) {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 })
    }

    // List all connected accounts
    const accounts = await stripe.accounts.list({
      limit: 100,
    })

    const accountList = accounts.data.map(account => ({
      id: account.id,
      email: account.email,
      type: account.type,
      created: new Date(account.created * 1000).toISOString(),
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      details_submitted: account.details_submitted,
    }))

    return NextResponse.json({
      accounts: accountList,
      count: accountList.length,
    })
  } catch (error: any) {
    console.error('Error listing Stripe accounts:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to list accounts' },
      { status: 500 }
    )
  }
}
