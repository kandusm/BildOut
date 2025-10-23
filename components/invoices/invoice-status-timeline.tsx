'use client'

import { InvoiceStatusHistory, STATUS_LABELS, STATUS_COLORS } from '@/types/status-history'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

interface InvoiceStatusTimelineProps {
  history: InvoiceStatusHistory[]
}

export function InvoiceStatusTimeline({ history }: InvoiceStatusTimelineProps) {
  if (!history || history.length === 0) {
    return null
  }

  // Sort by changed_at descending (most recent first)
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime()
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status History</CardTitle>
        <CardDescription>
          Track all changes to this invoice's status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />

          {/* Timeline items */}
          <div className="space-y-6">
            {sortedHistory.map((item, index) => {
              const isFirst = index === 0
              const fromLabel = item.from_status ? STATUS_LABELS[item.from_status] : 'Created'
              const toLabel = STATUS_LABELS[item.to_status]
              const statusColor = STATUS_COLORS[item.to_status]

              return (
                <div key={item.id} className="relative pl-10">
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-2.5 w-3 h-3 rounded-full border-2 border-white ${
                      isFirst ? 'bg-brand-orange' : 'bg-slate-400'
                    }`}
                    style={{ top: '6px' }}
                  />

                  {/* Content */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className={statusColor} variant="secondary">
                        {toLabel}
                      </Badge>
                      {item.from_status && (
                        <span className="text-xs text-slate-500">
                          from {fromLabel}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-slate-600">
                      {formatDistanceToNow(new Date(item.changed_at), {
                        addSuffix: true,
                      })}
                      {' • '}
                      {new Date(item.changed_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>

                    {item.notes && (
                      <p className="text-sm text-slate-500 italic">{item.notes}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
