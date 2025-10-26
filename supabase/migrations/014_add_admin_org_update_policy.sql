-- Add RLS policy to allow admins to update organizations
-- This is needed for admin subscription override functionality

create policy "Admins can update organizations"
  on public.organizations for update
  using (public.is_admin() = true)
  with check (public.is_admin() = true);

-- Add comment
comment on policy "Admins can update organizations" on public.organizations is
  'Allows admins to update organization records for subscription overrides and management';
