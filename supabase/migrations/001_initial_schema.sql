-- ============================================
-- QuickBill Database Schema
-- Migration 001: Initial Schema
-- ============================================

-- EXTENSIONS
-- ============================================
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- for fuzzy search

-- ============================================
-- TENANCY & USERS
-- ============================================

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references auth.users (id) on delete cascade,
  invoice_number_sequence int not null default 0,
  invoice_prefix text default 'QB',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  metadata jsonb default '{}'::jsonb
);

create index organizations_owner_id_idx on public.organizations (owner_id);
create index organizations_deleted_at_idx on public.organizations (deleted_at) where deleted_at is null;

comment on table public.organizations is 'Multi-tenant organization/merchant accounts';
comment on column public.organizations.invoice_number_sequence is 'Auto-increment counter for invoice numbering';
comment on column public.organizations.metadata is 'Flexible JSON for branding, settings, etc.';

-- ============================================

create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  org_id uuid references public.organizations (id) on delete cascade,
  role text not null check (role in ('owner','admin','member')) default 'owner',
  stripe_connect_id text,
  stripe_onboarding_complete boolean not null default false,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  metadata jsonb default '{}'::jsonb
);

create index users_org_id_idx on public.users (org_id);
create index users_stripe_connect_id_idx on public.users (stripe_connect_id);
create unique index users_stripe_connect_id_unique on public.users (stripe_connect_id) where stripe_connect_id is not null;

comment on table public.users is 'User profiles linked to Supabase auth.users';
comment on column public.users.stripe_connect_id is 'Stripe Connect Express account ID (acct_xxx)';

-- ============================================
-- CRM-LITE: CLIENTS
-- ============================================

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  email text,
  phone text,
  address jsonb default '{}'::jsonb, -- {line1, line2, city, state, zip, country}
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid references auth.users (id),
  metadata jsonb default '{}'::jsonb
);

create index clients_org_id_idx on public.clients (org_id);
create index clients_name_trgm_idx on public.clients using gin (name gin_trgm_ops);
create index clients_email_idx on public.clients (email);
create index clients_deleted_at_idx on public.clients (deleted_at) where deleted_at is null;

comment on table public.clients is 'Customer/client directory per organization';

-- ============================================
-- CATALOG: ITEMS / PRESETS
-- ============================================

create table public.items (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  description text,
  unit_price numeric(12,2) not null default 0,
  unit text not null default 'each',
  tax_rate numeric(5,2) not null default 0, -- percentage (e.g., 8.25)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid references auth.users (id),
  metadata jsonb default '{}'::jsonb
);

create index items_org_id_idx on public.items (org_id);
create index items_name_trgm_idx on public.items using gin (name gin_trgm_ops);
create index items_deleted_at_idx on public.items (deleted_at) where deleted_at is null;

comment on table public.items is 'Reusable line item presets (services, products)';

-- ============================================
-- INVOICES
-- ============================================

create type invoice_status as enum (
  'draft',
  'sent',
  'viewed',
  'partial',
  'paid',
  'overdue',
  'void'
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  client_id uuid references public.clients (id) on delete set null,
  number text not null, -- e.g., QB-2025-0001
  status invoice_status not null default 'draft',
  currency text not null default 'usd',
  issue_date date not null default current_date,
  due_date date,

  -- Financial fields
  subtotal numeric(12,2) not null default 0,
  tax_total numeric(12,2) not null default 0,
  discount_total numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  amount_paid numeric(12,2) not null default 0,
  amount_due numeric(12,2) not null default 0,

  -- Payment options
  allow_partial boolean not null default true,
  deposit_required numeric(12,2), -- minimum payment amount

  -- Content
  notes text,
  terms text,

  -- Generated artifacts
  pdf_url text,
  payment_link_token text unique, -- public slug for /pay/:token

  -- Stripe reference
  stripe_payment_intent text, -- latest/active PI

  -- Audit fields
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid references auth.users (id),

  -- Extensibility
  metadata jsonb default '{}'::jsonb,

  -- Constraints
  constraint invoices_number_org_unique unique (org_id, number)
);

create index invoices_org_id_status_idx on public.invoices (org_id, status);
create index invoices_org_id_issue_date_idx on public.invoices (org_id, issue_date desc);
create index invoices_client_id_idx on public.invoices (client_id);
create index invoices_payment_link_token_idx on public.invoices (payment_link_token);
create index invoices_due_date_status_idx on public.invoices (due_date, status) where status in ('sent', 'viewed', 'partial');
create index invoices_deleted_at_idx on public.invoices (deleted_at) where deleted_at is null;

comment on table public.invoices is 'Core invoice records';
comment on column public.invoices.payment_link_token is 'Unique slug for public payment page (UUID or nanoid)';
comment on column public.invoices.deposit_required is 'Optional minimum payment amount';

-- ============================================
-- INVOICE LINE ITEMS
-- ============================================

create table public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices (id) on delete cascade,
  item_id uuid references public.items (id) on delete set null, -- reference to preset (optional)
  name text not null,
  description text,
  quantity numeric(12,2) not null default 1,
  unit_price numeric(12,2) not null default 0,
  tax_rate numeric(5,2) not null default 0,
  line_total numeric(12,2) not null default 0, -- computed: (quantity * unit_price) * (1 + tax_rate/100)
  created_at timestamptz not null default now()
);

create index invoice_items_invoice_id_idx on public.invoice_items (invoice_id);

comment on table public.invoice_items is 'Line items for each invoice';

-- ============================================
-- PAYMENTS
-- ============================================

