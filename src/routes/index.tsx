import { useState, useEffect } from "react";
import { Link, useNavigate, createFileRoute } from "@tanstack/react-router";
import {
  Bell, User, Eye, EyeOff, Copy,
  ArrowUpRight, ArrowLeftRight, Building2, Bitcoin,
  Receipt, UserPlus, FileCheck, Settings,
  Home as HomeIcon, History, Headphones,
  ChevronLeft, ChevronRight, ArrowUp, ArrowDown, LogOut,
} from "lucide-react";
import { useUserAuth } from "../dashboard/hooks/useUserAuth";
import { useUserAccount } from "../dashboard/hooks/useUserAccount";
import { useUserTransactions } from "../dashboard/hooks/useUserTransactions";
import { useTheme } from "../hooks/use-theme";

const quickLinks = [
  { label: "Wire Transfer",        icon: ArrowUpRight,  to: "/wire-transfer"     },
  { label: "Local Transfer",       icon: ArrowLeftRight, to: "/local-transfer"   },
  { label: "Internal Transfer",    icon: Building2,      to: "/internal-transfer" },
  { label: "Buy Crypto",           icon: Bitcoin,        to: "/buy-crypto"        },
  { label: "Pay Bills",            icon: Receipt,        to: "/pay-bills"         },
  { label: "Add Beneficiary",      icon: UserPlus,       to: "/add-beneficiary"   },
  { label: "Transaction History",  icon: History,        to: "/transactions"      },
  { label: "Crypto Deposit",       icon: Bitcoin,        to: "/crypto-deposit"    },
  { label: "Check Deposit",        icon: FileCheck,      to: "/check-deposit"     },
];

