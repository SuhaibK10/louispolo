import type { Metadata } from 'next'

export const metadata: Metadata = {
  title:       'Terms of Use — Louis Polo',
  description: 'Terms and conditions for using the Louis Polo website and purchasing our products.',
}

export default function TermsPage() {
  return (
    <div className="pt-16 md:pt-[4.5rem]">
      <div className="container-lp section-pad max-w-[52rem]">

        <span className="lp-eyebrow">Legal</span>
        <h1 className="lp-heading-lg mb-2">Terms of Use</h1>
        <p className="font-body text-[var(--color-lp-muted)] text-sm mb-10">
          Last updated: June 2025
        </p>

        <div className="prose-lp">

          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Louis Polo website (louispolo.in) and placing orders, you
              agree to be bound by these Terms of Use. If you do not agree, please do not use our
              website.
            </p>
          </section>

          <section>
            <h2>2. Use of the Website</h2>
            <p>You agree to use this website only for lawful purposes. You must not:</p>
            <ul>
              <li>Use the site in any way that violates applicable laws or regulations</li>
              <li>Attempt to gain unauthorised access to any part of the website or its servers</li>
              <li>Reproduce, duplicate, or resell any part of our website without permission</li>
              <li>Submit false or misleading information during checkout</li>
            </ul>
          </section>

          <section>
            <h2>3. Product Information</h2>
            <p>
              We make every effort to display product colours, dimensions, and descriptions
              accurately. However, actual colours may vary slightly depending on your screen. We
              reserve the right to correct errors and to update product information at any time
              without prior notice.
            </p>
          </section>

          <section>
            <h2>4. Pricing and Availability</h2>
            <p>
              All prices are listed in Indian Rupees (INR) and include applicable taxes unless
              stated otherwise. We reserve the right to change prices without notice. Products are
              subject to availability and we reserve the right to limit quantities or decline
              orders at our discretion.
            </p>
          </section>

          <section>
            <h2>5. Orders and Payment</h2>
            <p>
              By placing an order, you confirm that all information provided is accurate. We
              reserve the right to cancel any order in the event of pricing errors, suspected
              fraud, or stock unavailability. Payments are processed securely via Razorpay. Louis
              Polo does not store your card details.
            </p>
          </section>

          <section>
            <h2>6. Shipping</h2>
            <p>
              Delivery timelines are estimates and not guaranteed. Louis Polo is not responsible
              for delays caused by courier partners, customs, or events outside our reasonable
              control. Risk of loss passes to you upon dispatch.
            </p>
          </section>

          <section>
            <h2>7. Intellectual Property</h2>
            <p>
              All content on this website — including text, images, logos, and design — is owned
              by or licensed to Louis Polo. You may not reproduce, distribute, or create
              derivative works without our written permission.
            </p>
          </section>

          <section>
            <h2>8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Louis Polo shall not be liable for any
              indirect, incidental, or consequential damages arising from your use of the website
              or products. Our total liability shall not exceed the amount paid for the specific
              product giving rise to the claim.
            </p>
          </section>

          <section>
            <h2>9. Governing Law</h2>
            <p>
              These Terms are governed by the laws of India. Any disputes shall be subject to the
              exclusive jurisdiction of the courts in Mumbai, Maharashtra.
            </p>
          </section>

          <section>
            <h2>10. Changes to These Terms</h2>
            <p>
              We may revise these Terms at any time. Changes take effect immediately upon posting.
              Your continued use of the website constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2>11. Contact</h2>
            <p>
              For any questions regarding these Terms, contact us at{' '}
              <a href="mailto:support@louispolo.in">support@louispolo.in</a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
