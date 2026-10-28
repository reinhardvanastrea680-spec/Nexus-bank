import { Link } from "@tanstack/react-router";

export default function AccountPending() {
  // Prevent search engines from indexing or following links on this page
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  const [ref] = useState(() => `NXB-${Date.now().toString(36).toUpperCase().slice(-6)}`);
  const [dots, setDots] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => setDots((d) => (d % 3) + 1), 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section-pad light-bg" style={{ minHeight: "70vh" }}>
      <div className="container" style={{ maxWidth: 560 }}>
        <div className="pending-card">
          <div className="pending-icon">⏳</div>
          <h2>Application Received!</h2>
          <p style={{ color: "var(--text-muted)", fontSize: 13, fontWeight: 600, letterSpacing: 1 }}>
            Reference: {ref}
          </p>
          <p style={{ marginTop: 16 }}>
            Thank you for applying to open a Nexsus Bank account. Your application is now being reviewed by our team.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--bg-light)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "16px 20px", margin: "24px 0", justifyContent: "center" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(29,78,216,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🔍</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-dark)" }}>
                Verifying your information{"·".repeat(dots)}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>This typically takes 1–3 business days</div>
            </div>
          </div>

          <div style={{ background: "var(--bg-light)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "24px", marginBottom: 24, textAlign: "left" }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-dark)", marginBottom: 14 }}>What happens next?</h4>
            {[
              { step: "1", label: "Identity Verification", desc: "We verify your government issued ID and personal details (1–2 days)" },
              { step: "2", label: "Account Activation", desc: "Your account is created and assigned a unique account number" },
              { step: "3", label: "Credentials Delivery", desc: "Your login username and temporary password are sent to your email" },
              { step: "4", label: "Start Banking", desc: "Log in, set your permanent password, and begin using your account" },
            ].map((item) => (
              <div key={item.step} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--blue)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{item.step}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-dark)" }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "var(--text-body)" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Questions? <Link to="/contact" style={{ color: "var(--blue)", fontWeight: 600 }}>Contact our support team</Link>
          </p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 16, display: "inline-flex" }}>← Back to Home</Link>
        </div>
      </div>
    </section>
  );
}
