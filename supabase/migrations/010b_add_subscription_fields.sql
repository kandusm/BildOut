-- Add subscription-related fields to organizations table

ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS subscription_plan text DEFAULT 'free' CHECK (subscription_plan IN ('free', 'pro', 'agency')),
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'active' CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing')),
ADD COLUMN IF NOT EXISTS stripe_customer_id text UNIQUE,
ADD COLUMN IF NOT EXISTS stripe_subscription_id text UNIQUE,
ADD COLUMN IF NOT EXISTS subscription_current_period_start timestamp with time zone,
ADD COLUMN IF NOT EXISTS subscription_current_period_end timestamp with time zone,
ADD COLUMN IF NOT EXISTS trial_ends_at timestamp with time zone;

-- Create index for faster subscription queries
CREATE INDEX IF NOT EXISTS idx_organizations_subscription_plan ON organizations(subscription_plan);
CREATE INDEX IF NOT EXISTS idx_organizations_stripe_customer_id ON organizations(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_organizations_stripe_subscription_id ON organizations(stripe_subscription_id);

-- Add comment
COMMENT ON COLUMN organizations.subscription_plan IS 'Current subscription tier: free, pro, or agency';
COMMENT ON COLUMN organizations.subscription_status IS 'Subscription status from Stripe';
COMMENT ON COLUMN organizations.stripe_customer_id IS 'Stripe Customer ID for billing';
COMMENT ON COLUMN organizations.stripe_subscription_id IS 'Stripe Subscription ID';
