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
import { A as ArrowLeft, R as RefreshCw } from "../_libs/lucide-react.mjs";
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
const initialCryptos = [{
  id: "bitcoin",
  name: "Bitcoin",
  symbol: "BTC",
  price: 68e3,
  change: 0,
  icon: "₿"
}, {
  id: "ethereum",
  name: "Ethereum",
  symbol: "ETH",
  price: 3600,
  change: 0,
  icon: "Ξ"
}, {
  id: "solana",
  name: "Solana",
  symbol: "SOL",
  price: 180,
  change: 0,
  icon: "◎"
}, {
  id: "tether",
  name: "USDT",
  symbol: "USDT",
  price: 1,
  change: 0,
  icon: "₮"
}, {
  id: "binancecoin",
  name: "BNB",
  symbol: "BNB",
  price: 580,
  change: 0,
  icon: "BNB"
}, {
  id: "ripple",
  name: "XRP",
  symbol: "XRP",
  price: 0.55,
  change: 0,
  icon: "XRP"
}];
function formatCurrency(value) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
function BuyCrypto() {
  const {
    theme
  } = useTheme();
  const t = themeColors(theme);
  const {
    account
  } = useUserAccount();
  const [cryptos, setCryptos] = reactExports.useState(initialCryptos);
  const [selectedCrypto, setSelectedCrypto] = reactExports.useState(initialCryptos[0]);
  const [amount, setAmount] = reactExports.useState("");
  const [selectedAccount, setSelectedAccount] = reactExports.useState("Checking");
  const [showConfirm, setShowConfirm] = reactExports.useState(false);
  const [successData, setSuccessData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [fetchingRates, setFetchingRates] = reactExports.useState(false);
  const [lastUpdated, setLastUpdated] = reactExports.useState(null);
  const fromBalance = selectedAccount === "Checking" ? account?.checkingBalance || 0 : account?.savingsBalance || 0;
  const cryptoAmount = amount && selectedCrypto.price ? (parseFloat(amount) / selectedCrypto.price).toFixed(6) : "0";
  const fetchCryptoRates = async () => {
    setFetchingRates(true);
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tether,binancecoin,ripple&vs_currencies=usd&include_24hr_change=true");
      const data = await response.json();
      setCryptos((prev) => prev.map((crypto) => {
        const apiData = data[crypto.id];
        if (apiData) {
          return {
            ...crypto,
            price: apiData.usd,
            change: apiData.usd_24h_change || 0
          };
        }
        return crypto;
      }));
      setLastUpdated(/* @__PURE__ */ new Date());
    } catch (error) {
      console.error("Error fetching crypto rates:", error);
      toast.error("Failed to fetch crypto rates, using cached data");
    } finally {
      setFetchingRates(false);
    }
  };
  reactExports.useEffect(() => {
    fetchCryptoRates();
    const interval = setInterval(fetchCryptoRates, 3e5);
    return () => clearInterval(interval);
  }, []);
  reactExports.useEffect(() => {
    const updatedSelected = cryptos.find((c) => c.id === selectedCrypto.id);
    if (updatedSelected) {
      setSelectedCrypto(updatedSelected);
    }
  }, [cryptos]);
  const handleBuy = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (parseFloat(amount) > fromBalance) {
      toast.error("Insufficient funds");
      return;
    }
    setShowConfirm(true);
  };
  const handleConfirm = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      const cryptoQty = amount && selectedCrypto.price ? parseFloat(amount) / selectedCrypto.price : 0;
      const {
        transactionRef
      } = await submitTransaction({
        type: "buy_crypto",
        subType: "outgoing",
        description: `Bought ${cryptoQty.toFixed(6)} ${selectedCrypto.symbol} for $${formatCurrency(parseFloat(amount))}`,
        category: "Crypto",
        amount: parseFloat(amount),
        fundingAccount: selectedAccount.toLowerCase(),
        cryptoId: selectedCrypto.id,
        cryptoSymbol: selectedCrypto.symbol,
        cryptoAmount: cryptoQty,
        fiatAmount: parseFloat(amount),
        priceAtTime: selectedCrypto.price
      });
      setSuccessData({
        amount: parseFloat(amount),
        transactionRef,
        fundingAccount: selectedAccount,
        recipientName: `${cryptoQty.toFixed(6)} ${selectedCrypto.symbol}`
      });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to submit purchase");
    } finally {
      setLoading(false);
    }
  };
  if (successData) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TransactionSuccessScreen, { amount: successData.amount, transactionRef: successData.transactionRef, fundingAccount: successData.fundingAccount, recipientName: successData.recipientName });
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
      }, children: "Buy Crypto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: fetchCryptoRates, disabled: fetchingRates, className: "p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 20, style: {
        color: fetchingRates ? "#8A9BB5" : "#38BDF8"
      }, className: fetchingRates ? "animate-spin" : "" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-center", style: {
      color: t.textMuted
    }, children: lastUpdated ? `Rates last updated: ${lastUpdated.toLocaleTimeString()}` : "Fetching rates..." }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 flex-1 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 overflow-x-auto pb-4 no-scrollbar", children: cryptos.map((crypto) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelectedCrypto(crypto), className: "flex-shrink-0 px-4 py-3 rounded-2xl border transition-all", style: {
        background: t.cardBg,
        borderColor: selectedCrypto.id === crypto.id ? "#38BDF8" : "rgba(255,255,255,0.07)",
        boxShadow: selectedCrypto.id === crypto.id ? "0 0 0 3px rgba(56,189,248,0.15)" : "none"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl mb-1", children: crypto.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", style: {
          color: t.textPrimary
        }, children: crypto.symbol }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", style: {
          color: t.textMuted
        }, children: [
          "$",
          crypto.price.toLocaleString()
        ] })
      ] }, crypto.id)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 rounded-2xl text-center", style: {
        background: t.cardBg
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-2", children: selectedCrypto.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold mb-1", style: {
          color: t.textPrimary
        }, children: selectedCrypto.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-mono font-bold mb-3", style: {
          color: t.textPrimary
        }, children: [
          "$",
          selectedCrypto.price.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold", style: {
          color: selectedCrypto.change >= 0 ? "#00E676" : "#FF4D6A"
        }, children: [
          selectedCrypto.change >= 0 ? "+" : "",
          selectedCrypto.change.toFixed(2),
          "% 24h"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold", style: {
          color: t.textMuted
        }, children: "You Pay" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-xl font-mono", style: {
            color: t.textMuted
          }, children: "$" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: amount, onChange: (e) => setAmount(e.target.value), placeholder: "0.00", className: "w-full pl-10 pr-4 py-4 rounded-xl text-xl font-mono outline-none", style: {
            background: t.inputBg,
            color: t.textPrimary
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm", style: {
            color: t.textMuted
          }, children: [
            "You Receive: ",
            cryptoAmount,
            " ",
            selectedCrypto.symbol
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
            color: t.accentCyan
          }, children: "USD" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl", style: {
        background: t.cardBg
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold mb-4", style: {
          color: t.textMuted
        }, children: "Pay From" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: ["Checking", "Savings"].map((acc) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedAccount(acc), className: "flex-1 py-3 px-4 rounded-xl font-bold transition-all", style: {
          background: selectedAccount === acc ? "#38BDF8" : "#1A2438",
          color: selectedAccount === acc ? t.pageBg : "#8A9BB5"
        }, children: acc }, acc)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm", style: {
          color: t.textMuted
        }, children: [
          "$",
          formatCurrency(fromBalance)
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl", style: {
        background: t.inputBg
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
            color: t.textMuted
          }, children: "Network Fee" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-mono", style: {
            color: t.textMuted
          }, children: "$2.99" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
            color: t.textMuted
          }, children: "Platform Fee" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-mono", style: {
            color: t.textMuted
          }, children: "$0.99" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { style: {
          borderColor: "rgba(255,255,255,0.07)"
        }, className: "my-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
            color: t.textPrimary
          }, children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-mono font-bold", style: {
            color: t.textPrimary
          }, children: [
            "$",
            formatCurrency(parseFloat(amount || "0") + 3.98)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.1)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
            color: t.textMuted
          }, children: "Requires Admin Approval" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
            color: t.accentYellow
          }, children: "Yes" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleBuy, disabled: !amount || parseFloat(amount) <= 0 || loading, className: "w-full py-4 rounded-xl font-semibold transition-all", style: {
      background: "linear-gradient(135deg, #38BDF8, #6366F1)",
      color: t.textPrimary,
      opacity: !amount || parseFloat(amount) <= 0 || loading ? 0.5 : 1
    }, children: loading ? "Submitting…" : "Buy Now" }) }),
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
        }, children: "Confirm Purchase" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
              color: t.textMuted
            }, children: "Coin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
              color: t.textPrimary
            }, children: selectedCrypto.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
              color: t.textMuted
            }, children: "You Pay" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-mono font-bold", style: {
              color: t.textPrimary
            }, children: [
              "$",
              formatCurrency(parseFloat(amount))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
              color: t.textMuted
            }, children: "You Receive" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-mono font-bold", style: {
              color: t.textPrimary
            }, children: [
              cryptoAmount,
              " ",
              selectedCrypto.symbol
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
              color: t.textMuted
            }, children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-mono font-bold", style: {
              color: t.textPrimary
            }, children: [
              "$",
              formatCurrency(parseFloat(amount) + 3.98)
            ] })
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
  BuyCrypto as component
};
