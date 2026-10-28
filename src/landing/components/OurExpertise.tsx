import { useState } from "react";
const BASE = import.meta.env.BASE_URL;

const tabs = [
  {
    id: "financial",
    label: "Financial Planning",
    desc: "Cavernerco Limited Bank Savings Invent is our enterprise approach to innovation and supports our business strategy as a forward-focused bank. It's about using emerging technology to engage with our customers and exceeding their rapidly evolving expectations.",
    items: [
      { icon: "icon-expertise-list-1.svg", title: "expert investment management", desc: "Strategic investment guidance tailored to your goals" },
      { icon: "icon-expertise-list-2.svg", title: "Social Security and Pension Optimization", desc: "Maximize your retirement income and benefits" },
      { icon: "icon-expertise-list-3.svg", title: "business financial planning", desc: "Comprehensive strategies for business growth" },
    ],
    image: "expertise-financial-img.jpg",
  },
  {
    id: "consulting",
    label: "Business Consulting",
    desc: "Our business consulting services help organizations navigate complex challenges, optimize operations, and achieve strategic objectives with precision and clarity.",
    items: [
      { icon: "icon-expertise-list-1.svg", title: "expert investment management", desc: "Strategic investment guidance tailored to your goals" },
      { icon: "icon-expertise-list-2.svg", title: "Social Security and Pension Optimization", desc: "Maximize your retirement income and benefits" },
      { icon: "icon-expertise-list-3.svg", title: "business financial planning", desc: "Comprehensive strategies for business growth" },
    ],
    image: "expertise-financial-img.jpg",
  },
  {
    id: "risk",
    label: "Risk Management",
    desc: "Our risk management solutions protect your assets and financial wellbeing through comprehensive analysis and proactive strategies designed for long term stability.",
    items: [
      { icon: "icon-expertise-list-1.svg", title: "expert investment management", desc: "Strategic investment guidance tailored to your goals" },
      { icon: "icon-expertise-list-2.svg", title: "Social Security and Pension Optimization", desc: "Maximize your retirement income and benefits" },
      { icon: "icon-expertise-list-3.svg", title: "business financial planning", desc: "Comprehensive strategies for business growth" },
    ],
    image: "expertise-financial-img.jpg",
  },
  {
    id: "investment",
    label: "Investment Management",
    desc: "Our investment management team delivers smart portfolio strategies designed to grow your wealth while managing risk across diverse market conditions.",
    items: [
      { icon: "icon-expertise-list-1.svg", title: "expert investment management", desc: "Strategic investment guidance tailored to your goals" },
      { icon: "icon-expertise-list-2.svg", title: "Social Security and Pension Optimization", desc: "Maximize your retirement income and benefits" },
      { icon: "icon-expertise-list-3.svg", title: "business financial planning", desc: "Comprehensive strategies for business growth" },
    ],
    image: "expertise-financial-img.jpg",
  },
];

export default function OurExpertise() {
  const [active, setActive] = useState("financial");
  const tab = tabs.find((t) => t.id === active)!;

  return (
    <div className="our-expertise bg-section">
      <div className="container">
        <div className="row section-row align-items-center">
          <div className="col-lg-7">
            <div className="section-title">
              <h3>our expertise</h3>
              <h2>Driving innovation and success in Industry Insights</h2>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="section-title-content">
              <p>
                Cavernerco Limited Bank Savings Invent is our enterprise
                approach to innovation and supports our business strategy as a
                forward-focused bank.
              </p>
            </div>
          </div>
        </div>

        <div className="expertise-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`expertise-tab-btn${active === t.id ? " active" : ""}`}
              onClick={() => setActive(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className={`expertise-content active`}>
          <div className="expertise-list">
            <div className="expertise-list-title">
              <p>{tab.desc}</p>
            </div>
            <div className="expertise-items">
              {tab.items.map((item) => (
                <div className="expertise-item" key={item.title}>
                  <div className="expertise-item-icon">
                    <img src={`${BASE}images/${item.icon}`} alt="" />
                  </div>
                  <div className="expertise-item-content">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <a className="btn-default" href="#">contact now</a>
            </div>
          </div>
          <div className="expertise-image">
            <img src={`${BASE}images/${tab.image}`} alt="Expertise" />
          </div>
        </div>
      </div>
    </div>
  );
}
