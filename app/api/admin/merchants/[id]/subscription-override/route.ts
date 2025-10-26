import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Set subscription override
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get request body
    const body = await request.json()
    const { plan, expiresAt, reason } = body

    // Validate plan
    if (!plan || !['free', 'pro', 'agency'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be free, pro, or agency' },
        { status: 400 }
      )
    }

    // Validate expiration date if provided
    if (expiresAt && new Date(expiresAt) <= new Date()) {
      return NextResponse.json(
        { error: 'Expiration date must be in the future' },
        { status: 400 }
      )
    }

    // Validate reason
    if (!reason || reason.trim().length === 0) {
      return NextResponse.json(
        { error: 'Reason is required' },
        { status: 400 }
      )
    }

    // Get user's org_id (id parameter is the user ID from /admin/merchants/[id])
    const { data: merchantUser, error: userError } = await supabase
      .from('users')
      .select('org_id')
      .eq('id', id)
      .single()

    if (userError || !merchantUser) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      )
    }

    // Check if organization exists
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, subscription_plan')
      .eq('id', merchantUser.org_id)
      .single()

    if (orgError || !org) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Set subscription override
    const { data: updatedOrg, error: updateError } = await supabase
      .from('organizations')
      .update({
        subscription_override_plan: plan,
        subscription_override_expires_at: expiresAt || null,
        subscription_override_reason: reason.trim(),
        subscription_override_granted_by: user.id,
        subscription_override_granted_at: new Date().toISOString(),
      })
      .eq('id', merchantUser.org_id)
      .select('*')
      .single()

    if (updateError) {
      console.error('Error setting subscription override:', updateError)
      return NextResponse.json(
        { error: 'Failed to set subscription override' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      organization: updatedOrg,
      message: expiresAt
        ? `Subscription override set to ${plan} until ${new Date(expiresAt).toLocaleDateString()}`
        : `Subscription override set to ${plan} (permanent)`,
    })
  } catch (error) {
    console.error('Error in subscription override:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Remove subscription override
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get user's org_id (id parameter is the user ID from /admin/merchants/[id])
    const { data: merchantUser, error: userError } = await supabase
      .from('users')
      .select('org_id')
      .eq('id', id)
      .single()

    if (userError || !merchantUser) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      )
    }

    // Check if organization exists
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id, name')
      .eq('id', merchantUser.org_id)
      .single()

    if (orgError || !org) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Remove subscription override
    const { data: updatedOrg, error: updateError } = await supabase
      .from('organizations')
      .update({
        subscription_override_plan: null,
        subscription_override_expires_at: null,
        subscription_override_reason: null,
        subscription_override_granted_by: null,
        subscription_override_granted_at: null,
      })
      .eq('id', merchantUser.org_id)
      .select('*')
      .single()

    if (updateError) {
      console.error('Error removing subscription override:', updateError)
      return NextResponse.json(
        { error: 'Failed to remove subscription override' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      organization: updatedOrg,
      message: 'Subscription override removed. Using Stripe subscription.',
    })
  } catch (error) {
    console.error('Error removing subscription override:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
