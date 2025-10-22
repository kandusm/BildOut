import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | BildOut',
  description: 'BildOut Terms of Service - Review the terms and conditions for using our invoicing platform.',
}

export default function TermsPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
          <p className="text-slate-600">Last Updated: October 21, 2025</p>
        </div>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-slate-700 mb-4">
              These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and BildOut ("Company," "we," "us," or "our") concerning your access to and use of the BildOut invoicing platform available at bildout.com (the "Service").
            </p>
            <p className="text-slate-700 mb-4">
              By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access the Service.
            </p>
            <p className="text-slate-700">
              <strong>You must be at least 18 years old to use the Service.</strong> By using the Service, you represent and warrant that you are at least 18 years of age.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Description of Service</h2>
            <p className="text-slate-700 mb-4">
              BildOut is a cloud-based invoicing platform that enables users to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>Create, manage, and send professional invoices</li>
              <li>Track payments and invoice statuses</li>
              <li>Manage client information</li>
              <li>Accept payments through Stripe Connect (optional)</li>
              <li>Generate reports and analytics (on applicable plans)</li>
              <li>Access invoice templates and business resources</li>
            </ul>
            <p className="text-slate-700">
              The Service is provided on a subscription basis with Free, Pro, and Agency tiers as described on our <Link href="/pricing" className="text-brand-orange hover:underline">Pricing page</Link>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. User Accounts</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">3.1 Account Creation</h3>
            <p className="text-slate-700 mb-4">
              To use the Service, you must create an account by providing accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">3.2 Account Security</h3>
            <p className="text-slate-700 mb-4">You agree to:</p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>Maintain the security of your account and password</li>
              <li>Notify us immediately of any unauthorized access or security breach</li>
              <li>Be responsible for all activities under your account</li>
              <li>Not share your account credentials with others</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">3.3 Account Termination</h3>
            <p className="text-slate-700 mb-4">
              We reserve the right to suspend or terminate your account at any time for violations of these Terms, fraudulent activity, or other reasons at our sole discretion. You may terminate your account at any time through the account settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Acceptable Use Policy</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">4.1 Permitted Use</h3>
            <p className="text-slate-700 mb-4">
              You may use the Service only for lawful purposes and in accordance with these Terms. You agree to use the Service only for legitimate invoicing and business purposes.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">4.2 Prohibited Activities</h3>
            <p className="text-slate-700 mb-4">You agree NOT to:</p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Send fraudulent, deceptive, or misleading invoices</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Transmit viruses, malware, or harmful code</li>
              <li>Attempt to gain unauthorized access to the Service or related systems</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Use automated systems (bots, scrapers) without permission</li>
              <li>Resell or redistribute the Service without authorization</li>
              <li>Reverse engineer, decompile, or disassemble the Service</li>
              <li>Remove or obscure any copyright, trademark, or proprietary notices</li>
              <li>Use the Service to harass, abuse, or harm another person</li>
              <li>Impersonate any person or entity</li>
              <li>Collect or store personal data of other users without consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Subscription Plans and Billing</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">5.1 Subscription Tiers</h3>
            <p className="text-slate-700 mb-4">
              We offer Free, Pro, and Agency subscription plans. Each plan has different features and limitations as described on our <Link href="/pricing" className="text-brand-orange hover:underline">Pricing page</Link>.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">5.2 Billing and Payment</h3>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>Paid subscriptions are billed monthly in advance</li>
              <li>All payments are processed securely through Stripe</li>
              <li>You authorize us to charge your payment method on file</li>
              <li>Prices are in U.S. Dollars (USD) unless otherwise stated</li>
              <li>All fees are non-refundable except as stated in our <Link href="/refund" className="text-brand-orange hover:underline">Refund Policy</Link></li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">5.3 Automatic Renewal</h3>
            <p className="text-slate-700 mb-4">
              Your subscription will automatically renew at the end of each billing period unless you cancel before the renewal date. You can cancel your subscription at any time through your account settings or the Stripe billing portal.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">5.4 Plan Changes</h3>
            <p className="text-slate-700 mb-4">
              You may upgrade or downgrade your subscription plan at any time. Upgrades take effect immediately and you will be charged a prorated amount. Downgrades take effect at the end of your current billing period.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">5.5 Price Changes</h3>
            <p className="text-slate-700 mb-4">
              We reserve the right to modify our pricing at any time. We will provide at least 30 days' notice of any price increases. If you do not agree to the price change, you may cancel your subscription.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">5.6 Taxes</h3>
            <p className="text-slate-700 mb-4">
              All fees are exclusive of applicable taxes (e.g., sales tax, VAT, GST). You are responsible for paying all applicable taxes associated with your subscription.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Payment Processing (Stripe Connect)</h2>
            <p className="text-slate-700 mb-4">
              If you choose to accept payments through the Service, you will use Stripe Connect. By connecting a Stripe account:
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>You agree to the <a href="https://stripe.com/connect-account/legal" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">Stripe Connected Account Agreement</a></li>
              <li>You authorize BildOut to facilitate payments on your behalf</li>
              <li>All payment disputes and chargebacks are handled through Stripe</li>
              <li>You are responsible for complying with payment card industry (PCI) standards</li>
              <li>You agree to Stripe's fees and terms (separate from BildOut subscription fees)</li>
            </ul>
            <p className="text-slate-700 mb-4">
              BildOut is not a payment processor and is not responsible for payment failures, fraud, or disputes. Payment processing is governed by Stripe's terms and policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. User Content and Data</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">7.1 Your Content</h3>
            <p className="text-slate-700 mb-4">
              You retain all ownership rights to the content you create using the Service, including invoices, client data, and business information ("User Content"). You grant us a limited license to use, store, and display your User Content solely to provide the Service.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">7.2 Content Responsibility</h3>
            <p className="text-slate-700 mb-4">
              You are solely responsible for your User Content. You represent and warrant that:
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>You own or have the necessary rights to your User Content</li>
              <li>Your User Content does not violate any laws or third-party rights</li>
              <li>Your User Content is accurate and not fraudulent or misleading</li>
              <li>Your invoices comply with applicable tax and business regulations</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">7.3 Data Backup</h3>
            <p className="text-slate-700 mb-4">
              While we perform regular backups, you are responsible for maintaining your own backup copies of important data. We are not liable for any loss of User Content.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">7.4 Data Export</h3>
            <p className="text-slate-700 mb-4">
              You may export your data at any time through the Service (CSV export on Pro and Agency plans). Upon account termination, you have 30 days to export your data before it is permanently deleted.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Intellectual Property</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">8.1 Our Intellectual Property</h3>
            <p className="text-slate-700 mb-4">
              The Service, including its software, design, text, graphics, logos, and other content (excluding User Content), is owned by BildOut and protected by copyright, trademark, and other intellectual property laws.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">8.2 Limited License</h3>
            <p className="text-slate-700 mb-4">
              We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for your internal business purposes in accordance with these Terms.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">8.3 Trademarks</h3>
            <p className="text-slate-700 mb-4">
              "BildOut" and our logo are trademarks of BildOut. You may not use our trademarks without our prior written permission.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">8.4 Feedback</h3>
            <p className="text-slate-700 mb-4">
              If you provide us with feedback, suggestions, or ideas about the Service, you grant us the right to use, modify, and incorporate such feedback without compensation or attribution.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Third-Party Services</h2>
            <p className="text-slate-700 mb-4">
              The Service integrates with third-party services including Stripe, Supabase, and Resend. Your use of these third-party services is subject to their respective terms and conditions. We are not responsible for any third-party services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Disclaimer of Warranties</h2>
            <p className="text-slate-700 mb-4 uppercase font-semibold">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
            </p>
            <p className="text-slate-700 mb-4">
              To the fullest extent permitted by law, we disclaim all warranties, including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>Implied warranties of merchantability, fitness for a particular purpose, and non-infringement</li>
              <li>Warranties that the Service will be uninterrupted, error-free, or secure</li>
              <li>Warranties regarding the accuracy, reliability, or completeness of content</li>
              <li>Warranties that defects will be corrected</li>
            </ul>
            <p className="text-slate-700">
              We do not warrant that the Service will meet your requirements or that it will be suitable for any particular purpose.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">11. Limitation of Liability</h2>
            <p className="text-slate-700 mb-4 uppercase font-semibold">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, BILDOUT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
            <p className="text-slate-700 mb-4">
              Our total liability to you for any claims arising from or related to the Service shall not exceed the greater of:
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>The amount you paid us in the 12 months preceding the claim, or</li>
              <li>$100 USD</li>
            </ul>
            <p className="text-slate-700">
              This limitation applies to all causes of action, including breach of contract, breach of warranty, negligence, strict liability, misrepresentation, and other torts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">12. Indemnification</h2>
            <p className="text-slate-700 mb-4">
              You agree to indemnify, defend, and hold harmless BildOut and its officers, directors, employees, agents, and affiliates from any claims, damages, losses, liabilities, and expenses (including attorneys' fees) arising from:
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another person or entity</li>
              <li>Your User Content</li>
              <li>Your business activities and invoices sent through the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">13. Service Availability</h2>
            <p className="text-slate-700 mb-4">
              We strive to provide reliable Service, but we do not guarantee that the Service will be available at all times. We may:
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>Suspend or discontinue the Service for maintenance or updates</li>
              <li>Modify or discontinue features at any time</li>
              <li>Experience downtime due to technical issues or force majeure events</li>
            </ul>
            <p className="text-slate-700">
              We are not liable for any Service interruptions or unavailability.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">14. Governing Law and Dispute Resolution</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">14.1 Governing Law</h3>
            <p className="text-slate-700 mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the State of [Your State], United States, without regard to its conflict of law provisions.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">14.2 Dispute Resolution</h3>
            <p className="text-slate-700 mb-4">
              Any disputes arising from these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration shall take place in [Your City, State].
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">14.3 Class Action Waiver</h3>
            <p className="text-slate-700 mb-4">
              You agree that any arbitration or proceeding shall be limited to the dispute between you and BildOut individually. You waive any right to participate in a class action lawsuit or class-wide arbitration.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">15. Modifications to Terms</h2>
            <p className="text-slate-700 mb-4">
              We reserve the right to modify these Terms at any time. We will notify you of material changes by email or through a notice on the Service at least 30 days before the changes take effect.
            </p>
            <p className="text-slate-700 mb-4">
              Your continued use of the Service after the changes take effect constitutes your acceptance of the updated Terms. If you do not agree to the changes, you must stop using the Service and cancel your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">16. Termination</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">16.1 Termination by You</h3>
            <p className="text-slate-700 mb-4">
              You may terminate your account at any time through the account settings. Upon termination, your access to the Service will cease immediately, though you will retain access until the end of your current billing period for paid subscriptions.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">16.2 Termination by Us</h3>
            <p className="text-slate-700 mb-4">
              We may suspend or terminate your account immediately if:
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>You violate these Terms</li>
              <li>We suspect fraudulent or illegal activity</li>
              <li>Your account has been inactive for 12 months</li>
              <li>Required by law or legal process</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">16.3 Effect of Termination</h3>
            <p className="text-slate-700 mb-4">
              Upon termination:
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>Your right to access and use the Service immediately ceases</li>
              <li>You have 30 days to export your data</li>
              <li>We may delete your User Content after 30 days</li>
              <li>Provisions that by their nature should survive (e.g., liability limitations, indemnification) will remain in effect</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">17. General Provisions</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">17.1 Entire Agreement</h3>
            <p className="text-slate-700 mb-4">
              These Terms, together with our Privacy Policy and Refund Policy, constitute the entire agreement between you and BildOut regarding the Service.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">17.2 Severability</h3>
            <p className="text-slate-700 mb-4">
              If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">17.3 No Waiver</h3>
            <p className="text-slate-700 mb-4">
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">17.4 Assignment</h3>
            <p className="text-slate-700 mb-4">
              You may not assign or transfer these Terms or your account without our prior written consent. We may assign these Terms without restriction.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">17.5 Force Majeure</h3>
            <p className="text-slate-700 mb-4">
              We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, including acts of God, natural disasters, war, terrorism, pandemics, or internet failures.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">18. Contact Information</h2>
            <p className="text-slate-700 mb-4">
              If you have any questions about these Terms, please contact us:
            </p>
            <ul className="list-none mb-4 text-slate-700 space-y-2">
              <li><strong>Email:</strong> <a href="mailto:legal@bildout.com" className="text-brand-orange hover:underline">legal@bildout.com</a></li>
              <li><strong>Support:</strong> <a href="mailto:support@bildout.com" className="text-brand-orange hover:underline">support@bildout.com</a></li>
              <li><strong>Contact Form:</strong> <Link href="/contact" className="text-brand-orange hover:underline">Contact Us</Link></li>
            </ul>
          </section>

          <div className="mt-12 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-600 text-center">
              By using BildOut, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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
