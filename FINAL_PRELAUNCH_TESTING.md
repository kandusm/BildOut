# Final Pre-Launch Testing Plan

**Date Created:** 2025-10-26
**Purpose:** Complete end-to-end testing with clean database before production launch

## Overview

This document outlines the comprehensive testing process to verify all functionality works correctly before launching to production. We will:
1. Backup and truncate the database
2. Clean up all Stripe test data
3. Test every workflow from scratch
4. Verify security and RLS policies

---

## Phase 1: Database & Stripe Cleanup

### Step 1: Create Database Backup
Before any destructive operations, create a backup:

```bash
# Using Supabase CLI
supabase db dump -f backup-pre-launch-test.sql
```

**Verification:**
- Backup file created successfully
- File size reasonable (check contains data)

---

### Step 2: Document Stripe Connect Accounts
List all connected accounts to disconnect:

```bash
stripe accounts list --limit 100
```

**Actions:**
- Save the account IDs for cleanup
- Note how many accounts exist
- Document any that should be preserved

---

### Step 3: Truncate Database Tables
Execute in this order (respecting foreign key constraints):

```sql
-- Disable RLS temporarily for truncation
SET session_replication_role = 'replica';

-- Clear data in dependency order
TRUNCATE TABLE payments CASCADE;
TRUNCATE TABLE invoice_items CASCADE;
TRUNCATE TABLE invoices CASCADE;
TRUNCATE TABLE clients CASCADE;
TRUNCATE TABLE stripe_events CASCADE;
TRUNCATE TABLE admin_audit_log CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE organizations CASCADE;

-- Re-enable RLS
SET session_replication_role = 'origin';
```

**Verification:**
- Run `SELECT COUNT(*) FROM [table]` for each table
- All should return 0
- Schema/migrations still intact
- RLS policies still exist

---

### Step 4: Clean Up Stripe

**Connected Accounts:**
```bash
# For each account ID from Step 2
stripe accounts delete <account_id>
```

**Customers & Subscriptions:**
```bash
# List and delete all test customers (this also cancels subscriptions)
stripe customers list --limit 100

# For each customer
stripe customers delete <customer_id>
```

**Verification:**
- No customers remain
- No active subscriptions
- No connected accounts
- Fresh Stripe environment

---

## Phase 2: Complete Workflow Testing

### Test 1: User Signup & Onboarding
**Objective:** Verify new user registration and initial setup

**Test Steps:**
1. Sign up new user with fresh email
2. Verify email confirmation (if enabled)
3. Complete onboarding wizard
4. Verify organization created
5. Check dashboard loads correctly
6. Verify starts on Free plan

**Expected Results:**
- [ ] User record created with correct org_id
- [ ] Organization created with default settings
- [ ] RLS policies allow user to access only their data
- [ ] Dashboard shows "Get Started" prompts
- [ ] No console errors
- [ ] Page loads in <2 seconds

**Actual Results:**
```
[To be filled during testing]
```

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

### Test 2: Stripe Connect Onboarding
**Objective:** Verify merchant payment processing setup

**Test Steps:**
1. Navigate to Settings → Payments
2. Click "Connect Stripe Account"
3. Complete Stripe Connect onboarding flow (use test mode)
4. Return to app after completion
5. Verify account status updates
6. Check webhook received

**Expected Results:**
- [ ] `stripe_connect_id` saved to user record
- [ ] `onboarding_status` = 'complete'
- [ ] `payouts_enabled` = true
- [ ] `account.updated` webhook processed
- [ ] Can create invoices with payment links
- [ ] Settings page shows "Connected" status

**Actual Results:**
```
[To be filled during testing]
```

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

### Test 3: Client Management
**Objective:** Test client CRUD operations and limits

**Test Steps:**
1. Create new client with all fields (name, email, address, phone)
2. Edit client information
3. View client details page
4. Create clients 2-5 (total of 5)
5. Try to create 6th client on Free plan (should be blocked)
6. Verify upgrade prompt shown
7. Delete a client
8. Verify client removed from list

