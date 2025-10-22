import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin/require-admin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

/**
 * POST /api/admin/merchants/:id/login-link
 * Generate a Stripe Express dashboard login link for a merchant
 * Admin only
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin access
    const { user: adminUser } = await requireAdmin()

    const { id: merchantId } = await params
    const supabase = await createClient()

    // Get merchant's Stripe Connect ID
    const { data: merchant, error } = await supabase
      .from('users')
      .select('stripe_connect_id, display_name')
      .eq('id', merchantId)
      .single()

    if (error || !merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      )
    }

    if (!merchant.stripe_connect_id) {
      return NextResponse.json(
        { error: 'Merchant has no Stripe Connect account' },
        { status: 400 }
      )
    }

    // Generate login link
    const loginLink = await stripe.accounts.createLoginLink(merchant.stripe_connect_id)

    // Log the action in audit log
    await supabase
      .from('admin_audit_log')
      .insert({
        admin_user_id: adminUser.id,
        action: 'generate_stripe_login_link',
        target_type: 'merchant',
        target_id: merchantId,
        metadata: {
          merchant_name: merchant.display_name,
          stripe_connect_id: merchant.stripe_connect_id,
        },
      })

    return NextResponse.json({
      url: loginLink.url,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // Links expire in 5 minutes
    })
  } catch (error: any) {
    console.error('Error generating Stripe login link:', error)

    // If requireAdmin threw a redirect, let it pass through
    if (error?.message?.includes('NEXT_REDIRECT')) {
      throw error
    }

    return NextResponse.json(
      { error: error.message || 'Failed to generate login link' },
      { status: 500 }
    )
  }
}
