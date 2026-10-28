import { Link } from "@tanstack/react-router";
import PageScene from "../components/PageScene";

export default function CreditCardsPage() {
  return (
    <>
      <div className="page-banner">
        <div className="container">
          <div className="page-banner-inner">
            <div className="breadcrumb"><a href="/">Home</a><span>›</span><span>Credit Cards</span></div>
            <h1>Credit Cards</h1>
            <p>Earn more, pay less, and stay in control with Nexsus Bank credit cards.</p>
          </div>
        </div>
      </div>

      <section className="section-pad light-bg">
        <div className="container">
          <div className="two-col">
            <div>
              <div className="section-label">Smart Spending</div>
              <h2 className="section-title">Credit cards that reward your lifestyle</h2>
              <p>Nexsus Bank credit cards offer cashback, travel rewards, and purchase protection — with no annual fee on our entry level card. Manage your card, set spending limits, and freeze your card instantly via the app.</p>
              <ul style={{ display: "flex", flexDirection: "column", gap: 10, margin: "24px 0 28px" }}>
                {["Up to 3% cashback on everyday purchases","0% APR for first 12 months (intro offer)","Travel insurance and purchase protection included","Instant card freeze via mobile app","Apple Pay, Google Pay, and Samsung Pay compatible","No foreign transaction fees on premium cards"].map((i) => (
                  <li key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: "var(--text-body)" }}>
                    <span style={{ color: "var(--green)", fontWeight: 700 }}>✓</span>{i}
                  </li>
                ))}
              </ul>
              <Link to="/landing/open-account" className="btn btn-primary">Apply for a Card</Link>
            </div>
            <div className="two-col-img">
              <PageScene theme="cards" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="section-header"><div><div className="section-label">Our Cards</div><h2 className="section-title">Choose the perfect card</h2></div></div>
          <div className="feature-grid">
            {[
              { icon: "🌱", bg: "rgba(16,185,129,0.08)", title: "Nexsus Classic", desc: "No annual fee. 1% cashback on all purchases. Perfect for building credit or everyday spending.", badge: "No Fee" },
              { icon: "⭐", bg: "rgba(29,78,216,0.08)", title: "Nexsus Rewards+", desc: "2% cashback on groceries and fuel, 1% everywhere else. $95 annual fee with $200 sign up bonus.", badge: "Best Value" },
              { icon: "💎", bg: "rgba(245,158,11,0.08)", title: "Nexsus Platinum", desc: "3% cashback, airport lounge access, travel insurance, and concierge service. $395/year.", badge: "Premium" },
            ].map((c) => (
              <div className="feature-card" key={c.title} style={{ position: "relative" }}>
                <span className="badge badge-teal" style={{ position: "absolute", top: 16, right: 16 }}>{c.badge}</span>
                <div className="feature-icon" style={{ background: c.bg }}>{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <Link to="/landing/open-account" style={{ color: "var(--blue)", fontSize: 13, fontWeight: 600 }}>Apply now →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
