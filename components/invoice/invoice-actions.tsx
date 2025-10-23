'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Link from 'next/link'

interface InvoiceActionsProps {
  invoiceId: string
  invoiceNumber: string
  status: string
  paymentLinkToken?: string
  hasPaymentProcessing?: boolean
}

export function InvoiceActions({ invoiceId, invoiceNumber, status, paymentLinkToken, hasPaymentProcessing = true }: InvoiceActionsProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showSendDialog, setShowSendDialog] = useState(false)
  const [showMarkPaidDialog, setShowMarkPaidDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isMarkingPaid, setIsMarkingPaid] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete invoice')
      }

      router.push('/dashboard/invoices')
      router.refresh()
    } catch (error) {
      console.error('Error deleting invoice:', error)
      alert('Failed to delete invoice. Please try again.')
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`)

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      // Get the PDF blob
      const blob = await response.blob()

      // Create a download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${invoiceNumber}.pdf`
      document.body.appendChild(a)
      a.click()

      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Failed to download PDF. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDuplicate = async () => {
    if (!confirm(`Duplicate Invoice #${invoiceNumber}? A new draft invoice will be created.`)) {
      return
    }

    setIsDuplicating(true)
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/duplicate`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to duplicate invoice')
      }

      const data = await response.json()

      // Redirect to the new invoice
      router.push(`/dashboard/invoices/${data.invoice.id}`)
      router.refresh()
    } catch (error) {
      console.error('Error duplicating invoice:', error)
      alert('Failed to duplicate invoice. Please try again.')
    } finally {
      setIsDuplicating(false)
    }
  }

  const handleSendInvoice = async (sendEmail: boolean) => {
    setIsSending(true)
    setShowSendDialog(false)
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sendEmail }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invoice')
      }

      if (sendEmail) {
        alert(`Invoice sent successfully to ${data.sentTo}`)
      } else {
        alert('Invoice marked as sent')
      }
      router.refresh()
    } catch (error: any) {
      console.error('Error sending invoice:', error)
      alert(error.message || 'Failed to send invoice. Please ensure the invoice has a client with an email address.')
    } finally {
      setIsSending(false)
    }
  }

  const handleMarkPaid = async () => {
    setIsMarkingPaid(true)
    setShowMarkPaidDialog(false)
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/mark-paid`, {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to mark invoice as paid')
      }

      alert('Invoice marked as paid')
      router.refresh()
    } catch (error: any) {
      console.error('Error marking invoice as paid:', error)
      alert(error.message || 'Failed to mark invoice as paid. Please try again.')
    } finally {
      setIsMarkingPaid(false)
    }
  }

  return (
    <>
      <div className="flex gap-4 flex-wrap">
        {status === 'draft' && (
          <>
            <Button asChild variant="default" className="flex-1">
              <Link href={`/dashboard/invoices/${invoiceId}/edit`}>
                Edit Invoice
              </Link>
            </Button>
            <Button
              className="flex-1"
              onClick={() => setShowSendDialog(true)}
              disabled={isSending}
            >
              {isSending ? 'Sending...' : 'Send Invoice'}
            </Button>
          </>
        )}

        {/* Show payment page link only if payment processing is set up */}
        {status !== 'paid' && status !== 'cancelled' && status !== 'draft' && hasPaymentProcessing && paymentLinkToken && (
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/pay/${paymentLinkToken}`} target="_blank">
              View Payment Page
            </Link>
          </Button>
        )}

        {/* Show Mark as Paid for all sent invoices (payment might come via check, cash, etc.) */}
        {status !== 'paid' && status !== 'cancelled' && status !== 'draft' && (
          <Button
            variant="default"
            onClick={() => setShowMarkPaidDialog(true)}
            disabled={isMarkingPaid}
            className="flex-1"
          >
            {isMarkingPaid ? 'Marking as Paid...' : 'Mark as Paid'}
          </Button>
        )}

        {/* Encourage payment processing setup if not configured */}
        {status !== 'paid' && status !== 'cancelled' && status !== 'draft' && !hasPaymentProcessing && (
          <Button asChild variant="outline" className="flex-1">
            <Link href="/dashboard/settings/payments">
              Set Up Payment Processing
            </Link>
          </Button>
        )}

        {status !== 'draft' && (
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
          >
            {isDownloading ? 'Generating PDF...' : 'Download PDF'}
          </Button>
        )}
        <Button
          variant="outline"
          onClick={handleDuplicate}
          disabled={isDuplicating}
        >
          {isDuplicating ? 'Duplicating...' : 'Duplicate'}
        </Button>
        {status === 'draft' && (
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete
          </Button>
        )}
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Invoice</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete Invoice #{invoiceNumber}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Invoice'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Invoice #{invoiceNumber}</DialogTitle>
            <DialogDescription>
              How would you like to send this invoice?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={() => handleSendInvoice(true)}
                disabled={isSending}
              >
                Send via Email
              </Button>
              <p className="text-sm text-slate-500 text-center">
                Sends an email to the client with a payment link
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">Or</span>
              </div>
            </div>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSendInvoice(false)}
                disabled={isSending}
              >
                Mark as Sent
              </Button>
              <p className="text-sm text-slate-500 text-center">
                Updates the invoice status without sending an email
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowSendDialog(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showMarkPaidDialog} onOpenChange={setShowMarkPaidDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Invoice as Paid</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark Invoice #{invoiceNumber} as paid? This will update the invoice status to paid.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowMarkPaidDialog(false)}
              disabled={isMarkingPaid}
            >
              Cancel
            </Button>
            <Button
              onClick={handleMarkPaid}
              disabled={isMarkingPaid}
            >
              {isMarkingPaid ? 'Marking as Paid...' : 'Mark as Paid'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
