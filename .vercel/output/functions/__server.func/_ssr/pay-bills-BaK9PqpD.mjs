import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
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
import { A as ArrowLeft, b as CircleCheck, u as Search } from "../_libs/lucide-react.mjs";
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
const categories = [{
  id: "electricity",
  name: "Electricity",
  icon: "⚡"
}, {
  id: "water",
  name: "Water",
  icon: "💧"
}, {
  id: "gas",
  name: "Gas",
  icon: "🔥"
}, {
  id: "internet",
  name: "Internet",
  icon: "🌐"
}, {
  id: "mobile",
  name: "Mobile Recharge",
  icon: "📱"
}, {
  id: "cable",
  name: "Cable TV",
  icon: "📺"
}, {
  id: "insurance",
  name: "Insurance",
  icon: "🛡️"
}, {
  id: "credit-card",
  name: "Credit Card",
  icon: "💳"
}, {
  id: "loan",
  name: "Loan Payment",
  icon: "💰"
}, {
  id: "rent",
  name: "Rent",
  icon: "🏠"
}, {
  id: "tax",
  name: "Tax Payments",
  icon: "📋"
}, {
  id: "subscription",
  name: "Subscriptions",
  icon: "🔄"
}, {
  id: "government",
  name: "Government Services",
  icon: "🏛️"
}, {
  id: "education",
  name: "Education",
  icon: "🎓"
}];
const billers = [{
  id: "dstv",
  name: "DStv",
  category: "cable",
  initials: "DS",
  country: "Nigeria"
}, {
  id: "showmax",
  name: "Showmax",
  category: "subscription",
  initials: "SM",
  country: "Nigeria"
}, {
  id: "mtn",
  name: "MTN",
  category: "mobile",
  initials: "MT",
  country: "Nigeria"
}, {
  id: "airtel",
  name: "Airtel Nigeria",
  category: "mobile",
  initials: "AT",
  country: "Nigeria"
}, {
  id: "glo",
  name: "Glo Nigeria",
  category: "mobile",
  initials: "GL",
  country: "Nigeria"
}, {
  id: "ekedc",
  name: "Eko Electric",
  category: "electricity",
  initials: "EK",
  country: "Nigeria"
}, {
  id: "ikeja",
  name: "Ikeja Electric",
  category: "electricity",
  initials: "IE",
  country: "Nigeria"
}, {
  id: "lawma",
  name: "LAWMA",
  category: "government",
  initials: "LW",
  country: "Nigeria"
}, {
  id: "firs",
  name: "FIRS",
  category: "tax",
  initials: "FS",
  country: "Nigeria"
}, {
  id: "comcast",
  name: "Comcast Xfinity",
  category: "internet",
  initials: "CX",
  country: "United States"
}, {
  id: "verizon",
  name: "Verizon Wireless",
  category: "mobile",
  initials: "VZ",
  country: "United States"
}, {
  id: "att",
  name: "AT&T",
  category: "mobile",
  initials: "AT",
  country: "United States"
}, {
  id: "geico",
  name: "GEICO Insurance",
  category: "insurance",
  initials: "GI",
  country: "United States"
}, {
  id: "irs",
  name: "IRS Payments",
  category: "tax",
  initials: "IR",
  country: "United States"
}, {
  id: "chase",
  name: "Chase Credit Card",
  category: "credit-card",
  initials: "CH",
  country: "United States"
}, {
  id: "bt",
  name: "BT Broadband",
  category: "internet",
  initials: "BT",
  country: "United Kingdom"
}, {
  id: "o2",
  name: "O2 UK",
  category: "mobile",
  initials: "O2",
  country: "United Kingdom"
}, {
  id: "sky",
  name: "Sky UK",
  category: "cable",
  initials: "SK",
  country: "United Kingdom"
}, {
  id: "hmrc",
  name: "HMRC Tax",
  category: "tax",
  initials: "HM",
  country: "United Kingdom"
}, {
  id: "netflix",
  name: "Netflix",
  category: "subscription",
  initials: "NF",
  country: "Global"
}, {
  id: "spotify",
  name: "Spotify",
  category: "subscription",
  initials: "SP",
  country: "Global"
}, {
  id: "amazon",
  name: "Amazon Prime",
  category: "subscription",
  initials: "AP",
  country: "Global"
}, {
  id: "apple-music",
  name: "Apple Music",
  category: "subscription",
  initials: "AM",
  country: "Global"
}, {
  id: "school-fees",
  name: "University Fees",
  category: "education",
  initials: "UF",
  country: "Global"
}];
function formatCurrency(v) {
  return v.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
function PayBills() {
  const navigate = useNavigate();
  const {
    theme
  } = useTheme();
  const t = themeColors(theme);
  const {
    account
  } = useUserAccount();
  const [selectedCategory, setSelectedCategory] = reactExports.useState(null);
  const [selectedBiller, setSelectedBiller] = reactExports.useState(null);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [customerNumber, setCustomerNumber] = reactExports.useState("");
  const [customerVerified, setCustomerVerified] = reactExports.useState(false);
  const [amount, setAmount] = reactExports.useState("");
  const [selectedAccount, setSelectedAccount] = reactExports.useState("Checking");
  const [showConfirm, setShowConfirm] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(false);
  const [successData, setSuccessData] = reactExports.useState(null);
  const fromBalance = selectedAccount === "Checking" ? account?.checkingBalance || 0 : account?.savingsBalance || 0;
  const filteredBillers = billers.filter((b) => {
    const matchesCat = !selectedCategory || b.category === selectedCategory;
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });
  const handleConfirm = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      const {
        transactionRef
      } = await submitTransaction({
        type: "bill_payment",
        subType: "outgoing",
        description: `Bill Payment - ${selectedBiller?.name}`,
        category: categories.find((c) => c.id === selectedBiller?.category)?.name || "Bills",
        amount: parseFloat(amount),
        fundingAccount: selectedAccount.toLowerCase(),
        recipientName: selectedBiller?.name || "Biller",
        note: `Customer Ref: ${customerNumber}`
      });
      setSuccessData({
        amount: parseFloat(amount),
        transactionRef,
        fundingAccount: selectedAccount,
        recipientName: selectedBiller?.name || "Biller"
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  };
  if (successData) return /* @__PURE__ */ jsxRuntimeExports.jsx(TransactionSuccessScreen, { ...successData });
  if (selectedBiller) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen w-full flex flex-col pb-24", style: {
    background: t.pageBg
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-10 pb-6 flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedBiller(null), className: "p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 24, style: {
        color: t.textPrimary
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold flex-1 text-center", style: {
        color: t.textPrimary
      }, children: selectedBiller.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 flex-1 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold", style: {
          color: t.textMuted
        }, children: "Customer Number / Reference" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: customerNumber, onChange: (e) => setCustomerNumber(e.target.value), placeholder: "Enter customer number", className: "flex-1 px-4 py-4 rounded-xl outline-none", style: {
            background: t.inputBg,
            color: t.textPrimary,
            border: `1px solid ${t.border}`
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            if (!customerNumber) {
              toast.error("Enter customer number");
              return;
            }
            setCustomerVerified(true);
            toast.success("Verified");
          }, disabled: !customerNumber, className: "px-6 py-4 rounded-xl font-semibold", style: {
            background: t.accentCyan,
            color: "#0B1120",
            opacity: !customerNumber ? 0.5 : 1
          }, children: "Verify" })
        ] }),
        customerVerified && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl flex items-center gap-3", style: {
          background: "rgba(0,230,118,0.1)",
          border: "1px solid rgba(0,230,118,0.3)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 20, style: {
            color: t.accentGreen
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
            color: t.textPrimary
          }, children: "Customer Verified — John Doe" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold", style: {
          color: t.textMuted
        }, children: "Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-xl font-mono", style: {
            color: t.textMuted
          }, children: "$" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: amount, onChange: (e) => setAmount(e.target.value), placeholder: "0.00", className: "w-full pl-10 pr-4 py-4 rounded-xl text-xl font-mono outline-none", style: {
            background: t.inputBg,
            color: t.textPrimary,
            border: `1px solid ${t.border}`
          } })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl", style: {
        background: t.cardBg,
        border: `1px solid ${t.border}`
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold mb-4", style: {
          color: t.textMuted
        }, children: "Pay From" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: ["Checking", "Savings"].map((acc) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedAccount(acc), className: "flex-1 py-3 px-4 rounded-xl font-bold transition-all", style: {
          background: selectedAccount === acc ? t.accentCyan : t.inputBg,
          color: selectedAccount === acc ? "#0B1120" : t.textMuted
        }, children: acc }, acc)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs mt-3", style: {
          color: t.textMuted
        }, children: [
          "Available: $",
          formatCurrency(fromBalance)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
      if (!amount || parseFloat(amount) <= 0) {
        toast.error("Enter valid amount");
        return;
      }
      if (parseFloat(amount) > fromBalance) {
        toast.error("Insufficient funds");
        return;
      }
      setShowConfirm(true);
    }, disabled: !customerVerified || !amount || parseFloat(amount) <= 0, className: "w-full py-4 rounded-xl font-semibold text-white", style: {
      background: t.gradientBtn,
      opacity: !customerVerified || !amount || parseFloat(amount) <= 0 ? 0.5 : 1
    }, children: "Continue to Payment" }) }),
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
        }, children: "Confirm Payment" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 mb-8", children: [["Biller", selectedBiller.name], ["Amount", `$${formatCurrency(parseFloat(amount))}`]].map(([label, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
            color: t.textMuted
          }, children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
            color: t.textPrimary
          }, children: value })
        ] }, label)) }),
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
      }, children: "Pay Bills" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 flex-1 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 20, className: "absolute left-4 top-1/2 -translate-y-1/2", style: {
          color: t.textMuted
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Search billers or countries...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-12 pr-4 py-4 rounded-xl outline-none", style: {
          background: t.inputBg,
          color: t.textPrimary,
          border: `1px solid ${t.border}`
        } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 overflow-x-auto pb-4 no-scrollbar", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedCategory(null), className: "flex-shrink-0 px-4 py-2 rounded-full font-semibold", style: {
          background: !selectedCategory ? t.accentCyan : t.inputBg,
          color: !selectedCategory ? "#0B1120" : t.textMuted
        }, children: "All" }),
        categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelectedCategory(cat.id), className: "flex-shrink-0 px-4 py-2 rounded-full font-semibold flex items-center gap-2", style: {
          background: selectedCategory === cat.id ? t.accentCyan : t.inputBg,
          color: selectedCategory === cat.id ? "#0B1120" : t.textMuted
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: cat.icon }),
          cat.name
        ] }, cat.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4", children: filteredBillers.map((biller) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelectedBiller(biller), className: "p-6 rounded-2xl text-center transition-all", style: {
        background: t.cardBg,
        border: `1px solid ${t.border}`
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-lg", style: {
          background: t.accentCyan,
          color: "#0B1120"
        }, children: biller.initials }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", style: {
          color: t.textPrimary
        }, children: biller.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs mt-1", style: {
          color: t.textMuted
        }, children: [
          categories.find((c) => c.id === biller.category)?.name,
          " • ",
          biller.country
        ] })
      ] }, biller.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
export {
  PayBills as component
};
