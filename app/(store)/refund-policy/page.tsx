import type { Metadata } from 'next'
import { BRAND } from '@/lib/constants'

export const metadata: Metadata = {
  title:       'Warranty, Returns & Exchange Policy',
  description: 'Louis Polo\'s warranty coverage and 7-day return/exchange policy for luggage and travel accessories purchased on louispolo.in.',
  alternates:  { canonical: '/refund-policy' },
}

export default function RefundPolicyPage() {
  return (
    <div className="pt-16 md:pt-18">
      <div className="container-lp section-pad max-w-[52rem]">

        <span className="lp-eyebrow">Legal</span>
        <h1 className="lp-heading-lg mb-2">Warranty, Returns &amp; Exchange Policy</h1>
        <p className="font-body text-[var(--color-lp-muted)] text-sm mb-10">
          Last updated: September 2026
        </p>

        <div className="prose-lp">

          <section>
            <p>
              At Louis Polo, we are committed to delivering premium travel luggage and accessories
              with exceptional quality. Below are our complete guidelines regarding warranties,
              returns, exchanges, and refunds for purchases made on louispolo.in.
            </p>
          </section>

          <section>
            <h2>Part 1 — Warranty Policy</h2>
            <p>
              Our warranty is designed to give you peace of mind against manufacturing anomalies.
              Warranty durations vary by product model and are specified on the warranty card or
              product tag included with your purchase.
            </p>
          </section>

          <section>
            <h2>1. What Is Covered</h2>
            <ul>
              <li>Structural manufacturing defects.</li>
              <li>Defective materials and substandard workmanship under normal travel usage.</li>
              <li>Premature failure of essential components (e.g. wheels, handles, locks) due strictly to manufacturing faults.</li>
            </ul>
          </section>

          <section>
            <h2>2. What Is Not Covered (Exclusions)</h2>
            <ul>
              <li>
                <strong>Normal Wear &amp; Tear</strong> — cosmetic blemishes, scratches, dents,
                scuffs, soil marks, and the natural degradation of fabric, zippers, handles, or
                wheels over time.
              </li>
              <li>
                <strong>Transit Damage</strong> — structural breaks, cracks, or zip bursts caused
                by airline baggage handling, rough transport, or courier mishandling during your
                own travel. Claims for this must be filed directly with the airline or transit
                carrier before leaving the terminal.
              </li>
              <li>
                <strong>Misuse &amp; Neglect</strong> — damage from overpacking beyond capacity,
                accidents, or exposure to extreme temperatures, solvents, acids, or water.
              </li>
              <li>
                <strong>Unauthorized Repairs</strong> — any alterations, tampering, or servicing
                performed by non-authorized repair centers.
              </li>
              <li>
                <strong>Finishes</strong> — degradation or discoloration of powder coatings,
                leather trims, or lock finishes.
              </li>
            </ul>
          </section>

          <section>
            <h2>3. How to Initiate a Warranty Claim</h2>
            <ol>
              <li>
                Email our support team at <a href="mailto:happytohelp@louispolo.in">happytohelp@louispolo.in</a>{' '}
                with the subject line <strong>&quot;Warranty Claim – [Your Order/Invoice Number]&quot;</strong>.
              </li>
              <li>Attach a copy of your original purchase invoice and the stamped warranty card.</li>
              <li>
                Attach clear, high-resolution photos and videos demonstrating the defect, along
                with a full front-view photo of the product.
              </li>
              <li>
                Our quality control team will assess the claim. If approved, we will provide
                instructions for repairing the product, replacing it, or issuing a store credit at
                our discretion.
              </li>
            </ol>
          </section>

          <section>
            <h2>Part 2 — Returns &amp; Exchanges</h2>
            <p>
              We offer a <strong>7-day return window</strong> from the date of delivery for items
              purchased directly on louispolo.in.
            </p>
          </section>

          <section>
            <h2>4. Conditions for Return Eligibility</h2>
            <ul>
              <li>The request must be initiated within 7 days of the delivery date.</li>
              <li>The product must be completely unused, unwashed, and in its original delivered condition.</li>
              <li>All original box packaging, price tags, brand tags, accessories, and warranty cards must be fully intact and attached.</li>
            </ul>
            <p>
              Note: Items marked as &quot;Final Sale&quot; or &quot;Clearance&quot; are
              non-returnable unless defective upon arrival.
            </p>
          </section>

          <section>
            <h2>5. Contact</h2>
            <p>
              For any questions about a warranty, return, or exchange, email{' '}
              <a href="mailto:happytohelp@louispolo.in">happytohelp@louispolo.in</a> or call{' '}
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
