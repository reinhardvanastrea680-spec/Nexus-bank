export default function PrivacyPolicyPage() {
  return (
    <section className="section-pad light-bg" style={{ minHeight: "80vh" }}>
      <div className="container" style={{ maxWidth: 800 }}>

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="section-label">Legal</div>
          <h1 className="section-title">Privacy Policy</h1>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Last updated: July 2026
          </p>
        </div>

        <div style={{
          background: "#fff",
          borderRadius: 20,
          padding: "48px 48px",
          boxShadow: "0 4px 32px rgba(0,0,0,0.07)",
          border: "1px solid rgba(0,0,0,0.06)",
          lineHeight: 1.8,
          color: "var(--text-body)",
        }}>

          {[
            {
              title: "1. Introduction",
              body: `Nexsus Bank ("we", "our", or "us") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our banking services. By accessing our services, you agree to the terms of this Privacy Policy.`,
            },
            {
              title: "2. Information We Collect",
              body: `We may collect the following types of information:

• Personal Identification Information: Full name, date of birth, nationality, government-issued ID details.
• Contact Information: Email address, phone number, mailing address.
• Financial Information: Account numbers, transaction history, balance information.
• Technical Information: IP address, browser type, device information, cookies and usage data.
• Communication Records: Messages sent through our support channels.`,
            },
            {
              title: "3. How We Use Your Information",
              body: `We use the information we collect to:

• Provide, operate, and maintain our banking services.
• Process transactions and send related notices.
• Verify your identity and prevent fraud.
• Respond to customer service requests and support needs.
• Send administrative information such as security alerts and policy updates.
• Comply with legal obligations and regulatory requirements.
• Improve and personalise your experience with our platform.`,
            },
            {
              title: "4. How We Share Your Information",
              body: `We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:

• With trusted service providers who assist us in operating our platform, subject to confidentiality agreements.
• When required by law, regulation, or legal process.
• To protect the rights, property, or safety of Nexsus Bank, our customers, or others.
• With your explicit consent.`,
            },
            {
              title: "5. Data Security",
              body: `We implement industry-standard security measures to protect your personal information, including 256-bit SSL encryption, multi-factor authentication, and regular security audits. While we strive to protect your data, no method of transmission over the internet is 100% secure. We encourage you to use strong passwords and keep your login credentials confidential.`,
            },
            {
              title: "6. Cookies and Tracking",
              body: `We use cookies and similar tracking technologies to enhance your browsing experience, analyse site traffic, and understand user behaviour. You may choose to disable cookies through your browser settings, though some features of our website may not function properly as a result.`,
            },
            {
              title: "7. Data Retention",
              body: `We retain your personal information for as long as necessary to fulfil the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When your data is no longer needed, we will securely delete or anonymise it.`,
            },
            {
              title: "8. Your Rights",
              body: `Depending on your location, you may have the following rights regarding your personal data:

• The right to access the personal information we hold about you.
• The right to request correction of inaccurate information.
• The right to request deletion of your personal data.
• The right to object to or restrict processing of your data.
• The right to data portability.

To exercise any of these rights, please contact our support team.`,
            },
            {
              title: "9. Third Party Links",
              body: `Our website may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to read their respective privacy policies before providing any personal information.`,
            },
            {
              title: "10. Children's Privacy",
              body: `Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from minors. If you believe we have inadvertently collected such information, please contact us immediately and we will take steps to delete it.`,
            },
            {
              title: "11. Changes to This Policy",
              body: `We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the updated policy on this page with a revised date. We encourage you to review this policy periodically to stay informed about how we protect your information.`,
            },
            {
              title: "12. Contact Us",
              body: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our support team through the Contact page on our website. We are committed to resolving any concerns promptly and transparently.`,
            },
          ].map((section) => (
            <div key={section.title} style={{ marginBottom: 36 }}>
              <h2 style={{
                fontSize: 17,
                fontWeight: 700,
                color: "var(--text-dark)",
                marginBottom: 10,
                fontFamily: "var(--font-head)",
              }}>
                {section.title}
              </h2>
              <p style={{ fontSize: 14.5, whiteSpace: "pre-line", margin: 0 }}>
                {section.body}
              </p>
            </div>
          ))}

          <div style={{
            marginTop: 40,
            paddingTop: 28,
            borderTop: "1px solid var(--border)",
            textAlign: "center",
            fontSize: 13,
            color: "var(--text-muted)",
          }}>
            🔒 Nexsus Bank · FDIC Insured · 256-bit SSL Encrypted
          </div>
        </div>
      </div>
    </section>
  );
}
