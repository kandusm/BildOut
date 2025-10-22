# Stripe Subscription Setup Guide

This guide explains how to set up subscription products and prices in Stripe for BildOut's tiered pricing.

## Prerequisites

- Stripe account (test mode for development, live mode for production)
- Access to Stripe Dashboard
- Database migration completed (`202510 16_add_subscription_fields.sql`)

## Step 1: Create Products in Stripe Dashboard

### Pro Plan
1. Go to Stripe Dashboard → Products → Add Product
2. Product details:
   - **Name:** BildOut Pro
   - **Description:** Professional invoicing for growing businesses
   - **Pricing:** $15/month
   - **Billing period:** Monthly
   - **Price ID:** Copy this for env vars (e.g., `price_xxxxx`)

### Agency Plan
1. Create another product:
   - **Name:** BildOut Agency
   - **Description:** Advanced features for agencies and teams
   - **Pricing:** $49/month
   - **Billing period:** Monthly
   - **Price ID:** Copy this for env vars (e.g., `price_yyyyy`)

## Step 2: Update Environment Variables

Add the following to your `.env.local`:

```
# Stripe Subscription Price IDs
STRIPE_PRO_PRICE_ID=price_xxxxx
STRIPE_AGENCY_PRICE_ID=price_yyyyy

# Optional: Add to public env for client-side reference
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_xxxxx
NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID=price_yyyyy
```

## Step 3: Configure Stripe Customer Portal

1. Go to Stripe Dashboard → Settings → Customer portal
2. Enable the customer portal
3. Configure allowed actions:
   - ✅ Customers can update payment methods
   - ✅ Customers can update billing information
   - ✅ Customers can cancel subscriptions
   - ✅ Customers can switch plans (if desired)
4. Set cancellation behavior:
   - Choose "Cancel at period end" (recommended)
5. Set return URL: `https://bildout.com/dashboard/settings/subscription`

## Step 4: Add Webhook Events

Ensure your webhook endpoint is configured to handle these events:

- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `checkout.session.completed`

Webhook URL: `https://bildout.com/api/webhooks/stripe`

## Step 5: Test the Subscription Flow

### Test Mode
1. Use Stripe test card: `4242 4242 4242 4242`
2. Try upgrading from Free → Pro
3. Test Stripe Customer Portal access
4. Verify webhook events are processed
5. Check database updates (`organizations` table)

### Verification Checklist
- [ ] Checkout session redirects to success page
- [ ] Subscription appears in Stripe Dashboard
- [ ] Organization `subscription_plan` updated to `pro` or `agency`
- [ ] Organization `stripe_customer_id` and `stripe_subscription_id` populated
- [ ] Customer Portal link works
- [ ] Cancellation works and downgrades to `free`
- [ ] Webhook events logged in `stripe_events` table

## Step 6: Production Setup

1. Repeat Steps 1-4 in **Live mode** in Stripe
2. Update production environment variables with **live** Price IDs
3. Ensure production webhook endpoint is active
4. Test with a real payment method

## Pricing Tier Features

### Free Plan ($0/month)
- 10 invoices per month
- Up to 5 clients
- Basic invoicing
- No custom branding
- No email reminders
- No analytics

### Pro Plan ($15/month)
- Unlimited invoices
- Unlimited clients
- Custom branding & logo
- Automated email reminders
- Analytics & reporting
- Data export (CSV)
- Up to 3 team members

### Agency Plan ($49/month)
- Everything in Pro
- Priority support
- Unlimited team members
- API access
- Advanced analytics
- White-label options

## Feature Gates

Feature gates are implemented in:
- `lib/subscription-config.ts` - Plan definitions and helper functions
- Invoice creation: Check `invoiceLimit` before allowing new invoices
- Client creation: Check `clientLimit` before allowing new clients
- Branding page: Check `customBranding` feature flag
- Analytics page: Check `analytics` feature flag

## Troubleshooting

### Webhook not firing
- Check webhook signing secret is correct
- Verify webhook URL is accessible
- Check Stripe Dashboard → Developers → Webhooks for delivery attempts
- Review server logs for webhook errors

### Subscription not updating
- Check `stripe_events` table for duplicate event IDs
- Verify `org_id` is in checkout session metadata
- Check supabase service role key is configured
- Review webhook handler logs

### Customer Portal not working
- Ensure customer portal is enabled in Stripe settings
- Verify `stripe_customer_id` exists in organization record
- Check return URL is whitelisted in Stripe settings

## Support

For issues, check:
1. Server logs (`/api/webhooks/stripe` endpoint)
2. Stripe Dashboard → Events (webhook delivery)
3. Supabase logs (RLS policies, database errors)
4. Database: `stripe_events` and `organizations` tables
