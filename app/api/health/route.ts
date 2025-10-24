import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    // Check database connection
    const supabase = await createClient()
    const { error } = await supabase.from('organizations').select('id').limit(1)

    if (error) {
      throw new Error(`Database connection failed: ${error.message}`)
    }

    // Check Stripe configuration
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe not configured')
    }

    // Check Resend configuration
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Email service not configured')
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        stripe: 'configured',
        email: 'configured',
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