create type payment_status as enum (
  'requires_payment',
  'processing',
  'succeeded',
  'failed',
  'canceled'
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  invoice_id uuid not null references public.invoices (id) on delete cascade,
  stripe_payment_intent text,
  stripe_charge_id text,
  amount numeric(12,2) not null,
  currency text not null default 'usd',
  status payment_status not null,
  method text, -- 'card', 'us_bank_account', etc.
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb default '{}'::jsonb
);

create index payments_org_id_idx on public.payments (org_id);
create index payments_invoice_id_idx on public.payments (invoice_id);
create index payments_stripe_payment_intent_idx on public.payments (stripe_payment_intent);
create index payments_created_at_idx on public.payments (created_at desc);

comment on table public.payments is 'Payment transaction records';

-- ============================================
-- STRIPE WEBHOOK LEDGER
-- ============================================

create table public.stripe_events (
  id text primary key, -- evt_xxx from Stripe
  type text not null,
  received_at timestamptz not null default now(),
  payload jsonb not null,
  processed boolean not null default false,
  processed_at timestamptz
);

create index stripe_events_type_idx on public.stripe_events (type);
create index stripe_events_received_at_idx on public.stripe_events (received_at desc);
create index stripe_events_processed_idx on public.stripe_events (processed) where not processed;

comment on table public.stripe_events is 'Idempotent webhook event log';

-- ============================================
-- TRIGGERS: UPDATED_AT
-- ============================================

create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger organizations_updated_at before update on public.organizations
  for each row execute function public.update_updated_at_column();

create trigger users_updated_at before update on public.users
  for each row execute function public.update_updated_at_column();

create trigger clients_updated_at before update on public.clients
  for each row execute function public.update_updated_at_column();

create trigger items_updated_at before update on public.items
  for each row execute function public.update_updated_at_column();

create trigger invoices_updated_at before update on public.invoices
  for each row execute function public.update_updated_at_column();

create trigger payments_updated_at before update on public.payments
  for each row execute function public.update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

alter table public.organizations enable row level security;
alter table public.users enable row level security;
alter table public.clients enable row level security;
alter table public.items enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.payments enable row level security;
alter table public.stripe_events enable row level security;

-- Helper function to get user's org_id from JWT
create or replace function public.get_user_org_id()
returns uuid as $$
  select org_id from public.users where id = auth.uid();
$$ language sql stable security definer;

-- Organizations: users can only see their own org
create policy "Users can view own organization"
  on public.organizations for select
  using (id = public.get_user_org_id());

create policy "Organization owners can update their org"
  on public.organizations for update
  using (owner_id = auth.uid());

-- Users: can view users in same org
create policy "Users can view same org users"
  on public.users for select
  using (org_id = public.get_user_org_id());

create policy "Users can update own profile"
  on public.users for update
  using (id = auth.uid());

-- Clients: scoped to org
create policy "Users can manage clients in their org"
  on public.clients for all
  using (org_id = public.get_user_org_id());

-- Items: scoped to org
create policy "Users can manage items in their org"
  on public.items for all
  using (org_id = public.get_user_org_id());

-- Invoices: scoped to org
create policy "Users can manage invoices in their org"
  on public.invoices for all
  using (org_id = public.get_user_org_id());

-- Invoice items: can access if user owns parent invoice
create policy "Users can manage invoice items in their org"
  on public.invoice_items for all
  using (
    exists (
      select 1 from public.invoices
      where invoices.id = invoice_items.invoice_id
      and invoices.org_id = public.get_user_org_id()
    )
  );

-- Payments: scoped to org
create policy "Users can view payments in their org"
  on public.payments for select
  using (org_id = public.get_user_org_id());

-- Stripe events: service role only
create policy "Service role can manage stripe events"
  on public.stripe_events for all
  using (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- AUTO-CREATE ORG & USER ON SIGNUP
-- ============================================

create or replace function public.handle_new_user()
returns trigger as $$
declare
  new_org_id uuid;
begin
  -- Create organization
  insert into public.organizations (name, owner_id)
  values (
    coalesce(new.raw_user_meta_data->>'business_name', 'My Business'),
    new.id
  )
  returning id into new_org_id;

  -- Create user profile
  insert into public.users (id, org_id, role, display_name)
  values (
    new.id,
    new_org_id,
    'owner',
    coalesce(new.raw_user_meta_data->>'display_name', new.email)
  );

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- STORAGE BUCKETS (for PDFs, logos, etc.)
-- ============================================

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false);

-- RLS policy: users can access their org's documents
create policy "Users can access own org documents"
  on storage.objects for select
  using (
    bucket_id = 'documents' and
    (storage.foldername(name))[1] = 'invoices' and
    (storage.foldername(name))[2] = (select org_id::text from public.users where id = auth.uid())
  );

create policy "Users can upload to own org documents"
  on storage.objects for insert
  with check (
    bucket_id = 'documents' and
    (storage.foldername(name))[1] = 'invoices' and
    (storage.foldername(name))[2] = (select org_id::text from public.users where id = auth.uid())
  );

create policy "Users can update own org documents"
  on storage.objects for update
  using (
    bucket_id = 'documents' and
    (storage.foldername(name))[1] = 'invoices' and
    (storage.foldername(name))[2] = (select org_id::text from public.users where id = auth.uid())
  );

create policy "Users can delete own org documents"
  on storage.objects for delete
  using (
    bucket_id = 'documents' and
    (storage.foldername(name))[1] = 'invoices' and
    (storage.foldername(name))[2] = (select org_id::text from public.users where id = auth.uid())
  );

-- ============================================
-- END OF MIGRATION
-- ============================================
