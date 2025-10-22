import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | BildOut',
  description: 'BildOut Privacy Policy - Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-slate-600">Last Updated: October 21, 2025</p>
        </div>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Introduction</h2>
            <p className="text-slate-700 mb-4">
              Welcome to BildOut ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our invoicing platform at bildout.com (the "Service").
            </p>
            <p className="text-slate-700">
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">2.1 Information You Provide to Us</h3>
            <p className="text-slate-700 mb-4">We collect information that you voluntarily provide to us when you:</p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>Register for an account</li>
              <li>Create invoices and manage clients</li>
              <li>Subscribe to a paid plan</li>
              <li>Contact us for support</li>
              <li>Participate in surveys or provide feedback</li>
            </ul>
            <p className="text-slate-700 mb-4">This information may include:</p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li><strong>Account Information:</strong> Email address, name, business name, phone number</li>
              <li><strong>Business Information:</strong> Company name, address, logo, tax identification numbers</li>
              <li><strong>Client Information:</strong> Client names, email addresses, billing addresses, phone numbers</li>
              <li><strong>Invoice Data:</strong> Invoice details, line items, amounts, payment information</li>
              <li><strong>Payment Information:</strong> Payment processing is handled by Stripe. We do not store your full credit card details on our servers</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">2.2 Information Automatically Collected</h3>
            <p className="text-slate-700 mb-4">When you access the Service, we automatically collect certain information, including:</p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li><strong>Log Data:</strong> IP address, browser type, operating system, pages visited, time spent on pages, access times</li>
              <li><strong>Device Information:</strong> Device type, unique device identifiers</li>
              <li><strong>Usage Data:</strong> Features used, actions taken, performance metrics</li>
              <li><strong>Cookies and Tracking:</strong> We use cookies and similar tracking technologies to track activity and store certain information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-slate-700 mb-4">We use your information for the following purposes:</p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li><strong>Provide and Maintain the Service:</strong> To operate, maintain, and improve our invoicing platform</li>
              <li><strong>Account Management:</strong> To create and manage your account, authenticate users</li>
              <li><strong>Process Transactions:</strong> To process payments and send invoices to your clients</li>
              <li><strong>Customer Support:</strong> To respond to your inquiries and provide technical support</li>
              <li><strong>Communications:</strong> To send you service-related emails, updates, and notifications</li>
              <li><strong>Analytics:</strong> To understand how users interact with the Service and improve functionality</li>
              <li><strong>Security:</strong> To detect, prevent, and address technical issues and fraudulent activity</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes</li>
              <li><strong>Marketing:</strong> With your consent, to send promotional materials about new features, products, or services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. How We Share Your Information</h2>
            <p className="text-slate-700 mb-4">We may share your information in the following situations:</p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">4.1 Service Providers</h3>
            <p className="text-slate-700 mb-4">We share information with third-party service providers who perform services on our behalf:</p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li><strong>Stripe:</strong> Payment processing and Stripe Connect for accepting payments</li>
              <li><strong>Supabase:</strong> Database hosting and authentication services</li>
              <li><strong>Vercel:</strong> Application hosting and content delivery</li>
              <li><strong>Resend:</strong> Transactional email delivery</li>
              <li><strong>Analytics Providers:</strong> Service usage analytics and performance monitoring</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">4.2 Business Transfers</h3>
            <p className="text-slate-700 mb-4">
              If we are involved in a merger, acquisition, asset sale, or bankruptcy, your information may be transferred as part of that transaction. We will notify you via email and/or prominent notice on our website of any change in ownership.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">4.3 Legal Requirements</h3>
            <p className="text-slate-700 mb-4">We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., court orders, subpoenas).</p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">4.4 With Your Consent</h3>
            <p className="text-slate-700 mb-4">We may share your information for any other purpose with your consent.</p>

            <p className="text-slate-700 mb-4 font-semibold">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Data Retention</h2>
            <p className="text-slate-700 mb-4">
              We retain your information for as long as your account is active or as needed to provide you the Service. We will also retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.
            </p>
            <p className="text-slate-700 mb-4">
              If you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it for legal, tax, or regulatory purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Data Security</h2>
            <p className="text-slate-700 mb-4">
              We implement appropriate technical and organizational security measures to protect your information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>Encryption of data in transit using SSL/TLS</li>
              <li>Encryption of sensitive data at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication requirements</li>
              <li>Row-level security policies on database tables</li>
            </ul>
            <p className="text-slate-700">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Your Privacy Rights</h2>
            <p className="text-slate-700 mb-4">Depending on your location, you may have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Data Portability:</strong> Request a copy of your data in a machine-readable format</li>
              <li><strong>Opt-Out:</strong> Opt-out of marketing communications at any time</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent where we rely on consent to process your information</li>
            </ul>
            <p className="text-slate-700 mb-4">
              To exercise these rights, please contact us at <a href="mailto:privacy@bildout.com" className="text-brand-orange hover:underline">privacy@bildout.com</a>. We will respond to your request within 30 days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. California Privacy Rights (CCPA)</h2>
            <p className="text-slate-700 mb-4">
              If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>Right to know what personal information is collected, used, shared, or sold</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of the sale of personal information (we do not sell personal information)</li>
              <li>Right to non-discrimination for exercising your CCPA rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. European Privacy Rights (GDPR)</h2>
            <p className="text-slate-700 mb-4">
              If you are located in the European Economic Area (EEA), you have rights under the General Data Protection Regulation (GDPR). Our legal basis for processing your information includes:
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li><strong>Contract Performance:</strong> Processing necessary to provide the Service you requested</li>
              <li><strong>Legitimate Interests:</strong> Processing for our legitimate business interests (e.g., improving our Service)</li>
              <li><strong>Consent:</strong> Where you have given explicit consent</li>
              <li><strong>Legal Obligation:</strong> Processing required to comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Cookies and Tracking Technologies</h2>
            <p className="text-slate-700 mb-4">We use cookies and similar tracking technologies to:</p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>Maintain your session and keep you logged in</li>
              <li>Remember your preferences</li>
              <li>Analyze usage patterns and improve the Service</li>
              <li>Provide personalized features</li>
            </ul>
            <p className="text-slate-700 mb-4">
              You can control cookies through your browser settings. However, disabling cookies may affect the functionality of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">11. Third-Party Links</h2>
            <p className="text-slate-700 mb-4">
              The Service may contain links to third-party websites. We are not responsible for the privacy practices of these websites. We encourage you to read the privacy policies of every website you visit.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">12. Children's Privacy</h2>
            <p className="text-slate-700 mb-4">
              The Service is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">13. International Data Transfers</h2>
            <p className="text-slate-700 mb-4">
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws different from those in your country. We take appropriate safeguards to ensure your information is protected in accordance with this Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">14. Changes to This Privacy Policy</h2>
            <p className="text-slate-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We will also send you an email notification for material changes.
            </p>
            <p className="text-slate-700">
              You are advised to review this Privacy Policy periodically for any changes. Your continued use of the Service after changes are posted constitutes your acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">15. Contact Us</h2>
            <p className="text-slate-700 mb-4">
              If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <ul className="list-none mb-4 text-slate-700 space-y-2">
              <li><strong>Email:</strong> <a href="mailto:privacy@bildout.com" className="text-brand-orange hover:underline">privacy@bildout.com</a></li>
              <li><strong>Support:</strong> <Link href="/contact" className="text-brand-orange hover:underline">Contact Form</Link></li>
            </ul>
          </section>

          <div className="mt-12 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-600 text-center">
              This privacy policy is effective as of October 21, 2025 and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-brand-orange hover:underline font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
