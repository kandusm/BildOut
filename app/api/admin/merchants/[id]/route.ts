import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin/require-admin'
import { syncMerchantStripeData, getMerchantFinancialSummary } from '@/lib/admin/sync-merchant-stripe-data'

/**
 * GET /api/admin/merchants/:id
 * Get detailed merchant information including Stripe data
 * Admin only
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin access
    await requireAdmin()

    const merchantId = params.id
    const supabase = await createClient()

    // Get merchant details
    const { data: merchant, error: merchantError } = await supabase
      .from('users')
      .select(`
        id,
        display_name,
        stripe_connect_id,
        onboarding_status,
        payouts_enabled,
        stripe_balance,
        stripe_onboarding_complete,
        created_at,
        updated_at,
        org_id,
        organizations (
          id,
          name,
          invoice_prefix,
          invoice_number_sequence,
          metadata,
          created_at,
          updated_at
        )
      `)
      .eq('id', merchantId)
      .single()

    if (merchantError || !merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      )
    }

    // Get merchant's invoices summary
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('id, number, status, total, amount_paid, created_at')
      .eq('org_id', merchant.org_id)
      .order('created_at', { ascending: false })
      .limit(10)

    // Get merchant's payments summary
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('id, amount, status, created_at, invoices(number)')
      .eq('org_id', merchant.org_id)
      .order('created_at', { ascending: false })
      .limit(10)

    // Get invoice statistics
    const { data: stats } = await supabase
      .from('invoices')
      .select('status, total, amount_paid')
      .eq('org_id', merchant.org_id)

    // Calculate statistics
    const invoiceStats = {
      total: stats?.length || 0,
      draft: stats?.filter(s => s.status === 'draft').length || 0,
      sent: stats?.filter(s => s.status === 'sent').length || 0,
      paid: stats?.filter(s => s.status === 'paid').length || 0,
      overdue: stats?.filter(s => s.status === 'overdue').length || 0,
      totalVolume: stats?.reduce((sum, s) => sum + (parseFloat(s.total as any) || 0), 0) || 0,
      paidVolume: stats?.reduce((sum, s) => sum + (parseFloat(s.amount_paid as any) || 0), 0) || 0,
    }

    // Try to sync latest Stripe data if they have a Connect account
    let stripeData = null
    if (merchant.stripe_connect_id) {
      try {
        stripeData = await syncMerchantStripeData(merchantId)

        // Get financial summary
        const financialSummary = await getMerchantFinancialSummary(merchant.stripe_connect_id)
        stripeData.financialSummary = financialSummary
      } catch (error) {
        console.error('Error syncing Stripe data:', error)
        // Continue without Stripe data rather than failing the request
      }
    }

    return NextResponse.json({
      merchant,
      invoices: invoices || [],
      payments: payments || [],
      stats: invoiceStats,
      stripeData,
    })
  } catch (error: any) {
    console.error('Error in GET /api/admin/merchants/:id:', error)

    // If requireAdmin threw a redirect, let it pass through
    if (error?.message?.includes('NEXT_REDIRECT')) {
      throw error
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
