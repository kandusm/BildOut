import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Admin authentication helper
 * Checks if the current user has admin privileges
 * Returns the user profile if admin, redirects to dashboard if not
 */
export async function requireAdmin() {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('id, display_name, is_admin, org_id, organizations!users_org_id_fkey(*)')
    .eq('id', user.id)
    .single()

  console.log('[requireAdmin] Profile query result:', { profile, error: profileError })

  if (profileError || !profile) {
    console.error('[requireAdmin] Error fetching user profile:', profileError)
    redirect('/dashboard')
  }

  console.log('[requireAdmin] Admin check:', {
    is_admin: profile.is_admin,
    type: typeof profile.is_admin,
    userId: user.id
  })

  // Verify admin status
  if (!profile.is_admin) {
    console.warn('[requireAdmin] Non-admin user attempted to access admin area', { userId: user.id })
    redirect('/dashboard')
  }

  console.log('[requireAdmin] ✅ Admin access granted')

  return {
    user,
    profile,
  }
}

/**
 * Check if current user is admin (non-redirecting version)
 * Returns true/false instead of redirecting
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  const { data: profile } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  return profile?.is_admin === true
}

/**
 * Get admin status for conditional UI rendering
 * Returns admin flag without throwing errors
 */
export async function getAdminStatus() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { isAdmin: false, user: null }
    }

    const { data: profile } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    return {
      isAdmin: profile?.is_admin === true,
      user,
    }
  } catch (error) {
    console.error('Error checking admin status:', error)
    return { isAdmin: false, user: null }
  }
}
