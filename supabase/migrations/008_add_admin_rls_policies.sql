-- Add RLS policies for admin access to all users
-- Migration: 008_add_admin_rls_policies

-- Drop the existing restrictive policy and recreate with admin exception
drop policy if exists "Users can view same org users" on public.users;

-- Recreate policy: users can view same org users OR admins can view all users
create policy "Users can view same org users or admins can view all"
  on public.users for select
  using (
    org_id = public.get_user_org_id()
    or
    exists (
      select 1 from public.users u
      where u.id = auth.uid()
      and u.is_admin = true
    )
  );

-- Allow admins to update merchant fields (onboarding_status, payouts_enabled, etc.)
create policy "Admins can update merchant fields"
  on public.users for update
  using (
    exists (
      select 1 from public.users u
      where u.id = auth.uid()
      and u.is_admin = true
    )
  );

-- Allow admins to view all organizations
create policy "Admins can view all organizations"
  on public.organizations for select
  using (
    id = public.get_user_org_id()
    or
    exists (
      select 1 from public.users u
      where u.id = auth.uid()
      and u.is_admin = true
    )
  );

-- Allow admins to view all invoices
create policy "Admins can view all invoices"
  on public.invoices for select
  using (
    org_id = public.get_user_org_id()
    or
    exists (
      select 1 from public.users u
      where u.id = auth.uid()
      and u.is_admin = true
    )
  );

-- Allow admins to view all payments
create policy "Admins can view all payments"
  on public.payments for select
  using (
    org_id = public.get_user_org_id()
    or
    exists (
      select 1 from public.users u
      where u.id = auth.uid()
      and u.is_admin = true
    )
  );

-- Comment for documentation
comment on policy "Users can view same org users or admins can view all" on public.users is
  'Regular users see only their org users; admins see all users for merchant management';
