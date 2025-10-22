-- Add default_tax_rate column to organizations table
alter table public.organizations
add column if not exists default_tax_rate numeric(5,2) default 0 check (default_tax_rate >= 0 and default_tax_rate <= 100);

comment on column public.organizations.default_tax_rate is 'Default tax rate percentage (0-100) to apply to new invoices';
