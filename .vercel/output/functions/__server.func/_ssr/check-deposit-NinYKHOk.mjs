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
import { A as ArrowLeft, X, z as Camera } from "../_libs/lucide-react.mjs";
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
function CheckDeposit() {
  const {
    theme
  } = useTheme();
  const t = themeColors(theme);
  useUserAccount();
  const [step, setStep] = reactExports.useState(1);
  const [frontImage, setFrontImage] = reactExports.useState(null);
  const [backImage, setBackImage] = reactExports.useState(null);
  const [frontFile, setFrontFile] = reactExports.useState(null);
  const [backFile, setBackFile] = reactExports.useState(null);
  const [amount, setAmount] = reactExports.useState("");
  const [checkNumber, setCheckNumber] = reactExports.useState("");
  const [routingNumber, setRoutingNumber] = reactExports.useState("");
  const [accountNumber, setAccountNumber] = reactExports.useState("");
  const [selectedAccount, setSelectedAccount] = reactExports.useState("Checking");
  const [memo, setMemo] = reactExports.useState("");
  const [successData, setSuccessData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
  const handleFileSelect = (side, file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG, and PDF files are allowed");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 10MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (side === "front") {
        setFrontFile(file);
        setFrontImage(reader.result);
      } else {
        setBackFile(file);
        setBackImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };
  const triggerFileInput = (side, useCamera = false) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = useCamera ? "image/*" : "image/*,.pdf";
    input.capture = useCamera ? "environment" : void 0;
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        handleFileSelect(side, file);
      }
    };
    input.click();
  };
  const steps = [{
    id: 1,
    label: "Photo"
  }, {
    id: 2,
    label: "Details"
  }, {
    id: 3,
    label: "Confirm"
  }];
  const handleNext = () => {
    if (step === 1 && (!frontImage || !backImage)) {
      toast.error("Please upload both sides of the check");
      return;
    }
    if (step === 2 && (!amount || !checkNumber || !routingNumber || !accountNumber)) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };
  const handleBack = () => {
    if (step === 1) {
      navigate({
        to: "/"
      });
    } else {
      setStep((prev) => prev - 1);
    }
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const depositAmount = parseFloat(amount || "0");
      const {
        transactionRef
      } = await submitTransaction({
        type: "check_deposit",
        subType: "incoming",
        description: `Check Deposit #${checkNumber}`,
        category: "Deposit",
        amount: depositAmount,
        fundingAccount: selectedAccount.toLowerCase(),
        toAccount: selectedAccount,
        checkNumber,
        routingNumber,
        accountNumber,
        memo
      });
      setSuccessData({
        amount: depositAmount,
        transactionRef,
        fundingAccount: selectedAccount
      });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to submit check deposit");
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleBack, className: "p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 24, style: {
        color: t.textPrimary
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold flex-1 text-center", style: {
        color: t.textPrimary
      }, children: "Check Deposit" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10" }),
      " "
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: steps.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm", style: {
          background: s.id <= step ? "#38BDF8" : "#1A2438",
          color: s.id <= step ? t.pageBg : "#8A9BB5"
        }, children: s.id }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs mt-1", style: {
          color: t.textMuted
        }, children: s.label })
      ] }),
      s.id < steps.length && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-0.5 mx-2", style: {
        background: s.id < step ? "#38BDF8" : "#1A2438"
      } })
    ] }, s.id)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 flex-1 space-y-6", children: [
      step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 rounded-2xl", style: {
          background: t.cardBg
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full flex items-center justify-center", style: {
            background: "#38BDF820"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
            color: t.accentCyan
          }, children: "📄" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold", style: {
              color: t.textPrimary
            }, children: "Deposit a Check" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: {
              color: t.textMuted
            }, children: "Take photos of the front and back of your check to deposit it" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-semibold", style: {
            color: t.textMuted
          }, children: "Front of Check" }),
          frontImage ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            frontFile?.type === "application/pdf" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-48 rounded-2xl flex flex-col items-center justify-center", style: {
              background: t.inputBg
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", style: {
                color: t.accentCyan
              }, children: "PDF" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", style: {
                color: t.textMuted
              }, children: frontFile.name })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: frontImage, alt: "Front of check", className: "w-full h-48 object-cover rounded-2xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
              setFrontImage(null);
              setFrontFile(null);
            }, className: "absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center", style: {
              background: t.inputBg,
              color: t.accentRed
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 }) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => triggerFileInput("front", true), className: "flex-1 h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2", style: {
              borderColor: "rgba(56,189,248,0.4)",
              background: t.inputBg
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 32, style: {
                color: t.accentCyan
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", style: {
                color: t.accentCyan
              }, children: "Take Photo" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => triggerFileInput("front", false), className: "flex-1 h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2", style: {
              borderColor: "rgba(56,189,248,0.4)",
              background: t.inputBg
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", style: {
                color: t.accentCyan
              }, children: "📁" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", style: {
                color: t.accentCyan
              }, children: "Upload File" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-semibold", style: {
            color: t.textMuted
          }, children: "Back of Check" }),
          backImage ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            backFile?.type === "application/pdf" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-48 rounded-2xl flex flex-col items-center justify-center", style: {
              background: t.inputBg
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", style: {
                color: t.accentCyan
              }, children: "PDF" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", style: {
                color: t.textMuted
              }, children: backFile.name })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: backImage, alt: "Back of check", className: "w-full h-48 object-cover rounded-2xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
              setBackImage(null);
              setBackFile(null);
            }, className: "absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center", style: {
              background: t.inputBg,
              color: t.accentRed
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 }) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => triggerFileInput("back", true), className: "flex-1 h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2", style: {
              borderColor: "rgba(56,189,248,0.4)",
              background: t.inputBg
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 32, style: {
                color: t.accentCyan
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", style: {
                color: t.accentCyan
              }, children: "Take Photo" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => triggerFileInput("back", false), className: "flex-1 h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2", style: {
              borderColor: "rgba(56,189,248,0.4)",
              background: t.inputBg
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", style: {
                color: t.accentCyan
              }, children: "📁" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", style: {
                color: t.accentCyan
              }, children: "Upload File" })
            ] })
          ] })
        ] })
      ] }),
      step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-semibold", style: {
            color: t.textMuted
          }, children: "Check Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-lg font-mono", style: {
              color: t.textMuted
            }, children: "$" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: amount, onChange: (e) => setAmount(e.target.value), placeholder: "0.00", className: "w-full pl-10 pr-4 py-4 rounded-xl outline-none", style: {
              background: t.inputBg,
              color: t.textPrimary
            } })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-semibold", style: {
            color: t.textMuted
          }, children: "Check Number" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: checkNumber, onChange: (e) => setCheckNumber(e.target.value), placeholder: "123456", className: "w-full px-4 py-4 rounded-xl outline-none", style: {
            background: t.inputBg,
            color: t.textPrimary
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-semibold", style: {
            color: t.textMuted
          }, children: "Routing Number on Check" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: routingNumber, onChange: (e) => setRoutingNumber(e.target.value), placeholder: "123456789", className: "w-full px-4 py-4 rounded-xl outline-none", style: {
            background: t.inputBg,
            color: t.textPrimary
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-semibold", style: {
            color: t.textMuted
          }, children: "Account Number on Check" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: accountNumber, onChange: (e) => setAccountNumber(e.target.value), placeholder: "1234567890", className: "w-full px-4 py-4 rounded-xl outline-none", style: {
            background: t.inputBg,
            color: t.textPrimary
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-semibold", style: {
            color: t.textMuted
          }, children: "Deposit To" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedAccount("Checking"), className: "flex-1 py-3 px-4 rounded-xl font-bold transition-all", style: {
              background: selectedAccount === "Checking" ? "#38BDF8" : "#1A2438",
              color: selectedAccount === "Checking" ? t.pageBg : "#8A9BB5"
            }, children: "Checking" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedAccount("Savings"), className: "flex-1 py-3 px-4 rounded-xl font-bold transition-all", style: {
              background: selectedAccount === "Savings" ? "#38BDF8" : "#1A2438",
              color: selectedAccount === "Savings" ? t.pageBg : "#8A9BB5"
            }, children: "Savings" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-semibold", style: {
            color: t.textMuted
          }, children: "Memo / Note (Optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: memo, onChange: (e) => setMemo(e.target.value), placeholder: "Add a memo", className: "w-full px-4 py-4 rounded-xl outline-none resize-none", rows: 3, style: {
            background: t.inputBg,
            color: t.textPrimary
          } })
        ] })
      ] }),
      step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 rounded-2xl", style: {
          background: t.cardBg
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold mb-6", style: {
            color: t.textPrimary
          }, children: "Review Deposit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
                color: t.textMuted
              }, children: "Amount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-mono font-bold", style: {
                color: t.textPrimary
              }, children: [
                "$",
                parseFloat(amount || "0").toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
                color: t.textMuted
              }, children: "Check Number" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
                color: t.textPrimary
              }, children: checkNumber })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
                color: t.textMuted
              }, children: "Deposit To" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
                color: t.textPrimary
              }, children: selectedAccount })
            ] }),
            memo && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
                color: t.textMuted
              }, children: "Memo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
                color: t.textPrimary
              }, children: memo })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 rounded-2xl", style: {
          background: t.inputBg
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: {
          color: t.textMuted
        }, children: "Check deposits are subject to review. Funds may be held for 1-3 business days." }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-8", children: [
      step > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleBack, className: "py-4 rounded-xl font-semibold", style: {
          background: t.inputBg,
          color: t.textMuted
        }, children: "Back" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: step === 3 ? handleSubmit : handleNext, disabled: loading, className: "py-4 rounded-xl font-semibold transition-all", style: {
          background: "linear-gradient(135deg, #38BDF8, #6366F1)",
          color: t.textPrimary,
          opacity: loading ? 0.5 : 1
        }, children: step === 3 ? loading ? "Submitting…" : "Submit Deposit" : "Continue" })
      ] }),
      step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleNext, disabled: !frontImage || !backImage, className: "w-full py-4 rounded-xl font-semibold transition-all", style: {
        background: "linear-gradient(135deg, #38BDF8, #6366F1)",
        color: t.textPrimary,
        opacity: !frontImage || !backImage ? 0.5 : 1
      }, children: "Continue" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
export {
  CheckDeposit as component
};
