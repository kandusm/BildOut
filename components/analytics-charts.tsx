'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AnalyticsChartsProps {
  invoicesByStatus: {
    paid: number
    unpaid: number
    draft: number
    void: number
  }
  revenueByMonth: Record<string, number>
}

export function AnalyticsCharts({ invoicesByStatus, revenueByMonth }: AnalyticsChartsProps) {
  const total = Object.values(invoicesByStatus).reduce((sum, val) => sum + val, 0)
  const maxRevenue = Math.max(...Object.values(revenueByMonth), 1)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Invoice Status Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Status Distribution</CardTitle>
          <CardDescription>Breakdown of invoices by status</CardDescription>
        </CardHeader>
        <CardContent>
          {total > 0 ? (
            <div className="space-y-4">
              {/* Paid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-900">Paid</span>
                  <span className="text-sm text-slate-600">
                    {invoicesByStatus.paid} ({total > 0 ? ((invoicesByStatus.paid / total) * 100).toFixed(0) : 0}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${total > 0 ? (invoicesByStatus.paid / total) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Unpaid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-900">Unpaid</span>
                  <span className="text-sm text-slate-600">
                    {invoicesByStatus.unpaid} ({total > 0 ? ((invoicesByStatus.unpaid / total) * 100).toFixed(0) : 0}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${total > 0 ? (invoicesByStatus.unpaid / total) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Draft */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-900">Draft</span>
                  <span className="text-sm text-slate-600">
                    {invoicesByStatus.draft} ({total > 0 ? ((invoicesByStatus.draft / total) * 100).toFixed(0) : 0}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-400 rounded-full transition-all"
                    style={{ width: `${total > 0 ? (invoicesByStatus.draft / total) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Void */}
              {invoicesByStatus.void > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-900">Void</span>
                    <span className="text-sm text-slate-600">
                      {invoicesByStatus.void} ({total > 0 ? ((invoicesByStatus.void / total) * 100).toFixed(0) : 0}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-300 rounded-full transition-all"
                      style={{ width: `${total > 0 ? (invoicesByStatus.void / total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-600">No invoice data available</p>
          )}
        </CardContent>
      </Card>

      {/* Revenue by Month Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Month</CardTitle>
          <CardDescription>Monthly revenue trend</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(revenueByMonth).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(revenueByMonth)
                .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
                .map(([month, revenue]) => (
                  <div key={month}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-900">{month}</span>
                      <span className="text-sm font-semibold text-emerald-600">
                        {formatCurrency(revenue)}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${(revenue / maxRevenue) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">No revenue data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
