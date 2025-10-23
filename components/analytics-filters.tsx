'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar, Filter } from 'lucide-react'

interface AnalyticsFiltersProps {
  fromDate: string
  toDate: string
  currentStatus?: string
}

export function AnalyticsFilters({ fromDate, toDate, currentStatus }: AnalyticsFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const from = formData.get('from') as string
    const to = formData.get('to') as string
    const status = formData.get('status') as string

    const params = new URLSearchParams()
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    if (status && status !== 'all') params.set('status', status)

    router.push(`/dashboard/analytics?${params.toString()}`)
  }

  const handleReset = () => {
    router.push('/dashboard/analytics')
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="from" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                From Date
              </Label>
              <Input
                id="from"
                name="from"
                type="date"
                defaultValue={fromDate}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="to" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                To Date
              </Label>
              <Input
                id="to"
                name="to"
                type="date"
                defaultValue={toDate}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Invoice Status
              </Label>
              <select
                id="status"
                name="status"
                defaultValue={currentStatus || 'all'}
                className="w-full h-10 px-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="viewed">Viewed</option>
                <option value="paid">Paid</option>
                <option value="void">Void</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <Button type="submit" className="flex-1">
                Apply Filters
              </Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
