'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSearchParams } from 'next/navigation'

interface StripeConnectStatus {
  connected: boolean
  charges_enabled: boolean
  details_submitted: boolean
  payouts_enabled?: boolean
}

export function StripeConnectCard() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<StripeConnectStatus | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const searchParams = useSearchParams()

  // Check for onboarding completion
  useEffect(() => {
    const onboardingComplete = searchParams.get('stripe_onboarding')
    const refreshNeeded = searchParams.get('stripe_refresh')

    if (onboardingComplete === 'complete') {
      setMessage({
        type: 'success',
        text: 'Stripe account connected successfully! You can now accept payments.'
      })
      // Remove query params
      window.history.replaceState({}, '', '/dashboard')
    } else if (refreshNeeded === 'true') {
      setMessage({
        type: 'error',
        text: 'Onboarding incomplete. Please try again to finish setup.'
      })
      window.history.replaceState({}, '', '/dashboard')
    }

    // Fetch current status
    fetchStatus()
  }, [searchParams])

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/stripe/connect/status')
      if (response.ok) {
        const data = await response.json()
        setStatus(data)
      }
    } catch (error) {
      console.error('Failed to fetch Stripe status:', error)
    }
  }

  const handleConnect = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/stripe/connect/onboard', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to create onboarding link')
      }

      const { url } = await response.json()

      // Redirect to Stripe onboarding
      window.location.href = url
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to start Stripe onboarding'
      })
      setLoading(false)
    }
  }

  // If already connected and charges enabled
  if (status?.connected && status?.charges_enabled) {
    return (
      <Card className="mt-12 bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-900">✓ Stripe Connected</CardTitle>
          <CardDescription className="text-green-700">
            Your account is connected and ready to accept payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-green-800">
            <p>✓ Charges enabled: {status.charges_enabled ? 'Yes' : 'No'}</p>
            <p>✓ Payouts enabled: {status.payouts_enabled ? 'Yes' : 'No'}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // If connected but setup incomplete
  if (status?.connected && !status?.charges_enabled) {
    return (
      <Card className="mt-12 bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-900">Complete Stripe Setup</CardTitle>
          <CardDescription className="text-yellow-700">
            Your Stripe account needs additional information to accept payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleConnect}
            disabled={loading}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            {loading ? 'Loading...' : 'Complete Setup'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Not connected
  return (
    <Card className="mt-12 bg-amber-50 border-amber-200">
      <CardHeader>
        <CardTitle className="text-amber-900">Set up Stripe Connect</CardTitle>
        <CardDescription className="text-amber-700">
          Connect your Stripe account to start accepting payments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <div
            className={`rounded-md p-3 text-sm ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}
        <Button
          onClick={handleConnect}
          disabled={loading}
          className="bg-amber-600 hover:bg-amber-700"
        >
          {loading ? 'Loading...' : 'Connect Stripe'}
        </Button>
      </CardContent>
    </Card>
  )
}
