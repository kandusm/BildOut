-- Add missing columns to organizations table (if not exists)
alter table public.organizations
add column if not exists email text,
add column if not exists phone text,
add column if not exists address text,
add column if not exists logo_url text;
