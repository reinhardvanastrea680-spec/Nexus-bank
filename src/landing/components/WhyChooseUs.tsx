const BASE = import.meta.env.BASE_URL;

const items = [
  {
    num: "01",
    image: "why-choose-image-1.jpg",
    title: "unparalleled expertise",
    desc: "Our team comprises seasoned professionals with extensive.",
  },
  {
    num: "02",
    image: "why-choose-image-2.jpg",
    title: "cash flow optimization",
    desc: "Improve cash flow through structured savings, budgeting techniques",
  },
  {
    num: "03",
    image: "why-choose-image-3.jpg",
    title: "financial accountability",
    desc: "Stay on track with your financial goals through regular check ins",
  },
];

export default function WhyChooseUs() {
  return (
    <div className="why-choose-us">
      <div className="container">
        <div className="row section-row align-items-center">
          <div className="col-lg-7">
            <div className="section-title">
              <h3>why choose us</h3>
              <h2>Expertise and client focused solutions for your success</h2>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="section-title-content">
              <p>
                Our team of experienced professionals delivers personalized,
                results driven financial strategies tailored to your unique
                goals. We prioritize transparency, trust, and long term success.
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          {items.map((item) => (
            <div className="col-lg-4 col-md-6" key={item.num}>
              <div className="why-choose-item">
                <div className="why-choose-image">
                  <figure>
                    <img src={`${BASE}images/${item.image}`} alt={item.title} />
                  </figure>
                </div>
                <div className="why-choose-no">
                  <h3>{item.num}</h3>
                </div>
                <div className="why-choose-body">
                  <div className="why-choose-content">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                  <div className="why-choose-btn">
                    <a className="readmore-btn" href="#">
                      <img src={`${BASE}images/icon-arrow.svg`} alt="" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
