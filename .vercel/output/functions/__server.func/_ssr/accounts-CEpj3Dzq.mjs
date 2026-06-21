import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { f as useSearch, d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { C as Card, e as CardContent, I as Input, b as CardHeader, c as CardTitle, B as Button, d as db } from "./router-8iYk_PDV.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DguZ9IUy.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, g as DialogDescription, f as DialogFooter } from "./dialog-vES-p4nC.mjs";
import { u as useUsers } from "./useUsers-B9DgIn9o.mjs";
import { u as updateDoc, s as serverTimestamp, i as increment, d as doc, b as addDoc, c as collection } from "../_libs/firebase__firestore.mjs";
import { l as logAdminAction } from "./logAdminAction-DVr4geeY.mjs";
import { c as createNotification } from "./createNotification-Cw-Zxf1P.mjs";
import { A as ADMIN_UID } from "./adminConfig-D-CDJgKq.mjs";
import { a as generateTransactionRef } from "./generateAccountNumber-C0BBgSQp.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__storage.mjs";
import { u as Search, x as Copy, ad as Pen, a2 as Plus, ae as Minus, af as DollarSign } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
async function setBalanceDirectly(userId, userFullName, account, newBalance, oldBalance) {
  const balanceField = account === "checking" ? "checkingBalance" : "savingsBalance";
  const delta = newBalance - oldBalance;
  await updateDoc(doc(db, "users", userId), {
    [balanceField]: newBalance,
    totalBalance: increment(delta),
    lastBalanceUpdatedAt: serverTimestamp(),
    lastBalanceUpdatedBy: "admin"
  });
  try {
    const newStr = newBalance.toLocaleString("en-US", { style: "currency", currency: "USD" });
    await createNotification({
      recipientId: userId,
      recipientType: "user",
      type: "balance_override",
      title: "Account Balance Updated",
      message: `Your ${account} account balance has been updated to ${newStr} by the admin.`,
      userId,
      userFullName,
      amount: newBalance,
      transactionType: "balance_override"
    });
  } catch (err) {
    console.error("User notification failed (non-critical):", err);
  }
  try {
    await createNotification({
      recipientId: ADMIN_UID,
      recipientType: "admin",
      type: "balance_override",
      title: "Balance Override",
      message: `${userFullName}'s ${account} balance set to $${newBalance.toFixed(2)} (was $${oldBalance.toFixed(2)})`,
      userId,
      userFullName,
      amount: newBalance,
      transactionType: "balance_override"
    });
  } catch (err) {
    console.error("Admin notification failed (non-critical):", err);
  }
  await logAdminAction(
    "BALANCE_OVERRIDE",
    `Set ${account} balance for ${userFullName} from $${oldBalance.toFixed(2)} to $${newBalance.toFixed(2)}`,
    userId,
    userFullName,
    { account, oldBalance, newBalance, delta }
  );
}
async function postTransaction({
  userId,
  userFullName,
  account,
  type,
  amount,
  description,
  category = "Admin Adjustment",
  adminNote = "",
  currentBalance
}) {
  const balanceField = account === "checking" ? "checkingBalance" : "savingsBalance";
  const balanceDelta = type === "credit" ? amount : -amount;
  const balanceAfter = currentBalance + balanceDelta;
  const txRef = generateTransactionRef();
  await updateDoc(doc(db, "users", userId), {
    [balanceField]: increment(balanceDelta),
    totalBalance: increment(balanceDelta),
    lastBalanceUpdatedAt: serverTimestamp(),
    lastBalanceUpdatedBy: "admin"
  });
  const txDocRef = await addDoc(collection(db, "transactions"), {
    userId,
    userFullName,
    account,
    type,
    amount,
    fundingAccount: account,
    description,
    category,
    adminNote,
    balanceAfter,
    createdAt: serverTimestamp(),
    date: /* @__PURE__ */ new Date(),
    createdByAdmin: true,
    transactionRef: txRef,
    status: "approved"
  });
  const txId = txDocRef.id;
  try {
    const amountStr = amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD"
    });
    await createNotification({
      recipientId: userId,
      recipientType: "user",
      type: type === "credit" ? "admin_credit" : "admin_debit",
      title: type === "credit" ? "Funds Added to Your Account ✓" : "Funds Deducted from Your Account",
      message: type === "credit" ? `${amountStr} has been credited to your ${account} account by the admin. ${description ? `Reason: ${description}` : ""}` : `${amountStr} has been debited from your ${account} account by the admin. ${description ? `Reason: ${description}` : ""}`,
      transactionId: txId,
      userId,
      userFullName,
      amount,
      transactionType: type === "credit" ? "admin_credit" : "admin_debit"
    });
  } catch (err) {
    console.error("User notification failed (non-critical):", err);
  }
  try {
    const amountStr = amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD"
    });
    await createNotification({
      recipientId: ADMIN_UID,
      recipientType: "admin",
      type: type === "credit" ? "admin_credit" : "admin_debit",
      title: type === "credit" ? "Funds Added" : "Funds Deducted",
      message: `${amountStr} ${type === "credit" ? "credited to" : "debited from"} ${userFullName}'s ${account} account. ${description ? `(${description})` : ""}`,
      transactionId: txId,
      userId,
      userFullName,
      amount,
      transactionType: type === "credit" ? "admin_credit" : "admin_debit"
    });
  } catch (err) {
    console.error("Admin notification failed (non-critical):", err);
  }
  await logAdminAction(
    type === "credit" ? "BALANCE_CREDITED" : "BALANCE_DEBITED",
    `${type === "credit" ? "Credited" : "Debited"} $${amount.toFixed(2)} ${type === "credit" ? "to" : "from"} ${userFullName}'s ${account} account`,
    userId,
    userFullName,
    { account, type, amount, description, balanceBefore: currentBalance, balanceAfter, txId }
  );
  return txId;
}
function formatCurrency(v) {
  return v.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
function AdminAccountsPage() {
  const search = useSearch({
    strict: false
  });
  const {
    users,
    loading
  } = useUsers();
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [selectedUserId, setSelectedUserId] = reactExports.useState(search.user ? String(search.user) : null);
  const navigate = useNavigate();
  const [editState, setEditState] = reactExports.useState(null);
  const [editAmount, setEditAmount] = reactExports.useState("");
  const [editDescription, setEditDescription] = reactExports.useState("");
  const [editLoading, setEditLoading] = reactExports.useState(false);
  const filteredUsers = users.filter((user) => user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()));
  const selectedUser = selectedUserId ? users.find((u) => u.id === selectedUserId) : null;
  const totalBalance = selectedUser ? (selectedUser.checkingBalance || 0) + (selectedUser.savingsBalance || 0) : 0;
  const openEdit = (account, mode, currentBalance) => {
    setEditState({
      account,
      mode,
      currentBalance
    });
    setEditAmount(mode === "set" ? currentBalance.toFixed(2) : "");
    setEditDescription("");
  };
  const closeEdit = () => {
    setEditState(null);
    setEditAmount("");
    setEditDescription("");
  };
  const getPreviewBalance = () => {
    if (!editState) return 0;
    const amt = parseFloat(editAmount) || 0;
    switch (editState.mode) {
      case "set":
        return amt;
      case "credit":
        return editState.currentBalance + amt;
      case "debit":
        return Math.max(0, editState.currentBalance - amt);
    }
  };
  const handleSave = async () => {
    if (!selectedUser || !editState) return;
    const amt = parseFloat(editAmount);
    if (isNaN(amt) || amt < 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setEditLoading(true);
    try {
      const {
        account,
        mode,
        currentBalance
      } = editState;
      if (mode === "set") {
        await setBalanceDirectly(selectedUser.id, selectedUser.fullName, account, amt, currentBalance);
        toast.success(`${account.charAt(0).toUpperCase() + account.slice(1)} balance set to $${formatCurrency(amt)}`);
      } else {
        const desc = editDescription.trim() || (mode === "credit" ? "Admin Credit" : "Admin Debit");
        await postTransaction({
          userId: selectedUser.id,
          userFullName: selectedUser.fullName,
          account,
          type: mode === "credit" ? "credit" : "debit",
          amount: amt,
          description: desc,
          category: "Admin Adjustment",
          adminNote: `Manual ${mode} by admin`,
          currentBalance
        });
        toast.success(`$${formatCurrency(amt)} ${mode === "credit" ? "credited to" : "debited from"} ${account} account`);
      }
      closeEdit();
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to update balance");
    } finally {
      setEditLoading(false);
    }
  };
  const modeLabel = {
    set: "Set Balance",
    credit: "Add Funds",
    debit: "Deduct Funds"
  };
  const modeColor = {
    set: "#38BDF8",
    credit: "#00E676",
    debit: "#FF4D6A"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white", children: "Account Control" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-300/60 text-sm", children: "Manage and edit user account balances" })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "glass-card border-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6 text-center py-12 text-[#8A9BB5]", children: "Loading users..." }) }) : users.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "glass-card border-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6 text-center py-12 text-[#8A9BB5]", children: "No users yet. Create a user first." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "glass-card border-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-col md:flex-row gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search users...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10 bg-[#070B14] border-[rgba(255,255,255,0.1)] text-white placeholder:text-blue-300/50" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedUserId || "", onValueChange: (value) => {
          setSelectedUserId(value || null);
          navigate({
            to: "/admin/accounts",
            search: {
              user: value
            }
          });
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full md:w-[300px] bg-[#070B14] border-[rgba(255,255,255,0.1)] text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a user" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-[#0D1625] border-[rgba(255,255,255,0.1)] text-white", children: filteredUsers.map((user) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: user.id, children: [
            user.fullName,
            " (",
            user.email,
            ")"
          ] }, user.id)) })
        ] })
      ] }),
      !selectedUser ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-[#8A9BB5]", children: "Select a user to view and edit their accounts" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-[#070B14] p-4 rounded-xl mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white font-semibold text-lg", children: selectedUser.fullName.split(" ").map((n) => n[0]).join("").toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white font-semibold", children: selectedUser.fullName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-300/60 text-sm", children: selectedUser.email })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white font-bold font-mono text-2xl", children: [
              "$",
              formatCurrency(totalBalance)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-300/60 text-xs", children: "Total Balance" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [{
          type: "checking",
          label: "Checking",
          balance: selectedUser.checkingBalance || 0,
          accountNumber: selectedUser.checkingAccountNumber
        }, {
          type: "savings",
          label: "Savings",
          balance: selectedUser.savingsBalance || 0,
          accountNumber: selectedUser.savingsAccountNumber
        }].map((acct) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-[rgba(255,255,255,0.05)] bg-[#0D1625]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-lg text-white", children: [
              acct.label,
              " Account"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-[#070B14] px-3 py-1 rounded-lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-300/70 text-sm font-mono", children: acct.accountNumber ? `****${acct.accountNumber.slice(-4)}` : "****0000" }),
              acct.accountNumber && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigator.clipboard.writeText(acct.accountNumber).then(() => toast.success("Copied!")), className: "text-blue-300 hover:text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 14 }) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-300/60 text-sm mb-1", children: "Current Balance" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-4xl font-bold text-cyan-400 font-mono", children: [
                "$",
                formatCurrency(acct.balance)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => openEdit(acct.type, "set", acct.balance), className: "flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all hover:opacity-90", style: {
                background: "rgba(56,189,248,0.1)",
                border: "1px solid rgba(56,189,248,0.2)"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 16, style: {
                  color: "#38BDF8"
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold", style: {
                  color: "#38BDF8"
                }, children: "Set" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => openEdit(acct.type, "credit", acct.balance), className: "flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all hover:opacity-90", style: {
                background: "rgba(0,230,118,0.1)",
                border: "1px solid rgba(0,230,118,0.2)"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16, style: {
                  color: "#00E676"
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold", style: {
                  color: "#00E676"
                }, children: "Credit" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => openEdit(acct.type, "debit", acct.balance), className: "flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all hover:opacity-90", style: {
                background: "rgba(255,77,106,0.1)",
                border: "1px solid rgba(255,77,106,0.2)"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { size: 16, style: {
                  color: "#FF4D6A"
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold", style: {
                  color: "#FF4D6A"
                }, children: "Debit" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-center text-blue-300/40", children: "Set overrides balance directly · Credit/Debit creates a transaction record" })
          ] })
        ] }, acct.type)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editState, onOpenChange: (open) => !open && closeEdit(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-[#0F1829] border-[rgba(255,255,255,0.1)] max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-white flex items-center gap-2", style: {
          color: editState ? modeColor[editState.mode] : "#FFFFFF"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { size: 18 }),
          editState ? modeLabel[editState.mode] : "Edit Balance",
          " —",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: editState?.account })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-blue-300/60", children: editState?.mode === "set" ? "Set the exact balance. No transaction record is created." : editState?.mode === "credit" ? "Add funds to the account. A credit transaction will be recorded." : "Remove funds from the account. A debit transaction will be recorded." })
      ] }),
      editState && selectedUser && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center p-3 rounded-xl", style: {
          background: "rgba(255,255,255,0.03)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-blue-300/60", children: "Current balance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white font-mono font-semibold", children: [
            "$",
            formatCurrency(editState.currentBalance)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold text-blue-300/70 mb-2", children: editState.mode === "set" ? "New Balance" : "Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-xl font-mono", style: {
              color: modeColor[editState.mode]
            }, children: "$" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "0", step: "0.01", value: editAmount, onChange: (e) => setEditAmount(e.target.value), placeholder: "0.00", className: "w-full pl-10 pr-4 py-4 rounded-xl text-xl font-mono font-bold outline-none", style: {
              background: "#070B14",
              color: modeColor[editState.mode],
              border: `1px solid ${modeColor[editState.mode]}33`
            }, autoFocus: true })
          ] })
        ] }),
        editState.mode !== "set" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold text-blue-300/70 mb-2", children: "Description (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: editDescription, onChange: (e) => setEditDescription(e.target.value), placeholder: editState.mode === "credit" ? "e.g. Bonus credit" : "e.g. Fee deduction", className: "w-full px-4 py-3 rounded-xl outline-none", style: {
            background: "#070B14",
            color: "#FFFFFF",
            border: "1px solid rgba(255,255,255,0.1)"
          } })
        ] }),
        editAmount && !isNaN(parseFloat(editAmount)) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl space-y-2", style: {
          background: `${modeColor[editState.mode]}0D`,
          border: `1px solid ${modeColor[editState.mode]}33`
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider", style: {
            color: modeColor[editState.mode]
          }, children: "Preview" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-300/60", children: "Before" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white font-mono", children: [
              "$",
              formatCurrency(editState.currentBalance)
            ] })
          ] }),
          editState.mode !== "set" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-300/60", children: editState.mode === "credit" ? "+ Added" : "− Removed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", style: {
              color: modeColor[editState.mode]
            }, children: [
              "$",
              formatCurrency(parseFloat(editAmount) || 0)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm border-t pt-2", style: {
            borderColor: `${modeColor[editState.mode]}33`
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", style: {
              color: modeColor[editState.mode]
            }, children: "After" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-bold text-lg", style: {
              color: modeColor[editState.mode]
            }, children: [
              "$",
              formatCurrency(getPreviewBalance())
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: closeEdit, className: "bg-transparent border border-[rgba(255,255,255,0.1)] text-blue-300/60 hover:bg-white/5", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSave, disabled: editLoading || !editAmount || isNaN(parseFloat(editAmount)) || parseFloat(editAmount) < 0, className: "text-white font-semibold", style: {
          background: editState ? `linear-gradient(135deg, ${modeColor[editState.mode]}99, ${modeColor[editState.mode]})` : "#38BDF8",
          opacity: editLoading ? 0.6 : 1
        }, children: editLoading ? "Saving..." : editState?.mode === "set" ? "Set Balance" : editState?.mode === "credit" ? "Add Funds" : "Deduct Funds" })
      ] })
    ] }) })
  ] });
}
export {
  AdminAccountsPage as component
};
