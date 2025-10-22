# API Security Audit

## Authentication Checks

### ✅ Properly Protected Routes

#### `/api/invoices` (POST)
- ✅ Checks `auth.getUser()`
- ✅ Verifies user belongs to org (`profile.org_id === org_id`)
- Status: **SECURE**

### Routes to Audit

1. `/api/invoices/[id]` (GET, PUT, DELETE)
2. `/api/clients` (GET, POST)
3. `/api/clients/[id]` (GET, PUT, DELETE)
4. `/api/items` (GET, POST)
5. `/api/items/[id]` (GET, PUT, DELETE)
6. `/api/payments/intent` (POST)
7. `/api/stripe/connect/status` (GET)
8. `/api/stripe/connect/onboard` (POST)
9. `/api/settings/general` (GET, PUT)
10. `/api/organizations/branding` (GET, PUT)

### Public Routes (Should NOT check auth)
- `/api/webhooks/stripe` - Protected by signature
- `/api/cron/overdue` - Protected by secret
- `/pay/[token]` pages - Public by design

## Security Checklist

- [ ] All protected routes check `auth.getUser()`
- [ ] All routes verify org ownership
- [ ] No SQL injection vulnerabilities
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info
- [ ] Rate limiting considered
- [ ] CORS configured correctly
