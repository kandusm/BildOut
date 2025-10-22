import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      user_id,
      org_id,
      display_name,
      org_name,
      org_email,
      org_phone,
      org_address,
      default_tax_rate,
    } = body

    // Verify user is updating their own profile
    if (user.id !== user_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get user's profile to verify org ownership
    const { data: profile } = await supabase
      .from('users')
      .select('org_id')
      .eq('id', user.id)
      .single()

    if (!profile || profile.org_id !== org_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Update user profile
    const { error: userError } = await supabase
      .from('users')
      .update({
        display_name,
      })
      .eq('id', user_id)

    if (userError) {
      console.error('Error updating user:', userError)
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }

    // Update organization
    const { error: orgError } = await supabase
      .from('organizations')
      .update({
        name: org_name,
        email: org_email || null,
        phone: org_phone || null,
        address: org_address || null,
        default_tax_rate: default_tax_rate !== undefined ? default_tax_rate : null,
      })
      .eq('id', org_id)

    if (orgError) {
      console.error('Error updating organization:', orgError)
      return NextResponse.json({ error: 'Failed to update organization' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('General settings update error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update settings' },
      { status: 500 }
    )
  }
}
