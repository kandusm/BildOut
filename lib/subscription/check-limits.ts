import { createClient } from '@/lib/supabase/server'
import { hasReachedLimit, getFeatureLimit, canAccessFeature, type SubscriptionPlan } from '@/lib/subscription-config'
import { getEffectiveSubscriptionPlan } from '@/lib/subscription/get-effective-plan'

/**
 * Check if organization has reached invoice limit for their plan
 * Returns { allowed: boolean, limit: number | null, current: number, plan: string }
 */
export async function checkInvoiceLimit(orgId: string) {
  const supabase = await createClient()

  // Get organization's subscription plan (including override fields)
  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .single()

  const plan = getEffectiveSubscriptionPlan(org) as SubscriptionPlan

  // Get current invoice count for this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { count: currentCount } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .gte('created_at', startOfMonth.toISOString())

  const limit = getFeatureLimit(plan, 'invoiceLimit')
  const reachedLimit = hasReachedLimit(plan, 'invoiceLimit', currentCount || 0)

  console.log('Invoice limit check:', {
    orgId,
    plan,
    limit,
    currentCount,
    reachedLimit,
    startOfMonth: startOfMonth.toISOString(),
  })

  return {
    allowed: !reachedLimit,
    limit,
    current: currentCount || 0,
    plan,
  }
}

/**
 * Check if organization has reached client limit for their plan
 * Returns { allowed: boolean, limit: number | null, current: number, plan: string }
 */
export async function checkClientLimit(orgId: string) {
  const supabase = await createClient()

  // Get organization's subscription plan (including override fields)
  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .single()

  const plan = getEffectiveSubscriptionPlan(org) as SubscriptionPlan

  // Get current client count
  const { count: currentCount } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .is('deleted_at', null)

  const limit = getFeatureLimit(plan, 'clientLimit')
  const reachedLimit = hasReachedLimit(plan, 'clientLimit', currentCount || 0)

  return {
    allowed: !reachedLimit,
    limit,
    current: currentCount || 0,
    plan,
  }
}

/**
 * Check if organization can access a specific feature
 */
export async function checkFeatureAccess(
  orgId: string,
  feature: 'customBranding' | 'emailReminders' | 'analytics' | 'exportData' | 'prioritySupport' | 'apiAccess'
) {
  const supabase = await createClient()

  // Get organization's subscription plan (including override fields)
  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .single()

  const plan = getEffectiveSubscriptionPlan(org) as SubscriptionPlan

  return {
    allowed: canAccessFeature(plan, feature),
    plan,
  }
}
