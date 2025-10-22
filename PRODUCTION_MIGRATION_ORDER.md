# Production Database Migration Order

**Last Updated:** October 22, 2025

Run these migrations in **exact order** on your production Supabase database.

## ⚠️ Important Notes

- Run migrations one at a time
- Verify each migration succeeds before running the next
- Do NOT skip any migrations
- If a migration fails, resolve the error before continuing

---

## Migration Sequence

### 1. Initial Schema
```
001_initial_schema.sql
```
Creates all base tables (users, organizations, invoices, clients, payments, etc.)

### 2. Status History System
```
002_add_status_history.sql
002b_verify_and_fix_trigger.sql
```
Adds invoice status tracking and fixes auth trigger

### 3. Storage & Assets
```
003_storage_bucket.sql
004_branding_storage.sql
```
Sets up file storage for logos and branding

### 4. Organization Fields
```
005_add_org_address.sql
006_add_default_tax_rate.sql
```
Adds address and tax rate fields to organizations

### 5. Admin & Merchant Management
```
007_add_merchant_management_fields.sql
008_add_admin_rls_policies.sql
009_fix_admin_rls_recursion.sql
```
Adds admin functionality and merchant management

### 6. Company Types & Preset Items
```
010_add_company_type_and_preset_items.sql
```
Adds industry-specific preset invoice items

### 7. Subscription System (CRITICAL ORDER)
```
010b_add_subscription_fields.sql    ← Must run BEFORE 011
011_add_subscription_override.sql   ← Depends on 010b
```
⚠️ **010b MUST run before 011** - Do not reverse this order!

---

## Quick Copy-Paste Order

For reference, here's the complete list in order:

```
001_initial_schema.sql
002_add_status_history.sql
002b_verify_and_fix_trigger.sql
003_storage_bucket.sql
004_branding_storage.sql
005_add_org_address.sql
006_add_default_tax_rate.sql
007_add_merchant_management_fields.sql
008_add_admin_rls_policies.sql
009_fix_admin_rls_recursion.sql
010_add_company_type_and_preset_items.sql
010b_add_subscription_fields.sql
011_add_subscription_override.sql
```

**Total:** 13 migration files

---

## How to Run in Supabase

### Option 1: Supabase Dashboard (Recommended)

1. Go to your **Production** Supabase project
2. Navigate to **SQL Editor**
3. For each migration file (in order):
   - Open the file locally
   - Copy the entire SQL content
   - Paste into Supabase SQL Editor
   - Click "Run"
   - Verify "Success" message
   - **Check for any errors before continuing**

### Option 2: Supabase CLI

If you have Supabase CLI installed and linked:

```bash
supabase link --project-ref [your-production-project-ref]
supabase db push
```

This will automatically run all migrations in order.

---

## Verification After All Migrations

After running all migrations, verify tables exist:

```sql
-- Run this query to check all tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected tables:**
- clients
- invoice_items
- invoice_status_history
- invoices
- items
- organizations
- payments
- stripe_connect_accounts
- users

**Expected RLS:**
```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

All tables should have `rowsecurity = true`.

---

## Troubleshooting

### Error: Column already exists
- You may have run this migration before
- Safe to skip if the column exists and matches the schema

### Error: Function already exists
- Drop and recreate: `DROP FUNCTION IF EXISTS function_name CASCADE;`
- Then re-run the migration

### Error: Relation does not exist
- You skipped a migration or ran them out of order
- Go back and run the missing migration

### Error: Permission denied
- Ensure you're using the service_role key
- Or run migrations through Supabase dashboard (has full permissions)

---

## Post-Migration Tasks

After all migrations are complete:

1. **Enable Point-in-Time Recovery (PITR)**
   - Go to Project Settings → Add-ons
   - Enable PITR for production safety

2. **Verify RLS Policies**
   - Test that users can only access their own data
   - Test admin can access all data

3. **Create First Admin User**
   - Sign up on production site
   - Update user: `UPDATE users SET is_admin = true WHERE id = 'your-user-id';`

---

**Questions?** See PRODUCTION_DEPLOYMENT_GUIDE.md for full deployment instructions.
