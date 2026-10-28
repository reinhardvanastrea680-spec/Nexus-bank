const BASE = import.meta.env.BASE_URL;

const services = [
  {
    tag: "financial planning",
    title: "Strategic Business Consulting for Growth Success",
    image: "service-box-image-1.png",
  },
  {
    tag: "business consulting",
    title: "Comprehensive Financial Planning for Your Future",
    image: "service-box-image-2.png",
  },
  {
    tag: "Want to own your own home?",
    title: "Check Out Our Mortgage Plan",
    image: "service-box-image-3.png",
  },
];

export default function OurServices() {
  return (
    <div className="our-services">
      <div className="container">
        <div className="row section-row align-items-center">
          <div className="col-lg-7">
            <div className="section-title">
              <h3>our services</h3>
              <h2>Expert financial services for your needs</h2>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="section-title-content">
              <p>
                Move funds between your accounts and schedule transfers, plus
                use Send Money with Zelle® to pay friends quickly, easily and
                for free. View all your account activity and balances, pay bills
                automatically, set up e-mail alerts and more.
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          {services.map((s) => (
            <div className="col-lg-4 col-md-6" key={s.title} style={{ marginBottom: 24 }}>
              <div className="service-box">
                <div className="service-box-header">
                  <div className="service-box-tag">
                    <a href="#">{s.tag}</a>
                  </div>
                  <div className="service-box-title">
                    <h3>{s.title}</h3>
                  </div>
                </div>
                <div className="service-box-image">
                  <img src={`${BASE}images/${s.image}`} alt={s.title} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
