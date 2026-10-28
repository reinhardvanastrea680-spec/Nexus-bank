import { useEffect, useRef, useState } from "react";

export type PageSceneTheme =
  | "personal"
  | "business"
  | "savings"
  | "mortgage"
  | "insurance"
  | "cards"
  | "loans"
  | "about";

/* ─── shared helpers ─────────────────────────────────── */
function Counter({ target, prefix = "", suffix = "", duration = 1600 }: { target: number; prefix?: string; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 30));
    const id = setInterval(() => {
      start = Math.min(start + step, target);
      setVal(start);
      if (start >= target) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [target, duration]);
  return <>{prefix}{val.toLocaleString()}{suffix}</>;
}

function AnimSvgLine({ points, color = "#06b6d4", h = 80, w = 260 }: { points: string; color?: string; h?: number; w?: number }) {
  const ref = useRef<SVGPolylineElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const anim = ref.current.animate(
      [{ strokeDashoffset: "600" }, { strokeDashoffset: "0" }],
      { duration: 1800, easing: "ease-out", fill: "forwards", delay: 400 }
    );
    return () => anim.cancel();
  }, []);
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`fill-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={points + ` ${w - 6},${h} 6,${h}`} fill={`url(#fill-${color.replace("#","")})`} />
      <polyline ref={ref} points={points} fill="none" stroke={color} strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" strokeDasharray="600" strokeDashoffset="600" />
    </svg>
  );
}

function makePts(data: number[], w = 260, h = 80) {
  const mx = Math.max(...data);
  return data.map((p, i) => `${(i / (data.length - 1)) * (w - 12) + 6},${h - 8 - ((p / mx) * (h - 20))}`).join(" ");
}

/* ─── theme renderers ────────────────────────────────── */

