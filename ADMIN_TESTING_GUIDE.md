# Admin Testing Guide

**Last Updated:** 2025-10-15
**Status:** Week 4 - Day 17 Testing Phase

---

## Overview

This guide provides step-by-step instructions for testing the admin middleware and API routes implemented in Week 4.

---

## Prerequisites

1. **Development server running:** `npm run dev` or `pnpm dev`
2. **Supabase project connected** with migration 007 applied
3. **User account created** in the application
4. **Admin access granted** to your user account

---

## Step 1: Grant Admin Access

Before testing admin features, you need to grant admin privileges to your user account.

### Option A: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Table Editor** → **users** table
3. Find your user row (match by email/id)
4. Set `is_admin` column to `true`
5. Click **Save**

### Option B: Using SQL Query

```sql
-- Replace with your actual user email
UPDATE public.users
SET is_admin = true
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
);
```

---

## Step 2: Verify Admin Status

### Test the Debug Endpoint

Open your browser or use curl:

```bash
curl http://localhost:3000/api/admin/debug
```

**Expected Response (Admin User):**
```json
{
  "authenticated": true,
  "user": {
    "id": "...",
    "email": "your-email@example.com",
    "created_at": "..."
  },
  "profile": {
    "id": "...",
    "display_name": "Your Name",
    "is_admin": true,
    "org_id": "...",
    "stripe_connect_id": "..."
  },
  "profileError": null,
  "isAdmin": true,
  "message": "✅ You have admin access!"
}
```

**Expected Response (Non-Admin User):**
```json
{
  "authenticated": true,
  "user": { ... },
  "profile": {
    "is_admin": false,
    ...
  },
  "isAdmin": false,
  "message": "❌ You do not have admin access. Run the SQL UPDATE to set is_admin = true"
}
```

---

## Step 3: Test Admin Middleware

The `requireAdmin()` middleware should protect all admin routes and redirect non-admin users.

### Test Cases

#### 1. Admin User Access ✅
- **Expected:** Access granted, data returned
- **Test:** Make requests to admin endpoints (see Step 4)

#### 2. Non-Admin User Access ❌
- **Expected:** Redirected to `/dashboard`
- **Test:** Create a second user account without admin privileges, try to access `/api/admin/merchants`

#### 3. Unauthenticated User Access ❌
- **Expected:** Redirected to `/login`
- **Test:** Log out, then try to access `/api/admin/merchants`

---

## Step 4: Test Admin API Routes

### 1. List All Merchants

**Endpoint:** `GET /api/admin/merchants`

```bash
curl http://localhost:3000/api/admin/merchants
```

**Query Parameters:**
- `status` - Filter by onboarding_status (pending/incomplete/complete/verified)
- `search` - Search by merchant name
- `limit` - Number of results per page (default: 50)
- `offset` - Pagination offset (default: 0)

**Example with filters:**
```bash
curl "http://localhost:3000/api/admin/merchants?status=complete&limit=10"
```

