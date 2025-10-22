import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type GuideData = {
  slug: string
  title: string
  description: string
  category: string
  readTime: string
  author: string
  publishedDate: string
  content: {
    introduction: string
    sections: Array<{
      heading: string
      content: string
      steps?: string[]
      tips?: string[]
    }>
    conclusion: string
  }
  relatedGuides: string[]
}

const guides: Record<string, GuideData> = {
  'how-to-create-an-invoice': {
    slug: 'how-to-create-an-invoice',
    title: 'How to Create an Invoice in 2025: Step-by-Step Guide',
    description: 'Learn how to create a professional invoice that gets paid on time. Complete guide with examples, templates, and best practices.',
    category: 'Getting Started',
    readTime: '5 min read',
    author: 'BildOut Team',
    publishedDate: '2025-01-15',
    content: {
      introduction: 'Creating a professional invoice is essential for getting paid on time. Whether you\'re a contractor, freelancer, or small business owner, a well-formatted invoice sets clear payment expectations and helps you maintain healthy cash flow.',
      sections: [
        {
          heading: 'What is an Invoice?',
          content: 'An invoice is a formal document sent to clients requesting payment for goods or services rendered. It serves as a bill and a record of the transaction for both you and your client.',
        },
        {
          heading: 'Essential Elements of an Invoice',
          content: 'Every professional invoice should include these critical elements:',
          steps: [
            'Invoice number (unique identifier)',
            'Your business name and contact information',
            'Client name and contact information',
            'Invoice date and due date',
            'Detailed description of goods or services',
            'Quantity and unit price for each item',
            'Subtotal, taxes, and total amount due',
            'Payment terms and accepted payment methods',
            'Late payment penalties (if applicable)',
          ],
        },
        {
          heading: 'Step-by-Step: Creating Your Invoice',
          content: 'Follow these steps to create a professional invoice:',
          steps: [
            'Choose an invoice template or software',
            'Add your business logo and branding',
            'Assign a unique invoice number',
            'Enter client information',
            'Add the invoice date and payment due date',
            'List all services or products provided',
            'Calculate subtotal, taxes, and total',
            'Include payment terms and instructions',
            'Review for accuracy',
            'Send to client via email with payment link',
          ],
        },
        {
          heading: 'Best Practices for Professional Invoices',
          content: 'Make your invoices more effective with these tips:',
          tips: [
            'Send invoices promptly after completing work',
            'Use clear, professional language',
            'Break down charges into detailed line items',
            'Include your logo for brand recognition',
            'Offer multiple payment methods',
            'Set realistic but firm payment terms',
            'Follow up on overdue payments',
          ],
        },
      ],
      conclusion: 'Creating professional invoices doesn\'t have to be complicated. With the right tools and a consistent process, you can streamline your billing and get paid faster. BildOut makes it easy to create, send, and track invoices—all in one place.',
    },
    relatedGuides: ['what-to-include-on-an-invoice', 'how-to-send-an-invoice', 'invoice-numbering-system'],
  },
  'how-to-accept-online-payments': {
    slug: 'how-to-accept-online-payments',
    title: 'How to Accept Online Payments: Complete Guide for Small Businesses',
    description: 'Learn how to accept credit cards, debit cards, and ACH payments online. Set up secure payment processing for your invoices.',
    category: 'Payments',
    readTime: '6 min read',
    author: 'BildOut Team',
    publishedDate: '2025-01-15',
    content: {
      introduction: 'Accepting online payments is no longer optional—it\'s essential for getting paid quickly. Clients expect convenient payment options, and businesses that offer them get paid faster.',
      sections: [
        {
          heading: 'Why Accept Online Payments?',
          content: 'Online payments benefit both you and your clients:',
          tips: [
            'Get paid 2-3x faster than check or wire transfer',
            'Reduce manual payment processing',
            'Improve cash flow with instant payment confirmation',
            'Offer convenience your clients expect',
            'Track payments automatically',
            'Reduce late payments with easy payment links',
          ],
        },
        {
          heading: 'Types of Online Payments',
          content: 'Modern payment processors support multiple payment methods:',
          steps: [
            'Credit cards (Visa, Mastercard, Amex, Discover)',
            'Debit cards',
            'ACH bank transfers (lower fees, slower processing)',
            'Digital wallets (Apple Pay, Google Pay)',
            'Buy now, pay later options',
          ],
        },
        {
          heading: 'How to Set Up Online Payment Processing',
          content: 'Getting started with online payments is straightforward:',
          steps: [
            'Choose a payment processor (Stripe, Square, PayPal)',
            'Create a business account',
            'Connect your bank account for deposits',
            'Verify your business information',
            'Set up payment links or embed payment forms',
            'Test with a small transaction',
            'Start accepting payments',
          ],
        },
        {
          heading: 'Payment Processing Fees',
          content: 'Understand the costs involved:',
          tips: [
            'Credit/debit cards: typically 2.9% + $0.30 per transaction',
            'ACH transfers: 0.8% - 1.5% (much cheaper for large amounts)',
            'International cards: may have higher fees',
            'Chargebacks: $15-25 per dispute',
          ],
        },
        {
          heading: 'Security and Compliance',
          content: 'Keep payments secure:',
          tips: [
            'Use PCI-compliant payment processors',
            'Enable two-factor authentication',
            'Never store card information yourself',
            'Use secure payment links (HTTPS)',
            'Monitor for suspicious activity',
          ],
        },
      ],
      conclusion: 'Accepting online payments is easier than ever. With modern invoicing software like BildOut, you can add a payment button to every invoice—no coding required. Start accepting payments today and get paid faster.',
    },
    relatedGuides: ['how-to-get-paid-faster', 'invoice-payment-terms', 'how-to-create-an-invoice'],
  },
  'how-to-get-paid-faster': {
    slug: 'how-to-get-paid-faster',
    title: 'How to Get Paid Faster: 10 Proven Strategies for Contractors',
    description: 'Reduce payment delays and improve cash flow with these proven strategies. Learn how to get invoices paid faster.',
    category: 'Best Practices',
    readTime: '7 min read',
    author: 'BildOut Team',
    publishedDate: '2025-01-15',
    content: {
      introduction: 'Waiting 30, 60, or even 90 days to get paid can cripple your cash flow. Use these proven strategies to get paid faster and keep your business running smoothly.',
      sections: [
        {
          heading: '1. Send Invoices Immediately',
          content: 'Don\'t wait days or weeks to invoice after completing work. Send invoices the same day or within 24 hours. The sooner you invoice, the sooner you get paid.',
        },
        {
          heading: '2. Offer Online Payment Options',
          content: 'Make it easy for clients to pay by offering credit cards, debit cards, and ACH transfers. Adding a "Pay Now" button to your invoice can reduce payment time by 50%.',
        },
        {
          heading: '3. Set Clear Payment Terms',
          content: 'Be explicit about when payment is due. "Net 15" or "Due upon receipt" leaves no ambiguity. Include late fees to incentivize on-time payment.',
        },
        {
          heading: '4. Require Deposits',
          content: 'For larger projects, require 25-50% upfront. This ensures you\'re not funding the entire project out of pocket and reduces risk.',
        },
        {
          heading: '5. Send Payment Reminders',
          content: 'Automate friendly payment reminders:',
          steps: [
            '7 days before due date: Friendly reminder',
            'On due date: Payment due today',
            '3 days after: Overdue notice',
            '7 days after: Final notice with late fees',
          ],
        },
        {
          heading: '6. Make Invoices Crystal Clear',
          content: 'Detailed, professional invoices get paid faster. Break down charges, include project details, and make the total obvious.',
        },
        {
          heading: '7. Build Strong Client Relationships',
          content: 'Clients who trust and value you pay faster. Communicate clearly, deliver quality work, and be responsive.',
        },
        {
          heading: '8. Offer Early Payment Discounts',
          content: 'Incentivize fast payment with a 2-5% discount for paying within 10 days. This can significantly improve cash flow.',
        },
        {
          heading: '9. Use Recurring Invoices',
          content: 'For ongoing services, set up recurring invoices that automatically send monthly. Consider auto-charging saved payment methods.',
        },
        {
          heading: '10. Follow Up on Late Payments',
          content: 'Don\'t be afraid to follow up. A polite phone call or email often gets faster results than waiting.',
        },
      ],
      conclusion: 'Getting paid faster is about systems, not luck. Implement these strategies, use modern invoicing tools, and watch your average payment time drop significantly.',
    },
    relatedGuides: ['how-to-handle-late-payments', 'invoice-payment-terms', 'how-to-write-payment-terms'],
  },
  'invoice-payment-terms': {
    slug: 'invoice-payment-terms',
    title: 'Invoice Payment Terms: Complete Guide with Examples',
    description: 'Learn about common payment terms like Net 30, Net 15, and Due on Receipt. Set clear expectations and get paid on time.',
    category: 'Best Practices',
    readTime: '8 min read',
    author: 'BildOut Team',
    publishedDate: '2025-01-15',
    content: {
      introduction: 'Payment terms define when and how clients must pay your invoices. Clear payment terms reduce confusion, prevent disputes, and help you get paid faster.',
      sections: [
        {
          heading: 'Common Payment Terms Explained',
          content: 'Understanding standard payment terms:',
          steps: [
            'Due on Receipt / Immediate Payment: Payment expected immediately upon receiving invoice',
            'Net 7: Payment due within 7 days of invoice date',
            'Net 10: Payment due within 10 days',
            'Net 15: Payment due within 15 days',
            'Net 30: Payment due within 30 days (most common)',
            'Net 60: Payment due within 60 days',
            'Net 90: Payment due within 90 days',
            'EOM (End of Month): Payment due at the end of the month',
            '2/10 Net 30: 2% discount if paid within 10 days, otherwise net 30',
          ],
        },
        {
          heading: 'Which Payment Terms Should You Use?',
          content: 'Choose terms based on your industry and cash flow needs:',
          tips: [
            'Service businesses: Net 15 or Net 30',
            'Contractors: 50% deposit, balance due on completion',
            'Recurring services: Due on receipt or auto-charge',
            'Large projects: Progress payments (30/30/40)',
            'Freelancers: 50% upfront, 50% on delivery',
          ],
        },
        {
          heading: 'How to Write Payment Terms',
          content: 'Make your terms crystal clear on every invoice:',
          steps: [
            'State the due date explicitly ("Payment due: March 15, 2025")',
            'Include payment methods accepted',
            'Specify late fee policy ("1.5% monthly late fee")',
            'Note early payment discounts if offered',
            'Add payment instructions (bank info, payment link)',
          ],
        },
        {
          heading: 'Late Payment Fees',
          content: 'Protect yourself with late fees:',
          tips: [
            'Typical late fee: 1.5% per month (18% annual)',
            'Alternative: Flat fee ($25-50) for overdue invoices',
            'Specify when late fees begin (day after due date)',
            'Ensure late fees are legal in your state/country',
            'Include late fee policy on every invoice',
          ],
        },
        {
          heading: 'Early Payment Discounts',
          content: 'Incentivize fast payment:',
          tips: [
            '2/10 Net 30: 2% discount if paid in 10 days',
            '1/7 Net 30: 1% discount if paid in 7 days',
            'Calculate if the discount is worth the faster cash flow',
          ],
        },
      ],
      conclusion: 'Clear payment terms are essential for getting paid on time. Choose terms that work for your business, communicate them clearly, and enforce them consistently.',
    },
    relatedGuides: ['how-to-write-payment-terms', 'how-to-handle-late-payments', 'how-to-get-paid-faster'],
  },
  'what-to-include-on-an-invoice': {
    slug: 'what-to-include-on-an-invoice',
    title: 'What to Include on an Invoice: Essential Information Checklist',
    description: 'Complete checklist of required and recommended invoice elements. Ensure your invoices are professional and compliant.',
    category: 'Getting Started',
    readTime: '5 min read',
    author: 'BildOut Team',
    publishedDate: '2025-01-15',
    content: {
      introduction: 'A complete, professional invoice includes all the information clients need to process payment—and protects you legally. Use this checklist to ensure you\'re including everything.',
      sections: [
        {
          heading: 'Required Information',
          content: 'These elements are legally required in most jurisdictions:',
          steps: [
            'The word "Invoice" prominently displayed',
            'Unique invoice number',
            'Invoice issue date',
            'Your business name and address',
            'Client name and address',
            'Detailed description of goods/services',
            'Quantity and unit price for each item',
            'Subtotal and total amount due',
            'Payment due date',
            'Your business tax ID or registration number (if applicable)',
          ],
        },
        {
          heading: 'Recommended Information',
          content: 'Include these for professional, complete invoices:',
          steps: [
            'Company logo and branding',
            'Purchase order (PO) number (if client provided one)',
            'Project name or job number',
            'Payment terms (Net 30, etc.)',
            'Accepted payment methods',
            'Bank details or payment link',
            'Late fee policy',
            'Tax breakdown (sales tax, VAT, etc.)',
            'Discount or promotion applied',
            'Notes or special instructions',
          ],
        },
        {
          heading: 'Contact Information',
          content: 'Make it easy for clients to reach you:',
          steps: [
            'Business phone number',
            'Business email address',
            'Website URL',
            'Physical business address',
            'Contact person name (for larger companies)',
          ],
        },
        {
          heading: 'Line Item Details',
          content: 'Each line item should include:',
          steps: [
            'Clear description of service/product',
            'Date service was performed (for service businesses)',
            'Quantity',
            'Unit price',
            'Line total',
            'Any applicable discounts',
          ],
        },
        {
          heading: 'Optional but Helpful',
          content: 'Consider adding:',
          tips: [
            'Project timeline or completion date',
            'Warranty information',
            'Return policy',
            'Customer service contact',
            'Payment confirmation message',
            'Thank you note',
          ],
        },
      ],
      conclusion: 'Complete invoices get paid faster and reduce back-and-forth questions. Use invoicing software like BildOut to automatically include all required information on every invoice.',
    },
    relatedGuides: ['how-to-create-an-invoice', 'invoice-numbering-system', 'how-to-send-an-invoice'],
  },
  'whitelist-bildout-emails': {
    slug: 'whitelist-bildout-emails',
    title: 'How to Whitelist BildOut Emails: Ensure You Receive All Invoices',
    description: 'Step-by-step instructions to whitelist BildOut emails in Gmail, Outlook, Office 365, and other email providers. Never miss an invoice again.',
    category: 'Getting Started',
    readTime: '4 min read',
    author: 'BildOut Team',
    publishedDate: '2025-01-21',
    content: {
      introduction: 'To ensure you receive all invoices, payment receipts, and important notifications from BildOut, add our email addresses to your safe senders list (whitelist). This prevents emails from going to spam or being blocked by corporate filters.',
      sections: [
        {
          heading: 'BildOut Email Addresses to Whitelist',
          content: 'Add these email addresses to your contacts or safe senders list:',
          steps: [
            'noreply@bildout.com - Authentication and account notifications',
            'invoices@bildout.com - Invoice notifications (if applicable)',
            'receipts@bildout.com - Payment receipts (if applicable)',
            'support@bildout.com - Support communications',
          ],
        },
        {
          heading: 'Gmail',
          content: 'Whitelist BildOut emails in Gmail:',
          steps: [
            'Open any email from BildOut (check spam folder if needed)',
            'Click the three dots menu in the top right',
            'Select "Add [sender] to Contacts list"',
            'Alternatively: Go to Settings (gear icon) → See all settings → Filters and Blocked Addresses',
            'Click "Create a new filter"',
            'In the "From" field, enter: *@bildout.com',
            'Click "Create filter"',
            'Check "Never send it to Spam"',
            'Click "Create filter"',
          ],
        },
        {
          heading: 'Outlook.com / Hotmail',
          content: 'Whitelist BildOut emails in Outlook.com:',
          steps: [
            'Click the gear icon (Settings) in the top right',
            'Select "View all Outlook settings"',
            'Go to Mail → Junk email',
            'Under "Safe senders and domains", click "Add"',
            'Enter: bildout.com',
            'Click "Save"',
          ],
        },
        {
          heading: 'Office 365 / Outlook Desktop',
          content: 'Whitelist BildOut emails in Office 365 or Outlook desktop app:',
          steps: [
            'Right-click any email from BildOut',
            'Select Junk → Never Block Sender',
            'Alternatively: Go to Home → Junk → Junk E-mail Options',
            'Click the "Safe Senders" tab',
            'Click "Add"',
            'Enter: @bildout.com',
            'Click "OK"',
          ],
        },
        {
          heading: 'Apple Mail (iPhone/iPad/Mac)',
          content: 'Whitelist BildOut emails in Apple Mail:',
          steps: [
            'Open any email from BildOut',
            'Click or tap the sender\'s email address',
            'Select "Add to VIPs" or "Create New Contact"',
            'Alternatively (Mac): Mail → Preferences → Rules',
            'Click "Add Rule"',
            'Set condition: "From" "contains" "bildout.com"',
            'Set action: "Move to Inbox"',
            'Click "OK"',
          ],
        },
        {
          heading: 'Corporate Email / Exchange Server',
          content: 'If you use a corporate email system and BildOut emails are being blocked or quarantined:',
          tips: [
            'Contact your IT department or email administrator',
            'Ask them to whitelist the domain: bildout.com',
            'Request they also whitelist the sending service: resend.com',
            'Check your corporate email quarantine for held messages',
            'Some companies use Mimecast, Proofpoint, or Barracuda - IT will need to whitelist in those systems',
          ],
        },
        {
          heading: 'Yahoo Mail',
          content: 'Whitelist BildOut emails in Yahoo Mail:',
          steps: [
            'Open any email from BildOut',
            'Click "Add to Contacts" above the email',
            'Alternatively: Click Settings (gear icon) → More Settings',
            'Go to Security and Privacy → "Add or edit blocked addresses"',
            'Make sure bildout.com is NOT on the blocked list',
          ],
        },
        {
          heading: 'Check Spam/Junk Folder',
          content: 'If you\'re still not receiving emails after whitelisting:',
          tips: [
            'Check your spam/junk folder regularly for the first few days',
            'Mark any BildOut emails as "Not Spam" or "Not Junk"',
            'Check your email quarantine (for corporate accounts)',
            'Verify the email address on your BildOut account is correct',
            'Contact support@bildout.com if emails still aren\'t arriving',
          ],
        },
      ],
      conclusion: 'Whitelisting BildOut emails ensures you never miss an invoice, payment confirmation, or important notification. If you continue to experience email delivery issues, please contact our support team at support@bildout.com.',
    },
    relatedGuides: ['how-to-create-an-invoice', 'how-to-send-an-invoice', 'how-to-accept-online-payments'],
  },
}

