# Subscription Limits Testing Guide

**Date:** 2025-10-17
**Status:** Ready for Testing

---

## Current Database State

Based on the test script results:

| Organization | Invoices (This Month) | Clients | Status |
|--------------|----------------------|---------|--------|
| **CommComms** | 10 / 10 | 1 / 5 | 🚫 **Invoice Limit Reached** |
| PopSocket | 4 / 10 | 1 / 5 | ✅ Under Limit |
| CommVergent Automation | 1 / 10 | 1 / 5 | ✅ Under Limit |
| Test Business | 0 / 10 | 0 / 5 | ✅ Under Limit |
| Test business 1 | 0 / 10 | 0 / 5 | ✅ Under Limit |

All organizations are on the **Free plan** (10 invoices/month, 5 clients total).

---

## Test Scenarios

### ✅ Test 1: Invoice Limit Enforcement (READY TO TEST)

**Organization:** CommComms (already at 10/10 invoices)

**Steps:**
1. Open http://localhost:3001
2. Log in to the app
3. Switch to **CommComms** organization (if you have org switching)
4. Navigate to `/dashboard/invoices/new`
5. Fill out the invoice form with any data
6. Click "Create Invoice"

**Expected Result:**
- ❌ Invoice creation should FAIL
- ✅ Error message should appear with:
  - **Title:** "Invoice limit reached"
  - **Message:** "You've reached your plan's limit of 10 invoices per month. Upgrade to Pro for unlimited invoices."
  - **Button:** "Upgrade Plan" (links to `/dashboard/settings/subscription`)
- ✅ Form should remain disabled after error
- ✅ No invoice should be created in the database

**Screenshot Locations to Check:**
- Error appears below the form
- Error has orange "Upgrade Plan" button
- Button text is clear and actionable

---

### ✅ Test 2: Invoice Creation Under Limit (READY TO TEST)

**Organization:** PopSocket (4/10 invoices) or any other org with < 10 invoices

**Steps:**
1. Log in to the app
2. Switch to **PopSocket** organization
3. Navigate to `/dashboard/invoices/new`
4. Fill out the invoice form
5. Click "Create Invoice"

**Expected Result:**
- ✅ Invoice should be created successfully
- ✅ Redirect to invoice detail page
- ✅ No error messages
- ✅ Invoice count should increase (now 5/10 for PopSocket)

---

### ✅ Test 3: Client Limit Enforcement (READY TO TEST)

**Organization:** Any org (all have < 5 clients currently)

**Steps to Reach Limit:**
1. Log in to **Test Business** organization (0/5 clients)
2. Navigate to `/dashboard/clients`
3. Click "Add Client" button
4. Create 5 clients (one by one):
   - Client 1, Client 2, Client 3, Client 4, Client 5
5. Try to create a 6th client

**Expected Result on 6th Client:**
- ❌ Client creation should FAIL
- ✅ Error message in the dialog:
  - **Title:** "Client limit reached"
  - **Message:** "You've reached your plan's limit of 5 clients. Upgrade to Pro for unlimited clients."
  - **Button:** "Upgrade Plan"
- ✅ Dialog should stay open with error displayed
- ✅ No client should be created in database

---

### ✅ Test 4: Verify Upgrade Prompt UI

**When limit is reached, check:**

1. **Error Display:**
   - [ ] Error appears in a red/orange bordered box
   - [ ] Error title is bold and prominent
   - [ ] Error message is clear and explains the limit
   - [ ] "Upgrade Plan" button is visible and styled

2. **Button Functionality:**
   - [ ] Click "Upgrade Plan" button
   - [ ] Should navigate to `/dashboard/settings/subscription`
   - [ ] Subscription page loads correctly
   - [ ] Can see plan comparison (Free, Pro, Agency)

3. **Form State:**
   - [ ] Form remains visible (not hidden)
   - [ ] Submit button is re-enabled after error
   - [ ] User can edit the form
   - [ ] Can try submitting again (will get same error)

---

## Test 5: Month Rollover (Invoice Limit Reset)

**Note:** This tests the monthly invoice limit reset.

**Current Month:** October 2025
**Invoice Count:** CommComms has 10 invoices created in October

**Test on November 1st:**
1. Log in as CommComms organization
2. Check invoice count (should still show 10 total invoices)
3. Try to create a new invoice
4. Should succeed (limit resets monthly)

