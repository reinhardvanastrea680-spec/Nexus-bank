import { Link } from "@tanstack/react-router";
import PageScene from "../components/PageScene";

export default function MortgagesPage() {
  return (
    <>
      <div className="page-banner">
        <div className="container">
          <div className="page-banner-inner">
            <div className="breadcrumb"><a href="/">Home</a><span>›</span><span>Mortgages</span></div>
            <h1>Mortgage Plans</h1>
            <p>Competitive rates and expert guidance to help you achieve home ownership.</p>
          </div>
        </div>
      </div>

      <section className="section-pad light-bg">
        <div className="container">
          <div className="two-col">
            <div>
              <div className="section-label">Home Ownership</div>
              <h2 className="section-title">Your dream home starts here</h2>
              <p>Nexsus Bank offers a range of mortgage products designed to fit every buyer — from first time homeowners to seasoned investors. Our mortgage specialists guide you from pre approval to closing.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "24px 0 28px" }}>
                {[
                  { label: "From 3.5% APR", sub: "Fixed 30 year rate" },
                  { label: "5% Down", sub: "Minimum deposit" },
                  { label: "$50k to $2M", sub: "Loan range" },
                  { label: "30 day", sub: "Average closing time" },
                ].map((s) => (
                  <div key={s.label} style={{ padding: "16px", background: "var(--bg-white)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "var(--blue)", fontFamily: "var(--font-head)" }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{s.sub}</div>
                  </div>
                ))}
              </div>
              <Link to="/landing/contact" className="btn btn-primary">Get Pre Approved</Link>
            </div>
            <div className="two-col-img">
              <PageScene theme="mortgage" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="section-header"><div><div className="section-label">Mortgage Types</div><h2 className="section-title">Find the right mortgage for you</h2></div></div>
          <div className="feature-grid">
            {[
              { icon: "🏡", bg: "rgba(16,185,129,0.08)", title: "Fixed Rate Mortgage", desc: "Lock in your rate for 10, 15, 20, or 30 years. Predictable monthly payments that never change — ideal for long term homeowners." },
              { icon: "📉", bg: "rgba(29,78,216,0.08)", title: "Adjustable Rate (ARM)", desc: "Start with a low introductory rate that adjusts periodically. Great if you plan to sell or refinance within 5 to 7 years." },
              { icon: "✨", bg: "rgba(245,158,11,0.08)", title: "first time Buyer", desc: "Specially designed for first time buyers — reduced down payment requirements, government backed options, and free guidance." },
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