**Expected Results:**
- [ ] Clients created with correct org_id
- [ ] All fields save and display correctly
- [ ] RLS prevents accessing other orgs' clients
- [ ] Free plan limit enforced (5 clients max)
- [ ] Clear upgrade prompt on limit reached
- [ ] Client deletion works
- [ ] Invoice count updates on client page

**Actual Results:**
```
[To be filled during testing]
```

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

### Test 4: Invoice Lifecycle (Draft → Sent → Paid)
**Objective:** Test complete invoice workflow

**Test Steps:**
1. Create draft invoice with client
2. Add 3 line items with descriptions and amounts
3. Set tax rate (e.g., 8.5%)
4. Add discount (e.g., 10% or $50 fixed)
5. Set due date (7 days from now)
6. Save as draft
7. Edit draft invoice (change item)
8. Click "Send Invoice" → "Send via Email"
9. Check email received by client
10. Open payment link from email
11. View payment page as customer
12. Complete payment with test card (4242 4242 4242 4242)
13. Verify redirect to success page
14. Check invoice status updated to "paid"
15. Verify payment record created
16. Check payment receipt email sent

**Expected Results:**
- [ ] Invoice number auto-increments correctly
- [ ] Tax and discount calculations accurate
- [ ] Status transitions: draft → sent → paid
- [ ] Payment link token generated and works
- [ ] `payment_link_token` is unique and secure
- [ ] Invoice email sent with correct details
- [ ] Payment page shows merchant branding
- [ ] Stripe PaymentIntent created with metadata
- [ ] `payment_intent.succeeded` webhook processed
- [ ] Invoice `amount_paid` and `amount_due` updated
- [ ] Payment receipt email sent to client
- [ ] Payment record in `payments` table

**Actual Results:**
```
[To be filled during testing]
```

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

### Test 5: Payment Processing (Partial & Full)
**Objective:** Test various payment scenarios

**Test Steps:**
1. Create invoice with total $1000
2. Enable "Allow deposits" with 30% minimum
3. Send invoice
4. Make partial payment of $300 (deposit)
5. Verify status changes to 'partial'
6. Check amount_paid = $300, amount_due = $700
7. Make second payment of $500
8. Check amount_paid = $800, amount_due = $200
9. Make final payment of $200
10. Verify status = 'paid'
11. Test "Mark as Paid" on a sent invoice (simulate offline payment)

**Expected Results:**
- [ ] Deposit calculation correct (30% of total)
- [ ] Partial payments accumulate correctly
- [ ] `amount_paid` and `amount_due` always accurate
- [ ] Status: sent → partial → paid transitions correctly
- [ ] Each payment creates separate payment record
- [ ] Payment receipt sent for each payment
- [ ] "Mark as Paid" works without Stripe payment
- [ ] Manual payment updates status correctly

**Actual Results:**
```
[To be filled during testing]
```

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

### Test 6: Subscription Upgrade (Free → Pro)
**Objective:** Test subscription purchase and limit changes

**Test Steps:**
1. Verify currently on Free plan (5 client limit, 10 invoice limit)
2. Navigate to Settings → Subscription & Billing
3. Review plan comparison
4. Click "Upgrade to Pro" ($15/month)
5. Complete Stripe Checkout with test card
6. Return to app after payment
7. Verify plan badge shows "Pro"
8. Check limits increased (25 clients, 100 invoices)
9. Create 6th client (should work now)
10. Create 15 invoices (verify no limit blocking)
11. Access Stripe billing portal
12. Verify subscription visible in portal

**Expected Results:**
- [ ] Checkout session created with correct metadata (org_id, plan)
- [ ] Stripe subscription created
- [ ] `customer.subscription.created` webhook processed
- [ ] `subscription_plan` = 'pro'
- [ ] `subscription_status` = 'active'
- [ ] `stripe_subscription_id` saved
- [ ] `subscription_current_period_end` set correctly
- [ ] Client limit increased to 25
- [ ] Invoice limit increased to 100
- [ ] "Manage Billing" button appears and works
- [ ] Can view/cancel subscription in Stripe portal

