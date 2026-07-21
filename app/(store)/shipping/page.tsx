import type { Metadata } from 'next'
import { BRAND } from '@/lib/constants'

export const metadata: Metadata = {
  title:       'Shipping Policy',
  description: 'Louis Polo\'s shipping and delivery timelines for luggage and travel accessories, pan-India.',
  alternates:  { canonical: '/shipping' },
}

export default function ShippingPolicyPage() {
  return (
    <div className="pt-16 md:pt-20">
      <div className="container-lp section-pad max-w-[52rem]">

        <span className="lp-eyebrow">Legal</span>
        <h1 className="lp-heading-lg mb-2">Shipping Policy</h1>
        <p className="font-body text-[var(--color-lp-muted)] text-sm mb-10">
          Last updated: July 2026
        </p>

        <div className="prose-lp">

          <section>
            <h2>1. Shipping Coverage</h2>
            <p>
              We currently ship pan-India only, to all serviceable pin codes covered by our
              courier partners. We do not offer international shipping at this time.
            </p>
          </section>

          <section>
            <h2>2. Processing Time</h2>
            <p>
              Orders are processed and handed over to our courier partner within{' '}
              <strong>24–48 hours</strong> of payment confirmation, excluding Sundays and public
              holidays. You will receive an email/SMS confirmation once your order ships.
            </p>
          </section>

          <section>
            <h2>3. Delivery Time</h2>
            <p>
              Once dispatched, orders are typically delivered within{' '}
              <strong>3–7 business days</strong>, depending on your location. Metro cities are
              usually on the shorter end of this window; remote or non-metro pin codes may take
              slightly longer.
            </p>
          </section>

          <section>
            <h2>4. Shipping Charges</h2>
            <p>
              Shipping is free on every order, anywhere in India, with no minimum order value.
            </p>
          </section>

          <section>
            <h2>5. Order Tracking</h2>
            <p>
              Once your order ships, you&apos;ll receive a tracking link by email/SMS to follow
              its progress with the courier partner. You can also check order status by logging
              into your account.
            </p>
          </section>

          <section>
            <h2>6. Delays</h2>
            <p>
              Delivery timelines are estimates and not guaranteed. Louis Polo is not responsible
              for delays caused by courier partners, weather, regional restrictions, or other
              events outside our reasonable control. If your order is significantly delayed,
              contact us and we&apos;ll follow up with the courier on your behalf.
            </p>
          </section>

          <section>
            <h2>7. Failed or Refused Delivery</h2>
            <p>
              If a delivery attempt fails because you were unreachable or the address was
              incorrect, our courier partner will attempt redelivery. If the shipment is returned
              to us after repeated failed attempts, we will contact you to arrange reshipment
              (additional shipping charges may apply) or process a refund.
            </p>
          </section>

          <section>
            <h2>8. Contact</h2>
            <p>
              For any questions about shipping or an order in transit, email{' '}
              <a href="mailto:support@louispolo.in">support@louispolo.in</a> or call{' '}
              <a href={`tel:${BRAND.phone.replace(/[\s-]/g, '')}`}>{BRAND.phone}</a>.
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
