import { useEffect, useState } from "react";

/**
 * Cinematic intro splash — shows for ~2.8s then fades out.
 * Sequence:
 *   0.0s  — dark screen, "N" scales in with glow
 *   0.8s  — "exsus Bank" types in beside "N"
 *   1.6s  — tagline fades in below
 *   2.2s  — particle ring expands outward
 *   2.6s  — whole splash fades out → main page revealed
 */
export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);
  // 0 = logo scales in
  // 1 = text types in
  // 2 = tagline appears
  // 3 = ring expands
  // 4 = fade out

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 700),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2100),
      setTimeout(() => setPhase(4), 2500),
      setTimeout(() => onDone(),   3100),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#040f24",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        opacity: phase === 4 ? 0 : 1,
        transition: phase === 4 ? "opacity 0.6s ease" : "none",
        pointerEvents: phase === 4 ? "none" : "all",
      }}
    >
      {/* ── Radial glow behind logo ── */}
      <div style={{
        position: "absolute",
        width: 480,
        height: 480,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(8,145,178,0.18) 0%, transparent 70%)",
        transform: phase >= 3 ? "scale(2.5)" : "scale(1)",
        opacity: phase >= 3 ? 0 : 1,
        transition: "transform 0.7s cubic-bezier(.4,0,.2,1), opacity 0.7s ease",
        pointerEvents: "none",
      }} />

      {/* ── Expanding ring ── */}
      <div style={{
        position: "absolute",
        width: 120,
        height: 120,
        borderRadius: "50%",
        border: "2px solid rgba(8,145,178,0.6)",
        transform: phase >= 3 ? "scale(12)" : "scale(1)",
        opacity: phase >= 3 ? 0 : phase >= 2 ? 1 : 0,
        transition: phase >= 3
          ? "transform 0.7s cubic-bezier(.2,0,.4,1), opacity 0.6s ease"
          : "opacity 0.4s ease",
        pointerEvents: "none",
      }} />

      {/* ── Second ring (delayed) ── */}
      <div style={{
        position: "absolute",
        width: 160,
        height: 160,
        borderRadius: "50%",
        border: "1px solid rgba(29,78,216,0.4)",
        transform: phase >= 3 ? "scale(9)" : "scale(1)",
        opacity: phase >= 3 ? 0 : phase >= 2 ? 0.6 : 0,
        transition: phase >= 3
          ? "transform 0.8s 0.1s cubic-bezier(.2,0,.4,1), opacity 0.7s 0.1s ease"
          : "opacity 0.4s ease",
        pointerEvents: "none",
      }} />

      {/* ── Logo row ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        position: "relative",
        zIndex: 1,
      }}>
        {/* N box */}
        <div style={{
          width: 72,
          height: 72,
          borderRadius: 18,
          background: "linear-gradient(135deg, #1d4ed8, #0891b2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 38,
          fontWeight: 900,
          color: "#fff",
          boxShadow: "0 0 40px rgba(8,145,178,0.5), 0 0 80px rgba(8,145,178,0.2)",
          transform: phase >= 1
            ? "scale(1) translateY(0)"
            : "scale(0.3) translateY(30px)",
          opacity: phase >= 1 ? 1 : 0,
          transition: "transform 0.55s cubic-bezier(.34,1.56,.64,1), opacity 0.4s ease",
          flexShrink: 0,
        }}>
          N
        </div>

        {/* "exus Bank" types in */}
        <div style={{
          overflow: "hidden",
          maxWidth: phase >= 2 ? 260 : 0,
          opacity: phase >= 2 ? 1 : 0,
          transition: "max-width 0.5s cubic-bezier(.4,0,.2,1), opacity 0.4s ease",
          whiteSpace: "nowrap",
          paddingLeft: 14,
        }}>
          <span style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 36,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: -0.5,
          }}>
            exsus Bank
          </span>
        </div>
      </div>

      {/* ── Tagline ── */}
      <div style={{
        marginTop: 20,
        fontFamily: "'Inter', sans-serif",
        fontSize: 13,
        fontWeight: 500,
        color: "rgba(255,255,255,0.45)",
        letterSpacing: 3,
        textTransform: "uppercase",
        opacity: phase >= 3 ? 0 : phase >= 2 ? 1 : 0,
        transform: phase >= 2 ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        position: "relative",
        zIndex: 1,
      }}>
        Banking Beyond Boundaries
      </div>

      {/* ── Loading bar ── */}
      <div style={{
        position: "absolute",
        bottom: 48,
        left: "50%",
        transform: "translateX(-50%)",
        width: 120,
        height: 2,
        background: "rgba(255,255,255,0.08)",
        borderRadius: 2,
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          borderRadius: 2,
          background: "linear-gradient(90deg, #0891b2, #1d4ed8)",
          width: phase >= 4 ? "100%" : phase >= 3 ? "85%" : phase >= 2 ? "60%" : phase >= 1 ? "35%" : "5%",
          transition: "width 0.5s ease",
        }} />
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes nb-logo-glow {
          0%, 100% { box-shadow: 0 0 40px rgba(8,145,178,0.5), 0 0 80px rgba(8,145,178,0.2); }
          50%       { box-shadow: 0 0 60px rgba(8,145,178,0.8), 0 0 120px rgba(8,145,178,0.35); }
        }
      `}</style>
    </div>
  );
}
