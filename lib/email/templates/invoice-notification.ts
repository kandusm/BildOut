interface InvoiceEmailProps {
  invoiceNumber: string
  clientName: string
  amount: string
  dueDate?: string
  paymentLink: string
  merchantName: string
  notes?: string
}

export function generateInvoiceEmail({
  invoiceNumber,
  clientName,
  amount,
  dueDate,
  paymentLink,
  merchantName,
  notes,
}: InvoiceEmailProps) {
  const dueDateText = dueDate
    ? `<p style="color: #64748b; margin-bottom: 16px;">Due Date: ${dueDate}</p>`
    : ''

  const notesSection = notes
    ? `
      <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
        <p style="color: #475569; font-weight: 500; margin-bottom: 8px;">Additional Notes:</p>
        <p style="color: #64748b;">${notes}</p>
      </div>
    `
    : ''

  return {
    subject: `Invoice #${invoiceNumber} from ${merchantName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice #${invoiceNumber}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc;">
            <tr>
              <td style="padding: 40px 20px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 32px; text-align: center; border-bottom: 1px solid #e2e8f0;">
                      <h1 style="margin: 0; color: #0f172a; font-size: 28px; font-weight: 700;">
                        Invoice #${invoiceNumber}
                      </h1>
                      <p style="margin: 8px 0 0; color: #64748b; font-size: 16px;">
                        From ${merchantName}
                      </p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="color: #334155; font-size: 16px; line-height: 24px; margin: 0 0 24px;">
                        Hi ${clientName},
                      </p>

                      <p style="color: #334155; font-size: 16px; line-height: 24px; margin: 0 0 24px;">
                        You've received a new invoice from ${merchantName}. Please review the details below and proceed with payment at your convenience.
                      </p>

                      <!-- Invoice Details Card -->
                      <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td style="padding-bottom: 12px;">
                              <p style="color: #64748b; font-size: 14px; margin: 0 0 4px;">Invoice Number</p>
                              <p style="color: #0f172a; font-size: 18px; font-weight: 600; margin: 0;">#${invoiceNumber}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-bottom: 12px;">
                              <p style="color: #64748b; font-size: 14px; margin: 0 0 4px;">Amount Due</p>
                              <p style="color: #ea580c; font-size: 28px; font-weight: 700; margin: 0;">${amount}</p>
                            </td>
                          </tr>
                          ${dueDateText ? `
                          <tr>
                            <td>
                              <p style="color: #64748b; font-size: 14px; margin: 0 0 4px;">Due Date</p>
                              <p style="color: #0f172a; font-size: 16px; font-weight: 500; margin: 0;">${dueDate}</p>
                            </td>
                          </tr>
                          ` : ''}
                        </table>
                      </div>

                      <!-- Pay Button -->
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 24px;">
                        <tr>
                          <td style="text-align: center;">
                            <a href="${paymentLink}"
                               style="display: inline-block; background-color: #ea580c; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 2px 4px rgba(234, 88, 12, 0.2);">
                              View & Pay Invoice
                            </a>
                          </td>
                        </tr>
                      </table>

                      ${notesSection}

                      <p style="color: #64748b; font-size: 14px; line-height: 20px; margin: 24px 0 0;">
                        If you have any questions about this invoice, please reply to this email or contact ${merchantName} directly.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 32px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="color: #94a3b8; font-size: 12px; line-height: 18px; margin: 0;">
                        This invoice was sent via BildOut<br>
                        <a href="${paymentLink}" style="color: #ea580c; text-decoration: none;">View Invoice</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `
Invoice #${invoiceNumber} from ${merchantName}

Hi ${clientName},

You've received a new invoice from ${merchantName}.

Invoice Number: #${invoiceNumber}
Amount Due: ${amount}
${dueDate ? `Due Date: ${dueDate}` : ''}

View and pay your invoice here: ${paymentLink}

${notes ? `\nNotes: ${notes}` : ''}

If you have any questions about this invoice, please reply to this email or contact ${merchantName} directly.

---
This invoice was sent via BildOut
View Invoice: ${paymentLink}
    `.trim(),
  }
}
