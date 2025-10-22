export type InvoiceStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'partial'
  | 'paid'
  | 'overdue'
  | 'void'

export interface InvoiceStatusHistory {
  id: string
  invoice_id: string
  from_status: InvoiceStatus | null
  to_status: InvoiceStatus
  changed_at: string
  changed_by: string | null
  notes: string | null
  metadata: Record<string, any>
}

export const STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  viewed: 'Viewed',
  partial: 'Partially Paid',
  paid: 'Paid',
  overdue: 'Overdue',
  void: 'Void',
}

export const STATUS_COLORS: Record<InvoiceStatus, string> = {
  draft: 'bg-slate-100 text-slate-700',
  sent: 'bg-blue-100 text-blue-700',
  viewed: 'bg-purple-100 text-purple-700',
  partial: 'bg-amber-100 text-amber-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  void: 'bg-gray-100 text-gray-700',
}

export const STATUS_ICONS: Record<InvoiceStatus, string> = {
  draft: '📝',
  sent: '📤',
  viewed: '👁️',
  partial: '💰',
  paid: '✅',
  overdue: '⚠️',
  void: '🚫',
}
