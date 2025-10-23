'use client'

import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SendReminderButtonProps {
  merchantId: string
  merchantName: string
  onboardingStatus: string
}

export function SendReminderButton({
  merchantId,
  merchantName,
  onboardingStatus,
}: SendReminderButtonProps) {
  const [isSending, setIsSending] = useState(false)
  const router = useRouter()

  // Don't show button if onboarding is already complete
  if (onboardingStatus === 'complete') {
    return null
  }

  const handleSendReminder = async () => {
    if (!confirm(`Send onboarding reminder to ${merchantName}?`)) {
      return
    }

    try {
      setIsSending(true)

      const response = await fetch(`/api/admin/merchants/${merchantId}/send-reminder`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reminder')
      }

      alert('Onboarding reminder sent successfully!')
      router.refresh()

    } catch (error: any) {
      console.error('Error sending reminder:', error)
      alert(`Failed to send reminder: ${error.message}`)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Button
      onClick={handleSendReminder}
      disabled={isSending}
      variant="outline"
      className="gap-2"
    >
      <Mail className="h-4 w-4" />
      {isSending ? 'Sending...' : 'Send Reminder'}
    </Button>
  )
}