**Actual Results:**
```
[To be filled during testing]
```

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

### Test 7: Subscription Downgrade & Limit Enforcement
**Objective:** Test downgrade flow and verify limits enforced

**Test Steps:**
1. While on Pro plan, create 20 invoices
2. Create 15 clients
3. Open Stripe billing portal via "Manage Billing" button
4. Cancel subscription
5. Confirm cancellation
6. Trigger webhook manually or wait for Stripe to send
7. Verify plan shows "Free" after webhook
8. Check existing invoices/clients still accessible (20 invoices, 15 clients)
9. Try to create 11th invoice (should be blocked)
10. Verify upgrade prompt shown
11. Try to create 6th client (should be blocked)
12. Verify clear messaging about limits

**Expected Results:**
- [ ] Billing portal opens successfully
- [ ] Cancellation processes in Stripe
- [ ] `customer.subscription.deleted` webhook received
- [ ] `subscription_plan` = 'free'
- [ ] `subscription_status` = 'canceled'
- [ ] `stripe_subscription_id` cleared
- [ ] Existing data preserved (grandfathered)
- [ ] New invoice creation blocked at limit
- [ ] New client creation blocked at limit
- [ ] Clear upgrade messaging shown
- [ ] Dashboard shows downgrade notification

**Actual Results:**
```
[To be filled during testing]
```

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

### Test 8: Admin Merchant Management
**Objective:** Test admin panel features and subscription overrides

**Pre-requisites:**
- Create admin user by setting `is_admin = true` in users table
- Have at least 2 test merchant accounts

**Test Steps:**
1. Log in as admin user
2. Navigate to /admin/merchants
3. Verify all merchants visible in list
4. Test search by email
5. Test filter by subscription plan
6. Click on a merchant to view details
7. View merchant's Stripe Connect status
8. Set subscription override:
   - Plan: Pro
   - Expires: 30 days from now
   - Reason: "Beta tester discount"
9. Log in as that merchant
10. Verify shows "Pro" plan with override badge
11. Verify can use Pro features (25 client limit)
12. Return to admin panel
13. Remove subscription override
14. Verify merchant returns to Free plan
15. Check admin_audit_log for all actions

**Expected Results:**
- [ ] Admin can access /admin routes
- [ ] Non-admin users get 403 on /admin routes
- [ ] Merchant list shows all accounts
- [ ] Search and filters work
- [ ] Merchant detail page shows complete info
- [ ] Subscription override saves correctly
- [ ] Override takes precedence over Stripe subscription
- [ ] Expiration date enforced
- [ ] Remove override clears all override fields
- [ ] All admin actions logged to audit_log
- [ ] Stripe Connect status visible and accurate

**Actual Results:**
```
[To be filled during testing]
```

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

### Test 9: Subscription Override Edge Case
**Objective:** Verify "free" override removed on paid upgrade

**Test Steps:**
1. As admin, set permanent "free" override on merchant account
2. Log in as that merchant
3. Verify shows "Free" plan
4. Click "Upgrade to Pro"
5. Complete Stripe Checkout
6. Verify subscription created in Stripe
7. Wait for `customer.subscription.updated` webhook
8. Check organization record
9. Verify override fields cleared (override_plan = null)
10. Verify now using Stripe plan (Pro)
11. Confirm Pro features accessible

**Expected Results:**
- [ ] "Free" override initially takes precedence
- [ ] Upgrade button still visible
- [ ] Stripe checkout completes successfully
- [ ] Webhook detects paid plan upgrade
- [ ] Queries current override status
- [ ] Removes "free" override automatically
- [ ] `subscription_override_plan` = null
- [ ] `subscription_plan` = 'pro' (from Stripe)
- [ ] User receives full Pro benefits
- [ ] No confusion about which plan is active

**Actual Results:**
```
[To be filled during testing]
```

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

### Test 10: Settings & Branding Customization
**Objective:** Verify organization settings and branding features

