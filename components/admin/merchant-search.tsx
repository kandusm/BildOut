'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { useState, useEffect, useTransition } from 'react'
import { Search } from 'lucide-react'

export function MerchantSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '')
  }, [searchParams])

  const handleSearch = (value: string) => {
    setSearchTerm(value)

    const params = new URLSearchParams(searchParams.toString())

    if (value.trim()) {
      params.set('search', value.trim())
    } else {
      params.delete('search')
    }

    startTransition(() => {
      router.push(`/admin/merchants?${params.toString()}`)
    })
  }

  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <Input
        type="text"
        placeholder="Search by name or Stripe Connect ID..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10"
        disabled={isPending}
      />
    </div>
  )
}
