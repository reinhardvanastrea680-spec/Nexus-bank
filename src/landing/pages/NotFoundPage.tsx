import { Link, useLocation } from "@tanstack/react-router";

export default function NotFoundPage() {
  return (
    <section style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 20px", background: "var(--bg-light)" }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{ fontFamily: "var(--font-head)", fontSize: 96, fontWeight: 800, color: "var(--border)", lineHeight: 1, marginBottom: 16 }}>404</div>
        <h2 style={{ fontFamily: "var(--font-head)", fontSize: 28, fontWeight: 800, color: "var(--text-dark)", marginBottom: 12 }}>Page not found</h2>
        <p style={{ color: "var(--text-body)", fontSize: 15, lineHeight: 1.75, marginBottom: 28 }}>
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/" className="btn btn-primary">← Back to Home</Link>
          <Link to="/contact" className="btn btn-outline">Contact Support</Link>
        </div>
      </div>
    </section>
  );
}
