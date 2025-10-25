import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refund Policy | BildOut',
  description: 'BildOut Refund Policy - Learn about our 14-day money-back guarantee and refund process.',
  alternates: {
    canonical: '/refund',
  },
  openGraph: {
    title: 'Refund Policy | BildOut',
    description: 'Learn about our 14-day money-back guarantee and refund process.',
    type: 'website',
    url: 'https://bildout.com/refund',
  },
}

export default function RefundPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Refund Policy</h1>
          <p className="text-slate-600">Last Updated: October 21, 2025</p>
        </div>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Overview</h2>
            <p className="text-slate-700 mb-4">
              At BildOut, we want you to be completely satisfied with our invoicing platform. This Refund Policy explains our refund and cancellation procedures for subscriptions to the BildOut service available at bildout.com (the "Service").
            </p>
            <p className="text-slate-700">
              <strong>We offer a 14-day money-back guarantee on all paid subscription plans.</strong>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. 14-Day Money-Back Guarantee</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">2.1 Eligibility</h3>
            <p className="text-slate-700 mb-4">
              If you are not satisfied with BildOut for any reason, you may request a full refund within 14 days of your initial subscription payment. This guarantee applies to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>First-time subscribers to Pro or Agency plans</li>
              <li>Users upgrading from Free to a paid plan for the first time</li>
              <li>The initial subscription payment only</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">2.2 What's Covered</h3>
            <p className="text-slate-700 mb-4">
              We will provide a full refund of your subscription fee if requested within 14 days of:
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>Your initial Pro or Agency subscription purchase</li>
              <li>Your first upgrade from Free to a paid plan</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">2.3 What's NOT Covered</h3>
            <p className="text-slate-700 mb-4">
              The 14-day money-back guarantee does NOT apply to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>Renewal payments (monthly subscription renewals)</li>
              <li>Users who have previously received a refund for BildOut</li>
              <li>Accounts that have violated our <Link href="/terms" className="text-brand-orange hover:underline">Terms of Service</Link></li>
              <li>Plan changes or upgrades after the initial 14-day period</li>
              <li>Stripe Connect payment processing fees (these are charged by Stripe, not BildOut)</li>
              <li>Transaction fees for invoices you sent to clients</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. How to Request a Refund</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">3.1 Refund Request Process</h3>
            <p className="text-slate-700 mb-4">
              To request a refund within the 14-day guarantee period:
            </p>
            <ol className="list-decimal pl-6 mb-4 text-slate-700 space-y-2">
              <li>Email us at <a href="mailto:support@bildout.com" className="text-brand-orange hover:underline">support@bildout.com</a></li>
              <li>Include "Refund Request" in the subject line</li>
              <li>Provide your account email address and reason for the refund (optional but helpful)</li>
              <li>We will process your request within 2 business days</li>
            </ol>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">3.2 Refund Processing Time</h3>
            <p className="text-slate-700 mb-4">
              Once approved, refunds are processed immediately to your original payment method via Stripe. The refund should appear in your account within:
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li><strong>Credit/Debit Cards:</strong> 5-10 business days (depending on your bank)</li>
              <li><strong>Other Payment Methods:</strong> Timing varies by payment method and financial institution</li>
            </ul>
            <p className="text-slate-700">
              Please note that we cannot expedite the refund processing time as it depends on your bank or payment provider.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">3.3 Account Access After Refund</h3>
            <p className="text-slate-700 mb-4">
              Once a refund is issued:
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>Your paid subscription will be immediately downgraded to the Free plan</li>
              <li>You will retain access to features included in the Free plan</li>
              <li>Your account and data will NOT be deleted unless you choose to close your account</li>
              <li>You can export your data before or after the refund</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Subscription Cancellations</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">4.1 How to Cancel</h3>
            <p className="text-slate-700 mb-4">
              You can cancel your subscription at any time through:
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li><strong>Billing Settings:</strong> Go to Dashboard → Settings → Subscription & Billing → Manage Billing</li>
              <li><strong>Stripe Portal:</strong> Click "Manage Billing" to access the Stripe Customer Portal and cancel your subscription</li>
              <li><strong>Email Support:</strong> Contact <a href="mailto:support@bildout.com" className="text-brand-orange hover:underline">support@bildout.com</a> and we'll cancel for you</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">4.2 Effect of Cancellation</h3>
            <p className="text-slate-700 mb-4">
              When you cancel your subscription:
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>You will retain access to paid features until the end of your current billing period</li>
              <li>You will NOT be charged for the next billing cycle</li>
              <li>After your billing period ends, your account will automatically downgrade to the Free plan</li>
              <li>Your data will be preserved and accessible on the Free plan (subject to Free plan limits)</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">4.3 No Partial Refunds for Cancellations</h3>
            <p className="text-slate-700 mb-4">
              If you cancel your subscription after the 14-day guarantee period, you will NOT receive a prorated refund for the unused portion of your billing cycle. You will continue to have access to paid features until your current billing period ends.
            </p>
            <p className="text-slate-700">
              <strong>Exception:</strong> Cancellations within the 14-day money-back guarantee period are eligible for a full refund as described in Section 2.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Plan Downgrades</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">5.1 Downgrading Plans</h3>
            <p className="text-slate-700 mb-4">
              If you downgrade from Agency to Pro, or from a paid plan to Free:
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>The downgrade will take effect at the end of your current billing period</li>
              <li>You will NOT receive a refund or credit for the difference</li>
              <li>You will continue to have access to your current plan's features until the billing period ends</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">5.2 Plan Upgrades</h3>
            <p className="text-slate-700 mb-4">
              If you upgrade your plan (Free to Pro, Pro to Agency):
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>The upgrade takes effect immediately</li>
              <li>You will be charged a prorated amount for the remainder of your billing cycle</li>
              <li>Your next billing date remains the same as your original subscription date</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Payment Issues and Failed Payments</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">6.1 Failed Payment Attempts</h3>
            <p className="text-slate-700 mb-4">
              If your payment fails during a subscription renewal:
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>Stripe will automatically retry the payment up to 3 times</li>
              <li>We will send you email notifications about the failed payment</li>
              <li>You will have 7 days to update your payment method</li>
              <li>If payment is not received after 7 days, your account will be downgraded to the Free plan</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">6.2 No Refunds for Payment Failures</h3>
            <p className="text-slate-700 mb-4">
              If your subscription lapses due to a failed payment, you will NOT receive a refund for any previous successful payments.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Chargebacks and Disputes</h2>
            <p className="text-slate-700 mb-4">
              If you dispute a charge with your bank or credit card company (chargeback) instead of contacting us for a refund:
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>Your account will be immediately suspended pending investigation</li>
              <li>We may permanently close your account if the chargeback is found to be fraudulent</li>
              <li>You may be liable for chargeback fees and administrative costs</li>
            </ul>
            <p className="text-slate-700 mb-4 font-semibold">
              We strongly encourage you to contact us directly at <a href="mailto:support@bildout.com" className="text-brand-orange hover:underline">support@bildout.com</a> before initiating a chargeback. We are committed to resolving billing issues quickly and fairly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Exceptional Circumstances</h2>
            <p className="text-slate-700 mb-4">
              In exceptional circumstances outside the 14-day guarantee period, we may consider refund requests on a case-by-case basis for:
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>Extended service outages (more than 48 hours)</li>
              <li>Critical bugs that prevent you from using core features</li>
              <li>Billing errors or duplicate charges</li>
              <li>Other extraordinary situations at our sole discretion</li>
            </ul>
            <p className="text-slate-700">
              To request a refund in exceptional circumstances, email <a href="mailto:support@bildout.com" className="text-brand-orange hover:underline">support@bildout.com</a> with detailed information about the issue.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Stripe Connect and Payment Processing</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">9.1 Stripe Fees Are Non-Refundable</h3>
            <p className="text-slate-700 mb-4">
              If you use Stripe Connect to accept payments from your clients, please note:
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>Stripe's payment processing fees are separate from BildOut subscription fees</li>
              <li>Stripe fees are charged by Stripe, not BildOut</li>
              <li>Stripe fees are non-refundable, even if you receive a BildOut subscription refund</li>
              <li>For questions about Stripe fees, contact <a href="https://support.stripe.com" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">Stripe Support</a></li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">9.2 Client Payment Refunds</h3>
            <p className="text-slate-700 mb-4">
              If you need to refund a payment you received from a client:
            </p>
            <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
              <li>Process the refund through your Stripe Dashboard</li>
              <li>BildOut does not control or process client refunds</li>
              <li>Refer to <a href="https://stripe.com/docs/refunds" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">Stripe's refund documentation</a> for assistance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Free Plan</h2>
            <p className="text-slate-700 mb-4">
              The BildOut Free plan does not require payment and therefore is not eligible for refunds. You can use the Free plan indefinitely at no cost.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">11. Changes to This Refund Policy</h2>
            <p className="text-slate-700 mb-4">
              We reserve the right to modify this Refund Policy at any time. We will notify you of material changes by email or through a notice on the Service at least 30 days before the changes take effect.
            </p>
            <p className="text-slate-700">
              Changes to this policy will only apply to subscriptions purchased after the effective date of the changes. Existing subscriptions will be governed by the Refund Policy in effect at the time of purchase.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">12. Contact Us</h2>
            <p className="text-slate-700 mb-4">
              If you have questions about this Refund Policy, subscription billing, or need to request a refund, please contact us:
            </p>
            <ul className="list-none mb-4 text-slate-700 space-y-2">
              <li><strong>Email:</strong> <a href="mailto:support@bildout.com" className="text-brand-orange hover:underline">support@bildout.com</a></li>
              <li><strong>Subject Line for Refunds:</strong> "Refund Request"</li>
              <li><strong>Contact Form:</strong> <Link href="/contact" className="text-brand-orange hover:underline">Contact Us</Link></li>
            </ul>
            <p className="text-slate-700">
              We typically respond to all refund requests within 2 business days.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-600 text-center">
              This refund policy is effective as of October 21, 2025. We are committed to treating all refund requests fairly and processing them promptly.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center space-x-4">
          <Link href="/terms" className="text-brand-orange hover:underline font-medium">
            Terms of Service
          </Link>
          <span className="text-slate-400">•</span>
          <Link href="/privacy" className="text-brand-orange hover:underline font-medium">
            Privacy Policy
          </Link>
          <span className="text-slate-400">•</span>
          <Link href="/" className="text-brand-orange hover:underline font-medium">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