function PersonalScene() {
  const txList = [
    { icon: "☕", label: "Starbucks", amt: "-$6.40", color: "#ef4444" },
    { icon: "🛒", label: "Whole Foods", amt: "-$84.22", color: "#ef4444" },
    { icon: "💼", label: "Salary", amt: "+$4,200.00", color: "#10b981" },
    { icon: "🎬", label: "Netflix", amt: "-$15.99", color: "#ef4444" },
    { icon: "⛽", label: "Shell Gas", amt: "-$52.10", color: "#ef4444" },
  ];
  const [visible, setVisible] = useState([true, false, false, false, false]);
  useEffect(() => {
    const timers = txList.map((_, i) =>
      setTimeout(() => setVisible(v => v.map((x, j) => j <= i ? true : x)), i * 320 + 400)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const cats = [
    { label: "Food", pct: 34, color: "#1d4ed8" },
    { label: "Savings", pct: 28, color: "#10b981" },
    { label: "Bills", pct: 22, color: "#0891b2" },
    { label: "Other", pct: 16, color: "#f59e0b" },
  ];
  let cumDeg = -90;

  return (
    <div className="ps-wrap">
      <div className="ps-glow" style={{ background: "radial-gradient(circle at 30% 30%, rgba(29,78,216,0.3) 0%,transparent 60%), radial-gradient(circle at 70% 70%, rgba(8,145,178,0.2) 0%,transparent 50%)" }} />

      {/* Phone frame */}
      <div className="ps-phone">
        <div className="ps-phone-notch" />
        <div className="ps-phone-screen">
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 2 }}>Account Balance</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: "var(--font-head)", lineHeight: 1 }}>
            <Counter target={24842} prefix="$" />
          </div>
          <div style={{ fontSize: 9, color: "#10b981", marginBottom: 12 }}>↑ +$420 this week</div>
          {txList.map((tx, i) => (
            <div key={tx.label} className={`ps-tx-row${visible[i] ? " ps-tx-in" : ""}`} style={{ transitionDelay: `${i * 0.06}s` }}>
              <span style={{ fontSize: 14 }}>{tx.icon}</span>
              <span style={{ flex: 1, fontSize: 9, color: "rgba(255,255,255,0.8)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tx.label}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: tx.color }}>{tx.amt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Donut spending chart */}
      <div className="ps-panel ps-donut-panel">
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Monthly Spending</div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <svg width="64" height="64" viewBox="0 0 64 64">
            {cats.map((c) => {
              const start = cumDeg;
              const sweep = (c.pct / 100) * 360;
              cumDeg += sweep;
              const r = 26, cx = 32, cy = 32;
              const toRad = (d: number) => (d * Math.PI) / 180;
              const x1 = cx + r * Math.cos(toRad(start));
              const y1 = cy + r * Math.sin(toRad(start));
              const x2 = cx + r * Math.cos(toRad(start + sweep));
              const y2 = cy + r * Math.sin(toRad(start + sweep));
              const large = sweep > 180 ? 1 : 0;
              return (
                <path key={c.label}
                  d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`}
                  fill={c.color} opacity="0.9" />
              );
            })}
            <circle cx="32" cy="32" r="16" fill="#071a3e" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {cats.map(c => (
              <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.7)" }}>{c.label} {c.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Savings goal */}
      <div className="ps-panel ps-goal-panel">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: 1 }}>Savings Goal</span>
          <span style={{ fontSize: 9, color: "#10b981", fontWeight: 700 }}>68%</span>
        </div>
        <div className="ps-progress-bar"><div className="ps-progress-fill" style={{ width: "68%", background: "#10b981" }} /></div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }}>$6,800 saved</span>
          <span style={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }}>Goal: $10,000</span>
        </div>
      </div>
    </div>
  );
}

function BusinessScene() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const vals = [48, 62, 55, 74, 68, 89];
  const [anim, setAnim] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnim(true), 300); return () => clearTimeout(t); }, []);

  return (
    <div className="ps-wrap">
      <div className="ps-glow" style={{ background: "radial-gradient(circle at 25% 35%, rgba(109,40,217,0.25) 0%,transparent 55%), radial-gradient(circle at 75% 65%, rgba(29,78,216,0.2) 0%,transparent 50%)" }} />

      {/* Revenue chart */}
      <div className="ps-panel" style={{ top: 20, left: 20, right: 20, position: "absolute" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>Monthly Revenue</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: "var(--font-head)" }}>
              $<Counter target={284600} duration={2000} /><span style={{ fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.4)" }}>/yr</span>
            </div>
          </div>
          <span style={{ fontSize: 11, color: "#10b981", fontWeight: 700, background: "rgba(16,185,129,0.12)", padding: "3px 8px", borderRadius: 100 }}>↑ 23% YoY</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 72 }}>
          {vals.map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: "100%", background: i === vals.length - 1 ? "#1d4ed8" : "rgba(29,78,216,0.35)", borderRadius: 4, transition: "height 1s cubic-bezier(.4,0,.2,1)", height: anim ? `${(v / 89) * 60}px` : "0px" }} />
              <span style={{ fontSize: 7, color: "rgba(255,255,255,0.35)" }}>{months[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transfer notification */}
      <div className="ps-panel" style={{ bottom: 90, left: 20, right: 20, position: "absolute" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(29,78,216,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🌍</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>International Transfer Sent</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>→ Barclays UK · 2 mins ago · Zero fees</div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#10b981", fontFamily: "var(--font-head)" }}>$18,400</div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ position: "absolute", bottom: 20, left: 20, right: 20, display: "flex", gap: 8 }}>
        {[
          { label: "Transactions", val: "3,840", icon: "💳" },
          { label: "Vendors Paid", val: "124", icon: "🏢" },
          { label: "Countries", val: "18", icon: "🌐" },
        ].map(s => (
          <div key={s.label} className="ps-panel" style={{ flex: 1, position: "relative", padding: "10px 12px" }}>
            <div style={{ fontSize: 14 }}>{s.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", fontFamily: "var(--font-head)" }}>{s.val}</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SavingsScene() {
  const data = [10, 15, 14, 20, 24, 22, 30, 35, 33, 42, 48, 55];
  const pts = makePts(data);

  return (
    <div className="ps-wrap">
      <div className="ps-glow" style={{ background: "radial-gradient(circle at 40% 40%, rgba(16,185,129,0.25) 0%,transparent 55%), radial-gradient(circle at 70% 70%, rgba(8,145,178,0.15) 0%,transparent 50%)" }} />

      {/* APY hero */}
      <div style={{ position: "absolute", top: 28, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>Current High Yield Rate</div>
        <div style={{ fontSize: 56, fontWeight: 900, color: "#10b981", fontFamily: "var(--font-head)", lineHeight: 1, textShadow: "0 0 40px rgba(16,185,129,0.4)" }}>4.75%</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>Annual Percentage Yield</div>
      </div>

      {/* Growth chart */}
      <div className="ps-panel" style={{ bottom: 90, left: 16, right: 16, position: "absolute" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>Savings Growth · 12 months</div>
          <span style={{ fontSize: 9, color: "#10b981", fontWeight: 700 }}>+$45,200</span>
        </div>
        <AnimSvgLine points={pts} color="#10b981" />
      </div>

      {/* Bottom panels */}
      <div style={{ position: "absolute", bottom: 20, left: 16, right: 16, display: "flex", gap: 8 }}>
        {[
          { label: "Balance", val: "$55,200", icon: "💰", color: "#10b981" },
          { label: "Interest Earned", val: "$2,614", icon: "📈", color: "#06b6d4" },
          { label: "Goal Progress", val: "89%", icon: "🎯", color: "#f59e0b" },
        ].map(s => (
          <div key={s.label} className="ps-panel" style={{ flex: 1, position: "relative", padding: "10px 12px" }}>
            <div style={{ fontSize: 14 }}>{s.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: s.color, fontFamily: "var(--font-head)" }}>{s.val}</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MortgageScene() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setProgress(34), 500);
    return () => clearTimeout(t);
  }, []);

  const steps = [
    { label: "pre approval", done: true },
    { label: "Application", done: true },
    { label: "Appraisal", done: true },
    { label: "Underwriting", done: false },
    { label: "Closing", done: false },
  ];

  return (
    <div className="ps-wrap">
      <div className="ps-glow" style={{ background: "radial-gradient(circle at 35% 35%, rgba(245,158,11,0.2) 0%,transparent 55%), radial-gradient(circle at 70% 70%, rgba(29,78,216,0.15) 0%,transparent 50%)" }} />

      {/* House SVG */}
      <div style={{ position: "absolute", top: 22, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <svg width="100" height="88" viewBox="0 0 100 88" fill="none">
          <polygon points="50,6 95,42 5,42" fill="rgba(245,158,11,0.6)" stroke="rgba(245,158,11,0.9)" strokeWidth="1.5" />
          <rect x="14" y="42" width="72" height="42" rx="3" fill="rgba(29,78,216,0.5)" stroke="rgba(29,78,216,0.8)" strokeWidth="1" />
          <rect x="28" y="52" width="16" height="16" rx="2" fill="rgba(255,255,255,0.2)" />
          <rect x="56" y="52" width="16" height="16" rx="2" fill="rgba(255,255,255,0.2)" />
          <rect x="39" y="58" width="22" height="26" rx="2" fill="rgba(255,255,255,0.1)" />
          <circle cx="50" cy="24" r="4" fill="rgba(255,255,255,0.6)" className="ps-pulse-dot" />
        </svg>
      </div>

      {/* Rate panel */}
      <div className="ps-panel" style={{ top: 120, left: 16, position: "absolute", minWidth: 130 }}>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>30-Year Fixed Rate</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: "#f59e0b", fontFamily: "var(--font-head)", lineHeight: 1 }}>3.5%</div>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>APR · No hidden fees</div>
      </div>

      {/* Payment breakdown */}
      <div className="ps-panel" style={{ top: 120, right: 16, position: "absolute", minWidth: 130 }}>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Est. Monthly Payment</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: "var(--font-head)", lineHeight: 1 }}>$1,847</div>
        <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>On $380k loan · 30yr</div>
      </div>

      {/* Approval progress steps */}
      <div className="ps-panel" style={{ bottom: 20, left: 16, right: 16, position: "absolute" }}>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Application Progress</div>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {steps.map((s, i) => (
            <div key={s.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                {i > 0 && <div style={{ flex: 1, height: 2, background: i <= 3 ? "#10b981" : "rgba(255,255,255,0.1)" }} />}
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: s.done ? "#10b981" : "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: 700, flexShrink: 0 }}>
                  {s.done ? "✓" : i + 1}
                </div>
                {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: s.done ? "#10b981" : "rgba(255,255,255,0.1)" }} />}
              </div>
              <span style={{ fontSize: 7, color: s.done ? "#10b981" : "rgba(255,255,255,0.35)", textAlign: "center" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InsuranceScene() {
  return (
    <div className="ps-wrap">
      <div className="ps-glow" style={{ background: "radial-gradient(circle at 50% 45%, rgba(8,145,178,0.3) 0%,transparent 55%), radial-gradient(circle at 70% 70%, rgba(29,78,216,0.15) 0%,transparent 50%)" }} />

      {/* Pulsing shield */}
      <div style={{ position: "absolute", top: 18, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 100, height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {[50, 68, 86].map((r, i) => (
            <div key={r} className="ps-ring" style={{ position: "absolute", width: r, height: r, borderRadius: "50%", border: `1.5px solid rgba(8,145,178,${0.5 - i * 0.15})`, animationDelay: `${i * 0.5}s` }} />
          ))}
          <svg width="52" height="60" viewBox="0 0 52 60" fill="none" style={{ filter: "drop-shadow(0 0 12px rgba(8,145,178,0.6))" }}>
            <path d="M26 2 L50 12 L50 30 C50 44 38 54 26 58 C14 54 2 44 2 30 L2 12 Z" fill="rgba(8,145,178,0.25)" stroke="#0891b2" strokeWidth="2" />
            <path d="M16 30 L23 37 L36 23" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Status */}
      <div style={{ position: "absolute", top: 128, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Fully Protected</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>All policies active · Renews Dec 2026</div>
      </div>

      {/* Coverage cards */}
      <div style={{ position: "absolute", bottom: 20, left: 16, right: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { icon: "🏠", label: "Home Insurance", coverage: "$500,000", status: "Active", color: "#10b981" },
          { icon: "🚗", label: "Auto Insurance", coverage: "$100,000", status: "Active", color: "#10b981" },
          { icon: "❤️", label: "Life Insurance", coverage: "$1,000,000", status: "Active", color: "#10b981" },
        ].map(c => (
          <div key={c.label} className="ps-panel" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", position: "relative" }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{c.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>{c.label}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>Coverage: {c.coverage}</div>
            </div>
            <span style={{ fontSize: 9, color: c.color, fontWeight: 700, background: `rgba(16,185,129,0.12)`, padding: "2px 8px", borderRadius: 100 }}>{c.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CardsScene() {
  const cards = [
    { name: "Nexsus Platinum", gradient: ["#1e3a5f", "#0d2060"], cashback: "3%", reward: "Travel Miles" },
    { name: "Nexsus Gold", gradient: ["#b45309", "#d97706"], cashback: "2%", reward: "Cash Back" },
    { name: "Nexsus Classic", gradient: ["#1d4ed8", "#0891b2"], cashback: "1.5%", reward: "Points" },
  ];

  return (
    <div className="ps-wrap">
      <div className="ps-glow" style={{ background: "radial-gradient(circle at 40% 30%, rgba(245,158,11,0.2) 0%,transparent 55%), radial-gradient(circle at 65% 70%, rgba(29,78,216,0.2) 0%,transparent 50%)" }} />

      {/* Stacked cards */}
      <div style={{ position: "absolute", top: 18, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 240, height: 148 }}>
          {cards.map((card, i) => (
            <div key={card.name} className="ps-card-stack" style={{
              position: "absolute",
              width: 220 - i * 10,
              height: 130,
              left: i * 10,
              top: i * 6,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${card.gradient[0]}, ${card.gradient[1]})`,
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              animationDelay: `${i * 0.15}s`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>{card.name}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.12)", padding: "2px 8px", borderRadius: 100 }}>{card.cashback}</div>
              </div>
              {i === 0 && (
                <>
                  <div style={{ fontFamily: "'Courier New',monospace", fontSize: 11, color: "rgba(255,255,255,0.7)", letterSpacing: 1.5 }}>**** **** **** 9841</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.55)" }}>JOHN A. DOE · 08/29</span>
                    <svg width="32" height="20" viewBox="0 0 60 38">
                      <circle cx="22" cy="19" r="14" fill="#eb001b" opacity="0.9" />
                      <circle cx="38" cy="19" r="14" fill="#f79e1b" opacity="0.9" />
                    </svg>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Rewards counter */}
      <div style={{ position: "absolute", bottom: 90, left: 16, right: 16, display: "flex", gap: 8 }}>
        {[
          { label: "Rewards Points", val: 24850, icon: "⭐", color: "#f59e0b" },
          { label: "Cash Back", val: 284, prefix: "$", icon: "💵", color: "#10b981" },
        ].map(r => (
          <div key={r.label} className="ps-panel" style={{ flex: 1, position: "relative", padding: "12px 14px" }}>
            <div style={{ fontSize: 16 }}>{r.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: r.color, fontFamily: "var(--font-head)" }}>
              {r.prefix || ""}<Counter target={r.val} duration={2000} />
            </div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }}>{r.label}</div>
          </div>
        ))}
      </div>

      {/* Bottom benefits */}
      <div className="ps-panel" style={{ bottom: 18, left: 16, right: 16, position: "absolute", display: "flex", justifyContent: "space-around", padding: "10px 16px" }}>
        {["0% Intro APR", "No Annual Fee", "Fraud Protection", "Instant Freeze"].map(b => (
          <div key={b} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 7, color: "#10b981", marginBottom: 1 }}>✓</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{b}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoansScene() {
  const [fundPct, setFundPct] = useState(0);
  useEffect(() => { const t = setTimeout(() => setFundPct(72), 500); return () => clearTimeout(t); }, []);
  const steps = ["Application", "Verification", "Approval", "Funding"];
  const radius = 44, circ = 2 * Math.PI * radius;

  return (
    <div className="ps-wrap">
      <div className="ps-glow" style={{ background: "radial-gradient(circle at 35% 35%, rgba(109,40,217,0.2) 0%,transparent 55%), radial-gradient(circle at 70% 70%, rgba(29,78,216,0.2) 0%,transparent 50%)" }} />

      {/* Radial gauge */}
      <div style={{ position: "absolute", top: 18, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
            <circle cx="60" cy="60" r={radius} fill="none" stroke="url(#loan-grad)" strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ - (fundPct / 100) * circ}
              style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)" }} />
            <defs>
              <linearGradient id="loan-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position: "absolute", textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", fontFamily: "var(--font-head)", lineHeight: 1 }}>{fundPct}%</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }}>Approved</div>
          </div>
        </div>
      </div>

      {/* Loan amount */}
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase" }}>Loan Amount Funded</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: "#7c3aed", fontFamily: "var(--font-head)" }}>
          $<Counter target={250000} duration={2200} />
        </div>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>of $350,000 requested</div>
      </div>

      {/* Steps */}
      <div className="ps-panel" style={{ bottom: 18, left: 16, right: 16, position: "absolute", padding: "14px 16px" }}>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Approval Process</div>
        <div style={{ display: "flex", gap: 0 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                {i > 0 && <div style={{ flex: 1, height: 2, background: i <= 2 ? "#7c3aed" : "rgba(255,255,255,0.1)" }} />}
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: i <= 2 ? "#7c3aed" : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", flexShrink: 0 }}>
                  {i <= 2 ? "✓" : i + 1}
                </div>
                {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: i < 2 ? "#7c3aed" : "rgba(255,255,255,0.1)" }} />}
              </div>
              <span style={{ fontSize: 7, color: i <= 2 ? "#7c3aed" : "rgba(255,255,255,0.3)", textAlign: "center" }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutScene() {
  const stats = [
    { val: 18, suffix: "+", label: "Years Established", icon: "🏛️", color: "#1d4ed8" },
    { val: 13, suffix: "M+", label: "Customers Served", icon: "👥", color: "#10b981" },
    { val: 42, suffix: "", label: "Countries Reached", icon: "🌍", color: "#0891b2" },
    { val: 99, suffix: ".9%", label: "Uptime SLA", icon: "⚡", color: "#f59e0b" },
  ];

  return (
    <div className="ps-wrap">
      <div className="ps-glow" style={{ background: "radial-gradient(circle at 50% 40%, rgba(29,78,216,0.25) 0%,transparent 55%), radial-gradient(circle at 30% 70%, rgba(8,145,178,0.2) 0%,transparent 50%)" }} />

      {/* Globe SVG */}
      <div style={{ position: "absolute", top: 18, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 120, height: 120 }}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(29,78,216,0.3)" strokeWidth="1.5" />
            <ellipse cx="60" cy="60" rx="26" ry="50" fill="none" stroke="rgba(29,78,216,0.25)" strokeWidth="1" />
            <ellipse cx="60" cy="60" rx="50" ry="20" fill="none" stroke="rgba(29,78,216,0.25)" strokeWidth="1" />
            <ellipse cx="60" cy="60" rx="50" ry="36" fill="none" stroke="rgba(29,78,216,0.15)" strokeWidth="1" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(8,145,178,0.5)" strokeWidth="2" className="ps-globe-spin" />
            {[[45,38],[75,52],[55,72],[85,40],[38,60],[68,30]].map(([x,y],i) => (
              <circle key={i} cx={x} cy={y} r="3" fill="#0891b2" opacity="0.8" className="ps-dot-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
            ))}
            {[[45,38,75,52],[75,52,85,40],[55,72,68,30],[38,60,55,72]].map(([x1,y1,x2,y2],i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(8,145,178,0.3)" strokeWidth="1" />
            ))}
          </svg>
        </div>
      </div>

      {/* Mission statement */}
      <div style={{ position: "absolute", top: 148, left: 16, right: 16, textAlign: "center" }}>
        <div style={{ fontSize: 11, fontStyle: "italic", color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
          "Empowering financial freedom for everyone, everywhere."
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ position: "absolute", bottom: 18, left: 16, right: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {stats.map(s => (
          <div key={s.label} className="ps-panel" style={{ position: "relative", padding: "12px 14px" }}>
            <div style={{ fontSize: 16, marginBottom: 2 }}>{s.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.color, fontFamily: "var(--font-head)" }}>
              <Counter target={s.val} duration={1800} />{s.suffix}
            </div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── main export ─────────────────────────────────────── */
export default function PageScene({ theme }: { theme: PageSceneTheme }) {
  return (
    <>
      {theme === "personal"  && <PersonalScene />}
      {theme === "business"  && <BusinessScene />}
      {theme === "savings"   && <SavingsScene />}
      {theme === "mortgage"  && <MortgageScene />}
      {theme === "insurance" && <InsuranceScene />}
      {theme === "cards"     && <CardsScene />}
      {theme === "loans"     && <LoansScene />}
      {theme === "about"     && <AboutScene />}
    </>
  );
}
