const BASE = import.meta.env.BASE_URL;

const items = [
  "International Banking",
  "Flexible Mortgage",
  "Low Rate Loans",
  "Secured Payments",
  "Market Data",
  "Credit/Debit Cards",
  "Insurance",
  "Business Loan",
  "Offshore Account",
  "Latest Financial News",
  "Security & Trust",
];

export default function ScrollingTicker() {
  const doubled = [...items, ...items];

  return (
    <div className="our-scrolling-ticker">
      <div className="ticker-track">
        {doubled.map((item, i) => (
          <div className="ticker-item" key={i}>
            <img src={`${BASE}images/asterisk-icon.svg`} alt="" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
