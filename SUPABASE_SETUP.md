# Supabase Setup Guide

This guide will help you set up your Supabase project and connect it to QuickBill.

---

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create a free account
3. Click "New Project"
4. Fill in the details:
   - **Name:** QuickBill (or your preferred name)
   - **Database Password:** Create a strong password (save this securely!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free (upgrade later if needed)
5. Click "Create new project"
6. Wait 2-3 minutes for the project to initialize

---

## Step 2: Get Your API Keys

Once your project is ready:

1. Go to **Project Settings** (gear icon in left sidebar)
2. Click **API** in the settings menu
3. You'll see two important values:

### Project URL
```
https://your-project-ref.supabase.co
```

### API Keys
- **anon/public key** (starts with `eyJ...`) - safe to use in frontend
- **service_role key** (starts with `eyJ...`) - NEVER expose in frontend!

---

## Step 3: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and fill in your Supabase credentials:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 4: Run Database Migration

You have two options to run the migration:

### Option A: Using Supabase Dashboard (Recommended for beginners)

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New query**
3. Open `supabase/migrations/001_initial_schema.sql` from your project
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **Run** button
7. You should see "Success. No rows returned" (this is normal!)

### Option B: Using Supabase CLI (For advanced users)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

---

## Step 5: Verify Database Setup

1. Go to **Table Editor** in Supabase dashboard
2. You should see the following tables:
   - ✅ organizations
   - ✅ users
   - ✅ clients
   - ✅ items
   - ✅ invoices
   - ✅ invoice_items
   - ✅ payments
   - ✅ stripe_events

3. Click on any table to verify it has the correct columns

---

## Step 6: Configure Authentication

1. Go to **Authentication** → **Providers** in Supabase dashboard
2. **Email** should already be enabled
3. Configure email settings:
   - Enable "Confirm email" (optional for MVP, but recommended)
   - Customize email templates (optional)

4. **Site URL** settings (under **Authentication** → **URL Configuration**):
   - Site URL: `http://localhost:3000` (for development)
   - Redirect URLs: Add `http://localhost:3000/auth/callback`

---

## Step 7: Set Up Storage Bucket

The migration should have created a `documents` bucket automatically. Verify:

1. Go to **Storage** in Supabase dashboard
2. You should see a bucket named **documents**
3. Click on it to verify it's set to **Private** (not public)

If the bucket wasn't created, create it manually:
1. Click **New bucket**
2. Name: `documents`
3. Public: **OFF** (keep it private)
4. Click **Create bucket**

---

## Step 8: Test Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser console (F12)
3. You should NOT see any Supabase connection errors

4. Test the connection by creating a test user:
   - Go to **Authentication** → **Users** in Supabase
   - Click **Add user**
   - Email: `test@example.com`
   - Password: `testpassword123`
   - Auto Confirm User: **ON**
   - Click **Create user**

5. Check the **users** and **organizations** tables:
   - A new organization should have been auto-created
   - A new user profile should have been created
   - This confirms the trigger is working!

---

## Troubleshooting

### Error: "Invalid API key"
- Double-check you copied the correct keys from Supabase dashboard
- Make sure there are no extra spaces in `.env.local`
- Restart your dev server after changing env vars

### Error: "relation does not exist"
- The migration didn't run successfully
- Go back to Step 4 and run the migration again
- Check SQL Editor for any error messages

### Storage bucket not working
- Verify the bucket exists and is named exactly `documents`
- Check that RLS policies were created (they're in the migration)
- Try creating the bucket manually if auto-creation failed

### Auto-user creation not working
- Check that the trigger `on_auth_user_created` exists
- Go to **Database** → **Functions** and verify `handle_new_user` exists
- If missing, re-run the migration

---

## Next Steps

Once Supabase is set up:
1. ✅ Environment variables configured
2. ✅ Database schema created
3. ✅ Authentication enabled
4. ✅ Storage bucket ready

You're ready to move on to **Day 3: Configure Shadcn UI and build authentication pages!**

---

## Useful Supabase Dashboard Links

- **Table Editor:** View and edit database records
- **SQL Editor:** Run custom SQL queries
- **Authentication:** Manage users and auth settings
- **Storage:** Manage file storage
- **Database → Triggers:** View auto-created triggers
- **Database → Functions:** View database functions
- **Logs:** Debug API requests and errors

---

## Security Notes

⚠️ **IMPORTANT:**
- NEVER commit `.env.local` to git (it's in `.gitignore`)
- NEVER share your `SERVICE_ROLE_KEY` publicly
- The `anon` key is safe to use in frontend code
- RLS policies are enforced by default on all tables

---

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- GitHub Issues: https://github.com/supabase/supabase/issues

---

**Ready to build!** 🚀
