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

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{
    action?: string
    admin?: string
    page?: string
  }>
}) {
  await requireAdmin()

  const supabase = await createClient()
  const params = await searchParams

  // Pagination
  const page = parseInt(params.page || '1')
  const limit = 50
  const offset = (page - 1) * limit

  // Build query
  let query = supabase
    .from('admin_audit_log')
    .select(`
      id,
      admin_user_id,
      action,
      target_type,
      target_id,
      metadata,
      created_at,
      admin:users!admin_user_id (
        id,
        display_name
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  // Apply filters
  if (params.action) {
    query = query.eq('action', params.action)
  }

  if (params.admin) {
    query = query.eq('admin_user_id', params.admin)
  }

  const { data: logs, error, count } = await query

  if (error) {
    console.error('Error fetching audit logs:', error)
  }

  // Get unique actions for filter dropdown
  const { data: uniqueActions } = await supabase
    .from('admin_audit_log')
    .select('action')
    .order('action')

  const actions = Array.from(new Set(uniqueActions?.map((a) => a.action) || []))

  // Get unique admins for filter dropdown
  const { data: uniqueAdmins } = await supabase
    .from('admin_audit_log')
    .select('admin_user_id, admin:users!admin_user_id(display_name)')

  const admins = Array.from(
    new Map(
      uniqueAdmins?.map((a: any) => [
        a.admin_user_id,
        { id: a.admin_user_id, name: a.admin?.display_name },
      ])
    ).values()
  )

  // Calculate pagination
  const totalPages = count ? Math.ceil(count / limit) : 1
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  // Get action badge
  const getActionBadge = (action: string) => {
    if (action.includes('suspend')) {
      return <Badge variant="destructive">{action}</Badge>
    }
    if (action.includes('resume')) {
      return <Badge variant="default" className="bg-green-600">{action}</Badge>
    }
    if (action.includes('login_link')) {
      return <Badge variant="outline">{action}</Badge>
    }
    return <Badge variant="secondary">{action}</Badge>
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
          <h1 className="text-3xl font-bold text-slate-900">Audit Logs</h1>
          <p className="text-slate-600 mt-2">
            View all admin actions and system events
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter logs by action or admin user</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            {/* Action filters */}
            <div className="flex gap-2">
              <Button
                asChild
                variant={!params.action ? 'default' : 'outline'}
                size="sm"
              >
                <Link href="/admin/logs">All Actions</Link>
              </Button>
              {actions.slice(0, 5).map((action) => (
                <Button
                  key={action}
                  asChild
                  variant={params.action === action ? 'default' : 'outline'}
                  size="sm"
                >
                  <Link href={`/admin/logs?action=${action}`}>
                    {action.replace(/_/g, ' ')}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Audit Trail ({count?.toLocaleString() || 0} total logs)
            </CardTitle>
            <div className="text-sm text-slate-600">
              Page {page} of {totalPages}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Admin User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs?.map((log: any) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm text-slate-600">
                    {new Date(log.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium">
                    {log.admin?.display_name || 'Unknown Admin'}
                  </TableCell>
                  <TableCell>
                    {getActionBadge(log.action)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{log.target_type}</div>
                      {log.target_id && (
                        <code className="text-xs text-slate-500">
                          {log.target_id.substring(0, 8)}...
                        </code>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {log.metadata && Object.keys(log.metadata).length > 0 ? (
                      <div className="text-xs text-slate-600">
                        {log.metadata.merchant_name && (
                          <div>Merchant: {log.metadata.merchant_name}</div>
                        )}
                        {log.metadata.reason && (
                          <div>Reason: {log.metadata.reason}</div>
                        )}
                        {log.metadata.expires_at && (
                          <div>Expires: {new Date(log.metadata.expires_at * 1000).toLocaleString()}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {!logs || logs.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p>No audit logs found</p>
            </div>
          ) : null}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <div className="text-sm text-slate-600">
                Showing {offset + 1} to {Math.min(offset + limit, count || 0)} of {count?.toLocaleString() || 0} logs
              </div>
              <div className="flex gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  disabled={!hasPrevPage}
                >
                  {hasPrevPage ? (
                    <Link href={`/admin/logs?page=${page - 1}${params.action ? `&action=${params.action}` : ''}${params.admin ? `&admin=${params.admin}` : ''}`}>
                      Previous
                    </Link>
                  ) : (
                    <span>Previous</span>
                  )}
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  disabled={!hasNextPage}
                >
                  {hasNextPage ? (
                    <Link href={`/admin/logs?page=${page + 1}${params.action ? `&action=${params.action}` : ''}${params.admin ? `&admin=${params.admin}` : ''}`}>
                      Next
                    </Link>
                  ) : (
                    <span>Next</span>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
