import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { I as Input, C as Card, B as Button, g as Badge } from "./router-8iYk_PDV.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, f as DialogFooter, g as DialogDescription } from "./dialog-vES-p4nC.mjs";
import { T as Textarea } from "./textarea-CZiTatT5.mjs";
import { u as useAdminTransactions } from "./useAdminTransactions-C6Ld3R4g.mjs";
import { a as approveTransaction, d as declineTransaction } from "./reviewTransaction-CxquAjvj.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__storage.mjs";
import { C as Clock, b as CircleCheck, c as CircleX, E as Eye, T as TriangleAlert } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "./createNotification-Cw-Zxf1P.mjs";
import "./logAdminAction-DVr4geeY.mjs";
import "./formatCurrency-vYScEN6G.mjs";
function formatCurrency(value) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
function AdminPendingTransactionsPage() {
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = reactExports.useState(false);
  const [rejectReason, setRejectReason] = reactExports.useState("");
  const [transactionToReject, setTransactionToReject] = reactExports.useState(null);
  const [approveDialogOpen, setApproveDialogOpen] = reactExports.useState(false);
  const [transactionToApprove, setTransactionToApprove] = reactExports.useState(null);
  const [detailTx, setDetailTx] = reactExports.useState(null);
  const {
    transactions: pendingTransactions,
    loading: fetching
  } = useAdminTransactions("pending");
  const filteredTransactions = pendingTransactions.filter((tx) => tx.userFullName?.toLowerCase().includes(searchTerm.toLowerCase()) || tx.transactionRef?.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleApproveClick = (tx) => {
    setTransactionToApprove(tx);
    setApproveDialogOpen(true);
  };
  const confirmApprove = async () => {
    if (!transactionToApprove) return;
    setLoading(true);
    try {
      await approveTransaction(transactionToApprove.id);
      toast.success(`Transaction approved — $${formatCurrency(transactionToApprove.amount)} deducted from ${transactionToApprove.userFullName}'s ${transactionToApprove.fundingAccount} account`);
      setApproveDialogOpen(false);
      setTransactionToApprove(null);
      setDetailTx(null);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to approve transaction");
    } finally {
      setLoading(false);
    }
  };
  const handleRejectClick = (tx) => {
    setTransactionToReject(tx);
    setRejectReason("");
    setRejectDialogOpen(true);
  };
  const confirmReject = async () => {
    if (!transactionToReject) return;
    if (!rejectReason || rejectReason.trim().length < 5) {
      toast.error("Please provide a reason (at least 5 characters)");
      return;
    }
    setLoading(true);
    try {
      await declineTransaction(transactionToReject.id, rejectReason.trim());
      toast.success("Transaction declined — user has been notified");
      setRejectDialogOpen(false);
      setTransactionToReject(null);
      setRejectReason("");
      setDetailTx(null);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to decline transaction");
    } finally {
      setLoading(false);
    }
  };
  const getTransactionDisplay = (tx) => {
    if (tx.type === "internal_transfer") {
      return {
        from: tx.fundingAccount,
        to: tx.toAccount ? `${tx.toAccount} account` : tx.recipientName || "-",
        badge: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-blue-500/20 text-blue-300 border-blue-500/30", children: "Internal" }),
        displayAmount: tx.amount
      };
    } else if (tx.type === "local_transfer") {
      return {
        from: tx.fundingAccount,
        to: `${tx.recipientName || "-"} (${tx.toBank || "-"})`,
        badge: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-green-500/20 text-green-300 border-green-500/30", children: "Local" }),
        displayAmount: tx.amount
      };
    } else if (tx.type === "wire_transfer") {
      return {
        from: tx.fundingAccount,
        to: `${tx.recipientName || "-"} (${tx.toBank || "-"}, ${tx.toCountry || "-"})`,
        badge: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-orange-500/20 text-orange-300 border-orange-500/30", children: "Wire" }),
        displayAmount: tx.amount
      };
    } else if (tx.type === "buy_crypto") {
      return {
        from: tx.fundingAccount,
        to: `${tx.cryptoAmount ? Number(tx.cryptoAmount).toFixed(6) : "-"} ${tx.cryptoSymbol || "-"}`,
        badge: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-purple-500/20 text-purple-300 border-purple-500/30", children: "Crypto" }),
        displayAmount: tx.fiatAmount || tx.amount
      };
    } else if (tx.type === "check_deposit" || tx.subType === "card_deposit") {
      return {
        from: tx.subType === "card_deposit" ? "Card" : `Check #${tx.checkNumber || "-"}`,
        to: tx.fundingAccount,
        badge: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", children: "Deposit" }),
        displayAmount: tx.amount
      };
    } else if (tx.type === "bill_payment") {
      return {
        from: tx.fundingAccount,
        to: tx.recipientName || "-",
        badge: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-pink-500/20 text-pink-300 border-pink-500/30", children: "Bills" }),
        displayAmount: tx.amount
      };
    } else {
      return {
        from: tx.fundingAccount || "-",
        to: tx.recipientName || tx.description || "-",
        badge: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30", children: tx.type?.replace(/_/g, " ") || "Transfer" }),
        displayAmount: tx.amount
      };
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white", children: "Pending Transactions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-300/60 text-xs", children: "Review and approve all pending transactions" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 14, className: "text-yellow-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-yellow-400 text-sm font-medium", children: [
          filteredTransactions.length,
          " Pending"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search by user name or reference...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-80 bg-[#070B14] border-[rgba(255,255,255,0.1)] text-white" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "glass-card border-0 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: fetching ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-12 text-center text-[#8A9BB5]", children: "Loading pending transactions..." }) : filteredTransactions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 40, className: "mx-auto mb-3 text-[#8A9BB5] opacity-30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#8A9BB5]", children: "No pending transactions" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-[#070B14]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase", children: "User" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase", children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase", children: "From" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase", children: "To" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase", children: "Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase", children: "Ref" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-4 px-6 text-blue-300/60 text-xs font-medium uppercase", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filteredTransactions.map((tx) => {
        const {
          from,
          to,
          badge,
          displayAmount
        } = getTransactionDisplay(tx);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-[rgba(255,255,255,0.05)] hover:bg-white/5 cursor-pointer", onClick: () => setDetailTx(tx), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-6 text-blue-300/60 text-xs", children: tx.createdAt instanceof Date ? tx.createdAt.toLocaleString() : "-" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-medium text-sm", children: tx.userFullName || "Unknown" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-300/50 text-xs", children: tx.userEmail || "" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-6", children: badge }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-6 text-white text-sm capitalize", children: from }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-6 text-white text-sm max-w-[180px] truncate", children: to }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-4 px-6 text-cyan-400 font-mono text-sm font-semibold", children: [
            "$",
            formatCurrency(parseFloat(String(displayAmount || 0)))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-6 text-blue-300/50 text-xs font-mono", children: tx.transactionRef || "-" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-6 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", onClick: (e) => e.stopPropagation(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => handleRejectClick(tx), disabled: loading, size: "sm", className: "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 14, className: "mr-1" }),
              "Decline"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => handleApproveClick(tx), disabled: loading, size: "sm", className: "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 14, className: "mr-1" }),
              "Approve"
            ] })
          ] }) })
        ] }, tx.id);
      }) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!detailTx, onOpenChange: (open) => !open && setDetailTx(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-[#0F1829] border-[rgba(255,255,255,0.1)] max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 18, className: "text-cyan-400" }),
        "Transaction Details"
      ] }) }),
      detailTx && (() => {
        const {
          badge,
          displayAmount
        } = getTransactionDisplay(detailTx);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-4 rounded-xl", style: {
            background: "rgba(56,189,248,0.06)",
            border: "1px solid rgba(56,189,248,0.15)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-blue-300/60 mb-1", children: "Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-3xl font-mono font-bold text-white", children: [
              "$",
              formatCurrency(parseFloat(String(displayAmount || 0)))
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex justify-center", children: badge })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 text-sm", children: [{
            label: "User",
            value: detailTx.userFullName
          }, {
            label: "Email",
            value: detailTx.userEmail
          }, {
            label: "From Account",
            value: detailTx.fundingAccount
          }, ...detailTx.toAccount ? [{
            label: "To Account",
            value: detailTx.toAccount
          }] : [], ...detailTx.recipientName ? [{
            label: "Recipient",
            value: detailTx.recipientName
          }] : [], ...detailTx.toBank ? [{
            label: "Bank",
            value: detailTx.toBank
          }] : [], ...detailTx.toCountry ? [{
            label: "Country",
            value: detailTx.toCountry
          }] : [], ...detailTx.toAccountNumber ? [{
            label: "Account No.",
            value: detailTx.toAccountNumber
          }] : [], ...detailTx.toSwiftCode ? [{
            label: "SWIFT",
            value: detailTx.toSwiftCode
          }] : [], ...detailTx.toCurrency ? [{
            label: "Currency",
            value: detailTx.toCurrency
          }] : [], ...detailTx.fee ? [{
            label: "Fee",
            value: `$${formatCurrency(detailTx.fee)}`
          }] : [], ...detailTx.purpose ? [{
            label: "Purpose",
            value: detailTx.purpose
          }] : [], ...detailTx.cryptoSymbol ? [{
            label: "Crypto",
            value: `${Number(detailTx.cryptoAmount || 0).toFixed(6)} ${detailTx.cryptoSymbol}`
          }] : [], ...detailTx.note ? [{
            label: "Note",
            value: detailTx.note
          }] : [], {
            label: "Reference",
            value: detailTx.transactionRef || detailTx.id
          }, {
            label: "Submitted",
            value: detailTx.createdAt instanceof Date ? detailTx.createdAt.toLocaleString() : "-"
          }, {
            label: "Balance at submission",
            value: `$${formatCurrency(detailTx.balanceAtSubmission || 0)}`
          }].map(({
            label,
            value
          }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between py-1.5 border-b border-[rgba(255,255,255,0.05)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-300/60", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-medium text-right max-w-[55%] break-words capitalize", children: value })
          ] }, label)) }),
          detailTx.amount > (detailTx.balanceAtSubmission || 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-3 rounded-xl", style: {
            background: "rgba(255,77,106,0.1)",
            border: "1px solid rgba(255,77,106,0.3)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 16, className: "text-red-400 flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400", children: "User's balance may have changed since submission." })
          ] })
        ] });
      })(),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => {
          setDetailTx(null);
          handleRejectClick(detailTx);
        }, disabled: loading, className: "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 16, className: "mr-1" }),
          "Decline"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => {
          setDetailTx(null);
          handleApproveClick(detailTx);
        }, disabled: loading, className: "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 16, className: "mr-1" }),
          "Approve"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: approveDialogOpen, onOpenChange: setApproveDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-[#0F1829] border-[rgba(255,255,255,0.1)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-white flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 18, className: "text-cyan-400" }),
          "Confirm Approval"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-blue-300/60", children: "This will deduct the amount from the user's account and notify them immediately." })
      ] }),
      transactionToApprove && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl space-y-2", style: {
          background: "rgba(56,189,248,0.06)",
          border: "1px solid rgba(56,189,248,0.15)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-300/60", children: "User" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-semibold", children: transactionToApprove.userFullName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-300/60", children: "Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white capitalize", children: transactionToApprove.type?.replace(/_/g, " ") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-300/60", children: "Amount to deduct" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-cyan-400 font-mono font-bold text-lg", children: [
              "$",
              formatCurrency(transactionToApprove.amount)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-300/60", children: "From" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white capitalize", children: [
              transactionToApprove.fundingAccount,
              " account"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-300/60", children: "Balance at submission" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white", children: [
              "$",
              formatCurrency(transactionToApprove.balanceAtSubmission || 0)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm border-t border-[rgba(255,255,255,0.05)] pt-2 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-300/60", children: "Balance after approval" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-green-400 font-semibold", children: [
              "$",
              formatCurrency(Math.max(0, (transactionToApprove.balanceAtSubmission || 0) - transactionToApprove.amount))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-blue-300/50 text-center", children: "A notification will be sent to the user upon approval." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setApproveDialogOpen(false), className: "bg-transparent border border-[rgba(255,255,255,0.1)] text-blue-300/60 hover:bg-white/5", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: confirmApprove, disabled: loading, className: "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30", children: loading ? "Approving..." : "Confirm Approval" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: rejectDialogOpen, onOpenChange: setRejectDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-[#0F1829] border-[rgba(255,255,255,0.1)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-white flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 18, className: "text-red-400" }),
          "Decline Transaction"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-blue-300/60", children: "Provide a reason — the user will see this in their notification." })
      ] }),
      transactionToReject && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-blue-300/60 mb-3", children: [
        "Declining ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white font-semibold", children: [
          "$",
          formatCurrency(transactionToReject.amount)
        ] }),
        " ",
        transactionToReject.type?.replace(/_/g, " "),
        " for ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-semibold", children: transactionToReject.userFullName })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { placeholder: "Enter reason for declining (min 5 characters)...", value: rejectReason, onChange: (e) => setRejectReason(e.target.value), rows: 3, className: "bg-[#070B14] border-[rgba(255,255,255,0.1)] text-white placeholder:text-blue-300/40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setRejectDialogOpen(false), className: "bg-transparent border border-[rgba(255,255,255,0.1)] text-blue-300/60 hover:bg-white/5", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: confirmReject, disabled: loading || rejectReason.trim().length < 5, className: "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30", children: loading ? "Declining..." : "Confirm Decline" })
      ] })
    ] }) })
  ] });
}
export {
  AdminPendingTransactionsPage as component
};
