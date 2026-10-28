import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import PageScene from "../components/PageScene";

export default function InsurancePage() {
  return (
    <>
      <div className="page-banner">
        <div className="container">
          <div className="page-banner-inner">
            <div className="breadcrumb"><a href="/">Home</a><span>›</span><span>Insurance</span></div>
            <h1>Insurance Services</h1>
            <p>Comprehensive protection plans for you, your family, and your business.</p>
          </div>
        </div>
      </div>

      <section className="section-pad light-bg">
        <div className="container">
          <div className="two-col">
            <div className="two-col-img">
              <PageScene theme="insurance" />
            </div>
            <div>
              <div className="section-label">Peace of Mind</div>
              <h2 className="section-title">Protect what matters most</h2>
              <p>Nexsus Bank partners with leading insurers to offer you a full range of insurance products — from life and health to home and business. Get competitive rates and manage all your policies in one place.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24, marginBottom: 28 }}>
                {["Life Insurance: term and whole life policies","Health Insurance: individual and family plans","Home & Contents Insurance — property protection","Auto Insurance — comprehensive coverage","Business Insurance — liability and property"].map((i) => (
                  <div key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: "var(--text-body)" }}>
                    <span style={{ color: "var(--green)", fontWeight: 700 }}>✓</span>{i}
                  </div>
                ))}
              </div>
              <Link to="/contact" className="btn btn-primary">Get a Quote</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="section-header">
            <div><div className="section-label">Coverage Types</div><h2 className="section-title">Insurance products we offer</h2></div>
          </div>
          <div className="feature-grid">
            {[
              { icon: "❤️", bg: "rgba(239,68,68,0.08)", title: "Life Insurance", desc: "Protect your family's financial future with term life, whole life, and universal life policies. Premiums from $18/month." },
              { icon: "🏠", bg: "rgba(29,78,216,0.08)", title: "Home Insurance", desc: "Cover your home and belongings against fire, theft, natural disasters, and liability. Rebuild with confidence." },
              { icon: "💼", bg: "rgba(245,158,11,0.08)", title: "Business Insurance", desc: "General liability, professional indemnity, and property insurance for businesses of every size." },
            ].map((c) => (
              <div className="feature-card" key={c.title}>
                <div className="feature-icon" style={{ background: c.bg }}>{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <Link to="/contact" style={{ color: "var(--blue)", fontSize: 13, fontWeight: 600 }}>Get a quote →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