**Expected Response:**
```json
{
  "merchants": [
    {
      "id": "...",
      "display_name": "Merchant Name",
      "stripe_connect_id": "acct_...",
      "onboarding_status": "complete",
      "payouts_enabled": true,
      "stripe_balance": 1250.50,
      "stripe_onboarding_complete": true,
      "created_at": "...",
      "org_id": "...",
      "organizations": {
        "id": "...",
        "name": "Organization Name",
        "invoice_prefix": "INV",
        "metadata": {}
      }
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

---

### 2. Get Merchant Details

**Endpoint:** `GET /api/admin/merchants/:id`

```bash
# Replace {merchant-id} with actual merchant user ID
curl http://localhost:3000/api/admin/merchants/{merchant-id}
```

**Expected Response:**
```json
{
  "merchant": {
    "id": "...",
    "display_name": "Merchant Name",
    "stripe_connect_id": "acct_...",
    "onboarding_status": "complete",
    "payouts_enabled": true,
    "stripe_balance": 1250.50,
    "stripe_onboarding_complete": true,
    "created_at": "...",
    "updated_at": "...",
    "org_id": "...",
    "organizations": {
      "id": "...",
      "name": "Organization Name",
      "invoice_prefix": "INV",
      "invoice_number_sequence": 1,
      "metadata": {},
      "created_at": "...",
      "updated_at": "..."
    }
  },
  "invoices": [
    {
      "id": "...",
      "number": "INV-001",
      "status": "paid",
      "total": "1000.00",
      "amount_paid": "1000.00",
      "created_at": "..."
    }
  ],
  "payments": [
    {
      "id": "...",
      "amount": "1000.00",
      "status": "succeeded",
      "created_at": "...",
      "invoices": {
        "number": "INV-001"
      }
    }
  ],
  "stats": {
    "total": 10,
    "draft": 2,
    "sent": 3,
    "paid": 4,
    "overdue": 1,
    "totalVolume": 15000.00,
    "paidVolume": 12000.00
  },
  "stripeData": {
    "account": {
      "id": "acct_...",
      "charges_enabled": true,
      "payouts_enabled": true,
      "details_submitted": true,
      ...
    },
    "balance": {
      "available": [...],
      "pending": [...]
    },
    "financialSummary": {
      "availableBalance": 1250.50,
      "pendingBalance": 500.00,
      "totalVolume": 15000.00
    }
  }
}
```

---

### 3. Generate Stripe Login Link

**Endpoint:** `POST /api/admin/merchants/:id/login-link`

```bash
curl -X POST http://localhost:3000/api/admin/merchants/{merchant-id}/login-link
```

**Expected Response:**
```json
{
  "url": "https://connect.stripe.com/express/acct_.../...",
  "expiresAt": "2025-10-15T12:35:00.000Z"
}
```

**Note:** The login link expires in 5 minutes. Open the URL in a browser to access the merchant's Stripe Express dashboard.

---

### 4. Suspend Merchant

**Endpoint:** `POST /api/admin/merchants/:id/suspend`

```bash
curl -X POST http://localhost:3000/api/admin/merchants/{merchant-id}/suspend \
  -H "Content-Type: application/json" \
  -d '{"reason": "Terms of service violation"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Merchant suspended successfully",
  "merchant": {
    "id": "...",
    "name": "Merchant Name",
    "suspended": true
  }
}
```

**Side Effects:**
- Organization metadata updated with `suspended: true`
- Action logged in `admin_audit_log` table
- Merchant's dashboard should show suspension notice (to be implemented in Week 5 UI)

---

### 5. Resume Merchant

**Endpoint:** `POST /api/admin/merchants/:id/resume`

```bash
curl -X POST http://localhost:3000/api/admin/merchants/{merchant-id}/resume
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Merchant resumed successfully",
  "merchant": {
    "id": "...",
    "name": "Merchant Name",
    "suspended": false
  }
}
```

**Side Effects:**
- Organization metadata updated with `suspended: false`
- Action logged in `admin_audit_log` table

---

## Step 5: Verify Audit Logging

All admin actions are logged to the `admin_audit_log` table for accountability.

### Check Audit Logs in Supabase

1. Go to Supabase Dashboard → Table Editor
2. Open the `admin_audit_log` table
3. Verify entries exist for:
   - `generate_stripe_login_link`
   - `suspend_merchant`
   - `resume_merchant`

**Expected Schema:**
```
id | admin_user_id | action | target_type | target_id | metadata | created_at
```

---

## Step 6: Test Error Handling

### 1. Non-Existent Merchant

```bash
curl http://localhost:3000/api/admin/merchants/00000000-0000-0000-0000-000000000000
```

**Expected Response:**
```json
{
  "error": "Merchant not found"
}
```

**Status Code:** 404

---

### 2. Merchant Without Stripe Connect

Try to generate a login link for a merchant who hasn't connected Stripe:

```bash
curl -X POST http://localhost:3000/api/admin/merchants/{merchant-id}/login-link
```

**Expected Response:**
```json
{
  "error": "Merchant has no Stripe Connect account"
}
```

**Status Code:** 400

---

### 3. Invalid Authentication

Log out or use an invalid token:

```bash
curl http://localhost:3000/api/admin/merchants \
  -H "Cookie: invalid-cookie"
