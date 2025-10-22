import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin/require-admin'
import { createClient } from '@/lib/supabase/server'
import { resend, FROM_EMAIL } from '@/lib/email/client'
import { getOnboardingReminderEmail } from '@/lib/email/templates/onboarding-reminder'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { profile: adminProfile } = await requireAdmin()
    const { id: merchantId } = await params

    const supabase = await createClient()

    // Fetch merchant details
    const { data: merchant, error: merchantError } = await supabase
      .from('users')
      .select('id, display_name, stripe_connect_id, onboarding_status')
      .eq('id', merchantId)
      .single()

    if (merchantError || !merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      )
    }

    // Check if merchant needs onboarding
    if (merchant.onboarding_status === 'complete') {
      return NextResponse.json(
        { error: 'Merchant has already completed onboarding' },
        { status: 400 }
      )
    }

    // Get merchant email from auth.users
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(merchant.id)

    if (authError || !authUser.user?.email) {
      return NextResponse.json(
        { error: 'Merchant email not found' },
        { status: 400 }
      )
    }

    const merchantEmail = authUser.user.email

    // Generate Stripe account link for onboarding
    let accountLink = 'https://dashboard.stripe.com/connect/accounts'

    if (merchant.stripe_connect_id) {
      try {
        const { stripe } = await import('@/lib/stripe/server')
        const link = await stripe.accountLinks.create({
          account: merchant.stripe_connect_id,
          refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
          type: 'account_onboarding',
        })
        accountLink = link.url
      } catch (stripeError) {
        console.error('Error creating account link:', stripeError)
        // Continue with default link if Stripe fails
      }
    }

    // Generate email content
    const emailContent = getOnboardingReminderEmail({
      merchantName: merchant.display_name || 'there',
      accountLink,
    })

    // Send email via Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: merchantEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    })

    if (emailError) {
      console.error('Error sending email:', emailError)
      return NextResponse.json(
        { error: 'Failed to send email', details: emailError },
        { status: 500 }
      )
    }

    // Log to audit trail
    await supabase
      .from('admin_audit_log')
      .insert({
        admin_user_id: adminProfile.id,
        action: 'onboarding_reminder_sent',
        target_type: 'merchant',
        target_id: merchant.id,
        metadata: {
          merchant_name: merchant.display_name,
          merchant_email: merchantEmail,
          email_id: emailData?.id,
        },
      })

    return NextResponse.json({
      success: true,
      message: 'Onboarding reminder sent successfully',
      emailId: emailData?.id,
    })

  } catch (error) {
    console.error('Error sending onboarding reminder:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
