import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import PageScene from "../components/PageScene";

export default function BusinessLoansPage() {
  return (
    <>
      <div className="page-banner">
        <div className="container">
          <div className="page-banner-inner">
            <div className="breadcrumb"><a href="/">Home</a><span>›</span><span>Business Loans</span></div>
            <h1>Business Loans</h1>
            <p>Fast, flexible funding to fuel your business growth at every stage.</p>
          </div>
        </div>
      </div>

      <section className="section-pad light-bg">
        <div className="container">
          <div className="two-col">
            <div className="two-col-img">
              <PageScene theme="loans" />
            </div>
            <div>
              <div className="section-label">Business Funding</div>
              <h2 className="section-title">The capital you need to grow</h2>
              <p>From startup loans to expansion financing, Nexsus Bank provides tailored lending solutions with competitive rates. Apply online in 10 minutes — get a decision in 24 hours.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "24px 0 28px" }}>
                {[
                  { label: "$10k to $5M", sub: "Loan amount range" },
                  { label: "From 6.9%", sub: "Starting APR" },
                  { label: "24 hrs", sub: "Decision time" },
                  { label: "1 to 10 yr", sub: "Flexible terms" },
                ].map((s) => (
                  <div key={s.label} style={{ padding: "16px", background: "var(--bg-white)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "var(--blue)", fontFamily: "var(--font-head)" }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{s.sub}</div>
                  </div>
                ))}
              </div>
              <Link to="/contact" className="btn btn-primary">Apply for a Loan</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="section-header"><div><div className="section-label">Loan Products</div><h2 className="section-title">Funding solutions for every need</h2></div></div>
          <div className="feature-grid">
            {[
              { icon: "💼", bg: "rgba(29,78,216,0.08)", title: "Term Loans", desc: "Lump-sum financing for equipment, expansion, or acquisitions. Fixed monthly payments and transparent rates." },
              { icon: "🔄", bg: "rgba(8,145,178,0.08)", title: "Business Line of Credit", desc: "Draw funds when you need them. Only pay interest on what you use. Perfect for managing cash flow." },
              { icon: "⚡", bg: "rgba(245,158,11,0.08)", title: "SBA Loans", desc: "government backed loans with lower down payments and extended repayment terms. We're a Preferred SBA Lender." },
            ].map((c) => (
              <div className="feature-card" key={c.title}>
                <div className="feature-icon" style={{ background: c.bg }}>{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <Link to="/contact" style={{ color: "var(--blue)", fontSize: 13, fontWeight: 600 }}>Learn more →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
