import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, createFileRoute } from "@tanstack/react-router";
import {
  Bell, User, Eye, EyeOff, Moon, Sun,
  ArrowUpRight, ArrowLeftRight, Building2, Bitcoin,
  Receipt, UserPlus, FileCheck, Settings,
  Home as HomeIcon, CreditCard, Headphones,
  ChevronLeft, ChevronRight, TrendingUp, Send,
  Activity,
} from "lucide-react";
import { useUserAuth } from "../dashboard/hooks/useUserAuth";
import { useUserAccount } from "../dashboard/hooks/useUserAccount";
import { useUserTransactions } from "../dashboard/hooks/useUserTransactions";
import { useTheme } from "../hooks/use-theme";
import { useLanguage } from "../hooks/use-language";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { ADMIN_UID } from "../config/adminConfig";
import { formatInCurrency, getCurrencySymbol, type CurrencyCode } from "../utils/currency";
import { isTransactionCredit } from "../routes/transactions";

// Inject animation keyframes once
const ANIM_STYLES = `
@keyframes nx-fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
@keyframes nx-fadeDown { from{opacity:0;transform:translateY(-18px)} to{opacity:1;transform:translateY(0)} }
@keyframes nx-scaleIn  { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
@keyframes nx-fadeIn   { from{opacity:0} to{opacity:1} }
@keyframes nx-slideLeft{ from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
@keyframes nx-pulse-slow { 0%,100%{opacity:0.15;transform:scale(1)} 50%{opacity:0.30;transform:scale(1.12)} }
@keyframes nx-float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
@keyframes nx-shimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
@keyframes nx-spin-slow{ from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
`;

if (typeof document !== "undefined") {
  const id = "nx-home-anims";
  if (!document.getElementById(id)) {
    const s = document.createElement("style");
    s.id = id;
    s.textContent = ANIM_STYLES;
    document.head.appendChild(s);
  }
}

function a(name: string, delay = 0, duration = 0.55, fill: "both"|"forwards" = "both") {
  return { animation: `${name} ${duration}s cubic-bezier(0.22,1,0.36,1) ${delay}s ${fill}`, opacity: 0 };
}

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexus Bank - Mobile Banking" },
      { description: "Manage your accounts, transfers, deposits, and bills with Nexus Bank." },
    ],
  }),
  component: HomePage,
});

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