const navItems = [
  { label: "Settings",      icon: Settings,  to: "/settings"      },
  { label: "Notifications", icon: Bell,      to: "/notifications"  },
  { label: "Home",          icon: HomeIcon,  to: "/", active: true },
  { label: "Transactions",  icon: History,   to: "/transactions"   },
  { label: "Support",       icon: Headphones, to: "/support"       },
];

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
  const { user, loading: authLoading, userLogout } = useUserAuth();
  const { account, loading: accountLoading } = useUserAccount();
  const { transactions, loading: txLoading } = useUserTransactions();
  const { theme } = useTheme();

  const [balanceVisible, setBalanceVisible] = useState(true);
  const [cardBalanceVisible, setCardBalanceVisible] = useState(true);
  const [currentAccount, setCurrentAccount] = useState(0);

  // ── Theme palette ──────────────────────────────────────────────────────
  const dark = theme === "dark";
  const pageBg        = dark ? "#0B1120"                  : "#F0F4F8";
  const cardBg        = dark ? "#0F1A2E"                  : "#FFFFFF";
  const cardBg2       = dark ? "#111827"                  : "#F7F9FC";
  const mutedBg       = dark ? "#1E2D45"                  : "#E4EAF2";
  const iconBg        = dark ? "#1E2D45"                  : "#E8EFF8";
  const textPrimary   = dark ? "#FFFFFF"                  : "#0D1B2A";
  const textMuted     = dark ? "#8A9BB5"                  : "#64748B";
  const accentCyan    = dark ? "#38BDF8"                  : "#0EA5E9";
  const navBg         = dark ? "#0F1A2E"                  : "#FFFFFF";
  const navBorder     = dark ? "rgba(255,255,255,0.07)"   : "#E5E7EB";
  const navActive     = dark ? "#FFFFFF"                  : "#0D1B2A";
  const navInactive   = dark ? "#8A9BB5"                  : "#9CA3AF";
  const qlCardBg      = dark ? "#FFFFFF08"                : "#FFFFFF";
  const qlLabelColor  = dark ? "#8A9BB5"                  : "#64748B";
  const txRowBg       = dark ? "#0F1A2E"                  : "#FFFFFF";
  const txTextColor   = dark ? "#FFFFFF"                  : "#0D1B2A";
  const cardAccent    = dark
    ? "linear-gradient(135deg, #0F1A2E 0%, #1a2a44 100%)"
    : "linear-gradient(135deg, #1D4ED8 0%, #0EA5E9 100%)";

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [authLoading, user, navigate]);

  const accounts = account ? [
    { id: 1, type: "Checking Account",  number: account.checkingAccountNumber || "---", balance: account.checkingBalance || 0, status: account.status || "Active" },
    { id: 2, type: "Savings Account",   number: account.savingsAccountNumber  || "---", balance: account.savingsBalance  || 0, status: account.status || "Active" },
  ] : [];

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const accountData = accounts[currentAccount];

  const handleLogout = async () => {
    try { await userLogout(); navigate({ to: "/login" }); }
    catch (e) { console.error(e); }
  };

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
            <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: iconBg }}>
              <User size={20} style={{ color: accentCyan }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: textMuted }}>Welcome back</p>
              <p className="text-lg font-bold" style={{ color: textPrimary }}>
                Hi, {account?.fullName?.split(" ")[0] || "User"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/notifications" className="relative">
              <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: iconBg }}>
                <Bell size={20} style={{ color: textPrimary }} />
              </div>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full" style={{ background: "#FFAB00" }} />
            </Link>
            <button onClick={handleLogout} className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: iconBg }}>
              <LogOut size={20} style={{ color: "#EF4444" }} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Total Balance Bar ───────────────────────────────────────────── */}
      <div className="mx-5 mb-4 px-4 py-3 rounded-xl flex items-center justify-between"
        style={{ background: cardBg2, border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
        <span className="text-sm" style={{ color: textMuted }}>Total balance</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold font-mono" style={{ color: textPrimary }}>
            {balanceVisible ? `$${formatCurrency(totalBalance)}` : "••••••••"}
          </span>
          <button onClick={() => setBalanceVisible(!balanceVisible)} className="opacity-60 hover:opacity-100">
            {balanceVisible
              ? <EyeOff size={14} style={{ color: textPrimary }} />
              : <Eye    size={14} style={{ color: textPrimary }} />}
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
          borderTop: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold" style={{ color: textPrimary }}>Quick Links</h2>
          <button className="text-sm font-semibold" style={{ color: accentCyan }}>Customise</button>
        </div>

        <div className="grid grid-cols-3 gap-y-5 gap-x-2">
          {quickLinks.map(({ label, icon: Icon, to }) => (
            <Link key={label} to={to} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform active:scale-95"
                style={{ background: iconBg, border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
                <Icon size={22} style={{ color: accentCyan }} />
              </div>
              <span className="text-xs font-medium text-center leading-tight" style={{ color: textMuted }}>
                {label}
              </span>
            </Link>
          ))}
        </div>

        {/* ── Recent Transactions ────────────────────────────────────────── */}
        <div className="mt-8 flex items-center justify-between mb-3">
          <h2 className="text-base font-bold" style={{ color: textPrimary }}>Recent Transactions</h2>
          <Link to="/transactions" className="text-xs font-semibold" style={{ color: accentCyan }}>
            See all
          </Link>
        </div>

        <div className="space-y-3">
          {txLoading ? (
            <div className="text-center py-8" style={{ color: textMuted }}>Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8" style={{ color: textMuted }}>No transactions yet</div>
          ) : (
            transactions.slice(0, 5).map((tx: any) => {
              const isCredit =
                tx.type === "credit" ||
                tx.type === "check_deposit" ||
                tx.type === "crypto_deposit";
              const txDescription = tx.description || tx.type?.replace(/_/g, " ") || "Transaction";
              const txDate = tx.date?.toDate?.() || (tx.createdAt instanceof Date ? tx.createdAt : null);
              const greenColor = dark ? "#00E676" : "#10B981";
              const redColor   = dark ? "#FF4D6A" : "#EF4444";

              return (
                <div key={tx.id}
                  className="flex items-center justify-between p-4 rounded-2xl"
                  style={{ background: txRowBg,
                    border: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                    boxShadow: dark ? "none" : "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: isCredit ? `${greenColor}20` : `${redColor}20` }}>
                      {isCredit
                        ? <ArrowDown size={18} style={{ color: greenColor }} />
                        : <ArrowUp   size={18} style={{ color: redColor   }} />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: txTextColor }}>
                        {txDescription}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs" style={{ color: textMuted }}>
                          {txDate?.toLocaleDateString() || "—"}
                        </p>
                        {tx.status === "pending" && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                            style={{ background: "rgba(255,171,0,0.15)", color: "#F59E0B" }}>
                            Pending
                          </span>
                        )}
                        {tx.status === "declined" && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                            style={{ background: `${redColor}20`, color: redColor }}>
                            Declined
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="font-bold font-mono text-sm"
                    style={{ color: isCredit ? greenColor : redColor }}>
                    {isCredit ? "+" : "-"}${formatCurrency(tx.amount)}
                  </p>
                </div>
              );
            })
          )}
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
