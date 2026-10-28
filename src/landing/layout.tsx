// Landing shell — reused by every folded landing route.
import "./index.css";
import { Link as TanStackLink } from "@tanstack/react-router";
import { cn } from "./lib/utils";
import { Toaster } from "sonner";
import CookieBanner from "./components/CookieBanner";

export function LandingGlobalDisclaimer({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999999,
        background: "#ff6b00",
        color: "#000",
        padding: "8px 16px",
        textAlign: "center",
        fontWeight: 700,
        fontSize: "13px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        borderBottom: "2px solid #000",
      }}
    >
      ⚠ DEMO SITE - This is NOT a real bank. Educational/portfolio project only. No real financial services.
    </div>
  );
}

export function LandingHeader({ user, onLogout }: { user?: any; onLogout?: () => void }) {
  return (
    <header className="main-header">
      <div className="container">
        <div className="header-inner">
          <div className="header-logo">
            <div className="logo-mark">N</div>
            <div className="logo-text">Nexsus Bank</div>
            <div className="logo-sub">Banking Beyond Boundaries</div>
          </div>

          <nav className="main-nav">
            <a href="/landing/about" className="nav-link">About</a>
            <a href="/landing/open-account" className="nav-link btn-link">Open Account</a>
            {user && (
              <>
                <span className="nav-username">Hi, {user.firstName}</span>
                <button className="btn btn-ghost" onClick={onLogout}>Log Out</button>
              </>
            )}
            {!user && (
              <a href="/login" className="btn btn-primary">Log In</a>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">Nexsus Bank</div>
            <div className="footer-tagline">Banking Beyond Boundaries</div>
            <div className="footer-links">
              <strong>Company</strong>
              <a href="/landing/about">About</a>
              <a href="/landing/contact">Contact</a>
            </div>
            <div className="footer-links">
              <strong>Legal</strong>
              <a href="/landing/privacy-policy">Privacy Policy</a>
            </div>
          </div>
          <div>
            <div className="footer-title">Products</div>
            <a href="/landing/personal">Personal</a>
            <a href="/landing/cooperate">Business</a>
            <a href="/landing/insurance">Insurance</a>
            <a href="/landing/mortgage">Mortgages</a>
          </div>
          <div>
            <div className="footer-title">Banking</div>
            <a href="/landing/open-account">Open Account</a>
            <a href="/landing/savings">Savings</a>
            <a href="/landing/credit-cards">Credit Cards</a>
            <a href="/landing/business-loans">Business Loans</a>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} Nexsus Bank. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export function LandingLayout({
  user,
  onLogout,
  children,
}: {
  user: any;
  onLogout: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <div>
        <LandingHeader user={user} onLogout={onLogout} />
        <main>{children}</main>
        <LandingFooter />
      </div>
      <CookieBanner />
      <Toaster position="top-right" />
    </>
  );
}
