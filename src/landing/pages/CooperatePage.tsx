import { Link } from "@tanstack/react-router";
import PageScene from "../components/PageScene";

export default function CooperatePage() {
  return (
    <>
      <div className="page-banner">
        <div className="container">
          <div className="page-banner-inner">
            <div className="breadcrumb"><a href="/">Home</a><span>›</span><span>Business Banking</span></div>
            <h1>Business Banking</h1>
            <p>Power your business with smart banking solutions built for growth at every stage.</p>
          </div>
        </div>
      </div>

      <section className="section-pad light-bg">
        <div className="container">
          <div className="two-col">
            <div>
              <div className="section-label">Business Solutions</div>
              <h2 className="section-title">Banking that grows with your business</h2>
              <p>From solo entrepreneurs to established enterprises, Nexsus Bank provides the financial infrastructure to run your business with confidence. Access credit, manage payroll, and handle international payments — all in one platform.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24, marginBottom: 28 }}>
                {[
                  { icon: "🏢", label: "Business Checking" }, { icon: "💰", label: "Business Savings" },
                  { icon: "💳", label: "Corporate Cards" }, { icon: "🌍", label: "FX & Payments" },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", gap: 10, alignItems: "center", padding: "14px 16px", background: "var(--bg-white)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: 14, fontWeight: 600, color: "var(--text-dark)" }}>
                    <span style={{ fontSize: 20 }}>{item.icon}</span>{item.label}
                  </div>
                ))}
              </div>
              <Link to="/landing/open-account" className="btn btn-primary">Open Business Account</Link>
            </div>
            <div className="two-col-img">
              <PageScene theme="business" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label">Business Products</div>
              <h2 className="section-title">Everything your business needs</h2>
            </div>
          </div>
          <div className="feature-grid">
            {[
              { icon: "📊", bg: "rgba(29,78,216,0.08)", title: "Business Checking", desc: "Unlimited transactions, free incoming wires, and a dedicated relationship manager. No surprise fees." },
              { icon: "🚀", bg: "rgba(16,185,129,0.08)", title: "Merchant Services", desc: "Accept payments online and in store. Point of sale solutions, invoicing, and next day settlement." },
              { icon: "🌐", bg: "rgba(245,158,11,0.08)", title: "International Payments", desc: "Send and receive funds in 40+ currencies at mid market rates. Same day international transfers available." },
            ].map((c) => (
              <div className="feature-card" key={c.title}>
                <div className="feature-icon" style={{ background: c.bg }}>{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
