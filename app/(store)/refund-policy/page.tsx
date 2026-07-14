import type { Metadata } from 'next'

export const metadata: Metadata = {
  title:       'Refund Policy',
  description: 'Louis Polo\'s return and refund policy for luggage and travel accessories.',
}

export default function RefundPolicyPage() {
  return (
    <div className="pt-16 md:pt-[4.5rem]">
      <div className="container-lp section-pad max-w-[52rem]">

        <span className="lp-eyebrow">Legal</span>
        <h1 className="lp-heading-lg mb-2">Refund Policy</h1>
        <p className="font-body text-[var(--color-lp-muted)] text-sm mb-10">
          Last updated: June 2025
        </p>

        <div className="prose-lp">

          <section>
            <h2>1. Return Window</h2>
            <p>
              We accept returns within <strong>7 days</strong> of delivery. To be eligible, the
              product must be unused, in its original packaging, and in the same condition in
              which it was received.
            </p>
          </section>

          <section>
            <h2>2. Non-Returnable Items</h2>
            <p>The following items are not eligible for return:</p>
            <ul>
              <li>Products that have been used or show signs of wear</li>
              <li>Items returned without original packaging or tags</li>
              <li>Products damaged due to misuse, mishandling, or negligence</li>
              <li>Sale or clearance items (marked as final sale)</li>
            </ul>
          </section>

          <section>
            <h2>3. How to Initiate a Return</h2>
            <p>
              To request a return, email us at{' '}
              <a href="mailto:support@louispolo.in">support@louispolo.in</a> within 7 days of
              receiving your order. Include your order number and a brief description (with photos)
              of the issue. Our team will respond within 2 business days with return instructions.
            </p>
            <p>
              Do not ship items back without receiving a return authorisation from our team. Such
              parcels may be refused or lost.
            </p>
          </section>

          <section>
            <h2>4. Damaged or Defective Products</h2>
            <p>
              If your product arrives damaged or defective, please contact us within{' '}
              <strong>48 hours</strong> of delivery with photos of the damage. We will arrange a
              replacement or full refund at no additional cost, including return shipping.
            </p>
          </section>

          <section>
            <h2>5. Refund Processing</h2>
            <p>
              Once we receive and inspect your return, we will notify you by email. If approved,
              your refund will be processed to your original payment method within{' '}
              <strong>5–7 business days</strong>. Bank processing times may vary.
            </p>
            <p>
              Shipping charges paid at the time of order are non-refundable unless the return is
              due to our error or a defective product.
            </p>
          </section>

          <section>
            <h2>6. Return Shipping</h2>
            <p>
              Customers are responsible for return shipping costs unless the return is due to a
              defective or incorrect item. We recommend using a trackable shipping method. We are
              not responsible for items lost in transit.
            </p>
          </section>

          <section>
            <h2>7. Exchanges</h2>
            <p>
              We do not process direct exchanges. If you need a different size or colour, please
              return the original item for a refund and place a new order.
            </p>
          </section>

          <section>
            <h2>8. Contact</h2>
            <p>
              For any questions about returns or refunds, email{' '}
              <a href="mailto:support@louispolo.in">support@louispolo.in</a>. We aim to respond
              within 2 business days.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
