import { requireAdmin } from '@/lib/admin/require-admin'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { MerchantSearch } from '@/components/admin/merchant-search'
import { ExportMerchantsButton } from '@/components/admin/export-merchants-button'
import { MerchantAdvancedFilters } from '@/components/admin/merchant-advanced-filters'

export default async function MerchantsListPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string
    search?: string
    min_balance?: string
    max_balance?: string
    start_date?: string
    end_date?: string
  }>
}) {
  await requireAdmin()

  const supabase = await createClient()
  const params = await searchParams

  // Build query
  let query = supabase
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
        id,
        name
      )
    `)
    .order('created_at', { ascending: false })

  // Apply filters
  if (params.status) {
    query = query.eq('onboarding_status', params.status)
  }

  // Apply search across multiple fields
  if (params.search) {
    const searchTerm = params.search.trim()
    // Search across display_name and stripe_connect_id
    query = query.or(
      `display_name.ilike.%${searchTerm}%,stripe_connect_id.ilike.%${searchTerm}%`
    )
  }

  // Apply balance range filters
  if (params.min_balance) {
    const minBalance = parseFloat(params.min_balance)
    if (!isNaN(minBalance)) {
      query = query.gte('stripe_balance', minBalance)
    }
  }

  if (params.max_balance) {
    const maxBalance = parseFloat(params.max_balance)
    if (!isNaN(maxBalance)) {
      query = query.lte('stripe_balance', maxBalance)
    }
  }

  // Apply date range filters
  if (params.start_date) {
    query = query.gte('created_at', params.start_date)
  }

  if (params.end_date) {
    // Add one day to include the end date
    const endDate = new Date(params.end_date)
    endDate.setDate(endDate.getDate() + 1)
    query = query.lt('created_at', endDate.toISOString())
  }

  const { data: merchants, error } = await query

  if (error) {
    console.error('Error fetching merchants:', error)
  }

  // Get status badge
  const getStatusBadge = (merchant: any) => {
    if (!merchant.stripe_connect_id) {
      return <Badge variant="secondary">Not Started</Badge>
    }

    switch (merchant.onboarding_status) {
      case 'complete':
        return <Badge variant="default" className="bg-green-600">Complete</Badge>
      case 'verified':
        return <Badge variant="default" className="bg-blue-600">Verified</Badge>
      case 'incomplete':
        return <Badge variant="secondary">Incomplete</Badge>
      case 'pending':
        return <Badge variant="outline">Pending</Badge>
      default:
        return <Badge variant="outline">{merchant.onboarding_status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/admin"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              ← Back to Admin Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Merchants</h1>
          <p className="text-slate-600 mt-2">
            Manage all merchant accounts and Stripe Connect status
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Search by name or Stripe Connect ID • Filter by onboarding status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Bar */}
            <MerchantSearch />

            {/* Status Filters */}
            <div className="flex gap-2">
              <Button
                asChild
                variant={!params.status ? 'default' : 'outline'}
                size="sm"
              >
                <Link href="/admin/merchants">All</Link>
              </Button>
              <Button
                asChild
                variant={params.status === 'pending' ? 'default' : 'outline'}
                size="sm"
              >
                <Link href="/admin/merchants?status=pending">Pending</Link>
              </Button>
              <Button
                asChild
                variant={params.status === 'incomplete' ? 'default' : 'outline'}
                size="sm"
              >
                <Link href="/admin/merchants?status=incomplete">Incomplete</Link>
              </Button>
              <Button
                asChild
                variant={params.status === 'complete' ? 'default' : 'outline'}
                size="sm"
              >
                <Link href="/admin/merchants?status=complete">Complete</Link>
              </Button>
            </div>

            {/* Advanced Filters */}
            <MerchantAdvancedFilters />
          </div>
        </CardContent>
      </Card>

      {/* Merchants Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Merchants ({merchants?.length || 0})</CardTitle>
            <ExportMerchantsButton />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Merchant</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Stripe Connect ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payouts</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {merchants?.map((merchant: any) => (
                <TableRow key={merchant.id}>
                  <TableCell className="font-medium">
                    {merchant.display_name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {merchant.organizations?.name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {merchant.stripe_connect_id ? (
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                        {merchant.stripe_connect_id.substring(0, 20)}...
                      </code>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(merchant)}
                  </TableCell>
                  <TableCell>
                    {merchant.payouts_enabled ? (
                      <Badge variant="default" className="bg-green-600">Enabled</Badge>
                    ) : (
                      <Badge variant="secondary">Disabled</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {merchant.stripe_balance ? (
                      <span className="font-mono text-sm">
                        ${parseFloat(merchant.stripe_balance).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-slate-400">$0.00</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {new Date(merchant.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/merchants/${merchant.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {!merchants || merchants.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <p>No merchants found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
