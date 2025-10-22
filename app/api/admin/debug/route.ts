import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/admin/debug
 * Debug endpoint to check admin status
 * Returns user info and admin flag
 */
export async function GET() {
  try {
    const supabase = await createClient()

    // Get current user from auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({
        authenticated: false,
        error: 'Not authenticated',
        authError: authError?.message,
      })
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, display_name, is_admin, org_id, stripe_connect_id')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
      profile: profile || null,
      profileError: profileError?.message || null,
      isAdmin: profile?.is_admin === true,
      message: profile?.is_admin
        ? '✅ You have admin access!'
        : '❌ You do not have admin access. Run the SQL UPDATE to set is_admin = true',
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || 'Internal server error',
    }, { status: 500 })
  }
}