```

**Expected:** Redirect to `/login` (302 status code)

---

### 4. Non-Admin User

Create a second user account without admin privileges, then try to access:

```bash
curl http://localhost:3000/api/admin/merchants
```

**Expected:** Redirect to `/dashboard` (302 status code)

---

## Step 7: Performance Testing

### Test Pagination

Create multiple test merchants, then verify pagination works:

```bash
# Get first page
curl "http://localhost:3000/api/admin/merchants?limit=2&offset=0"

# Get second page
curl "http://localhost:3000/api/admin/merchants?limit=2&offset=2"
```

**Verify:**
- Each page returns correct number of results
- `pagination.hasMore` is correct
- `pagination.total` matches actual count

---

### Test Search Performance

```bash
curl "http://localhost:3000/api/admin/merchants?search=john"
```

**Verify:**
- Results are filtered correctly
- Response time is reasonable (< 500ms for small datasets)

---

## Step 8: Security Verification

### RLS Policies

The admin routes use the service role client to bypass RLS, allowing admins to view all merchants.

**Verify:**
1. Admin can see all merchants, regardless of org_id
2. Regular merchants can only see their own data via standard API routes
3. Admin audit logs are only accessible via admin routes

### Middleware Protection

**Verify:**
1. All routes under `/api/admin/*` use `requireAdmin()` middleware
2. Non-admin users are redirected (not just denied with 403)
3. Redirect preserves security (no data leakage in error messages)

---

## Test Results Checklist

- [ ] Admin debug endpoint returns correct status
- [ ] Admin user can access `/api/admin/merchants`
- [ ] Non-admin user is redirected from admin routes
- [ ] Merchant list returns all merchants with pagination
- [ ] Merchant detail page returns comprehensive data
- [ ] Stripe login link generation works
- [ ] Merchant suspension updates database correctly
- [ ] Merchant resume restores access
- [ ] Audit log entries are created for all admin actions
- [ ] Error handling works for invalid merchant IDs
- [ ] Error handling works for merchants without Stripe accounts
- [ ] Search and filters work correctly
- [ ] Pagination works correctly
- [ ] Response times are acceptable (< 500ms)

---

## Common Issues & Solutions

### Issue: `is_admin` is null instead of false

**Solution:** The migration should have set a default value of `false`. Run:

```sql
UPDATE public.users SET is_admin = false WHERE is_admin IS NULL;
ALTER TABLE public.users ALTER COLUMN is_admin SET DEFAULT false;
```

---

### Issue: Admin user redirected to dashboard

**Solution:** Check that `is_admin` is actually `true` (boolean), not the string `'true'`:

```sql
SELECT id, display_name, is_admin, pg_typeof(is_admin)
FROM public.users
WHERE id = 'your-user-id';
```

---

### Issue: Stripe data sync fails

**Solution:** Verify your Stripe API keys are set correctly in `.env.local`:

```bash
STRIPE_SECRET_KEY=sk_test_...
```

---

### Issue: Audit log not recording actions

**Solution:** Check that the `admin_audit_log` table exists:

```sql
SELECT * FROM admin_audit_log LIMIT 1;
```

If it doesn't exist, run migration 007 again.

---

## Next Steps (Week 5)

After confirming all admin API routes work correctly:

1. **Build Admin Dashboard UI** (`/admin` route)
2. **Create Merchant List Page** (`/admin/merchants`)
3. **Create Merchant Detail Page** (`/admin/merchants/[id]`)
4. **Add Admin Navigation** to the main layout
5. **Build Audit Log Viewer** (`/admin/logs`)

---

## API Route Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/debug` | Check admin status | Yes (any user) |
| GET | `/api/admin/merchants` | List all merchants | Admin only |
| GET | `/api/admin/merchants/:id` | Get merchant details | Admin only |
| POST | `/api/admin/merchants/:id/login-link` | Generate Stripe login link | Admin only |
| POST | `/api/admin/merchants/:id/suspend` | Suspend merchant | Admin only |
| POST | `/api/admin/merchants/:id/resume` | Resume merchant | Admin only |

---

**Testing Complete!** Once all checklist items pass, Week 4 Day 17 is complete and you're ready to move on to Week 5: Admin Dashboard UI.
