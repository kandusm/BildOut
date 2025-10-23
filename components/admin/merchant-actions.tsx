'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface MerchantActionsProps {
  merchantId: string
  merchantName: string
  stripeConnectId: string | null
  currentStatus: string
}

export function MerchantActions({
  merchantId,
  merchantName,
  stripeConnectId,
  currentStatus,
}: MerchantActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleStripeDashboard = async () => {
    if (!stripeConnectId) {
      toast.error('This merchant has not connected their Stripe account yet')
      return
    }

    setIsLoading('stripe')
    try {
      const response = await fetch(`/api/admin/merchants/${merchantId}/login-link`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate login link')
      }

      // Open Stripe dashboard in new tab
      window.open(data.url, '_blank', 'noopener,noreferrer')
      toast.success('Stripe dashboard opened in new tab')
    } catch (error: any) {
      console.error('Error opening Stripe dashboard:', error)
      toast.error(error.message || 'Failed to open Stripe dashboard')
    } finally {
      setIsLoading(null)
    }
  }

  const handleSuspend = async () => {
    if (!stripeConnectId) {
      toast.error('This merchant has not connected their Stripe account yet')
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to suspend ${merchantName}? They will not be able to receive payments until resumed.`
    )

    if (!confirmed) return

    setIsLoading('suspend')
    try {
      const response = await fetch(`/api/admin/merchants/${merchantId}/suspend`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to suspend merchant')
      }

      toast.success(`${merchantName} has been suspended`)
      router.refresh()
    } catch (error: any) {
      console.error('Error suspending merchant:', error)
      toast.error(error.message || 'Failed to suspend merchant')
    } finally {
      setIsLoading(null)
    }
  }

  const handleResume = async () => {
    if (!stripeConnectId) {
      toast.error('This merchant has not connected their Stripe account yet')
      return
    }

    setIsLoading('resume')
    try {
      const response = await fetch(`/api/admin/merchants/${merchantId}/resume`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resume merchant')
      }

      toast.success(`${merchantName} has been resumed`)
      router.refresh()
    } catch (error: any) {
      console.error('Error resuming merchant:', error)
      toast.error(error.message || 'Failed to resume merchant')
    } finally {
      setIsLoading(null)
    }
  }

  const handleSendReminder = async () => {
    // Don't send reminder if onboarding is complete
    if (currentStatus === 'complete') {
      toast.info('Merchant has already completed onboarding')
      return
    }

    const confirmed = window.confirm(
      `Send onboarding reminder email to ${merchantName}?`
    )

    if (!confirmed) return

    setIsLoading('reminder')
    try {
      const response = await fetch(`/api/admin/merchants/${merchantId}/send-reminder`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reminder')
      }

      toast.success('Onboarding reminder sent successfully!')
      router.refresh()
    } catch (error: any) {
      console.error('Error sending reminder:', error)
      toast.error(error.message || 'Failed to send reminder')
    } finally {
      setIsLoading(null)
    }
  }

  const isSuspended = currentStatus === 'suspended'

  return (
    <div className="flex gap-2">
      {stripeConnectId && (
        <Button
          onClick={handleStripeDashboard}
          variant="outline"
          disabled={isLoading !== null}
        >
          {isLoading === 'stripe' ? 'Opening...' : 'Open Stripe Dashboard'}
        </Button>
      )}

      {stripeConnectId && (
        <>
          {isSuspended ? (
            <Button
              onClick={handleResume}
              variant="default"
              disabled={isLoading !== null}
            >
              {isLoading === 'resume' ? 'Resuming...' : 'Resume Account'}
            </Button>
          ) : (
            <Button
              onClick={handleSuspend}
              variant="destructive"
              disabled={isLoading !== null}
            >
              {isLoading === 'suspend' ? 'Suspending...' : 'Suspend Account'}
            </Button>
          )}
        </>
      )}

      {/* Only show send reminder if onboarding not complete */}
      {currentStatus !== 'complete' && (
        <Button
          onClick={handleSendReminder}
          variant="outline"
          disabled={isLoading !== null}
        >
          {isLoading === 'reminder' ? 'Sending...' : 'Send Reminder'}
        </Button>
      )}
    </div>
  )
}
