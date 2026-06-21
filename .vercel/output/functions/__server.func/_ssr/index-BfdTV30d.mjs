import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useUserAuth } from "./useUserAuth-Dj040xaQ.mjs";
import { u as useUserAccount } from "./useUserAccount-DGi8dU3l.mjs";
import { u as useUserTransactions } from "./useUserTransactions-9P4nxOr4.mjs";
import { u as useTheme } from "./use-theme-BfOV-CAK.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__storage.mjs";
import "../_libs/sonner.mjs";
import { m as User, B as Bell, t as LogOut, v as EyeOff, E as Eye, x as Copy, Y as ChevronLeft, O as ChevronRight, Z as ArrowUpRight, J as ArrowLeftRight, _ as Building2, $ as Bitcoin, a0 as Receipt, h as UserPlus, e as History, a1 as FileCheck, j as ArrowDown, k as ArrowUp, d as Settings, H as House, f as Headphones } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/tanstack__history.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "async_hooks";
import "stream";
import "util";
import "crypto";
import "../_libs/isbot.mjs";
import "./router-8iYk_PDV.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/firebase__component.mjs";
import "../_libs/firebase__util.mjs";
import "../_libs/firebase__webchannel-wrapper.mjs";
import "../_libs/@grpc/grpc-js.mjs";
import "process";
import "tls";
import "fs";
import "os";
import "net";
import "events";
import "http2";
import "http";
import "url";
import "dns";
import "zlib";
import "../_libs/@grpc/proto-loader.mjs";
import "path";
import "../_libs/lodash.camelcase.mjs";
import "../_libs/protobufjs.mjs";
import "../_libs/protobufjs__aspromise.mjs";
import "../_libs/protobufjs__base64.mjs";
import "../_libs/protobufjs__eventemitter.mjs";
import "../_libs/protobufjs__float.mjs";
import "../_libs/protobufjs__utf8.mjs";
import "../_libs/protobufjs__pool.mjs";
import "../_libs/long.mjs";
import "../_libs/protobufjs__codegen.mjs";
import "../_libs/protobufjs__fetch.mjs";
import "../_libs/protobufjs__path.mjs";
import "../_libs/re2js.mjs";
import "../_libs/idb.mjs";
import "./adminConfig-D-CDJgKq.mjs";
const quickLinks = [{
  label: "Wire Transfer",
  icon: ArrowUpRight,
  to: "/wire-transfer"
}, {
  label: "Local Transfer",
  icon: ArrowLeftRight,
  to: "/local-transfer"
}, {
  label: "Internal Transfer",
  icon: Building2,
  to: "/internal-transfer"
}, {
  label: "Buy Crypto",
  icon: Bitcoin,
  to: "/buy-crypto"
}, {
  label: "Pay Bills",
  icon: Receipt,
  to: "/pay-bills"
}, {
  label: "Add Beneficiary",
  icon: UserPlus,
  to: "/add-beneficiary"
}, {
  label: "Transaction History",
  icon: History,
  to: "/transactions"
}, {
  label: "Crypto Deposit",
  icon: Bitcoin,
  to: "/crypto-deposit"
}, {
  label: "Check Deposit",
  icon: FileCheck,
  to: "/check-deposit"
}];
const navItems = [{
  label: "Settings",
  icon: Settings,
  to: "/settings"
}, {
  label: "Notifications",
  icon: Bell,
  to: "/notifications"
}, {
  label: "Home",
  icon: House,
  to: "/",
  active: true
}, {
  label: "Transactions",
  icon: History,
  to: "/transactions"
}, {
  label: "Support",
  icon: Headphones,
  to: "/support"
}];
function formatCurrency(value) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
function HomePage() {
  const navigate = useNavigate();
  const {
    user,
    loading: authLoading,
    userLogout
  } = useUserAuth();
  const {
    account,
    loading: accountLoading
  } = useUserAccount();
  const {
    transactions,
    loading: txLoading
  } = useUserTransactions();
  const {
    theme
  } = useTheme();
  const [balanceVisible, setBalanceVisible] = reactExports.useState(true);
  const [cardBalanceVisible, setCardBalanceVisible] = reactExports.useState(true);
  const [currentAccount, setCurrentAccount] = reactExports.useState(0);
  const dark = theme === "dark";
  const pageBg = dark ? "#0B1120" : "#F0F4F8";
  const cardBg2 = dark ? "#111827" : "#F7F9FC";
  const mutedBg = dark ? "#1E2D45" : "#E4EAF2";
  const iconBg = dark ? "#1E2D45" : "#E8EFF8";
  const textPrimary = dark ? "#FFFFFF" : "#0D1B2A";
  const textMuted = dark ? "#8A9BB5" : "#64748B";
  const accentCyan = dark ? "#38BDF8" : "#0EA5E9";
  const navBg = dark ? "#0F1A2E" : "#FFFFFF";
  const navBorder = dark ? "rgba(255,255,255,0.07)" : "#E5E7EB";
  const navActive = dark ? "#FFFFFF" : "#0D1B2A";
  const navInactive = dark ? "#8A9BB5" : "#9CA3AF";
  const txRowBg = dark ? "#0F1A2E" : "#FFFFFF";
  const txTextColor = dark ? "#FFFFFF" : "#0D1B2A";
  const cardAccent = dark ? "linear-gradient(135deg, #0F1A2E 0%, #1a2a44 100%)" : "linear-gradient(135deg, #1D4ED8 0%, #0EA5E9 100%)";
  reactExports.useEffect(() => {
    if (!authLoading && !user) navigate({
      to: "/login"
    });
  }, [authLoading, user, navigate]);
  const accounts = account ? [{
    id: 1,
    type: "Checking Account",
    number: account.checkingAccountNumber || "---",
    balance: account.checkingBalance || 0,
    status: account.status || "Active"
  }, {
    id: 2,
    type: "Savings Account",
    number: account.savingsAccountNumber || "---",
    balance: account.savingsBalance || 0,
    status: account.status || "Active"
  }] : [];
  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const accountData = accounts[currentAccount];
  const handleLogout = async () => {
    try {
      await userLogout();
      navigate({
        to: "/login"
      });
    } catch (e) {
      console.error(e);
    }
  };
  if (authLoading || accountLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center", style: {
      background: pageBg
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      color: accentCyan
    }, className: "animate-pulse text-lg font-semibold", children: "Loading..." }) });
  }
  if (!user) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen w-full flex flex-col relative", style: {
    background: pageBg
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animated-bg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "orb orb-1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "orb orb-2" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pt-10 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-11 h-11 rounded-full flex items-center justify-center", style: {
          background: iconBg
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 20, style: {
          color: accentCyan
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: {
            color: textMuted
          }, children: "Welcome back" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg font-bold", style: {
            color: textPrimary
          }, children: [
            "Hi, ",
            account?.fullName?.split(" ")[0] || "User"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/notifications", className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-11 h-11 rounded-full flex items-center justify-center", style: {
            background: iconBg
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 20, style: {
            color: textPrimary
          } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1 right-1 w-2.5 h-2.5 rounded-full", style: {
            background: "#FFAB00"
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleLogout, className: "w-11 h-11 rounded-full flex items-center justify-center", style: {
          background: iconBg
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 20, style: {
          color: "#EF4444"
        } }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-5 mb-4 px-4 py-3 rounded-xl flex items-center justify-between", style: {
      background: cardBg2,
      border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
        color: textMuted
      }, children: "Total balance" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold font-mono", style: {
          color: textPrimary
        }, children: balanceVisible ? `$${formatCurrency(totalBalance)}` : "••••••••" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setBalanceVisible(!balanceVisible), className: "opacity-60 hover:opacity-100", children: balanceVisible ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 14, style: {
          color: textPrimary
        } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 14, style: {
          color: textPrimary
        } }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-5 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-2xl select-none", style: {
        background: cardAccent,
        boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(14,165,233,0.25)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10", style: {
          background: accentCyan
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-10", style: {
          background: "#6366F1"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5", style: {
            background: "rgba(0,230,118,0.15)",
            color: "#00E676",
            border: "1px solid rgba(0,230,118,0.3)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" }),
            accountData?.status || "Active"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium", style: {
              color: "rgba(255,255,255,0.8)"
            }, children: [
              accountData?.number,
              " — ",
              accountData?.type
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "opacity-60 hover:opacity-100", onClick: () => navigator.clipboard?.writeText(accountData?.number || ""), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 13, style: {
              color: "rgba(255,255,255,0.8)"
            } }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs tracking-widest uppercase mb-2", style: {
              color: "rgba(255,255,255,0.55)"
            }, children: "Available Balance" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-bold font-mono text-white", children: cardBalanceVisible ? `$${formatCurrency(accountData?.balance || 0)}` : "••••••••••" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCardBalanceVisible(!cardBalanceVisible), className: "opacity-60 hover:opacity-100 mt-1", children: cardBalanceVisible ? /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16, style: {
                color: "white"
              } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 16, style: {
                color: "white"
              } }) })
            ] })
          ] })
        ] }),
        currentAccount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center", style: {
          background: "rgba(255,255,255,0.15)"
        }, onClick: () => setCurrentAccount((p) => p - 1), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 14, style: {
          color: "white"
        } }) }),
        currentAccount < accounts.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center", style: {
          background: "rgba(255,255,255,0.15)"
        }, onClick: () => setCurrentAccount((p) => p + 1), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14, style: {
          color: "white"
        } }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center gap-1.5 mt-3", children: accounts.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCurrentAccount(i), className: "rounded-full transition-all", style: {
        width: i === currentAccount ? "24px" : "8px",
        height: "8px",
        background: i === currentAccount ? accentCyan : mutedBg
      } }, i)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 rounded-t-[28px] px-5 pt-6 pb-24", style: {
      background: dark ? "#0D1829" : "#FFFFFF",
      borderTop: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold", style: {
          color: textPrimary
        }, children: "Quick Links" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-sm font-semibold", style: {
          color: accentCyan
        }, children: "Customise" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-y-5 gap-x-2", children: quickLinks.map(({
        label,
        icon: Icon,
        to
      }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to, className: "flex flex-col items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform active:scale-95", style: {
          background: iconBg,
          border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 22, style: {
          color: accentCyan
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-center leading-tight", style: {
          color: textMuted
        }, children: label })
      ] }, label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold", style: {
          color: textPrimary
        }, children: "Recent Transactions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/transactions", className: "text-xs font-semibold", style: {
          color: accentCyan
        }, children: "See all" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: txLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8", style: {
        color: textMuted
      }, children: "Loading transactions..." }) : transactions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8", style: {
        color: textMuted
      }, children: "No transactions yet" }) : transactions.slice(0, 5).map((tx) => {
        const isCredit = tx.type === "credit" || tx.type === "check_deposit" || tx.type === "crypto_deposit";
        const txDescription = tx.description || tx.type?.replace(/_/g, " ") || "Transaction";
        const txDate = tx.date?.toDate?.() || (tx.createdAt instanceof Date ? tx.createdAt : null);
        const greenColor = dark ? "#00E676" : "#10B981";
        const redColor = dark ? "#FF4D6A" : "#EF4444";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 rounded-2xl", style: {
          background: txRowBg,
          border: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
          boxShadow: dark ? "none" : "0 1px 3px rgba(0,0,0,0.06)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full flex items-center justify-center", style: {
              background: isCredit ? `${greenColor}20` : `${redColor}20`
            }, children: isCredit ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { size: 18, style: {
              color: greenColor
            } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { size: 18, style: {
              color: redColor
            } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", style: {
                color: txTextColor
              }, children: txDescription }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: {
                  color: textMuted
                }, children: txDate?.toLocaleDateString() || "—" }),
                tx.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs px-1.5 py-0.5 rounded-full font-medium", style: {
                  background: "rgba(255,171,0,0.15)",
                  color: "#F59E0B"
                }, children: "Pending" }),
                tx.status === "declined" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs px-1.5 py-0.5 rounded-full font-medium", style: {
                  background: `${redColor}20`,
                  color: redColor
                }, children: "Declined" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold font-mono text-sm", style: {
            color: isCredit ? greenColor : redColor
          }, children: [
            isCredit ? "+" : "-",
            "$",
            formatCurrency(tx.amount)
          ] })
        ] }, tx.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-3 border-t", style: {
      background: navBg,
      borderColor: navBorder
    }, children: navItems.map(({
      label,
      icon: Icon,
      to,
      active
    }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to, className: "flex flex-col items-center gap-0.5 min-w-0 px-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 22, style: {
        color: active ? navActive : navInactive
      }, strokeWidth: active ? 2.5 : 1.8 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", style: {
        color: active ? navActive : navInactive
      }, children: label })
    ] }, label)) })
  ] });
}
export {
  HomePage as component
};
