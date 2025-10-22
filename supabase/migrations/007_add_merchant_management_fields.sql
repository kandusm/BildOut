-- Add merchant management fields to users table for platform admin capabilities
-- Migration: 007_add_merchant_management_fields

-- Add columns for merchant management
alter table public.users add column if not exists is_admin boolean default false;
alter table public.users add column if not exists onboarding_status text default 'pending';
alter table public.users add column if not exists payouts_enabled boolean default false;
alter table public.users add column if not exists stripe_balance numeric(12,2) default 0;

-- Add comments for documentation
comment on column public.users.is_admin is 'Admin flag for platform operators with access to merchant management';
comment on column public.users.onboarding_status is 'Stripe Connect onboarding status (pending/verified/complete)';
comment on column public.users.onboarding_status is 'Whether merchant can receive payouts from Stripe';
comment on column public.users.stripe_balance is 'Cached Stripe account balance for dashboard display (in dollars)';

-- Add index for admin queries (partial index for efficiency)
create index if not exists users_is_admin_idx on public.users (is_admin) where is_admin = true;

-- Add index for onboarding status filtering
create index if not exists users_onboarding_status_idx on public.users (onboarding_status);

-- Add constraint to validate onboarding_status values
alter table public.users add constraint users_onboarding_status_check
  check (onboarding_status in ('pending', 'incomplete', 'complete', 'verified'));

-- Update existing users to have 'pending' status if they have a Stripe Connect ID
update public.users
set onboarding_status = 'complete'
where stripe_connect_id is not null
  and stripe_onboarding_complete = true;

-- Create audit log table for admin actions
create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references public.users (id) on delete cascade,
  action text not null,
  target_type text not null, -- 'merchant', 'invoice', 'payment', etc.
  target_id uuid,
  metadata jsonb default '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

-- Add indexes for audit log queries
create index admin_audit_log_admin_user_id_idx on public.admin_audit_log (admin_user_id);
create index admin_audit_log_action_idx on public.admin_audit_log (action);
create index admin_audit_log_target_idx on public.admin_audit_log (target_type, target_id);
create index admin_audit_log_created_at_idx on public.admin_audit_log (created_at desc);

comment on table public.admin_audit_log is 'Audit trail for all admin actions';
comment on column public.admin_audit_log.action is 'Action performed (e.g., "suspend_merchant", "view_merchant_details")';
comment on column public.admin_audit_log.target_type is 'Type of resource affected';
comment on column public.admin_audit_log.target_id is 'ID of the resource affected';
comment on column public.admin_audit_log.metadata is 'Additional context about the action';

-- Enable RLS on audit log table
alter table public.admin_audit_log enable row level security;

-- Only admins can view audit logs
create policy "Admins can view audit logs"
  on public.admin_audit_log for select
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.is_admin = true
    )
  );

-- System (service role) can insert audit logs
create policy "Service role can insert audit logs"
  on public.admin_audit_log for insert
  with check (auth.jwt()->>'role' = 'service_role');
