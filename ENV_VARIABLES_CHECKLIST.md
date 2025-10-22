# Environment Variables - Pre-Launch Checklist

**Status:** 🔴 INCOMPLETE - Required for Production

---

## Quick Checklist

Use this checklist before launching to production. See **ENV_SETUP.md** for detailed instructions.

### Supabase Configuration
- [ ] Production Supabase project created
- [ ] `NEXT_PUBLIC_SUPABASE_URL` configured
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configured
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configured
- [ ] Database migrations run on production
- [ ] RLS policies tested

### Stripe Configuration
- [ ] Switch to Stripe Live mode
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` updated (pk_live_)
- [ ] `STRIPE_SECRET_KEY` updated (sk_live_)
- [ ] Production webhook endpoint created
- [ ] `STRIPE_WEBHOOK_SECRET` updated with production secret
- [ ] Test payment flow with live keys
- [ ] Webhook events verified

### Resend Email Service (Week 7 Features)
- [ ] 🔴 Resend account created
- [ ] 🔴 Domain (bildout.com) verified in Resend
- [ ] 🔴 SPF/DKIM DNS records configured
- [ ] 🔴 Production API key generated
- [ ] 🔴 `RESEND_API_KEY` configured
- [ ] 🔴 `FROM_EMAIL` configured (optional)
- [ ] 🔴 Test onboarding reminder email sent successfully

**⚠️ Note:** Email features (onboarding reminders, receipts, notifications) **will not work** until Resend is configured!

### Application Configuration
- [ ] `NEXT_PUBLIC_APP_URL` updated to production URL (https://bildout.com)
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] All OAuth flows tested with production URL

### Security Review
- [ ] All secrets stored in platform environment variables (not in code)
- [ ] `.env` files added to `.gitignore`
- [ ] Service role key usage reviewed (server-side only)
- [ ] API keys rotated if previously exposed

### Testing
- [ ] App builds successfully with production env vars
- [ ] Email sending tested in production
- [ ] Stripe webhooks tested in production
- [ ] Payment flow tested end-to-end

---

## Current Status

### ✅ Completed
- Email infrastructure code (Resend client, templates)
- Onboarding reminder functionality
- Webhook handler for Stripe events
- All admin features (Week 6-7)

### 🔴 Pending (BEFORE LAUNCH)
- Resend account setup
- Domain verification for emails
- Production API keys configuration
- Environment variables deployment

---

## Impact if Not Configured

### Without Resend Email Service:
- ❌ Onboarding reminder emails won't send
- ❌ Invoice emails won't send (Week 9)
- ❌ Payment receipt emails won't send (Week 9)
- ❌ Overdue reminders won't send (Week 9)
- ✅ Core app still functions (invoices, payments, admin)

### Without Stripe Live Keys:
- ❌ Real payments won't process
- ❌ Merchant payouts won't work
- ✅ Can still use test mode for demos

### Without Production Supabase:
- ❌ App won't connect to database
- ❌ Authentication won't work
- ❌ Nothing will work

---

## Next Steps

1. **NOW:** Review this checklist
2. **Week 17:** Complete all items before launch
3. **Reference:** See ENV_SETUP.md for step-by-step instructions
4. **Deploy:** Update environment variables in hosting platform
5. **Test:** Verify all features work in production

---

**Documents:**
- 📄 **ENV_SETUP.md** - Complete setup guide
- 📄 **ENV_VARIABLES_CHECKLIST.md** - This checklist
- 📄 **.env.example** - Template for environment variables
- 📄 **STRIPE_WEBHOOK_SETUP.md** - Stripe webhook configuration

---

*Last Updated: 2025-10-16*
