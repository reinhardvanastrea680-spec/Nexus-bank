import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useTheme } from "./use-theme-BfOV-CAK.mjs";
import { B as BottomNav, t as themeColors } from "./BottomNav-CtUMOiqo.mjs";
import { u as useUserAuth } from "./useUserAuth-Dj040xaQ.mjs";
import { u as useUserTransactions } from "./useUserTransactions-9P4nxOr4.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__storage.mjs";
import "../_libs/sonner.mjs";
import { A as ArrowLeft, i as Funnel, j as ArrowDown, k as ArrowUp, b as CircleCheck, c as CircleX, C as Clock } from "../_libs/lucide-react.mjs";
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
function formatCurrency(value) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
function formatDate(dateInput) {
  if (dateInput?.toDate) {
    return dateInput.toDate().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } else if (typeof dateInput === "string") {
    return dateInput;
  }
  return "Date not available";
}
function getStatusBadge(status) {
  switch (status) {
    case "pending":
      return {
        text: "Pending",
        color: "#FFAB00",
        icon: Clock
      };
    case "approved":
      return {
        text: "Approved",
        color: "#00E676",
        icon: CircleCheck
      };
    case "declined":
      return {
        text: "Declined",
        color: "#FF4D6A",
        icon: CircleX
      };
    case "completed":
      return {
        text: "Completed",
        color: "#00E676",
        icon: CircleCheck
      };
    case "cancelled":
      return {
        text: "Cancelled",
        color: "#8A9BB5",
        icon: CircleX
      };
    default:
      return {
        text: "Completed",
        color: "#00E676",
        icon: CircleCheck
      };
  }
}
function Transactions() {
  const navigate = useNavigate();
  const {
    theme
  } = useTheme();
  const t = themeColors(theme);
  const {
    user
  } = useUserAuth();
  const [showFilters, setShowFilters] = reactExports.useState(false);
  const [filterType, setFilterType] = reactExports.useState(null);
  const [filterAccount, setFilterAccount] = reactExports.useState(null);
  const [selectedTransaction, setSelectedTransaction] = reactExports.useState(null);
  const {
    transactions,
    loading
  } = useUserTransactions();
  const filteredTransactions = transactions.filter((tx) => {
    if (filterType) {
      const isCredit = tx.type === "credit" || tx.type === "check_deposit" || tx.type === "crypto_deposit";
      const isDebit = tx.type === "debit" || tx.type === "wire_transfer" || tx.type === "local_transfer" || tx.type === "internal_transfer" || tx.type === "buy_crypto" || tx.type === "bill_payment";
      if (filterType === "credits" && !isCredit) return false;
      if (filterType === "debits" && !isDebit) return false;
    }
    const txAccount = (tx.account || tx.fundingAccount || "").toLowerCase();
    if (filterAccount && txAccount !== filterAccount.toLowerCase()) return false;
    return true;
  });
  const groupedTransactions = filteredTransactions.reduce((groups, tx) => {
    const dateSource = tx.date?.toDate ? tx.date.toDate() : tx.createdAt instanceof Date ? tx.createdAt : null;
    const dateKey = dateSource ? dateSource.toDateString() : "Unknown Date";
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(tx);
    return groups;
  }, {});
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center", style: {
      background: t.pageBg
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
      color: t.textMuted
    }, children: "Please log in to view transactions." }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen w-full flex flex-col pb-24", style: {
    background: t.pageBg
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-10 pb-6 flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate({
        to: "/"
      }), className: "p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 24, style: {
        color: t.textPrimary
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold flex-1 text-center", style: {
        color: t.textPrimary
      }, children: "Transaction History" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowFilters(!showFilters), className: "p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { size: 24, style: {
        color: t.accentCyan
      } }) })
    ] }),
    showFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto pb-2 no-scrollbar", children: [{
        id: null,
        label: "All"
      }, {
        id: "credits",
        label: "Credits Only"
      }, {
        id: "debits",
        label: "Debits Only"
      }].map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFilterType(opt.id), className: "flex-shrink-0 px-4 py-2 rounded-full font-semibold transition-all", style: {
        background: filterType === opt.id ? t.accentCyan : t.inputBg,
        color: filterType === opt.id ? t.pageBg : t.textMuted
      }, children: opt.label }, opt.id || "all")) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto pb-2 no-scrollbar", children: [{
        id: null,
        label: "All Accounts"
      }, {
        id: "checking",
        label: "Checking"
      }, {
        id: "savings",
        label: "Savings"
      }].map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFilterAccount(opt.id), className: "flex-shrink-0 px-4 py-2 rounded-full font-semibold transition-all", style: {
        background: filterAccount === opt.id ? t.accentCyan : t.inputBg,
        color: filterAccount === opt.id ? t.pageBg : t.textMuted
      }, children: opt.label }, opt.id || "all")) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 p-4 rounded-2xl", style: {
        background: t.cardBg2
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-full flex items-center justify-center", style: {
            background: "rgba(0,230,118,0.2)"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { size: 14, style: {
            color: t.accentGreen
          } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", style: {
            color: t.textMuted
          }, children: "Total Credits" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg font-mono font-bold", style: {
          color: t.accentGreen
        }, children: [
          "$",
          formatCurrency(filteredTransactions.filter((tx) => tx.type === "credit" || tx.type === "check_deposit" || tx.type === "crypto_deposit").reduce((sum, tx) => sum + tx.amount, 0))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 p-4 rounded-2xl", style: {
        background: t.cardBg2
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-full flex items-center justify-center", style: {
            background: "rgba(255,77,106,0.2)"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { size: 14, style: {
            color: t.accentRed
          } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", style: {
            color: t.textMuted
          }, children: "Total Debits" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg font-mono font-bold", style: {
          color: t.accentRed
        }, children: [
          "$",
          formatCurrency(filteredTransactions.filter((tx) => tx.type === "debit" || tx.type === "wire_transfer" || tx.type === "local_transfer" || tx.type === "internal_transfer" || tx.type === "buy_crypto" || tx.type === "bill_payment").reduce((sum, tx) => sum + tx.amount, 0))
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 flex-1 space-y-6 overflow-y-auto", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-[#8A9BB5]", children: "Loading transactions..." }) : filteredTransactions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-[#8A9BB5]", children: "No transactions found." }) : Object.keys(groupedTransactions).map((dateKey) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold", style: {
        color: "#8A9BB5"
      }, children: dateKey }),
      groupedTransactions[dateKey].map((tx) => {
        const badge = getStatusBadge(tx.status || "approved");
        const IconComponent = badge.icon;
        const isCredit = tx.type === "credit" || tx.type === "check_deposit" || tx.type === "crypto_deposit";
        const txAccount = tx.account || tx.fundingAccount || "account";
        const txDescription = tx.description || tx.type?.replace(/_/g, " ") || "Transaction";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelectedTransaction(tx), className: "w-full flex items-center justify-between p-4 rounded-2xl transition-all", style: {
          background: t.cardBg,
          border: `1px solid ${t.border}`
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full flex items-center justify-center", style: {
              background: isCredit ? `${t.accentGreen}20` : `${t.accentRed}20`
            }, children: isCredit ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { size: 18, style: {
              color: t.accentGreen
            } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { size: 18, style: {
              color: t.accentRed
            } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", style: {
                color: t.textPrimary
              }, children: txDescription }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", style: {
                  color: t.textMuted
                }, children: formatDate(tx.date || tx.createdAt) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs px-2 py-0.5 rounded-full flex items-center gap-1", style: {
                  background: t.mutedBg,
                  color: badge.color
                }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(IconComponent, { size: 10 }),
                  badge.text
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-mono font-bold", style: {
              color: isCredit ? t.accentGreen : t.accentRed
            }, children: [
              isCredit ? "+" : "-",
              "$",
              formatCurrency(tx.amount)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", style: {
              color: t.textMuted
            }, children: txAccount.charAt(0).toUpperCase() + txAccount.slice(1) })
          ] })
        ] }, tx.id);
      })
    ] }, dateKey)) }),
    selectedTransaction && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", style: {
        background: "rgba(0,0,0,0.5)"
      }, onClick: () => setSelectedTransaction(null) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full p-6 rounded-t-[28px]", style: {
        background: t.cardBg
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-1 rounded-full mx-auto mb-6", style: {
          background: t.mutedBg
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mb-6", children: (() => {
          const isCredit = selectedTransaction.type === "credit" || selectedTransaction.type === "check_deposit" || selectedTransaction.type === "crypto_deposit";
          const badge = getStatusBadge(selectedTransaction.status || "approved");
          const txAccount = selectedTransaction.account || selectedTransaction.fundingAccount || "account";
          const txDesc = selectedTransaction.description || selectedTransaction.type?.replace(/_/g, " ") || "Transaction";
          const StatusIcon = badge.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: `text-3xl font-mono font-bold mb-2 ${isCredit ? "text-green-400" : "text-red-400"}`, children: [
              isCredit ? "+" : "-",
              "$",
              formatCurrency(selectedTransaction.amount)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", style: {
              color: "#FFFFFF"
            }, children: txDesc }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
                  color: t.textMuted
                }, children: "Date & Time" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
                  color: t.textPrimary
                }, children: formatDate(selectedTransaction.date || selectedTransaction.createdAt) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
                  color: t.textMuted
                }, children: "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { size: 12, style: {
                    color: badge.color
                  } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
                    color: badge.color
                  }, children: badge.text })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
                  color: t.textMuted
                }, children: "Account" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
                  color: t.textPrimary
                }, children: txAccount.charAt(0).toUpperCase() + txAccount.slice(1) })
              ] }),
              selectedTransaction.recipientName && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
                  color: t.textMuted
                }, children: "Recipient" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
                  color: t.textPrimary
                }, children: selectedTransaction.recipientName })
              ] }),
              selectedTransaction.declineReason && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
                  color: t.textMuted
                }, children: "Decline Reason" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-right", style: {
                  color: t.accentRed
                }, children: selectedTransaction.declineReason })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
                  color: t.textMuted
                }, children: "Reference" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-mono font-semibold", style: {
                  color: t.textPrimary
                }, children: selectedTransaction.transactionRef || selectedTransaction.id })
              ] })
            ] })
          ] });
        })() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4 mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedTransaction(null), className: "py-4 rounded-xl font-semibold", style: {
          background: t.inputBg,
          color: t.textMuted
        }, children: "Close" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, { active: "transactions" })
  ] });
}
export {
  Transactions as component
};
