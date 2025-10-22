-- Fix infinite recursion in admin RLS policies
-- Migration: 009_fix_admin_rls_recursion

-- Create a security definer function to check admin status without triggering RLS
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.users
    where id = auth.uid()
    and is_admin = true
  );
$$ language sql stable security definer;

-- Drop the problematic policies
drop policy if exists "Users can view same org users or admins can view all" on public.users;
drop policy if exists "Admins can update merchant fields" on public.users;
drop policy if exists "Admins can view all organizations" on public.organizations;
drop policy if exists "Admins can view all invoices" on public.invoices;
drop policy if exists "Admins can view all payments" on public.payments;

-- Recreate policies using the security definer function
create policy "Users can view same org users or admins can view all"
  on public.users for select
  using (
    org_id = public.get_user_org_id()
    or public.is_admin() = true
  );

create policy "Admins can update merchant fields"
  on public.users for update
  using (public.is_admin() = true);

create policy "Admins can view all organizations"
  on public.organizations for select
  using (
    id = public.get_user_org_id()
    or public.is_admin() = true
  );

create policy "Admins can view all invoices"
  on public.invoices for select
  using (
    org_id = public.get_user_org_id()
    or public.is_admin() = true
  );

create policy "Admins can view all payments"
  on public.payments for select
  using (
    org_id = public.get_user_org_id()
    or public.is_admin() = true
  );
