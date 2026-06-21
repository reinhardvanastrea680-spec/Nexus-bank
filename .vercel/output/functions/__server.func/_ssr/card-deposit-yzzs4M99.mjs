import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useTheme } from "./use-theme-BfOV-CAK.mjs";
import { B as BottomNav, t as themeColors } from "./BottomNav-CtUMOiqo.mjs";
import { u as useUserAccount } from "./useUserAccount-DGi8dU3l.mjs";
import { T as TransactionSuccessScreen, s as submitTransaction } from "./TransactionSuccessScreen-CK6mhzHA.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__storage.mjs";
import { A as ArrowLeft, D as CreditCard } from "../_libs/lucide-react.mjs";
import "../_libs/react-dom.mjs";
import "async_hooks";
import "stream";
import "util";
import "crypto";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/tanstack__history.mjs";
import "node:stream/web";
import "node:stream";
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
const savedCards = [{
  id: "1",
  brand: "Visa",
  last4: "4242",
  expiry: "12/26",
  color: "#1A6FED"
}, {
  id: "2",
  brand: "Mastercard",
  last4: "5555",
  expiry: "09/25",
  color: "#EB001B"
}];
function formatCurrency(value) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
function CardDeposit() {
  const {
    theme
  } = useTheme();
  const t = themeColors(theme);
  const {
    account
  } = useUserAccount();
  const [selectedCardId, setSelectedCardId] = reactExports.useState(savedCards[0]?.id ?? null);
  const [amount, setAmount] = reactExports.useState("");
  const [destinationAccount, setDestinationAccount] = reactExports.useState("Checking");
  const [showConfirm, setShowConfirm] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(false);
  const [successData, setSuccessData] = reactExports.useState(null);
  const selectedCard = savedCards.find((c) => c.id === selectedCardId);
  const handleContinue = () => {
    if (!selectedCardId) {
      toast.error("Please select a card");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setShowConfirm(true);
  };
  const handleConfirm = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      const {
        transactionRef
      } = await submitTransaction({
        type: "check_deposit",
        subType: "card_deposit",
        description: `Card Deposit — ${selectedCard?.brand} ****${selectedCard?.last4}`,
        category: "Deposit",
        amount: parseFloat(amount),
        fundingAccount: destinationAccount.toLowerCase(),
        toAccount: destinationAccount,
        note: `Card: ${selectedCard?.brand} ****${selectedCard?.last4}`
      });
      setSuccessData({
        amount: parseFloat(amount),
        transactionRef,
        fundingAccount: destinationAccount
      });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Deposit failed");
    } finally {
      setLoading(false);
    }
  };
  if (successData) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TransactionSuccessScreen, { amount: successData.amount, transactionRef: successData.transactionRef, fundingAccount: successData.fundingAccount });
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
      }, children: "Card Deposit" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 flex-1 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold mb-3", style: {
          color: t.textMuted
        }, children: "Select Card" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          savedCards.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelectedCardId(card.id), className: "w-full p-4 rounded-2xl text-left transition-all flex items-center gap-4", style: {
            background: t.cardBg,
            border: selectedCardId === card.id ? "2px solid #38BDF8" : "1px solid rgba(255,255,255,0.07)",
            boxShadow: selectedCardId === card.id ? "0 0 0 3px rgba(56,189,248,0.15)" : "none"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-8 rounded-lg flex items-center justify-center", style: {
              background: card.color
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 18, style: {
              color: t.textPrimary
            } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold", style: {
                color: t.textPrimary
              }, children: [
                card.brand,
                " ••••",
                card.last4
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs", style: {
                color: t.textMuted
              }, children: [
                "Expires ",
                card.expiry
              ] })
            ] }),
            selectedCardId === card.id && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 rounded-full flex items-center justify-center", style: {
              background: "#38BDF8"
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-white" }) })
          ] }, card.id)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full p-4 rounded-2xl text-center border-2 border-dashed transition-all", style: {
            borderColor: "rgba(56,189,248,0.3)",
            color: t.accentCyan
          }, onClick: () => toast.info("Card management coming soon"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: "+ Add New Card" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold mb-3", style: {
          color: t.textMuted
        }, children: "Deposit Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 py-6 rounded-2xl", style: {
          background: t.cardBg
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-mono", style: {
            color: t.textMuted
          }, children: "$" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: amount, onChange: (e) => setAmount(e.target.value), placeholder: "0.00", className: "text-4xl font-mono font-bold bg-transparent outline-none text-center w-48", style: {
            color: t.textPrimary
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center gap-3 mt-3", children: [100, 500, 1e3, 5e3].map((preset) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setAmount(preset.toString()), className: "px-3 py-1.5 rounded-full text-xs font-semibold", style: {
          background: t.inputBg,
          color: t.accentCyan
        }, children: [
          "$",
          preset.toLocaleString()
        ] }, preset)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold mb-3", style: {
          color: t.textMuted
        }, children: "Deposit To" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: ["Checking", "Savings"].map((acc) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDestinationAccount(acc), className: "flex-1 py-3 px-4 rounded-xl font-bold transition-all", style: {
          background: destinationAccount === acc ? "#38BDF8" : "#1A2438",
          color: destinationAccount === acc ? t.pageBg : "#8A9BB5"
        }, children: acc }, acc)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs mt-2 text-center", style: {
          color: t.textMuted
        }, children: [
          "Current:",
          " ",
          "$",
          formatCurrency(destinationAccount === "Checking" ? account?.checkingBalance || 0 : account?.savingsBalance || 0)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 rounded-2xl", style: {
        background: "rgba(56,189,248,0.06)",
        border: "1px solid rgba(56,189,248,0.15)"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-center", style: {
        color: t.textMuted
      }, children: "Card deposits are subject to admin review. Funds will be credited once approved." }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleContinue, disabled: !selectedCardId || !amount || parseFloat(amount) <= 0 || loading, className: "w-full py-4 rounded-xl font-semibold transition-all", style: {
      background: "linear-gradient(135deg, #38BDF8, #6366F1)",
      color: t.textPrimary,
      opacity: !selectedCardId || !amount || parseFloat(amount) <= 0 || loading ? 0.5 : 1
    }, children: "Continue" }) }),
    showConfirm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", style: {
        background: "rgba(0,0,0,0.5)"
      }, onClick: () => setShowConfirm(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full p-6 rounded-t-[28px]", style: {
        background: t.cardBg
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-1 rounded-full mx-auto mb-6", style: {
          background: t.mutedBg
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold mb-6 text-center", style: {
          color: t.textPrimary
        }, children: "Confirm Deposit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
              color: t.textMuted
            }, children: "Card" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold", style: {
              color: t.textPrimary
            }, children: [
              selectedCard?.brand,
              " ••••",
              selectedCard?.last4
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
              color: t.textMuted
            }, children: "Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xl font-mono font-bold", style: {
              color: t.textPrimary
            }, children: [
              "$",
              formatCurrency(parseFloat(amount))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
              color: t.textMuted
            }, children: "Deposit To" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
              color: t.textPrimary
            }, children: destinationAccount })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
              color: t.textMuted
            }, children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
              color: t.accentYellow
            }, children: "Pending Admin Review" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowConfirm(false), className: "py-4 rounded-xl font-semibold", style: {
            background: t.inputBg,
            color: t.textMuted
          }, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleConfirm, disabled: loading, className: "py-4 rounded-xl font-semibold", style: {
            background: "linear-gradient(135deg, #38BDF8, #6366F1)",
            color: t.textPrimary,
            opacity: loading ? 0.6 : 1
          }, children: loading ? "Submitting…" : "Confirm" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
export {
  CardDeposit as component
};
