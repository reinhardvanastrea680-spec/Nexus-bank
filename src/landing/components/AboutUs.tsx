const BASE = import.meta.env.BASE_URL;

const features = [
  {
    icon: "icon-about-company-1.svg",
    title: "expertise you can trust",
    desc: "Our experienced team delivers reliable insights and strategies, ensuring your financial decisions are well-informed and secure.",
  },
  {
    icon: "icon-about-company-2.svg",
    title: "personalized solutions",
    desc: "Our personalized solutions are crafted address your unique financial helping you achieve your specific goals and aspirations.",
  },
  {
    icon: "icon-about-company-3.svg",
    title: "proven track record",
    desc: "Our proven track record highlights successful outcomes and client satisfaction through effective financial solutions.",
  },
];

export default function AboutUs() {
  return (
    <div className="about-us bg-section">
      <div className="container">
        <div className="row section-row">
          <div className="col-lg-5">
            <div className="section-title">
              <h3>about us</h3>
              <h2>Empowering businesses and individuals with experts</h2>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="about-us-content">
              <p>
                We are dedicated to helping businesses and individuals navigate
                the complexities of finance with confidence and clarity. With
                years of experience in financial planning, investment
                management, business consulting.
              </p>
              <div className="about-company-list">
                {features.map((f) => (
                  <div className="about-company-item" key={f.title}>
                    <div className="about-company-icon">
                      <img src={`${BASE}images/${f.icon}`} alt={f.title} />
                    </div>
                    <div className="about-company-content">
                      <h3>{f.title}</h3>
                      <p>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
