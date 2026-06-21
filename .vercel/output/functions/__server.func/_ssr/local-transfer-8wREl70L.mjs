import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useTheme } from "./use-theme-BfOV-CAK.mjs";
import { B as BottomNav, t as themeColors } from "./BottomNav-CtUMOiqo.mjs";
import { u as useUserAccount } from "./useUserAccount-DGi8dU3l.mjs";
import { T as TransactionSuccessScreen, s as submitTransaction } from "./TransactionSuccessScreen-CK6mhzHA.mjs";
import { u as useBeneficiaries } from "./useBeneficiaries-B91qKWY9.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__storage.mjs";
import { A as ArrowLeft, w as Star, u as Search, X } from "../_libs/lucide-react.mjs";
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
const globalBanks = [
  // United States
  {
    id: "us-chase",
    name: "JPMorgan Chase Bank",
    country: "United States",
    swift: "CHASUS33",
    routing: "021000021"
  },
  {
    id: "us-bofa",
    name: "Bank of America",
    country: "United States",
    swift: "BOFAUS3N",
    routing: "026009593"
  },
  {
    id: "us-wells",
    name: "Wells Fargo Bank",
    country: "United States",
    swift: "WFBIUS6S",
    routing: "121000248"
  },
  {
    id: "us-citi",
    name: "Citibank N.A.",
    country: "United States",
    swift: "CITIUS33",
    routing: "021000089"
  },
  // United Kingdom
  {
    id: "uk-hsbc",
    name: "HSBC Bank UK",
    country: "United Kingdom",
    swift: "MIDLGB22",
    sort: "40-00-00"
  },
  {
    id: "uk-barclays",
    name: "Barclays Bank",
    country: "United Kingdom",
    swift: "BARCGB22",
    sort: "20-00-00"
  },
  {
    id: "uk-lloyds",
    name: "Lloyds Bank",
    country: "United Kingdom",
    swift: "LOYDGB2L",
    sort: "30-00-00"
  },
  {
    id: "uk-natwest",
    name: "NatWest Bank",
    country: "United Kingdom",
    swift: "NWBKGB2L",
    sort: "60-00-00"
  },
  // European Union
  {
    id: "de-deutsche",
    name: "Deutsche Bank",
    country: "Germany",
    swift: "DEUTDEFF",
    blz: "50070001"
  },
  {
    id: "fr-societe",
    name: "Société Générale",
    country: "France",
    swift: "SOGEFRPP"
  },
  {
    id: "nl-ing",
    name: "ING Bank Netherlands",
    country: "Netherlands",
    swift: "INGBNL2A"
  },
  {
    id: "es-santander",
    name: "Banco Santander",
    country: "Spain",
    swift: "BSCHESMM"
  },
  // Nigeria (from original list)
  {
    id: "nexus",
    name: "Nexus Bank",
    country: "Nigeria"
  },
  {
    id: "momo",
    name: "MTN MoMo",
    country: "Nigeria"
  },
  {
    id: "opay",
    name: "Opay",
    country: "Nigeria"
  },
  {
    id: "kuda",
    name: "Kuda",
    country: "Nigeria"
  },
  {
    id: "gtb",
    name: "GTBank",
    country: "Nigeria"
  },
  {
    id: "access",
    name: "Access Bank",
    country: "Nigeria"
  },
  {
    id: "zenith",
    name: "Zenith Bank",
    country: "Nigeria"
  },
  // Canada
  {
    id: "ca-rbc",
    name: "Royal Bank of Canada",
    country: "Canada",
    swift: "ROYCCAT2"
  },
  {
    id: "ca-td",
    name: "TD Canada Trust",
    country: "Canada",
    swift: "TDOMCATT"
  },
  // Australia
  {
    id: "au-cba",
    name: "Commonwealth Bank of Australia",
    country: "Australia",
    swift: "CTBAAU2S"
  },
  {
    id: "au-westpac",
    name: "Westpac Banking Corporation",
    country: "Australia",
    swift: "WBCAAU2S"
  },
  // Singapore
  {
    id: "sg-dbs",
    name: "DBS Bank",
    country: "Singapore",
    swift: "DBSSSGSG"
  },
  {
    id: "sg-uob",
    name: "United Overseas Bank",
    country: "Singapore",
    swift: "UOVBSGSG"
  },
  // India
  {
    id: "in-sbi",
    name: "State Bank of India",
    country: "India",
    swift: "SBININBB"
  },
  {
    id: "in-hdfc",
    name: "HDFC Bank",
    country: "India",
    swift: "HDFCINBB"
  },
  // UAE
  {
    id: "ae-emirates",
    name: "Emirates NBD Bank",
    country: "United Arab Emirates",
    swift: "EBILAEAD"
  },
  {
    id: "ae-dubai",
    name: "Dubai Islamic Bank",
    country: "United Arab Emirates",
    swift: "DIBBAEAD"
  }
];
function formatCurrency(value) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
function LocalTransfer() {
  const {
    theme
  } = useTheme();
  const t = themeColors(theme);
  const {
    account
  } = useUserAccount();
  const {
    beneficiaries
  } = useBeneficiaries();
  const [step, setStep] = reactExports.useState(1);
  const [selectedBank, setSelectedBank] = reactExports.useState(null);
  const [bankSearchQuery, setBankSearchQuery] = reactExports.useState("");
  const [showBankResults, setShowBankResults] = reactExports.useState(false);
  const [accountNumber, setAccountNumber] = reactExports.useState("");
  const [recipientName, setRecipientName] = reactExports.useState("");
  const [recipientSwift, setRecipientSwift] = reactExports.useState("");
  const [recipientRouting, setRecipientRouting] = reactExports.useState("");
  const [amount, setAmount] = reactExports.useState("");
  const [note, setNote] = reactExports.useState("");
  const [sourceAccount, setSourceAccount] = reactExports.useState("Checking");
  const [loading, setLoading] = reactExports.useState(false);
  const fromBalance = sourceAccount === "Checking" ? account?.checkingBalance || 0 : account?.savingsBalance || 0;
  const [successData, setSuccessData] = reactExports.useState(null);
  const filteredBanks = globalBanks.filter((bank) => bank.name.toLowerCase().includes(bankSearchQuery.toLowerCase()) || bank.country.toLowerCase().includes(bankSearchQuery.toLowerCase()) || bank.swift && bank.swift.toLowerCase().includes(bankSearchQuery.toLowerCase()) || bank.routing && bank.routing.includes(bankSearchQuery));
  const handleSelectBank = (bank) => {
    setSelectedBank(bank);
    setRecipientSwift(bank.swift || "");
    setRecipientRouting(bank.routing || "");
    setBankSearchQuery(bank.name);
    setShowBankResults(false);
  };
  const handleSubmit = async () => {
    if (!selectedBank) {
      toast.error("Please select a bank");
      return;
    }
    if (!recipientName) {
      toast.error("Please enter recipient name");
      return;
    }
    if (!accountNumber) {
      toast.error("Please enter account number");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (parseFloat(amount) > fromBalance) {
      toast.error("Insufficient funds");
      return;
    }
    setLoading(true);
    try {
      const {
        transactionRef
      } = await submitTransaction({
        type: "local_transfer",
        subType: "outgoing",
        description: `Local Transfer to ${recipientName} (${selectedBank.name})`,
        category: "Transfer",
        amount: parseFloat(amount),
        fundingAccount: sourceAccount.toLowerCase(),
        recipientName,
        recipientAccount: accountNumber,
        recipientBank: selectedBank.name,
        toBank: selectedBank.name,
        toCountry: selectedBank.country,
        toAccountNumber: accountNumber,
        toSwiftCode: recipientSwift,
        toRoutingNumber: recipientRouting,
        note
      });
      setSuccessData({
        amount: parseFloat(amount),
        transactionRef,
        fundingAccount: sourceAccount,
        recipientName,
        saveBeneficiary: {
          fullName: recipientName,
          bankName: selectedBank.name,
          bankId: selectedBank.id,
          accountNumber
        }
      });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to submit transfer request");
    } finally {
      setLoading(false);
    }
  };
  if (successData) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TransactionSuccessScreen, { amount: successData.amount, transactionRef: successData.transactionRef, fundingAccount: successData.fundingAccount, recipientName: successData.recipientName, saveBeneficiary: successData.saveBeneficiary });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen w-full flex flex-col pb-24", style: {
    background: t.pageBg
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-10 pb-6 flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => step > 1 ? setStep(1) : navigate({
        to: "/"
      }), className: "p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 24, style: {
        color: t.textPrimary
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold flex-1 text-center", style: {
        color: t.textPrimary
      }, children: "Local Transfer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-2", children: [1, 2].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full transition-all", style: {
      width: s === step ? 24 : 8,
      background: s <= step ? "#38BDF8" : "#1A2438"
    } }, s)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 flex-1 space-y-6", children: [
      step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        beneficiaries.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-semibold mb-3", style: {
            color: t.textMuted
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 13, className: "inline mr-1", style: {
              color: t.accentYellow
            } }),
            "Saved Beneficiaries"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 overflow-x-auto pb-2 no-scrollbar", children: beneficiaries.map((ben) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
            setRecipientName(ben.fullName);
            setAccountNumber(ben.accountNumber);
            const match = globalBanks.find((b) => b.id === ben.bankId || b.name.toLowerCase() === ben.bankName.toLowerCase());
            if (match) {
              handleSelectBank(match);
            } else {
              setSelectedBank({
                id: ben.bankId,
                name: ben.bankName,
                country: "",
                swift: void 0,
                routing: void 0
              });
              setBankSearchQuery(ben.bankName);
              setShowBankResults(false);
            }
          }, className: "flex-shrink-0 flex flex-col items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm", style: {
              background: "#38BDF8",
              color: t.pageBg
            }, children: ben.initials }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs max-w-[56px] truncate text-center", style: {
              color: t.textMuted
            }, children: ben.nickname || ben.fullName })
          ] }, ben.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-semibold", style: {
            color: t.textMuted
          }, children: "Search & Select Bank" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/60" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: bankSearchQuery, onChange: (e) => {
              setBankSearchQuery(e.target.value);
              setShowBankResults(true);
            }, onFocus: () => setShowBankResults(true), placeholder: "Search by bank name, country, SWIFT, routing...", className: "w-full pl-10 pr-3 py-4 rounded-xl outline-none", style: {
              background: t.inputBg,
              color: t.textPrimary
            } }),
            showBankResults && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowBankResults(false), className: "absolute right-3 top-1/2 -translate-y-1/2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16, style: {
              color: t.textMuted
            } }) })
          ] }),
          showBankResults && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-80 overflow-y-auto rounded-xl border border-[rgba(255,255,255,0.07)]", style: {
            background: t.cardBg
          }, children: filteredBanks.length > 0 ? filteredBanks.map((bank) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleSelectBank(bank), className: "w-full text-left p-4 border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(56,189,248,0.1)] transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", style: {
              color: t.textPrimary
            }, children: bank.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-blue-300/70", children: [
              bank.country,
              bank.swift && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-3", children: [
                "SWIFT: ",
                bank.swift
              ] }),
              bank.routing && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-3", children: [
                "Routing: ",
                bank.routing
              ] })
            ] })
          ] }, bank.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 text-center text-sm", style: {
            color: t.textMuted
          }, children: "No banks found" }) })
        ] }),
        selectedBank && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl", style: {
          background: t.cardBg
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", style: {
                color: t.textPrimary
              }, children: selectedBank.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-blue-300/70", children: selectedBank.country })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
              setSelectedBank(null);
              setBankSearchQuery("");
            }, className: "p-2 rounded-full", style: {
              background: t.inputBg
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16, style: {
              color: t.accentRed
            } }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-semibold", style: {
              color: t.textMuted
            }, children: "Recipient Full Name *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: recipientName, onChange: (e) => setRecipientName(e.target.value), placeholder: "Enter recipient name", className: "w-full px-4 py-4 rounded-xl outline-none", style: {
              background: t.inputBg,
              color: t.textPrimary
            }, required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-semibold", style: {
              color: t.textMuted
            }, children: "Account Number *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: accountNumber, onChange: (e) => setAccountNumber(e.target.value.replace(/\D/g, "")), placeholder: "Enter recipient account number", className: "w-full px-4 py-4 rounded-xl outline-none", style: {
              background: t.inputBg,
              color: t.textPrimary
            }, required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-semibold", style: {
                color: t.textMuted
              }, children: "SWIFT Code (Optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: recipientSwift, onChange: (e) => setRecipientSwift(e.target.value.toUpperCase()), placeholder: "Enter SWIFT code", className: "w-full px-4 py-4 rounded-xl outline-none", style: {
                background: t.inputBg,
                color: t.textPrimary
              } })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-semibold", style: {
                color: t.textMuted
              }, children: "Routing/Sort Code (Optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: recipientRouting, onChange: (e) => setRecipientRouting(e.target.value), placeholder: "Enter routing code", className: "w-full px-4 py-4 rounded-xl outline-none", style: {
                background: t.inputBg,
                color: t.textPrimary
              } })
            ] })
          ] })
        ] })
      ] }),
      step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-mono", style: {
              color: t.textMuted
            }, children: "$" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: amount, onChange: (e) => setAmount(e.target.value), placeholder: "0.00", className: "text-5xl font-mono font-bold bg-transparent outline-none text-center w-48", style: {
              color: t.textPrimary
            } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm", style: {
              color: t.textMuted
            }, children: [
              "Available: $",
              formatCurrency(fromBalance)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setAmount(fromBalance.toString()), className: "text-sm font-semibold", style: {
              color: t.accentCyan
            }, children: "MAX" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-semibold", style: {
            color: t.textMuted
          }, children: "Source Account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSourceAccount("Checking"), className: "flex-1 py-4 px-4 rounded-xl font-bold transition-all", style: {
              background: sourceAccount === "Checking" ? "#38BDF8" : "#1A2438",
              color: sourceAccount === "Checking" ? t.pageBg : "#8A9BB5"
            }, children: "Checking" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSourceAccount("Savings"), className: "flex-1 py-4 px-4 rounded-xl font-bold transition-all", style: {
              background: sourceAccount === "Savings" ? "#38BDF8" : "#1A2438",
              color: sourceAccount === "Savings" ? t.pageBg : "#8A9BB5"
            }, children: "Savings" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-semibold", style: {
            color: t.textMuted
          }, children: "Note (Optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: note, onChange: (e) => setNote(e.target.value), placeholder: "What's this for?", className: "w-full px-4 py-4 rounded-xl outline-none", style: {
            background: t.inputBg,
            color: t.textPrimary
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl", style: {
          background: t.cardBg
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
              color: t.textMuted
            }, children: "Transfer to" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold", style: {
              color: t.textPrimary
            }, children: [
              recipientName,
              " - ",
              selectedBank?.name
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
              color: t.textMuted
            }, children: "Transfer fee" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
              color: t.textPrimary
            }, children: "$0.00" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { style: {
            borderColor: "rgba(255,255,255,0.07)"
          }, className: "my-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", style: {
              color: t.textPrimary
            }, children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xl font-mono font-bold", style: {
              color: t.accentCyan
            }, children: [
              "$",
              parseFloat(amount || "0").toLocaleString("en-US", {
                minimumFractionDigits: 2
              })
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
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pb-8", children: step > 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(1), className: "py-4 rounded-xl font-semibold", style: {
        background: t.inputBg,
        color: t.textMuted
      }, children: "Back" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleSubmit, disabled: !amount || parseFloat(amount) <= 0 || loading, className: "py-4 rounded-xl font-semibold", style: {
        background: "linear-gradient(135deg, #38BDF8, #6366F1)",
        color: t.textPrimary,
        opacity: !amount || parseFloat(amount) <= 0 || loading ? 0.5 : 1
      }, children: loading ? "Submitting…" : "Request Transfer" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(2), disabled: !selectedBank || !recipientName || !accountNumber, className: "w-full py-4 rounded-xl font-semibold transition-all", style: {
      background: "linear-gradient(135deg, #38BDF8, #6366F1)",
      color: t.textPrimary,
      opacity: !selectedBank || !recipientName || !accountNumber ? 0.5 : 1
    }, children: "Continue" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
export {
  LocalTransfer as component
};