// For the remaining guides, I'll add placeholder content that follows the same structure
const placeholderGuides = [
  'how-to-handle-late-payments',
  'invoice-vs-receipt',
  'how-to-write-payment-terms',
  'invoice-numbering-system',
  'how-to-send-an-invoice',
]

placeholderGuides.forEach((slug) => {
  if (!guides[slug]) {
    guides[slug] = {
      slug,
      title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      description: 'Comprehensive guide coming soon.',
      category: 'Getting Started',
      readTime: '5 min read',
      author: 'BildOut Team',
      publishedDate: '2025-01-15',
      content: {
        introduction: 'This comprehensive guide will help you master this aspect of invoicing.',
        sections: [],
        conclusion: 'Learn more about professional invoicing with BildOut.',
      },
      relatedGuides: ['how-to-create-an-invoice', 'how-to-get-paid-faster'],
    }
  }
})

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const guide = guides[slug]

  if (!guide) {
    return {
      title: 'Guide Not Found | BildOut',
    }
  }

  return {
    title: `${guide.title} | BildOut`,
    description: guide.description,
    openGraph: {
      title: `${guide.title} | BildOut`,
      description: guide.description,
      type: 'article',
      publishedTime: guide.publishedDate,
      authors: [guide.author],
    },
  }
}

