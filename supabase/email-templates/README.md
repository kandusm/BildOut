# Supabase Email Templates

This directory contains backup copies of all email templates configured in Supabase Dashboard.

## Templates

### confirm-signup.html
**Supabase Location:** Authentication → Email Templates → "Confirm sign up"

Used when a new user signs up. Sends a 6-digit OTP code for email verification.

**Template Variables:**
- `{{ .Token }}` - 6-digit verification code
- `{{ .TokenHash }}` - Hashed token (not used in this template)
- `{{ .SiteURL }}` - Your site URL from Supabase config

## How to Update

1. Edit the template file in this directory
2. Copy the content
3. Go to Supabase Dashboard → Authentication → Email Templates
4. Select the corresponding template
5. Paste the updated content
6. Save changes

## Testing

To test email templates locally:
1. Use Supabase local development: `supabase start`
2. Check Inbucket at http://localhost:54324
3. All emails will be captured there for testing

## Notes

- Email templates in Supabase use Go template syntax
- Always test emails before deploying to production
- Keep these files in sync with Supabase dashboard