**Test Steps:**
1. Navigate to Settings → General
2. Update organization name
3. Upload logo (test with various formats: PNG, JPG, SVG)
4. Change brand colors (primary, accent)
5. Update business address
6. Configure invoice settings:
   - Default payment terms (Net 30)
   - Default tax rate (8.5%)
   - Invoice prefix (INV-)
7. Save all settings
8. Create new invoice
9. Generate PDF
10. Verify branding applied to PDF
11. Send invoice and view payment page
12. Check payment page shows custom branding

**Expected Results:**
- [ ] All settings save to organizations table
- [ ] Logo uploaded to storage and URL saved
- [ ] Logo displays on dashboard
- [ ] Invoice PDF includes custom logo
- [ ] Invoice PDF uses brand colors
- [ ] Payment page shows merchant branding
- [ ] Email templates use custom org name
- [ ] Default values apply to new invoices
- [ ] Changes don't affect existing invoices

**Actual Results:**
```
[To be filled during testing]
```

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

### Test 11: Analytics & Reporting
**Objective:** Verify analytics calculations and display

**Test Steps:**
1. Navigate to Analytics page
2. Check with no data (zero state)
3. Create 5 invoices:
   - 2 paid ($1000 each)
   - 1 partial ($500 paid of $1000)
   - 1 sent ($750)
   - 1 draft ($300)
4. Refresh analytics
5. Verify calculations:
   - Total revenue = $2500 (paid + partial)
   - Outstanding = $1250 ($500 from partial + $750 from sent)
   - Invoice count by status accurate
6. Test date range filter (last 30 days)
7. Test chart rendering
8. Check mobile responsiveness

**Expected Results:**
- [ ] Zero state shows helpful message
- [ ] Revenue calculation accurate
- [ ] Outstanding balance correct
- [ ] Status breakdown counts match
- [ ] Charts render without errors
- [ ] Date filters work correctly
- [ ] Performance acceptable with data
- [ ] Mobile view readable
- [ ] No console errors

**Actual Results:**
```
[To be filled during testing]
```

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

### Test 12: Security & RLS Verification
**Objective:** Ensure data isolation and security

**Test Steps:**
1. Create two separate user accounts (User A, User B)
2. As User A, create:
   - 2 clients
   - 3 invoices
3. Note invoice ID and client ID
4. Log in as User B
5. Try to access User A's invoice via direct URL
6. Try to access User A's client via direct URL
7. Try API calls to User A's resources
8. Verify all return 404 or empty results
9. Log in as admin user
10. Verify can see both users' data
11. Test public payment page (no auth required)
12. Test invalid webhook signature
13. Test SQL injection in search fields

**Expected Results:**
- [ ] Users cannot access other orgs' data
- [ ] Direct URL access returns 404 (not 403 to avoid enumeration)
- [ ] API calls respect RLS policies
- [ ] RLS policies enforce org_id isolation
- [ ] Admin can view all data (is_admin() function works)
- [ ] Public payment pages accessible without auth
- [ ] Payment page only shows invoice for that token
- [ ] Invalid webhook signatures rejected (400 error)
- [ ] SQL injection attempts blocked
- [ ] XSS attempts sanitized
- [ ] CSRF protection working

**Actual Results:**
```
[To be filled during testing]
```

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

## Phase 3: Edge Cases & Error Handling

### Test 13: Payment Without Stripe Connect
**Objective:** Verify graceful degradation when merchant hasn't set up payments

**Test Steps:**
1. Create new merchant account
2. Skip Stripe Connect setup
3. Create and send invoice
4. Open payment link
5. Verify message shown: "Payment Setup Required"
6. Verify contact merchant message
7. Test "Mark as Paid" functionality

**Expected Results:**
- [ ] Payment page loads without errors
- [ ] Clear message about setup required
- [ ] Contact information displayed
- [ ] No payment form shown
- [ ] Merchant can still mark as paid manually

**Actual Results:**
```
[To be filled during testing]
```

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

### Test 14: Invoice Without Client Email
**Objective:** Handle missing email gracefully

**Test Steps:**
1. Create client without email address
2. Create invoice for that client
3. Try to send invoice via email
4. Verify clear error message
5. Verify can still use "Mark as Sent"

