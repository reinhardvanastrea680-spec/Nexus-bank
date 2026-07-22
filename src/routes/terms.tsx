import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, FileText } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service - Nexsus Bank" },
      { name: "description", content: "Nexsus Bank Terms of Service — the rules and guidelines governing your use of our banking platform." },
    ],
  }),
  component: TermsPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-white mb-3 border-b border-white/10 pb-2">{title}</h2>
      <div className="text-sm leading-relaxed space-y-3 text-gray-300">{children}</div>
    </section>
  );
}

function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full" style={{ background: "#0A0F1E" }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-5 pt-10 pb-4 flex items-center gap-3" style={{ background: "#0A0F1E", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={() => navigate({ to: "/login" })} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={22} />
        </button>
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-violet-400" />
          <h1 className="text-lg font-bold text-white">Terms of Service</h1>
        </div>
      </div>

      <div className="px-5 py-6 max-w-2xl mx-auto">
        {/* Intro */}
        <div className="mb-8 p-4 rounded-xl" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
          <p className="text-sm text-violet-300 leading-relaxed">
            Please read these Terms of Service carefully before using the Nexsus Bank digital banking platform.
            By accessing or using our services, you agree to be bound by these terms.
            <strong> Last updated: July 2026.</strong>
          </p>
        </div>

        <Section title="1. Acceptance of Terms">
          <p>
            By creating an account, accessing, or using Nexsus Bank's digital banking services ("Services"), you confirm that
            you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
            If you do not agree to these terms, you must not use our Services.
          </p>
          <p>
            These terms constitute a legally binding agreement between you ("User," "you," or "your") and
            Nexsus Bank ("Company," "we," "us," or "our").
          </p>
        </Section>

        <Section title="2. Eligibility">
          <p>To use our Services, you must:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Be at least 18 years of age</li>
            <li>Have the legal capacity to enter into binding contracts</li>
            <li>Not be prohibited from receiving services under applicable law</li>
            <li>Provide accurate, complete, and current registration information</li>
            <li>Maintain the security of your account credentials</li>
          </ul>
        </Section>

        <Section title="3. Account Registration & Security">
          <p>
            When you open an account with Nexsus Bank, you agree to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provide truthful, accurate, and complete information during registration</li>
            <li>Maintain and promptly update your account information to keep it accurate</li>
            <li>Keep your password and transaction PIN strictly confidential</li>
            <li>Notify us immediately of any unauthorized use of your account or security breach</li>
            <li>Accept responsibility for all activities that occur under your account</li>
          </ul>
          <p>
            We reserve the right to suspend or terminate accounts that we believe have been compromised, are being used fraudulently,
            or are in violation of these terms.
          </p>
        </Section>

        <Section title="4. Banking Services">
          <p>Nexsus Bank provides the following digital banking services:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Checking and savings account management</li>
            <li>Fund transfers — internal, local, and wire transfers</li>
            <li>Transaction history and account statements</li>
            <li>Bill payments and crypto-related services</li>
            <li>Customer support via live chat</li>
          </ul>
          <p>
            We reserve the right to modify, suspend, or discontinue any service at any time with reasonable notice.
            We are not liable for any modification, suspension, or discontinuation of services.
          </p>
        </Section>

        <Section title="5. Fees & Charges">
          <p>
            Nexsus Bank may charge fees for certain services. All applicable fees will be disclosed to you prior to
            completing a transaction. By proceeding with a transaction, you authorize the deduction of any applicable fees
            from your account. Fee schedules are available upon request and may be updated from time to time with prior notice.
          </p>
        </Section>

        <Section title="6. Prohibited Activities">
          <p>You agree not to use our Services for any of the following:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Any unlawful, fraudulent, or deceptive purpose</li>
            <li>Money laundering, terrorist financing, or other illegal financial activities</li>
            <li>Attempting to gain unauthorized access to our systems or other users' accounts</li>
            <li>Transmitting malware, viruses, or other harmful code</li>
            <li>Violating any applicable local, national, or international law or regulation</li>
            <li>Engaging in transactions that violate sanctions or export control laws</li>
          </ul>
          <p>Violations may result in immediate account termination and referral to appropriate authorities.</p>
        </Section>

        <Section title="7. Limitation of Liability">
          <p>
            To the maximum extent permitted by applicable law, Nexsus Bank shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages arising from your use of or inability to use our Services,
            including but not limited to loss of profits, data, or goodwill.
          </p>
          <p>
            Our total liability for any claim arising out of or relating to these terms or our Services shall not exceed
            the total amount of fees paid by you to us in the twelve (12) months preceding the claim.
          </p>
        </Section>

        <Section title="8. Intellectual Property">
          <p>
            All content, features, and functionality of our platform — including but not limited to text, graphics, logos,
            button icons, software, and the compilation thereof — are the exclusive property of Nexsus Bank and are
            protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative
            works without our express written permission.
          </p>
        </Section>

        <Section title="9. Termination">
          <p>
            We reserve the right to terminate or suspend your account and access to our Services immediately, without prior
            notice, for conduct that we determine at our sole discretion violates these Terms or is harmful to other users,
            us, third parties, or for any other reason.
          </p>
          <p>
            Upon termination, your right to use the Services will immediately cease. Provisions of these Terms that by their
            nature should survive termination shall survive, including but not limited to ownership provisions, warranty
            disclaimers, indemnity, and limitation of liability.
          </p>
        </Section>

        <Section title="10. Governing Law">
          <p>
            These Terms shall be governed by and construed in accordance with applicable law. Any disputes arising under or
            in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts.
            If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
          </p>
        </Section>

        <Section title="11. Changes to Terms">
          <p>
            We reserve the right to modify these Terms at any time. We will provide notice of significant changes by updating
            the effective date at the top of this page and, where appropriate, by sending you an email notification.
            Your continued use of our Services after any changes constitutes your acceptance of the new Terms.
          </p>
        </Section>

        <Section title="12. Contact Us">
          <p>For questions about these Terms of Service, please contact us:</p>
          <div className="mt-3 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-white font-semibold">Nexsus Bank — Legal Department</p>
            <p className="mt-1">Email: <a href="mailto:legal@nexsus-co.com" className="text-violet-400 underline">legal@nexsus-co.com</a></p>
            <p>Website: <a href="https://nexsus-co.com" className="text-violet-400 underline">nexsus-co.com</a></p>
            <p>Support: <a href="https://nexsus-co.com/contact" className="text-violet-400 underline">nexsus-co.com/contact</a></p>
          </div>
        </Section>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} Nexsus Bank. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="/privacy" className="text-xs text-cyan-500 hover:underline">Privacy Policy</a>
            <a href="/terms" className="text-xs text-violet-400 hover:underline">Terms of Service</a>
            <a href="https://nexsus-co.com/contact" className="text-xs text-cyan-500 hover:underline">Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  );
}
