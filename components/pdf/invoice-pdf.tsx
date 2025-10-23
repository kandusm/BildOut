import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  logoImage: {
    width: 80,
    height: 80,
    objectFit: 'contain',
    marginBottom: 8,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222831',
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222831',
    marginBottom: 4,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  invoiceNumber: {
    fontSize: 12,
    color: '#64748b',
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  column: {
    width: '48%',
  },
  label: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 4,
  },
  value: {
    fontSize: 10,
    color: '#0f172a',
  },
  strong: {
    fontWeight: 'bold',
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    padding: 8,
    borderRadius: 2,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableCol1: {
    width: '50%',
  },
  tableCol2: {
    width: '15%',
    textAlign: 'right',
  },
  tableCol3: {
    width: '18%',
    textAlign: 'right',
  },
  tableCol4: {
    width: '17%',
    textAlign: 'right',
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#475569',
  },
  totalsSection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 250,
    marginBottom: 6,
  },
  totalLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  totalValue: {
    fontSize: 10,
    color: '#0f172a',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 250,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#222831',
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  notes: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#0f172a',
  },
  notesText: {
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#94a3b8',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
  },
})

interface InvoicePDFProps {
  invoice: {
    number: string
    issue_date: string
    due_date?: string
    status: string
    subtotal: number
    tax_total: number
    discount_total: number
    total: number
    amount_paid: number
    amount_due: number
    notes?: string
    clients?: {
      name: string
      email?: string
      phone?: string
      address?: string
    }
    invoice_items: Array<{
      id: string
      name: string
      quantity: number
      unit_price: number
      line_total: number
    }>
  }
  organization: {
    name: string
    email?: string
    phone?: string
    address?: string
    logo_url?: string | null
    metadata?: {
      brand_color?: string
      invoice_prefix?: string
    } | null
  }
  subscriptionPlan: 'free' | 'pro' | 'agency'
}

export const InvoicePDF = ({ invoice, organization, subscriptionPlan }: InvoicePDFProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const taxPercentage = invoice.subtotal > 0 && invoice.tax_total > 0
    ? ((invoice.tax_total / invoice.subtotal) * 100).toFixed(2)
    : '0.00'

  // Check if custom branding is allowed for this subscription plan
  const allowCustomBranding = subscriptionPlan === 'pro' || subscriptionPlan === 'agency'

  // Get custom branding or use defaults (only if allowed)
  const brandColor = allowCustomBranding && organization.metadata?.brand_color
    ? organization.metadata.brand_color
    : '#EF4C23'
  const invoicePrefix = allowCustomBranding && organization.metadata?.invoice_prefix
    ? organization.metadata.invoice_prefix
    : 'INV'
  const logoUrl = allowCustomBranding ? organization.logo_url : null
  const companyName = allowCustomBranding ? organization.name : 'BildOut'
  const invoiceNumber = `${invoicePrefix}-${invoice.number}`

  // Create dynamic styles for brand color
  const dynamicStyles = StyleSheet.create({
    brandedBorder: {
      borderTopColor: brandColor,
    },
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            {logoUrl && (
              <Image src={logoUrl} style={styles.logoImage} />
            )}
            <Text style={styles.logo}>{companyName}</Text>
            {allowCustomBranding && organization.email && <Text style={styles.value}>{organization.email}</Text>}
            {allowCustomBranding && organization.phone && <Text style={styles.value}>{organization.phone}</Text>}
            {allowCustomBranding && organization.address && <Text style={styles.value}>{organization.address}</Text>}
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>#{invoiceNumber}</Text>
          </View>
        </View>

        {/* Bill To / Invoice Details */}
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>BILL TO</Text>
              {invoice.clients ? (
                <View>
                  <Text style={[styles.value, styles.strong]}>{invoice.clients.name}</Text>
                  {invoice.clients.email && <Text style={styles.value}>{invoice.clients.email}</Text>}
                  {invoice.clients.phone && <Text style={styles.value}>{invoice.clients.phone}</Text>}
                  {invoice.clients.address && <Text style={styles.value}>{invoice.clients.address}</Text>}
                </View>
              ) : (
                <Text style={styles.value}>No client assigned</Text>
              )}
            </View>
            <View style={styles.column}>
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.label}>INVOICE DATE</Text>
                <Text style={styles.value}>{formatDate(invoice.issue_date)}</Text>
              </View>
              {invoice.due_date && (
                <View>
                  <Text style={styles.label}>DUE DATE</Text>
                  <Text style={styles.value}>{formatDate(invoice.due_date)}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Line Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.tableCol1}>
              <Text style={styles.tableHeaderText}>DESCRIPTION</Text>
            </View>
            <View style={styles.tableCol2}>
              <Text style={styles.tableHeaderText}>QTY</Text>
            </View>
            <View style={styles.tableCol3}>
              <Text style={styles.tableHeaderText}>UNIT PRICE</Text>
            </View>
            <View style={styles.tableCol4}>
              <Text style={styles.tableHeaderText}>TOTAL</Text>
            </View>
          </View>
          {invoice.invoice_items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <View style={styles.tableCol1}>
                <Text>{item.name}</Text>
              </View>
              <View style={styles.tableCol2}>
                <Text>{item.quantity}</Text>
              </View>
              <View style={styles.tableCol3}>
                <Text>{formatCurrency(item.unit_price)}</Text>
              </View>
              <View style={styles.tableCol4}>
                <Text>{formatCurrency(item.line_total)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{formatCurrency(invoice.subtotal)}</Text>
          </View>
          {invoice.tax_total > 0 && (
            <View style={styles.totalsRow}>
              <Text style={styles.totalLabel}>Tax ({taxPercentage}%):</Text>
              <Text style={styles.totalValue}>{formatCurrency(invoice.tax_total)}</Text>
            </View>
          )}
          {invoice.discount_total > 0 && (
            <View style={styles.totalsRow}>
              <Text style={styles.totalLabel}>Discount:</Text>
              <Text style={styles.totalValue}>-{formatCurrency(invoice.discount_total)}</Text>
            </View>
          )}
          <View style={[styles.grandTotalRow, dynamicStyles.brandedBorder]}>
            <Text style={styles.grandTotalLabel}>Total:</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(invoice.total)}</Text>
          </View>
          {invoice.amount_paid > 0 && (
            <>
              <View style={[styles.totalsRow, { marginTop: 8 }]}>
                <Text style={styles.totalLabel}>Amount Paid:</Text>
                <Text style={styles.totalValue}>{formatCurrency(invoice.amount_paid)}</Text>
              </View>
              <View style={styles.totalsRow}>
                <Text style={styles.grandTotalLabel}>Balance Due:</Text>
                <Text style={styles.grandTotalValue}>{formatCurrency(invoice.amount_due)}</Text>
              </View>
            </>
          )}
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>Notes</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by BildOut - Your work. Billed out.</Text>
        </View>
      </Page>
    </Document>
  )
}
