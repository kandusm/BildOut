# BildOut Launch Plan & Testing Checklist

**Last Updated:** 2025-10-21
**Launch Target:** Week 17 (Day 29-30)

---

## Table of Contents

1. [Pre-Launch Checklist (Days 1-28)](#pre-launch-checklist)
2. [Launch Day Checklist (Day 29-30)](#launch-day-checklist)
3. [Post-Launch Testing Plan (Week 1)](#post-launch-testing-plan)
4. [Monitoring & Support Plan](#monitoring--support-plan)
5. [Rollback Plan](#rollback-plan)

---

## Pre-Launch Checklist (Days 1-28)

### Infrastructure & Deployment

- [ ] **Production Vercel Project**
  - [ ] Create new Vercel project (separate from preview)
  - [ ] Configure production domains
  - [ ] Set up automatic deployments from `main` branch
  - [ ] Configure build settings (Node 18+, Next.js)
  - [ ] Set deployment protection (require approval for production)

- [ ] **Custom Domain Setup**
  - [ ] Register domain: bildout.com (or bildout.app)
  - [ ] Configure DNS A/CNAME records to point to Vercel
  - [ ] Enable SSL certificate (auto via Vercel)
  - [ ] Set up www redirect (www.bildout.com → bildout.com)
  - [ ] Verify all pages accessible via custom domain
  - [ ] Test SSL certificate validity

- [ ] **Environment Variables (Production)**
  - [ ] `NEXT_PUBLIC_APP_URL` = https://bildout.com
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` (production)
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` (production)
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` (production)
  - [ ] `STRIPE_SECRET_KEY` (live mode)
  - [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (live mode)
  - [ ] `STRIPE_WEBHOOK_SECRET` (live mode endpoint)
  - [ ] `RESEND_API_KEY` (production)
  - [ ] `ADMIN_EMAIL` (your email for admin access)
  - [ ] Verify NO test mode keys in production

- [ ] **Database (Supabase Production)**
  - [ ] Create production Supabase project
  - [ ] Run all migrations in order (001-020+)
  - [ ] Verify all tables created correctly
  - [ ] Enable Point-in-Time Recovery (PITR backups)
  - [ ] Set up daily backups (automatic via Supabase)
  - [ ] Test database connection from production app
  - [ ] Verify RLS policies are active on all tables
  - [ ] Create first admin user (your account)
  - [ ] Test admin authentication works

---

### Stripe Configuration (Live Mode)

- [ ] **Stripe Account**
  - [ ] Switch to Live mode in Stripe Dashboard
  - [ ] Complete business verification (if required)
  - [ ] Add bank account for payouts
  - [ ] Enable Connect Express (Applications → Add Platform)

- [ ] **API Keys**
  - [ ] Copy Live Secret Key to Vercel env vars
  - [ ] Copy Live Publishable Key to Vercel env vars
  - [ ] Verify test mode keys NOT in production

- [ ] **Webhooks**
  - [ ] Create webhook endpoint: https://bildout.com/api/webhooks/stripe
  - [ ] Subscribe to events:
    - `checkout.session.completed`
    - `customer.subscription.created`
    - `customer.subscription.updated`
    - `customer.subscription.deleted`
    - `invoice.payment_succeeded`
    - `invoice.payment_failed`
    - `account.updated` (Connect)
  - [ ] Copy webhook signing secret to env vars
  - [ ] Test webhook with Stripe CLI (live mode)

- [ ] **Stripe Connect**
  - [ ] Test full onboarding flow in live mode
  - [ ] Verify Express account creation works
  - [ ] Test generating login links for connected accounts
  - [ ] Confirm platform fees are correctly configured

- [ ] **Test Payment (Live Mode)**
  - [ ] Create test invoice
  - [ ] Process real payment (use your own card, $1 test)
  - [ ] Verify payment shows in Stripe Dashboard
  - [ ] Verify webhook fires and invoice marked paid
  - [ ] Refund test payment

---

### Email Configuration (Resend)

- [x] **Domain Verification**
  - [x] Add bildout.com to Resend
  - [x] Configure SPF record
  - [x] Configure DKIM record
  - [x] Verify domain status = "Verified"

- [x] **DMARC Record**
  - [x] Add DMARC DNS record (currently p=none)
  - [ ] Monitor DMARC reports for 2 weeks
  - [ ] Update to p=quarantine after monitoring

- [x] **Test Emails**
  - [x] Send test from noreply@bildout.com
  - [x] Verify deliverability to Gmail, Outlook, corporate email
  - [x] Check spam score (mail-tester.com > 8/10)
  - [ ] Test magic link authentication email
  - [ ] Test invoice notification email
  - [ ] Test payment receipt email
  - [ ] Test all email templates render correctly

---

### Content & SEO

- [ ] **Landing Page**
  - [ ] Hero section complete
  - [ ] Features section
  - [ ] Pricing section
  - [ ] CTA buttons work
  - [ ] Mobile responsive
  - [ ] Load time < 2 seconds

- [ ] **Pricing Page**
  - [ ] All plans displayed correctly
  - [ ] "Coming Soon" tags on unimplemented features
  - [ ] Checkout buttons work
  - [ ] Mobile responsive

- [ ] **Legal Pages**
  - [ ] Privacy Policy (review for accuracy)
  - [ ] Terms of Service (review for accuracy)
  - [ ] Refund Policy
  - [ ] Contact page or info

- [ ] **SEO Pages**
  - [ ] 30 pages live (templates + how-to guides)
  - [ ] All pages have unique meta titles
  - [ ] All pages have meta descriptions
  - [ ] All pages have OG images
  - [ ] Internal linking structure
  - [ ] Sitemap.xml generated
  - [ ] Submit sitemap to Google Search Console
  - [ ] Request indexing for key pages

- [ ] **Meta Tags**
  - [ ] Set metadataBase in root layout.tsx
  - [ ] OG images for homepage, pricing, guides
  - [ ] Twitter card tags
  - [ ] Favicon.ico in public folder

---

### Analytics & Monitoring

- [ ] **PostHog (Analytics)**
  - [ ] Create PostHog project
  - [ ] Add PostHog script to app
  - [ ] Verify tracking in production
  - [ ] Set up key events:
    - `user_signed_up`
    - `invoice_created`
    - `invoice_sent`
    - `payment_completed`
    - `subscription_started`
  - [ ] Create conversion funnel
  - [ ] Set up cohort analysis

- [ ] **Error Monitoring (BetterStack or Sentry)**
  - [ ] Create BetterStack account
  - [ ] Add error logging to API routes
  - [ ] Set up alerts for 5xx errors
  - [ ] Test error tracking with intentional error
  - [ ] Configure email alerts

- [ ] **Uptime Monitoring**
  - [ ] Set up UptimeRobot or Pingdom
  - [ ] Monitor https://bildout.com every 5 minutes
  - [ ] Monitor /api/health endpoint
  - [ ] Configure SMS alerts for downtime

---

### Security & Performance

- [ ] **Security Scan**
  - [ ] Run Lighthouse security audit
  - [ ] Verify all API routes require authentication
  - [ ] Test RLS policies (can't access other org's data)
  - [ ] Verify admin routes require admin role
  - [ ] Check for exposed API keys in client code
  - [ ] Test CSRF protection
  - [ ] Verify rate limiting on auth endpoints

- [ ] **Performance Optimization**
  - [ ] Run Lighthouse performance test (target > 90)
  - [ ] Optimize images (next/image used)
  - [ ] Enable caching headers
  - [ ] Test page load times < 2s
  - [ ] Check Time to Interactive < 3s
  - [ ] Verify lazy loading of heavy components

- [ ] **Mobile Testing**
  - [ ] Test on iOS Safari
  - [ ] Test on Android Chrome
  - [ ] Verify responsive design on tablets
  - [ ] Test touch interactions
  - [ ] Verify forms work on mobile keyboards

---

### Subscription & Billing

- [ ] **Stripe Subscriptions**
  - [ ] Create Pro plan product in Stripe (live mode)
  - [ ] Create Agency plan product in Stripe (live mode)
  - [ ] Set prices: $15/mo (Pro), $49/mo (Agency)
  - [ ] Copy Price IDs to env vars:
    - `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`
    - `NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID`
  - [ ] Test subscription checkout flow
  - [ ] Test subscription webhook updates
  - [ ] Test billing portal access
  - [ ] Test plan upgrades/downgrades

- [ ] **Subscription Limits**
  - [ ] Test Free plan invoice limit (10/month)
  - [ ] Test Free plan client limit (5)
  - [ ] Test Pro analytics access
  - [ ] Verify Free users redirected from analytics
  - [ ] Test upgrade prompts work

---

### Final Pre-Launch Testing

- [ ] **Critical User Flows (End-to-End)**
  - [ ] New user signup flow
    - [ ] Sign up with email
    - [ ] Receive magic link email
    - [ ] Login successfully
    - [ ] See onboarding/dashboard
  - [ ] Invoice creation flow
    - [ ] Create client
    - [ ] Create invoice
    - [ ] Preview invoice
    - [ ] Send invoice (email sent)
  - [ ] Payment flow
    - [ ] Open payment link
    - [ ] Enter card details
    - [ ] Complete payment
    - [ ] Receive receipt email
    - [ ] Invoice marked as paid
  - [ ] Stripe Connect onboarding
    - [ ] Start onboarding
    - [ ] Complete all steps
    - [ ] Get activated
    - [ ] Verify can accept payments

- [ ] **Browser Testing**
  - [ ] Chrome (Windows/Mac)
  - [ ] Safari (Mac/iOS)
  - [ ] Firefox
  - [ ] Edge
  - [ ] Mobile Safari
  - [ ] Mobile Chrome

- [ ] **Load Testing**
  - [ ] Test with 10 concurrent users
  - [ ] Verify no rate limit errors
  - [ ] Check database connection pool
  - [ ] Monitor API response times

---

## Launch Day Checklist (Day 29-30)

### Pre-Launch (Morning of Day 29)

- [ ] **Final Checks**
  - [ ] All pre-launch items completed ✅
  - [ ] Production build successful
  - [ ] Database backups verified
  - [ ] Monitoring dashboards open
  - [ ] Support email ready (support@bildout.com)

- [ ] **Deploy to Production**
  - [ ] Merge all changes to `main` branch
  - [ ] Tag release: `v1.0.0-launch`
  - [ ] Verify Vercel auto-deployment triggered
  - [ ] Monitor build logs for errors
  - [ ] Wait for deployment to complete
  - [ ] Verify new version live

### Launch Hour (Day 29 Afternoon)

- [ ] **Smoke Tests (Production)**
  - [ ] Homepage loads ✓
  - [ ] Login works ✓
  - [ ] Signup works ✓
  - [ ] Dashboard loads ✓
  - [ ] Create invoice works ✓
  - [ ] Send invoice works ✓
  - [ ] Payment page loads ✓
  - [ ] Stripe Connect onboarding works ✓
  - [ ] Analytics tracking fires ✓

- [ ] **Announcement**
  - [ ] Email beta list (if you have one)
  - [ ] Post on Twitter/X
  - [ ] Post on LinkedIn
  - [ ] Post in relevant Slack/Discord communities
  - [ ] (Optional) Submit to Product Hunt
  - [ ] (Optional) Submit to Hacker News Show HN

- [ ] **Monitor Closely (First 4 Hours)**
  - [ ] Watch error logs (BetterStack)
  - [ ] Monitor analytics (PostHog)
  - [ ] Check Stripe webhooks firing
  - [ ] Monitor email deliverability
  - [ ] Check uptime status
  - [ ] Respond to any user issues immediately

### Evening Check (Day 29)

- [ ] Review metrics:
  - [ ] Signups count
  - [ ] Error rate
  - [ ] Page load times
  - [ ] Stripe events received
- [ ] Fix any critical bugs found
- [ ] Respond to user feedback

---

## Post-Launch Testing Plan (Week 1)

### Day 1 (Launch Day)

**Focus:** Stability & Critical Bugs

- [ ] **Monitor All Day**
  - [ ] Check error dashboard every 30 minutes
  - [ ] Monitor user signups
  - [ ] Watch for failed payments
  - [ ] Check email delivery rates

- [ ] **Test as Real User**
  - [ ] Create account from incognito browser
  - [ ] Complete full invoice + payment flow
  - [ ] Test on different browser
  - [ ] Test on mobile device

- [ ] **Database Health**
  - [ ] Check database CPU usage
  - [ ] Monitor connection count
  - [ ] Verify backups running
  - [ ] Check for slow queries

### Day 2-3 (Post-Launch)

**Focus:** User Feedback & Quick Wins

- [ ] **User Testing**
  - [ ] Reach out to first 5 users for feedback
  - [ ] Fix any reported bugs within 24 hours
  - [ ] Monitor support emails
  - [ ] Track feature requests

- [ ] **Analytics Review**
  - [ ] Review funnel drop-off points
  - [ ] Check most visited pages
  - [ ] Analyze user behavior flow
  - [ ] Identify friction points

- [ ] **Performance Testing**
  - [ ] Check average page load times
  - [ ] Review API response times
  - [ ] Test under increased load (if traffic spiking)
  - [ ] Optimize slow queries

### Day 4-7 (First Week)

**Focus:** Optimization & Growth

- [ ] **Feature Testing with Real Users**
  - [ ] Verify invoice creation working smoothly
  - [ ] Check payment success rate
  - [ ] Monitor Stripe Connect onboarding completion rate
  - [ ] Review email open rates
  - [ ] Test analytics accuracy

- [ ] **SEO & Content**
  - [ ] Check Google indexing progress
  - [ ] Review search console for errors
  - [ ] Analyze organic traffic sources
  - [ ] Add more content if needed

- [ ] **Conversion Optimization**
  - [ ] A/B test CTAs if traffic allows
  - [ ] Optimize signup flow based on data
  - [ ] Reduce friction in payment flow
  - [ ] Test different pricing messaging

- [ ] **Bug Triage**
  - [ ] Fix P0 (critical) bugs within 4 hours
  - [ ] Fix P1 (high) bugs within 24 hours
  - [ ] Fix P2 (medium) bugs within 1 week
  - [ ] Log P3 (low) bugs for future sprints

---

## Known Issues to Fix Post-Launch

### Webhook Issues

- [ ] **Merchant account.updated webhook not auto-syncing**
  - **Issue:** When merchants complete Stripe Connect onboarding, the `account.updated` webhook fires successfully (200 OK) but the database UPDATE fails silently
  - **Current Status:** Webhook is configured correctly and receives proper data from Stripe
  - **Workaround:** Manual "Sync with Stripe" button works in admin panel
  - **Impact:** Low - Admins can manually sync, doesn't affect payments or user experience
  - **Root Cause:** Likely RLS policy issue or timing problem during webhook execution
  - **Priority:** P2 (Medium) - Fix within first month
  - **Investigation needed:**
    - Check Vercel function logs for silent errors
    - Review RLS policies for service role access
    - Consider adding retry logic to webhook handler
    - Add better error logging to identify exact failure point

### Missing Features

- [ ] **Password change functionality in settings**
  - **Issue:** Users cannot change their password from the settings page
  - **Current Status:** No password change UI in General Settings
  - **Workaround:** Users can use "Forgot Password" flow from login page
  - **Impact:** Low - Workaround exists, not blocking core functionality
  - **Priority:** P2 (Medium) - Add within first month
  - **Implementation needed:**
    - Add "Change Password" section to General Settings form
    - Require current password for security
    - Add API endpoint for password update via Supabase Auth
    - Test password reset email flow
    - Validate password strength requirements

- [ ] **Embedded Stripe Checkout for subscriptions**
  - **Issue:** Stripe Payment Links work but redirect users away from the site
  - **Current Status:** Using Payment Links as workaround for Stripe Checkout locale bug
  - **Workaround:** Payment Links redirect to Stripe-hosted page and back
  - **Impact:** Low - Payment Links work fine, but embedded checkout is more seamless
  - **Priority:** P3 (Low) - Nice to have within 3-6 months
  - **Implementation needed:**
    - Convert subscription page to client component
    - Add Stripe.js and Stripe Elements
    - Create embedded checkout form component
    - Handle session creation and completion callbacks
    - Update checkout API to return client_secret instead of redirect
  - **Benefits:**
    - Keeps users on bildout.com throughout payment
    - More control over styling and branding
    - Better user experience (no redirect)
  - **Considerations:**
    - Requires client-side Stripe integration
    - More complex than Payment Links
    - Only needed if Payment Links cause issues

- [ ] **Recall sent invoices for modification**
  - **Issue:** Once an invoice is sent, it cannot be recalled to make changes without voiding/canceling it
  - **Current Status:** Users must void the invoice and create a new one to make changes
  - **Workaround:** Void existing invoice and create new invoice with corrections
  - **Impact:** Medium - Adds friction when mistakes are made on sent invoices
  - **Priority:** P2 (Medium) - Add within 2-3 months
  - **Implementation needed:**
    - Add "Recall Invoice" button/action for sent invoices that haven't been paid
    - Change invoice status from 'sent' back to 'draft'
    - Clear sent_at timestamp
    - Optionally: Send notification email to client that invoice was recalled
    - Optionally: Invalidate/regenerate payment link token for security
    - Add audit trail entry for recall action
    - UI: Show recall option in invoice detail view and actions menu
    - Validation: Only allow recall if invoice hasn't received any payments
    - Validation: Only allow recall within X days of sending (e.g., 30 days)
  - **Considerations:**
    - Should payment link continue to work after recall? (Probably no - regenerate token)
    - Should client be notified? (Yes, with option to disable notification)
    - Should there be a time limit? (Recommend 30 days max)
    - What if partial payment received? (Block recall, require refund first)

- [ ] **Export to accounting software (QuickBooks, Sage, Xero)**
  - **Issue:** Users must manually enter invoice data into accounting software for bookkeeping
  - **Current Status:** No export functionality
  - **Workaround:** Manual data entry from BildOut to accounting software
  - **Impact:** Medium-High - Time-consuming for users with many invoices, key feature for professional contractors
  - **Priority:** P1 (High) - Add within 3-6 months (high user demand expected)
  - **Implementation phases:**
    - **Phase 1: CSV/Excel Export** (Easiest, 1-2 weeks)
      - Export invoices to CSV format
      - Export payments to CSV format
      - Export clients to CSV format
      - Include all relevant fields for manual import
      - Date range filtering
    - **Phase 2: QuickBooks Online Integration** (Medium, 1-2 months)
      - OAuth integration with QuickBooks Online API
      - Map BildOut invoices to QuickBooks invoices
      - Map BildOut clients to QuickBooks customers
      - Sync payments automatically
      - Handle invoice status updates
    - **Phase 3: Sage Integration** (Medium, 1-2 months)
      - Research Sage API options (Sage 50, Sage Business Cloud)
      - Similar mapping as QuickBooks
      - May require different approach per Sage product
    - **Phase 4: Xero Integration** (Medium, 1-2 months)
      - OAuth integration with Xero API
      - Similar mapping as QuickBooks
  - **Technical considerations:**
    - Chart of accounts mapping (income, assets, etc.)
    - Tax handling differences between systems
    - Multi-currency support
    - Duplicate detection (don't re-export same invoice)
    - Two-way sync vs one-way export
    - Error handling for API failures
  - **Business considerations:**
    - May need Pro/Agency plan feature (premium tier)
    - QuickBooks has ongoing OAuth costs
    - Consider starting with CSV export for all users (free)
    - API integrations as premium add-on ($10-20/month extra)

### Email & Notification Issues

- [ ] **Stripe automatic receipts from connected accounts**
  - **Issue:** Merchants' Stripe Connect accounts send automatic payment receipts, causing customers to receive duplicate receipts (one from Stripe, one from BildOut)
  - **Current Status:** Platform account has receipts disabled, but connected accounts send their own receipts
  - **Workaround:** Each merchant can disable receipts in their Stripe Express dashboard
  - **Impact:** Medium - Customers get confused receiving two receipts
  - **Priority:** P2 (Medium) - Fix within first month
  - **Implementation options:**
    - Document for merchants to disable in their dashboard
    - Or: Use Stripe API to disable receipts when creating/updating connected accounts
    - Or: Add setting in merchant onboarding to disable Stripe receipts automatically

---

## Post-Launch Priorities & Research

### Compliance & Legal (Within 3 Months)

- [ ] **Sales Tax Collection Research**
  - [ ] Research sales tax nexus requirements by state
  - [ ] Determine if BildOut has nexus in any states (based on platform location)
  - [ ] Research economic nexus thresholds (typically $100k revenue/200 transactions)
  - [ ] Evaluate sales tax calculation APIs (Stripe Tax, TaxJar, Avalara)
  - [ ] Decision: Implement sales tax collection or defer until threshold reached
  - [ ] If implementing:
    - [ ] Add structured address fields (street, city, state, zip, country)
    - [ ] Require business address during onboarding
    - [ ] Integrate sales tax API for automatic calculation
    - [ ] Update invoice generation to include sales tax
    - [ ] Update payment processing to collect tax
    - [ ] Register for sales tax permits in applicable states
    - [ ] Set up sales tax filing schedule

- [ ] **Business Address Collection**
  - [ ] Currently: Optional single-line text field in Settings
  - [ ] For sales tax: Need structured address (city, state, zip required)
  - [ ] Decision: Make address required or optional during signup vs later
  - [ ] Consider international addresses (country field)

### Disaster Recovery & Business Continuity

- [ ] **Database Backup & Recovery Testing**
  - [ ] Document and test Point-in-Time Recovery (PITR) process
  - [ ] Create disaster recovery runbook
  - [ ] Test full database restore from backup
  - [ ] Document RTO (Recovery Time Objective) and RPO (Recovery Point Objective)
  - [ ] Set up automated backup verification

- [ ] **Service Provider Contingency Plans**
  - [ ] Document backup plan if Supabase experiences outage
  - [ ] Document backup plan if Stripe experiences outage
  - [ ] Document backup plan if Vercel experiences outage
  - [ ] Document backup plan if Resend experiences outage
  - [ ] Create status page for communicating outages to users

---

## Monitoring & Support Plan

### Daily Monitoring (First 2 Weeks)

- [ ] **Morning Check (Every Day, 9 AM)**
  - [ ] Review error count (target < 10/day)
  - [ ] Check new signups (target 3-5/day week 1)
  - [ ] Monitor payment success rate (target > 95%)
  - [ ] Check email deliverability (target > 98%)
  - [ ] Review uptime (target 99.9%)

- [ ] **Evening Check (Every Day, 6 PM)**
  - [ ] Respond to all support emails
  - [ ] Review analytics highlights
  - [ ] Check for unhandled errors
  - [ ] Plan next day priorities

### Weekly Review (First Month)

- [ ] **Metrics Review**
  - [ ] Total signups
  - [ ] Activation rate (sent ≥1 invoice)
  - [ ] Payment volume (GMV)
  - [ ] Subscription conversions
  - [ ] Churn rate (if any)

- [ ] **Technical Health**
  - [ ] Database size and performance
  - [ ] API error rates
  - [ ] Webhook delivery success
  - [ ] Email bounce rates
  - [ ] Page load times

---

## Rollback Plan

### If Critical Bug Found

**Severity P0** (Site down, payments failing, data leak):

1. **Immediate Actions (Within 15 minutes)**
   - [ ] Put site in maintenance mode if needed
   - [ ] Identify the issue
   - [ ] Check recent deployments
   - [ ] Review error logs

2. **Rollback (Within 30 minutes)**
   - [ ] Revert to previous Vercel deployment
   - [ ] Or: Deploy hotfix to main branch
   - [ ] Verify rollback successful
   - [ ] Monitor for 1 hour

3. **Communication**
   - [ ] Post status update (if public-facing)
   - [ ] Email affected users (if data issue)
   - [ ] Document incident in log

### If Stripe Webhook Issues

1. **Check webhook dashboard in Stripe**
2. **Verify webhook secret matches**
3. **Check endpoint responding (200 OK)**
4. **Manually reconcile failed events**
5. **Re-send failed webhook events from Stripe**

### If Email Delivery Failing

1. **Check Resend dashboard for errors**
2. **Verify DNS records still valid**
3. **Check domain verification status**
4. **Test with mail-tester.com**
5. **Switch to backup email service if needed**

---

## Success Criteria (Week 1)

### Minimum Viable Success
- ✅ 0 critical bugs
- ✅ 99% uptime
- ✅ 10+ signups
- ✅ 3+ activated merchants
- ✅ 1+ paying subscriber
- ✅ $100+ GMV processed

### Target Success
- ✅ 50+ signups
- ✅ 10+ activated merchants
- ✅ 5+ paying subscribers
- ✅ $500+ GMV processed
- ✅ 500+ page views

### Stretch Success
- ✅ 100+ signups
- ✅ 25+ activated merchants
- ✅ 10+ paying subscribers
- ✅ $1,500+ GMV processed
- ✅ Product Hunt top 10

---

## Emergency Contacts

- **Vercel Support:** https://vercel.com/support
- **Supabase Support:** https://supabase.com/support
- **Stripe Support:** https://support.stripe.com
- **Resend Support:** support@resend.com
- **Domain Registrar:** [Your registrar support]

---

## Notes & Learnings

*Use this section to document learnings during launch week*

### What Went Well
-

### What Went Wrong
-

### What to Improve Next Time
-

---

**End of Launch Plan**
