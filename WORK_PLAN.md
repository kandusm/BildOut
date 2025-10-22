# BildOut — Development Work Plan

**Project Duration:** 17 weeks (MVP to Launch)
**Last Updated:** 2025-10-15
**Status:** Week 5 Complete ✅ - Ready for Week 6: Admin-Stripe Integration
**Domain:** bildout.com

> **Note:** This is the detailed tactical work plan. See `BUILD_PLAN.md` for strategic phased timeline.

---

## Table of Contents

1. [Overview](#overview)
2. [Phase 1: Foundation (Week 1-2)](#phase-1-foundation-week-1-2)
3. [Phase 2: Core Features (Week 3-4)](#phase-2-core-features-week-3-4)
4. [Phase 3: Growth & Launch (Week 5-6)](#phase-3-growth--launch-week-5-6)
5. [Daily Task Breakdown](#daily-task-breakdown)
6. [Dependency Map](#dependency-map)
7. [Testing Strategy](#testing-strategy)
8. [Launch Checklist](#launch-checklist)

---

## Overview

### Project Goals
- **Week 1-3 Goal (✅ COMPLETE):** Core MVP - Invoice creation, client/item management, Stripe Connect basics
- **Week 4 Goal (✅ COMPLETE):** Merchant management database schema + admin API routes
- **Week 5 Goal (✅ COMPLETE):** Admin dashboard UI
- **Week 6 Goal (⏳ NEXT):** Admin-Stripe integration + audit logs
- **Week 7 Goal:** Admin polish + testing
- **Week 8-17 Goal:** Full feature set, SEO pages, testing, production launch

### Key Principles
1. **Ship early, iterate fast** — Deploy to production by Week 17
2. **Payment flow first** — Core value is getting merchants paid
3. **Admin visibility** — Platform operators can manage merchants without separate app
4. **SEO as growth driver** — Content pages drive organic signups
5. **Stripe test mode throughout** — Switch to live mode only at launch

### Success Metrics (Current Phase - Week 4-8)
- [x] Full invoice-to-payment flow working ✅
- [x] Stripe Connect onboarding working ✅
- [ ] Admin dashboard operational
- [ ] Merchant management functional
- [ ] All merchants can create and send invoices
- [ ] Payments processing successfully

---

## Phase 1: Foundation (Week 1-2) — ✅ COMPLETE

**Objective:** Get a working payment flow from invoice creation to successful payment.

**Status:** All core infrastructure, authentication, database schema, and Stripe Connect basics have been completed.

### Week 1: Infrastructure — ✅ COMPLETE

#### Day 1: Project Setup — ✅ COMPLETE
**Time: 4-6 hours**

- [x] Initialize Next.js 15 project
  ```bash
  pnpm create next-app@latest invoice-app --typescript --tailwind --app
  cd invoice-app
  pnpm install
  ```

- [ ] Configure Tailwind CSS v3.4
  - Update `tailwind.config.ts` with extended theme
  - Add CSS variables for theming
  - Test with sample components

- [ ] Initialize Shadcn UI
  ```bash
  pnpm dlx shadcn-ui@latest init
  pnpm dlx shadcn-ui@latest add button input label card table dialog badge
  ```

- [ ] Set up project structure
  ```
  app/
    (auth)/
    (dashboard)/
    (marketing)/
    api/
    pay/
  components/
    ui/
    invoice/
    payments/
  lib/
    supabase/
    stripe/
    validations/
    calculations/
  types/
  ```

- [ ] Configure ESLint + Prettier
- [ ] Create `.env.local` template
- [ ] Initialize git repository

**Deliverable:** Clean project scaffold with UI library working

---

#### Day 2: Supabase Setup
**Time: 4-6 hours**

- [ ] Create Supabase project at https://supabase.com
- [ ] Copy connection strings to `.env.local`
- [ ] Install Supabase dependencies
  ```bash
  pnpm add @supabase/supabase-js @supabase/ssr
  ```

- [ ] Create database migrations (see TECHNICAL_SPEC.md Section 4)
  - `supabase/migrations/001_initial_schema.sql`
  - Run: `supabase db push` (or via Supabase dashboard)

- [ ] Set up Supabase clients
  - `lib/supabase/client.ts` (browser client)
  - `lib/supabase/server.ts` (server client)
  - `lib/supabase/middleware.ts` (auth middleware)

- [ ] Enable Row Level Security (RLS) policies
  - Copy RLS policies from TECHNICAL_SPEC.md
  - Test with sample queries

- [ ] Create database trigger for new user onboarding
  - Auto-create organization + user profile on signup

**Deliverable:** Database schema live with RLS working

---

#### Day 3: Authentication
**Time: 4-6 hours**

- [ ] Configure Supabase Auth
  - Enable email auth provider
  - Set up magic link templates
  - Configure redirect URLs

- [ ] Build auth pages
  - `app/(auth)/login/page.tsx`
  - `app/(auth)/signup/page.tsx`
  - `app/(auth)/callback/page.tsx`

- [ ] Implement auth helpers
  - `lib/auth/get-user.ts` — server-side user fetch
  - `lib/auth/require-auth.ts` — protected route wrapper

- [ ] Create auth components
  - `LoginForm` with email input
  - `SignupForm` with business name + email
  - `AuthProvider` for client-side auth state

- [ ] Test full auth flow
  - Signup → magic link → callback → dashboard redirect
  - Login → magic link → callback → dashboard redirect

**Deliverable:** Working authentication with auto org creation

---

#### Day 4: Stripe Connect Setup
**Time: 6-8 hours**

- [ ] Create Stripe test account (already have ✅)
- [ ] Install Stripe dependencies
  ```bash
  pnpm add stripe @stripe/stripe-js @stripe/react-stripe-js
  ```

- [ ] Set up Stripe API helper
  - `lib/stripe/server.ts` — server-side Stripe client
  - `lib/stripe/client.ts` — client-side Stripe loader

- [ ] Build Connect account creation flow
  - `POST /api/stripe/connect/account` → creates Express account
  - Store `account.id` in `users.stripe_connect_id`

- [ ] Build onboarding link generator
  - `POST /api/stripe/connect/link` → returns `accountLink.url`
  - Handle refresh/return URLs

- [ ] Build onboarding status checker
  - `GET /api/stripe/connect/status` → checks `details_submitted`
  - Update `users.stripe_onboarding_complete`

- [ ] Create onboarding UI
  - `app/(dashboard)/settings/payments/page.tsx`
  - Display status badge (incomplete/pending/complete)
  - "Complete Onboarding" button

- [ ] Test Express account creation
  - Use Stripe test mode
  - Complete onboarding in Stripe dashboard
  - Verify status updates in database

**Deliverable:** Stripe Connect Express accounts can be created and onboarded

---

#### Day 5: Invoice Data Model
**Time: 6-8 hours**

- [ ] Create TypeScript types
  - `types/database.ts` — Supabase generated types
  - `types/invoice.ts` — Invoice, InvoiceItem, InvoiceStatus
  - `types/client.ts` — Client
  - `types/payment.ts` — Payment, PaymentStatus

- [ ] Build calculation helpers
  - `lib/calculations/invoice.ts`
    - `calculateLineTotal()`
    - `calculateInvoiceTotals()`
    - `round()`

- [ ] Build validation schemas (Zod)
  - `lib/validations/invoice.ts`
    - `CreateInvoiceSchema`
    - `UpdateInvoiceSchema`
  - `lib/validations/client.ts`
  - `lib/validations/payment.ts`

- [ ] Create invoice API routes
  - `POST /api/invoices` — create invoice
    - Generate invoice number (increment sequence)
    - Calculate totals server-side
    - Generate `payment_link_token`
    - Insert invoice + items in transaction
  - `GET /api/invoices` — list invoices (filtered by org_id)
  - `GET /api/invoices/[id]` — get single invoice
  - `PUT /api/invoices/[id]` — update invoice
  - `DELETE /api/invoices/[id]` — soft delete

- [ ] Test API routes
  - Create sample invoice via Postman/curl
  - Verify RLS filtering (can't access other org's invoices)
  - Verify totals calculation accuracy

**Deliverable:** Invoice CRUD API working with proper security

---

### Week 2: Payment Flow

#### Day 6: Public Payment Page
**Time: 6-8 hours**

- [ ] Create payment page route
  - `app/pay/[token]/page.tsx`
  - Public route (no auth required)
  - Fetch invoice by `payment_link_token`

- [ ] Build payment page UI
  - Invoice summary (items, totals, due date)
  - Merchant branding (logo, name)
  - Payment amount selector
    - "Pay Full" button (default)
    - "Pay Deposit" button (if `deposit_required`)
    - Custom amount input (if `allow_partial`)
  - Stripe Elements form (card input)

- [ ] Create payment intent API
  - `POST /api/payments/intent`
    - Input: `{ token, amount? }`
    - Validate amount (>= deposit, <= amountDue)
    - Create Stripe PaymentIntent with `application_fee_amount`
    - Return `clientSecret`

- [ ] Integrate Stripe Elements
  - Wrap payment form with `<Elements>`
  - Use `CardElement` or `PaymentElement`
  - Handle `confirmPayment()` on submit
  - Show loading states + error messages

- [ ] Test payment flow (Stripe test cards)
  - Card: `4242 4242 4242 4242` (success)
  - Card: `4000 0000 0000 9995` (decline)
  - Verify payment intent created in Stripe dashboard

**Deliverable:** Customers can enter payment details (no webhook yet)

---

#### Day 7: Webhook Integration
**Time: 6-8 hours**

- [ ] Set up webhook endpoint
  - `POST /api/webhooks/stripe`
  - Verify webhook signature
  - Store event in `stripe_events` table (idempotency)

- [ ] Implement webhook handlers
  - `payment_intent.succeeded`
    - Create `payments` record
    - Update invoice `amount_paid`, `amount_due`, `status`
    - Transition status: `sent → partial/paid`
  - `payment_intent.payment_failed`
    - Log failure
    - Optionally notify merchant
  - `account.updated`
    - Sync `stripe_onboarding_complete` status

- [ ] Test webhooks locally
  - Install Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
  - Trigger test events: `stripe trigger payment_intent.succeeded`
  - Verify database updates

- [ ] Deploy webhook endpoint (optional for Week 2)
  - Deploy to Vercel preview
  - Register webhook in Stripe dashboard
  - Test with live webhook events

**Deliverable:** Webhooks update invoice status after payment

---

#### Day 8: Email Notifications
**Time: 4-6 hours**

- [x] Set up Resend account
- [ ] Install dependencies
  ```bash
  pnpm add resend @react-email/components
  ```

- [ ] Create email templates
  - `emails/invoice-sent.tsx`
    - Subject: "Invoice #{number} from {merchant}"
    - Body: Invoice summary + payment link
  - `emails/payment-receipt.tsx`
    - Subject: "Payment received for Invoice #{number}"
    - Body: Amount, last 4 digits, receipt PDF

- [ ] Build email sending helper
  - `lib/email/send-invoice.ts`
  - `lib/email/send-receipt.ts`

- [ ] Integrate email sending
  - `POST /api/invoices/[id]/send` → send invoice email
  - Webhook handler → send receipt email on payment success

- [ ] Test emails
  - Send test invoice to your email
  - Verify links work
  - Check spam score (mail-tester.com)

**Deliverable:** Invoice emails + payment receipts sent automatically

---

#### Day 9-10: Basic Dashboard
**Time: 10-12 hours**

- [ ] Create dashboard layout
  - `app/(dashboard)/layout.tsx`
    - Sidebar navigation
    - User menu (logout, settings)
    - Stripe onboarding banner (if incomplete)

- [ ] Build overview page
  - `app/(dashboard)/dashboard/page.tsx`
    - Key metrics: total invoices, paid, overdue, GMV
    - Recent invoices table
    - Quick actions (create invoice, view payments)

- [ ] Build invoice list page
  - `app/(dashboard)/invoices/page.tsx`
    - Data table with sorting, filtering
    - Status badges (draft, sent, paid, etc.)
    - Actions: view, edit, duplicate, send, delete

- [ ] Build invoice create/edit page
  - `app/(dashboard)/invoices/new/page.tsx`
  - `app/(dashboard)/invoices/[id]/page.tsx`
    - Multi-step form or single page
    - Client selector (or create new)
    - Line items table (add/remove rows)
    - Totals preview (live calculation)
    - Settings: due date, deposit, partial payments
    - Save as draft or send immediately

- [ ] Build invoice view/detail page
  - Display invoice summary
  - Show payment history
  - Actions: send, download PDF, copy payment link
  - Status timeline (draft → sent → paid)

- [ ] Test full merchant flow
  1. Sign up → complete Stripe onboarding
  2. Create invoice with line items
  3. Send invoice via email
  4. Open payment link (incognito)
  5. Pay with test card
  6. Verify invoice marked as paid
  7. Receive payment receipt email

**Deliverable:** End-to-end invoice + payment flow working

---

## Phase 2: Core Features & Merchant Management (Week 3-7)

**Objective:** Add merchant management module, polish dashboard, complete feature set for admin visibility.

### Week 3: Feature Expansion — ✅ COMPLETE

**Status:** Client management, item catalog, PDF generation, partial payments, settings, and branding all completed.

#### Day 11: Client Management
**Time: 4-6 hours**

- [ ] Create client API routes
  - `GET /api/clients` — list clients
  - `POST /api/clients` — create client
  - `GET /api/clients/[id]` — get client
  - `PUT /api/clients/[id]` — update client
  - `DELETE /api/clients/[id]` — soft delete

- [ ] Build client pages
  - `app/(dashboard)/clients/page.tsx`
    - Table with search/filter
    - Add client button
  - `app/(dashboard)/clients/[id]/page.tsx`
    - Client details form
    - Invoice history for this client

- [ ] Build client selector component
  - `components/invoice/client-selector.tsx`
    - Combobox with search (Shadcn)
    - "Create new client" inline form

**Deliverable:** Clients can be managed and linked to invoices

---

#### Day 12: Item Catalog
**Time: 4-6 hours**

- [ ] Create item API routes
  - `GET /api/items` — list items
  - `POST /api/items` — create item
  - `GET /api/items/[id]` — get item
  - `PUT /api/items/[id]` — update item
  - `DELETE /api/items/[id]` — soft delete

- [ ] Build item pages
  - `app/(dashboard)/items/page.tsx`
    - Table of preset items
    - Add item button

- [ ] Build item selector component
  - `components/invoice/item-selector.tsx`
    - Combobox with search
    - Pre-fills unit price, tax rate, description

**Deliverable:** Reusable line items speed up invoice creation

---

#### Day 13: PDF Generation
**Time: 6-8 hours**

- [ ] Install PDF dependencies
  ```bash
  pnpm add @react-pdf/renderer
  ```

- [ ] Create PDF template
  - `components/pdf/invoice-pdf.tsx`
    - Professional invoice layout
    - Merchant logo + branding
    - Line items table
    - Totals breakdown
    - Payment instructions

- [ ] Build PDF generation API
  - `POST /api/invoices/[id]/pdf`
    - Render React PDF to buffer
    - Upload to Supabase Storage
    - Generate signed URL (7-day expiry)
    - Update `invoices.pdf_url`

- [ ] Add PDF actions to dashboard
  - "Download PDF" button on invoice detail page
  - Auto-generate PDF when invoice is sent

- [ ] Test PDF output
  - Verify layout on different screen sizes
  - Check logo/branding rendering
  - Test signed URL expiry

**Deliverable:** Professional PDFs generated for every invoice

---

#### Day 14: Partial Payments
**Time: 4-6 hours**

- [ ] Update payment intent API
  - Support custom `amount` parameter
  - Validate: `amount >= depositRequired && amount <= amountDue`

- [ ] Update payment page UI
  - Show deposit amount prominently
  - Add "Pay Custom Amount" input
  - Display payment history (if partial payments exist)

- [ ] Update webhook handler
  - Handle multiple payments for same invoice
  - Correctly calculate `amount_paid` + `amount_due`
  - Transition status: `sent → partial → paid`

- [ ] Test partial payment flow
  - Create $1000 invoice with $250 deposit
  - Pay $250 → verify status = 'partial'
  - Pay $750 → verify status = 'paid'

**Deliverable:** Customers can pay invoices in multiple installments

---

#### Day 15: Settings & Branding
**Time: 4-6 hours**

- [ ] Build settings pages
  - `app/(dashboard)/settings/page.tsx` — General settings
  - `app/(dashboard)/settings/branding/page.tsx`
    - Upload logo (Supabase Storage)
    - Brand color picker
    - Invoice prefix (e.g., "QB" → "ACME")
  - `app/(dashboard)/settings/payments/page.tsx`
    - Stripe onboarding status
    - Payout schedule display

- [ ] Store branding in `organizations.metadata`
  ```json
  {
    "branding": {
      "logo_url": "...",
      "primary_color": "#0ea5e9",
      "invoice_prefix": "ACME"
    }
  }
  ```

- [ ] Apply branding to PDFs + payment pages
  - Use merchant logo
  - Apply custom color to payment page header

**Deliverable:** Merchants can customize their invoice branding

---

### Week 4: Merchant Management Module — 🔄 IN PROGRESS

**Objective:** Add database schema and API foundation for platform admin capabilities.

#### Day 16: Database Schema + Migration — ✅ COMPLETE
**Time: 3-4 hours**

- [x] Add merchant management fields to users table
  - `is_admin` boolean flag for platform operators
  - `onboarding_status` text field (pending/incomplete/complete/verified)
  - `payouts_enabled` boolean for Stripe payout status
  - `stripe_balance` numeric field for cached balance
- [x] Create admin_audit_log table for tracking admin actions
- [x] Add indexes and constraints for performance
- [x] Implement RLS policies for admin access
- [x] Create migration file `007_add_merchant_management_fields.sql`
- [x] Execute migration in Supabase

**Deliverable:** Database schema supports merchant management ✅

---

#### Day 17: Admin Middleware + API Routes — ✅ COMPLETE
**Time: 6-8 hours**

- [x] Create admin middleware
  - `lib/admin/require-admin.ts` — Check is_admin flag
  - Protect `/admin/*` and `/api/admin/*` routes
  - Redirects non-admin users to dashboard
- [x] Create admin API routes
  - `GET /api/admin/merchants` — List all merchants with Connect status
  - `GET /api/admin/merchants/:id` — Get merchant details with Stripe sync
  - `POST /api/admin/merchants/:id/login-link` — Generate Stripe login link
  - `POST /api/admin/merchants/:id/suspend` — Suspend merchant
  - `POST /api/admin/merchants/:id/resume` — Resume merchant
- [x] Implement admin authentication
  - `requireAdmin()` function checks is_admin flag
  - `isAdmin()` non-redirecting version for conditional rendering
  - `getAdminStatus()` for UI components
- [x] Add audit logging for all admin actions
- [x] Create test suite and documentation
  - `test-admin-api.js` — Automated test script
  - `ADMIN_TESTING_GUIDE.md` — Manual testing guide

**Deliverable:** Admin API foundation ready for UI integration ✅

---

#### Day 16-17: Dashboard Improvements (DEFERRED TO WEEK 5)
**Time: 10-12 hours**

- [ ] Add advanced filtering
  - Filter invoices by status, date range, client
  - Search by invoice number or client name

- [ ] Add bulk actions
  - Select multiple invoices
  - Bulk send, bulk delete

- [ ] Add invoice duplication
  - `POST /api/invoices/[id]/duplicate`
  - Copy all line items, increment invoice number

- [ ] Add payment history view
  - `app/(dashboard)/payments/page.tsx`
  - Table of all payments with filters

- [ ] Add status transition tracking
  - Track when invoice moved from sent → viewed → paid
  - Display timeline on invoice detail page

- [ ] Improve form validation
  - Real-time error messages
  - Better UX for required fields

- [ ] Add loading states + skeletons
  - Skeleton loaders for tables
  - Loading spinners for actions

**Deliverable:** Polished dashboard with excellent UX

---

#### Day 18: ACH Payments (Optional)
**Time: 4-6 hours**

**Note:** ACH can be deferred post-MVP if time is tight.

- [ ] Enable ACH in Stripe Connect accounts
  - Add `us_bank_account_payments` capability

- [ ] Update payment page UI
  - Add payment method selector (card vs ACH)
  - Display ACH verification notice (1-3 day settlement)

- [ ] Test ACH payment flow
  - Use Stripe test bank account: `000123456789`
  - Verify longer processing time handled

**Deliverable:** ACH as alternative payment method

---

#### Day 19: Overdue Detection
**Time: 3-4 hours**

- [ ] Create cron job
  - `app/api/cron/overdue/route.ts`
  - Query invoices where `due_date < today` and `status IN ('sent', 'viewed', 'partial')`
  - Update status to 'overdue'
  - Send reminder email

- [ ] Create overdue reminder email template
  - `emails/overdue-reminder.tsx`
  - Friendly tone, include payment link

- [ ] Configure Vercel Cron
  - Add to `vercel.json`
  - Run daily at 9am

- [ ] Test cron locally
  - Manually trigger via API call with secret

**Deliverable:** Automated overdue detection + reminders

---

### Week 5: Admin Dashboard UI — ✅ COMPLETE

**Objective:** Build the admin interface for merchant management.

#### Day 18-19: Admin Dashboard Layout + Merchant List — ✅ COMPLETE
**Time: 2 hours (mostly already implemented)**

- [x] Admin layout exists
  - `app/admin/layout.tsx` with sidebar navigation ✅
  - Navigation: Merchants • Analytics • Logs • Back to Dashboard ✅
  - Admin-only middleware protection ✅
- [x] Merchant list page exists
  - `app/admin/merchants/page.tsx` ✅
  - Data table with merchants from Supabase ✅
  - Columns: Name, Org, Connect ID, Status, Payouts, Balance, Date, Actions ✅
  - Action buttons: View Details ✅
  - Search and filter by status ✅
  - Color-coded status badges ✅
- [x] Added admin navigation to main dashboard
  - Admin link in dashboard header ✅
  - Admin card in dashboard grid ✅
  - Conditional rendering for admin users only ✅

**Deliverable:** Admin can view all merchants in dashboard ✅

---

#### Day 20: Merchant Detail Page — ✅ COMPLETE
**Time: Already implemented**

- [x] Merchant detail page exists
  - `app/admin/merchants/[id]/page.tsx` ✅
  - Account information section (IDs, dates, prefix) ✅
  - Financial summary (balance, GMV, invoice stats) ✅
  - Recent invoices table (last 10) ✅
  - Recent payments table (last 10) ✅
  - Action buttons via MerchantActions component ✅
    - Open Stripe Dashboard (login link) ✅
    - Suspend/Resume Merchant ✅
    - Send Onboarding Reminder (placeholder) ✅
- [x] Stripe data sync working
  - Real-time account info ✅
  - Balance display ✅
  - Payment statistics ✅
- [x] All actions tested and functional

**Deliverable:** Comprehensive merchant detail view operational ✅

---

### Week 6: Admin-Stripe Integration — ⏳ UPCOMING

**Objective:** Connect admin dashboard to Stripe Connect API for real-time data.

#### Day 21: Stripe Integration + Login Links
**Time: 6-8 hours**

- [ ] Implement Stripe account retrieval
  - Call `stripe.accounts.retrieve()` in admin routes
  - Cache account data in database
- [ ] Build Stripe login link functionality
  - Generate links with `stripe.accounts.createLoginLink()`
  - Open in new tab from admin dashboard
- [ ] Build balance sync functionality
  - Query Stripe balance API
  - Update users.stripe_balance field
  - Display in admin dashboard
- [ ] Add webhook handling for account.updated
  - Automatically sync onboarding_status
  - Update payouts_enabled flag
- [ ] Test suspend/resume merchant
  - Soft-disable in database (add suspended flag if needed)
  - Display warning on merchant dashboard

**Deliverable:** Admin can access real-time Stripe data and manage merchant accounts

---

### Week 7: Admin Polish & Testing — ⏳ UPCOMING

**Objective:** Polish admin experience and test all merchant management flows.

#### Day 22: Search, Filters, and Audit Logging
**Time: 4-6 hours**

- [ ] Add global merchant search
  - Search by name, email, Connect ID
  - Debounced input with real-time results
- [ ] Implement advanced filters
  - Filter by onboarding status
  - Filter by balance range
  - Filter by date range (created_at)
- [ ] Build audit log tracking
  - Insert records into admin_audit_log on all admin actions
  - Log IP address and user agent
  - Store metadata (e.g., previous values for updates)
- [ ] Create admin audit log viewer
  - `app/admin/logs/page.tsx`
  - Display recent admin actions
  - Filter by admin user, action type, date

**Deliverable:** Full audit trail and advanced search capabilities

---

#### Day 23: Testing & Dashboard Improvements (RESUMED FROM WEEK 4)
**Time: 6-8 hours**

- [ ] End-to-end testing
  - Create fresh test account
  - Complete full flow: signup → onboard → invoice → payment
  - Test edge cases:
    - Invalid payment amounts
    - Expired signed URLs
    - Concurrent payments
    - RLS violations (access other org's data)

- [ ] Fix critical bugs
  - Prioritize payment flow bugs
  - Fix any RLS leaks
  - Resolve calculation errors

- [ ] Performance optimization
  - Add database indexes (see TECHNICAL_SPEC.md)
  - Optimize slow queries
  - Lazy load large components

- [ ] Security audit
  - Verify all API routes check auth
  - Test webhook signature verification
  - Ensure no secrets in client code

**Deliverable:** Stable, secure MVP ready for beta users

---

## Phase 3: Growth & Launch (Week 8-17)

**Objective:** Launch SEO content, complete all features, deploy to production, onboard beta users.

> **Note:** Weeks 8-17 follow the BUILD_PLAN.md timeline. See BUILD_PLAN.md for full details on each phase.

### Week 8-9: Payment Processing Enhancements

**Goal:** Complete payment features and improve UX

**Key Tasks:**
- Public payment page improvements
- Partial payment support (if not complete)
- Payment receipts via email
- ACH payment testing
- Apple Pay / Google Pay support

---

### Week 9: Email & Notifications

**Goal:** Automate communication with clients

**Key Tasks:**
- Resend domain setup
- Email templates (invoice, receipt, overdue)
- Cron job for overdue detection
- Email notification preferences

---

### Week 10: PDF Generation

**Goal:** Generate professional PDF invoices

**Key Tasks:**
- PDF generation implementation (React PDF or Puppeteer)
- Invoice PDF template design
- Logo upload functionality
- PDF storage in Supabase
- Email PDFs as attachments

---

### Week 11-12: SEO & Marketing Pages

#### Day 21-23: SEO Template Pages
**Time: 12-15 hours**

**Target: 20 pages (templates + how-to)**

- [ ] Set up content structure
  - `app/(marketing)/templates/[niche]/page.tsx`
  - `app/(marketing)/how-to/[slug]/page.tsx`

- [ ] Create template page component
  - Hero: "{Niche} Invoice Template - Free Download"
  - Sample invoice image/preview
  - Download buttons (PDF, Word, Google Docs)
  - CTA: "Create Invoice Online" → signup
  - FAQ section (schema.org markup)

- [ ] Generate 10 niche template pages
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

- [ ] Generate 10 how-to pages
  11. How to Invoice as an Electrician
  12. Estimate vs Invoice: What's the Difference?
  13. What to Include on a Contractor Invoice
  14. How to Accept ACH Payments
  15. Late Fee Policies
  16. Deposit vs Partial Payment
  17. Add Sales Tax by State
  18. Create Recurring Invoices
  19. Get Paid Faster: Email Scripts
  20. Add Apple Pay to Invoices

- [ ] Add schema.org markup
  - SoftwareApplication schema on homepage
  - HowTo schema on how-to pages
  - Article schema on blog posts

- [ ] Optimize for SEO
  - Meta titles (50-60 chars)
  - Meta descriptions (150-160 chars)
  - Header hierarchy (H1 → H2 → H3)
  - Internal linking (templates → how-to → signup)
  - Alt text on images

- [ ] Generate OG images
  - Use @vercel/og for dynamic OG images
  - Template: "{Niche} Invoice Template | BildOut"

**Deliverable:** 20 SEO pages live and indexable

---

#### Day 24: City Pages (Programmatic)
**Time: 4-6 hours**

**Target: 10 city pages**

- [ ] Create dynamic route
  - `app/(marketing)/templates/[niche]/[city]/page.tsx`

- [ ] Use `generateStaticParams` for top cities
  ```typescript
  export async function generateStaticParams() {
    const niches = ['electrician', 'roofer', 'plumber', 'hvac', 'landscaping'];
    const cities = ['austin', 'dallas', 'houston', 'san-antonio', 'fort-worth'];
    return niches.flatMap(niche =>
      cities.map(city => ({ niche, city }))
    );
  }
  ```

- [ ] Customize content per city
  - "{Niche} Invoice Template - {City}, TX"
  - Include local business tips
  - Link to state-specific tax guide

- [ ] Deploy initial 10 city pages
  - 5 niches × 2 cities = 10 pages
  - Expand to more cities post-launch

**Deliverable:** Localized SEO pages for major cities

---

#### Day 25: Landing Page & Pricing
**Time: 6-8 hours**

- [ ] Build landing page
  - `app/(marketing)/page.tsx`
  - Hero: "Get Paid Faster with Professional Invoices"
  - 3-step explainer (Create → Send → Get Paid)
  - Social proof (testimonials, logos)
  - Feature highlights (partial payments, ACH, branding)
  - CTA: "Start Free" → signup

- [ ] Build pricing page
  - `app/(marketing)/pricing/page.tsx`
  - 3-tier comparison table (Free, Pro, Agency)
  - FAQ section
  - CTA: "Start Free" or "Upgrade to Pro"

- [ ] Add Framer Motion animations
  - Fade-in on scroll
  - Smooth page transitions
  - Button hover effects

**Deliverable:** Conversion-optimized landing + pricing pages

---

### Week 13-17: Final Features, Testing, and Launch

**Summary of remaining phases:**
- Week 13: Branding & Customization
- Week 14: Analytics & Reporting
- Week 15: Subscription & Billing
- Week 16: Testing & Polish
- Week 17: Launch Preparation

See BUILD_PLAN.md for detailed breakdown of each week.

---

### Week 17+: Launch Prep

#### Day 26: Analytics & Monitoring
**Time: 4-6 hours**

- [ ] Set up PostHog
  - Install PostHog SDK
  - Track key events:
    - `user_signed_up`
    - `stripe_onboarding_completed`
    - `invoice_created`
    - `invoice_sent`
    - `payment_succeeded`
  - Create dashboard with funnels

- [ ] Set up BetterStack (Logtail)
  - Install Logtail SDK
  - Log errors + API requests
  - Set up alerts for critical errors

- [ ] Add error boundaries
  - Catch React errors
  - Display friendly error messages
  - Log to BetterStack

**Deliverable:** Full visibility into user behavior + errors

---

#### Day 27: Subscription Logic (Optional)
**Time: 6-8 hours**

**Note:** Can defer to post-MVP if time is tight. Start with honor system (track invoice count, show upgrade prompts).

- [ ] Create subscription tiers table
  ```sql
  create table public.subscriptions (
    id uuid primary key default gen_random_uuid(),
    org_id uuid not null references public.organizations (id),
    tier text not null check (tier in ('free', 'pro', 'agency')),
    status text not null check (status in ('active', 'canceled', 'past_due')),
    stripe_subscription_id text,
    current_period_end timestamptz,
    created_at timestamptz default now()
  );
  ```

- [ ] Integrate Stripe Billing
  - Create Stripe Products + Prices
  - Create Checkout Session for upgrades
  - Handle subscription webhooks (`customer.subscription.*`)

- [ ] Add tier enforcement
  - Check invoice count vs tier limit
  - Show "Upgrade" prompt when limit reached
  - Block invoice creation if over limit (Free tier)

- [ ] Build billing portal link
  - Use Stripe Customer Portal for subscription management

**Deliverable:** Paid subscriptions enabled (or upgrade prompts if deferred)

---

#### Day 28: Agency Features (Optional)
**Time: 4-6 hours**

**Note:** Can defer to post-MVP. Agency plan is high value but low urgency.

- [ ] Add team member invites
  - `POST /api/team/invite` → send email invite
  - `GET /api/team/accept/:token` → add user to org

- [ ] Add role-based permissions
  - Check `users.role` in API routes
  - Hide admin actions from 'member' role

- [ ] Add CSV export
  - `GET /api/invoices/export` → generate CSV
  - Include all invoices for date range

**Deliverable:** Multi-user support for Agency tier

---

#### Day 29: Production Deployment
**Time: 4-6 hours**

- [ ] Prepare production environment
  - Set up Vercel production project
  - Configure environment variables (production)
  - Set up custom domain (e.g., bildout.app)

- [ ] Switch Stripe to live mode
  - Create live mode API keys
  - Update webhook endpoints
  - Test Connect onboarding in live mode

- [x] Set up Resend custom domain
  - Add DNS records (SPF, DKIM)
  - Verify domain
  - Test email deliverability

- [ ] Deploy to production
  ```bash
  git push origin main
  vercel --prod
  ```

- [ ] Smoke test production
  - Create test account
  - Complete onboarding
  - Create + send invoice
  - Make test payment ($0.50)
  - Verify webhook fired

**Deliverable:** Production app live at custom domain

---

#### Day 30: Beta Launch
**Time: 4-6 hours**

- [ ] Prepare launch assets
  - Demo video (2 minutes)
  - Screenshot gallery
  - Press kit (logo, description)

- [ ] Onboard 10 beta users
  - Reach out to network
  - Offer lifetime Pro ($99 one-time) for first 100 users
  - Collect feedback

- [ ] Monitor early usage
  - Watch PostHog for errors
  - Check email deliverability
  - Monitor Stripe dashboard for payments

- [ ] Iterate based on feedback
  - Fix critical bugs immediately
  - Note feature requests for post-MVP

**Deliverable:** 10 beta users actively using BildOut

---

## Daily Task Breakdown

### Summary by Week

| Week   | Focus                              | Status      | Key Deliverable                                |
|--------|------------------------------------|-------------|------------------------------------------------|
| 1-2    | Infrastructure + Auth + Stripe     | ✅ Complete | Stripe Connect onboarding working              |
| 3      | Features (clients, items, PDF)     | ✅ Complete | Polished dashboard with full feature set       |
| 4      | Merchant Management (API)          | ✅ Complete | Admin middleware + API routes ready            |
| 5      | Admin Dashboard UI                 | ✅ Complete | Merchant list and detail pages functional      |
| 6      | Admin-Stripe Integration           | ⏳ Upcoming | Real-time Stripe data in admin dashboard       |
| 7      | Admin Polish + Testing             | ⏳ Upcoming | Search, filters, audit logs                    |
| 8-9    | Payment Processing Enhancements    | ⏳ Upcoming | ACH, Apple Pay, receipts                       |
| 9      | Email & Notifications              | ⏳ Upcoming | Automated emails and overdue detection         |
| 10     | PDF Generation                     | ⏳ Upcoming | Professional PDF invoices                      |
| 11-12  | SEO & Marketing Pages              | ⏳ Upcoming | 30 SEO pages live + landing page               |
| 13     | Branding & Customization           | ⏳ Upcoming | Custom branding for merchants                  |
| 14     | Analytics & Reporting              | ⏳ Upcoming | Dashboard metrics and insights                 |
| 15     | Subscription & Billing             | ⏳ Upcoming | Tiered pricing and billing                     |
| 16     | Testing & Polish                   | ⏳ Upcoming | Bug fixes, performance, security               |
| 17     | Launch Preparation                 | ⏳ Upcoming | Production deployment + beta users             |

**Total Timeline:** 17 weeks (~4 months) to full launch

---

## Dependency Map

### Critical Path (Must Complete in Order)

```
1. Project Setup
   ↓
2. Database Schema
   ↓
3. Authentication
   ↓
4. Stripe Connect Setup
   ↓
5. Invoice CRUD API
   ↓
6. Payment Page + Stripe Elements
   ↓
7. Webhook Integration
   ↓
8. Email Notifications
   ↓
9. Dashboard UI
```

### Parallel Workstreams (Can Do Concurrently)

**After Day 10 (Core Flow Complete):**
- Client management (Day 11)
- Item catalog (Day 12)
- PDF generation (Day 13)
- Settings & branding (Day 15)

**After Day 20 (MVP Stable):**
- SEO pages (Days 21-24)
- Landing page (Day 25)
- Analytics (Day 26)
- Subscription logic (Day 27)

---

## Testing Strategy

### Manual Testing Checklist

**Authentication:**
- [ ] Signup with magic link
- [ ] Login with magic link
- [ ] Callback redirects correctly
- [ ] Organization auto-created

**Stripe Connect:**
- [ ] Express account created
- [ ] Onboarding link works
- [ ] Status updates after onboarding complete
- [ ] Can create PaymentIntent for connected account

**Invoice Flow:**
- [ ] Create invoice with line items
- [ ] Totals calculated correctly (subtotal, tax, discount, total)
- [ ] Invoice number auto-increments
- [ ] Payment link generated
- [ ] Can edit invoice
- [ ] Can delete invoice (soft delete)

**Payment Flow:**
- [ ] Payment page loads via token (no auth)
- [ ] Payment intent created
- [ ] Stripe Elements renders
- [ ] Card payment succeeds (test card)
- [ ] Card payment fails gracefully (declined card)
- [ ] Webhook updates invoice status
- [ ] Payment record created

**Email:**
- [ ] Invoice sent email delivered
- [ ] Payment link works in email
- [ ] Receipt email sent after payment
- [ ] Emails not marked as spam

**RLS Security:**
- [ ] Cannot access other org's invoices via API
- [ ] Cannot access other org's clients via API
- [ ] Public payment page works without auth
- [ ] Webhook endpoint bypasses auth correctly

### Automated Testing (Post-MVP)

**Priority Tests:**
1. Unit tests for calculation functions
2. Integration tests for API routes
3. E2E tests for payment flow (Playwright)

---

## Launch Checklist

### Pre-Launch (Day 29)

**Infrastructure:**
- [ ] Production Vercel project configured
- [ ] Custom domain set up (DNS + SSL)
- [ ] Environment variables set (production)
- [ ] Database backups enabled (Supabase)
- [ ] Error monitoring active (BetterStack)

**Stripe:**
- [ ] Live mode API keys configured
- [ ] Webhook endpoint registered (live mode)
- [ ] Connect Express onboarding tested (live)
- [ ] Test payment processed in live mode

**Email:**
- [x] Custom domain verified (Resend)
- [x] SPF/DKIM records added
- [x] Test email sent from custom domain
- [x] Email deliverability > 95%

**Content:**
- [ ] 30 SEO pages live
- [ ] Landing page live
- [ ] Pricing page live
- [ ] Legal pages (Privacy, Terms, Refunds)
- [ ] Meta tags + OG images on all pages

**Analytics:**
- [ ] PostHog tracking code live
- [ ] Key events firing correctly
- [ ] Conversion funnel set up
- [ ] BetterStack logging active

### Launch Day (Day 30)

- [ ] Deploy to production (main branch)
- [ ] Verify all pages load
- [ ] Test critical user flows
- [ ] Announce to beta list
- [ ] Post on social media (Twitter, LinkedIn)
- [ ] Submit to Product Hunt (optional)
- [ ] Monitor analytics + error logs

### Post-Launch (Week 7+)

- [ ] Collect user feedback
- [ ] Fix critical bugs within 24 hours
- [ ] Publish 2-3 new SEO pages per week
- [ ] Iterate on conversion funnel
- [ ] Add requested features
- [ ] Scale to 100+ users

---

## Risk Mitigation

### High-Risk Areas

| Risk                                   | Mitigation                                           |
|----------------------------------------|------------------------------------------------------|
| Stripe Connect onboarding too slow     | Pre-test with test account; simplify UI              |
| Payment webhooks fail silently         | Add webhook retry logic + monitoring                 |
| RLS policies leak data                 | Write tests for cross-org access attempts            |
| Email deliverability low               | Use custom domain + warm up sending gradually        |
| SEO pages not indexed                  | Submit sitemap.xml, request indexing via GSC         |
| Invoice calculations incorrect         | Unit test all calculation functions                  |

### Backup Plans

**If behind schedule by Week 3:**
- Cut ACH payments (defer to Week 7)
- Cut agency features (defer to Week 8)
- Reduce SEO pages to 20 (10 templates + 10 how-to)

**If Stripe Connect issues:**
- Fall back to standard Stripe Checkout (no Connect)
- Platform fee charged separately (less elegant but works)

**If PDF generation too slow:**
- Use simple HTML → print CSS instead of React PDF
- Generate PDFs async (queue job)

---

## Success Criteria

### Week 2 Milestone — ✅ COMPLETE
- [x] Invoice created in dashboard ✅
- [x] Payment link works ✅
- [x] Payment succeeds via Stripe Elements ✅
- [x] Webhook updates invoice status ✅
- [x] Receipt email sent ✅

### Week 4 Milestone — ✅ COMPLETE
- [x] All core features working ✅
- [x] Database schema supports merchant management ✅
- [x] Admin API routes created ✅
- [x] Middleware protecting admin routes ✅
- [x] Ready for Week 5 admin UI development ✅

### Week 7 Milestone (Admin Complete)
- [ ] Admin dashboard functional
- [ ] Merchant list displaying all users
- [ ] Merchant detail page with Stripe data
- [ ] Admin can generate Stripe login links
- [ ] Audit log tracking all admin actions

### Week 17 Milestone (MVP Launch)
- [ ] 30 SEO pages indexed by Google
- [ ] 100 signups
- [ ] 25 activated merchants (≥1 invoice sent)
- [ ] 10 paying Pro subscribers
- [ ] $1,500 GMV processed
- [ ] 1,000 organic sessions/month

---

## Post-MVP Roadmap

### Week 7-8: Growth
- Expand to 50 SEO pages
- Add more city pages (50+ cities)
- Launch affiliate program
- Add QuickBooks/Xero export

### Week 9-10: Retention
- Recurring invoices
- Invoice reminders (auto-send after X days)
- Customer portal (view all invoices from one merchant)
- Multi-currency support
- **In-app support widget** (upgrade from Formspree)
  - Create `support_tickets` table
  - Support modal in dashboard header
  - Auto-populate user context (name, email, org_id)
  - Email notifications to support team
  - Admin panel for managing tickets
  - Status tracking (open, in_progress, closed)

### Week 11-12: Expansion
- Quote → Invoice flow
- Expense tracking
- Basic reporting dashboard
- Mobile app (React Native)
- **API Access (Agency Plan Feature)**
  - Generate API keys for Agency subscribers
  - API key management page in settings
  - REST API endpoints for invoices, clients, payments
  - Rate limiting per plan tier
  - API documentation site
  - Webhook support for events
  - API authentication via Bearer tokens
  - Usage tracking and analytics
- **Advanced Analytics (Agency Plan Feature)**
  - Client lifetime value (LTV) tracking
  - Revenue forecasting based on trends
  - Cohort analysis (revenue by acquisition month)
  - Payment timing analytics (avg days to payment)
  - Client churn tracking
  - Comparative period analysis (YoY, MoM growth)
  - Custom report builder
  - Scheduled email reports
  - Subscription gating for analytics features
- **White-Label Options (Agency Plan Feature)**
  - Custom domain for payment pages (e.g., pay.clientcompany.com)
  - Remove BildOut branding from invoices and payment pages
  - Custom logo on all client-facing pages
  - Custom color scheme/theme
  - Custom email templates with agency branding
  - Agency name instead of "Powered by BildOut"
  - Custom terms of service and privacy policy links
  - Agency-branded mobile apps (future)

---

## Disaster Recovery & System Resilience

**Priority:** High — Critical for production reliability
**Context:** AWS/Supabase outage on 2025-10-20 highlighted need for resilience planning

### Scenario 1: Database Outage (Supabase/AWS Down)

#### Immediate Protections
- [ ] **Graceful Error Handling**
  - Replace generic errors with user-friendly messages
  - Distinguish between service issues vs user errors
  - Show clear status: "We're experiencing technical difficulties. Your data is safe."
  - Preserve user input in forms during outages

- [ ] **Retry Logic with Exponential Backoff**
  - Implement for all database queries
  - Max 3 retries with 1s, 2s, 4s delays
  - Queue non-critical operations for later
  - Log all retry attempts for monitoring

- [ ] **Request Queuing**
  - Queue failed writes (invoice saves, client updates)
  - Auto-retry when connection restored
  - Show user: "Saving... will complete when connection restored"
  - Store queue in localStorage/IndexedDB

- [ ] **Data Caching Strategy**
  - Cache frequently accessed data (invoice list, clients, items, settings)
  - Use stale-while-revalidate pattern
  - Allow offline viewing of recently loaded data
  - Cache duration: 5 minutes for lists, 30 minutes for settings

#### User Experience
- [ ] **Status Banner Component**
  - Create `<ServiceStatusBanner />` component
  - Show at top of dashboard when services degraded
  - Colors: Yellow for degraded, Red for outage
  - Link to status page or show ETA if known
  - Auto-dismiss when services restored

- [ ] **Email Notifications**
  - Notify users of in-progress transactions affected by outage
  - Send update when service restored
  - Template: "Your invoice is queued and will complete soon"

---

### Scenario 2: Payment Processor Outage (Stripe Down)

#### Immediate Protections
- [ ] **Payment Queue System**
  - Store payment attempts in `pending_payments` table
  - Include: invoice_id, amount, customer_email, stripe_payment_intent_id
  - Auto-retry every 5 minutes for 24 hours
  - Email merchant when payment completes

- [ ] **Payment Status Tracking**
  - New invoice status: `payment_pending`
  - Show badge: "Payment processing - will retry automatically"
  - Add "Retry Now" button for manual retry
  - Store last_payment_attempt timestamp

- [ ] **Stripe Webhook Resilience**
  - Implement webhook retry logic
  - Store webhook events in `webhook_events` table
  - Process events idempotently
  - Alert if webhook failing for >1 hour

- [ ] **Fallback Payment Links**
  - Generate Stripe payment links as backup
  - Email to customer if in-app payment fails
  - Track which method completed payment
  - Update invoice status when payment detected

#### User Communication
- [ ] **Clear Status Messaging**
  - "Payment system temporarily unavailable"
  - "Your payment will be processed automatically"
  - Show retry countdown or ETA
  - Provide support contact for urgent payments

- [ ] **Merchant Dashboard**
  - Show pending payments count
  - List all queued payments with status
  - Manual retry button per payment
  - Last attempt timestamp

---

### Scenario 3: Complete Site Outage (Vercel Down)

**Challenge:** If Vercel is down, the entire application is inaccessible.

#### Prevention Strategies
- [ ] **Multi-Region Deployment** (Long-term)
  - Deploy to multiple Vercel regions
  - Use Vercel's geo-routing
  - Cost: ~$20/month per additional region

- [ ] **Status Page (External Hosting)**
  - Host on separate infrastructure (GitHub Pages, Netlify, CloudFlare Pages)
  - Domain: status.bildout.com
  - Update manually or via API during outages
  - Show: Service status, incident updates, ETA

- [ ] **Static Fallback Page**
  - Host on CloudFlare Pages (free tier)
  - Minimal HTML: "BildOut is temporarily unavailable"
  - Show status, ETA, support email
  - No dynamic functionality, just information

#### Immediate Access Workarounds
- [ ] **Critical Invoice Access** (Email-based)
  - Send invoice PDF + payment link via email immediately on creation
  - Customers can pay even if site is down (Stripe hosted page)
  - Payment link remains valid for 30 days
  - Webhooks will update invoice status when site returns

- [ ] **Emergency Contact System**
  - Provide support email prominently: support@bildout.com
  - Auto-responder with status update and ETA
  - Manual invoice/payment processing via email during outage
  - Document manual payment reconciliation process

- [ ] **SMS Notifications** (Optional - Future)
  - Send payment links via SMS to customers
  - Require phone number collection
  - Use Twilio for delivery
  - Cost: ~$0.01 per message

#### Data Recovery & Business Continuity
- [ ] **Database Backups**
  - Supabase auto-backups daily (verify configuration)
  - Manual export capability via Supabase dashboard
  - Store critical backups in separate cloud (S3, Google Drive)
  - Test restore process monthly

- [ ] **Stripe Data as Backup**
  - All payment data lives in Stripe (survives Vercel outage)
  - Can reconcile invoices from Stripe data
  - Export Stripe data monthly as backup
  - Document recovery procedure from Stripe

- [ ] **Emergency Admin Access**
  - Direct Supabase access for admin users
  - Document SQL queries for critical operations
  - Emergency runbook for manual invoice creation
  - Keep admin credentials in secure location (1Password)

---

### Scenario 4: Multi-Service Outage (Cascading Failures)

**Example:** Vercel + Stripe both down, or AWS + Stripe

#### Response Plan
- [ ] **Communication Priority**
  - Update status page first (external hosting)
  - Tweet from company account
  - Email all active merchants
  - Update support auto-responder

- [ ] **Manual Payment Acceptance**
  - Document process for accepting checks/wire transfers
  - Email template for manual payment instructions
  - Manual invoice marking as paid
  - Reconciliation checklist when services restored

- [ ] **Customer List Export**
  - Weekly export of all customer contact info
  - Store in secure location (encrypted S3, 1Password Documents)
  - Enables direct communication during total outage
  - Include: merchant email, business name, customers with pending invoices

---

### Monitoring & Alerting

- [ ] **Health Check Endpoints**
  - `/api/health` — overall system status
  - `/api/health/database` — Supabase connection
  - `/api/health/stripe` — Stripe API status
  - Return JSON: `{ status: "ok" | "degraded" | "down", message: "..." }`

- [ ] **External Monitoring** (UptimeRobot or BetterUptime)
  - Monitor all health check endpoints
  - Alert via email + SMS on failure
  - Check every 1 minute
  - Free tier available

- [ ] **Error Rate Tracking**
  - Log all API errors to Vercel Analytics
  - Alert if error rate >5% for 5 minutes
  - Track by endpoint (database errors vs payment errors)
  - Dashboard for real-time monitoring

- [ ] **Circuit Breaker Pattern**
  - Stop making requests to failing services after threshold
  - Prevent cascading failures
  - Return cached/degraded responses instead
  - Auto-reset after cooldown period

---

### Implementation Priority

**NOTE:** All disaster recovery and resilience features are scheduled for **POST-LAUNCH** implementation.
Focus remains on core feature completion and launch readiness through Week 17.

**Phase 1 (Post-Launch Week 1-2): Essential Resilience**
1. Graceful error handling with user-friendly messages
2. Status banner component
3. Payment retry logic and queue
4. Health check endpoints
5. External monitoring setup

**Phase 2 (Post-Launch Week 3-4): Enhanced Protection**
6. Request queuing for database operations
7. Data caching strategy
8. Email notifications for failed operations
9. Error rate tracking
10. Static status page on external hosting

**Phase 3 (Post-Launch Month 2+): Advanced Resilience**
11. Circuit breaker implementation
12. Multi-region deployment (evaluate cost/benefit)
13. SMS notifications for critical payments
14. Automated backup verification
15. Disaster recovery runbooks and testing

---

### Testing Strategy

- [ ] **Outage Simulation**
  - Test database disconnect (stop Supabase container)
  - Test Stripe failures (mock API errors)
  - Test Vercel deployment failures
  - Verify error messages, retry logic, queues

- [ ] **Recovery Testing**
  - Verify queued operations complete when service restored
  - Test data integrity after outage
  - Confirm payments reconcile correctly
  - Check webhook processing catches up

- [ ] **Monthly DR Drills**
  - Practice database restore from backup
  - Test manual payment processing
  - Verify emergency contact lists current
  - Update runbooks based on findings

---

**End of Work Plan**

---

## Quick Reference: Key Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Build for production
pnpm lint                   # Run ESLint

# Supabase
supabase start              # Start local Supabase
supabase db push            # Push migrations
supabase gen types typescript --local > types/database.ts

# Stripe
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger payment_intent.succeeded

# Deployment
vercel                      # Deploy to preview
vercel --prod               # Deploy to production
```

---

## Contact & Support

**Technical Questions:** Refer to `TECHNICAL_SPEC.md`
**Architecture Questions:** See Section 2 of `TECHNICAL_SPEC.md`
**Strategic Timeline:** See `BUILD_PLAN.md` for phased development approach
**MVP Specifications:** See `MVP_SPEC.md` for product requirements
**Stripe Issues:** https://stripe.com/docs/connect
**Supabase Issues:** https://supabase.com/docs

---

## Current Status (Week 5 — ✅ COMPLETE)

**What's Done:**
- ✅ Complete core invoice and payment functionality
- ✅ Client and item management
- ✅ Stripe Connect integration
- ✅ Database migration for merchant management fields
- ✅ Audit log table and RLS policies
- ✅ Admin middleware and authentication
- ✅ All admin API routes implemented
- ✅ Admin dashboard UI with sidebar navigation
- ✅ Merchant list page with search and filters
- ✅ Merchant detail page with comprehensive data
- ✅ Merchant action buttons (Stripe login, suspend, resume)
- ✅ Admin navigation integrated into main dashboard

**What's Next:**
- ⏳ Week 6: Admin-Stripe Integration + Audit Logs
  - Implement webhook handler for `account.updated`
  - Build audit log viewer page (`/admin/logs`)
  - Add enhanced financial reporting
  - Improve automatic status syncing

**Ready to continue? Next task: Week 6 - Admin-Stripe Integration + Audit Logs**
