'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

interface MerchantSyncButtonProps {
  merchantId: string
  merchantName: string
}

export function MerchantSyncButton({ merchantId, merchantName }: MerchantSyncButtonProps) {
  const router = useRouter()
  const [isSyncing, setIsSyncing] = useState(false)

  const handleSync = async () => {
    if (!confirm(`Sync ${merchantName} with Stripe? This will fetch the latest account status from Stripe.`)) {
      return
    }

    setIsSyncing(true)
    try {
      const response = await fetch(`/api/admin/merchants/${merchantId}/sync`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync merchant')
      }

      alert(`Successfully synced ${merchantName}!\n\nStatus: ${data.status.onboarding_status}\nCharges: ${data.status.charges_enabled ? 'Enabled' : 'Disabled'}\nPayouts: ${data.status.payouts_enabled ? 'Enabled' : 'Disabled'}\nBalance: $${data.status.balance.toFixed(2)}`)
      router.refresh()
    } catch (error: any) {
      console.error('Sync error:', error)
      alert(`Failed to sync merchant: ${error.message}`)
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <Button
      onClick={handleSync}
      disabled={isSyncing}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
      {isSyncing ? 'Syncing...' : 'Sync with Stripe'}
    </Button>
  )
}
