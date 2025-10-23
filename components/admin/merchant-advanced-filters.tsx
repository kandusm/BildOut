'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useTransition } from 'react'
import { X } from 'lucide-react'

export function MerchantAdvancedFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [minBalance, setMinBalance] = useState(searchParams.get('min_balance') || '')
  const [maxBalance, setMaxBalance] = useState(searchParams.get('max_balance') || '')
  const [startDate, setStartDate] = useState(searchParams.get('start_date') || '')
  const [endDate, setEndDate] = useState(searchParams.get('end_date') || '')

  const hasFilters = minBalance || maxBalance || startDate || endDate

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    // Preserve existing search and status filters
    // Add new filters
    if (minBalance) {
      params.set('min_balance', minBalance)
    } else {
      params.delete('min_balance')
    }

    if (maxBalance) {
      params.set('max_balance', maxBalance)
    } else {
      params.delete('max_balance')
    }

    if (startDate) {
      params.set('start_date', startDate)
    } else {
      params.delete('start_date')
    }

    if (endDate) {
      params.set('end_date', endDate)
    } else {
      params.delete('end_date')
    }

    startTransition(() => {
      router.push(`/admin/merchants?${params.toString()}`)
    })
  }

  const clearFilters = () => {
    setMinBalance('')
    setMaxBalance('')
    setStartDate('')
    setEndDate('')

    const params = new URLSearchParams(searchParams.toString())
    params.delete('min_balance')
    params.delete('max_balance')
    params.delete('start_date')
    params.delete('end_date')

    startTransition(() => {
      router.push(`/admin/merchants?${params.toString()}`)
    })
  }

  return (
    <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-900">Advanced Filters</h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            disabled={isPending}
            className="h-8 gap-2"
          >
            <X className="h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Balance Range */}
        <div className="space-y-2">
          <Label className="text-xs text-slate-600">Balance Range (USD)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={minBalance}
              onChange={(e) => setMinBalance(e.target.value)}
              className="h-9"
              disabled={isPending}
            />
            <Input
              type="number"
              placeholder="Max"
              value={maxBalance}
              onChange={(e) => setMaxBalance(e.target.value)}
              className="h-9"
              disabled={isPending}
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label className="text-xs text-slate-600">Join Date Range</Label>
          <div className="flex gap-2">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-9"
              disabled={isPending}
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-9"
              disabled={isPending}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={applyFilters}
          size="sm"
          disabled={isPending}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  )
}
