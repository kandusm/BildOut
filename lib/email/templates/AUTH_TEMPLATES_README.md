# BildOut Authentication Email Templates

Branded email templates for Supabase authentication flows.

## Templates Included

1. **Magic Link** (`auth-magic-link.html`) - For passwordless sign-in
2. **Confirm Signup** (`auth-confirm-signup.html`) - Welcome email for new users
3. **Reset Password** (`auth-reset-password.html`) - Password reset requests
4. **Change Email** (`auth-change-email.html`) - Email address changes
5. **Invite User** (`auth-invite-user.html`) - Team member invitations
6. **Reauthentication** (`auth-reauthentication.html`) - Identity verification for sensitive actions

## How to Install in Supabase

### Step 1: Access Email Templates

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Email Templates** in the left sidebar

### Step 2: Configure Each Template

For each template type, you'll need to update:

#### **Magic Link Template**

- **Subject:** `Sign in to BildOut`
- **Template:** Copy content from `auth-magic-link.html`

#### **Confirm Signup Template**

- **Subject:** `Welcome to BildOut - Confirm Your Email`
- **Template:** Copy content from `auth-confirm-signup.html`

#### **Reset Password Template**

- **Subject:** `Reset Your BildOut Password`
- **Template:** Copy content from `auth-reset-password.html`

#### **Change Email Address Template**

- **Subject:** `Confirm Your New Email Address`
- **Template:** Copy content from `auth-change-email.html`

#### **Invite User Template**

- **Subject:** `You've Been Invited to BildOut`
- **Template:** Copy content from `auth-invite-user.html`

#### **Reauthentication Template**

- **Subject:** `Confirm It's You - BildOut`
- **Template:** Copy content from `auth-reauthentication.html`

### Step 3: Save Each Template

After pasting the HTML, click **Save** for each template.

## Supabase Template Variables

These templates use Supabase's built-in variables:

- `{{ .ConfirmationURL }}` - The action link (sign in, confirm email, reset password, etc.)
- `{{ .Token }}` - The confirmation token (if needed)
- `{{ .TokenHash }}` - The hashed token (if needed)
- `{{ .SiteURL }}` - Your site URL

## Customization

### Update Brand Colors

Current brand colors used:
- **Primary Orange:** `#EF4C23`
- **Dark Slate:** `#1e293b`
- **Medium Slate:** `#475569`
- **Light Slate:** `#64748b`
- **Background:** `#f8fafc`

To change, find and replace these hex codes in the templates.

### Add Logo Image

To use an actual logo image instead of text:

Replace this in each template:
```html
<h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">BildOut</h1>
```

With:
```html
<img src="https://yourdomain.com/logo-white.png" alt="BildOut" style="height: 40px;">
```

### Custom Domain Email (Optional)

To send from `noreply@bildout.com` instead of Supabase:

1. Set up SMTP with a provider (Resend, SendGrid, AWS SES)
2. In Supabase Dashboard → **Project Settings** → **Authentication**
3. Scroll to **SMTP Settings**
4. Enter your SMTP credentials

## Testing

After installing:

1. Try signing up with a new email
2. Check your inbox for the branded email
3. Verify the link works and styling looks correct
4. Test on mobile devices for responsiveness

## Brand Guidelines

These templates follow BildOut's brand:
- ✅ Orange primary color (#EF4C23)
- ✅ Professional, clean design
- ✅ Mobile-responsive
- ✅ Clear call-to-action buttons
- ✅ Security messaging where appropriate
- ✅ Consistent footer with tagline

## Support

If you encounter issues:
- Check Supabase template syntax is valid
- Verify all `{{ }}` variables are preserved
- Test email rendering in multiple clients
- Review Supabase Auth logs for errors
