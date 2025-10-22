export interface OnboardingReminderEmailProps {
  merchantName: string
  accountLink: string
}

export function getOnboardingReminderEmail({
  merchantName,
  accountLink,
}: OnboardingReminderEmailProps) {
  const subject = 'Complete your BildOut account setup'

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f4f4f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #0f172a; font-size: 28px; font-weight: 700; margin: 0;">BildOut</h1>
      <p style="color: #64748b; font-size: 14px; margin: 8px 0 0 0;">Invoice Management Made Simple</p>
    </div>

    <!-- Main Content -->
    <div style="background: #ffffff; border-radius: 8px; padding: 32px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #0f172a; font-size: 24px; font-weight: 600; margin: 0 0 16px 0;">
        Hi ${merchantName},
      </h2>

      <p style="color: #334155; font-size: 16px; margin: 0 0 16px 0;">
        We noticed you haven't finished setting up your BildOut merchant account yet. Complete your account setup to start accepting payments and managing invoices.
      </p>

      <div style="background: #f1f5f9; border-left: 4px solid #3b82f6; padding: 16px; margin: 24px 0; border-radius: 4px;">
        <p style="color: #1e293b; font-size: 14px; margin: 0; font-weight: 500;">
          ⚡ Once you complete setup, you'll be able to:
        </p>
        <ul style="color: #475569; font-size: 14px; margin: 12px 0 0 0; padding-left: 20px;">
          <li style="margin-bottom: 8px;">Accept credit card and ACH payments</li>
          <li style="margin-bottom: 8px;">Create and send professional invoices</li>
          <li style="margin-bottom: 8px;">Track payments in real-time</li>
          <li>Get paid faster with automated reminders</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${accountLink}" style="display: inline-block; background: #3b82f6; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);">
          Complete Account Setup
        </a>
      </div>

      <p style="color: #64748b; font-size: 14px; margin: 24px 0 0 0; text-align: center;">
        This should only take 2-3 minutes.
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 40px; padding: 0 20px;">
      <p style="color: #94a3b8; font-size: 13px; margin: 0 0 8px 0;">
        Need help? Reply to this email and we'll get back to you right away.
      </p>
      <p style="color: #cbd5e1; font-size: 12px; margin: 0;">
        BildOut - Invoice Management Platform<br>
        <a href="https://bildout.com" style="color: #3b82f6; text-decoration: none;">bildout.com</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()

  const text = `
Hi ${merchantName},

We noticed you haven't finished setting up your BildOut merchant account yet. Complete your account setup to start accepting payments and managing invoices.

Once you complete setup, you'll be able to:
- Accept credit card and ACH payments
- Create and send professional invoices
- Track payments in real-time
- Get paid faster with automated reminders

Complete your account setup: ${accountLink}

This should only take 2-3 minutes.

Need help? Reply to this email and we'll get back to you right away.

---
BildOut - Invoice Management Platform
https://bildout.com
  `.trim()

  return { subject, html, text }
}
