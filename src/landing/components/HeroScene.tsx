import { useEffect, useRef, useState } from "react";

const CARD_COLORS = [
  ["#1d4ed8", "#0891b2"],
  ["#0d2560", "#1d4ed8"],
  ["#071a3e", "#0891b2"],
];

const TRANSACTIONS = [
  { icon: "✈️", label: "Delta Airlines", amount: "-$342.00", color: "#ef4444" },
  { icon: "📈", label: "Investment Credit", amount: "+$1,240.00", color: "#10b981" },
  { icon: "🏠", label: "Mortgage Payment", amount: "-$2,100.00", color: "#f59e0b" },
  { icon: "💼", label: "Salary Deposit", amount: "+$6,500.00", color: "#10b981" },
  { icon: "🛒", label: "Amazon Purchase", amount: "-$89.99", color: "#ef4444" },
  { icon: "📊", label: "Dividend Income", amount: "+$480.00", color: "#10b981" },
  { icon: "🎯", label: "Transfer Received", amount: "+$2,400.00", color: "#10b981" },
];

const CHART_POINTS = [
  40, 55, 45, 62, 58, 70, 65, 78, 72, 85, 80, 88, 84, 92, 89, 95,
];

function AnimatedBalance({ target }: { target: number }) {
  const [display, setDisplay] = useState(target - 4820);
  useEffect(() => {
    let current = target - 4820;
    const step = () => {
      current += Math.ceil((target - current) * 0.04);
      setDisplay(current);
      if (current < target) setTimeout(step, 30);
    };
    const timeout = setTimeout(step, 600);
    return () => clearTimeout(timeout);
  }, [target]);
  return (
    <span>{display.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>
  );
}

export default function HeroScene() {
  const [txIdx, setTxIdx] = useState(0);
  const [txVisible, setTxVisible] = useState(true);
  const [cardColor] = useState(() => CARD_COLORS[Math.floor(Math.random() * CARD_COLORS.length)]);
  const svgRef = useRef<SVGPolylineElement>(null);

  // Rotate transactions
  useEffect(() => {
    const interval = setInterval(() => {
      setTxVisible(false);
      setTimeout(() => {
        setTxIdx((i) => (i + 1) % TRANSACTIONS.length);
        setTxVisible(true);
      }, 400);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // Animate SVG chart path
  useEffect(() => {
    if (!svgRef.current) return;
    svgRef.current.style.strokeDashoffset = "500";
    svgRef.current.style.strokeDasharray = "500";
    const anim = svgRef.current.animate(
      [{ strokeDashoffset: "500" }, { strokeDashoffset: "0" }],
      { duration: 1800, easing: "ease-out", fill: "forwards", delay: 300 }
    );
    return () => anim.cancel();
  }, []);

  const tx = TRANSACTIONS[txIdx];
  const w = 260;
  const h = 80;
  const maxP = Math.max(...CHART_POINTS);
  const points = CHART_POINTS.map(
    (p, i) => `${(i / (CHART_POINTS.length - 1)) * (w - 12) + 6},${h - 8 - ((p / maxP) * (h - 20))}`
  ).join(" ");

  return (
    <div className="hero-scene-wrap">
      {/* Glow backdrop */}
      <div className="hero-scene-glow" />

      {/* Credit Card */}
      <div className="hero-card-3d">
        <div
          className="hero-card"
          style={{ background: `linear-gradient(135deg, ${cardColor[0]}, ${cardColor[1]})` }}
        >
          {/* Card chip */}
          <div className="card-chip">
            <div className="card-chip-lines">
              <div /><div /><div /><div />
            </div>
          </div>

          {/* Contactless symbol */}
          <div className="card-nfc">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              {[6,10,14].map((r,i) => (
                <path key={i} d={`M ${12-r} 6 Q ${12} 12 ${12-r} 18`}
                  stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"
                  strokeLinecap="round" fill="none"
                  style={{ animationDelay: `${i * 0.15}s` }}
                  className="nfc-arc"
                />
              ))}
            </svg>
          </div>

          {/* Card number */}
          <div className="card-number">
            <span>****</span><span>****</span><span>****</span><span>4284</span>
          </div>

          {/* Card footer */}
          <div className="card-footer">
            <div>
              <div className="card-field-label">Card Holder</div>
              <div className="card-field-val">JOHN A. DOE</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="card-field-label">Expires</div>
              <div className="card-field-val">12/28</div>
            </div>
            <svg width="40" height="26" viewBox="0 0 60 38" style={{ opacity: 0.85 }}>
              <circle cx="22" cy="19" r="16" fill="#eb001b" opacity="0.9" />
              <circle cx="38" cy="19" r="16" fill="#f79e1b" opacity="0.9" />
              <path d="M30 7 Q36 19 30 31 Q24 19 30 7Z" fill="#ff5f00" opacity="0.95" />
            </svg>
          </div>

          {/* Shimmer overlay */}
          <div className="card-shimmer" />
        </div>
      </div>

      {/* Balance panel */}
      <div className="scene-panel scene-balance">
        <div className="scene-panel-label">Total Balance</div>
        <div className="scene-balance-val">
          <AnimatedBalance target={48294} />
        </div>
        <div className="scene-balance-change">
          <span className="up-arrow">↑</span> +4.2% this month
        </div>
      </div>

      {/* Chart panel */}
      <div className="scene-panel scene-chart-panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div className="scene-panel-label">Portfolio Growth</div>
          <span style={{ fontSize: 11, color: "#10b981", fontWeight: 700 }}>+12.4% YTD</span>
        </div>
        <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline
            points={points + ` ${w - 6},${h} 6,${h}`}
            fill="url(#chart-fill)"
          />
          <polyline
            ref={svgRef}
            points={points}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Last dot */}
          <circle
            cx={parseFloat(points.split(" ").at(-1)!.split(",")[0])}
            cy={parseFloat(points.split(" ").at(-1)!.split(",")[1])}
            r="4"
            fill="#06b6d4"
            className="chart-dot-pulse"
          />
        </svg>
      </div>

      {/* Transaction notification */}
      <div className={`scene-tx-card${txVisible ? " tx-show" : " tx-hide"}`}>
        <div className="tx-icon">{tx.icon}</div>
        <div className="tx-info">
          <div className="tx-label">{tx.label}</div>
          <div className="tx-sub">Just now · Nexsus Bank</div>
        </div>
        <div className="tx-amount" style={{ color: tx.color }}>{tx.amount}</div>
      </div>

      {/* Security badge */}
      <div className="scene-security">
        <div className="security-ring">
          <svg width="36" height="36" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(6,182,212,0.25)" strokeWidth="2" />
            <circle cx="18" cy="18" r="15" fill="none" stroke="#06b6d4" strokeWidth="2"
              strokeDasharray="94.2" strokeDashoffset="28" strokeLinecap="round"
              className="security-progress" />
          </svg>
          <span style={{ fontSize: 14, position: "absolute" }}>🔒</span>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>Bank-Grade Security</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginTop: 1 }}>256-bit Encrypted</div>
        </div>
      </div>
    </div>
  );
}
