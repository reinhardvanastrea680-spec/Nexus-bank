import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, createFileRoute } from "@tanstack/react-router";
import {
  Bell, User, Eye, EyeOff, Copy,
  ArrowUpRight, ArrowLeftRight, Building2, Bitcoin,
  Receipt, UserPlus, FileCheck, Settings,
  Home as HomeIcon, Headphones, CreditCard,
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
  const { theme } = useTheme();
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
    { label: t("Cards"),             icon: CreditCard,     to: "/cards",             color: "#38BDF8" },
    { label: t("Crypto Deposit"),    icon: Bitcoin,        to: "/crypto-deposit",    color: "#F97316" },
    { label: t("Check Deposit"),     icon: FileCheck,      to: "/check-deposit",     color: "#14B8A6" },
  ];

  const [balanceVisible, setBalanceVisible] = useState(true);
  const [currentAccount, setCurrentAccount] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 30) {
      if (diff > 0 && currentAccount < accounts.length - 1) setCurrentAccount((p) => p + 1);
      if (diff < 0 && currentAccount > 0) setCurrentAccount((p) => p - 1);
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
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  // Recent transactions — last 3
  const recentTx = transactions.slice(0, 3);

  if (authLoading || accountLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: pageBg }}>
        <div className="animate-pulse text-lg font-semibold" style={{ color: accentCyan }}>Loading...</div>
      </div>
    );
  }
  if (!user) return null;

  const photoURL = account?.photoURL || null;
  const initials = (account?.fullName || "U").split(" ").slice(0, 2).map((w: string) => w[0]?.toUpperCase()).join("");

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: pageBg }}>

      {/* ── TOP SECTION — dark gradient hero ─────────────────────────── */}
      <div className="relative overflow-hidden"
        style={{ background: dark ? "linear-gradient(160deg,#0D1829 0%,#1a2744 100%)" : "linear-gradient(160deg,#1565C0 0%,#0EA5E9 100%)" }}>
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 -translate-y-1/2 translate-x-1/4"
          style={{ background: "radial-gradient(circle,#38BDF8,transparent)" }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 translate-y-1/2 -translate-x-1/4"
          style={{ background: "radial-gradient(circle,#6366F1,transparent)" }} />

        {/* Header */}
        <div className="px-5 pt-12 pb-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <Link to="/profile">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/30 flex items-center justify-center"
                style={{ background: "#EF4444" }}>
                {photoURL
                  ? <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                  : <span className="text-white font-bold text-sm">{initials}</span>}
              </div>
            </Link>
            <div>
              <p className="text-white/60 text-xs">{getGreeting()},</p>
              <p className="text-white font-bold text-base leading-tight">
                {account?.fullName?.split(" ")[0] || "User"}
              </p>
            </div>
          </div>
          <Link to="/notifications" className="relative">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
              <Bell size={18} style={{ color: "white" }} />
            </div>
            <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ background: "#FFAB00" }} />
          </Link>
        </div>

        {/* ── Account Card ──────────────────────────────────────────── */}
        <div className="px-5 pb-8 relative z-10">
          <div className="relative" style={{ paddingLeft: "28px", paddingRight: "28px" }}>
            {/* Arrow buttons */}
            {currentAccount > 0 && (
              <button onClick={() => setCurrentAccount((p) => Math.max(0, p - 1))}
                className="absolute top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full shadow-lg"
                style={{ left: "-4px", width: "36px", height: "36px", background: "rgba(255,255,255,0.25)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.25)" }}>
                <ChevronLeft size={20} style={{ color: "white" }} />
              </button>
            )}
            {currentAccount < accounts.length - 1 && (
              <button onClick={() => setCurrentAccount((p) => Math.min(accounts.length - 1, p + 1))}
                className="absolute top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full shadow-lg"
                style={{ right: "-4px", width: "36px", height: "36px", background: "rgba(255,255,255,0.25)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.25)" }}>
                <ChevronRight size={20} style={{ color: "white" }} />
              </button>
            )}

            {/* Card body */}
            <div className="w-full rounded-3xl p-6 relative overflow-hidden"
              style={{ background: dark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.18)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.25)" }}
              onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
              {/* Subtle pattern */}
              <div className="absolute inset-0 opacity-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="absolute rounded-full border border-white"
                    style={{ width: 80 + i * 50, height: 80 + i * 50, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
                ))}
              </div>

              <div className="relative z-10">
                {/* Balance type + account number */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white/60 text-xs tracking-widest uppercase">FIAT BALANCE</p>
                    <p className="text-white text-sm font-bold mt-0.5">{accountData?.label || "Account"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/50 text-xs">
                      **** {accountData?.number?.slice(-4) || "----"}
                    </p>
                    {/* Status badge */}
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: "rgba(0,230,118,0.2)", color: "#00E676" }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      {(accountData?.status || "active").toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Available Funds label */}
                <p className="text-white/50 text-xs mb-1">Available Funds</p>

                {/* Balance */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-white font-bold text-3xl font-mono leading-none">
                    {balanceVisible
                      ? formatInCurrency(accountData?.balance || 0, currency)
                      : `${currencySymbol}••••••••`}
                  </span>
                  <button onClick={() => setBalanceVisible(!balanceVisible)}
                    className="p-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>
                    {balanceVisible ? <EyeOff size={14} color="white" /> : <Eye size={14} color="white" />}
                  </button>
                </div>

                {/* Account Status row */}
                <div className="flex items-center justify-between pt-3"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
                  <span className="text-white/50 text-xs">Account Status</span>
                  <span className="text-xs font-semibold" style={{ color: "#00E676" }}>
                    • {(accountData?.status || "active").charAt(0).toUpperCase() + (accountData?.status || "active").slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-1.5 mt-3">
              {accounts.map((_, i) => (
                <button key={i} onClick={() => setCurrentAccount(i)}
                  className="rounded-full transition-all"
                  style={{ width: i === currentAccount ? "20px" : "6px", height: "6px",
                    background: i === currentAccount ? "white" : "rgba(255,255,255,0.4)" }} />
              ))}
            </div>
          </div>

          {/* ── 3 action buttons: Top Up / Send / Activity ──────────── */}
          <div className="flex items-center justify-center gap-8 mt-6">
            {[
              { label: t("Top Up"),  icon: "➕", color: "#FBBF24", bg: "#FBBF24", to: "/card-deposit" },
              { label: t("Send"),    icon: "📤", color: "#fff",    bg: "rgba(255,255,255,0.2)", to: "/local-transfer" },
              { label: t("Activity"),icon: "📊", color: "#fff",    bg: "rgba(255,255,255,0.2)", to: "/transactions" },
            ].map(({ label, icon, bg, to }) => (
              <Link key={label} to={to} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-lg transition-transform active:scale-95"
                  style={{ background: bg, backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}>
                  {icon}
                </div>
                <span className="text-xs font-semibold text-white/80">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM WHITE/DARK SECTION ─────────────────────────────── */}
      <div className="flex-1 rounded-t-[28px] -mt-4 relative z-10 px-5 pt-6 pb-24" style={{ background: pageBg }}>

        {/* Quick Links */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold" style={{ color: textPrimary }}>{t("Quick Links")}</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {quickLinks.map(({ label, icon: Icon, to, color }) => (
              <Link key={label} to={to}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all active:scale-95"
                style={{ background: dark ? "rgba(255,255,255,0.04)" : "#F8FAFF", border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(56,189,248,0.12)"}` }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}18` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <span className="text-xs font-medium text-center leading-tight" style={{ color: textMuted }}>
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold" style={{ color: textPrimary }}>Recent Transactions</h2>
            <Link to="/transactions" className="text-sm font-semibold" style={{ color: accentCyan }}>View All</Link>
          </div>

          {txLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: mutedBg }} />
              ))}
            </div>
          ) : recentTx.length === 0 ? (
            <div className="p-6 rounded-2xl text-center" style={{ background: dark ? "rgba(255,255,255,0.03)" : "#F8FAFF" }}>
              <p className="text-sm" style={{ color: textMuted }}>No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTx.map((tx: any) => {
                const isCredit = isTransactionCredit(tx);
                const desc = tx.description || tx.type?.replace(/_/g, " ") || "Transaction";
                const timeStr = tx.createdAt instanceof Date
                  ? tx.createdAt.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) + ", " +
                    tx.createdAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                  : "—";

                return (
                  <div key={tx.id}
                    className="flex items-center justify-between p-4 rounded-2xl transition-all"
                    style={{ background: dark ? "rgba(255,255,255,0.04)" : "#F8FAFF", border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"}` }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: isCredit ? "rgba(0,230,118,0.15)" : "rgba(255,77,106,0.15)" }}>
                        {isCredit
                          ? <TrendingUp size={18} style={{ color: "#00E676" }} />
                          : <Send size={18} style={{ color: "#FF4D6A" }} />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: textPrimary }}>{desc}</p>
                        <p className="text-xs" style={{ color: textMuted }}>{timeStr}</p>
                      </div>
                    </div>
                    <p className="text-sm font-mono font-bold"
                      style={{ color: isCredit ? "#00E676" : "#FF4D6A" }}>
                      {isCredit ? "+" : "-"}{formatInCurrency(tx.amount || 0, currency)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Nav ────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t"
        style={{ background: dark ? "#0A0F1E" : "#FFFFFF", borderColor: dark ? "rgba(255,255,255,0.08)" : "#E5E7EB" }}>
        <div className="flex items-center justify-around px-2 py-2">
          {[
            { label: t("Activity"),  icon: Activity,    to: "/transactions" },
            { label: t("Transfer"),  icon: ArrowUpRight, to: "/local-transfer" },
            { label: t("Home"),      icon: HomeIcon,    to: "/",            active: true },
            { label: t("Cards"),     icon: CreditCard,  to: "/cards" },
            { label: t("Profile"),   icon: User,        to: "/profile" },
          ].map(({ label, icon: Icon, to, active }) => (
            <Link key={label} to={to}
              className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all min-w-0"
              style={{ background: active ? (dark ? "rgba(56,189,248,0.15)" : "rgba(56,189,248,0.12)") : "transparent" }}>
              <Icon size={22}
                style={{ color: active ? accentCyan : (dark ? "#8A9BB5" : "#9CA3AF") }}
                strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-xs font-medium"
                style={{ color: active ? accentCyan : (dark ? "#8A9BB5" : "#9CA3AF") }}>
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
