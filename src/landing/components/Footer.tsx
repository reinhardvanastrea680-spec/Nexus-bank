import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="logo-mark">N</div>
              <div className="logo-text" style={{ color: "#fff" }}>Nexsus Bank</div>
            </div>
            <p>
              Nexsus Bank is your digital banking partner, offering
              secure, accessible, and innovative financial solutions for
              individuals and businesses across the United States.
              Member FDIC. Equal Housing Lender.
            </p>
          </div>

          <div className="footer-col">
            <h4>Personal Banking</h4>
            <ul>
              <li><Link to="/landing/personal">Personal Accounts</Link></li>
              <li><Link to="/landing/savings">Savings</Link></li>
              <li><Link to="/landing/credit-cards">Credit Cards</Link></li>
              <li><Link to="/landing/mortgage">Mortgages</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Business</h4>
            <ul>
              <li><Link to="/landing/cooperate">Business Banking</Link></li>
              <li><Link to="/landing/business-loans">Business Loans</Link></li>
              <li><Link to="/landing/insurance">Insurance</Link></li>
              <li><Link to="/landing/about">About Us</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              <li><Link to="/landing/contact">Support Center</Link></li>
              <li><Link to="/landing/about">About Us</Link></li>
              <li><Link to="/">Security</Link></li>
              <li><Link to="/landing/privacy-policy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © 2025 Nexsus Bank, N.A. All Rights Reserved. Member FDIC · Equal Housing Lender
            {" · "}
            <span>Developed by Setons</span>
          </p>
          <div className="footer-socials">
            <a href="#" className="footer-social-link" aria-label="Facebook">f</a>
            <a href="#" className="footer-social-link" aria-label="Twitter">𝕏</a>
            <a href="#" className="footer-social-link" aria-label="LinkedIn">in</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