**Expected Results:**
- [ ] Send fails with clear error message
- [ ] Invoice not marked as sent on failure
- [ ] Suggests adding email or using mark as sent
- [ ] "Mark as Sent" works as alternative

**Actual Results:**
```
[To be filled during testing]
```

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

### Test 15: Invoice Duplication
**Objective:** Test duplicate invoice feature and limits

**Test Steps:**
1. Create invoice with multiple line items
2. Mark as sent
3. Click "Duplicate" button
4. Verify new draft created
5. Check all items copied
6. Verify new invoice number assigned
7. Test duplicate when at invoice limit

**Expected Results:**
- [ ] Duplicate creates new draft invoice
- [ ] All line items copied correctly
- [ ] New invoice number generated
- [ ] Client relationship preserved
- [ ] Status = 'draft' for duplicate
- [ ] Original invoice unchanged
- [ ] Limit check enforced on duplicate

**Actual Results:**
```
[To be filled during testing]
```

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

### Test 16: Webhook Idempotency
**Objective:** Verify duplicate webhooks handled correctly

**Test Steps:**
1. Trigger payment webhook
2. Send same webhook event again (same ID)
3. Verify second attempt skipped
4. Check stripe_events table
5. Verify no duplicate payments created

**Expected Results:**
- [ ] First webhook processed successfully
- [ ] Duplicate detected by event ID
- [ ] Second webhook returns 200 but skips processing
- [ ] Only one event record in stripe_events
- [ ] No duplicate payments created
- [ ] Log shows "Duplicate webhook event, skipping"

**Actual Results:**
```
[To be filled during testing]
```

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

### Test 17: Concurrent Payment Attempts
**Objective:** Handle race conditions in payments

**Test Steps:**
1. Open payment page in two browser windows
2. Initiate payment in both simultaneously
3. Verify both attempts handled correctly
4. Check only one payment recorded
5. Verify invoice status correct

**Expected Results:**
- [ ] Stripe handles duplicate payment intents
- [ ] Only one payment succeeds
- [ ] Second attempt fails gracefully
- [ ] Invoice not overpaid
- [ ] Clear error message if duplicate attempted

**Actual Results:**
```
[To be filled during testing]
```

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

### Test 18: Browser Refresh During Checkout
**Objective:** Ensure checkout recovery works

**Test Steps:**
1. Start subscription upgrade checkout
2. Refresh browser during checkout
3. Attempt to complete checkout
4. Cancel and start new checkout
5. Verify can complete successfully

**Expected Results:**
- [ ] Stripe checkout recovers from refresh
- [ ] Can abandon and restart checkout
- [ ] No orphaned sessions
- [ ] Successful payment updates org correctly

**Actual Results:**
```
[To be filled during testing]
```

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Passed | ❌ Failed

---

## Phase 4: Performance & UX

### Test 19: Page Load Performance
**Objective:** Ensure acceptable load times

**Test Pages:**
- [ ] Dashboard: < 2 seconds
- [ ] Invoice list: < 2 seconds
- [ ] Client list: < 2 seconds
- [ ] Analytics: < 3 seconds
- [ ] Invoice detail: < 2 seconds
- [ ] Payment page: < 2 seconds

**Tools:**
- Chrome DevTools Network tab
- Lighthouse performance audit

**Actual Results:**
```
[To be filled during testing]
```

---

### Test 20: Mobile Responsiveness
**Objective:** Verify mobile experience

**Test Devices/Viewports:**
- [ ] iPhone 12 Pro (390x844)
- [ ] iPhone SE (375x667)
- [ ] iPad (768x1024)
- [ ] Android (360x640)

**Test Features:**
- [ ] Navigation menu
- [ ] Invoice creation form
- [ ] Payment page
- [ ] Dashboard layout
- [ ] Tables scroll/responsive
- [ ] Buttons accessible
- [ ] Forms usable

**Actual Results:**
```
[To be filled during testing]
```

---

### Test 21: Email Delivery
**Objective:** Verify all emails send correctly

