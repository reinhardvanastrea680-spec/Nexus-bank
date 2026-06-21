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
import { A as ArrowLeft, b as CircleCheck, c as CircleX } from "../_libs/lucide-react.mjs";
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
const countries = [{
  code: "US",
  name: "United States"
}, {
  code: "DE",
  name: "Germany"
}, {
  code: "GB",
  name: "United Kingdom"
}, {
  code: "CA",
  name: "Canada"
}, {
  code: "AU",
  name: "Australia"
}, {
  code: "JP",
  name: "Japan"
}, {
  code: "CH",
  name: "Switzerland"
}];
const currencies = [{
  code: "USD",
  name: "US Dollar"
}, {
  code: "EUR",
  name: "Euro"
}, {
  code: "GBP",
  name: "British Pound"
}, {
  code: "CAD",
  name: "Canadian Dollar"
}, {
  code: "AUD",
  name: "Australian Dollar"
}, {
  code: "JPY",
  name: "Japanese Yen"
}, {
  code: "CHF",
  name: "Swiss Franc"
}];
function WireTransferWizard() {
  const {
    theme
  } = useTheme();
  const t2 = themeColors(theme);
  const {
    account
  } = useUserAccount();
  const [step, setStep] = reactExports.useState(1);
  const [useSaved, setUseSaved] = reactExports.useState(true);
  const [selectedBeneficiary, setSelectedBeneficiary] = reactExports.useState(null);
  const [beneficiary, setBeneficiary] = reactExports.useState({
    fullName: "",
    bankName: "",
    bankCountry: "",
    swiftCode: "",
    accountNumber: "",
    routingNumber: ""
  });
  const [transfer, setTransfer] = reactExports.useState({
    src: "Checking",
    amount: "",
    toCurrency: "EUR"
  });
  const [purpose, setPurpose] = reactExports.useState("");
  const [otherPurposeText, setOtherPurposeText] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [successData, setSuccessData] = reactExports.useState(null);
  const savedBeneficiaries = [{
    id: "1",
    nickname: "John Doe",
    bankName: "Deutsche Bank",
    country: "Germany",
    cc: "DE"
  }, {
    id: "2",
    nickname: "Sarah Smith",
    bankName: "Barclays",
    country: "United Kingdom",
    cc: "GB"
  }];
  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        if (useSaved) {
          if (!selectedBeneficiary) {
            toast.error("Please select a beneficiary");
            return false;
          }
        } else {
          if (!beneficiary.fullName.trim()) {
            toast.error("Please enter full name");
            return false;
          }
          if (!beneficiary.bankName.trim()) {
            toast.error("Please enter bank name");
            return false;
          }
          if (!beneficiary.bankCountry) {
            toast.error("Please select bank country");
            return false;
          }
          if (!beneficiary.swiftCode.trim()) {
            toast.error("Please enter SWIFT/BIC code");
            return false;
          }
          if (!beneficiary.accountNumber.trim()) {
            toast.error("Please enter account number");
            return false;
          }
          if (beneficiary.bankCountry === "US" && !beneficiary.routingNumber.trim()) {
            toast.error("Please enter routing number");
            return false;
          }
        }
        return true;
      case 2:
        if (!transfer.amount || parseFloat(transfer.amount) <= 0) {
          toast.error("Please enter a valid amount");
          return false;
        }
        return true;
      case 3:
        if (!purpose) {
          toast.error("Please select a purpose");
          return false;
        }
        if (purpose === "other" && !otherPurposeText.trim()) {
          toast.error("Please specify the purpose");
          return false;
        }
        return true;
      default:
        return true;
    }
  };
  const next = () => {
    if (validateStep(step)) {
      setStep((p) => Math.min(p + 1, 6));
    }
  };
  const back = () => step > 1 ? setStep((p) => p - 1) : navigate({
    to: "/"
  });
  const handleSubmit = async () => {
    if (!transfer.amount || parseFloat(transfer.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    const fromBalance = transfer.src === "Checking" ? account?.checkingBalance || 0 : account?.savingsBalance || 0;
    const totalAmount = parseFloat(transfer.amount) + 25;
    if (totalAmount > fromBalance) {
      toast.error("Insufficient funds");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const selectedBen = useSaved ? savedBeneficiaries.find((b) => b.id === selectedBeneficiary) : null;
      const recipientFullName = selectedBen?.nickname || beneficiary.fullName;
      const bankName = selectedBen?.bankName || beneficiary.bankName;
      const bankCountry = selectedBen?.country || beneficiary.bankCountry;
      const {
        transactionRef
      } = await submitTransaction({
        type: "wire_transfer",
        subType: "outgoing",
        description: `Wire Transfer to ${recipientFullName} (${bankName}, ${bankCountry})`,
        category: "Transfer",
        amount: parseFloat(transfer.amount),
        fundingAccount: transfer.src.toLowerCase(),
        recipientName: recipientFullName,
        recipientBank: bankName,
        toBank: bankName,
        toCountry: bankCountry,
        toAccountNumber: beneficiary.accountNumber,
        toSwiftCode: beneficiary.swiftCode,
        toRoutingNumber: beneficiary.routingNumber,
        toCurrency: transfer.toCurrency,
        purpose: purpose === "other" ? otherPurposeText : purpose,
        fee: 25
      });
      setSuccessData({
        amount: parseFloat(transfer.amount),
        transactionRef,
        fundingAccount: transfer.src,
        recipientName: recipientFullName
      });
      setStep(6);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to submit transfer request");
      toast.error(err.message || "Failed to submit transfer request");
    } finally {
      setLoading(false);
    }
  };
  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  if (successData) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TransactionSuccessScreen, { amount: successData.amount, transactionRef: successData.transactionRef, fundingAccount: successData.fundingAccount, recipientName: successData.recipientName });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen w-full flex flex-col pb-24", style: {
    background: t2.pageBg
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-10 pb-6 flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: back, className: "p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 24, style: {
        color: t2.textPrimary
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold flex-1 text-center", style: {
        color: t2.textPrimary
      }, children: "Wire Transfer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-2", children: [1, 2, 3, 4, 5].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full transition-all", style: {
      width: s === step ? 24 : 8,
      background: s <= step ? "#38BDF8" : "#1A2438"
    } }, s)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 flex-1 space-y-6", children: [
      step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setUseSaved(true), className: "flex-1 py-4 rounded-xl font-semibold transition-all", style: {
            background: useSaved ? "linear-gradient(135deg, #38BDF8, #6366F1)" : "#111827",
            color: useSaved ? "#FFFFFF" : "#8A9BB5",
            border: useSaved ? "none" : "1px solid rgba(255,255,255,0.07)"
          }, children: "Saved Beneficiary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setUseSaved(false), className: "flex-1 py-4 rounded-xl font-semibold transition-all", style: {
            background: !useSaved ? "linear-gradient(135deg, #38BDF8, #6366F1)" : "#111827",
            color: !useSaved ? "#FFFFFF" : "#8A9BB5",
            border: !useSaved ? "none" : "1px solid rgba(255,255,255,0.07)"
          }, children: "New Recipient" })
        ] }),
        useSaved ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: savedBeneficiaries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 rounded-2xl text-center", style: {
          background: t2.cardBg
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold mb-2", style: {
            color: t2.textPrimary
          }, children: "No saved beneficiaries" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: {
            color: t2.textMuted
          }, children: "Switch to New Recipient to add one." })
        ] }) : savedBeneficiaries.map((ben) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedBeneficiary(ben.id), className: "w-full p-4 rounded-2xl text-left transition-all", style: {
          background: t2.cardBg,
          border: selectedBeneficiary === ben.id ? "2px solid #38BDF8" : "1px solid rgba(255,255,255,0.07)",
          boxShadow: selectedBeneficiary === ben.id ? "0 0 0 3px rgba(56,189,248,0.15)" : "none"
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm", style: {
            background: "#38BDF8",
            color: t2.pageBg
          }, children: ben.cc }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", style: {
              color: t2.textPrimary
            }, children: ben.nickname }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs", style: {
              color: t2.textMuted
            }, children: [
              ben.bankName,
              " · ",
              ben.country
            ] })
          ] }),
          selectedBeneficiary === ben.id && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 20, style: {
            color: t2.accentCyan
          } })
        ] }) }, ben.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          [{
            k: "fullName",
            label: "Full Legal Name",
            ph: "John Doe"
          }, {
            k: "bankName",
            label: "Bank Name",
            ph: "Deutsche Bank AG"
          }, {
            k: "swiftCode",
            label: "SWIFT / BIC",
            ph: "DEUTDEDB"
          }, {
            k: "accountNumber",
            label: "IBAN / Account",
            ph: "DE89370400440532013000"
          }].map(({
            k,
            label,
            ph
          }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold mb-2", style: {
              color: t2.textMuted
            }, children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: beneficiary[k], placeholder: ph, className: "w-full px-4 py-4 rounded-xl outline-none", style: {
              background: t2.inputBg,
              color: t2.textPrimary
            }, onFocus: (e) => e.target.style.borderColor = "#38BDF8", onBlur: (e) => e.target.style.borderColor = "rgba(255,255,255,0.1)", onChange: (e) => setBeneficiary({
              ...beneficiary,
              [k]: e.target.value
            }) })
          ] }, k)),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold mb-2", style: {
              color: t2.textMuted
            }, children: "Bank Country" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: beneficiary.bankCountry, className: "w-full px-4 py-4 rounded-xl outline-none appearance-none", style: {
              background: t2.inputBg,
              color: t2.textPrimary
            }, onChange: (e) => setBeneficiary({
              ...beneficiary,
              bankCountry: e.target.value
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select country" }),
              countries.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.code, children: c.name }, c.code))
            ] })
          ] }),
          beneficiary.bankCountry === "US" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold mb-2", style: {
              color: t2.textMuted
            }, children: "Routing Number" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: beneficiary.routingNumber, placeholder: "021000021", className: "w-full px-4 py-4 rounded-xl outline-none", style: {
              background: t2.inputBg,
              color: t2.textPrimary
            }, onChange: (e) => setBeneficiary({
              ...beneficiary,
              routingNumber: e.target.value
            }) })
          ] })
        ] })
      ] }),
      step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold mb-2", style: {
            color: t2.textMuted
          }, children: "Source Account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: transfer.src, className: "w-full px-4 py-4 rounded-xl outline-none appearance-none", style: {
            background: t2.inputBg,
            color: t2.textPrimary
          }, onChange: (e) => setTransfer({
            ...transfer,
            src: e.target.value
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Checking", children: "Checking Account" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Savings", children: "Savings Account" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold mb-2", style: {
            color: t2.textMuted
          }, children: "Amount (USD)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-xl font-mono", style: {
              color: t2.textMuted
            }, children: "$" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "0", value: transfer.amount, placeholder: "0.00", className: "w-full pl-10 pr-4 py-4 rounded-xl outline-none text-xl font-mono", style: {
              background: t2.inputBg,
              color: t2.textPrimary
            }, onChange: (e) => setTransfer({
              ...transfer,
              amount: e.target.value
            }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold mb-2", style: {
            color: t2.textMuted
          }, children: "Destination Currency" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: transfer.toCurrency, className: "w-full px-4 py-4 rounded-xl outline-none appearance-none", style: {
            background: t2.inputBg,
            color: t2.textPrimary
          }, onChange: (e) => setTransfer({
            ...transfer,
            toCurrency: e.target.value
          }), children: currencies.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: c.code, children: [
            c.code,
            " - ",
            c.name
          ] }, c.code)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl", style: {
          background: "rgba(56,189,248,0.05)",
          border: "1px solid rgba(56,189,248,0.15)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
              color: t2.textMuted
            }, children: "You send" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold", style: {
              color: t2.textPrimary
            }, children: [
              "$",
              formatCurrency(parseFloat(transfer.amount || "0")),
              " USD"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
              color: t2.textMuted
            }, children: "Exchange rate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold", style: {
              color: t2.textPrimary
            }, children: [
              "1 USD = 0.92 ",
              transfer.toCurrency
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
              color: t2.textMuted
            }, children: "Transfer fee" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
              color: t2.textPrimary
            }, children: "$25.00" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { style: {
            borderColor: "rgba(255,255,255,0.07)"
          }, className: "my-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", style: {
              color: t2.textPrimary
            }, children: "Recipient gets" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-lg", style: {
              color: t2.accentCyan
            }, children: [
              ((parseFloat(transfer.amount || "0") - 25) * 0.92).toFixed(2),
              " ",
              transfer.toCurrency
            ] })
          ] })
        ] })
      ] }),
      step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold", style: {
          color: t2.textPrimary
        }, children: "Why are you sending?" }),
        [{
          id: "family",
          label: "Family Support / Personal"
        }, {
          id: "business",
          label: "Business Payment"
        }, {
          id: "education",
          label: "Education Fees"
        }, {
          id: "medical",
          label: "Medical Expenses"
        }, {
          id: "investment",
          label: "Investment / Securities"
        }, {
          id: "property",
          label: "Property Purchase"
        }, {
          id: "loan",
          label: "Loan Repayment"
        }, {
          id: "gift",
          label: "Gift / Donation"
        }, {
          id: "travel",
          label: "Travel / Living Expenses"
        }, {
          id: "other",
          label: "Other"
        }].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPurpose(p.id), className: "w-full p-4 rounded-2xl text-left text-sm font-semibold transition-all", style: {
          background: t2.cardBg,
          border: purpose === p.id ? "2px solid #38BDF8" : "1px solid rgba(255,255,255,0.07)",
          color: purpose === p.id ? "#38BDF8" : "#FFFFFF",
          boxShadow: purpose === p.id ? "0 0 0 3px rgba(56,189,248,0.15)" : "none"
        }, children: p.label }, p.id)),
        purpose === "other" && /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: otherPurposeText, onChange: (e) => setOtherPurposeText(e.target.value), placeholder: "Please specify", className: "w-full px-4 py-4 rounded-xl outline-none", style: {
          background: t2.inputBg,
          color: t2.textPrimary
        } })
      ] }),
      step === 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl", style: {
          background: t2.cardBg
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider font-semibold mb-3", style: {
            color: t2.textMuted
          }, children: "From Account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
              color: t2.textMuted
            }, children: "Account" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
              color: t2.textPrimary
            }, children: transfer.src })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl", style: {
          background: t2.cardBg
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider font-semibold mb-3", style: {
            color: t2.textMuted
          }, children: "Recipient" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
                color: t2.textMuted
              }, children: "Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
                color: t2.textPrimary
              }, children: useSaved ? savedBeneficiaries.find((b) => b.id === selectedBeneficiary)?.nickname : beneficiary.fullName })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
                color: t2.textMuted
              }, children: "Bank" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
                color: t2.textPrimary
              }, children: useSaved ? savedBeneficiaries.find((b) => b.id === selectedBeneficiary)?.bankName : beneficiary.bankName })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
                color: t2.textMuted
              }, children: "Country" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
                color: t2.textPrimary
              }, children: useSaved ? savedBeneficiaries.find((b) => b.id === selectedBeneficiary)?.country : beneficiary.bankCountry })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl", style: {
          background: t2.cardBg
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider font-semibold mb-3", style: {
            color: t2.textMuted
          }, children: "Transfer Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
                color: t2.textMuted
              }, children: "You send" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold", style: {
                color: t2.textPrimary
              }, children: [
                "$",
                formatCurrency(parseFloat(transfer.amount || "0")),
                " USD"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
                color: t2.textMuted
              }, children: "Exchange rate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold", style: {
                color: t2.textPrimary
              }, children: [
                "1 USD = 0.92 ",
                transfer.toCurrency
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
                color: t2.textMuted
              }, children: "Transfer fee" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
                color: t2.textPrimary
              }, children: "$25.00" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { style: {
              borderColor: "rgba(255,255,255,0.07)"
            }, className: "my-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
                color: t2.textMuted
              }, children: "Total debit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold", style: {
                color: t2.textPrimary
              }, children: [
                "$",
                formatCurrency(parseFloat(transfer.amount || "0") + 25)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
                color: t2.textMuted
              }, children: "Recipient gets" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold", style: {
                color: t2.accentCyan
              }, children: [
                ((parseFloat(transfer.amount || "0") - 25) * 0.92).toFixed(2),
                " ",
                transfer.toCurrency
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
                color: t2.textMuted
              }, children: "Purpose" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
                color: t2.textPrimary
              }, children: purpose === "other" ? otherPurposeText : purpose })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
                color: t2.textMuted
              }, children: "Est. delivery" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
                color: t2.textPrimary
              }, children: "3-5 Business Days" })
            ] })
          ] })
        ] })
      ] }),
      step === 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold", style: {
          color: t2.textPrimary
        }, children: "Confirm transfer" }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-xl p-4 text-sm", style: {
          background: "rgba(255,77,106,0.1)",
          border: "1px solid rgba(255,77,106,0.3)",
          color: t2.accentRed
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 20 }),
          error
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl", style: {
          background: t2.cardBg
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider font-semibold mb-3", style: {
            color: t2.textMuted
          }, children: "From Account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
              color: t2.textMuted
            }, children: "Account" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
              color: t2.textPrimary
            }, children: transfer.src })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl", style: {
          background: t2.cardBg
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider font-semibold mb-3", style: {
            color: t2.textMuted
          }, children: "Transfer Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
              color: t2.textMuted
            }, children: "You send" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold", style: {
              color: t2.textPrimary
            }, children: [
              "$",
              formatCurrency(parseFloat(transfer.amount || "0")),
              " USD"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
              color: t2.textMuted
            }, children: "Recipient gets" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-mono font-bold", style: {
              color: t2.accentCyan
            }, children: [
              ((parseFloat(transfer.amount || "0") - 25) * 0.92).toFixed(2),
              " ",
              transfer.toCurrency
            ] })
          ] })
        ] })
      ] })
    ] }),
    step < 6 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pb-8", children: step > 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: back, className: "py-4 rounded-xl font-semibold", style: {
        background: t2.inputBg,
        color: t2.textMuted
      }, children: "Back" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: step === 5 ? handleSubmit : next, disabled: loading, className: "py-4 rounded-xl font-semibold", style: {
        background: "linear-gradient(135deg, #38BDF8, #6366F1)",
        color: t2.textPrimary,
        opacity: loading ? 0.6 : 1
      }, children: loading ? "Submitting…" : step === 5 ? "Confirm & Send" : "Continue" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: next, disabled: useSaved ? !selectedBeneficiary : !beneficiary.fullName, className: "w-full py-4 rounded-xl font-semibold transition-all", style: {
      background: "linear-gradient(135deg, #38BDF8, #6366F1)",
      color: t2.textPrimary,
      opacity: (useSaved ? !selectedBeneficiary : !beneficiary.fullName) ? 0.5 : 1
    }, children: "Continue" }) }),
    step === 6 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
export {
  WireTransferWizard as component
};
