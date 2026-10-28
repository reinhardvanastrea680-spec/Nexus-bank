const BASE = import.meta.env.BASE_URL;

export default function CtaBox() {
  return (
    <div className="cta-box bg-section">
      <div className="container">
        <div className="cta-box-inner">
          <div className="cta-content">
            <div className="cta-badge">
              <span>FDIC-Insured — Backed by the full faith and credit of the U.S. Government</span>
            </div>
            <h2>Take control of your financial future today!</h2>
            <p>
              We've made it easy for Cavernerco Bank employees to harness
              their creativity, bring their ideas to life, and solve
              customer and colleague problems.
            </p>
            <div className="cta-buttons">
              <a className="btn-highlighted" href="#">get started today</a>
              <a className="btn-default" href="#">explore our services</a>
            </div>
          </div>
          <div className="cta-image">
            <img src={`${BASE}images/cta-box-image.jpg`} alt="Take control" />
          </div>
        </div>
      </div>
    </div>
  );
}