**Email Types to Test:**
- [ ] Invoice sent email
- [ ] Payment receipt email
- [ ] Welcome email (if applicable)

**Checks:**
- [ ] Email arrives within 1 minute
- [ ] From address correct
- [ ] Subject line clear
- [ ] HTML renders properly
- [ ] Links work
- [ ] Merchant branding applied
- [ ] Mobile email view acceptable

**Actual Results:**
```
[To be filled during testing]
```

---

## Phase 5: Final Verification

### Pre-Launch Checklist

**Environment Configuration:**
- [ ] All environment variables set correctly
- [ ] Production Stripe keys configured
- [ ] Production Supabase keys configured
- [ ] Email service (Resend) configured
- [ ] NEXT_PUBLIC_APP_URL set to production domain
- [ ] Webhook endpoints registered in Stripe

**Database:**
- [ ] All migrations applied
- [ ] RLS policies enabled on all tables
- [ ] Indexes created for performance
- [ ] No test data in production

**Security:**
- [ ] RLS policies tested and working
- [ ] Admin access restricted
- [ ] API routes protected
- [ ] Public routes only for payment pages
- [ ] Webhook signature verification working
- [ ] No sensitive data in logs

**Stripe Configuration:**
- [ ] Connected accounts enabled
- [ ] Webhook endpoints configured
- [ ] Test mode disabled for production
- [ ] Products and prices created
- [ ] Tax settings configured (if applicable)

**Functionality:**
- [ ] User signup works
- [ ] Stripe Connect onboarding works
- [ ] Invoice creation works
- [ ] Payment processing works
- [ ] Subscription upgrades work
- [ ] Admin panel works
- [ ] Email delivery works
- [ ] Analytics display correctly

**Performance:**
- [ ] Page loads < 2-3 seconds
- [ ] No memory leaks
- [ ] Database queries optimized
- [ ] Images optimized

**User Experience:**
- [ ] Mobile responsive
- [ ] Error messages clear
- [ ] Loading states shown
- [ ] Success messages displayed
- [ ] Forms validate properly

---

## Success Criteria

Before launching, ALL of the following must be true:

✅ **All test scenarios pass** (Tests 1-21)
✅ **No console errors** in browser developer tools
✅ **No 500 errors** in application logs
✅ **Email delivery working** for all email types
✅ **Stripe webhooks processing** correctly (check logs)
✅ **RLS policies secure** - users cannot access other orgs' data
✅ **Performance acceptable** - page loads < 2-3 seconds
✅ **Mobile responsive** - works on phones and tablets
✅ **Error messages clear** and helpful
✅ **Admin features working** - merchant management, overrides
✅ **Payment processing working** - full and partial payments
✅ **Subscription flows working** - upgrade, downgrade, limits

---

## Testing Tracking

**Started:** [Date/Time]
**Completed:** [Date/Time]
**Tests Passed:** 0 / 21
**Tests Failed:** 0 / 21
**Critical Issues Found:** 0
**Minor Issues Found:** 0

---

## Issues Log

### Critical Issues
_(Issues that block launch)_

**Issue #1:**
- **Description:**
- **Steps to Reproduce:**
- **Expected:**
- **Actual:**
- **Status:** 🔴 Open | 🟡 In Progress | ✅ Resolved

---