**Alternative Test (Database Manipulation):**
1. Manually update an invoice's `created_at` to last month
2. Run test script: `node test-subscription-limits.js`
3. Verify count decreases
4. Try creating invoice (should succeed if under 10 this month)

---

## Test 6: Pro Plan (Unlimited Access)

**Setup Required:**
1. Update one organization to Pro plan:
   ```sql
   UPDATE organizations
   SET subscription_plan = 'pro'
   WHERE id = 'c03994cb-1df6-4496-aea8-69d0f291264a'; -- PopSocket
   ```

2. Run test script to verify:
   ```bash
   node test-subscription-limits.js
   ```

**Expected Output:**
```
📊 Testing Limits for: PopSocket
   Plan: pro

   📄 Invoices (this month): 4 / unlimited ✅ OK
   👥 Clients: 1 / unlimited ✅ OK
```

**Browser Test:**
1. Log in as PopSocket
2. Create 11+ invoices (should all succeed)
3. Create 6+ clients (should all succeed)
4. No limit errors should appear

---

## Test 7: Error Handling Edge Cases

### A. Network Error During Limit Check
1. Disconnect internet
2. Try to create invoice
3. Should show generic error (not upgrade prompt)

### B. Malformed API Response
1. Temporarily break the API (comment out limit check)
2. Verify form handles unexpected responses gracefully

### C. Multiple Rapid Submissions
1. Fill out invoice form
2. Click submit multiple times rapidly
3. Should only create one invoice (or show one error)
4. Loading state should prevent double-submission

---

## Verification Checklist

After testing, verify the following:

### API Level
- [ ] `/api/invoices` POST returns 403 when limit reached
- [ ] Error response includes `upgradeRequired: true`
- [ ] Error response includes `limit`, `current`, `plan` fields
- [ ] `/api/clients` POST returns 403 when limit reached

### UI Level
- [ ] Invoice form shows upgrade prompt on limit
- [ ] Client dialog shows upgrade prompt on limit
- [ ] "Upgrade Plan" button navigates correctly
- [ ] Error messages are user-friendly and actionable

### Database Level
- [ ] Run `node test-subscription-limits.js` shows accurate counts
- [ ] Invoices are NOT created when limit is reached
- [ ] Clients are NOT created when limit is reached
- [ ] `subscription_plan` column defaults to 'free'

### User Experience
- [ ] Loading states work during submission
- [ ] Form is disabled during submission
- [ ] Error clears when user edits form
- [ ] Can retry after fixing the issue (or upgrading)

---

## Automated Testing Commands

```bash
# Check current limits for all orgs
node test-subscription-limits.js

# Test specific organization
# (Requires manual login in browser)

# View recent invoices for an org
# Use Supabase dashboard or SQL:
SELECT id, number, created_at, org_id
FROM invoices
WHERE org_id = '1257f168-9e11-4d33-8862-bb7446507416'
ORDER BY created_at DESC
LIMIT 15;
```

---

## Known Test Organizations

Use these for testing different scenarios:

| Organization ID | Name | Best For Testing |
|----------------|------|------------------|
| `1257f168-9e11-4d33-8862-bb7446507416` | CommComms | Invoice limit (10/10) |
| `c03994cb-1df6-4496-aea8-69d0f291264a` | PopSocket | Under limit (4/10) |
| `3a21e1c2-8899-4b59-a1ff-16e53dc92f10` | Test Business | Empty org (0/0) |

---

## Troubleshooting

### Issue: Error not showing in UI
- Check browser console for JavaScript errors
- Verify error state type is `ReactNode` in form component
- Check network tab for API response

### Issue: Limit not being enforced
- Verify `subscription_plan` column exists (`SELECT * FROM organizations LIMIT 1`)
- Check API route imports `checkInvoiceLimit` function
- Run diagnostics: `npx tsc --noEmit` to check for TypeScript errors

### Issue: Wrong limit being applied
- Check `lib/subscription-config.ts` for plan definitions
- Verify organization's `subscription_plan` value
- Run test script to see current counts

---

## Success Criteria

✅ **All tests pass when:**
1. CommComms cannot create 11th invoice (shows upgrade prompt)
2. Other orgs can create invoices up to 10/month
3. Any org cannot create 6th client (shows upgrade prompt)
4. Pro plan orgs have unlimited access (when tested)
5. Error messages are clear and actionable
6. "Upgrade Plan" button navigates to subscription page
7. No invoices/clients are created when limits are reached

---

*Testing Guide Created: 2025-10-17*
*Ready for manual browser testing*
