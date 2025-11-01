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

interface OverdueReminderEmailProps {
  invoiceNumber: string
  clientName: string
  merchantName: string
  amountDue: number
  dueDate: string
  paymentLink: string
}

export function OverdueReminderEmail({
  invoiceNumber = 'INV-00001',
  clientName = 'John Doe',
  merchantName = 'Acme Corp',
  amountDue = 1500.00,
  dueDate = '2025-01-15',
  paymentLink = 'https://example.com/pay/token',
}: OverdueReminderEmailProps) {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amountDue)

  const formattedDate = new Date(dueDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const previewText = `Payment reminder for Invoice ${invoiceNumber} - ${formattedAmount} overdue`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Payment Reminder</Heading>

          <Text style={text}>Hi {clientName},</Text>

          <Text style={text}>
            This is a friendly reminder that payment for Invoice <strong>{invoiceNumber}</strong> from {merchantName} is now overdue.
          </Text>

          <Section style={invoiceBox}>
            <Text style={invoiceLabel}>Invoice Number:</Text>
            <Text style={invoiceValue}>{invoiceNumber}</Text>

            <Text style={invoiceLabel}>Amount Due:</Text>
            <Text style={invoiceAmount}>{formattedAmount}</Text>

            <Text style={invoiceLabel}>Original Due Date:</Text>
            <Text style={invoiceValue}>{formattedDate}</Text>
          </Section>

          <Text style={text}>
            We understand that oversights happen. Please submit your payment at your earliest convenience to avoid any late fees or service interruptions.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={paymentLink}>
              Pay Now
            </Button>
          </Section>

          <Text style={text}>
            Or copy and paste this link into your browser:
          </Text>
          <Text style={linkText}>
            <Link href={paymentLink} style={link}>
              {paymentLink}
            </Link>
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            If you've already sent payment, please disregard this notice. If you have any questions or need to discuss payment arrangements, please contact {merchantName} directly.
          </Text>

          <Text style={footer}>
            Thank you for your business!
          </Text>

          <Text style={footerBranding}>
            Invoice powered by <Link href="https://www.bildout.com" style={link}>BildOut</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default OverdueReminderEmail

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
  backgroundColor: '#fef2f2',
  border: '2px solid #fca5a5',
  borderRadius: '8px',
  margin: '24px 40px',
  padding: '24px',
}

const invoiceLabel = {
  color: '#64748b',
  fontSize: '14px',
  fontWeight: '500',
  margin: '8px 0 4px',
}

const invoiceValue = {
  color: '#1e293b',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 16px',
}

const invoiceAmount = {
  color: '#dc2626',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 16px',
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
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 40px',
  wordBreak: 'break-all' as const,
}

const link = {
  color: '#EF4C23',
  textDecoration: 'underline',
}

const hr = {
  borderColor: '#e2e8f0',
  margin: '32px 40px',
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