### Minor Issues
_(Issues that don't block launch but should be fixed soon)_

**Issue #1:**
- **Description:**
- **Steps to Reproduce:**
- **Expected:**
- **Actual:**
- **Status:** 🔴 Open | 🟡 In Progress | ✅ Resolved

---

## Notes

_(Add any observations, concerns, or reminders during testing)_

---

## Phase 6: Final Production Preparation

**IMPORTANT:** After all testing is complete and all issues are resolved, perform this final cleanup to prepare the production database for real users.

### Overview
This phase removes all test data created during the testing process, leaving you with a clean production environment ready for real customers.

---

### Step 1: Create Final Backup

Before final cleanup, create a backup of the tested state (optional, for reference):

```bash
# Using Supabase CLI
supabase db dump -f backup-post-testing-$(date +%Y%m%d).sql
```

**Verification:**
- [ ] Backup file created
- [ ] Can review test data if needed later

---

### Step 2: Document Production-Ready State

**Pre-Cleanup Verification:**
- [ ] All 21 tests passed
- [ ] All critical issues resolved
- [ ] All minor issues documented
- [ ] Environment variables verified for production
- [ ] Stripe webhooks configured and tested
- [ ] Email service tested and working
- [ ] Domain/DNS configured correctly

**Stop here if any verification fails!**

---

### Step 3: Final Database Truncation

**DANGER:** This will delete all test data. Only proceed if all tests have passed.

Connect to your production Supabase database and execute:

```sql
-- Disable RLS temporarily for truncation
SET session_replication_role = 'replica';

-- Clear all test data in dependency order
TRUNCATE TABLE payments CASCADE;
TRUNCATE TABLE invoice_items CASCADE;
TRUNCATE TABLE invoices CASCADE;
TRUNCATE TABLE clients CASCADE;
TRUNCATE TABLE stripe_events CASCADE;
TRUNCATE TABLE admin_audit_log CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE organizations CASCADE;

-- Re-enable RLS
SET session_replication_role = 'origin';
```

**Verification after truncation:**
```sql
-- Verify all tables are empty
SELECT 'payments' as table_name, COUNT(*) as count FROM payments
UNION ALL
SELECT 'invoice_items', COUNT(*) FROM invoice_items
UNION ALL
SELECT 'invoices', COUNT(*) FROM invoices
UNION ALL
SELECT 'clients', COUNT(*) FROM clients
UNION ALL
SELECT 'stripe_events', COUNT(*) FROM stripe_events
UNION ALL
SELECT 'admin_audit_log', COUNT(*) FROM admin_audit_log
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'organizations', COUNT(*) FROM organizations;
```

**Expected:** All counts should be 0

**Checklist:**
- [ ] All tables empty
- [ ] Schema still intact (tables exist)
- [ ] Migrations table unchanged
- [ ] RLS policies still enabled
- [ ] Functions still exist (is_admin(), etc.)

---

### Step 4: Final Stripe Cleanup

Remove all test data from Stripe:

**List Connected Accounts:**
```bash
stripe accounts list --limit 100
```

**Delete Each Test Connected Account:**
```bash
# For each test account ID
stripe accounts delete <account_id>
```

**List Customers:**
```bash
stripe customers list --limit 100
```

**Delete Each Test Customer:**
```bash
# For each test customer ID (this also cancels subscriptions)
stripe customers delete <customer_id>
```

**Verify Stripe is Clean:**
```bash
stripe customers list --limit 10
stripe subscriptions list --limit 10
stripe accounts list --limit 10
```

**Expected:** No test data, only production price/product configuration

**Checklist:**
- [ ] All test connected accounts deleted
- [ ] All test customers deleted
- [ ] All test subscriptions canceled/deleted
- [ ] Products and prices still configured
- [ ] Webhook endpoints still registered
- [ ] Using production API keys (not test mode)

---

### Step 5: Verify Production Configuration

**Environment Variables:**
- [ ] `NEXT_PUBLIC_APP_URL` = production domain (https://www.bildout.com)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` = production Supabase URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = production anon key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = production service role key
- [ ] `STRIPE_SECRET_KEY` = production secret key (starts with sk_live_)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = production publishable key (starts with pk_live_)
- [ ] `STRIPE_WEBHOOK_SECRET` = production webhook secret
- [ ] `STRIPE_WEBHOOK_SECRET_CONNECT` = production connect webhook secret
- [ ] `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` = production Pro price ID
- [ ] `NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID` = production Agency price ID
- [ ] `RESEND_API_KEY` = production Resend API key

**Stripe Configuration:**
- [ ] Webhook endpoints configured:
  - `https://www.bildout.com/api/webhooks/stripe`
  - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `account.updated`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `checkout.session.completed`
- [ ] Test mode disabled (using live keys)
- [ ] Products created (Pro, Agency)
- [ ] Prices created and IDs match env variables
- [ ] Connected accounts enabled

**Supabase Configuration:**
- [ ] **Upgrade to Supabase Pro plan** ($25/month)
  - Required for production: Daily backups, 7-day PITR, better performance
  - Free tier does not include backups (unsafe for customer data)
  - Upgrade at: Supabase Dashboard → Settings → Billing
- [ ] RLS enabled on all tables
- [ ] All migrations applied
- [ ] Indexes created
- [ ] Functions deployed (is_admin, etc.)
- [ ] Storage buckets configured (for logos)
- [ ] Auth settings configured
- [ ] Email templates configured (if using Supabase Auth)

**Application Deployment:**
- [ ] Latest code deployed to production
- [ ] Build successful
- [ ] No TypeScript errors
- [ ] No console errors on production site
- [ ] All pages load correctly
- [ ] SSL certificate valid

---

### Step 6: Create Production Admin User

Create your first admin user for production:

**Option 1: Via Supabase Dashboard**
1. Sign up for account via the application
2. In Supabase Dashboard → Authentication → Users
3. Find your user
4. In Supabase Dashboard → Table Editor → users
5. Find your user record by auth ID
6. Set `is_admin = true`

**Option 2: Via SQL**
```sql
-- After signing up, update your user record
UPDATE users
SET is_admin = true
WHERE email = 'your-admin@email.com';
```

**Verification:**
- [ ] Can access /admin/merchants
- [ ] Can view admin features
- [ ] Non-admin users cannot access admin routes

---

### Step 7: Final Smoke Test

Perform a quick smoke test on production with real data:

**Quick Checks:**
- [ ] Sign up new test user (use real email you control)
- [ ] Create one test client
- [ ] Create one test invoice
- [ ] Send test invoice (receive email)
- [ ] View payment page (don't pay yet)
- [ ] Verify no errors in logs
- [ ] Test Stripe Connect button (don't complete)
- [ ] Test analytics page loads
- [ ] Test subscription page loads

**If any check fails, STOP and investigate before launch!**

---

### Step 8: Production Launch Checklist

**Final verification before announcing launch:**

- [ ] Database is empty of test data
- [ ] Stripe is clean of test data
- [ ] Production environment variables verified
- [ ] All webhooks configured and tested
- [ ] Email delivery working
- [ ] SSL certificate valid
- [ ] Domain configured correctly
- [ ] Admin user created
- [ ] Smoke test completed successfully
- [ ] Monitoring/logging configured
- [ ] Error tracking configured (if applicable)
- [ ] Backup strategy in place
- [ ] Support email/system ready
- [ ] Terms of Service published
- [ ] Privacy Policy published
- [ ] Pricing page accurate

---

### Step 9: Go Live!

**Once all checks pass:**

1. **Announce Launch:**
   - Update status page (if applicable)
   - Social media announcement
   - Email to waitlist (if applicable)
   - Update marketing site

2. **Monitor Closely:**
   - Watch error logs for first 24 hours
   - Monitor Stripe webhook logs
   - Check email delivery
   - Monitor database performance
   - Watch for user signups

3. **Be Ready to Respond:**
   - Have rollback plan ready
   - Monitor support channels
   - Be available for urgent issues

**Congratulations on your launch!** 🚀

---

### Post-Launch Monitoring (First 24 Hours)

**What to watch:**
- [ ] User signups completing successfully
- [ ] No authentication errors
- [ ] Stripe Connect onboarding working
- [ ] Invoice creation working
- [ ] Payment processing working
- [ ] Emails delivering
- [ ] No webhook failures
- [ ] No RLS policy violations
- [ ] Performance acceptable under load
- [ ] No database errors

**Check Every Few Hours:**
- Supabase logs for errors
- Stripe dashboard for activity
- Email delivery reports
- Application error logs
- User feedback/support requests

---

## Sign-Off

**Tested By:** [Name]
**Date:** [Date]
**Ready for Launch:** ⬜ Yes | ⬜ No | ⬜ With Reservations

**Comments:**
```
[Final notes before launch]
```
