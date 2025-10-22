# Formspree Contact Form Setup

## Quick Setup (5 minutes)

### 1. Create Formspree Account
1. Go to https://formspree.io
2. Sign up with your email
3. Verify your email

### 2. Create Form
1. Click "New Form"
2. Name it: "BildOut Support"
3. Copy your Form ID (looks like `xyzabc123`)

### 3. Update Contact Page
1. Open `app/contact/page.tsx`
2. Find line 70: `action="https://formspree.io/f/YOUR_FORM_ID"`
3. Replace `YOUR_FORM_ID` with your actual Form ID
4. Example: `action="https://formspree.io/f/xyzabc123"`

### 4. Configure Formspree Settings (Optional but Recommended)
1. In Formspree dashboard → Settings:
   - **Email**: Set where notifications go (e.g., support@bildout.com)
   - **Success URL**: Leave default (form handles success state)
   - **Spam Protection**: Enable reCAPTCHA (optional)
   - **Notification Template**: Customize email format

### 5. Test It
1. Go to http://localhost:3000/contact
2. Fill out the form
3. Submit
4. Check your email for the notification

## Formspree Features Included

- ✅ Email notifications to your inbox
- ✅ Spam protection (Akismet built-in)
- ✅ Submission archive in Formspree dashboard
- ✅ Auto-responder (can enable in settings)
- ✅ File uploads (if needed later)

## Free Tier Limits

- 50 submissions/month (upgrade to 1000 for $10/mo)
- Unlimited forms
- All features included

## Upgrading to Custom Backend (Post-Launch)

When ready to migrate to Option 2 (in-app support widget):

1. Keep Formspree as backup
2. Build support ticket system with:
   - `support_tickets` table in database
   - Auto-populated user info
   - Status tracking (open/in-progress/closed)
   - Admin panel for support team

See WORK_PLAN.md → Post-MVP Roadmap for implementation details.

## Current Status

- ✅ Contact page created: `app/contact/page.tsx`
- ⏳ Need to add Form ID
- ⏳ Need to add navigation links

## Next Steps

1. Get Formspree Form ID
2. Update line 70 in contact page
3. Add contact link to dashboard sidebar
4. Add contact link to footer
5. Test submission
