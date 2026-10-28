const BASE = import.meta.env.BASE_URL;

export default function Hero() {
  return (
    <div className="hero">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-4 col-md-6" style={{ order: 1 }}>
            <div className="hero-content">
              <div className="section-title">
                <h3>Welcome to Cavernerco Limited Bank International Bank</h3>
                <h1>Empowering your Day to Day Banking</h1>
                <p>
                  Simple and secure personal banking available in person,
                  online, or on your device.
                </p>
              </div>
              <div className="hero-content-form">
                <div className="form-group">
                  <a className="btn-highlighted" href="#">Enrol New Account</a>
                  <a className="btn-default" href="#">Login</a>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4" style={{ order: 2 }}>
            <div className="hero-images">
              <div className="hero-img">
                <figure className="image-anime">
                  <img src={`${BASE}images/hero-image.jpg`} alt="Banking" />
                </figure>
              </div>
              <div className="payment-method-image">
                <img src={`${BASE}images/payment-method-image.png`} alt="Payment Methods" />
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6" style={{ order: 3 }}>
            <div className="hero-counter-box">
              <div className="hero-counter-item">
                <h2><span>13</span>M+</h2>
                <p>
                  The first credit card ever issued was made of cardboard and
                  was introduced by American Express in 1958.
                </p>
              </div>
              <div className="hero-counter-item">
                <h2><span>0</span>%</h2>
                <p>
                  We believe that you should keep more of what you earn. That's
                  why we're excited to offer a 0% commission.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
