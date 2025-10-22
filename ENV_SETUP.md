# Environment Variables Setup Guide

**Last Updated:** 2025-10-16
**Status:** Required for Production Launch

---

## Overview

This document lists all environment variables required for BildOut to function properly in production. Review and configure these variables before launch.

---

## Required Environment Variables

### Authentication & Database

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Where to find:**
- Supabase Dashboard → Project Settings → API
- Service role key is sensitive - only use server-side

---

### Stripe Payment Processing

```env
# Stripe API Keys (REQUIRED)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx

# Stripe Webhooks (REQUIRED for webhooks)
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

**Where to find:**
- Stripe Dashboard → Developers → API keys
- Webhook secret: Stripe Dashboard → Developers → Webhooks (after creating endpoint)

**⚠️ Important:**
- Use **test keys** for development (pk_test_, sk_test_)
- Use **live keys** for production (pk_live_, sk_live_)
- Never commit keys to version control

---

### Email Service (Resend)

```env
# Resend API Configuration (REQUIRED for emails)
RESEND_API_KEY=re_xxx

# Email From Address (OPTIONAL - defaults to noreply@bildout.com)
FROM_EMAIL=BildOut <noreply@bildout.com>
```

**Where to find:**
- Resend Dashboard → API Keys → Create API Key

**Setup Required:**
1. Create Resend account at https://resend.com
2. Verify domain (bildout.com)
3. Generate API key
4. Test email delivery

**Status:** 🔴 **NOT CONFIGURED** - Add before Week 7 features work

---

### Application URLs

```env
# Application Base URL (REQUIRED)
NEXT_PUBLIC_APP_URL=https://bildout.com
```

**Notes:**
- Use `http://localhost:3000` for development
- Use production domain for production
- Used for:
  - Stripe return/refresh URLs
  - Email links
  - OAuth callbacks

---

### Optional Environment Variables

```env
# Sentry Error Tracking (OPTIONAL)
SENTRY_DSN=https://xxx@sentry.io/xxx

# PostHog Analytics (OPTIONAL)
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Better Stack Monitoring (OPTIONAL)
BETTERSTACK_API_KEY=xxx
```

---

## Environment-Specific Configurations

### Development (.env.local)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Stripe (TEST MODE)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx  # From `stripe listen`

# Resend (TEST MODE)
RESEND_API_KEY=re_xxx

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production (Vercel/Railway/Render)

```env
# Supabase (Production Project)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Stripe (LIVE MODE)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx  # From production webhook

# Resend (LIVE MODE)
RESEND_API_KEY=re_xxx
FROM_EMAIL=BildOut <noreply@bildout.com>

# App URL
NEXT_PUBLIC_APP_URL=https://bildout.com

# Optional: Monitoring
SENTRY_DSN=https://xxx@sentry.io/xxx
```

---

## Pre-Launch Checklist

### Week 7 Email Features

- [ ] Create Resend account
- [ ] Verify bildout.com domain in Resend
- [ ] Generate production Resend API key
- [ ] Add `RESEND_API_KEY` to production environment
- [ ] Test onboarding reminder email delivery
- [ ] Verify SPF/DKIM records for domain

### Stripe Configuration

- [ ] Switch from test to live Stripe keys
- [ ] Create production webhook endpoint
- [ ] Update `STRIPE_WEBHOOK_SECRET` with production secret
- [ ] Test payment flow with live keys
- [ ] Verify webhook events are being received

### Database

- [ ] Create production Supabase project
- [ ] Run all database migrations
- [ ] Configure RLS policies
- [ ] Add production Supabase keys to environment
- [ ] Test database connection

### Domain & URLs

- [ ] Configure custom domain (bildout.com)
- [ ] Update `NEXT_PUBLIC_APP_URL` to production URL
- [ ] Verify SSL certificate
- [ ] Test all OAuth flows with production URL

---

## Security Best Practices

### Never Commit Secrets

Add to `.gitignore`:
```
.env
.env.local
.env.production
.env.*.local
```

### Rotate Keys Regularly

- Rotate API keys every 90 days
- Immediately rotate if compromised
- Use different keys per environment

### Restrict Service Role Key

The `SUPABASE_SERVICE_ROLE_KEY` bypasses all RLS policies:
- Only use server-side
- Never expose to client
- Only use in API routes and server components

### Validate Environment on Startup

The app will throw errors if required variables are missing:
- `NEXT_PUBLIC_SUPABASE_URL`
- `STRIPE_SECRET_KEY`
- `RESEND_API_KEY` (for email features)

---

## Testing Environment Variables

### Local Development

Create `.env.local`:
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

### Verify Configuration

```bash
# Check if all required variables are set
npm run build

# Should compile without errors
```

---

## Platform-Specific Instructions

### Vercel

1. Go to Project Settings → Environment Variables
2. Add each variable for Production environment
3. Optionally add for Preview/Development
4. Redeploy after adding variables

### Railway

1. Go to Project → Variables
2. Add each variable as Raw Editor
3. Railway auto-redeploys on variable changes

### Render

1. Go to Dashboard → Environment
2. Add each key-value pair
3. Click "Save Changes"
4. Manually trigger redeploy

---

## Troubleshooting

### "RESEND_API_KEY is not defined"

**Solution:** Add Resend API key to environment variables, or email features will not work.

### "STRIPE_WEBHOOK_SECRET not configured"

**Solution:** Set up Stripe webhook endpoint and add secret to environment.

### "Supabase client error"

**Solution:** Verify Supabase URL and keys are correct and project is active.

### Emails not sending

**Check:**
1. `RESEND_API_KEY` is set
2. Domain is verified in Resend
3. Check Resend dashboard for delivery logs
4. Verify SPF/DKIM DNS records

---

## Support

If you encounter issues with environment configuration:

1. Check this document for configuration details
2. Verify all required variables are set
3. Check platform logs for specific errors
4. Verify API keys are valid and not expired

---

**Next Steps:**
Before launching, complete the Pre-Launch Checklist above to ensure all environment variables are properly configured.

---

*End of Environment Variables Setup Guide*
