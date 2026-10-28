import { Link } from "@tanstack/react-router";
import PageScene from "../components/PageScene";

export default function SavingsPage() {
  return (
    <>
      <div className="page-banner">
        <div className="container">
          <div className="page-banner-inner">
            <div className="breadcrumb"><a href="/">Home</a><span>›</span><span>Savings</span></div>
            <h1>Nexsus Savings</h1>
            <p>Industry leading interest rates to help your money grow faster.</p>
          </div>
        </div>
      </div>

      <section className="section-pad light-bg">
        <div className="container">
          <div className="two-col">
            <div className="two-col-img">
              <PageScene theme="savings" />
            </div>
            <div>
              <div className="section-label">Grow Your Wealth</div>
              <h2 className="section-title">Make your money work harder for you</h2>
              <p>Nexsus Bank offers some of the highest savings rates in the country. Whether you're building an emergency fund, saving for a major purchase, or growing long term wealth — we have a savings account for you.</p>
              <div style={{ background: "var(--bg-white)", border: "2px solid var(--blue)", borderRadius: "var(--radius-lg)", padding: "24px", margin: "24px 0 28px" }}>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>Current High Yield Savings Rate</div>
                <div style={{ fontFamily: "var(--font-head)", fontSize: 48, fontWeight: 800, color: "var(--blue)", lineHeight: 1 }}>4.75% <span style={{ fontSize: 18, color: "var(--text-muted)" }}>APY</span></div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>Rate as of June 2025 · No minimum balance required · FDIC Insured</div>
              </div>
              <Link to="/open-account" className="btn btn-primary">Open Savings Account</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="section-header"><div><div className="section-label">Savings Products</div><h2 className="section-title">Choose your savings goal</h2></div></div>
          <div className="feature-grid">
            {[
              { icon: "📈", bg: "rgba(29,78,216,0.08)", title: "High Yield Savings", desc: "Earn 4.75% APY with no minimum balance. Instant access to your funds anytime. Perfect for emergency funds and short term goals." },
              { icon: "🎯", bg: "rgba(16,185,129,0.08)", title: "Goal Savings Account", desc: "Set a savings goal and automate your contributions. Track your progress in Real time. Great for vacations, weddings, or a new car." },
              { icon: "📅", bg: "rgba(245,158,11,0.08)", title: "Fixed Term Deposit", desc: "Lock in a guaranteed rate for 3, 6, 12, or 24 months. Earn up to 5.25% APY. Ideal for funds you won't need immediately." },
            ].map((c) => (
              <div className="feature-card" key={c.title}>
                <div className="feature-icon" style={{ background: c.bg }}>{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <Link to="/open-account" style={{ color: "var(--blue)", fontSize: 13, fontWeight: 600 }}>Open account →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
