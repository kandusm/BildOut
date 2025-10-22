# BildOut Production Deployment Guide

**Version:** 1.0
**Last Updated:** October 21, 2025
**Estimated Time:** 4-6 hours

This guide provides step-by-step instructions for deploying BildOut to production. Follow each section in order and check off items as you complete them.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Domain Setup](#domain-setup)
3. [Production Database (Supabase)](#production-database-supabase)
4. [Production Hosting (Vercel)](#production-hosting-vercel)
5. [Email Service (Resend)](#email-service-resend)
6. [Stripe Live Mode](#stripe-live-mode)
7. [Environment Variables Configuration](#environment-variables-configuration)
8. [Database Migrations](#database-migrations)
9. [First Deployment](#first-deployment)
10. [Post-Deployment Verification](#post-deployment-verification)
11. [Create Admin User](#create-admin-user)
12. [Monitoring Setup](#monitoring-setup)
13. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:

- [ ] A verified Stripe account with business verification completed
- [ ] A domain name registered (e.g., bildout.com)
- [ ] Access to domain DNS settings
- [ ] GitHub repository with latest code pushed
- [ ] A credit card for paid services (Vercel Pro optional, Supabase Pro optional)
- [ ] Admin email address for the platform

**Accounts you'll need:**
- Vercel account (free or Pro)
- Supabase account (free tier works, Pro recommended)
- Resend account (free tier works)
- Stripe account (must be verified for live mode)

---

## Domain Setup

### Step 1: Register Your Domain

If you haven't already registered your domain:

1. Go to a domain registrar (Namecheap, GoDaddy, Google Domains, Cloudflare, etc.)
2. Search for and purchase your domain (e.g., bildout.com)
3. Complete the registration

**Cost:** ~$10-15/year

### Step 2: Access DNS Settings

1. Log in to your domain registrar
2. Navigate to DNS management for your domain
3. Keep this tab open - you'll need it for multiple services

**Note:** DNS changes can take 1-48 hours to propagate. Start this early!

---

## Production Database (Supabase)

### Step 1: Create Production Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Settings:
   - **Name:** BildOut Production
   - **Database Password:** Generate a strong password and **save it securely**
   - **Region:** Choose closest to your target users (e.g., US East)
   - **Pricing Plan:** Free tier works, Pro recommended for production

4. Click "Create new project"
5. Wait 2-5 minutes for project to provision

### Step 2: Configure Database

1. Once project is ready, go to **Project Settings → Database**
2. Note the following connection details:
   - **Host:** `db.[project-ref].supabase.co`
   - **Database name:** `postgres`
   - **Port:** `5432`
   - **User:** `postgres`

3. **Enable Point-in-Time Recovery (PITR)** (Pro plan only):
   - Go to Project Settings → Add-ons
   - Enable "Point in Time Recovery"
   - This allows database rollback to any point in the last 7 days

### Step 3: Get API Keys

1. Go to **Project Settings → API**
2. Copy and save these values:
   - **Project URL:** `https://[project-ref].supabase.co`
   - **anon public key:** `eyJh...` (starts with eyJh)
   - **service_role key:** `eyJh...` (KEEP THIS SECRET!)

### Step 4: Configure Authentication

1. Go to **Authentication → Providers**
2. Enable **Email** provider
3. Configure email settings:
   - **Enable Email Confirmations:** Enabled
   - **Confirm Email:** Disabled (we use magic links)
   - **Secure Email Change:** Enabled
   - **Mailer Autoconfirm:** Disabled

4. Go to **Authentication → Email Templates**
5. Customize the magic link email template (optional)
6. Update email sender to use your Resend domain (we'll configure this later)

### Step 5: Configure Custom SMTP (Resend)

We'll complete this in the Resend section below.

**✅ Checkpoint:** You should now have:
- Production Supabase project created
- Project URL saved
- anon key saved
- service_role key saved

---

## Production Hosting (Vercel)

### Step 1: Create Production Vercel Project

1. Go to [https://vercel.com](https://vercel.com)
2. Click "Add New... → Project"
3. Import your GitHub repository
4. Project settings:
   - **Project Name:** bildout-production (or just "bildout")
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** .next (default)
   - **Install Command:** `npm install` (default)
   - **Node Version:** 18.x or higher

5. **DO NOT deploy yet** - click "Environment Variables" first

### Step 2: Configure Production Domain

1. After project is created, go to **Project Settings → Domains**
2. Click "Add Domain"
3. Enter your domain: `bildout.com`
4. Click "Add"
5. Vercel will show you DNS records to add

### Step 3: Configure DNS for Vercel

1. Go to your domain registrar's DNS settings
2. Add the following records as shown in Vercel:

**For root domain (bildout.com):**
```
Type: A
Name: @ (or leave blank)
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

3. Save DNS changes
4. Return to Vercel and wait for DNS verification (can take 1-48 hours)
5. Once verified, click "Refresh" in Vercel to get SSL certificate

**Note:** Vercel automatically provisions SSL certificates via Let's Encrypt

### Step 4: Configure www Redirect

1. In Vercel project settings → Domains
2. Ensure www.bildout.com redirects to bildout.com
3. Vercel does this automatically when both domains are added

**✅ Checkpoint:** You should now have:
- Vercel project created
- Domain added to Vercel
- DNS records configured
- SSL certificate pending/issued

---

## Email Service (Resend)

### Step 1: Create Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### Step 2: Add and Verify Domain

1. Go to **Domains** in Resend dashboard
2. Click "Add Domain"
3. Enter your domain: `bildout.com`
4. Click "Add"

### Step 3: Configure DNS for Email

Resend will show you DNS records to add. Go to your domain registrar and add:

**SPF Record:**
```
Type: TXT
Name: @ (or leave blank)
Value: v=spf1 include:_spf.resend.com ~all
```

**DKIM Records (3 records):**
```
Type: CNAME
Name: resend._domainkey
Value: [value provided by Resend]

Type: CNAME
Name: resend2._domainkey
Value: [value provided by Resend]

Type: CNAME
Name: resend3._domainkey
Value: [value provided by Resend]
```

**DMARC Record:**
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@bildout.com
```

4. Save all DNS records
5. Return to Resend and click "Verify DNS Records"
6. Wait for verification (can take 15 minutes to 48 hours)

### Step 4: Get Resend API Key

1. Once domain is verified, go to **API Keys** in Resend
2. Click "Create API Key"
3. Name: "BildOut Production"
4. Permission: "Full Access"
5. Click "Create"
6. **Copy and save the API key** - you won't see it again!

### Step 5: Configure Supabase to Use Resend

1. Go to your Supabase project
2. Navigate to **Project Settings → Auth → SMTP Settings**
3. Enable "Enable Custom SMTP"
4. Configure:
   - **SMTP Host:** `smtp.resend.com`
   - **Port:** `587` or `465`
   - **Username:** `resend`
   - **Password:** [Your Resend API Key]
   - **Sender Email:** `noreply@bildout.com`
   - **Sender Name:** `BildOut`

5. Click "Save"
6. Send a test email to verify it works

**✅ Checkpoint:** You should now have:
- Resend domain verified
- DNS records for email configured
- Resend API key saved
- Supabase configured to use Resend SMTP

---

## Stripe Live Mode

**Note:** See the separate `STRIPE_LIVE_MODE_CHECKLIST.md` for detailed Stripe setup instructions.

### Quick Overview

1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Switch to **Live Mode** (toggle in top right)
3. Complete business verification if not already done
4. Enable Stripe Connect
5. Create webhook endpoint for production
6. Get live mode API keys

**⚠️ CRITICAL:** Never use test mode keys in production!

We'll configure the actual values in the Environment Variables section.

---

## Environment Variables Configuration

### Step 1: Prepare All Environment Variables

Create a secure document with the following variables. You'll need to gather these from the services we just set up:

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=https://bildout.com

# Supabase (Production)
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=eyJh[your-service-role-key]

# Stripe (LIVE MODE ONLY)
STRIPE_SECRET_KEY=sk_live_[your-live-secret-key]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_[your-live-publishable-key]
STRIPE_WEBHOOK_SECRET=whsec_[your-live-webhook-secret]

# Stripe Connect
NEXT_PUBLIC_STRIPE_CONNECT_CLIENT_ID=[your-connect-client-id]

# Stripe Price IDs (Live Mode Products)
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_[your-pro-price-id]
NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID=price_[your-agency-price-id]

# Resend
RESEND_API_KEY=re_[your-resend-api-key]

# Admin
ADMIN_EMAIL=your-email@example.com
```

### Step 2: Add to Vercel

1. Go to Vercel project → **Settings → Environment Variables**
2. For **EACH** variable above:
   - Click "Add New"
   - Enter **Key** (e.g., `NEXT_PUBLIC_APP_URL`)
   - Enter **Value**
   - Select environment: **Production** only
   - Click "Save"

3. **Double-check these variables:**
   - ✅ All Stripe keys start with `sk_live_` or `pk_live_` (NOT `sk_test_`)
   - ✅ NEXT_PUBLIC_APP_URL uses `https://` not `http://`
   - ✅ No test mode keys or development URLs

4. After adding all variables, click "Redeploy" to apply them

**⚠️ SECURITY CHECKLIST:**
- [ ] All Stripe keys are LIVE mode (sk_live_, pk_live_)
- [ ] SUPABASE_SERVICE_ROLE_KEY is marked as secret (not exposed to client)
- [ ] STRIPE_SECRET_KEY is marked as secret
- [ ] RESEND_API_KEY is marked as secret
- [ ] No development or test credentials in production

**✅ Checkpoint:** All environment variables added to Vercel production environment

---

## Database Migrations

### Step 1: Locate Migration Files

1. In your project, navigate to `supabase/migrations/` directory
2. You should see numbered migration files (e.g., `001_initial_schema.sql`)

### Step 2: Run Migrations on Production Database

**Option A: Using Supabase Dashboard (Recommended)**

1. Go to your production Supabase project
2. Navigate to **SQL Editor**
3. For each migration file in order (001, 002, 003, etc.):
   - Open the migration file locally
   - Copy the entire SQL content
   - Paste into Supabase SQL Editor
   - Click "Run"
   - Verify "Success" message
   - Check for any errors

**Option B: Using Supabase CLI**

If you have Supabase CLI installed:

```bash
# Link to production project
supabase link --project-ref [your-project-ref]

# Push migrations
supabase db push
```

### Step 3: Verify Tables Created

1. In Supabase dashboard, go to **Database → Tables**
2. Verify all tables exist:
   - [ ] users
   - [ ] organizations
   - [ ] clients
   - [ ] invoices
   - [ ] invoice_items
   - [ ] invoice_status_history
   - [ ] items
   - [ ] payments
   - [ ] stripe_connect_accounts
   - [ ] subscription_plans (if applicable)

3. Click on each table and verify:
   - Columns are correct
   - RLS (Row Level Security) is enabled
   - Policies are in place

### Step 4: Test Database Connection

1. In Vercel, trigger a deployment (or wait for next step)
2. Monitor logs for database connection
3. Look for any Supabase connection errors

**✅ Checkpoint:** All database tables created and RLS policies active

---

## First Deployment

### Step 1: Trigger Production Deployment

1. Ensure all code is pushed to your main branch:
```bash
git add .
git commit -m "Production deployment configuration"
git push origin main
```

2. Go to Vercel dashboard
3. Vercel will automatically deploy when you push to main
4. Or manually trigger: Click "Deployments" → "Redeploy"

### Step 2: Monitor Build

1. Click on the deployment to view logs
2. Watch for:
   - ✅ Install dependencies
   - ✅ Build Next.js application
   - ✅ No build errors
   - ✅ Deployment successful

**Common build errors:**
- Missing environment variables → Check Vercel env vars
- TypeScript errors → Fix in code and redeploy
- Module not found → Check package.json dependencies

### Step 3: Wait for Domain SSL

1. After successful deployment, wait for SSL certificate
2. Go to **Settings → Domains**
3. Ensure both domains show "Valid Configuration"
4. SSL certificate should show as issued

### Step 4: Access Production Site

1. Open browser in incognito mode
2. Navigate to `https://bildout.com`
3. Verify:
   - [ ] Site loads successfully
   - [ ] No SSL warnings
   - [ ] Homepage displays correctly
   - [ ] No console errors (F12 → Console)

**✅ Checkpoint:** Production site is live and accessible

---

## Post-Deployment Verification

### Step 1: Test Critical User Flows

**Authentication Test:**
1. Go to `/signup`
2. Create a test account with your email
3. Check email for magic link (from noreply@bildout.com)
4. Click magic link
5. Verify you're logged in and redirected to dashboard

**Dashboard Test:**
1. Verify dashboard loads
2. Check all metrics display (should be 0 for new account)
3. Verify quick action cards are visible
4. Click through to different pages (invoices, clients, settings)

**Invoice Creation Test:**
1. Create a new client
2. Create a new invoice
3. Save as draft
4. Verify invoice appears in invoice list

**Stripe Connect Test:**
1. Go to dashboard
2. Click "Set up Stripe Connect" (if card appears)
3. Verify Stripe onboarding flow loads
4. Complete Stripe Connect onboarding with test business info
5. Return to dashboard and verify Stripe status updates

### Step 2: Test Email Delivery

1. Test authentication email (already done in Step 1)
2. Test invoice email:
   - Create an invoice
   - Click "Send Invoice" → "Send via Email"
   - Enter a test email address
   - Verify email arrives
   - Check spam folder if not in inbox

3. Use [mail-tester.com](https://www.mail-tester.com):
   - Send a test invoice to the email provided by mail-tester
   - Check your spam score (should be > 8/10)

### Step 3: Test Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click on your production webhook endpoint
3. Click "Send test webhook"
4. Select event: `checkout.session.completed`
5. Click "Send test webhook"
6. Verify webhook receives 200 OK response
7. Check Vercel logs for webhook processing

### Step 4: Test Payment Flow (Optional - Real Payment)

**⚠️ This will process a real payment!**

1. Create an invoice for $1.00
2. Send to your own email
3. Open payment link
4. Enter real credit card details
5. Complete payment
6. Verify:
   - Payment shows in Stripe dashboard
   - Invoice marked as paid in BildOut
   - Payment receipt email received
7. Refund the payment in Stripe dashboard

### Step 5: Check Analytics Tracking

If you set up PostHog or analytics:

1. Navigate through the app
2. Go to PostHog dashboard
3. Verify events are being tracked
4. Check that page views are recorded

**✅ Checkpoint:** All critical flows tested and working

---

## Create Admin User

### Step 1: Identify Your User ID

1. Log in to production site with your admin email
2. Go to Supabase production project
3. Navigate to **Authentication → Users**
4. Find your user by email
5. Copy the User ID (UUID format)

### Step 2: Grant Admin Access

1. In Supabase, go to **SQL Editor**
2. Run the following SQL (replace with your user ID):

```sql
-- Set your user as admin
UPDATE users
SET is_admin = true
WHERE id = 'your-user-id-here';
```

3. Click "Run"
4. Verify "Success: 1 row affected"

### Step 3: Verify Admin Access

1. Refresh your browser on the production dashboard
2. You should now see:
   - "Admin Dashboard" link in header
   - Admin quick action card on dashboard

3. Click "Admin Dashboard"
4. Verify you can access admin features

**✅ Checkpoint:** Admin user created and verified

---

## Monitoring Setup

### Step 1: Set Up Error Monitoring (BetterStack or Sentry)

**Using BetterStack (Recommended):**

1. Go to [https://betterstack.com](https://betterstack.com)
2. Create account and new project
3. Add logging integration for Vercel
4. Copy the source token
5. Add to Vercel environment variables:
   ```
   BETTERSTACK_SOURCE_TOKEN=your-token-here
   ```

**Using Sentry:**

1. Go to [https://sentry.io](https://sentry.io)
2. Create account and Next.js project
3. Follow integration guide
4. Install Sentry SDK:
   ```bash
   npm install @sentry/nextjs
   ```
5. Run `npx @sentry/wizard@latest -i nextjs`
6. Add Sentry DSN to environment variables

### Step 2: Set Up Uptime Monitoring

**Using UptimeRobot (Free):**

1. Go to [https://uptimerobot.com](https://uptimerobot.com)
2. Create free account
3. Click "Add New Monitor"
4. Settings:
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** BildOut Production
   - **URL:** `https://bildout.com`
   - **Monitoring Interval:** 5 minutes
5. Click "Create Monitor"
6. Add alert contacts (email, SMS)

**Create Health Check Endpoint:**

1. Create `app/api/health/route.ts`:
```typescript
export async function GET() {
  return Response.json({ status: 'ok', timestamp: new Date().toISOString() })
}
```

2. Add second monitor for `/api/health`

### Step 3: Configure Vercel Notifications

1. In Vercel project → **Settings → Notifications**
2. Enable:
   - Deployment Failed
   - Deployment Succeeded (optional)
   - Custom Deployment Protection (if using)

### Step 4: Set Up Stripe Monitoring

1. In Stripe Dashboard → **Settings → Notifications**
2. Add your email for important alerts:
   - Payment failures
   - Disputes
   - Webhook failures
   - Account issues

**✅ Checkpoint:** Monitoring services configured and active

---

## Troubleshooting

### Issue: Site Not Loading

**Possible causes:**
- DNS not propagated yet → Wait up to 48 hours
- SSL certificate not issued → Check Vercel domain settings
- Build failed → Check Vercel deployment logs

**Solutions:**
1. Check Vercel deployment status
2. Check DNS propagation: [dnschecker.org](https://dnschecker.org)
3. Verify domain configuration in Vercel
4. Check browser console for errors

### Issue: Database Connection Errors

**Error:** "Could not connect to database"

**Solutions:**
1. Verify Supabase environment variables in Vercel
2. Check Supabase project is running (not paused)
3. Verify RLS policies allow authenticated access
4. Check Vercel deployment logs for specific error

### Issue: Emails Not Sending

**Error:** "Failed to send email"

**Solutions:**
1. Verify Resend domain is verified
2. Check DNS records for SPF, DKIM, DMARC
3. Verify Resend API key in environment variables
4. Check Supabase SMTP configuration
5. Test with [mail-tester.com](https://www.mail-tester.com)

### Issue: Stripe Webhooks Failing

**Error:** Webhook returns 500 or fails

**Solutions:**
1. Verify webhook endpoint URL is correct: `https://bildout.com/api/webhooks/stripe`
2. Check webhook secret matches environment variable
3. Verify webhook API route is deployed
4. Check Vercel function logs for errors
5. Test webhook in Stripe dashboard

### Issue: Environment Variables Not Working

**Symptoms:** App uses wrong values or undefined

**Solutions:**
1. Verify variables are set in **Production** environment in Vercel
2. Redeploy after adding environment variables
3. Check for typos in variable names
4. Ensure `NEXT_PUBLIC_` prefix for client-side variables
5. Clear Vercel cache and redeploy

### Issue: Build Failures

**Common errors:**
- `Module not found` → Run `npm install` locally and commit package-lock.json
- TypeScript errors → Fix type errors and redeploy
- Environment variable missing → Add to Vercel and redeploy

**Solutions:**
1. Check Vercel build logs for specific error
2. Test build locally: `npm run build`
3. Ensure all dependencies in package.json
4. Check Node version compatibility

### Issue: 404 on Certain Routes

**Error:** Page shows 404 but exists in code

**Solutions:**
1. Verify route file structure matches Next.js App Router conventions
2. Check for typos in folder/file names
3. Ensure page.tsx or route.ts exists in route folder
4. Clear Vercel cache and redeploy

---

## Post-Launch Checklist

After successful deployment, complete these final items:

- [ ] Update LAUNCH_PLAN.md Pre-Launch Checklist items
- [ ] Verify all legal pages accessible (/privacy, /terms, /refund)
- [ ] Test all subscription flows (Free, Pro, Agency)
- [ ] Configure Stripe products and prices (see STRIPE_LIVE_MODE_CHECKLIST.md)
- [ ] Run through complete user flow one more time
- [ ] Set up Google Search Console and submit sitemap
- [ ] Configure analytics (PostHog or Google Analytics)
- [ ] Create backup of production database
- [ ] Document any production-specific configurations
- [ ] Share production URL with beta testers
- [ ] Monitor for 24 hours before public launch

---

## Support Contacts

If you encounter issues during deployment:

- **Vercel Support:** https://vercel.com/support
- **Supabase Support:** https://supabase.com/support
- **Stripe Support:** https://support.stripe.com
- **Resend Support:** support@resend.com

---

## Next Steps

After successful production deployment:

1. ✅ Complete **STRIPE_LIVE_MODE_CHECKLIST.md**
2. ✅ Follow **LAUNCH_PLAN.md** for launch preparation
3. ✅ Monitor application for 24-48 hours
4. ✅ Prepare marketing and announcement materials
5. ✅ Schedule launch date

**Congratulations!** 🎉 Your BildOut application is now live in production!

---

**Document Version:** 1.0
**Last Updated:** October 21, 2025
