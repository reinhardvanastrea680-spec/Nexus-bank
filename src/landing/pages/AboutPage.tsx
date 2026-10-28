import { Link } from "@tanstack/react-router";
import PageScene from "../components/PageScene";

export default function AboutPage() {
  return (
    <>
      <div className="page-banner">
        <div className="container">
          <div className="page-banner-inner">
            <div className="breadcrumb"><a href="/">Home</a><span>›</span><span>About Us</span></div>
            <h1>About Nexsus Bank</h1>
            <p>Two decades of trusted banking, built on transparency, technology, and community.</p>
          </div>
        </div>
      </div>

      <section className="section-pad light-bg">
        <div className="container">
          <div className="two-col">
            <div>
              <div className="section-label">Our Story</div>
              <h2 className="section-title">Banking with purpose since 2005</h2>
              <p>Nexsus Bank was founded in Charlotte, North Carolina in 2005 with a single mission: to make exceptional banking accessible to everyone. What began as a community bank serving local residents has grown into a nationwide digital institution serving over 13 million customers.</p>
              <p>We believe banking should be transparent, fair, and empowering. That's why we've built our platform around the customer — no hidden fees, no confusing terms, and no gatekeeping. Whether you're a first time account holder or a seasoned investor, Nexsus Bank treats every customer as a valued partner.</p>
              <div style={{ display: "flex", gap: 32, marginTop: 28 }}>
                {[{ val: "2005", label: "Founded" }, { val: "13M+", label: "Customers" }, { val: "50+", label: "US States" }].map((s) => (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-head)", fontSize: 36, fontWeight: 800, color: "var(--blue)" }}>{s.val}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="two-col-img">
              <PageScene theme="about" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="section-header"><div><div className="section-label">Our Values</div><h2 className="section-title">What we stand for</h2></div></div>
          <div className="feature-grid">
            {[
              { icon: "🤝", bg: "rgba(29,78,216,0.08)", title: "Trust & Transparency", desc: "No hidden fees, no confusing small print. We tell you exactly what you're getting and why it costs what it does." },
              { icon: "💡", bg: "rgba(245,158,11,0.08)", title: "Innovation First", desc: "We invest heavily in technology to make banking faster, smarter, and more intuitive — for every customer, every day." },
              { icon: "🌍", bg: "rgba(16,185,129,0.08)", title: "Community Impact", desc: "We reinvest in the communities we serve through grants, financial education programs, and local business support." },
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

      <section className="section-pad dark-bg">
        <div className="container" style={{ textAlign: "center" }}>
          <div className="section-label">Join Us</div>
          <h2 className="section-title">Ready to experience better banking?</h2>
          <p className="section-subtitle" style={{ margin: "0 auto 28px", textAlign: "center" }}>Open your account today and join 13 million people who trust Nexsus Bank with their financial future.</p>
          <Link to="/open-account" className="btn btn-gold btn-lg">Open Your Account</Link>
        </div>
      </section>
    </>
  );
}
