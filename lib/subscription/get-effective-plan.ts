/**
 * Get the effective subscription plan for an organization
 * Considers both Stripe subscription and manual admin overrides
 */

interface OrganizationData {
  subscription_plan?: string | null
  subscription_override_plan?: string | null
  subscription_override_expires_at?: string | null
}

export function getEffectiveSubscriptionPlan(
  org: OrganizationData | null | undefined
): 'free' | 'pro' | 'agency' {
  if (!org) {
    return 'free'
  }

  // Check if there's an active override
  if (org.subscription_override_plan) {
    // Check if override has expired
    if (org.subscription_override_expires_at) {
      const expiresAt = new Date(org.subscription_override_expires_at)
      const now = new Date()

      // If override is expired, use Stripe subscription
      if (expiresAt <= now) {
        return (org.subscription_plan as 'free' | 'pro' | 'agency') || 'free'
      }
    }

    // Override is active (not expired or permanent)
    return org.subscription_override_plan as 'free' | 'pro' | 'agency'
  }

  // No override, use Stripe subscription
  return (org.subscription_plan as 'free' | 'pro' | 'agency') || 'free'
}

/**
 * Check if a plan has access to a specific feature
 */
export function hasFeatureAccess(
  plan: 'free' | 'pro' | 'agency',
  feature: 'analytics' | 'export' | 'team' | 'api' | 'branding'
): boolean {
  const features: Record<'free' | 'pro' | 'agency', Array<'analytics' | 'export' | 'team' | 'api' | 'branding'>> = {
    free: [],
    pro: ['analytics', 'export', 'branding'],
    agency: ['analytics', 'export', 'branding', 'team', 'api'],
  }

  return features[plan].includes(feature)
}