export async function generateStaticParams() {
  return Object.keys(guides).map((slug) => ({
    slug,
  }))
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params
  const guide = guides[slug]

  if (!guide) {
    notFound()
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-off-white to-white py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-brand-orange">
                {guide.category}
              </span>
              <span className="text-sm text-slate-500">{guide.readTime}</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-brand-slate sm:text-5xl font-heading">
              {guide.title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              {guide.description}
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm text-slate-600">
              <span>By {guide.author}</span>
              <span>•</span>
              <time dateTime={guide.publishedDate}>
                {new Date(guide.publishedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <article className="mx-auto max-w-3xl prose prose-slate">
            <p className="lead text-lg text-slate-700 leading-relaxed">
              {guide.content.introduction}
            </p>

            {guide.content.sections.map((section, index) => (
              <div key={index} className="mt-12">
                <h2 className="text-2xl font-bold text-brand-slate mb-4">{section.heading}</h2>
                <p className="text-slate-700 leading-relaxed">{section.content}</p>

                {section.steps && (
                  <ol className="mt-6 space-y-3">
                    {section.steps.map((step, i) => (
                      <li key={i} className="text-slate-700">{step}</li>
                    ))}
                  </ol>
                )}

                {section.tips && (
                  <ul className="mt-6 space-y-3">
                    {section.tips.map((tip, i) => (
                      <li key={i} className="text-slate-700">{tip}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <div className="mt-12 p-6 bg-brand-off-white rounded-lg border-l-4 border-brand-orange">
              <p className="text-slate-700 leading-relaxed m-0">
                {guide.content.conclusion}
              </p>
            </div>
          </article>

          {/* CTA Box */}
          <div className="mx-auto max-w-3xl mt-16 bg-brand-orange rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">
              Ready to streamline your invoicing?
            </h3>
            <p className="text-orange-100 mb-6">
              Start creating professional invoices in minutes with BildOut.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/signup">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Related Guides */}
      {guide.relatedGuides.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-2xl font-bold text-brand-slate mb-8">Related Guides</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {guide.relatedGuides.map((relatedSlug) => {
                  const related = guides[relatedSlug]
                  if (!related) return null
                  return (
                    <Link
                      key={relatedSlug}
                      href={`/guides/${relatedSlug}`}
                      className="bg-white rounded-lg p-6 border hover:shadow-md transition-shadow"
                    >
                      <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-brand-orange mb-3">
                        {related.category}
                      </span>
                      <h3 className="font-semibold text-brand-slate mb-2 line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {related.description}
                      </p>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
