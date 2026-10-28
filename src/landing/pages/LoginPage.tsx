import { Link, useLocation } from "@tanstack/react-router";

/** /login on the landing page -> dashboard login (same origin, so no
 * phishing-flag / social-engineering redirect). */
export default function LoginPage() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "#071a3e", fontFamily: "Inter, sans-serif",
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: "linear-gradient(135deg, #1d4ed8, #0891b2)", display: "flex",
        alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: 26,
        fontWeight: 800, color: "#fff", boxShadow: "0 0 30px rgba(8,145,178,0.4)",
      }}>
        N
      </div>
      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, marginBottom: 24 }}>
        Access your secure banking portal
      </p>
      <Link
        to="/login"
        style={{
          padding: "14px 32px", background: "linear-gradient(135deg, #1d4ed8, #0891b2)",
          color: "#fff", textDecoration: "none", borderRadius: 8, fontWeight: 600,
          fontSize: 15, boxShadow: "0 4px 14px rgba(29,78,216,0.4)",
        }}
      >
        Continue to Login &rarr;
      </Link>
    </div>
  );
}
