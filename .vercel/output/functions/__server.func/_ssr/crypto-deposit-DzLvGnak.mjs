import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useTheme } from "./use-theme-BfOV-CAK.mjs";
import { B as BottomNav, t as themeColors } from "./BottomNav-CtUMOiqo.mjs";
import { A as ArrowLeft, x as Copy, y as Share2 } from "../_libs/lucide-react.mjs";
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
const cryptos = [{
  id: "btc",
  symbol: "BTC",
  name: "Bitcoin",
  address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  network: "Bitcoin Network",
  minDeposit: 1e-4
}, {
  id: "eth",
  symbol: "ETH",
  name: "Ethereum",
  address: "0x71C7656EC7ab88b098defB751B7401B5f6d8F726",
  network: "Ethereum Network",
  minDeposit: 0.01
}, {
  id: "sol",
  symbol: "SOL",
  name: "Solana",
  address: "G5YQ5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q",
  network: "Solana Network",
  minDeposit: 0.1
}, {
  id: "usdt",
  symbol: "USDT",
  name: "Tether",
  address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  network: "TRC20 Network",
  minDeposit: 10
}];
const recentDeposits = [{
  id: 1,
  crypto: "BTC",
  amount: 0.5,
  status: "Confirmed",
  date: "2 days ago"
}, {
  id: 2,
  crypto: "ETH",
  amount: 2,
  status: "Pending",
  date: "1 day ago"
}];
function CryptoDeposit() {
  const navigate = useNavigate();
  const {
    theme
  } = useTheme();
  const t = themeColors(theme);
  const [selectedCrypto, setSelectedCrypto] = reactExports.useState(cryptos[0]);
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
      }, children: "Crypto Deposit" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 flex-1 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-center", style: {
        color: t.textMuted
      }, children: "Send crypto to the address below. Deposits are credited after network confirmation." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 overflow-x-auto pb-4 no-scrollbar", children: cryptos.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedCrypto(c), className: "flex-shrink-0 px-4 py-3 rounded-2xl border transition-all", style: {
        background: t.cardBg,
        borderColor: selectedCrypto.id === c.id ? t.accentCyan : t.border,
        boxShadow: selectedCrypto.id === c.id ? `0 0 0 3px ${t.accentCyan}25` : "none"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold", style: {
        color: t.textPrimary
      }, children: c.symbol }) }, c.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 rounded-2xl", style: {
        background: t.cardBg,
        border: `1px solid ${t.border}`
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-center mb-5", style: {
          color: t.textMuted
        }, children: [
          "Your ",
          selectedCrypto.symbol,
          " Deposit Address"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-48 h-48 mx-auto bg-white rounded-2xl mb-6 flex items-center justify-center overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full grid grid-cols-10 gap-0.5 p-2", children: Array(100).fill(0).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-sm", style: {
          background: i % 2 === 0 ? "#000" : "#fff"
        } }, i)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono break-all text-center mb-6", style: {
          color: t.textPrimary
        }, children: selectedCrypto.address }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
            navigator.clipboard.writeText(selectedCrypto.address);
            toast.success("Address copied!");
          }, className: "py-4 rounded-xl font-semibold flex items-center justify-center gap-2", style: {
            background: t.inputBg,
            color: t.accentCyan,
            border: `1px solid ${t.accentCyan}40`
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 18 }),
            " Copy"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => toast.success("Address shared!"), className: "py-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-white", style: {
            background: t.gradientBtn
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { size: 18 }),
            " Share"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-2xl flex items-start gap-3", style: {
        background: `${t.accentYellow}10`,
        borderLeft: `4px solid ${t.accentYellow}`
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⚠️" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", style: {
          color: t.accentYellow
        }, children: [
          "Only send ",
          selectedCrypto.symbol,
          " on the ",
          selectedCrypto.network,
          ". Sending other assets may result in permanent loss."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 rounded-2xl space-y-3", style: {
        background: t.cardBg,
        border: `1px solid ${t.border}`
      }, children: [["Minimum Deposit", `${selectedCrypto.minDeposit} ${selectedCrypto.symbol}`], ["Confirmations Required", "3 Confirmations"], ["Estimated Arrival", "10-30 minutes"]].map(([label, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
          color: t.textMuted
        }, children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
          color: t.textPrimary
        }, children: value })
      ] }, label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
          color: t.textMuted
        }, children: "Recent Deposits" }),
        recentDeposits.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 rounded-2xl", style: {
          background: t.cardBg,
          border: `1px solid ${t.border}`
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm", style: {
              background: t.accentCyan,
              color: "#0B1120"
            }, children: d.crypto }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold", style: {
                color: t.textPrimary
              }, children: [
                d.amount,
                " ",
                d.crypto
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", style: {
                color: t.textMuted
              }, children: d.date })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs px-3 py-1 rounded-full font-semibold", style: {
            background: d.status === "Confirmed" ? `${t.accentGreen}20` : `${t.accentYellow}20`,
            color: d.status === "Confirmed" ? t.accentGreen : t.accentYellow
          }, children: d.status })
        ] }, d.id))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
export {
  CryptoDeposit as component
};
