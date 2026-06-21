import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useBeneficiaries } from "./useBeneficiaries-B91qKWY9.mjs";
import { u as useTheme } from "./use-theme-BfOV-CAK.mjs";
import { B as BottomNav, t as themeColors } from "./BottomNav-CtUMOiqo.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__storage.mjs";
import { A as ArrowLeft, m as User, b as CircleCheck, V as Trash2 } from "../_libs/lucide-react.mjs";
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
const banks = [{
  id: "mtn",
  name: "MTN MoMo"
}, {
  id: "opay",
  name: "Opay"
}, {
  id: "kuda",
  name: "Kuda"
}, {
  id: "gtb",
  name: "GTBank"
}, {
  id: "access",
  name: "Access Bank"
}, {
  id: "zenith",
  name: "Zenith Bank"
}, {
  id: "first",
  name: "First Bank"
}, {
  id: "uba",
  name: "UBA"
}, {
  id: "stanbic",
  name: "Stanbic IBTC"
}, {
  id: "palmpay",
  name: "Palmpay"
}, {
  id: "moniepoint",
  name: "Moniepoint"
}, {
  id: "chase",
  name: "JPMorgan Chase"
}, {
  id: "bofa",
  name: "Bank of America"
}, {
  id: "wells",
  name: "Wells Fargo"
}, {
  id: "hsbc",
  name: "HSBC"
}, {
  id: "barclays",
  name: "Barclays"
}, {
  id: "deutsche",
  name: "Deutsche Bank"
}, {
  id: "other",
  name: "Other"
}];
function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}
const avatarColors = ["#38BDF8", "#6366F1", "#00E676", "#FFAB00", "#FF4D6A", "#A855F7", "#EC4899", "#14B8A6", "#F97316"];
function getAvatarColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}
function AddBeneficiary() {
  const navigate = useNavigate();
  const {
    theme
  } = useTheme();
  const t = themeColors(theme);
  const {
    beneficiaries,
    loading,
    addBeneficiary,
    removeBeneficiary
  } = useBeneficiaries();
  const [fullName, setFullName] = reactExports.useState("");
  const [selectedBankId, setSelectedBankId] = reactExports.useState("");
  const [accountNumber, setAccountNumber] = reactExports.useState("");
  const [nickname, setNickname] = reactExports.useState("");
  const [accountType, setAccountType] = reactExports.useState("Personal");
  const [saving, setSaving] = reactExports.useState(false);
  const [selectedBen, setSelectedBen] = reactExports.useState(null);
  const [showSheet, setShowSheet] = reactExports.useState(false);
  const [deleting, setDeleting] = reactExports.useState(false);
  const selectedBankName = banks.find((b) => b.id === selectedBankId)?.name || "";
  const canSave = fullName.trim() && selectedBankId && accountNumber.trim();
  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const initials = getInitials(fullName.trim());
      await addBeneficiary({
        fullName: fullName.trim(),
        nickname: nickname.trim() || fullName.trim(),
        bankName: selectedBankName,
        bankId: selectedBankId,
        accountNumber: accountNumber.trim(),
        accountType,
        initials
      });
      toast.success("Beneficiary saved successfully");
      setFullName("");
      setSelectedBankId("");
      setAccountNumber("");
      setNickname("");
      setAccountType("Personal");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save beneficiary");
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async () => {
    if (!selectedBen) return;
    setDeleting(true);
    try {
      await removeBeneficiary(selectedBen.id);
      toast.success("Beneficiary removed");
      setShowSheet(false);
      setSelectedBen(null);
    } catch (err) {
      toast.error("Failed to remove beneficiary");
    } finally {
      setDeleting(false);
    }
  };
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
      }, children: "Beneficiaries" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 flex-1 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-semibold mb-3", style: {
          color: t.textMuted
        }, children: [
          "Saved Beneficiaries ",
          beneficiaries.length > 0 && `(${beneficiaries.length})`
        ] }),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: {
          color: t.textMuted
        }, children: "Loading..." }) : beneficiaries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl text-center", style: {
          background: t.cardBg,
          border: `1px dashed ${t.accentCyan}40`
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 32, className: "mx-auto mb-2", style: {
            color: t.accentCyan,
            opacity: 0.5
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", style: {
            color: t.textMuted
          }, children: "No saved beneficiaries yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", style: {
            color: t.textMuted,
            opacity: 0.6
          }, children: "Fill in the form below to add one" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4 overflow-x-auto pb-2 no-scrollbar", children: beneficiaries.map((ben) => {
          const color = getAvatarColor(ben.fullName);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
            setSelectedBen(ben);
            setShowSheet(true);
          }, className: "flex-shrink-0 flex flex-col items-center gap-2 group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg relative", style: {
              background: color,
              color: "#0B1120"
            }, children: ben.initials }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-center max-w-[60px] truncate", style: {
              color: t.textMuted
            }, children: ben.nickname || ben.fullName })
          ] }, ben.id);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl space-y-4", style: {
        background: t.cardBg
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", style: {
          color: t.textPrimary
        }, children: "Add New Beneficiary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-semibold mb-2", style: {
            color: t.textMuted
          }, children: "Full Name *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: fullName, onChange: (e) => setFullName(e.target.value), placeholder: "Enter full name", className: "w-full px-4 py-3.5 rounded-xl outline-none", style: {
            background: t.inputBg,
            color: t.textPrimary
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-semibold mb-2", style: {
            color: t.textMuted
          }, children: "Bank *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: selectedBankId, onChange: (e) => setSelectedBankId(e.target.value), className: "w-full px-4 py-3.5 rounded-xl outline-none appearance-none", style: {
            background: t.inputBg,
            color: selectedBankId ? "#FFFFFF" : "#8A9BB5"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, children: "Select bank" }),
            banks.map((bank) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: bank.id, children: bank.name }, bank.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-semibold mb-2", style: {
            color: t.textMuted
          }, children: "Account Number *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: accountNumber, onChange: (e) => setAccountNumber(e.target.value.replace(/\D/g, "")), placeholder: "Enter account number", className: "flex-1 px-4 py-3.5 rounded-xl outline-none", style: {
              background: t.inputBg,
              color: t.textPrimary
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => accountNumber && toast.success("Account Verified"), disabled: !accountNumber || !selectedBankId, className: "px-5 py-3.5 rounded-xl font-semibold text-sm", style: {
              background: "#38BDF8",
              color: "#0B1120",
              opacity: !accountNumber || !selectedBankId ? 0.4 : 1
            }, children: "Verify" })
          ] }),
          accountNumber.length >= 6 && selectedBankId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 p-3 rounded-xl flex items-center gap-2", style: {
            background: "rgba(0,230,118,0.1)",
            border: "1px solid rgba(0,230,118,0.25)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 16, style: {
              color: "#00E676"
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold", style: {
              color: "#00E676"
            }, children: [
              fullName || "Account holder",
              " — ",
              selectedBankName
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-semibold mb-2", style: {
            color: t.textMuted
          }, children: "Nickname (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: nickname, onChange: (e) => setNickname(e.target.value), placeholder: "e.g. Mom, Work Account", className: "w-full px-4 py-3.5 rounded-xl outline-none", style: {
            background: t.inputBg,
            color: t.textPrimary
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-semibold mb-2", style: {
            color: t.textMuted
          }, children: "Account Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: ["Personal", "Business"].map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setAccountType(t2), className: "flex-1 py-3 rounded-xl font-bold transition-all", style: {
            background: accountType === t2 ? "#38BDF8" : "#1A2438",
            color: accountType === t2 ? "#0B1120" : "#8A9BB5"
          }, children: t2 }, t2)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pb-8 mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleSave, disabled: !canSave || saving, className: "w-full py-4 rounded-xl font-semibold transition-all", style: {
      background: "linear-gradient(135deg, #38BDF8, #6366F1)",
      color: t.textPrimary,
      opacity: !canSave || saving ? 0.5 : 1
    }, children: saving ? "Saving…" : "Save Beneficiary" }) }),
    showSheet && selectedBen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", style: {
        background: "rgba(0,0,0,0.55)"
      }, onClick: () => setShowSheet(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full p-6 rounded-t-[28px]", style: {
        background: t.cardBg
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-1 rounded-full mx-auto mb-6", style: {
          background: t.mutedBg
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-2xl", style: {
            background: getAvatarColor(selectedBen.fullName),
            color: "#0B1120"
          }, children: selectedBen.initials }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold", style: {
            color: t.textPrimary
          }, children: selectedBen.nickname || selectedBen.fullName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", style: {
            color: t.textMuted
          }, children: selectedBen.bankName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 mb-6", children: [{
          label: "Full Name",
          value: selectedBen.fullName
        }, {
          label: "Account Number",
          value: selectedBen.accountNumber
        }, {
          label: "Bank",
          value: selectedBen.bankName
        }, {
          label: "Account Type",
          value: selectedBen.accountType
        }].map(({
          label,
          value
        }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between py-2 border-b", style: {
          borderColor: "rgba(255,255,255,0.05)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
            color: t.textMuted
          }, children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
            color: t.textPrimary
          }, children: value })
        ] }, label)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            setShowSheet(false);
            navigate({
              to: "/local-transfer"
            });
          }, className: "py-4 rounded-xl font-semibold text-sm", style: {
            background: "linear-gradient(135deg, #38BDF8, #6366F1)",
            color: t.textPrimary
          }, children: "Send Money" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleDelete, disabled: deleting, className: "py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2", style: {
            background: "rgba(255,77,106,0.1)",
            color: "#FF4D6A",
            border: "1px solid rgba(255,77,106,0.3)",
            opacity: deleting ? 0.6 : 1
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 }),
            deleting ? "Removing…" : "Remove"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
export {
  AddBeneficiary as component
};
