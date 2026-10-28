import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("nexsus-cookie-consent");
    if (!consent) {
      // Small delay so it doesn't flash immediately on load
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("nexsus-cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("nexsus-cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 24,
      left: "50%",
      transform: "translateX(-50%)",
      width: "calc(100% - 48px)",
      maxWidth: 680,
      background: "#0A1628",
      borderRadius: 16,
      padding: "20px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 20,
      boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
      border: "1px solid rgba(255,255,255,0.08)",
      zIndex: 9999,
      flexWrap: "wrap",
      animation: "cookieSlideUp 0.4s cubic-bezier(0.22,1,0.36,1) both",
    }}>
      <style>{`
        @keyframes cookieSlideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(24px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      {/* Icon + Text */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flex: 1, minWidth: 200 }}>
        <span style={{ fontSize: 24, flexShrink: 0 }}>🍪</span>
        <div>
          <p style={{ fontSize: 13.5, color: "#fff", fontWeight: 600, margin: "0 0 4px" }}>
            We use cookies
          </p>
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.6 }}>
            We use cookies to enhance your browsing experience and analyse site traffic.
            By clicking "Accept", you consent to our use of cookies.{" "}
            <a href="/landing/privacy-policy" style={{ color: "#38BDF8", textDecoration: "underline" }}>
              Learn more
            </a>
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        <button
          onClick={decline}
          style={{
            padding: "9px 18px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "transparent",
            color: "rgba(255,255,255,0.6)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          Decline
        </button>
        <button
          onClick={accept}
          style={{
            padding: "9px 20px",
            borderRadius: 10,
            border: "none",
            background: "linear-gradient(135deg, #1240A0, #38BDF8)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(56,189,248,0.3)",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          Accept All
        </button>
      </div>
    </div>
  );
}
