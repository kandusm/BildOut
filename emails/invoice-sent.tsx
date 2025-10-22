import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface InvoiceSentEmailProps {
  invoiceNumber: string
  clientName: string
  merchantName: string
  merchantEmail?: string
  invoiceTotal: number
  dueDate?: string
  issueDate: string
  paymentLink: string
  items: Array<{
    name: string
    quantity: number
    amount: number
  }>
  notes?: string
  emailSignature?: string
}

export function InvoiceSentEmail({
  invoiceNumber = 'INV-00001',
  clientName = 'John Doe',
  merchantName = 'Acme Corp',
  merchantEmail,
  invoiceTotal = 1500.00,
  dueDate,
  issueDate = '2025-10-16',
  paymentLink = 'https://example.com/pay/token',
  items = [
    { name: 'Service 1', quantity: 1, amount: 500 },
    { name: 'Service 2', quantity: 2, amount: 1000 },
  ],
  notes,
  emailSignature,
}: InvoiceSentEmailProps) {
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

  const previewText = `New invoice from ${merchantName} - ${formatCurrency(invoiceTotal)} ${dueDate ? `due ${formatDate(dueDate)}` : ''}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Invoice from {merchantName}</Heading>

          <Text style={text}>Hi {clientName},</Text>

          <Text style={text}>
            {merchantName} has sent you an invoice for <strong>{formatCurrency(invoiceTotal)}</strong>.
          </Text>

          {/* Invoice Details Box */}
          <Section style={invoiceBox}>
            <div style={invoiceHeader}>
              <Text style={invoiceLabel}>Invoice Number</Text>
              <Text style={invoiceNumber}>{invoiceNumber}</Text>
            </div>

            <Hr style={divider} />

            <div style={invoiceRow}>
              <span style={label}>Invoice Date:</span>
              <span style={value}>{formatDate(issueDate)}</span>
            </div>

            {dueDate && (
              <div style={invoiceRow}>
                <span style={label}>Due Date:</span>
                <span style={valueDue}>{formatDate(dueDate)}</span>
              </div>
            )}

            <div style={invoiceRow}>
              <span style={label}>Total Amount:</span>
              <span style={valueAmount}>{formatCurrency(invoiceTotal)}</span>
            </div>
          </Section>

          {/* Line Items */}
          <Section style={itemsSection}>
            <Text style={itemsTitle}>Invoice Items</Text>
            {items.map((item, index) => (
              <div key={index} style={itemRow}>
                <div style={itemDetails}>
                  <span style={itemName}>{item.name}</span>
                  <span style={itemQty}>Qty: {item.quantity}</span>
                </div>
                <span style={itemAmount}>{formatCurrency(item.amount)}</span>
              </div>
            ))}
            <Hr style={divider} />
            <div style={totalRow}>
              <span style={totalLabel}>Total:</span>
              <span style={totalAmount}>{formatCurrency(invoiceTotal)}</span>
            </div>
          </Section>

          {/* Notes */}
          {notes && (
            <Section style={notesBox}>
              <Text style={notesTitle}>Notes</Text>
              <Text style={notesText}>{notes}</Text>
            </Section>
          )}

          {/* Payment Button */}
          <Section style={buttonContainer}>
            <Button style={button} href={paymentLink}>
              View & Pay Invoice
            </Button>
          </Section>

          <Text style={linkText}>
            Or copy and paste this link into your browser:
          </Text>
          <Text style={linkUrl}>
            <Link href={paymentLink} style={link}>
              {paymentLink}
            </Link>
          </Text>

          {/* Footer */}
          <Hr style={hr} />

          {emailSignature && (
            <Text style={signature}>
              {emailSignature.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </Text>
          )}

          <Text style={footer}>
            This invoice was sent by {merchantName}
            {merchantEmail && <> ({merchantEmail})</>}.
          </Text>

          <Text style={footer}>
            Please contact them directly if you have any questions about this invoice or need to discuss payment terms.
          </Text>

          <Text style={footerBranding}>
            Invoice powered by <Link href="https://bildout.com" style={link}>BildOut</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default InvoiceSentEmail

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const h1 = {
  color: '#1e293b',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 40px',
  textAlign: 'center' as const,
}

const text = {
  color: '#334155',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 40px',
}

const invoiceBox = {
  backgroundColor: '#f8fafc',
  border: '2px solid #cbd5e1',
  borderRadius: '8px',
  margin: '24px 40px',
  padding: '24px',
}

const invoiceHeader = {
  textAlign: 'center' as const,
  marginBottom: '16px',
}

const invoiceLabel = {
  color: '#64748b',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 4px',
}

const invoiceNumber = {
  color: '#1e293b',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
}

const divider = {
  borderColor: '#e2e8f0',
  margin: '16px 0',
}

const invoiceRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '12px',
}

const label = {
  color: '#64748b',
  fontSize: '14px',
}

const value = {
  color: '#1e293b',
  fontSize: '14px',
  fontWeight: '600',
}

const valueDue = {
  color: '#EF4C23',
  fontSize: '14px',
  fontWeight: '600',
}

const valueAmount = {
  color: '#1e293b',
  fontSize: '18px',
  fontWeight: 'bold',
}

const itemsSection = {
  margin: '24px 40px',
}

const itemsTitle = {
  color: '#1e293b',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px',
}

const itemRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '12px',
}

const itemDetails = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '4px',
}

const itemName = {
  color: '#1e293b',
  fontSize: '14px',
  fontWeight: '500',
}

const itemQty = {
  color: '#64748b',
  fontSize: '12px',
}

const itemAmount = {
  color: '#1e293b',
  fontSize: '14px',
  fontWeight: '600',
}

const totalRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '12px',
}

const totalLabel = {
  color: '#1e293b',
  fontSize: '18px',
  fontWeight: 'bold',
}

const totalAmount = {
  color: '#EF4C23',
  fontSize: '24px',
  fontWeight: 'bold',
}

const notesBox = {
  backgroundColor: '#fef9f5',
  border: '1px solid #fed7aa',
  borderRadius: '8px',
  margin: '24px 40px',
  padding: '20px',
}

const notesTitle = {
  color: '#92400e',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 8px',
}

const notesText = {
  color: '#78350f',
  fontSize: '14px',
  lineHeight: '20px',
  margin: 0,
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 40px',
}

const button = {
  backgroundColor: '#EF4C23',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 20px',
}

const linkText = {
  color: '#64748b',
  fontSize: '12px',
  margin: '16px 40px 8px',
  textAlign: 'center' as const,
}

const linkUrl = {
  color: '#64748b',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '0 40px 16px',
  wordBreak: 'break-all' as const,
  textAlign: 'center' as const,
}

const link = {
  color: '#EF4C23',
  textDecoration: 'underline',
}

const hr = {
  borderColor: '#e2e8f0',
  margin: '32px 40px',
}

const signature = {
  color: '#1e293b',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '16px 40px',
  whiteSpace: 'pre-wrap' as const,
}

const footer = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '16px 40px',
}

const footerBranding = {
  color: '#94a3b8',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '32px 40px 0',
}
