# BildOut — MVP Specification (Invoice + Payments + Merchant Management)

**Last Updated:** 2025-10-13
**Status:** Active Development
**Domain:** bildout.com

---

## 1) Product Summary

**Promise:** Create, send, and get paid for professional invoices in seconds. Tailored presets for trade/service niches (e.g., electricians, roofers, MSPs, tutors).

**Core MVP outcomes (Day-1):**

* Build invoice (items, tax, discounts, deposits/partial payments)
* Send as link + PDF (email/SMS)
* Get paid via card/ACH/Apple Pay using Stripe Connect (Express)
* Track status (Draft → Sent → Viewed → Partially Paid → Paid → Overdue)
* Save clients & presets; logo/brand; simple reporting
* Manage merchant accounts, onboarding, and payout status inside the same platform

**Monetization (initial):**

* Free tier: 3 invoices/mo, payment link with BildOut branding
* Pro: $12/mo — unlimited invoices, custom branding, partial payments, reminders
* Agency: $39/mo — up to 5 team users, multi-client profiles, simple export
* Payments fee: +1% platform fee on successful charges (on top of Stripe fees)

---

## 2) Architecture Overview

**Stack:**

* **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS (v4), Shadcn UI, Framer Motion
* **Auth + DB**: Supabase (Row Level Security), Postgres
* **Payments**: Stripe Connect (Express accounts), Stripe Elements, Webhooks
* **Email/SMS**: Resend (email), Twilio (optional SMS)
* **Hosting**: Vercel (frontend + serverless API routes)
* **Analytics**: PostHog (product analytics), Logtail/BetterStack (logs)

**High-level flow:**

1. Merchant signs up → creates/links Stripe Connect Express account
2. Merchant creates invoice → customer receives secure link
3. Customer pays with Stripe Checkout/Elements → webhook updates invoice → receipts sent
4. Admin (or platform owner) can view/manage merchant account details and Stripe onboarding progress inside the same application

---

## 3) Merchant Management Module

### Purpose

Provide a secure, internal dashboard to monitor and manage all merchant accounts without needing a separate application.

### Core Capabilities

* View all merchants with onboarding and payout status
* View merchant-level data: invoices, payments, volume processed, payout balances
* Generate Stripe Express dashboard login links
* Suspend or disable merchant accounts (soft lock)
* Send onboarding reminders or notifications

### Database Additions

```sql
alter table users add column is_admin boolean default false;
alter table users add column onboarding_status text default 'pending';
alter table users add column payouts_enabled boolean default false;
alter table users add column stripe_balance numeric(12,2) default 0;
```

### Admin Routes

| Route                                      | Purpose                                                |
| ------------------------------------------ | ------------------------------------------------------ |
| `GET /api/admin/merchants`                 | List all merchants w/ Connect ID + status              |
| `GET /api/admin/merchants/:id`             | Retrieve details (Stripe acct info, payouts, invoices) |
| `POST /api/admin/merchants/:id/login-link` | Generate Stripe Express dashboard link                 |
| `POST /api/admin/merchants/:id/suspend`    | Soft-disable merchant temporarily                      |

All admin routes require the Supabase **Service Role** key; never exposed client-side.

### Admin UI

* **Merchant List**: Displays merchant name, email, Connect ID, onboarding status (Pending / Onboarded / Verified / Payout Disabled)
* **Merchant Details View**: Shows Stripe balances, total processed volume, last payout date, and direct link to Stripe dashboard
* **Actions**: Generate login link, send onboarding reminder, toggle payout access

### Security

* Route-level middleware ensures only `is_admin = true` can access `/admin/*`
* Data isolation enforced by RLS; admin queries use service role for full access

### Future Scalability

* If merchant volume grows, extract `/admin` as **BildOut Ops** micro-app using the same Supabase schema via API keys.

---

## 4) Data Model (Postgres / Supabase)

### Core Tables

All tables from the original specification remain, with the following additions to the `users` table:

```sql
-- Additional fields for merchant management
alter table public.users add column if not exists is_admin boolean default false;
alter table public.users add column if not exists onboarding_status text default 'pending';
alter table public.users add column if not exists payouts_enabled boolean default false;
alter table public.users add column if not exists stripe_balance numeric(12,2) default 0;

comment on column public.users.is_admin is 'Admin flag for platform operators';
comment on column public.users.onboarding_status is 'Stripe Connect onboarding status (pending/verified/complete)';
comment on column public.users.payouts_enabled is 'Whether merchant can receive payouts';
comment on column public.users.stripe_balance is 'Cached Stripe account balance for dashboard display';
```

---

## 5) Admin Dashboard Wireframe (Simplified)

**Sidebar:** Merchants • Payouts • Invoices • Logs

**Merchant List View:**

| Merchant     | Connect ID | Onboarding | Payouts | Balance | Actions                       |
| ------------ | ---------- | ---------- | ------- | ------- | ----------------------------- |
| ABC Electric | acct_123   | Complete   | ✅       | $12,450 | [Open Stripe] [View]          |
| HandyPro LLC | acct_456   | Pending    | ❌       | $0      | [Resend Onboarding] [Suspend] |

**Merchant Detail View:**

* Stripe Connect ID: acct_123
* Onboarding Status: Complete
* Payouts Enabled: Yes
* Balance: $12,450
* Last Payout: Oct 10, 2025
* Total GMV: $45,000
* Buttons: [Open Stripe Dashboard] [Suspend Merchant] [Send Reminder]

---

## 6) Integration Notes

* Use `stripe.accounts.retrieve(acct_id)` to pull merchant verification and payout info.
* Use `stripe.accounts.createLoginLink(acct_id)` for admin/merchant access to the Stripe Express dashboard.
* Use Stripe webhooks to update onboarding status and balance automatically.

```ts
// Example webhook event
if (event.type === 'account.updated') {
  const acct = event.data.object;
  await db.update('users', {
    stripe_connect_id: acct.id,
    onboarding_status: acct.details_submitted ? 'verified' : 'pending',
    payouts_enabled: acct.payouts_enabled
  });
}
```

---

## 7) Build Plan (Revised Timeline)

| Week                 | Focus                                                             | Deliverables           |
| -------------------- | ----------------------------------------------------------------- | ---------------------- |
| **Week 1-3**         | Core invoice and payment functionality                            | Complete               |
| **Week 4 (Current)** | Add merchant management schema + stub admin routes                | Completed within 1 day |
| **Week 5**           | Implement `/admin/merchants` UI and dashboard                     | 1–2 days               |
| **Week 6**           | Wire to Stripe Connect API (list accounts, balances, login links) | 1 day                  |
| **Week 7**           | Admin polish: search/filter merchants, resend onboarding          | 1 day                  |
| **Week 8+**          | Optional: Extract `/admin` to standalone **BildOut Ops** app      | Post-MVP               |

---

## 8) Security Summary

* Merchant management limited to internal admins
* Admin actions logged (audit trail)
* Stripe webhooks verified
* No card or payout data stored locally

---

## 9) Success Criteria Update

* Admin dashboard operational by Day 45
* Merchant KYC completion rate ≥90%
* Ability to view payouts and balances per merchant without Stripe dashboard dependency
* Platform owner visibility into total GMV, fees, and account health

---

## 10) Pricing Tiers

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
| Client profiles              | Unlimited     | Unlimited     | Unlimited       |
| Export (CSV/JSON)            | ❌            | ✅            | ✅              |
| Priority support             | ❌            | ❌            | ✅              |

---

*End of MVP spec for BildOut (bildout.com).*
