'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function ExportMerchantsButton() {
  const [isExporting, setIsExporting] = useState(false)

  const exportToCSV = async () => {
    try {
      setIsExporting(true)

      const supabase = createClient()

      // Fetch all merchants
      const { data: merchants, error } = await supabase
        .from('users')
        .select(`
          id,
          display_name,
          stripe_connect_id,
          onboarding_status,
          payouts_enabled,
          stripe_balance,
          created_at,
          organizations (
            name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching merchants:', error)
        alert('Failed to export merchants. Please try again.')
        return
      }

      if (!merchants || merchants.length === 0) {
        alert('No merchants to export.')
        return
      }

      // Generate CSV
      const headers = [
        'Merchant Name',
        'Organization',
        'Stripe Connect ID',
        'Onboarding Status',
        'Payouts Enabled',
        'Balance (USD)',
        'Joined Date'
      ]

      const rows = merchants.map((merchant: any) => [
        merchant.display_name || 'N/A',
        merchant.organizations?.name || 'N/A',
        merchant.stripe_connect_id || 'N/A',
        merchant.onboarding_status || 'N/A',
        merchant.payouts_enabled ? 'Yes' : 'No',
        merchant.stripe_balance ? parseFloat(merchant.stripe_balance).toFixed(2) : '0.00',
        new Date(merchant.created_at).toLocaleDateString()
      ])

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n')

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute('download', `merchants-export-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)

    } catch (error) {
      console.error('Error exporting merchants:', error)
      alert('Failed to export merchants. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      onClick={exportToCSV}
      disabled={isExporting}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      {isExporting ? 'Exporting...' : 'Export CSV'}
    </Button>
  )
}
