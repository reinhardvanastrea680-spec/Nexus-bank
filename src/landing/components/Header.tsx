import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { label: "Personal",       href: "/landing/personal" },
  { label: "Business",       href: "/landing/cooperate" },
  { label: "Insurance",      href: "/landing/insurance" },
  { label: "Mortgages",      href: "/landing/mortgage" },
  { label: "Savings",        href: "/landing/savings" },
  { label: "Business Loans", href: "/landing/business-loans" },
  { label: "Credit Cards",   href: "/landing/credit-cards" },
  { label: "About Us",       href: "/landing/about" },
  { label: "Contact",        href: "/landing/contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [location] = useLocation();

  return (
    <>
      <header className="main-header">
        <div className="container">
          <div className="header-inner">
            <Link to="/" className="header-logo">
              <div className="logo-mark">N</div>
              <div>
                <div className="logo-text">Nexsus Bank</div>
                <div className="logo-sub">Banking Beyond Boundaries</div>
              </div>
            </Link>

            <nav className="main-nav">
              {navLinks.map((n) => (
                <Link
                  key={n.href}
                  to={n.href}
                  className={location === n.href ? "active" : ""}
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            <div className="header-actions">
              {user ? (
                <>
                  <span style={{ fontSize: 13, color: "var(--text-body)", whiteSpace: "nowrap" }}>
                    Hi, {user.firstName}
                  </span>
                  <button className="btn-login-header" onClick={() => void logout()}>
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-login-header">
                    Log In
                  </Link>
                  <Link to="/open-account" className="btn btn-primary btn-sm">
                    Open Account
                  </Link>
                </>
              )}
              <button className={"hamburger" + (menuOpen ? " open" : "")} aria-label="Toggle menu" onClick={() => setMenuOpen((v) => !v)}>
                <span /><span /><span />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className={"mobile-menu" + (menuOpen ? " open" : "")}>
        <button className="mobile-menu-close" onClick={() => setMenuOpen(false)}>
          &#10005;
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div className="logo-mark">N</div>
          <div className="logo-text">Nexsus Bank</div>
        </div>
        <nav className="mobile-nav">
          {navLinks.map((n) => (
            <Link key={n.href} to={n.href} onClick={() => setMenuOpen(false)}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mobile-nav-actions">
          {user ? (
            <button className="btn btn-outline w-full" onClick={() => { logout(); setMenuOpen(false); }}>
              Log Out ({user.firstName})
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline w-full">
                Log In
              </Link>
              <Link to="/open-account" className="btn btn-primary w-full" onClick={() => setMenuOpen(false)}>
                Open Account
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
