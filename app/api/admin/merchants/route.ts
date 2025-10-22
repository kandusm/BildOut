import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin/require-admin'

/**
 * GET /api/admin/merchants
 * List all merchants with their Stripe Connect status
 * Admin only
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    await requireAdmin()

    const supabase = await createClient()

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') // Filter by onboarding_status
    const search = searchParams.get('search') // Search by name or email
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query - show all users (merchants), including those without Stripe Connect
    let query = supabase
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
        org_id,
        organizations (
          id,
          name,
          invoice_prefix,
          metadata
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (status) {
      query = query.eq('onboarding_status', status)
    }

    if (search) {
      query = query.or(`display_name.ilike.%${search}%`)
    }

    const { data: merchants, error, count } = await query

    if (error) {
      console.error('Error fetching merchants:', error)
      return NextResponse.json(
        { error: 'Failed to fetch merchants' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      merchants: merchants || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
    })
  } catch (error: any) {
    console.error('Error in GET /api/admin/merchants:', error)

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
