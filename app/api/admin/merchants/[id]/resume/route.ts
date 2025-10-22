import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin/require-admin'

/**
 * POST /api/admin/merchants/:id/resume
 * Resume a suspended merchant account
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

    if (merchant.org_id) {
      // Update organization metadata to remove suspension
      const { error: updateError } = await supabase
        .from('organizations')
        .update({
          metadata: {
            suspended: false,
            resumed_at: new Date().toISOString(),
            resumed_by: adminUser.id,
          },
        })
        .eq('id', merchant.org_id)

      if (updateError) {
        console.error('Error resuming merchant:', updateError)
        return NextResponse.json(
          { error: 'Failed to resume merchant' },
          { status: 500 }
        )
      }
    }

    // Log the action in audit log
    await supabase
      .from('admin_audit_log')
      .insert({
        admin_user_id: adminUser.id,
        action: 'resume_merchant',
        target_type: 'merchant',
        target_id: merchantId,
        metadata: {
          merchant_name: merchant.display_name,
        },
      })

    return NextResponse.json({
      success: true,
      message: 'Merchant resumed successfully',
      merchant: {
        id: merchant.id,
        name: merchant.display_name,
        suspended: false,
      },
    })
  } catch (error: any) {
    console.error('Error resuming merchant:', error)

    // If requireAdmin threw a redirect, let it pass through
    if (error?.message?.includes('NEXT_REDIRECT')) {
      throw error
    }

    return NextResponse.json(
      { error: error.message || 'Failed to resume merchant' },
      { status: 500 }
    )
  }
}
