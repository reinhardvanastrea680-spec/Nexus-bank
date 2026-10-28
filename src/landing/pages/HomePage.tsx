import { useState } from "react";
import { Link } from "@tanstack/react-router";
import HeroCanvas from "../components/HeroCanvas";
import HeroScene from "../components/HeroScene";

const UNSPLASH = "https://images.unsplash.com";

const tickerItems = [
  "Personal Banking", "Business Accounts", "Mortgages", "Credit Cards",
  "Investment Services", "Online Banking", "Insurance", "Business Loans",
  "Offshore Savings", "Mobile App", "Secure Transfers", "24/7 Support",
];

const tabs = [
  {
    id: "financial",
    label: "Financial Planning",
    desc: "Our financial planning team helps you achieve your short and long term goals with personalised strategies built around your unique situation.",
    items: [
      { icon: "📊", title: "Portfolio Management", desc: "Smart asset allocation across stocks, bonds, and real estate" },
      { icon: "🔐", title: "Retirement Planning", desc: "Maximize your pension and social security benefits" },
      { icon: "💼", title: "Wealth Building", desc: "Structured savings and investment programs" },
    ],
    image: `${UNSPLASH}/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=700&q=80`,
  },
  {
    id: "business",
    label: "Business Banking",
    desc: "From startup to enterprise, our business banking solutions are designed to help you grow, manage cash flow, and access capital when you need it.",
    items: [
      { icon: "🏢", title: "Business Checking", desc: "Zero fee business accounts with unlimited transactions" },
      { icon: "💳", title: "Corporate Cards", desc: "Business credit cards with expense management tools" },
      { icon: "🚀", title: "Growth Financing", desc: "Lines of credit and term loans for expansion" },
    ],
    image: `${UNSPLASH}/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=700&q=80`,
  },
  {
    id: "digital",
    label: "Digital Banking",
    desc: "Our mobile platform gives you complete control of your finances, anywhere, anytime, with bank grade security and an intuitive interface.",
    items: [
      { icon: "📱", title: "Mobile App", desc: "iOS and Android app with full account management" },
      { icon: "⚡", title: "Instant Transfers", desc: "Send money in seconds with Zelle® integration" },
      { icon: "🔔", title: "Smart Alerts", desc: "Real time notifications for every transaction" },
    ],
    image: `${UNSPLASH}/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=700&q=80`,
  },
  {
    id: "wealth",
    label: "Wealth Management",
    desc: "Our dedicated wealth managers work alongside you to preserve, grow, and transfer your wealth with confidence across generations.",
    items: [
      { icon: "💎", title: "Private Banking", desc: "Exclusive services for high net worth individuals" },
      { icon: "🌍", title: "Global Investing", desc: "Access to international markets and currencies" },
      { icon: "🏠", title: "Real Estate Financing", desc: "Premium mortgage and refinancing solutions" },
    ],
    image: `${UNSPLASH}/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=700&q=80`,
  },
];

