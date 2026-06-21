import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useUserAccount } from "./useUserAccount-DGi8dU3l.mjs";
import { T as TransactionSuccessScreen, s as submitTransaction } from "./TransactionSuccessScreen-CK6mhzHA.mjs";
import { B as BottomNav, t as themeColors } from "./BottomNav-CtUMOiqo.mjs";
import { u as useTheme } from "./use-theme-BfOV-CAK.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__storage.mjs";
import { A as ArrowLeft } from "../_libs/lucide-react.mjs";
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
import "./useUserAuth-Dj040xaQ.mjs";
import "./adminConfig-D-CDJgKq.mjs";
import "./createNotification-Cw-Zxf1P.mjs";
import "./formatCurrency-vYScEN6G.mjs";
import "./useBeneficiaries-B91qKWY9.mjs";
function formatCurrency(value) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
function InternalTransfer() {
  const navigate = useNavigate();
  const {
    account
  } = useUserAccount();
  const {
    theme
  } = useTheme();
  const t = themeColors(theme);
  const [fromAccount, setFromAccount] = reactExports.useState("Checking");
  const [toAccount, setToAccount] = reactExports.useState("Savings");
  const [amount, setAmount] = reactExports.useState("");
  const [note, setNote] = reactExports.useState("");
  const [showConfirm, setShowConfirm] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(false);
  const [successData, setSuccessData] = reactExports.useState(null);
  const fromBalance = fromAccount === "Checking" ? account?.checkingBalance || 0 : account?.savingsBalance || 0;
  const toBalance = toAccount === "Checking" ? account?.checkingBalance || 0 : account?.savingsBalance || 0;
  const handleConfirm = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (parseFloat(amount) > fromBalance) {
      toast.error("Insufficient funds");
      return;
    }
    if (fromAccount === toAccount) {
      toast.error("Cannot transfer to same account");
      return;
    }
    setLoading(true);
    try {
      const {
        transactionRef
      } = await submitTransaction({
        type: "internal_transfer",
        subType: "between_accounts",
        description: `Internal Transfer from ${fromAccount} to ${toAccount}`,
        category: "Transfer",
        amount: parseFloat(amount),
        fundingAccount: fromAccount.toLowerCase(),
        recipientName: `Your ${toAccount} Account`,
        recipientAccount: toAccount.toLowerCase(),
        toAccount: toAccount.toLowerCase(),
        note
      });
      setShowConfirm(false);
      setSuccessData({
        amount: parseFloat(amount),
        transactionRef,
        fundingAccount: fromAccount,
        recipientName: `Your ${toAccount} Account`
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit transfer request");
    } finally {
      setLoading(false);
    }
  };
  if (successData) return /* @__PURE__ */ jsxRuntimeExports.jsx(TransactionSuccessScreen, { amount: successData.amount, transactionRef: successData.transactionRef, fundingAccount: successData.fundingAccount, recipientName: successData.recipientName });
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
      }, children: "Internal Transfer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 flex-1 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl", style: {
        background: t.cardBg,
        border: `1px solid ${t.border}`
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold mb-4", style: {
          color: t.textMuted
        }, children: "From" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: ["Checking", "Savings"].map((acc) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFromAccount(acc), className: "flex-1 py-3 px-4 rounded-xl font-bold transition-all", style: {
          background: fromAccount === acc ? t.accentCyan : t.inputBg,
          color: fromAccount === acc ? "#0B1120" : t.textMuted
        }, children: acc }, acc)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-sm", style: {
          color: t.textMuted
        }, children: [
          "Available: $",
          formatCurrency(fromBalance)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl", style: {
        background: t.cardBg,
        border: `1px solid ${t.border}`
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold mb-4", style: {
          color: t.textMuted
        }, children: "To" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: ["Checking", "Savings"].map((acc) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setToAccount(acc), disabled: acc === fromAccount, className: "flex-1 py-3 px-4 rounded-xl font-bold transition-all", style: {
          background: toAccount === acc ? t.accentCyan : t.inputBg,
          color: toAccount === acc ? "#0B1120" : t.textMuted,
          opacity: acc === fromAccount ? 0.3 : 1
        }, children: acc }, acc)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-sm", style: {
          color: t.textMuted
        }, children: [
          "Current: $",
          formatCurrency(toBalance)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-mono", style: {
            color: t.textMuted
          }, children: "$" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: amount, onChange: (e) => setAmount(e.target.value), placeholder: "0.00", className: "text-4xl font-mono font-bold bg-transparent outline-none text-center w-48", style: {
            color: t.textPrimary
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setAmount(fromBalance.toString()), className: "text-sm font-semibold", style: {
          color: t.accentCyan
        }, children: "MAX" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: note, onChange: (e) => setNote(e.target.value), placeholder: "Add a note (optional)", className: "w-full px-4 py-4 rounded-xl outline-none", style: {
        background: t.inputBg,
        color: t.textPrimary,
        border: `1px solid ${t.border}`
      } }),
      amount && parseFloat(amount) > 0 && fromAccount !== toAccount && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl", style: {
        background: t.cardBg,
        border: `1px solid ${t.border}`
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
            color: t.textMuted
          }, children: fromAccount }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
            color: t.textMuted
          }, children: "→" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
            color: t.textMuted
          }, children: toAccount })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
            color: t.textMuted
          }, children: "Requires Admin Approval" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
            color: t.accentYellow
          }, children: "Yes" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowConfirm(true), disabled: !amount || parseFloat(amount) <= 0 || fromAccount === toAccount || loading, className: "w-full py-4 rounded-xl font-semibold transition-all text-white", style: {
      background: t.gradientBtn,
      opacity: !amount || parseFloat(amount) <= 0 || fromAccount === toAccount || loading ? 0.5 : 1
    }, children: loading ? "Submitting…" : "Request Transfer" }) }),
    showConfirm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", style: {
        background: "rgba(0,0,0,0.55)"
      }, onClick: () => setShowConfirm(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full p-6 rounded-t-[28px]", style: {
        background: t.cardBg
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-1 rounded-full mx-auto mb-6", style: {
          background: t.mutedBg
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold mb-6 text-center", style: {
          color: t.textPrimary
        }, children: "Confirm Transfer Request" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mb-8", children: [
          [["From", fromAccount], ["To", toAccount], ["Note", note || "No note"]].map(([label, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
              color: t.textMuted
            }, children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
              color: t.textPrimary
            }, children: value })
          ] }, label)),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
              color: t.textMuted
            }, children: "Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xl font-mono font-bold", style: {
              color: t.textPrimary
            }, children: [
              "$",
              formatCurrency(parseFloat(amount))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowConfirm(false), className: "py-4 rounded-xl font-semibold", style: {
            background: t.inputBg,
            color: t.textMuted
          }, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleConfirm, disabled: loading, className: "py-4 rounded-xl font-semibold text-white", style: {
            background: t.gradientBtn,
            opacity: loading ? 0.6 : 1
          }, children: loading ? "Submitting…" : "Confirm" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
export {
  InternalTransfer as component
};
