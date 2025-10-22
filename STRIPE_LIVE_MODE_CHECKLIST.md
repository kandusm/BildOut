# Stripe Live Mode Setup Checklist

**Version:** 1.0
**Last Updated:** October 21, 2025
**Estimated Time:** 2-3 hours

This checklist guides you through setting up Stripe in Live Mode for production. Complete ALL steps before launching to customers.

⚠️ **CRITICAL:** Never use test mode keys in production! Always verify you're in Live Mode.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Account Verification](#account-verification)
3. [Enable Live Mode](#enable-live-mode)
4. [Create Products and Prices](#create-products-and-prices)
5. [Enable Stripe Connect](#enable-stripe-connect)
6. [Configure Webhooks](#configure-webhooks)
7. [Get API Keys](#get-api-keys)
8. [Configure Vercel Environment Variables](#configure-vercel-environment-variables)
9. [Test Live Mode Integration](#test-live-mode-integration)
10. [Configure Billing Settings](#configure-billing-settings)
11. [Security Best Practices](#security-best-practices)

---

## Prerequisites

Before starting, ensure you have:

- [ ] A Stripe account (not a test account)
- [ ] Business information ready (legal name, address, tax ID)
- [ ] Bank account details for payouts
- [ ] Your website is live at your production domain (e.g., https://bildout.com)
- [ ] Admin access to Vercel production environment
- [ ] Completed PRODUCTION_DEPLOYMENT_GUIDE.md through Environment Variables section

**Important:** You cannot enable live mode until Stripe verifies your business information.

---

## Account Verification

### Step 1: Log In to Stripe Dashboard

1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Log in to your account
3. You should see a banner about "Activating your account" if not yet verified

### Step 2: Complete Business Verification

1. Click "Activate your account" in the banner, OR
2. Go to **Settings → Account → Business details**

3. Provide business information:

**Business Details:**
- [ ] **Legal business name:** (e.g., BildOut LLC)
- [ ] **Business type:** (LLC, Corporation, Sole Proprietorship, etc.)
- [ ] **Business address:** Full street address
- [ ] **Phone number:** Business phone
- [ ] **Business website:** https://bildout.com
- [ ] **Tax ID (EIN or SSN):** Your tax identification number
- [ ] **Industry:** Software / SaaS
- [ ] **Product description:** "Invoicing and payment platform for contractors and freelancers"

**Personal Details (for business owners):**
- [ ] **Full legal name**
- [ ] **Date of birth**
- [ ] **Home address**
- [ ] **SSN (last 4 digits initially, full SSN may be required later)**
- [ ] **Phone number**
- [ ] **Email address**

4. Click "Save" after entering all information

### Step 3: Submit Verification Documents

Stripe may request additional documents:

- [ ] Government-issued ID (driver's license, passport)
- [ ] Business formation documents (Articles of Incorporation, EIN letter)
- [ ] Proof of address (utility bill, bank statement)
- [ ] Bank account verification (micro-deposits or instant verification)

Upload documents as requested in the dashboard.

### Step 4: Wait for Approval

- Verification typically takes **1-3 business days**
- Stripe will email you when verification is complete
- You can use Test Mode while waiting, but **cannot process real payments** until verified

**Status Check:**
- Go to **Settings → Account**
- Look for "Charges enabled: Yes" (green checkmark)

**✅ Checkpoint:** Account verified and charges enabled

---

## Enable Live Mode

### Step 1: Switch to Live Mode

1. In Stripe Dashboard, find the toggle in the **top-right corner**
2. Click to switch from "Test Mode" to "Live Mode"
3. The interface will turn from orange to blue/purple
4. **Verify** the toggle shows "Viewing live data"

### Step 2: Confirm Live Mode Is Active

- [ ] Top-right toggle says "Viewing live data"
- [ ] Dashboard color is blue/purple (not orange)
- [ ] You see a message about activating payments if not yet verified

**⚠️ IMPORTANT:** All following steps must be done in **Live Mode**!

---

## Create Products and Prices

### Step 1: Create Pro Plan Product

1. In **Live Mode**, go to **Products → Add Product**

2. **Product information:**
   - **Name:** Pro Plan
   - **Description:** BildOut Pro - Unlimited invoices, unlimited clients, custom branding, analytics, and automated reminders.
   - **Image:** (Optional - upload logo or plan icon)
   - **Statement descriptor:** BILDOUT PRO (appears on customer credit card)

3. **Pricing:**
   - **Pricing model:** Standard pricing
   - **Price:** $15.00 USD
   - **Billing period:** Monthly
   - **Currency:** USD
   - **Price description:** Pro Plan - Monthly

4. Click "Save product"

5. **Copy the Price ID:**
   - After saving, click on the price you just created
   - Copy the **Price ID** (starts with `price_`)
   - Save this as: `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`
   - Example: `price_1Abc2DefGhIj3KlM`

### Step 2: Create Agency Plan Product

1. Go to **Products → Add Product**

2. **Product information:**
   - **Name:** Agency Plan
   - **Description:** BildOut Agency - Everything in Pro plus unlimited team members, priority support, API access, and advanced analytics.
   - **Image:** (Optional)
   - **Statement descriptor:** BILDOUT AGENCY

3. **Pricing:**
   - **Pricing model:** Standard pricing
   - **Price:** $49.00 USD
   - **Billing period:** Monthly
   - **Currency:** USD
   - **Price description:** Agency Plan - Monthly

4. Click "Save product"

5. **Copy the Price ID:**
   - Click on the price
   - Copy the **Price ID** (starts with `price_`)
   - Save this as: `NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID`

### Step 3: Verify Products

1. Go to **Products** in Stripe Dashboard
2. Verify you see:
   - [ ] Pro Plan - $15.00/month
   - [ ] Agency Plan - $49.00/month
3. Both should show "Live mode" indicator

**✅ Checkpoint:** Pro and Agency products created with price IDs saved

---

## Enable Stripe Connect

Stripe Connect allows your users to accept payments directly through their own Stripe accounts.

### Step 1: Enable Stripe Connect

1. In Live Mode, go to **Settings → Connect settings**
2. Click "Get Started" or "Enable Connect"

### Step 2: Configure Connect Platform

1. **Platform profile:**
   - **Platform name:** BildOut
   - **Support email:** support@bildout.com
   - **Support URL:** https://bildout.com/contact

2. **Branding:**
   - [ ] Upload logo (square PNG, 512x512px recommended)
   - [ ] **Brand color:** #F97316 (BildOut orange) or your brand color
   - [ ] **Icon:** (optional)

3. Click "Save"

### Step 3: Configure Express Accounts

1. In **Connect settings**, scroll to "Account types"
2. Enable **Express accounts**
3. Configure Express account settings:
   - **Application fee:** 0% (we make money from subscriptions, not payment fees)
   - **Payout schedule:** Automatic (default Stripe schedule)

4. Click "Save changes"

### Step 4: Set Up OAuth for Connect

1. Still in **Connect settings**, scroll to "Integration"
2. Click "Add redirect URI"
3. Add your production callback URL:
   ```
   https://bildout.com/api/stripe/connect/callback
   ```
4. Click "Add"

5. **Copy your Connect Client ID:**
   - Find "OAuth settings" section
   - Copy the **Client ID** (starts with `ca_`)
   - Save this as: `NEXT_PUBLIC_STRIPE_CONNECT_CLIENT_ID`
   - Example: `ca_1Abc2DefGhIj3KlM`

### Step 5: Configure Connect Onboarding

1. Go to **Connect → Settings → Onboarding**
2. Configure onboarding options:
   - **Collect business type:** Yes
   - **Collect tax ID:** Yes
   - **Require bank account:** Yes
   - **Collect statement descriptor:** Yes

3. Customize branding:
   - Verify logo and colors are correct
   - Add support contact info

4. Click "Save"

**✅ Checkpoint:** Stripe Connect enabled with Client ID saved

---

## Configure Webhooks

Webhooks notify your app of payment events in real-time.

### Step 1: Create Webhook Endpoint

1. In Live Mode, go to **Developers → Webhooks**
2. Click "Add endpoint"

3. **Endpoint URL:**
   ```
   https://bildout.com/api/webhooks/stripe
   ```

4. **Description:** BildOut Production Webhook

5. **Events to listen to:** Click "Select events"

### Step 2: Subscribe to Events

Select the following events:

**Checkout Events:**
- [ ] `checkout.session.completed`
- [ ] `checkout.session.expired`

**Subscription Events:**
- [ ] `customer.subscription.created`
- [ ] `customer.subscription.updated`
- [ ] `customer.subscription.deleted`

**Invoice Events:**
- [ ] `invoice.payment_succeeded`
- [ ] `invoice.payment_failed`
- [ ] `invoice.finalized`

**Payment Events:**
- [ ] `payment_intent.succeeded`
- [ ] `payment_intent.payment_failed`

**Connect Events:**
- [ ] `account.updated`
- [ ] `account.application.authorized`
- [ ] `account.application.deauthorized`

**Customer Events:**
- [ ] `customer.created`
- [ ] `customer.updated`
- [ ] `customer.deleted`

6. Click "Add events"

### Step 3: Configure Webhook Settings

1. Set **API version:** Latest version (should be 2024-10-28 or newer)
2. Leave "Event filter" as "All events" or configure if needed
3. Click "Add endpoint"

### Step 4: Get Webhook Signing Secret

1. After creating the webhook, click on it
2. Scroll to "Signing secret"
3. Click "Reveal" or copy the signing secret
4. **Copy the webhook secret** (starts with `whsec_`)
5. Save this as: `STRIPE_WEBHOOK_SECRET`
6. **Keep this secret secure!**

### Step 5: Test Webhook

1. In the webhook detail page, click "Send test webhook"
2. Select event: `checkout.session.completed`
3. Click "Send test webhook"
4. Verify webhook receives **200 OK** response
5. If it fails, check:
   - Endpoint URL is correct and accessible
   - Vercel deployment is successful
   - Webhook route exists at `/api/webhooks/stripe/route.ts`

**⚠️ Common Issues:**
- 404 Error → Verify route file exists and is deployed
- 500 Error → Check Vercel function logs for errors
- Timeout → Function may be taking too long (check processing logic)

**✅ Checkpoint:** Webhook endpoint created and tested with signing secret saved

---

## Get API Keys

### Step 1: Get Live Mode Secret Key

1. Ensure you're in **Live Mode** (toggle in top-right)
2. Go to **Developers → API keys**
3. Find "Secret key" section
4. **Reveal live key**
5. Copy the **Secret key** (starts with `sk_live_`)
6. Save this as: `STRIPE_SECRET_KEY`
7. **Keep this absolutely secret!**

### Step 2: Get Live Mode Publishable Key

1. On the same **API keys** page
2. Find "Publishable key" section
3. Copy the **Publishable key** (starts with `pk_live_`)
4. Save this as: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Step 3: Verify Keys Are Live Mode

**CRITICAL VERIFICATION:**
- [ ] Secret key starts with `sk_live_` (NOT `sk_test_`)
- [ ] Publishable key starts with `pk_live_` (NOT `pk_test_`)
- [ ] You are viewing "Live Mode" in Stripe Dashboard

**⚠️ DO NOT use test mode keys in production!**

**✅ Checkpoint:** All API keys copied and verified as Live Mode

---

## Configure Vercel Environment Variables

Now add all Stripe keys to Vercel production environment.

### Step 1: Add Stripe Variables to Vercel

1. Go to Vercel → Your Project → **Settings → Environment Variables**

2. Add each of the following for **Production only**:

**Stripe API Keys:**
```
STRIPE_SECRET_KEY=sk_live_[your-live-secret-key]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_[your-live-publishable-key]
```

**Stripe Webhook:**
```
STRIPE_WEBHOOK_SECRET=whsec_[your-webhook-signing-secret]
```

**Stripe Connect:**
```
NEXT_PUBLIC_STRIPE_CONNECT_CLIENT_ID=ca_[your-connect-client-id]
```

**Stripe Price IDs:**
```
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_[your-pro-monthly-price-id]
NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID=price_[your-agency-monthly-price-id]
```

3. For each variable:
   - Click "Add New"
   - Enter Key name
   - Enter Value
   - Select: **Production** (uncheck Preview and Development)
   - Click "Save"

### Step 2: Redeploy Application

1. After adding all variables, trigger a new deployment:
   - Option A: Push a commit to main branch
   - Option B: Click "Deployments" → "Redeploy" in Vercel

2. Wait for deployment to complete
3. Check deployment logs for any errors

### Step 3: Verify Variables Are Set

1. In Vercel, go to **Settings → Environment Variables**
2. Verify all Stripe variables exist and are set for **Production**
3. Double-check values (reveal and compare to your saved keys)

**⚠️ FINAL VERIFICATION:**
- [ ] All keys start with `live` prefix (sk_live_, pk_live_)
- [ ] Webhook secret starts with `whsec_`
- [ ] Connect client ID starts with `ca_`
- [ ] Price IDs start with `price_`
- [ ] All variables are set for **Production** environment only

**✅ Checkpoint:** All Stripe environment variables configured in Vercel

---

## Test Live Mode Integration

**⚠️ WARNING:** These tests will create real Stripe charges. Use small amounts and your own credit card.

### Step 1: Test Stripe Connect Onboarding

1. Open production site in incognito browser
2. Sign up for a new account or log in
3. Go to Dashboard
4. Click "Set up Stripe Connect" or "Connect Stripe Account"
5. Verify Stripe Connect onboarding flow opens
6. Complete onboarding with:
   - **Real or test business information** (you can delete this later)
   - **Bank account:** Use Stripe test bank account numbers for testing
7. Complete all steps and return to BildOut
8. Verify:
   - [ ] Dashboard shows "Stripe Connected" or similar
   - [ ] Stripe status updates in app
   - [ ] Connected account appears in Stripe Dashboard → Connect → Accounts

### Step 2: Test Subscription Checkout (Live Payment)

**⚠️ This will charge your real credit card $15**

1. In production app, go to **Settings → Subscription**
2. Click "Upgrade to Pro"
3. Fill in real credit card details (your own card)
4. Complete checkout

5. Verify in BildOut:
   - [ ] Redirected back to success page
   - [ ] Subscription status shows "Pro"
   - [ ] Pro features are unlocked

6. Verify in Stripe Dashboard:
   - [ ] Payment appears in Payments (Live Mode)
   - [ ] Customer is created
   - [ ] Subscription is active
   - [ ] Correct amount charged ($15)

7. **Refund or cancel immediately:**
   - Go to Stripe Dashboard → Payments
   - Find your payment and click it
   - Click "Refund payment"
   - Refund full amount
   - OR cancel subscription in Billing Portal

### Step 3: Test Webhook Reception

1. After completing subscription test, check webhook:
   - Go to Stripe Dashboard → Developers → Webhooks
   - Click on your production webhook
   - Review recent webhook events
   - Verify events show **Succeeded** status
   - Check for any failed webhooks

2. In Vercel, check function logs:
   - Go to Vercel → Deployments → Latest → Functions
   - Find `/api/webhooks/stripe` function
   - Review logs for webhook processing
   - Look for any errors

### Step 4: Test Invoice Payment Flow

**⚠️ Optional - This will process a real payment**

1. Create a test invoice for $1.00
2. Send invoice to your own email
3. Open payment link from email
4. Enter real credit card details
5. Complete payment

6. Verify:
   - [ ] Payment processed in Stripe
   - [ ] Invoice marked as paid in BildOut
   - [ ] Webhook fired and processed
   - [ ] Payment receipt email sent

7. Refund the payment in Stripe Dashboard

### Step 5: Verify Connect Payment Flow

**⚠️ Optional - Requires completed Connect account**

1. Ensure you have a connected Stripe account
2. Create and send an invoice
3. Process a payment
4. Verify payment reaches the connected account (not platform account)

**✅ Checkpoint:** All live mode integrations tested successfully

---

## Configure Billing Settings

### Step 1: Set Up Payout Schedule

1. Go to **Settings → Business settings → Payout details**
2. Add bank account for receiving funds:
   - **Bank name**
   - **Routing number**
   - **Account number**
3. Choose payout schedule:
   - **Recommended:** Daily automatic payouts
   - Or: Weekly on [day of week]

### Step 2: Configure Email Receipts

1. Go to **Settings → Emails → Receipts**
2. Enable email receipts for customers
3. Customize receipt email template (optional):
   - Add logo
   - Customize colors
   - Add support email

### Step 3: Set Up Customer Portal

1. Go to **Settings → Billing → Customer portal**
2. Enable customer portal
3. Configure features:
   - [ ] Allow customers to update payment methods
   - [ ] Allow customers to cancel subscriptions
   - [ ] Allow customers to update billing information
   - [ ] Show invoice history

4. Add custom branding:
   - Upload logo
   - Set brand color: #F97316 (or your brand color)
   - Add support email: support@bildout.com

5. Save changes

### Step 4: Configure Payment Methods

1. Go to **Settings → Payment methods**
2. Verify enabled payment methods:
   - [ ] Cards (Visa, Mastercard, Amex, Discover)
   - [ ] Optional: Enable ACH Direct Debit (US only)
   - [ ] Optional: Enable other payment methods based on your market

### Step 5: Set Up Radar (Fraud Prevention)

1. Go to **Radar → Rules**
2. Review default Radar rules
3. Recommended settings:
   - [ ] Block payments if CVC check fails
   - [ ] Block payments if postal code check fails
   - [ ] Enable 3D Secure for high-risk payments
   - [ ] Review payments from high-risk countries

4. Adjust risk threshold as needed (default: Normal)

**✅ Checkpoint:** Billing and payment settings configured

---

## Security Best Practices

### Step 1: Restrict API Key Access

1. Go to **Developers → API keys**
2. For each API key, click "..." → "Edit"
3. Set **Restricted key** permissions (if creating new keys):
   - Read/Write for necessary resources only
   - Limit to specific IP addresses if possible

**⚠️ NEVER:**
- Commit API keys to Git
- Share API keys in Slack/email/public channels
- Use production keys in development environment
- Expose secret keys in client-side code

### Step 2: Enable Two-Factor Authentication

1. Go to **Settings → Security**
2. Enable two-factor authentication (2FA)
3. Use authenticator app (Google Authenticator, Authy)
4. Save backup codes in secure location

### Step 3: Add Team Members (Optional)

1. Go to **Settings → Team and security**
2. Click "Invite team member"
3. Assign appropriate roles:
   - **Developer:** For developers who need API access
   - **Analyst:** For viewing reports only
   - **Support:** For handling customer issues
   - **Administrator:** Full access (use sparingly)

### Step 4: Review Security Settings

1. Go to **Settings → Security**
2. Review and configure:
   - [ ] Two-factor authentication enabled
   - [ ] Webhook signature verification enabled
   - [ ] API version pinned (prevents breaking changes)
   - [ ] Activity logs monitored

### Step 5: Set Up Monitoring Alerts

1. Go to **Settings → Notifications**
2. Enable alerts for:
   - [ ] Failed payments
   - [ ] Disputes/chargebacks
   - [ ] Unusual activity
   - [ ] Webhook failures
   - [ ] Account changes

3. Add email addresses for alert recipients

**✅ Checkpoint:** Security best practices implemented

---

## Final Verification Checklist

Before launching to customers, verify ALL of the following:

### Stripe Dashboard Verification

- [ ] Viewing **Live Mode** (not Test Mode)
- [ ] Account is **verified** and charges enabled
- [ ] Bank account added for payouts
- [ ] Two products created (Pro $15, Agency $49)
- [ ] Stripe Connect enabled with Express accounts
- [ ] Webhook endpoint created and tested (200 OK response)
- [ ] Customer Portal configured
- [ ] Email receipts enabled
- [ ] Fraud prevention (Radar) configured

### API Keys Verification

- [ ] Secret key starts with `sk_live_`
- [ ] Publishable key starts with `pk_live_`
- [ ] Webhook secret starts with `whsec_`
- [ ] Connect Client ID starts with `ca_`
- [ ] Pro price ID starts with `price_`
- [ ] Agency price ID starts with `price_`
- [ ] **NO test mode keys in production** (sk_test_, pk_test_)

### Vercel Environment Variables

- [ ] All Stripe variables set in Production environment only
- [ ] Variables NOT set in Preview or Development
- [ ] Redeployed after adding variables
- [ ] No errors in deployment logs

### Integration Testing

- [ ] Stripe Connect onboarding completes successfully
- [ ] Subscription checkout processes payments
- [ ] Webhooks receive events and return 200 OK
- [ ] Invoice payments process correctly
- [ ] Email receipts are sent
- [ ] Customer Portal is accessible

### Security Verification

- [ ] Two-factor authentication enabled on Stripe account
- [ ] API keys are secret and not committed to Git
- [ ] Webhook signature verification enabled
- [ ] Radar fraud prevention active
- [ ] Email notifications configured for critical events

---

## Common Issues and Solutions

### Issue: "Live mode is not available"

**Cause:** Account not yet verified

**Solution:**
1. Complete business verification
2. Submit required documents
3. Wait for Stripe approval (1-3 business days)
4. Check email for verification status

### Issue: Webhook returns 401 Unauthorized

**Cause:** Incorrect webhook secret or missing signature verification

**Solution:**
1. Verify `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
2. Check webhook signature verification in code
3. Ensure secret is set in Vercel Production environment
4. Redeploy application

### Issue: Payments fail with "Invalid API key"

**Cause:** Using test mode key in production or vice versa

**Solution:**
1. Verify you're using `sk_live_` key (not `sk_test_`)
2. Check Vercel environment variables
3. Ensure you're in Live Mode in Stripe Dashboard
4. Redeploy after updating keys

### Issue: Connect onboarding doesn't load

**Cause:** Incorrect OAuth redirect URI or Client ID

**Solution:**
1. Verify redirect URI in Stripe Connect settings: `https://bildout.com/api/stripe/connect/callback`
2. Check `NEXT_PUBLIC_STRIPE_CONNECT_CLIENT_ID` is correct
3. Ensure Connect is enabled in Stripe Dashboard
4. Check browser console for errors

### Issue: Price IDs not working

**Cause:** Using test mode price IDs in production

**Solution:**
1. Verify price IDs start with `price_` and were created in Live Mode
2. Check products exist in Live Mode (not Test Mode)
3. Update environment variables with Live Mode price IDs
4. Redeploy application

---

## Next Steps

After completing this checklist:

1. ✅ Complete **PRODUCTION_DEPLOYMENT_GUIDE.md** (if not already done)
2. ✅ Follow **LAUNCH_PLAN.md** for pre-launch testing
3. ✅ Monitor Stripe Dashboard for first 24 hours
4. ✅ Set up email alerts for failed payments and disputes
5. ✅ Document any Stripe-specific configurations

---

## Support Resources

- **Stripe Documentation:** https://stripe.com/docs
- **Stripe Connect Guide:** https://stripe.com/docs/connect
- **Webhook Guide:** https://stripe.com/docs/webhooks
- **Stripe Support:** https://support.stripe.com
- **Stripe Status:** https://status.stripe.com

---

**Congratulations!** 🎉 Stripe is now configured in Live Mode for production!

**Document Version:** 1.0
**Last Updated:** October 21, 2025
