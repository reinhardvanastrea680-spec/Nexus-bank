import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import PageScene from "../components/PageScene";

export default function PersonalPage() {
  return (
    <>
      <div className="page-banner">
        <div className="container">
          <div className="page-banner-inner">
            <div className="breadcrumb"><a href="/">Home</a><span>›</span><span>Personal Banking</span></div>
            <h1>Personal Banking</h1>
            <p>Simple, secure, and rewarding banking designed around your everyday life.</p>
          </div>
        </div>
      </div>

      <section className="section-pad light-bg">
        <div className="container">
          <div className="two-col">
            <div className="two-col-img">
              <PageScene theme="personal" />
            </div>
            <div>
              <div className="section-label">Personal Accounts</div>
              <h2 className="section-title">Banking that fits your lifestyle</h2>
              <p>Whether you're saving for a home, managing day to day expenses, or building your future — Nexsus Bank has an account for every stage of your life. Enjoy 0% fees on transfers, instant mobile deposits, and 24/7 support.</p>
              <ul style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                {["Zero monthly maintenance fee on qualifying accounts","Unlimited free transfers between Nexsus Bank accounts","Real time transaction alerts and spending insights","Earn interest on your everyday balance","FDIC insured up to $250,000"].map((i) => (
                  <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "var(--text-body)" }}>
                    <span style={{ color: "var(--green)", fontWeight: 700, marginTop: 1 }}>✓</span>{i}
                  </li>
                ))}
              </ul>
              <Link to="/open-account" className="btn btn-primary">Open Personal Account</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label">Account Types</div>
              <h2 className="section-title">Choose the right account for you</h2>
            </div>
          </div>
          <div className="feature-grid">
            {[
              { icon: "💳", bg: "rgba(29,78,216,0.08)", title: "Nexsus Everyday Checking", desc: "Our flagship checking account — no monthly fees, unlimited transactions, and a free debit card. Access your money anywhere, anytime.", badge: "Most Popular" },
              { icon: "🏦", bg: "rgba(8,145,178,0.08)", title: "Nexsus High Yield Savings", desc: "Earn up to 4.75% APY on your savings. No minimum balance required. Watch your money grow automatically.", badge: "Best Rate" },
              { icon: "👨‍👩‍👧", bg: "rgba(245,158,11,0.08)", title: "Joint Account", desc: "Manage household finances together. Both account holders get full access, separate cards, and shared statements.", badge: "For Families" },
            ].map((c) => (
              <div className="feature-card" key={c.title} style={{ position: "relative" }}>
                {c.badge && <span className="badge badge-teal" style={{ position: "absolute", top: 16, right: 16 }}>{c.badge}</span>}
                <div className="feature-icon" style={{ background: c.bg }}>{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <Link to="/open-account" style={{ color: "var(--blue)", fontSize: 13, fontWeight: 600 }}>Apply now →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad dark-bg">
        <div className="container">
          <div className="cta-inner">
            <div>
              <div className="section-label">Get Started</div>
              <h2 className="cta-title">Open your account in under 10 minutes</h2>
              <p className="cta-desc">No branch visit needed. Fully digital, fully secure. Open your Nexsus Bank personal account today and start banking smarter.</p>
              <div className="cta-actions">
                <Link to="/open-account" className="btn btn-gold btn-lg">Open Account Now</Link>
                <Link to="/contact" className="btn btn-outline-white">Ask a Question</Link>
              </div>
            </div>
            <div className="cta-img">
              <img src="https://images.unsplash.com/photo-1580048915913-4f8f5cb481c4?auto=format&fit=crop&w=700&q=80" alt="Mobile Banking" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
