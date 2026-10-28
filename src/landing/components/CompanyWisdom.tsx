const BASE = import.meta.env.BASE_URL;

const stats = [
  { image: "company-wisdom-img-1.jpg", title: "The number of publicly traded companies", value: "12", suffix: "k+" },
  { image: "company-wisdom-img-2.jpg", title: "The percentage of financial advisors", value: "80", suffix: "%" },
  { image: "company-wisdom-img-3.jpg", title: "The number of credit cards in circulation", value: "31", suffix: "k+" },
  { image: "company-wisdom-img-4.jpg", title: "The proportion of Americans who believe that financial literacy", value: "90", suffix: "%" },
];

export default function CompanyWisdom() {
  return (
    <div className="company-wisdom">
      <div className="container">
        <div className="row section-row align-items-center">
          <div className="col-lg-7">
            <div className="section-title">
              <h3>financial wisdom</h3>
              <h2>Fascinating facts that shape your financial knowledge</h2>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="section-title-content">
              <p>
                Explore fun and surprising facts about the financial world.
                Learn how history, trends, and innovations have shaped today's
                finance landscape, making it easier to navigate your financial
                journey.
              </p>
            </div>
          </div>
        </div>

        <div className="company-wisdom-box">
          {stats.map((s, i) => (
            <div key={i} style={{ display: "contents" }}>
              <div className="company-wisdom-image">
                <figure className="image-anime">
                  <img src={`${BASE}images/${s.image}`} alt={s.title} />
                </figure>
              </div>
              <div className="company-wisdom-item">
                <div className="company-counter-title">
                  <h3>{s.title}</h3>
                </div>
                <div className="company-wisdom-counter">
                  <h2><span>{s.value}</span>{s.suffix}</h2>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
