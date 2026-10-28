import { useEffect } from "react";
import { Link } from "@tanstack/react-router";

export default function OpenAccount() {
  // Prevent search engines from indexing or following links on this page
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  return (
    <section className="section-pad light-bg" style={{ minHeight: "80vh" }}>
      <div className="container" style={{ maxWidth: 560 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="section-label">New Account</div>
          <h1 className="section-title">Open Your Nexsus Bank Account</h1>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: "48px 40px",
            textAlign: "center",
            boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #1240A0, #38BDF8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <span style={{ fontSize: 32 }}>🏦</span>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-dark)", marginBottom: 12 }}>
            Account Opening is Handled by Our Team
          </h2>

          <p style={{ fontSize: 15, color: "var(--text-body)", lineHeight: 1.7, marginBottom: 32, maxWidth: 400, margin: "0 auto 32px" }}>
            To open a Nexsus Bank account, please contact our support team. A dedicated representative will guide you through the process securely and personally.
          </p>

          <Link to="/contact" className="btn btn-primary btn-lg" style={{ display: "inline-block" }}>
            Contact Support
          </Link>

          <p style={{ marginTop: 20, fontSize: 13, color: "var(--text-muted)" }}>
            Our team typically responds within 1 business day.
          </p>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginTop: 24 }}>
          🔒 256-bit SSL Encrypted · FDIC Member · Your data is never sold or shared
        </p>
      </div>
    </section>
  );
}
