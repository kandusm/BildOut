# Stripe Webhook Setup Guide

**Last Updated:** 2025-10-16
**Purpose:** Configure Stripe webhooks to automatically sync merchant account status

---

## Overview

The BildOut platform uses Stripe webhooks to automatically update merchant account information when changes occur in Stripe. This ensures that the admin dashboard always shows accurate, real-time data about merchant onboarding status, payouts, and account balances.

---

## Webhook Endpoint

**URL:** `https://your-domain.com/api/webhooks/stripe`

**Handled Events:**
- `account.updated` - Syncs merchant onboarding status, payouts, and balance
- `payment_intent.succeeded` - Creates payment records and updates invoices
- `payment_intent.payment_failed` - Records failed payment attempts

---

## Local Development Testing

### 1. Install Stripe CLI

```bash
# Windows (via Scoop)
scoop install stripe

# macOS (via Homebrew)
brew install stripe/stripe-cli/stripe

# Or download from: https://stripe.com/docs/stripe-cli
```

### 2. Login to Stripe CLI

```bash
stripe login
```

This will open your browser to authorize the CLI with your Stripe account.

### 3. Forward Webhooks to Local Server

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Important:** Copy the webhook signing secret that appears (starts with `whsec_`).

### 4. Update Environment Variables

Add the webhook secret to your `.env.local` file:

```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret_here
```

### 5. Test the Webhook

In a new terminal, trigger a test event:

```bash
# Test account.updated event
stripe trigger account.updated

# Test payment_intent.succeeded event
stripe trigger payment_intent.succeeded
```

### 6. Verify in Logs

Check your Next.js server logs. You should see:

```
[Stripe Webhook] Received event: account.updated
[Stripe Webhook] Processing account.updated for account: acct_xxx
[Stripe Webhook] ✅ Updated user John Doe (uuid): { ... }
```

---

## Production Setup

### 1. Create Webhook Endpoint in Stripe Dashboard

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Enter your production URL: `https://bildout.com/api/webhooks/stripe`
4. Click **"Select events"**
5. Select these events:
   - `account.updated`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
6. Click **"Add endpoint"**

### 2. Copy Webhook Signing Secret

After creating the endpoint:
1. Click on your new webhook endpoint
2. Click **"Reveal"** next to "Signing secret"
3. Copy the secret (starts with `whsec_`)

### 3. Add to Production Environment

Add the webhook secret to your production environment variables:

**Vercel:**
1. Go to your project settings → Environment Variables
2. Add: `STRIPE_WEBHOOK_SECRET` = `whsec_your_production_secret`
3. Redeploy your application

**Railway/Render/Other:**
- Follow platform-specific instructions to add the environment variable
- Ensure the variable is available to your application

---

## What the Webhook Does

### account.updated Event

When a merchant's Stripe Connect account is updated, the webhook automatically:

1. **Fetches merchant user record** from database
2. **Calculates onboarding status:**
   - `pending` - Account created, but details not submitted
   - `incomplete` - Details submitted, but not all requirements met
   - `complete` - Charges and payouts both enabled
3. **Retrieves account balance** from Stripe
4. **Updates database fields:**
   - `stripe_onboarding_complete`
   - `onboarding_status`
   - `payouts_enabled`
   - `stripe_balance`
5. **Logs action** to admin audit trail

### payment_intent.succeeded Event

When a payment succeeds:

1. Creates a `payments` record
2. Updates the associated invoice:
   - Increments `amount_paid`
   - Decrements `amount_due`
   - Updates `status` to `paid` or `partial`

### payment_intent.payment_failed Event

When a payment fails:

1. Creates a `payments` record with `status: 'failed'`
2. Allows admin to view failed payment attempts

---

## Event Idempotency

The webhook endpoint uses the `stripe_events` table to ensure idempotency:

- Each event is stored with its unique Stripe event ID
- Duplicate webhooks are automatically detected and skipped
- Events are marked as `processed: true` after successful handling

---

## Monitoring

### Check Webhook Status

**Stripe Dashboard:**
- Go to Developers → Webhooks
- View recent deliveries and their HTTP status codes
- 200 = Success, 400/500 = Error

### Application Logs

Webhook activity is logged with the `[Stripe Webhook]` prefix:

```
[Stripe Webhook] Received event: account.updated
[Stripe Webhook] Processing account.updated for account: acct_xxx
[Stripe Webhook] ✅ Updated user John Doe (uuid)
```

### Admin Audit Logs

All `account.updated` events are logged in the admin audit trail:

- Action: `stripe_account_synced`
- Target: Merchant user
- Metadata: Includes account status, balance, capabilities

Access via: `/admin/logs`

---

## Troubleshooting

### Webhook Returns 400 (Bad Request)

**Cause:** Signature verification failed

**Fix:**
1. Verify `STRIPE_WEBHOOK_SECRET` matches the value in Stripe Dashboard
2. Ensure you're using the correct secret for your environment (test vs. production)
3. Check that the endpoint URL matches exactly (no typos)

### Webhook Returns 500 (Internal Server Error)

**Cause:** Error processing the event

**Fix:**
1. Check application logs for error details
2. Verify database connection is working
3. Ensure all required environment variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `STRIPE_SECRET_KEY`

### Events Not Appearing in Admin Logs

**Cause:** Audit log insertion failed

**Fix:**
1. Check that `admin_audit_log` table exists
2. Verify RLS policies allow service role to insert
3. Review application logs for specific errors

### Balance Not Updating

**Cause:** Error fetching balance from Stripe

**Fix:**
1. Verify merchant has a valid Stripe Connect account
2. Check that `STRIPE_SECRET_KEY` has correct permissions
3. Review logs for specific Stripe API errors

---

## Testing Checklist

Before deploying to production, test these scenarios:

- [ ] Webhook receives and verifies signature correctly
- [ ] `account.updated` event updates merchant status
- [ ] `account.updated` event syncs account balance
- [ ] `account.updated` event logs to audit trail
- [ ] `payment_intent.succeeded` creates payment record
- [ ] `payment_intent.succeeded` updates invoice status
- [ ] Duplicate events are handled gracefully (idempotency)
- [ ] Failed events are logged with error details

---

## Security Notes

### Signature Verification

**Always verify webhook signatures** to ensure events are from Stripe:

```typescript
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  webhookSecret
)
```

Never skip this step or accept unsigned requests.

### Service Role Key

The webhook uses the Supabase service role key to bypass RLS policies:

- This is necessary because webhooks are not authenticated as a specific user
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret and secure
- Never expose it in client-side code

### HTTPS Required

Stripe webhooks **require HTTPS** in production:

- Use a valid SSL certificate
- Stripe will not send webhooks to HTTP endpoints
- Use ngrok or similar for local HTTPS testing if needed

---

## Resources

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Testing Webhooks](https://stripe.com/docs/webhooks/test)
- [Webhook Best Practices](https://stripe.com/docs/webhooks/best-practices)

---

**Next Steps:**

After setting up webhooks, merchant account status will automatically sync from Stripe. You can verify this by:

1. Viewing the Admin Dashboard (`/admin`)
2. Checking merchant details (`/admin/merchants/[id]`)
3. Reviewing audit logs (`/admin/logs`) for `stripe_account_synced` events

---

*End of Stripe Webhook Setup Guide*
