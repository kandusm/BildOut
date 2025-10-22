import { NextResponse } from 'next/server'
import { resend } from '@/lib/email/client'
import { OverdueReminderEmail } from '@/emails/overdue-reminder'

/**
 * Test endpoint to verify email sending works
 * DELETE THIS FILE BEFORE PRODUCTION
 */
export async function GET() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // Use Resend's test domain for development
      to: ['delivered@resend.dev'], // Resend test email that always works
      subject: 'BildOut Email Test - Overdue Invoice Reminder',
      react: OverdueReminderEmail({
        invoiceNumber: 'TEST-00001',
        clientName: 'Test Client',
        merchantName: 'BildOut Test',
        amountDue: 1500.00,
        dueDate: new Date().toISOString().split('T')[0],
        paymentLink: 'http://localhost:3001/pay/test-token',
      }),
    })

    if (error) {
      console.error('Email send error:', error)
      return NextResponse.json(
        { error: 'Failed to send email', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully!',
      emailId: data?.id,
      info: 'Check the Resend dashboard to see the email'
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Unexpected error occurred', details: error },
      { status: 500 }
    )
  }
}
