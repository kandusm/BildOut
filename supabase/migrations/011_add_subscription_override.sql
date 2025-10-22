-- Add subscription override fields to organizations table
-- This allows admins to manually grant subscription access for promotions, resolutions, or owned companies

ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS subscription_override_plan TEXT CHECK (subscription_override_plan IN ('free', 'pro', 'agency')),
ADD COLUMN IF NOT EXISTS subscription_override_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subscription_override_reason TEXT,
ADD COLUMN IF NOT EXISTS subscription_override_granted_by UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS subscription_override_granted_at TIMESTAMPTZ DEFAULT NOW();

-- Add comment explaining the override system
COMMENT ON COLUMN organizations.subscription_override_plan IS 'Manual subscription override set by admin. Takes precedence over Stripe subscription.';
COMMENT ON COLUMN organizations.subscription_override_expires_at IS 'When the override expires. NULL means permanent override.';
COMMENT ON COLUMN organizations.subscription_override_reason IS 'Reason for override (promotion, resolution, owned company, etc.)';
COMMENT ON COLUMN organizations.subscription_override_granted_by IS 'Admin user who granted the override';
COMMENT ON COLUMN organizations.subscription_override_granted_at IS 'When the override was granted';

-- Create index for finding expired overrides (for cron job)
CREATE INDEX IF NOT EXISTS idx_organizations_override_expires
ON organizations(subscription_override_expires_at)
WHERE subscription_override_expires_at IS NOT NULL;

-- Add helper function to get effective subscription plan
-- This considers both Stripe subscription and manual overrides
CREATE OR REPLACE FUNCTION get_effective_subscription_plan(org_id UUID)
RETURNS TEXT AS $$
DECLARE
  org_record RECORD;
  effective_plan TEXT;
BEGIN
  SELECT
    subscription_plan,
    subscription_override_plan,
    subscription_override_expires_at
  INTO org_record
  FROM organizations
  WHERE id = org_id;

  -- If no override, return the Stripe subscription plan
  IF org_record.subscription_override_plan IS NULL THEN
    RETURN COALESCE(org_record.subscription_plan, 'free');
  END IF;

  -- If override exists and is not expired (or is permanent), use override
  IF org_record.subscription_override_expires_at IS NULL
     OR org_record.subscription_override_expires_at > NOW() THEN
    RETURN org_record.subscription_override_plan;
  END IF;

  -- Override has expired, return Stripe subscription
  RETURN COALESCE(org_record.subscription_plan, 'free');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment
COMMENT ON FUNCTION get_effective_subscription_plan IS 'Returns the effective subscription plan considering both Stripe subscription and manual overrides';
