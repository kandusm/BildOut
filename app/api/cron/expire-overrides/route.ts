import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Cron job to expire temporary subscription overrides
 * Should be called daily via Vercel Cron or similar
 */
export async function GET(request: Request) {
  try {
    // Verify the request is from a cron job (check authorization header)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // Find all organizations with expired overrides
    const { data: expiredOrgs, error: findError } = await supabase
      .from('organizations')
      .select('id, name, subscription_override_plan, subscription_override_expires_at')
      .not('subscription_override_plan', 'is', null)
      .not('subscription_override_expires_at', 'is', null)
      .lte('subscription_override_expires_at', new Date().toISOString())

    if (findError) {
      console.error('Error finding expired overrides:', findError)
      return NextResponse.json(
        { error: 'Failed to find expired overrides' },
        { status: 500 }
      )
    }

    if (!expiredOrgs || expiredOrgs.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No expired overrides found',
        expired: 0,
      })
    }

    // Clear the overrides for all expired organizations
    const { data: updated, error: updateError } = await supabase
      .from('organizations')
      .update({
        subscription_override_plan: null,
        subscription_override_expires_at: null,
        subscription_override_reason: null,
        subscription_override_granted_by: null,
        subscription_override_granted_at: null,
      })
      .in('id', expiredOrgs.map(org => org.id))
      .select('id, name')

    if (updateError) {
      console.error('Error clearing expired overrides:', updateError)
      return NextResponse.json(
        { error: 'Failed to clear expired overrides' },
        { status: 500 }
      )
    }

    console.log(`Expired ${expiredOrgs.length} subscription overrides:`, expiredOrgs.map(o => o.name))

    return NextResponse.json({
      success: true,
      message: `Expired ${expiredOrgs.length} subscription override(s)`,
      expired: expiredOrgs.length,
      organizations: updated,
    })
  } catch (error) {
    console.error('Error in expire-overrides cron:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
