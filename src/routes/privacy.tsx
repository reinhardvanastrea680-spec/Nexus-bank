import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Shield } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy - Nexsus Bank" },
      { name: "description", content: "Nexsus Bank Privacy Policy — how we collect, use, and protect your personal information." },
    ],
  }),
  component: PrivacyPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-white mb-3 border-b border-white/10 pb-2">{title}</h2>
      <div className="text-sm leading-relaxed space-y-3 text-gray-300">{children}</div>
    </section>
  );
}

function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full" style={{ background: "#0A0F1E" }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-5 pt-10 pb-4 flex items-center gap-3" style={{ background: "#0A0F1E", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={() => navigate({ to: "/login" })} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={22} />
        </button>
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-cyan-400" />
          <h1 className="text-lg font-bold text-white">Privacy Policy</h1>
        </div>
      </div>

      <div className="px-5 py-6 max-w-2xl mx-auto">
        {/* Intro */}
        <div className="mb-8 p-4 rounded-xl" style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)" }}>
          <p className="text-sm text-cyan-300 leading-relaxed">
            <strong>Nexsus Bank</strong> is committed to protecting your privacy. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you use our digital banking platform.
            Please read it carefully. <strong>Last updated: July 2026.</strong>
          </p>
        </div>

        <Section title="1. Information We Collect">
          <p>We collect information you provide directly to us when you open an account or use our services, including:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Full legal name, date of birth, and government-issued identification details</li>
            <li>Contact information — email address, phone number, and mailing address</li>
            <li>Financial information — account numbers, transaction history, and balance information</li>
            <li>Login credentials — username and encrypted password</li>
            <li>Device and usage data — IP address, browser type, operating system, and pages visited</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Open, maintain, and service your bank accounts</li>
            <li>Process transactions and send related notices</li>
            <li>Verify your identity and prevent fraud</li>
            <li>Comply with applicable laws, regulations, and legal obligations</li>
            <li>Send account-related communications such as statements and alerts</li>
            <li>Improve our products and services</li>
            <li>Respond to your comments, questions, and customer service requests</li>
          </ul>
        </Section>

        <Section title="3. How We Share Your Information">
          <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Service Providers:</strong> Third parties that perform services on our behalf, such as payment processors and technology providers, under strict confidentiality agreements</li>
            <li><strong>Legal Authorities:</strong> When required by law, court order, or governmental authority</li>
            <li><strong>Fraud Prevention:</strong> To protect against fraud, unauthorized transactions, and other illegal activity</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, with prior notice to you</li>
          </ul>
        </Section>

        <Section title="4. Data Security">
          <p>
            We implement industry-standard technical and organizational measures to protect your personal information against
            unauthorized access, alteration, disclosure, or destruction. These include:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>256-bit SSL/TLS encryption for all data in transit</li>
            <li>Encrypted storage of sensitive data at rest</li>
            <li>Multi-factor authentication and session management controls</li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>Restricted employee access on a need-to-know basis</li>
          </ul>
          <p>
            While we strive to protect your data, no method of transmission over the internet is 100% secure.
            You are responsible for keeping your login credentials confidential.
          </p>
        </Section>

        <Section title="5. Cookies & Tracking Technologies">
          <p>
            We use cookies and similar tracking technologies to enhance your experience on our platform. These are used to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Keep you logged in across sessions (authentication cookies)</li>
            <li>Remember your preferences such as theme settings</li>
            <li>Analyze usage patterns to improve our services</li>
          </ul>
          <p>You can control cookie settings through your browser, though disabling certain cookies may affect functionality.</p>
        </Section>

        <Section title="6. Data Retention">
          <p>
            We retain your personal information for as long as your account is active or as needed to provide services,
            comply with our legal obligations, resolve disputes, and enforce our agreements. Account records are typically
            retained for a minimum of seven (7) years following account closure, as required by financial regulations.
          </p>
        </Section>

        <Section title="7. Your Rights">
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate or incomplete data</li>
            <li>Request deletion of your personal data, subject to legal retention requirements</li>
            <li>Withdraw consent where processing is based on consent</li>
            <li>Lodge a complaint with a supervisory authority</li>
          </ul>
          <p>To exercise any of these rights, contact us at the details below.</p>
        </Section>

        <Section title="8. Children's Privacy">
          <p>
            Our services are not directed to individuals under the age of 18. We do not knowingly collect personal
            information from minors. If we become aware that a minor has provided us with personal information,
            we will take steps to delete that information promptly.
          </p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting
            the new policy on this page with an updated effective date. We encourage you to review this policy periodically.
          </p>
        </Section>

        <Section title="10. Contact Us">
          <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
          <div className="mt-3 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-white font-semibold">Nexsus Bank — Privacy Office</p>
            <p className="mt-1">Email: <a href="mailto:privacy@nexsus-co.com" className="text-cyan-400 underline">privacy@nexsus-co.com</a></p>
            <p>Website: <a href="https://nexsus-co.com" className="text-cyan-400 underline">nexsus-co.com</a></p>
            <p>Support: <a href="https://nexsus-co.com/contact" className="text-cyan-400 underline">nexsus-co.com/contact</a></p>
          </div>
        </Section>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} Nexsus Bank. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="/privacy" className="text-xs text-cyan-500 hover:underline">Privacy Policy</a>
            <a href="/terms" className="text-xs text-cyan-500 hover:underline">Terms of Service</a>
            <a href="https://nexsus-co.com/contact" className="text-xs text-cyan-500 hover:underline">Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  );
}
