const BASE = import.meta.env.BASE_URL;

export default function OurApproach() {
  return (
    <div className="our-approach bg-section">
      <div className="container">
        <div className="row section-row align-items-center">
          <div className="col-lg-7">
            <div className="section-title">
              <h3>our approach</h3>
              <h2>Client centric strategy for lasting success</h2>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="section-title-content">
              <p>
                We believe that a successful financial journey starts with
                understanding your unique needs and aspirations Our approach is
                built on a foundation of collaboration, transparency, and
                expertise.
              </p>
            </div>
          </div>
        </div>

        <div className="approach-grid">
          {/* Box 1 */}
          <div className="approach-item approach-box-1" style={{ background: "rgba(255,255,255,0.04)" }}>
            <div className="approach-btn" style={{ display: "flex", justifyContent: "flex-end", padding: "20px 20px 0" }}>
              <a className="readmore-btn" href="#">
                <img src={`${BASE}images/icon-arrow.svg`} alt="" />
              </a>
            </div>
            <div className="approach-image" style={{ padding: "16px" }}>
              <img src={`${BASE}images/approach-image-1.png`} alt="Focus" style={{ borderRadius: 12, height: 180, width: "100%", objectFit: "cover" }} />
            </div>
            <div className="approach-body">
              <div className="approach-tags">
                <a href="#">focus</a>
              </div>
              <div className="approach-content">
                <h3>Get the real exchange rate</h3>
                <p>
                  We don't charge fees for spending on your card abroad, and
                  we pass Mastercard's exchange rate directly onto you, without
                  extra charges.
                </p>
              </div>
            </div>
          </div>

          {/* Box 2 */}
          <div className="approach-item" style={{ background: "rgba(255,255,255,0.04)" }}>
            <div style={{ padding: "24px 24px 16px" }}>
              <div className="approach-content">
                <h3 style={{ marginBottom: 16 }}>
                  We craft customized financial strategies that align with your objectives.
                </h3>
              </div>
            </div>
            <div className="approach-image">
              <img src={`${BASE}images/approach-image-2.png`} alt="Strategy" style={{ height: 240, width: "100%", objectFit: "cover" }} />
            </div>
          </div>

          {/* Box 3 */}
          <div className="approach-item" style={{ background: "rgba(255,255,255,0.04)" }}>
            <div style={{ padding: "24px" }}>
              <div className="approach-content">
                <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 8, fontSize: 13 }}>Stay on the KNOW</p>
                <h3>Enroll for Online Banking</h3>
              </div>
              <a className="approach-badge" href="#" style={{ display: "inline-block", marginTop: 12, background: "var(--accent-color)", color: "var(--primary-color)", borderRadius: 100, padding: "8px 20px", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>100% Secured</a>
            </div>
            <div className="approach-image">
              <img src={`${BASE}images/approach-image-3.png`} alt="Online Banking" style={{ height: 220, width: "100%", objectFit: "cover" }} />
            </div>
          </div>

          {/* Box 4 — accent bg */}
          <div className="approach-item" style={{ background: "var(--accent-color)", border: "none" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", padding: "20px 20px 0" }}>
              <a className="readmore-btn" href="#" style={{ background: "var(--primary-color)" }}>
                <img src={`${BASE}images/icon-arrow.svg`} alt="" style={{ filter: "brightness(0) invert(1)" }} />
              </a>
            </div>
            <div style={{ padding: "0 20px 16px" }}>
              <div className="approach-content">
                <h3 style={{ color: "var(--primary-color)", fontSize: 18 }}>
                  We craft customized financial strategies that align with your objectives.
                </h3>
              </div>
            </div>
            <div className="approach-image">
              <img src={`${BASE}images/approach-image-4.png`} alt="Strategy" style={{ height: 200, width: "100%", objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
