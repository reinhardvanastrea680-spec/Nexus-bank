import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, createFileRoute } from "@tanstack/react-router";
import {
  Bell, User, Eye, EyeOff, Copy,
  ArrowUpRight, ArrowLeftRight, Building2, Bitcoin,
  Receipt, UserPlus, FileCheck, Settings,
  Home as HomeIcon, History, Headphones,
  ChevronLeft, ChevronRight, ArrowUp, ArrowDown,
} from "lucide-react";
import { useUserAuth } from "../dashboard/hooks/useUserAuth";
import { useUserAccount } from "../dashboard/hooks/useUserAccount";
import { useUserTransactions } from "../dashboard/hooks/useUserTransactions";
import { useTheme } from "../hooks/use-theme";
import { useLanguage } from "../hooks/use-language";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { ADMIN_UID } from "../config/adminConfig";

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

function HomePage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useUserAuth();
  const { account, loading: accountLoading } = useUserAccount();
  const { transactions, loading: txLoading } = useUserTransactions();
  const { theme } = useTheme();
  const { t } = useLanguage();

  // Translated quick links
  const quickLinks = [
    { label: t("Wire Transfer"),       icon: ArrowUpRight,   to: "/wire-transfer"     },
    { label: t("Local Transfer"),      icon: ArrowLeftRight, to: "/local-transfer"    },
    { label: t("Internal Transfer"),   icon: Building2,      to: "/internal-transfer" },
    { label: t("Buy Crypto"),          icon: Bitcoin,        to: "/buy-crypto"        },
    { label: t("Pay Bills"),           icon: Receipt,        to: "/pay-bills"         },
    { label: t("Add Beneficiary"),     icon: UserPlus,       to: "/add-beneficiary"   },
    { label: t("Transaction History"), icon: History,        to: "/transactions"      },
    { label: t("Crypto Deposit"),      icon: Bitcoin,        to: "/crypto-deposit"    },
    { label: t("Check Deposit"),       icon: FileCheck,      to: "/check-deposit"     },
  ];

  // Translated nav items
  const navItems = [
    { label: t("Settings"),      icon: Settings,   to: "/settings"     },
    { label: t("Notifications"), icon: Bell,       to: "/notifications" },
    { label: t("Home"),          icon: HomeIcon,   to: "/", active: true },
    { label: t("Transactions"),  icon: History,    to: "/transactions"  },
    { label: t("Support"),       icon: Headphones, to: "/support"       },
  ];

  const [balanceVisible, setBalanceVisible] = useState(true);
  const [cardBalanceVisible, setCardBalanceVisible] = useState(true);
  const [currentAccount, setCurrentAccount] = useState(0);

  // Touch swipe support for account card
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0 && currentAccount < accounts.length - 1) setCurrentAccount((p) => p + 1);
      if (diff < 0 && currentAccount > 0) setCurrentAccount((p) => p - 1);
    }
    touchStartX.current = null;
  };

  // ── Theme palette ──────────────────────────────────────────────────────
  const dark = theme === "dark";
  const pageBg        = dark ? "#0F1A2E"                  : "#1D6BE5";   // blue header in light
  const cardBg        = dark ? "#152035"                  : "#FFFFFF";
  const cardBg2       = dark ? "#1A2840"                  : "#FFFFFF";
  const mutedBg       = dark ? "#233552"                  : "#E8F0FE";
  const iconBg        = dark ? "#1E3048"                  : "rgba(255,255,255,0.85)";
  // On blue header: white text. On white card sections: dark text
  const textPrimary   = dark ? "#FFFFFF"                  : "#0D1B2A";
  const headerText    = "#FFFFFF";   // always white — used on blue background areas
  const textMuted     = dark ? "#8A9BB5"                  : "#475569";
  const accentCyan    = dark ? "#38BDF8"                  : "#1D6BE5";
  const navBg         = dark ? "#152035"                  : "#FFFFFF";
  const navBorder     = dark ? "rgba(255,255,255,0.09)"   : "#E5E7EB";
  const navActive     = dark ? "#FFFFFF"                  : "#1D6BE5";
  const navInactive   = dark ? "#8A9BB5"                  : "#9CA3AF";
  const qlCardBg      = dark ? "#FFFFFF08"                : "#F3F6FA";
  const qlLabelColor  = dark ? "#8A9BB5"                  : "#374151";
  const txRowBg       = dark ? "#152035"                  : "#FFFFFF";
  const txTextColor   = dark ? "#FFFFFF"                  : "#0D1B2A";
  const cardAccent    = dark
    ? "linear-gradient(135deg, #0F1A2E 0%, #1a2a44 100%)"
    : "linear-gradient(135deg, #1565C0 0%, #0EA5E9 100%)";

  useEffect(() => {
    if (!authLoading && !user) {
      // If this is the admin PWA (launched standalone from admin-manifest),
      // redirect to admin-login instead of user login
      const isAdminPWA =
        window.matchMedia("(display-mode: standalone)").matches &&
        (document.referrer.includes("/admin") ||
         localStorage.getItem("nexus-pwa-type") === "admin");

      navigate({ to: isAdminPWA ? "/admin-login" : "/login" });
    }
  }, [authLoading, user, navigate]);

  // ── Presence tracking — notify admin when user enters OR exits the dashboard ──
  useEffect(() => {
    if (!user?.uid || !account) return;
    const userName = account.fullName || user.email || "A user";

    const notifyPresence = async (action: string) => {
      try {
        await addDoc(collection(db, "notifications"), {
          recipientId: ADMIN_UID,
          recipientType: "admin",
          type: "user_activity",
          title: `${userName} ${action} the app`,
          message: `${userName} has ${action.toLowerCase()} the banking app`,
          userId: user.uid,
          userFullName: userName,
          amount: 0,
          transactionType: "presence",
          status: "unread",
          declineReason: null,
          createdAt: serverTimestamp(),
          readAt: null,
        });
        // System message in chat — non-critical
        addDoc(collection(db, "chats", user.uid, "messages"), {
          text: `ℹ️ ${userName} has ${action.toLowerCase()} the app`,
          sender: "system",
          createdAt: serverTimestamp(),
          readByAdmin: false,
          readByUser: true,
          isSystemMessage: true,
        }).catch(() => {});
      } catch { /* non-critical */ }
    };

    // Notify on ENTER
    notifyPresence("entered");

    // Notify on EXIT (tab close / browser close)
    const handleBeforeUnload = () => notifyPresence("left");
    // Notify when tab becomes hidden (switch apps on mobile, minimize)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") notifyPresence("exited");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user?.uid, account]);

  const accounts = account ? [
    { id: 1, type: "Checking Account",  number: account.checkingAccountNumber || "---", balance: account.checkingBalance || 0, status: account.status || "Active" },
    { id: 2, type: "Savings Account",   number: account.savingsAccountNumber  || "---", balance: account.savingsBalance  || 0, status: account.status || "Active" },
  ] : [];

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const accountData = accounts[currentAccount];

  if (authLoading || accountLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: pageBg }}>
        <div style={{ color: accentCyan }} className="animate-pulse text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen w-full flex flex-col relative" style={{ background: pageBg }}>
      <div className="animated-bg"><div className="orb orb-1" /><div className="orb orb-2" /></div>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="px-5 pt-10 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/profile" className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: "#EF4444", color: "#fff" }}>
              {(account?.fullName || "U").split(" ").slice(0,2).map((w: string) => w[0]?.toUpperCase()).join("") || <User size={20} />}
            </Link>
            <div>
              <p className="text-xs" style={{ color: dark ? textMuted : "rgba(255,255,255,0.8)" }}>{t("Welcome back")}</p>
              <p className="text-lg font-bold" style={{ color: headerText }}>
                {t("Hi,")} {account?.fullName?.split(" ")[0] || "User"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/notifications" className="relative">
              <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: dark ? iconBg : "rgba(255,255,255,0.2)" }}>
                <Bell size={20} style={{ color: headerText }} />
              </div>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full" style={{ background: "#FFAB00" }} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Total Balance Bar ───────────────────────────────────────────── */}
      <div className="mx-5 mb-4 px-4 py-3 rounded-xl flex items-center justify-between"
        style={{
          background: dark ? cardBg2 : "rgba(255,255,255,0.18)",
          border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.3)"}`,
          backdropFilter: dark ? "none" : "blur(8px)",
        }}>
        <span className="text-sm" style={{ color: dark ? textMuted : "rgba(255,255,255,0.8)" }}>{t("Total balance")}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold font-mono" style={{ color: headerText }}>
            {balanceVisible ? `$${formatCurrency(totalBalance)}` : "••••••••"}
          </span>
          <button onClick={() => setBalanceVisible(!balanceVisible)} className="opacity-60 hover:opacity-100">
            {balanceVisible
              ? <EyeOff size={14} style={{ color: headerText }} />
              : <Eye    size={14} style={{ color: headerText }} />}
          </button>
        </div>
      </div>

      {/* ── Account Card ────────────────────────────────────────────────── */}
      <div className="mx-5 mb-4">
        <div
          className="relative overflow-hidden rounded-2xl select-none"
          style={{
            background: cardAccent,
            boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(14,165,233,0.25)",
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10"
            style={{ background: accentCyan }} />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-10"
            style={{ background: "#6366F1" }} />

          <div className="p-5 relative z-10">
            {/* Status */}
            <div className="flex justify-center mb-4">
              <span className="text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5"
                style={{ background: "rgba(0,230,118,0.15)", color: "#00E676", border: "1px solid rgba(0,230,118,0.3)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                {accountData?.status || "Active"}
              </span>
            </div>

            {/* Account number */}
            <div className="flex items-center justify-center gap-2 mb-5">
              <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
                {accountData?.number} — {accountData?.type}
              </span>
              <button className="opacity-60 hover:opacity-100"
                onClick={() => navigator.clipboard?.writeText(accountData?.number || "")}>
                <Copy size={13} style={{ color: "rgba(255,255,255,0.8)" }} />
              </button>
            </div>

            {/* Balance */}
            <div className="text-center mb-6">
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(255,255,255,0.55)" }}>
                Available Balance
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-bold font-mono text-white">
                  {cardBalanceVisible ? `$${formatCurrency(accountData?.balance || 0)}` : "••••••••••"}
                </span>
                <button onClick={() => setCardBalanceVisible(!cardBalanceVisible)}
                  className="opacity-60 hover:opacity-100 mt-1">
                  {cardBalanceVisible
                    ? <Eye    size={16} style={{ color: "white" }} />
                    : <EyeOff size={16} style={{ color: "white" }} />}
                </button>
              </div>
            </div>
          </div>

          {/* Nav arrows */}
          {currentAccount > 0 && (
            <button className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)" }}
              onClick={() => setCurrentAccount((p) => p - 1)}>
              <ChevronLeft size={14} style={{ color: "white" }} />
            </button>
          )}
          {currentAccount < accounts.length - 1 && (
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)" }}
              onClick={() => setCurrentAccount((p) => p + 1)}>
              <ChevronRight size={14} style={{ color: "white" }} />
            </button>
          )}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-3">
          {accounts.map((_, i) => (
            <button key={i} onClick={() => setCurrentAccount(i)}
              className="rounded-full transition-all"
              style={{ width: i === currentAccount ? "24px" : "8px", height: "8px",
                background: i === currentAccount ? accentCyan : mutedBg }} />
          ))}
        </div>
      </div>

      {/* ── Quick Links ─────────────────────────────────────────────────── */}
      <div className="flex-1 rounded-t-[28px] px-5 pt-6 pb-24"
        style={{ background: dark ? "#0D1829" : "#FFFFFF",
          borderTop: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}` }}>

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold" style={{ color: dark ? "#FFFFFF" : "#0D1B2A" }}>{t("Quick Links")}</h2>
          <button className="text-sm font-semibold" style={{ color: dark ? accentCyan : "#1D6BE5" }}>{t("Customise")}</button>
        </div>

        <div className="grid grid-cols-3 gap-y-5 gap-x-2">
          {quickLinks.map(({ label, icon: Icon, to }) => (
            <Link key={label} to={to} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform active:scale-95"
                style={{
                  background: iconBg,
                  border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(29,107,229,0.12)"}`,
                }}>
                <Icon size={22} style={{ color: dark ? accentCyan : "#1D6BE5" }} />
              </div>
              <span className="text-xs font-medium text-center leading-tight"
                style={{ color: dark ? qlLabelColor : "#374151" }}>
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Bottom Navigation ──────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-3 border-t"
        style={{ background: navBg, borderColor: navBorder }}>
        {navItems.map(({ label, icon: Icon, to, active }) => (
          <Link key={label} to={to} className="flex flex-col items-center gap-0.5 min-w-0 px-1">
            <Icon size={22}
              style={{ color: active ? navActive : navInactive }}
              strokeWidth={active ? 2.5 : 1.8} />
            <span className="text-xs font-medium"
              style={{ color: active ? navActive : navInactive }}>
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
