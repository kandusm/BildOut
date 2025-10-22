import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin/require-admin'

/**
 * POST /api/admin/merchants/:id/suspend
 * Suspend a merchant account (soft disable)
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

    // Parse request body for optional reason
    const body = await request.json().catch(() => ({}))
    const { reason } = body

    // Check if merchant exists
    const { data: merchant, error: fetchError } = await supabase
      .from('users')
      .select('id, display_name, org_id')
      .eq('id', merchantId)
      .single()

    if (fetchError || !merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      )
    }

    // Note: In future, add a 'suspended' or 'account_status' field to users table
    // For now, we'll use the metadata field in organizations table
    if (merchant.org_id) {
      // Update organization metadata to mark as suspended
      const { error: updateError } = await supabase
        .from('organizations')
        .update({
          metadata: {
            suspended: true,
            suspended_at: new Date().toISOString(),
            suspended_by: adminUser.id,
            suspended_reason: reason || 'No reason provided',
          },
        })
        .eq('id', merchant.org_id)

      if (updateError) {
        console.error('Error suspending merchant:', updateError)
        return NextResponse.json(
          { error: 'Failed to suspend merchant' },
          { status: 500 }
        )
      }
    }

    // Log the action in audit log
    await supabase
      .from('admin_audit_log')
      .insert({
        admin_user_id: adminUser.id,
        action: 'suspend_merchant',
        target_type: 'merchant',
        target_id: merchantId,
        metadata: {
          merchant_name: merchant.display_name,
          reason: reason || 'No reason provided',
        },
      })

    return NextResponse.json({
      success: true,
      message: 'Merchant suspended successfully',
      merchant: {
        id: merchant.id,
        name: merchant.display_name,
        suspended: true,
      },
    })
  } catch (error: any) {
    console.error('Error suspending merchant:', error)

    // If requireAdmin threw a redirect, let it pass through
    if (error?.message?.includes('NEXT_REDIRECT')) {
      throw error
    }

    return NextResponse.json(
      { error: error.message || 'Failed to suspend merchant' },
      { status: 500 }
    )
  }
}
