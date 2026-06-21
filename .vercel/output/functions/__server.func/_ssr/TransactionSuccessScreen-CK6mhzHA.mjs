import { e as getDoc, d as doc, b as addDoc, c as collection, u as updateDoc, s as serverTimestamp } from "../_libs/firebase__firestore.mjs";
import { a as auth, d as db } from "./router-8iYk_PDV.mjs";
import { c as createNotification } from "./createNotification-Cw-Zxf1P.mjs";
import { A as ADMIN_UID } from "./adminConfig-D-CDJgKq.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { f as formatCurrency } from "./formatCurrency-vYScEN6G.mjs";
import { u as useBeneficiaries } from "./useBeneficiaries-B91qKWY9.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { b as CircleCheck, C as Clock, g as Check, h as UserPlus } from "../_libs/lucide-react.mjs";
function generateTransactionRef() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}
async function submitTransaction({
  type,
  subType = "outgoing",
  description,
  category,
  amount,
  currency = "USD",
  fundingAccount,
  recipientName = "",
  recipientAccount = "",
  recipientBank = "",
  note = "",
  toBank = "",
  toCountry = "",
  toAccountNumber = "",
  toSwiftCode = "",
  toRoutingNumber = "",
  toCurrency = "",
  purpose = "",
  fee = 0,
  cryptoId = "",
  cryptoSymbol = "",
  cryptoAmount = 0,
  fiatAmount = 0,
  priceAtTime = 0,
  checkNumber = "",
  routingNumber = "",
  accountNumber = "",
  memo = "",
  toAccount = ""
}) {
  const user = auth.currentUser;
  if (!user) throw new Error("User is not authenticated.");
  let userSnap;
  try {
    userSnap = await getDoc(doc(db, "users", user.uid));
  } catch (err) {
    throw new Error("Could not read account data. Check your connection and try again.");
  }
  if (!userSnap.exists()) throw new Error("User account not found.");
  const userData = userSnap.data();
  const balanceAtSubmission = fundingAccount === "checking" ? userData.checkingBalance ?? 0 : userData.savingsBalance ?? 0;
  if (amount > balanceAtSubmission) {
    throw new Error(
      `Insufficient funds. Available ${fundingAccount} balance: $${balanceAtSubmission.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
    );
  }
  const transactionRef = generateTransactionRef();
  const initialStatusHistory = [
    {
      status: "pending",
      timestamp: /* @__PURE__ */ new Date(),
      changedBy: "user",
      changedById: user.uid,
      reason: ""
    }
  ];
  const transactionPayload = {
    userId: user.uid,
    userFullName: userData.fullName,
    userEmail: userData.email,
    type,
    subType,
    description,
    category,
    amount,
    currency,
    fundingAccount,
    recipientName,
    recipientAccount,
    recipientBank,
    note,
    // Extended fields for admin review
    toBank,
    toCountry,
    toAccountNumber,
    toSwiftCode,
    toRoutingNumber,
    toCurrency,
    purpose,
    fee,
    cryptoId,
    cryptoSymbol,
    cryptoAmount,
    fiatAmount,
    priceAtTime,
    checkNumber,
    routingNumber,
    accountNumber,
    memo,
    toAccount,
    status: "pending",
    statusHistory: initialStatusHistory,
    balanceAtSubmission,
    balanceAfter: null,
    reviewedByAdminId: null,
    reviewedByAdminName: null,
    reviewedAt: null,
    declineReason: null,
    adminNotified: false,
    userNotifiedOfResult: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    transactionRef
  };
  const docRef = await addDoc(
    collection(db, "transactions"),
    transactionPayload
  );
  try {
    await updateDoc(docRef, { transactionId: docRef.id });
  } catch {
  }
  try {
    await createNotification({
      recipientId: ADMIN_UID,
      recipientType: "admin",
      type: "new_transaction",
      title: "New Pending Transaction",
      message: `${userData.fullName} submitted a ${type.replace(/_/g, " ")} of ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)}`,
      transactionId: docRef.id,
      userId: user.uid,
      userFullName: userData.fullName,
      amount,
      transactionType: type
    });
    await updateDoc(docRef, { adminNotified: true });
  } catch {
  }
  return { transactionId: docRef.id, transactionRef };
}
function TransactionSuccessScreen({
  amount,
  transactionRef,
  fundingAccount,
  recipientName,
  saveBeneficiary
}) {
  const navigate = useNavigate();
  const { addBeneficiary } = useBeneficiaries();
  const [saved, setSaved] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  const handleSaveBeneficiary = async () => {
    if (!saveBeneficiary || saved) return;
    setSaving(true);
    try {
      await addBeneficiary({
        fullName: saveBeneficiary.fullName,
        nickname: saveBeneficiary.fullName,
        bankName: saveBeneficiary.bankName,
        bankId: saveBeneficiary.bankId,
        accountNumber: saveBeneficiary.accountNumber,
        accountType: saveBeneficiary.accountType ?? "Personal",
        initials: saveBeneficiary.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
      });
      setSaved(true);
      toast.success("Beneficiary saved!");
    } catch {
      toast.error("Could not save beneficiary");
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen w-full flex flex-col items-center justify-center px-6 pb-24",
      style: { background: "#0B1120" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-24 h-24 rounded-full flex items-center justify-center mb-6 border-2",
            style: {
              background: "rgba(0, 230, 118, 0.12)",
              borderColor: "#00E676",
              boxShadow: "0 0 32px rgba(0, 230, 118, 0.3)",
              animation: "scale-in 0.4s ease-out"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 48, style: { color: "#00E676" } })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold mb-2", style: { color: "#FFFFFF" }, children: "Transaction Submitted" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mb-8 text-center max-w-xs", style: { color: "#7A8FA6" }, children: "Your request has been received and is pending admin review." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-full max-w-xs p-5 rounded-2xl border",
            style: { background: "#111827", borderColor: "rgba(0, 230, 118, 0.2)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: { color: "#7A8FA6" }, children: "Amount" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-mono font-semibold", style: { color: "#FFFFFF" }, children: formatCurrency(amount) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: { color: "#7A8FA6" }, children: "Reference" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-mono", style: { color: "#00C6FF" }, children: transactionRef })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: { color: "#7A8FA6" }, children: "From Account" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: { color: "#FFFFFF" }, children: fundingAccount.charAt(0).toUpperCase() + fundingAccount.slice(1) })
              ] }),
              recipientName && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: { color: "#7A8FA6" }, children: "Recipient" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: { color: "#FFFFFF" }, children: recipientName })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: { color: "#7A8FA6" }, children: "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
                    style: {
                      backgroundColor: "rgba(255, 171, 0, 0.12)",
                      borderColor: "rgba(255, 171, 0, 0.3)",
                      color: "#FFAB00"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full animate-pulse", style: { backgroundColor: "#FFAB00" } }),
                      "Pending"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: { color: "#7A8FA6" }, children: "Submitted" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: { color: "#FFFFFF" }, children: "Just now" })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-full max-w-xs mt-4 p-4 rounded-xl border",
            style: { background: "rgba(255, 171, 0, 0.08)", borderColor: "rgba(255, 171, 0, 0.25)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 20, style: { color: "#FFAB00" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", style: { color: "#FFAB00" }, children: "Awaiting admin approval." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", style: { color: "#7A8FA6" }, children: "You'll be notified once reviewed. No funds deducted yet." })
              ] })
            ] })
          }
        ),
        saveBeneficiary && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-xs mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleSaveBeneficiary,
            disabled: saved || saving,
            className: "w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all",
            style: {
              background: saved ? "rgba(0,230,118,0.1)" : "rgba(56,189,248,0.1)",
              color: saved ? "#00E676" : "#38BDF8",
              border: `1px solid ${saved ? "rgba(0,230,118,0.3)" : "rgba(56,189,248,0.3)"}`,
              opacity: saving ? 0.6 : 1
            },
            children: saved ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 16 }),
              "Beneficiary Saved"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { size: 16 }),
              saving ? "Saving…" : `Save ${saveBeneficiary.fullName} as Beneficiary`
            ] })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-xs mt-6 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => navigate({ to: "/transactions" }),
              className: "w-full py-4 rounded-xl font-semibold",
              style: { background: "linear-gradient(135deg, #00C6FF, #7B2FFF)", color: "#FFFFFF" },
              children: "View Transaction History"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => navigate({ to: "/" }),
              className: "w-full py-4 rounded-xl font-semibold",
              style: { background: "#1A2438", color: "#7A8FA6" },
              children: "Back to Home"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes scale-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      ` })
      ]
    }
  );
}
export {
  TransactionSuccessScreen as T,
  submitTransaction as s
};