function HomePage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useUserAuth();
  const { account, loading: accountLoading } = useUserAccount();
  const { transactions, loading: txLoading } = useUserTransactions();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const currency: CurrencyCode = (account?.dashboardCurrency as CurrencyCode) || "USD";
  const currencySymbol = getCurrencySymbol(currency);

  // Quick links — Cards replaces Transaction History
  const quickLinks = [
    { label: t("Wire Transfer"),     icon: ArrowUpRight,   to: "/wire-transfer",     color: "#38BDF8" },
    { label: t("Local Transfer"),    icon: ArrowLeftRight, to: "/local-transfer",    color: "#6366F1" },
    { label: t("Internal Transfer"), icon: Building2,      to: "/internal-transfer", color: "#A855F7" },
    { label: t("Buy Crypto"),        icon: Bitcoin,        to: "/buy-crypto",        color: "#F59E0B" },
    { label: t("Pay Bills"),         icon: Receipt,        to: "/pay-bills",         color: "#10B981" },
    { label: t("Add Beneficiary"),   icon: UserPlus,       to: "/add-beneficiary",   color: "#EC4899" },
    { label: t("Transactions"),      icon: Activity,       to: "/transactions",      color: "#38BDF8" },
    { label: t("Crypto Deposit"),    icon: Bitcoin,        to: "/crypto-deposit",    color: "#F97316" },
    { label: t("Check Deposit"),     icon: FileCheck,      to: "/check-deposit",     color: "#14B8A6" },
  ];

  const [balanceVisible, setBalanceVisible] = useState(true);
  const [currentAccount, setCurrentAccount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [cardSlideDir, setCardSlideDir] = useState<"left"|"right"|null>(null);

  // Trigger mount animations
  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  const switchAccount = (dir: "next" | "prev") => {
    if (dir === "next" && currentAccount < accounts.length - 1) {
      setCardSlideDir("left");
      setTimeout(() => { setCurrentAccount((p) => p + 1); setCardSlideDir(null); }, 220);
    }
    if (dir === "prev" && currentAccount > 0) {
      setCardSlideDir("right");
      setTimeout(() => { setCurrentAccount((p) => p - 1); setCardSlideDir(null); }, 220);
    }
  };

  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 30) {
      if (diff > 0) switchAccount("next");
      else switchAccount("prev");
    }
    touchStartX.current = null;
  };

  // Theme
  const dark = theme === "dark";
  const pageBg   = dark ? "#0A0F1E" : "#F0F4FF";
  const cardBg   = dark ? "#111827" : "#FFFFFF";
  const textPrimary = dark ? "#FFFFFF" : "#0D1B2A";
  const textMuted   = dark ? "#8A9BB5" : "#64748B";
  const accentCyan  = "#38BDF8";
  const mutedBg     = dark ? "#1E2A3A" : "#E8F0FE";

  useEffect(() => {
    if (!authLoading && !user) {
      const isAdminPWA =
        window.matchMedia("(display-mode: standalone)").matches &&
        (document.referrer.includes("/admin") || localStorage.getItem("nexus-pwa-type") === "admin");
      navigate({ to: isAdminPWA ? "/admin-login" : "/login" });
    }
  }, [authLoading, user, navigate]);

  // Presence tracking
  useEffect(() => {
    if (!user?.uid || !account) return;
    const userName = account.fullName || user.email || "A user";
    const sessionKey = `nexus-presence-${user.uid}`;

    const notifyPresence = async (action: string) => {
      try {
        await addDoc(collection(db, "notifications"), {
          recipientId: ADMIN_UID, recipientType: "admin", type: "user_activity",
          title: `${userName} ${action} the app`, message: `${userName} has ${action.toLowerCase()} the banking app`,
          userId: user.uid, userFullName: userName, amount: 0, transactionType: "presence",
          status: "unread", declineReason: null, createdAt: serverTimestamp(), readAt: null,
        });
        try {
          await addDoc(collection(db, "chats", user.uid, "messages"), {
            text: action === "entered" ? `🟢 ${userName} is now online` : `⚫ ${userName} has gone offline`,
            sender: "system", createdAt: serverTimestamp(), readByUser: true, readByAdmin: false, isPresence: true,
          });
          await updateDoc(doc(db, "chats", user.uid), {
            lastMessage: action === "entered" ? `🟢 ${userName} is now online` : `⚫ ${userName} has gone offline`,
            lastMessageAt: serverTimestamp(), userFullName: userName, userEmail: user.email || "", status: "active",
          });
        } catch { /* non-critical */ }
      } catch { /* non-critical */ }
    };

    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, "1");
      notifyPresence("entered");
    }

    let exitFired = false;
    const handleExit = (action: string) => {
      if (exitFired) return;
      exitFired = true;
      sessionStorage.removeItem(sessionKey);
      notifyPresence(action);
    };

    const handleBeforeUnload = () => handleExit("left");
    const handleVisibilityChange = () => { if (document.visibilityState === "hidden") handleExit("exited"); };
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user?.uid, account?.fullName]);

  const accounts = account ? [
    { id: 1, label: "Checking Account", number: account.checkingAccountNumber || "---", balance: account.checkingBalance || 0, status: account.status || "active" },
    { id: 2, label: "Savings Account",  number: account.savingsAccountNumber  || "---", balance: account.savingsBalance  || 0, status: account.status || "active" },
  ] : [];

  const accountData = accounts[currentAccount];
  const recentTx = transactions.slice(0, 3);

  if (authLoading || accountLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: pageBg }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: "rgba(56,189,248,0.3)", borderTopColor: "#38BDF8" }} />
          <p className="text-sm font-semibold" style={{ color: "#38BDF8" }}>Loading...</p>
        </div>
      </div>
    );
  }
  if (!user) return null;

  const photoURL = account?.photoURL || null;
  const initials = (account?.fullName || "U").split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
  const cardSlideStyle = cardSlideDir
    ? { animation: `nx-slideLeft 0.22s cubic-bezier(0.22,1,0.36,1) both${cardSlideDir === "right" ? " reverse" : ""}` }
    : (mounted ? { animation: "nx-scaleIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both", opacity: 0 } : { opacity: 0 } as any);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: pageBg, width: "100%", maxWidth: "100vw", overflowX: "hidden" }}>
      <div className="relative overflow-hidden"
        style={{ background: dark ? "linear-gradient(160deg,#0D1829 0%,#1a2744 100%)" : "linear-gradient(160deg,#1240A0 0%,#1E6FDB 100%)" }}>
        <div className="absolute top-6 right-6 w-36 h-36 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(56,189,248,0.22),transparent 70%)", animation: "nx-pulse-slow 4s ease-in-out infinite" }} />
        <div className="absolute top-28 left-3 w-24 h-24 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(99,102,241,0.18),transparent 70%)", animation: "nx-pulse-slow 5.5s ease-in-out 1.5s infinite" }} />
        <div className="absolute bottom-20 right-20 w-16 h-16 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(168,85,247,0.18),transparent 70%)", animation: "nx-float 3.5s ease-in-out infinite" }} />
        <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full border border-white/5 pointer-events-none" style={{ animation: "nx-spin-slow 22s linear infinite" }} />
        <div className="absolute -bottom-12 -left-12 w-52 h-52 rounded-full border border-white/5 pointer-events-none" style={{ animation: "nx-spin-slow 32s linear infinite reverse" }} />
        <div className="px-5 pt-12 pb-4 flex items-center justify-between relative z-10"
          style={mounted ? { animation: "nx-fadeDown 0.5s cubic-bezier(0.22,1,0.36,1) both", opacity: 0 } : { opacity: 0 }}>
          <div className="flex items-center gap-3">
            <Link to="/profile">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/30 flex items-center justify-center" style={{ background: "#EF4444", boxShadow: "0 0 0 3px rgba(255,255,255,0.12)" }}>
                {photoURL ? <img src={photoURL} alt="Profile" className="w-full h-full object-cover" /> : <span className="text-white font-bold text-sm">{initials}</span>}
              </div>
            </Link>
            <div>
              <p className="text-white/60 text-xs">{getGreeting()},</p>
              <p className="text-white font-bold text-base leading-tight">{account?.fullName?.split(" ")[0] || "User"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2" style={mounted ? { animation: "nx-fadeIn 0.4s 0.15s both", opacity: 0 } : { opacity: 0 }}>
            {/* Theme toggle */}
            <button onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-90"
              style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}>
              {dark ? <Sun size={17} style={{ color: "white" }} /> : <Moon size={17} style={{ color: "white" }} />}
            </button>
            {/* Notifications */}
            <Link to="/notifications" className="relative">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}>
                <Bell size={18} style={{ color: "white" }} />
              </div>
              <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ background: "#FFAB00" }} />
            </Link>
          </div>
        </div>
        <div className="px-5 pb-8 relative z-10">
          {/* ── Total Balance mini bar ─────────────────────────────── */}
          <div className="mb-4 px-1"
            style={mounted ? { animation: "nx-fadeDown 0.45s cubic-bezier(0.22,1,0.36,1) 0.05s both", opacity: 0 } : { opacity: 0 }}>
            <div className="flex items-center justify-between px-4 py-3 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.10)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.18)" }}>
              <div>
                <p className="text-white/55 text-xs tracking-wide uppercase">Total Balance</p>
                <p className="text-white font-bold font-mono leading-tight mt-0.5"
                  style={{ fontSize: "clamp(0.9rem, 4vw, 1.3rem)" }}>
                  {balanceVisible
                    ? formatInCurrency(accounts.reduce((s, a) => s + a.balance, 0), currency)
                    : `${currencySymbol}••••••••`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/45 text-xs">{accounts.length} account{accounts.length !== 1 ? "s" : ""}</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: "#00E676" }}>● All Active</p>
              </div>
            </div>
          </div>

          <div className="relative" style={{ paddingLeft: "28px", paddingRight: "28px" }}>
            {currentAccount > 0 && (
              <button onClick={() => switchAccount("prev")} className="absolute top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full shadow-lg" style={{ left: "-4px", width: "36px", height: "36px", background: "rgba(255,255,255,0.25)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.25)" }}>
                <ChevronLeft size={20} style={{ color: "white" }} />
              </button>
            )}
            {currentAccount < accounts.length - 1 && (
              <button onClick={() => switchAccount("next")} className="absolute top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full shadow-lg" style={{ right: "-4px", width: "36px", height: "36px", background: "rgba(255,255,255,0.25)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.25)" }}>
                <ChevronRight size={20} style={{ color: "white" }} />
              </button>
            )}
            <div className="w-full rounded-3xl p-6 relative" style={{ background: dark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.18)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.25)", boxShadow: "0 24px 64px rgba(0,0,0,0.3)", ...cardSlideStyle }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.07) 50%,transparent 60%)", backgroundSize: "200% 100%", animation: "nx-shimmer 3s linear infinite" }} />
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                {[...Array(4)].map((_, i) => (<div key={i} className="absolute rounded-full border border-white" style={{ width: 70 + i * 55, height: 70 + i * 55, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />))}
              </div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white/60 text-xs tracking-widest uppercase">FIAT BALANCE</p>
                    <p className="text-white text-sm font-bold mt-0.5">{accountData?.label || "Account"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/50 text-xs">**** {accountData?.number?.slice(-4) || "----"}</p>
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: "rgba(0,230,118,0.2)", color: "#00E676" }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      {(accountData?.status || "active").toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="text-white/50 text-xs mb-1">Available Funds</p>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-white font-bold font-mono balance-figure" style={{ textShadow: "0 2px 12px rgba(56,189,248,0.25)", fontSize: "clamp(1rem, 5vw, 1.9rem)", wordBreak: "break-all", overflowWrap: "anywhere", maxWidth: "calc(100% - 40px)", display: "block" }}>
                    {balanceVisible ? formatInCurrency(accountData?.balance || 0, currency) : `${currencySymbol}��������`}
                  </span>
                  <button onClick={() => setBalanceVisible(!balanceVisible)} className="p-1.5 rounded-full transition-transform active:scale-90" style={{ background: "rgba(255,255,255,0.15)" }}>
                    {balanceVisible ? <EyeOff size={14} color="white" /> : <Eye size={14} color="white" />}
                  </button>
                </div>
                <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
                  <span className="text-white/50 text-xs">Account Status</span>
                  <span className="text-xs font-semibold" style={{ color: "#00E676" }}>� {(accountData?.status || "active").charAt(0).toUpperCase() + (accountData?.status || "active").slice(1)}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-1.5 mt-3">
              {accounts.map((_, i) => (<button key={i} onClick={() => setCurrentAccount(i)} className="rounded-full transition-all duration-300" style={{ width: i === currentAccount ? "20px" : "6px", height: "6px", background: i === currentAccount ? "white" : "rgba(255,255,255,0.4)" }} />))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 rounded-t-[28px] -mt-4 relative z-10 px-5 pt-6 pb-24" style={{ background: pageBg }}>
        <div className="mb-6" style={mounted ? { animation: "nx-fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.45s both", opacity: 0 } : { opacity: 0 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold" style={{ color: textPrimary }}>{t("Quick Links")}</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {quickLinks.map(({ label, icon: Icon, to, color }) => (
              <Link key={label} to={to} className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all active:scale-95 hover:scale-105 ql-item" style={{ background: dark ? "rgba(255,255,255,0.04)" : "#F8FAFF", border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(56,189,248,0.12)"}` }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <span className="text-xs font-medium text-center leading-tight" style={{ color: textMuted }}>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div style={mounted ? { animation: "nx-fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.6s both", opacity: 0 } : { opacity: 0 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold" style={{ color: textPrimary }}>Recent Transactions</h2>
            <Link to="/transactions" className="text-sm font-semibold" style={{ color: accentCyan }}>View All</Link>
          </div>
          {txLoading ? (
            <div className="space-y-3">
              {[1,2,3].map((i) => (<div key={i} className="h-16 rounded-2xl" style={{ background: `linear-gradient(90deg,${mutedBg} 25%,${dark?"#243450":"#E2EAFF"} 50%,${mutedBg} 75%)`, backgroundSize: "200% 100%", animation: "nx-shimmer 1.5s linear infinite" }} />))}
            </div>
          ) : recentTx.length === 0 ? (
            <div className="p-6 rounded-2xl text-center" style={{ background: dark ? "rgba(255,255,255,0.03)" : "#F8FAFF" }}>
              <p className="text-sm" style={{ color: textMuted }}>No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTx.map((tx: any, idx: number) => {
                const isCredit = isTransactionCredit(tx);
                const desc = tx.description || tx.type?.replace(/_/g, " ") || "Transaction";
                const timeStr = tx.createdAt instanceof Date
                  ? tx.createdAt.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) + ", " + tx.createdAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                  : "�";
                return (
                  <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl transition-all tx-row" style={{ background: dark ? "rgba(255,255,255,0.04)" : "#F8FAFF", border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"}`, animation: mounted ? `nx-fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) ${0.65+idx*0.08}s both` : "none", opacity: mounted ? 0 : 1 }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: isCredit ? "rgba(0,230,118,0.15)" : "rgba(255,77,106,0.15)" }}>
                        {isCredit ? <TrendingUp size={18} style={{ color: "#00E676" }} /> : <Send size={18} style={{ color: "#FF4D6A" }} />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: textPrimary }}>{desc}</p>
                        <p className="text-xs" style={{ color: textMuted }}>{timeStr}</p>
                      </div>
                    </div>
                    <p className="text-sm font-mono font-bold" style={{ color: isCredit ? "#00E676" : "#FF4D6A" }}>
                      {isCredit ? "+" : "-"}{formatInCurrency(tx.amount || 0, currency)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t" style={{ background: dark ? "#0A0F1E" : "#FFFFFF", borderColor: dark ? "rgba(255,255,255,0.08)" : "#E5E7EB", boxShadow: dark ? "0 -4px 24px rgba(0,0,0,0.4)" : "0 -4px 24px rgba(0,0,0,0.06)" }}>
        <div className="flex items-center justify-around px-2 py-2">
          {[
            { label: t("Settings"), icon: Settings, to: "/settings" },
            { label: t("Transfer"), icon: ArrowUpRight, to: "/local-transfer" },
            { label: t("Home"), icon: HomeIcon, to: "/", active: true },
            { label: t("Transactions"), icon: Activity, to: "/transactions" },
            { label: t("Support"), icon: Headphones, to: "/support" },
          ].map(({ label, icon: Icon, to, active }: any) => (
            <Link key={label} to={to} className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all min-w-0" style={{ background: active ? (dark ? "rgba(56,189,248,0.15)" : "rgba(56,189,248,0.12)") : "transparent" }}>
              <Icon size={22} style={{ color: active ? accentCyan : (dark ? "#8A9BB5" : "#9CA3AF") }} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-xs font-medium" style={{ color: active ? accentCyan : (dark ? "#8A9BB5" : "#9CA3AF") }}>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}