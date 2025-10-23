'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { Trash2, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Invoice {
  id: string
  number: string
  status: string
  issue_date: string
  due_date: string | null
  total: number
  clients: {
    name: string
  } | null
}

interface InvoiceTableProps {
  invoices: Invoice[]
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'secondary'
      case 'sent':
        return 'default'
      case 'paid':
        return 'default'
      case 'overdue':
        return 'destructive'
      case 'cancelled':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === invoices.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(invoices.map(inv => inv.id)))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} invoice(s)?`)) return

    setIsDeleting(true)
    try {
      const deletePromises = Array.from(selectedIds).map(id =>
        fetch(`/api/invoices/${id}`, { method: 'DELETE' })
      )
      await Promise.all(deletePromises)
      setSelectedIds(new Set())
      router.refresh()
    } catch (error) {
      console.error('Error deleting invoices:', error)
      alert('Failed to delete some invoices')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleBulkSend = async () => {
    if (selectedIds.size === 0) return

    // Filter out non-draft invoices
    const selectedInvoices = invoices.filter(inv => selectedIds.has(inv.id))
    const draftInvoices = selectedInvoices.filter(inv => inv.status === 'draft')

    if (draftInvoices.length === 0) {
      alert('No draft invoices selected. Only draft invoices can be sent.')
      return
    }

    if (!confirm(`Send ${draftInvoices.length} draft invoice(s)?`)) return

    setIsSending(true)
    try {
      const sendPromises = draftInvoices.map(inv =>
        fetch(`/api/invoices/${inv.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'sent' }),
        })
      )
      await Promise.all(sendPromises)
      setSelectedIds(new Set())
      router.refresh()
    } catch (error) {
      console.error('Error sending invoices:', error)
      alert('Failed to send some invoices')
    } finally {
      setIsSending(false)
    }
  }

  const allSelected = invoices.length > 0 && selectedIds.size === invoices.length
  const someSelected = selectedIds.size > 0 && selectedIds.size < invoices.length

  return (
    <div className="space-y-4">
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-md">
          <span className="text-sm text-slate-700">
            {selectedIds.size} invoice{selectedIds.size !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkSend}
              disabled={isSending}
            >
              <Send className="mr-2 h-4 w-4" />
              {isSending ? 'Sending...' : 'Send'}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected || someSelected}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Invoice #</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(invoice.id)}
                    onCheckedChange={() => toggleSelection(invoice.id)}
                    aria-label={`Select invoice ${invoice.number}`}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {invoice.number}
                </TableCell>
                <TableCell>
                  {invoice.clients?.name || 'No client'}
                </TableCell>
                <TableCell>{formatDate(invoice.issue_date)}</TableCell>
                <TableCell>
                  {invoice.due_date ? formatDate(invoice.due_date) : '-'}
                </TableCell>
                <TableCell>{formatCurrency(invoice.total)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(invoice.status) as any}>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/dashboard/invoices/${invoice.id}`}>
                      View
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
