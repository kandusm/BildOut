'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface StripeConnectButtonProps {
  buttonText?: string
  variant?: 'default' | 'outline'
}

export function StripeConnectButton({
  buttonText = 'Connect with Stripe',
  variant = 'default'
}: StripeConnectButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleConnect = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/stripe/connect/onboard', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create onboarding link')
      }

      // Redirect to Stripe onboarding
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error: any) {
      console.error('Error connecting to Stripe:', error)
      alert(error.message || 'Failed to connect to Stripe')
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleConnect}
      size="lg"
      variant={variant}
      className="w-full sm:w-auto"
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        buttonText
      )}
    </Button>
  )
}
