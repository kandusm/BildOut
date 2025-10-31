'use client'

import { useState, useEffect } from 'react'
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
import { AlertCircle, Trash2, RefreshCw, CheckCircle, XCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

interface StripeAccount {
  id: string
  email: string | null
  type: string
  created: string
  charges_enabled: boolean
  payouts_enabled: boolean
  details_submitted: boolean
}

export default function StripeAccountsPage() {
  const [accounts, setAccounts] = useState<StripeAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchAccounts = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/stripe/delete-account')
      if (!response.ok) {
        throw new Error('Failed to fetch accounts')
      }
      const data = await response.json()
      setAccounts(data.accounts)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  const handleDelete = async (accountId: string, email: string | null) => {
    if (!confirm(`Are you sure you want to delete Stripe account:\n\nID: ${accountId}\nEmail: ${email || 'No email'}\n\nThis action cannot be undone!`)) {
      return
    }

    setDeletingId(accountId)
    try {
      const response = await fetch('/api/admin/stripe/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete account')
      }

      // Refresh the list
      await fetchAccounts()
      alert(`Successfully deleted account ${accountId}`)
    } catch (err: any) {
      alert(`Error deleting account: ${err.message}`)
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-sm text-slate-600 hover:text-slate-900">
                ← Back to Admin
              </Link>
              <h1 className="text-xl font-semibold text-slate-900">Stripe Connect Accounts</h1>
            </div>
            <Button onClick={fetchAccounts} disabled={loading} variant="outline" size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Stripe Connect Accounts ({accounts.length})</CardTitle>
            <CardDescription>
              Manage Stripe Connect accounts. Deleting an account is permanent and cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-slate-500">Loading accounts...</div>
            ) : accounts.length === 0 ? (
              <div className="text-center py-8 text-slate-500">No Stripe Connect accounts found</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account ID</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Charges</TableHead>
                      <TableHead>Payouts</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-mono text-xs">{account.id}</TableCell>
                        <TableCell>{account.email || <span className="text-slate-400">No email</span>}</TableCell>
                        <TableCell className="capitalize">{account.type}</TableCell>
                        <TableCell className="text-sm">{formatDate(account.created)}</TableCell>
                        <TableCell>
                          {account.charges_enabled ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </TableCell>
                        <TableCell>
                          {account.payouts_enabled ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </TableCell>
                        <TableCell>
                          {account.details_submitted ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-slate-400" />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(account.id, account.email)}
                            disabled={deletingId === account.id}
                          >
                            {deletingId === account.id ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Alert className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Warning:</strong> Deleting a Stripe Connect account is permanent. The merchant will need to reconnect their account to accept payments.
            Only delete duplicate or test accounts.
          </AlertDescription>
        </Alert>
      </main>
    </div>
  )
}
