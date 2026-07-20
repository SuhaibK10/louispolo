import type { Metadata } from 'next'

export const metadata: Metadata = {
  title:       'Privacy Policy',
  description: 'How Louis Polo collects, uses, and protects your personal information.',
  alternates:  { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <div className="pt-16 md:pt-20">
      <div className="container-lp section-pad max-w-[52rem]">

        <span className="lp-eyebrow">Legal</span>
        <h1 className="lp-heading-lg mb-2">Privacy Policy</h1>
        <p className="font-body text-[var(--color-lp-muted)] text-sm mb-10">
          Last updated: June 2025
        </p>

        <div className="prose-lp">

          <section>
            <h2>1. Information We Collect</h2>
            <p>
              When you place an order or create an account, we collect your name, email address,
              phone number, and shipping address. We also collect payment information, which is
              processed securely by Razorpay and never stored on our servers.
            </p>
            <p>
              We may collect non-personally identifiable information such as browser type, pages
              visited, and referring URLs to help us improve the website experience.
            </p>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Process and fulfil your orders</li>
              <li>Send order confirmations and shipping updates</li>
              <li>Respond to customer service enquiries</li>
              <li>Send marketing communications (only if you opt in)</li>
              <li>Improve our website and product offerings</li>
            </ul>
          </section>

          <section>
            <h2>3. Sharing Your Information</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We share
              data only with:
            </p>
            <ul>
              <li>
                <strong>Logistics partners</strong>: to deliver your order (name, phone, address)
              </li>
              <li>
                <strong>Razorpay</strong>: to process payments securely
              </li>
              <li>
                <strong>Analytics tools</strong>: aggregated, anonymised data only
              </li>
            </ul>
          </section>

          <section>
            <h2>4. Data Security</h2>
            <p>
              We implement industry-standard security measures including HTTPS encryption, secure
              database access controls, and regular security audits. Payment card data is never
              stored on our systems. It is tokenised and handled entirely by Razorpay.
            </p>
          </section>

          <section>
            <h2>5. Cookies</h2>
            <p>
              We use cookies to maintain your session, remember your cart, and understand how
              visitors use our site. You can disable cookies in your browser settings, but some
              site features may not work correctly as a result.
            </p>
          </section>

          <section>
            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Opt out of marketing emails at any time</li>
            </ul>
            <p>
              To exercise any of these rights, email us at{' '}
              <a href="mailto:support@louispolo.in">support@louispolo.in</a>.
            </p>
          </section>

          <section>
            <h2>7. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this
              page with an updated date. Continued use of the website after changes are posted
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2>8. Contact</h2>
            <p>
              For any privacy-related questions, contact us at{' '}
              <a href="mailto:support@louispolo.in">support@louispolo.in</a> or write to:<br />
              Louis Polo, Mumbai, Maharashtra, India.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
