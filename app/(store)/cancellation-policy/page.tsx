import type { Metadata } from 'next'
import { BRAND } from '@/lib/constants'

export const metadata: Metadata = {
  title:       'Cancellation Policy',
  description: 'Louis Polo\'s order cancellation policy for luggage and travel accessories.',
  alternates:  { canonical: '/cancellation-policy' },
}

export default function CancellationPolicyPage() {
  return (
    <div className="pt-16 md:pt-20">
      <div className="container-lp section-pad max-w-[52rem]">

        <span className="lp-eyebrow">Legal</span>
        <h1 className="lp-heading-lg mb-2">Cancellation Policy</h1>
        <p className="font-body text-[var(--color-lp-muted)] text-sm mb-10">
          Last updated: July 2026
        </p>

        <div className="prose-lp">

          <section>
            <h2>1. Cancelling Before Dispatch</h2>
            <p>
              You can cancel an order any time before it has been shipped, free of charge — we
              do not deduct any cancellation fee. Email{' '}
              <a href="mailto:support@louispolo.in">support@louispolo.in</a> with your order number
              and we will cancel it and issue a full refund to your original payment method within{' '}
              <strong>5–7 business days</strong>.
            </p>
          </section>

          <section>
            <h2>2. Cancelling After Dispatch</h2>
            <p>
              Once an order has shipped, it can no longer be cancelled. You&apos;re welcome to
              refuse delivery or return the product after it arrives, under our{' '}
              <a href="/refund-policy">Refund Policy</a>.
            </p>
          </section>

          <section>
            <h2>3. Order Cancellations by Us</h2>
            <p>
              We reserve the right to cancel an order in cases of stock unavailability, pricing
              errors, or suspected fraudulent activity. If this happens, you will be notified by
              email and any amount charged will be refunded in full within 5–7 business days.
            </p>
          </section>

          <section>
            <h2>4. Payment &amp; Refund Method</h2>
            <p>
              All orders are prepaid through Razorpay — we do not offer cash on delivery. Refunds
              for cancelled orders are issued to the original payment method used at checkout; we
              cannot refund to a different account or as store credit.
            </p>
          </section>

          <section>
            <h2>5. Contact</h2>
            <p>
              For any questions about cancelling an order, email{' '}
              <a href="mailto:support@louispolo.in">support@louispolo.in</a> or call{' '}
              <a href={`tel:${BRAND.phone.replace(/[\s-]/g, '')}`}>{BRAND.phone}</a>. We aim to
              respond within 2 business days.
            </p>
            <p>
              {BRAND.legalName}<br />
              {BRAND.address}
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