const faqs = [
  {
    q: "How do I open a Nexsus Bank account online?",
    a: "Opening an account is quick and paperless. Click 'Open Account', complete our 4 step digital application, and submit your identification documents. Once approved, your account details will be sent directly to you. Most applications are reviewed within 1 to 3 business days.",
  },
  {
    q: "Is Nexsus Bank FDIC insured?",
    a: "Yes. Nexsus Bank is a Member FDIC institution. Your deposits are insured up to $250,000 per depositor, per ownership category, as backed by the full faith and credit of the United States Government.",
  },
  {
    q: "What do I need to apply for a mortgage with Nexsus Bank?",
    a: "You'll need proof of income (pay stubs, W2s or tax returns), a government issued photo ID, details of any existing debts, and a credit score check. Our mortgage specialists will guide you through the entire process at no cost.",
  },
  {
    q: "Is this a real bank?",
    a: "No. This is a demonstration/portfolio project showcasing banking interface design. This is NOT a real financial institution. No real banking services, accounts, or transactions are provided. All content is for demonstration purposes only.",
  },
  {
    q: "How do I get access to the demo?",
    a: "Access to the demonstration banking interface is provided for authorized users only. This is a private portfolio project. If you're interested in similar work, please use the contact form.",
  },
  {
    q: "Can I access Nexsus Bank internationally?",
    a: "Yes. Nexsus Bank offers international wire transfers and our mobile app works globally. Currency exchange services are available for 40+ currencies with competitive mid market rates and no hidden fees.",
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("financial");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const tab = tabs.find((t) => t.id === activeTab)!;

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-grid-bg" />
        <HeroCanvas />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="hero-grid">
            <div className="hero-content">
              <div className="section-label">🏦 Trusted Since 2005 · FDIC Insured</div>
              <h1 className="hero-title">
                Banking <span>Beyond</span><br />Boundaries
              </h1>
              <p className="hero-desc">
                Nexsus Bank delivers world class personal and business banking,
                secure, digital and built around your life.
              </p>
              <div className="hero-actions">
                <Link to="/open-account" className="btn btn-gold btn-lg">Open Account</Link>
                <Link to="/login" className="btn btn-outline-white btn-lg">Log In</Link>
              </div>
              <div className="hero-stats">
                <div className="hero-stat">
                  <div className="hero-stat-val">13<span>M+</span></div>
                  <div className="hero-stat-label">Customers served globally</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-val"><span>0</span>%</div>
                  <div className="hero-stat-label">Commission on transfers</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-val">$250<span>k</span></div>
                  <div className="hero-stat-label">FDIC insurance per depositor</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-val">24<span>/7</span></div>
                  <div className="hero-stat-label">Customer support availability</div>
                </div>
              </div>
            </div>
            <div className="hero-image-wrap">
              <HeroScene />
            </div>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="ticker-bar">
        <div className="ticker-track">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <div className="ticker-item" key={i}>
              <div className="ticker-dot" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <section className="section-pad light-bg">
        <div className="container">
          <div className="about-grid">
            <div className="about-img">
              <img
                src={`${UNSPLASH}/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80`}
                alt="About Nexsus Bank"
              />
            </div>
            <div>
              <div className="section-label">About Nexsus Bank</div>
              <h2 className="section-title">Empowering individuals & businesses with trusted financial services</h2>
              <p className="section-subtitle" style={{ marginBottom: 8 }}>
                Since 2005, Nexsus Bank has been at the forefront of community focused banking.
                We combine the reliability of a full service bank with the speed and convenience of modern fintech.
              </p>
              <div className="about-features">
                <div className="about-feat">
                  <div className="about-feat-icon blue">🔒</div>
                  <div>
                    <div className="about-feat-title">Trusted Expertise</div>
                    <p className="about-feat-desc">Over 20 years of experience, 13 million customers, and a track record of financial excellence.</p>
                  </div>
                </div>
                <div className="about-feat">
                  <div className="about-feat-icon teal">🎯</div>
                  <div>
                    <div className="about-feat-title">Personalised Solutions</div>
                    <p className="about-feat-desc">Every product is tailored to your life stage and financial goals — never one size fits all.</p>
                  </div>
                </div>
                <div className="about-feat">
                  <div className="about-feat-icon gold">📈</div>
                  <div>
                    <div className="about-feat-title">Proven Results</div>
                    <p className="about-feat-desc">98% customer satisfaction, award winning digital platform, and industry leading return rates.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-pad">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label">Our Services</div>
              <h2 className="section-title">Expert financial services tailored to your needs</h2>
            </div>
            <p className="section-subtitle" style={{ maxWidth: 360 }}>
              From everyday checking to complex wealth management, we have a solution for every stage of your financial journey.
            </p>
          </div>
          <div className="services-grid">
            {[
              { tag: "Financial Planning", title: "Strategic Investment Management", img: `${UNSPLASH}/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=700&q=80`, href: "/personal" },
              { tag: "Business Banking", title: "Comprehensive Business Solutions", img: `${UNSPLASH}/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=700&q=80`, href: "/cooperate" },
              { tag: "Home Ownership", title: "Flexible Mortgage Plans for You", img: `${UNSPLASH}/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=700&q=80`, href: "/mortgages" },
            ].map((s) => (
              <div className="service-card" key={s.title}>
                <div className="service-card-body">
                  <span className="tag tag-teal mb-2" style={{ display: "inline-block", marginBottom: 10 }}>{s.tag}</span>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-dark)", marginBottom: 0 }}>{s.title}</h3>
                </div>
                <div className="service-card-img">
                  <img src={s.img} alt={s.title} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="section-pad dark-bg">
        <div className="container">
          <div className="section-header" style={{ marginBottom: 0 }}>
            <div>
              <div className="section-label">Our Expertise</div>
              <h2 className="section-title">Driving innovation and excellence in finance</h2>
            </div>
            <p className="section-subtitle">
              Nexsus Bank's forward-thinking approach combines cutting edge technology with deep financial expertise.
            </p>
          </div>
          <div style={{ marginTop: 36 }}>
            <div className="expertise-tabs">
              {tabs.map((t) => (
                <button key={t.id} className={`tab-btn${activeTab === t.id ? " active" : ""}`} onClick={() => setActiveTab(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>
            <div className="expertise-content active">
              <div>
                <p className="expertise-desc">{tab.desc}</p>
                <div className="expertise-items">
                  {tab.items.map((item) => (
                    <div className="expertise-item" key={item.title}>
                      <div className="exp-item-icon">{item.icon}</div>
                      <div>
                        <div className="exp-item-title">{item.title}</div>
                        <p className="exp-item-desc">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/open-account" className="btn btn-teal">Get Started</Link>
              </div>
              <div className="expertise-img">
                <img src={tab.image} alt={tab.label} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-pad light-bg">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label">Why Choose Us</div>
              <h2 className="section-title">Client Focused Solutions for Lasting Success</h2>
            </div>
            <p className="section-subtitle">
              Our experienced professionals deliver personalised, results driven financial strategies.
            </p>
          </div>
          <div className="why-grid">
            {[
              { num: "01", title: "Unmatched Security", desc: "bank grade 256 bit encryption and multi factor authentication on every account.", img: `${UNSPLASH}/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=80` },
              { num: "02", title: "Cash Flow Optimisation", desc: "Smart tools to improve cash flow through structured savings and budgeting strategies.", img: `${UNSPLASH}/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=700&q=80` },
              { num: "03", title: "Always Accessible", desc: "24/7 online banking, mobile app, and customer support. Banking on your schedule.", img: `${UNSPLASH}/photo-1580048915913-4f8f5cb481c4?auto=format&fit=crop&w=700&q=80` },
            ].map((w) => (
              <div className="why-card" key={w.num}>
                <div className="why-card-img"><img src={w.img} alt={w.title} /></div>
                <div className="why-card-body">
                  <div className="why-num">{w.num}</div>
                  <div className="why-title">{w.title}</div>
                  <p className="why-desc">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="section-pad dark-bg">
        <div className="container">
          <div className="section-header" style={{ marginBottom: 32 }}>
            <div>
              <div className="section-label">Our Approach</div>
              <h2 className="section-title">Client Focused Strategy for Lasting Success</h2>
            </div>
            <p className="section-subtitle">
              Our approach is built on collaboration, transparency, and deep financial expertise.
            </p>
          </div>
          <div className="approach-grid">
            {[
              { tag: "Transparency", title: "No Hidden Fees. Ever.", desc: "Every charge is disclosed upfront. What you see is what you pay.", img: `/Robot_handshake.jpg`, accent: false },
              { tag: "Innovation", title: "We craft strategies aligned with your financial goals", desc: "Personalised plans built with AI driven insights.", img: `${UNSPLASH}/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80`, accent: false },
              { tag: "Accessibility", title: "Enrol for Online Banking in Minutes", desc: "100% digital, secure, and paperless account opening.", img: `${UNSPLASH}/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=600&q=80`, accent: false },
              { tag: "Partnership", title: "Your Success Is Our Success", desc: "A dedicated relationship manager for every account.", img: `${UNSPLASH}/photo-1579621970588-a35d0e7ab9b6?auto=format&fit=crop&w=600&q=80`, accent: true },
            ].map((a) => (
              <div key={a.title} className={`approach-item${a.accent ? " approach-accent" : ""}`}>
                <div className="approach-item-inner">
                  <span className="approach-tag">{a.tag}</span>
                  <p className="approach-title">{a.title}</p>
                  <p className="approach-desc">{a.desc}</p>
                </div>
                <div className="approach-item-img"><img src={a.img} alt={a.title} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-pad">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label">Financial Facts</div>
              <h2 className="section-title">Fascinating facts that shape your financial knowledge</h2>
            </div>
            <p className="section-subtitle">Explore how the financial world has evolved and what it means for your future.</p>
          </div>
          <div className="stats-row">
            {[
              { img: `${UNSPLASH}/photo-1559526324-593bc073d938?auto=format&fit=crop&w=400&q=80`, label: "Publicly traded companies worldwide", val: "12", suf: "k+" },
              { img: `${UNSPLASH}/photo-1523287562758-66c7fc58967f?auto=format&fit=crop&w=400&q=80`, label: "Financial advisors recommend diversification", val: "80", suf: "%" },
              { img: `${UNSPLASH}/photo-1565372195458-9de0b320ef04?auto=format&fit=crop&w=400&q=80`, label: "Credit cards in global circulation", val: "31", suf: "k+" },
              { img: `${UNSPLASH}/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=400&q=80`, label: "Americans believe financial literacy is key", val: "90", suf: "%" },
            ].map((s) => (
              <div className="stat-cell" key={s.label}>
                <div className="stat-img"><img src={s.img} alt={s.label} /></div>
                <p className="stat-label">{s.label}</p>
                <div className="stat-val"><span>{s.val}</span>{s.suf}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad dark-bg">
        <div className="container">
          <div className="cta-inner">
            <div>
              <div className="cta-badge">
                <span>🛡️ FDIC Insured · Backed by the U.S. Government</span>
              </div>
              <h2 className="cta-title">Take control of your financial future today</h2>
              <p className="cta-desc">
                Nexsus Bank has made it easy for everyone to harness their financial potential. Open your account in minutes — no branch visit required.
              </p>
              <div className="cta-actions">
                <Link to="/open-account" className="btn btn-gold btn-lg">Get Started Today</Link>
                <Link to="/personal" className="btn btn-outline-white btn-lg">Explore Services</Link>
              </div>
            </div>
            <div className="cta-img">
              <img src={`${UNSPLASH}/photo-1579621970588-a35d0e7ab9b6?auto=format&fit=crop&w=800&q=80`} alt="Banking" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad dark-bg" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: 32 }}>
            <div>
              <div className="section-label">FAQ</div>
              <h2 className="section-title">Common questions answered</h2>
            </div>
            <Link to="/contact" className="btn btn-outline-white">Contact Support</Link>
          </div>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item${openFaq === i ? " open" : ""}`}>
                <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <h3>{faq.q}</h3>
                  <div className="faq-toggle">+</div>
                </div>
                <div className="faq-a"><p>{faq.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
