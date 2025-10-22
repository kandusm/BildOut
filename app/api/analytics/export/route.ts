import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's profile
    const { data: profile } = await supabase
      .from('users')
      .select('org_id')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const searchParams = request.nextUrl.searchParams
    const fromDate = searchParams.get('from') || new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]
    const toDate = searchParams.get('to') || new Date().toISOString().split('T')[0]
    const statusFilter = searchParams.get('status')

    // Build query with filters
    let invoiceQuery = supabase
      .from('invoices')
      .select('*, clients(name, email)')
      .eq('org_id', profile.org_id)
      .gte('issue_date', fromDate)
      .lte('issue_date', toDate)
      .order('issue_date', { ascending: false })

    if (statusFilter && statusFilter !== 'all') {
      invoiceQuery = invoiceQuery.eq('status', statusFilter)
    }

    const { data: invoices, error } = await invoiceQuery

    if (error) {
      console.error('Error fetching invoices:', error)
      return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 })
    }

    // Generate CSV
    const headers = [
      'Invoice Number',
      'Client Name',
      'Client Email',
      'Issue Date',
      'Due Date',
      'Status',
      'Subtotal',
      'Tax',
      'Discount',
      'Total',
      'Amount Paid',
      'Amount Due',
      'Notes'
    ]

    const csvRows = [
      headers.join(','),
      ...invoices.map(invoice => [
        invoice.number,
        invoice.clients?.name || 'N/A',
        invoice.clients?.email || 'N/A',
        invoice.issue_date,
        invoice.due_date || 'N/A',
        invoice.status,
        invoice.subtotal.toFixed(2),
        invoice.tax_total.toFixed(2),
        invoice.discount_total.toFixed(2),
        invoice.total.toFixed(2),
        invoice.amount_paid.toFixed(2),
        invoice.amount_due.toFixed(2),
        `"${(invoice.notes || '').replace(/"/g, '""')}"` // Escape quotes in notes
      ].join(','))
    ]

    const csv = csvRows.join('\n')

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="invoices_${fromDate}_to_${toDate}.csv"`,
      },
    })
  } catch (error: any) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to export data' },
      { status: 500 }
    )
  }
}
