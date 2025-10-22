# BildOut — Technical Specification v1.1

**Last Updated:** 2025-10-13
**Status:** Active Development
**Domain:** bildout.com

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Technology Stack](#3-technology-stack)
4. [Database Schema](#4-database-schema)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [Stripe Integration](#6-stripe-integration)
   - 6.5. [Merchant Management Module](#65-merchant-management-module)
7. [API Endpoints](#7-api-endpoints)
8. [Business Logic](#8-business-logic)
9. [File Storage](#9-file-storage)
10. [Email & Notifications](#10-email--notifications)
11. [UI/UX Components](#11-uiux-components)
12. [SEO Strategy](#12-seo-strategy)
13. [Analytics & Monitoring](#13-analytics--monitoring)
14. [Security & Compliance](#14-security--compliance)
15. [Environment Configuration](#15-environment-configuration)
16. [Type Definitions](#16-type-definitions)

---

## 1. Executive Summary

### Product Vision
BildOut is a niche-focused invoice generator with embedded payments, targeting trade and service professionals (electricians, roofers, HVAC, etc.). The MVP prioritizes speed-to-market, SEO-driven growth, and immediate monetization.

### Core Value Propositions
- **5-minute setup** via Stripe Connect Express
- **Embedded payments** (card, ACH, Apple Pay)
- **Partial payments & deposits** built-in
- **SEO-optimized templates** for niche discovery
- **Simple pricing** with transparent fees

### Success Metrics (90 Days)
- 100 signups
- 25 activated merchants (≥1 invoice sent)
- 10 paying Pro subscribers
- $1,500 GMV processed
- 1,000 organic sessions/month

---

## 2. Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  Next.js 15 (App Router) + React 18 + TypeScript          │
│  Tailwind CSS v3.4 + Shadcn UI + Framer Motion            │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ├─── Supabase Client (Auth + Realtime)
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                    API Layer (Route Handlers)               │
│  /api/invoices, /api/payments, /api/stripe, /api/webhooks │
└─────────────────┬───────────────────────────────────────────┘
                  │
        ┌─────────┼─────────┬──────────────┐
        │         │         │              │
┌───────▼─────┐ ┌─▼─────────▼──┐ ┌────────▼────────┐
│  Supabase   │ │   Stripe     │ │  External APIs  │
│  - Auth     │ │   - Connect  │ │  - Resend       │
│  - Postgres │ │   - Payments │ │  - Twilio       │
│  - Storage  │ │   - Webhooks │ │  - PostHog      │
│  - RLS      │ │              │ │                 │
└─────────────┘ └──────────────┘ └─────────────────┘
```

### Request Flow Examples

**Invoice Creation:**
1. Merchant creates invoice via dashboard
2. Next.js API route validates + calculates totals
3. Supabase stores invoice + items (RLS enforced)
4. Generate unique payment_link_token
5. Return invoice + public payment URL

**Payment Processing:**
1. Customer opens `/pay/:token` (public, no auth)
2. Page fetches invoice via token
3. Customer enters payment details (Stripe Elements)
4. API creates PaymentIntent with application fee
5. Stripe processes payment
6. Webhook updates invoice status
7. Send receipt email via Resend

---

## 3. Technology Stack

### Core Stack (Production)

| Layer               | Technology            | Version  | Rationale                                    |
|---------------------|-----------------------|----------|----------------------------------------------|
| **Framework**       | Next.js               | 15.x     | App Router, RSC, API routes, SEO            |
| **Language**        | TypeScript            | 5.x      | Type safety, better DX                      |
| **Styling**         | Tailwind CSS          | 3.4.x    | Rapid styling, small bundle (stable)        |
| **UI Components**   | Shadcn UI             | Latest   | Accessible, customizable, copy-paste        |
| **Animation**       | Framer Motion         | 11.x     | Smooth micro-interactions                   |
| **Auth + DB**       | Supabase              | Latest   | Postgres, RLS, auth, storage, realtime      |
| **Payments**        | Stripe                | Latest   | Connect Express, Elements, webhooks         |
| **Email**           | Resend                | Latest   | React Email templates, good deliverability  |
| **SMS** (optional)  | Twilio                | Latest   | Reminders for overdue invoices              |
| **Analytics**       | PostHog               | Latest   | Product analytics, session replay           |
| **Logging**         | BetterStack (Logtail) | Latest   | Centralized logs, alerts                    |
| **Hosting**         | Vercel                | Latest   | Edge functions, automatic deployments       |

### Development Tools

- **Package Manager:** pnpm (fast, efficient)
- **Linting:** ESLint + Prettier
- **Validation:** Zod (runtime type checking)
- **PDF Generation:** @react-pdf/renderer or Puppeteer
- **Date Handling:** date-fns (lightweight vs moment)
- **Testing:** Vitest + React Testing Library (future)

### Package Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/ssr": "^0.1.0",
    "stripe": "^14.10.0",
    "@stripe/stripe-js": "^2.4.0",
    "@stripe/react-stripe-js": "^2.4.0",
    "resend": "^3.0.0",
    "zod": "^3.22.0",
    "date-fns": "^3.0.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.300.0",
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "eslint": "^8.56.0",
    "prettier": "^3.1.0",
    "prettier-plugin-tailwindcss": "^0.5.0"
  }
}
```

---

## 4. Database Schema

### Enhanced Schema with Improvements

```sql
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
```

### Database Indexes Summary

| Table            | Index                                    | Purpose                              |
|------------------|------------------------------------------|--------------------------------------|
| organizations    | owner_id                                 | User ownership lookups               |
| users            | org_id, stripe_connect_id                | Org membership, Stripe account       |
| clients          | org_id, name (GIN trgm), email           | Org scoping, fuzzy search            |
| items            | org_id, name (GIN trgm)                  | Org scoping, fuzzy search            |
| invoices         | org_id+status, due_date, payment_token   | Dashboard queries, public payments   |
| invoice_items    | invoice_id                               | Join efficiency                      |
| payments         | org_id, invoice_id, stripe_payment_intent| Transaction lookups                  |
| stripe_events    | type, received_at, processed             | Webhook processing                   |

---

## 5. Authentication & Authorization

### Supabase Auth Configuration

**Auth Providers (MVP):**
- Email magic link (passwordless)
- Email + password (optional fallback)

**Post-MVP:**
- Google OAuth
- Microsoft OAuth (for MSPs)

### User Onboarding Flow

```typescript
// 1. User signs up via magic link
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  options: {
    emailRedirectTo: `${APP_URL}/auth/callback`,
  },
});

// 2. After email confirmation, create organization + user record
// Trigger: on auth.users insert (Supabase database function)
create or replace function public.handle_new_user()
returns trigger as $$
declare
  new_org_id uuid;
begin
  -- Create organization
  insert into public.organizations (name, owner_id)
  values ('My Business', new.id)
  returning id into new_org_id;

  -- Create user profile
  insert into public.users (id, org_id, role, display_name)
  values (new.id, new_org_id, 'owner', new.email);

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

### Authorization Model

**Roles:**
- `owner` — Full access, billing, can delete org
- `admin` — Manage invoices, clients, items (no billing)
- `member` — View-only (for agency plan)

**RLS Enforcement:**
- All queries filtered by `org_id = public.get_user_org_id()`
- Public payment pages bypass RLS (query by `payment_link_token`)

### Session Management

- Supabase handles JWT refresh automatically
- Server-side: use `createServerClient` for protected routes
- Client-side: use `createBrowserClient` for reactive auth state

---

## 6. Stripe Integration

### Connect Express Architecture

**Why Express?**
- Fastest onboarding (embedded component)
- Stripe handles KYC, compliance, payouts
- No complex underwriting

**Account Creation Flow:**

```typescript
// 1. Create Express account after user signup
const account = await stripe.accounts.create({
  type: 'express',
  country: 'US',
  email: user.email,
  capabilities: {
    card_payments: { requested: true },
    us_bank_account_payments: { requested: true },
    transfers: { requested: true },
  },
  business_type: 'individual', // or 'company'
  metadata: {
    org_id: user.org_id,
  },
});

// 2. Store account.id in users.stripe_connect_id
await supabase.from('users').update({
  stripe_connect_id: account.id,
}).eq('id', user.id);

// 3. Generate onboarding link
const accountLink = await stripe.accountLinks.create({
  account: account.id,
  refresh_url: `${APP_URL}/dashboard/stripe/refresh`,
  return_url: `${APP_URL}/dashboard/stripe/return`,
  type: 'account_onboarding',
});

// Redirect user to accountLink.url
```

**Onboarding Status Check:**

```typescript
const account = await stripe.accounts.retrieve(stripeConnectId);

const isComplete = account.details_submitted &&
                   account.charges_enabled &&
                   account.payouts_enabled;

await supabase.from('users').update({
  stripe_onboarding_complete: isComplete,
}).eq('stripe_connect_id', stripeConnectId);
```

### Payment Intent Strategy

**Destination Charges (Recommended):**

```typescript
// Platform creates PI, automatically transfers to connected account
const paymentIntent = await stripe.paymentIntents.create({
  amount: toCents(invoice.total), // e.g., 10000 = $100.00
  currency: invoice.currency,
  application_fee_amount: toCents(calculatePlatformFee(invoice)), // e.g., 100 = $1.00
  transfer_data: {
    destination: merchant.stripe_connect_id,
  },
  metadata: {
    invoice_id: invoice.id,
    org_id: invoice.org_id,
  },
}, {
  idempotencyKey: `invoice_${invoice.id}_${Date.now()}`,
});
```

**Platform Fee Calculation:**

```typescript
function calculatePlatformFee(invoice: Invoice, tier: 'free' | 'pro' | 'agency'): number {
  const feePercentage = {
    free: 1.0,    // 1%
    pro: 0.7,     // 0.7%
    agency: 0.5,  // 0.5%
  }[tier];

  return invoice.total * (feePercentage / 100);
}
```

### Partial Payments

**Multiple PaymentIntent Approach:**

```typescript
// Customer wants to pay $50 of $200 invoice
// 1. Create PI for partial amount
const pi = await stripe.paymentIntents.create({
  amount: toCents(50),
  currency: 'usd',
  application_fee_amount: toCents(0.50), // 1% of $50
  transfer_data: { destination: merchant.stripe_connect_id },
  metadata: { invoice_id, payment_type: 'partial' },
});

// 2. After successful payment, update invoice
await supabase.from('invoices').update({
  amount_paid: currentAmountPaid + 50,
  amount_due: currentAmountDue - 50,
  status: currentAmountDue - 50 <= 0 ? 'paid' : 'partial',
}).eq('id', invoice_id);

// 3. Record payment
await supabase.from('payments').insert({
  org_id: invoice.org_id,
  invoice_id,
  stripe_payment_intent: pi.id,
  amount: 50,
  currency: 'usd',
  status: 'succeeded',
  method: 'card',
});
```

### Webhooks

**Events to Handle:**

| Event                              | Action                                           |
|------------------------------------|--------------------------------------------------|
| `payment_intent.succeeded`         | Update invoice status, record payment            |
| `payment_intent.payment_failed`    | Notify merchant, keep invoice unpaid             |
| `charge.refunded`                  | Update payment record, adjust invoice totals     |
| `account.updated`                  | Sync onboarding status                           |
| `payout.paid`                      | Log for merchant dashboard (optional)            |

**Webhook Handler Pattern:**

```typescript
// app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  // Idempotency check
  const existing = await supabase.from('stripe_events').select('id').eq('id', event.id).single();
  if (existing.data) {
    return new Response('Already processed', { status: 200 });
  }

  // Store event
  await supabase.from('stripe_events').insert({
    id: event.id,
    type: event.type,
    payload: event,
  });

  // Process event
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
      break;
    // ... other cases
  }

  await supabase.from('stripe_events').update({ processed: true, processed_at: new Date() }).eq('id', event.id);

  return new Response('OK', { status: 200 });
}
```

---

## 6.5. Merchant Management Module

### Purpose

Provide a secure, internal dashboard to monitor and manage all merchant accounts without needing a separate application. This module allows platform administrators to oversee merchant onboarding, payouts, and account status.

### Core Capabilities

* View all merchants with onboarding and payout status
* View merchant-level data: invoices, payments, volume processed, payout balances
* Generate Stripe Express dashboard login links
* Suspend or disable merchant accounts (soft lock)
* Send onboarding reminders or notifications

### Database Schema Updates

The following columns need to be added to the `users` table to support merchant management:

```sql
-- Add merchant management fields to users table
alter table public.users add column if not exists is_admin boolean default false;
alter table public.users add column if not exists onboarding_status text default 'pending';
alter table public.users add column if not exists payouts_enabled boolean default false;
alter table public.users add column if not exists stripe_balance numeric(12,2) default 0;

comment on column public.users.is_admin is 'Admin flag for platform operators';
comment on column public.users.onboarding_status is 'Stripe Connect onboarding status (pending/verified/complete)';
comment on column public.users.payouts_enabled is 'Whether merchant can receive payouts';
comment on column public.users.stripe_balance is 'Cached Stripe account balance for dashboard display';

-- Index for admin queries
create index if not exists users_is_admin_idx on public.users (is_admin) where is_admin = true;
```

### Admin API Routes

| Route                                      | Method | Purpose                                                | Auth Required       |
| ------------------------------------------ | ------ | ------------------------------------------------------ | ------------------- |
| `/api/admin/merchants`                     | GET    | List all merchants w/ Connect ID + status              | Admin only          |
| `/api/admin/merchants/:id`                 | GET    | Retrieve details (Stripe acct info, payouts, invoices) | Admin only          |
| `/api/admin/merchants/:id/login-link`      | POST   | Generate Stripe Express dashboard link                 | Admin only          |
| `/api/admin/merchants/:id/suspend`         | POST   | Soft-disable merchant temporarily                      | Admin only          |
| `/api/admin/merchants/:id/resume`          | POST   | Re-enable suspended merchant                           | Admin only          |

**Security:**
- All admin routes require the Supabase **Service Role** key; never exposed client-side
- Route-level middleware ensures only `is_admin = true` can access `/admin/*`
- Data isolation enforced by RLS; admin queries use service role for full access

### Admin UI Pages

```
app/
├── admin/
│   ├── layout.tsx                    # Admin layout with sidebar
│   ├── page.tsx                      # Admin dashboard overview
│   ├── merchants/
│   │   ├── page.tsx                  # Merchant list
│   │   └── [id]/page.tsx             # Merchant details
│   ├── invoices/page.tsx             # All invoices across merchants
│   ├── payments/page.tsx             # All payments across merchants
│   └── logs/page.tsx                 # System logs and audit trail
```

**Merchant List View:**

Displays a table with the following columns:
- Merchant Name (organization name)
- Email
- Stripe Connect ID
- Onboarding Status (Pending / Complete / Verified / Incomplete)
- Payouts Enabled (Yes/No)
- Balance (cached from Stripe)
- Total GMV
- Last Activity
- Actions (View, Open Stripe Dashboard, Suspend/Resume, Send Reminder)

**Merchant Detail View:**

- **Account Information:**
  - Organization ID
  - Owner Email
  - Stripe Connect ID
  - Onboarding Status
  - Payouts Enabled
  - Account Created Date

- **Financial Summary:**
  - Current Balance
  - Total GMV (all-time)
  - Platform Fees Collected
  - Last Payout Date
  - Next Payout Schedule

- **Activity:**
  - Recent Invoices (last 10)
  - Recent Payments (last 10)
  - Payment Success Rate
  - Average Invoice Amount

- **Actions:**
  - [Open Stripe Dashboard] — Generate login link
  - [Send Onboarding Reminder] — Email merchant
  - [Suspend Account] / [Resume Account]
  - [View Audit Log]

### Integration with Stripe

**Syncing Merchant Data:**

```typescript
// lib/admin/sync-merchant-stripe-data.ts
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function syncMerchantStripeData(userId: string) {
  const supabase = await createClient();

  // Get user's Stripe Connect ID
  const { data: user } = await supabase
    .from('users')
    .select('stripe_connect_id')
    .eq('id', userId)
    .single();

  if (!user?.stripe_connect_id) {
    throw new Error('No Stripe Connect account found');
  }

  // Retrieve account from Stripe
  const account = await stripe.accounts.retrieve(user.stripe_connect_id);

  // Retrieve balance
  const balance = await stripe.balance.retrieve({
    stripeAccount: user.stripe_connect_id,
  });

  // Calculate total available balance
  const totalBalance = balance.available.reduce((sum, b) => sum + b.amount, 0) / 100;

  // Update local database
  await supabase
    .from('users')
    .update({
      onboarding_status: account.details_submitted ? 'complete' : 'pending',
      payouts_enabled: account.payouts_enabled || false,
      stripe_balance: totalBalance,
    })
    .eq('id', userId);

  return {
    account,
    balance: totalBalance,
  };
}
```

**Generating Login Links:**

```typescript
// app/api/admin/merchants/[id]/login-link/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();

  // Verify admin access
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Get merchant's Stripe Connect ID
  const { data: merchant } = await supabase
    .from('users')
    .select('stripe_connect_id')
    .eq('id', params.id)
    .single();

  if (!merchant?.stripe_connect_id) {
    return NextResponse.json({ error: 'Merchant has no Stripe account' }, { status: 404 });
  }

  // Generate login link
  const loginLink = await stripe.accounts.createLoginLink(merchant.stripe_connect_id);

  return NextResponse.json({ url: loginLink.url });
}
```

### Webhook Updates

Add handling for `account.updated` events to automatically sync merchant status:

```typescript
// In webhook handler
case 'account.updated':
  const account = event.data.object as Stripe.Account;

  // Find user by Stripe Connect ID
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_connect_id', account.id)
    .single();

  if (user) {
    await supabase
      .from('users')
      .update({
        onboarding_status: account.details_submitted ? 'complete' : 'pending',
        payouts_enabled: account.payouts_enabled || false,
      })
      .eq('id', user.id);
  }
  break;
```

### Security Considerations

1. **Admin Access Control:**
   - Middleware checks `is_admin` flag before allowing access to `/admin/*` routes
   - Service role key used for admin API queries (bypasses RLS)
   - Admin actions logged for audit trail

2. **Data Isolation:**
   - Regular users cannot see or access admin routes
   - Admin users can see all merchant data via service role
   - RLS policies enforced for non-admin operations

3. **Audit Logging:**
   - All admin actions logged to `admin_audit_log` table
   - Includes: user_id, action, target_id, timestamp, metadata

### Future Scalability

If merchant volume grows significantly, the `/admin` module can be extracted as a separate **BildOut Ops** micro-app:

- Same Supabase database (shared schema)
- Separate Next.js deployment
- API key authentication for service-to-service calls
- Independent scaling and deployment

---

## 7. API Endpoints

### API Route Structure

```
app/api/
├── auth/
│   └── callback/route.ts          # Supabase auth callback
├── invoices/
│   ├── route.ts                   # GET (list), POST (create)
│   └── [id]/
│       ├── route.ts               # GET, PUT, DELETE
│       ├── send/route.ts          # POST - send invoice via email/SMS
│       ├── pdf/route.ts           # POST - generate PDF
│       └── duplicate/route.ts     # POST - duplicate invoice
├── clients/
│   ├── route.ts                   # GET, POST
│   └── [id]/route.ts              # GET, PUT, DELETE
├── items/
│   ├── route.ts                   # GET, POST
│   └── [id]/route.ts              # GET, PUT, DELETE
├── payments/
│   ├── intent/route.ts            # POST - create/update PaymentIntent
│   └── [id]/route.ts              # GET - retrieve payment details
├── stripe/
│   ├── connect/
│   │   ├── account/route.ts       # POST - create Express account
│   │   ├── link/route.ts          # POST - generate onboarding link
│   │   └── status/route.ts        # GET - check account status
│   └── webhooks/route.ts          # POST - Stripe webhooks
├── admin/
│   └── merchants/
│       ├── route.ts               # GET - list all merchants
│       └── [id]/
│           ├── route.ts           # GET - merchant details
│           ├── login-link/route.ts# POST - generate Stripe dashboard link
│           ├── suspend/route.ts   # POST - suspend merchant
│           └── resume/route.ts    # POST - resume merchant
└── webhooks/
    └── resend/route.ts             # POST - email delivery events (optional)
```

### Endpoint Specifications

#### POST /api/invoices

**Request:**
```typescript
{
  clientId: string;
  issueDate: string; // ISO date
  dueDate?: string;
  items: Array<{
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
  }>;
  discountPercent?: number;
  depositRequired?: number;
  allowPartial?: boolean;
  notes?: string;
  terms?: string;
}
```

**Response:**
```typescript
{
  id: string;
  number: string; // QB-2025-0001
  paymentLink: string; // https://app.bildout.com/pay/abc123
  total: number;
  status: 'draft';
  createdAt: string;
}
```

**Logic:**
1. Validate user auth + org membership
2. Increment `organizations.invoice_number_sequence`
3. Generate invoice number: `{prefix}-{year}-{sequence}`
4. Calculate totals server-side
5. Generate unique `payment_link_token` (nanoid or uuid)
6. Insert invoice + items in transaction
7. Return invoice with public payment URL

---

#### POST /api/payments/intent

**Request:**
```typescript
{
  token: string; // payment_link_token
  amount?: number; // optional for partial payment
}
```

**Response:**
```typescript
{
  clientSecret: string; // for Stripe Elements
  invoice: {
    id: string;
    number: string;
    total: number;
    amountDue: number;
    depositRequired?: number;
    allowPartial: boolean;
  };
}
```

**Logic:**
1. Lookup invoice by token (no auth required)
2. Validate amount (>= depositRequired, <= amountDue)
3. Create/update PaymentIntent with application fee
4. Return client_secret for Elements

---

#### POST /api/invoices/:id/send

**Request:**
```typescript
{
  method: 'email' | 'sms';
  recipientEmail?: string; // override client email
  recipientPhone?: string; // override client phone
}
```

**Response:**
```typescript
{
  success: boolean;
  sentAt: string;
}
```

**Logic:**
1. Validate user owns invoice
2. Update invoice status to 'sent'
3. Send email via Resend (or SMS via Twilio)
4. Return success

---

## 8. Business Logic

### Invoice Calculations

**Totals Calculation:**

```typescript
interface InvoiceItem {
  quantity: number;
  unitPrice: number;
  taxRate: number; // percentage
}

function calculateLineTotal(item: InvoiceItem): number {
  const subtotal = item.quantity * item.unitPrice;
  const tax = subtotal * (item.taxRate / 100);
  return subtotal + tax;
}

function calculateInvoiceTotals(items: InvoiceItem[], discountPercent: number = 0) {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxTotal = items.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.unitPrice;
    return sum + (itemSubtotal * (item.taxRate / 100));
  }, 0);
  const discountTotal = subtotal * (discountPercent / 100);
  const total = subtotal + taxTotal - discountTotal;

  return {
    subtotal: round(subtotal),
    taxTotal: round(taxTotal),
    discountTotal: round(discountTotal),
    total: round(total),
    amountDue: round(total), // initially equals total
  };
}

function round(num: number): number {
  return Math.round(num * 100) / 100;
}
```

### Invoice Status Transitions

**State Machine:**

```
draft ──────► sent ──────► viewed ──────► paid
                │            │               ▲
                │            └──► partial ───┘
                │                      │
                └──────────────────────┴─────► overdue
                                               │
                                               └────► void (manual)
```

**Transition Logic:**

```typescript
function updateInvoiceStatus(invoice: Invoice): InvoiceStatus {
  if (invoice.deleted_at) return 'void';
  if (invoice.amount_paid >= invoice.total) return 'paid';
  if (invoice.amount_paid > 0) return 'partial';
  if (invoice.due_date && new Date(invoice.due_date) < new Date() && invoice.status !== 'draft') return 'overdue';
  // 'draft', 'sent', 'viewed' remain unchanged unless above conditions met
  return invoice.status;
}
```

### Overdue Detection (Cron Job)

**Daily job via Vercel Cron:**

```typescript
// app/api/cron/overdue/route.ts
export async function GET(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Find overdue invoices
  const { data: overdueInvoices } = await supabase
    .from('invoices')
    .select('id, org_id, number, client_id')
    .in('status', ['sent', 'viewed', 'partial'])
    .lt('due_date', new Date().toISOString().split('T')[0])
    .is('deleted_at', null);

  // Update status + send reminders
  for (const invoice of overdueInvoices || []) {
    await supabase.from('invoices').update({ status: 'overdue' }).eq('id', invoice.id);
    // Send reminder email
    await sendOverdueReminder(invoice);
  }

  return new Response('OK', { status: 200 });
}
```

**Vercel cron config (vercel.json):**

```json
{
  "crons": [{
    "path": "/api/cron/overdue",
    "schedule": "0 9 * * *"
  }]
}
```

---

## 9. File Storage

### PDF Generation & Storage

**Option A: React PDF (Recommended for MVP)**

```typescript
import { renderToStream } from '@react-pdf/renderer';
import { InvoicePDF } from '@/components/pdf/invoice-pdf';

async function generateInvoicePDF(invoice: Invoice): Promise<string> {
  // 1. Render PDF
  const stream = await renderToStream(<InvoicePDF invoice={invoice} />);

  // 2. Upload to Supabase Storage
  const fileName = `invoices/${invoice.org_id}/${invoice.id}.pdf`;
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(fileName, stream, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (error) throw error;

  // 3. Get signed URL (7-day expiry)
  const { data: signedUrl } = await supabase.storage
    .from('documents')
    .createSignedUrl(fileName, 60 * 60 * 24 * 7); // 7 days

  // 4. Update invoice with PDF URL
  await supabase.from('invoices').update({ pdf_url: signedUrl.signedUrl }).eq('id', invoice.id);

  return signedUrl.signedUrl;
}
```

**Option B: Puppeteer (Higher quality, slower)**

Use only if React PDF quality is insufficient. Requires custom Docker container on Vercel (or dedicated service).

### Supabase Storage Buckets

```sql
-- Create bucket
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false);

-- RLS policy: users can access their org's documents
create policy "Users can access own org documents"
  on storage.objects for select
  using (
    bucket_id = 'documents' and
    (storage.foldername(name))[1] = 'invoices' and
    (storage.foldername(name))[2] = public.get_user_org_id()::text
  );
```

---

## 10. Email & Notifications

### Resend Integration

**Email Templates:**

1. **invoice_sent.tsx** — Invoice delivery with payment link
2. **payment_receipt.tsx** — Confirmation after payment
3. **overdue_reminder.tsx** — Gentle reminder for overdue invoices

**Example: Invoice Sent Email**

```typescript
import { Resend } from 'resend';
import { InvoiceSentEmail } from '@/emails/invoice-sent';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendInvoiceEmail(invoice: Invoice, client: Client, merchant: Organization) {
  await resend.emails.send({
    from: `${merchant.name} <invoices@bildout.app>`, // custom domain
    to: client.email,
    subject: `Invoice #${invoice.number} from ${merchant.name}`,
    react: InvoiceSentEmail({
      invoiceNumber: invoice.number,
      amount: invoice.total,
      dueDate: invoice.due_date,
      paymentLink: `${APP_URL}/pay/${invoice.payment_link_token}`,
      merchantName: merchant.name,
    }),
  });
}
```

**React Email Template Structure:**

```tsx
// emails/invoice-sent.tsx
import { Button, Html, Head, Body, Container, Section, Text } from '@react-email/components';

interface Props {
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  paymentLink: string;
  merchantName: string;
}

export function InvoiceSentEmail({ invoiceNumber, amount, dueDate, paymentLink, merchantName }: Props) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'sans-serif' }}>
        <Container style={{ padding: '40px' }}>
          <Text style={{ fontSize: '24px', fontWeight: 'bold' }}>
            New Invoice from {merchantName}
          </Text>
          <Section>
            <Text>Invoice #{invoiceNumber}</Text>
            <Text>Amount Due: ${amount.toFixed(2)}</Text>
            <Text>Due Date: {dueDate}</Text>
          </Section>
          <Button href={paymentLink} style={{ backgroundColor: '#007bff', color: '#fff', padding: '12px 24px' }}>
            View & Pay Invoice
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
```

### SMS Notifications (Optional - Twilio)

```typescript
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendInvoiceSMS(invoice: Invoice, client: Client) {
  await client.messages.create({
    body: `New invoice #${invoice.number} for $${invoice.total}. Pay here: ${APP_URL}/pay/${invoice.payment_link_token}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: client.phone,
  });
}
```

---

## 11. UI/UX Components

### Page Routes

```
app/
├── (marketing)/
│   ├── page.tsx                          # Landing page
│   ├── templates/
│   │   ├── page.tsx                      # Template gallery
│   │   ├── [niche]/
│   │   │   ├── page.tsx                  # e.g., /templates/electrician
│   │   │   └── [location]/page.tsx       # e.g., /templates/electrician/austin
│   ├── how-to/
│   │   └── [slug]/page.tsx               # How-to guides
│   ├── pricing/page.tsx
│   ├── about/page.tsx
│   └── contact/page.tsx
├── (auth)/
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── callback/page.tsx                 # Supabase callback
├── (dashboard)/
│   ├── layout.tsx                        # Protected layout
│   ├── dashboard/page.tsx                # Overview
│   ├── invoices/
│   │   ├── page.tsx                      # List
│   │   ├── new/page.tsx                  # Create
│   │   └── [id]/
│   │       ├── page.tsx                  # View/edit
│   │       └── duplicate/page.tsx
│   ├── clients/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── items/page.tsx
│   ├── settings/
│   │   ├── page.tsx                      # General settings
│   │   ├── branding/page.tsx
│   │   ├── payments/page.tsx             # Stripe onboarding status
│   │   └── billing/page.tsx              # Subscription management
├── pay/
│   └── [token]/
│       ├── page.tsx                      # Public payment page
│       └── success/page.tsx              # Payment confirmation
└── api/
    └── ... (see API section)
```

### Core Components (Shadcn UI)

**Base Components to Install:**

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add card
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add form
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add separator
```

**Custom Components:**

1. **InvoiceForm** — Multi-step invoice creation (client, items, settings)
2. **InvoiceTable** — Data table with filtering, sorting, actions
3. **PaymentForm** — Stripe Elements wrapper
4. **StripeConnectBanner** — Onboarding status + CTA
5. **InvoiceStatusBadge** — Color-coded status indicators

### Design System (Tailwind Config)

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... shadcn defaults
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

---

## 12. SEO Strategy

### Initial 30 Pages Breakdown

**Template Pages (10):**
1. Electrician Invoice Template
2. Electrician Estimate Template
3. Roofer Invoice Template
4. Roofer Estimate Template
5. HVAC Invoice Template
6. Plumber Invoice Template
7. Landscaping Invoice Template
8. Cleaning Services Invoice Template
9. Handyman Invoice Template
10. Tutoring Invoice Template

**How-To Pages (10):**
11. How to Invoice as an Electrician
12. Estimate vs Invoice: What's the Difference?
13. What to Include on a Contractor Invoice
14. How to Accept ACH Payments for Invoices
15. Late Fee Policies: How to Implement
16. Deposit vs Partial Payment: Best Practices
17. Add Sales Tax to Invoices by State
18. Create Recurring Invoices for Service Contracts
19. How to Get Paid Faster: Email Scripts
20. Add Apple Pay to Your Invoices

**Comparison Pages (4):**
21. BildOut vs Wave
22. BildOut vs Jobber
23. Best Free Invoice Generator for Electricians
24. Stripe vs Square for Contractor Invoices

**City Pages (6):**
25. Electrician Invoice Template — Austin
26. Electrician Invoice Template — Dallas
27. Roofer Invoice Template — Austin
28. Roofer Invoice Template — Dallas
29. Plumber Invoice Template — Austin
30. Plumber Invoice Template — Dallas

### Metadata Template

```typescript
// app/(marketing)/templates/[niche]/page.tsx
import { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const niche = params.niche; // 'electrician'
  const title = `${capitalize(niche)} Invoice Template - Free Download | BildOut`;
  const description = `Professional ${niche} invoice template with payment processing. Download free PDF/Word templates or create online invoices in seconds.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [`/og/${niche}-invoice-template.png`],
    },
  };
}
```

### Schema.org Markup

```tsx
// components/seo/software-application-schema.tsx
export function SoftwareApplicationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'BildOut',
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### Internal Linking Strategy

```
Landing Page
    ↓
Template Gallery
    ↓
[Niche] Template Page ──→ How-To Guide ──→ Signup CTA
    ↓
City-Specific Template
```

---

## 13. Analytics & Monitoring

### PostHog Setup

```typescript
// lib/posthog.ts
import posthog from 'posthog-js';

export function initPostHog() {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: 'https://app.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug();
      },
    });
  }
}

// Track custom events
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  posthog.capture(eventName, properties);
}
```

**Key Events to Track:**

- `user_signed_up`
- `stripe_onboarding_started`
- `stripe_onboarding_completed`
- `invoice_created`
- `invoice_sent`
- `invoice_viewed` (via pixel on pay page)
- `payment_initiated`
- `payment_succeeded`
- `template_downloaded`

### BetterStack (Logtail) Logging

```typescript
// lib/logger.ts
import { Logtail } from '@logtail/node';

const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN!);

export function logInfo(message: string, context?: Record<string, any>) {
  logtail.info(message, context);
}

export function logError(message: string, error: Error, context?: Record<string, any>) {
  logtail.error(message, { error: error.message, stack: error.stack, ...context });
}
```

---

## 14. Security & Compliance

### Security Checklist

- ✅ All DB queries filtered by org_id (RLS)
- ✅ No client-side secrets (use `.env.local` + Vercel env vars)
- ✅ Stripe webhook signature verification
- ✅ Signed URLs for PDFs (expire after 7 days)
- ✅ CSRF protection via Next.js defaults
- ✅ Rate limiting on public payment pages (future: Upstash)
- ✅ Input validation via Zod schemas
- ✅ SQL injection protection (Supabase parameterized queries)

### PCI Compliance

- **Never** store card numbers, CVVs, or full PANs
- Use Stripe Elements (hosted fields) exclusively
- Let Stripe handle all card data
- Display only last 4 digits (from Stripe metadata)

### Privacy Policy & Terms

**Required Pages:**
- `/legal/privacy` — GDPR/CCPA-compliant privacy policy
- `/legal/terms` — Terms of service (payment processing, platform fees)
- `/legal/refunds` — Refund policy (defer to Stripe's policies)

**Disclosure in Emails:**
- Include merchant business name + address in footer
- Unsubscribe link (Resend handles this)

---

## 15. Environment Configuration

### Required Environment Variables

```bash
# ============================================
# Supabase
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# ============================================
# Stripe
# ============================================
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CONNECT_WEBHOOK_SECRET=whsec_...

# ============================================
# Email (Resend)
# ============================================
RESEND_API_KEY=re_...

# ============================================
# SMS (Twilio) - Optional
# ============================================
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890

# ============================================
# Analytics
# ============================================
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# ============================================
# Logging (BetterStack)
# ============================================
LOGTAIL_SOURCE_TOKEN=...

# ============================================
# App Config
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# ============================================
# Cron Secret (for Vercel Cron)
# ============================================
CRON_SECRET=random_secret_string_here
```

### Vercel Project Settings

```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "crons": [
    {
      "path": "/api/cron/overdue",
      "schedule": "0 9 * * *"
    }
  ]
}
```

---

## 16. Type Definitions

### Core Types

```typescript
// types/database.ts
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          owner_id: string;
          invoice_number_sequence: number;
          invoice_prefix: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          metadata: Json;
        };
        Insert: Omit<Database['public']['Tables']['organizations']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['organizations']['Insert']>;
      };
      // ... other tables
    };
  };
}

// types/invoice.ts
export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'partial' | 'paid' | 'overdue' | 'void';

export interface Invoice {
  id: string;
  org_id: string;
  client_id: string | null;
  number: string;
  status: InvoiceStatus;
  currency: string;
  issue_date: string;
  due_date: string | null;
  subtotal: number;
  tax_total: number;
  discount_total: number;
  total: number;
  amount_paid: number;
  amount_due: number;
  allow_partial: boolean;
  deposit_required: number | null;
  notes: string | null;
  terms: string | null;
  pdf_url: string | null;
  payment_link_token: string;
  stripe_payment_intent: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string | null;
  metadata: Json;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  item_id: string | null;
  name: string;
  description: string | null;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  line_total: number;
  created_at: string;
}

export interface InvoiceWithItems extends Invoice {
  items: InvoiceItem[];
  client?: Client;
}

// types/payment.ts
export type PaymentStatus = 'requires_payment' | 'processing' | 'succeeded' | 'failed' | 'canceled';

export interface Payment {
  id: string;
  org_id: string;
  invoice_id: string;
  stripe_payment_intent: string | null;
  stripe_charge_id: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: string | null;
  created_at: string;
  updated_at: string;
  metadata: Json;
}

// types/client.ts
export interface Client {
  id: string;
  org_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string | null;
  metadata: Json;
}

// types/api.ts
export interface CreateInvoiceDTO {
  clientId: string;
  issueDate: string;
  dueDate?: string;
  items: Array<{
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
  }>;
  discountPercent?: number;
  depositRequired?: number;
  allowPartial?: boolean;
  notes?: string;
  terms?: string;
}

export interface CreatePaymentIntentDTO {
  token: string;
  amount?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}
```

---

## Appendix A: Pricing Tiers

| Feature                      | Free          | Pro ($12/mo)  | Agency ($39/mo) |
|------------------------------|---------------|---------------|-----------------|
| Invoices/month               | 3             | Unlimited     | Unlimited       |
| Payment processing           | ✅            | ✅            | ✅              |
| Platform fee                 | 1.0%          | 0.7%          | 0.5%            |
| Custom branding              | ❌            | ✅            | ✅              |
| Partial payments             | ❌            | ✅            | ✅              |
| ACH payments                 | ❌            | ✅            | ✅              |
| Automated reminders          | ❌            | ✅            | ✅              |
| Team members                 | 1             | 1             | 5               |
| Client profiles              | 1             | 1             | Unlimited       |
| Export (CSV/JSON)            | ❌            | ✅            | ✅              |
| Priority support             | ❌            | ❌            | ✅              |

---

## Appendix B: Success Metrics Dashboard

```typescript
// lib/analytics/metrics.ts
export async function getActivationMetrics() {
  const { data: users } = await supabase.from('users').select('*');

  const signups = users.length;
  const onboardingComplete = users.filter(u => u.stripe_onboarding_complete).length;

  const { data: invoices } = await supabase.from('invoices').select('org_id, status').neq('status', 'draft');
  const activatedOrgs = new Set(invoices?.map(i => i.org_id)).size;

  const { data: payments } = await supabase.from('payments').select('amount').eq('status', 'succeeded');
  const gmv = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;

  return {
    signups,
    onboardingComplete,
    activatedOrgs,
    gmv,
  };
}
```

---

**End of Technical Specification**
