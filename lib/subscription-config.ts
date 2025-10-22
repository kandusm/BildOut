// Subscription tiers and feature configuration

export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  PRO: 'pro',
  AGENCY: 'agency',
} as const

export type SubscriptionPlan = typeof SUBSCRIPTION_PLANS[keyof typeof SUBSCRIPTION_PLANS]

export interface PlanFeatures {
  name: string
  price: number // monthly price in USD
  stripePriceId?: string // Stripe Price ID (to be added after creating in Stripe)
  features: {
    invoiceLimit: number | null // null = unlimited
    clientLimit: number | null // null = unlimited
    customBranding: boolean
    emailReminders: boolean
    analytics: boolean
    exportData: boolean
    prioritySupport: boolean
    teamMembers: number
    apiAccess: boolean
  }
  description: string
}

export const PLANS: Record<SubscriptionPlan, PlanFeatures> = {
  [SUBSCRIPTION_PLANS.FREE]: {
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started',
    features: {
      invoiceLimit: 10, // 10 invoices per month
      clientLimit: 5, // 5 clients
      customBranding: false,
      emailReminders: false,
      analytics: false,
      exportData: false,
      prioritySupport: false,
      teamMembers: 1,
      apiAccess: false,
    },
  },
  [SUBSCRIPTION_PLANS.PRO]: {
    name: 'Pro',
    price: 15,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID, // To be set
    description: 'For growing businesses',
    features: {
      invoiceLimit: null, // Unlimited
      clientLimit: null, // Unlimited
      customBranding: true,
      emailReminders: true,
      analytics: true,
      exportData: true,
      prioritySupport: false,
      teamMembers: 3,
      apiAccess: false,
    },
  },
  [SUBSCRIPTION_PLANS.AGENCY]: {
    name: 'Agency',
    price: 49,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID, // To be set
    description: 'For agencies and teams',
    features: {
      invoiceLimit: null, // Unlimited
      clientLimit: null, // Unlimited
      customBranding: true,
      emailReminders: true,
      analytics: true,
      exportData: true,
      prioritySupport: true,
      teamMembers: null, // Unlimited
      apiAccess: true,
    },
  },
}

// Helper function to check if user can access a feature
export function canAccessFeature(
  plan: SubscriptionPlan,
  feature: keyof PlanFeatures['features']
): boolean {
  return PLANS[plan].features[feature] === true || PLANS[plan].features[feature] === null
}

// Helper function to get feature limit
export function getFeatureLimit(
  plan: SubscriptionPlan,
  feature: 'invoiceLimit' | 'clientLimit' | 'teamMembers'
): number | null {
  return PLANS[plan].features[feature]
}

// Helper function to check if user has reached limit
export function hasReachedLimit(
  plan: SubscriptionPlan,
  feature: 'invoiceLimit' | 'clientLimit' | 'teamMembers',
  currentCount: number
): boolean {
  const limit = getFeatureLimit(plan, feature)
  if (limit === null) return false // Unlimited
  return currentCount >= limit
}
