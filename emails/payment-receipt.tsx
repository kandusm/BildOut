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

interface PaymentReceiptEmailProps {
  invoiceNumber: string
  clientName: string
  merchantName: string
  paymentAmount: number
  paymentDate: string
  paymentMethod: string
  invoiceTotal: number
  amountPaid: number
  balanceRemaining: number
  invoiceLink: string
  emailSignature?: string
}

export function PaymentReceiptEmail({
  invoiceNumber = 'INV-00001',
  clientName = 'John Doe',
  merchantName = 'Acme Corp',
  paymentAmount = 500.00,
  paymentDate = '2025-10-16',
  paymentMethod = 'card',
  invoiceTotal = 1500.00,
  amountPaid = 500.00,
  balanceRemaining = 1000.00,
  invoiceLink = 'https://example.com/pay/token',
  emailSignature,
}: PaymentReceiptEmailProps) {
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

  const formatPaymentMethod = (method: string) => {
    const methods: Record<string, string> = {
      'card': 'Credit/Debit Card',
      'us_bank_account': 'Bank Account (ACH)',
      'bank_account': 'Bank Account',
      'apple_pay': 'Apple Pay',
      'google_pay': 'Google Pay',
    }
    return methods[method] || method.replace('_', ' ')
  }

  const isPaidInFull = balanceRemaining <= 0
  const previewText = `Payment receipt for ${formatCurrency(paymentAmount)} - Invoice ${invoiceNumber}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Success Icon */}
          <Section style={iconSection}>
            <div style={successIcon}>✓</div>
          </Section>

          <Heading style={h1}>Payment Received</Heading>

          <Text style={text}>Hi {clientName},</Text>

          <Text style={text}>
            Thank you! We've received your payment of <strong>{formatCurrency(paymentAmount)}</strong> for Invoice {invoiceNumber} from {merchantName}.
          </Text>

          {/* Payment Details Box */}
          <Section style={receiptBox}>
            <Text style={receiptTitle}>Payment Details</Text>

            <div style={receiptRow}>
              <span style={receiptLabel}>Payment Amount:</span>
              <span style={receiptValue}>{formatCurrency(paymentAmount)}</span>
            </div>

            <div style={receiptRow}>
              <span style={receiptLabel}>Payment Date:</span>
              <span style={receiptValue}>{formatDate(paymentDate)}</span>
            </div>

            <div style={receiptRow}>
              <span style={receiptLabel}>Payment Method:</span>
              <span style={receiptValue}>{formatPaymentMethod(paymentMethod)}</span>
            </div>

            <div style={receiptRow}>
              <span style={receiptLabel}>Invoice Number:</span>
              <span style={receiptValue}>{invoiceNumber}</span>
            </div>
          </Section>

          {/* Invoice Summary */}
          <Section style={summaryBox}>
            <Text style={summaryTitle}>Invoice Summary</Text>

            <div style={summaryRow}>
              <span style={summaryLabel}>Invoice Total:</span>
              <span style={summaryValue}>{formatCurrency(invoiceTotal)}</span>
            </div>

            <div style={summaryRow}>
              <span style={summaryLabel}>Total Paid:</span>
              <span style={summaryValuePaid}>{formatCurrency(amountPaid)}</span>
            </div>

            <Hr style={summaryDivider} />

            <div style={summaryRow}>
              <span style={summaryLabelBalance}>Balance Remaining:</span>
              <span style={isPaidInFull ? balanceZero : balanceRemaining > 0 ? balancePositive : balanceZero}>
                {formatCurrency(Math.max(0, balanceRemaining))}
              </span>
            </div>
          </Section>

          {/* Status Message */}
          {isPaidInFull ? (
            <Section style={paidInFullBox}>
              <Text style={paidInFullText}>
                ✓ This invoice has been paid in full. Thank you!
              </Text>
            </Section>
          ) : (
            <>
              <Text style={text}>
                You have a remaining balance of <strong>{formatCurrency(balanceRemaining)}</strong> on this invoice.
              </Text>

              <Section style={buttonContainer}>
                <Button style={button} href={invoiceLink}>
                  Make Another Payment
                </Button>
              </Section>
            </>
          )}

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
            This is an automated payment receipt from {merchantName}. Please keep this email for your records.
          </Text>

          <Text style={footer}>
            If you have any questions about this payment, please contact {merchantName} directly.
          </Text>

          <Text style={footerBranding}>
            Invoice powered by <Link href="https://www.bildout.com" style={link}>BildOut</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default PaymentReceiptEmail

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

const iconSection = {
  textAlign: 'center' as const,
  margin: '40px 0 20px',
}

const successIcon = {
  display: 'inline-block',
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  backgroundColor: '#10b981',
  color: '#ffffff',
  fontSize: '36px',
  fontWeight: 'bold',
  lineHeight: '64px',
  textAlign: 'center' as const,
}

const h1 = {
  color: '#1e293b',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '20px 0 30px',
  padding: '0 40px',
  textAlign: 'center' as const,
}

const text = {
  color: '#334155',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 40px',
}

const receiptBox = {
  backgroundColor: '#f0fdf4',
  border: '2px solid #86efac',
  borderRadius: '8px',
  margin: '24px 40px',
  padding: '24px',
}

const receiptTitle = {
  color: '#15803d',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px',
}

const receiptRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '12px',
}

const receiptLabel = {
  color: '#64748b',
  fontSize: '14px',
}

const receiptValue = {
  color: '#1e293b',
  fontSize: '14px',
  fontWeight: '600',
}

const summaryBox = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  margin: '24px 40px',
  padding: '24px',
}

const summaryTitle = {
  color: '#1e293b',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px',
}

const summaryRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '12px',
}

const summaryLabel = {
  color: '#64748b',
  fontSize: '14px',
}

const summaryValue = {
  color: '#1e293b',
  fontSize: '14px',
  fontWeight: '600',
}

const summaryValuePaid = {
  color: '#10b981',
  fontSize: '14px',
  fontWeight: '600',
}

const summaryLabelBalance = {
  color: '#1e293b',
  fontSize: '16px',
  fontWeight: 'bold',
}

const balanceZero = {
  color: '#10b981',
  fontSize: '20px',
  fontWeight: 'bold',
}

const balancePositive = {
  color: '#EF4C23',
  fontSize: '20px',
  fontWeight: 'bold',
}

const summaryDivider = {
  borderColor: '#cbd5e1',
  margin: '12px 0',
}

const paidInFullBox = {
  backgroundColor: '#ecfdf5',
  border: '2px solid #10b981',
  borderRadius: '8px',
  margin: '24px 40px',
  padding: '20px',
  textAlign: 'center' as const,
}

const paidInFullText = {
  color: '#047857',
  fontSize: '16px',
  fontWeight: 'bold',
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
