import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { C as Card, g as Badge, B as Button } from "./router-8iYk_PDV.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, f as DialogFooter, g as DialogDescription } from "./dialog-vES-p4nC.mjs";
import { T as Textarea } from "./textarea-CZiTatT5.mjs";
import { u as useAdminNotifications } from "./useAdminNotifications-B2ieRrUM.mjs";
import { u as useAdminTransactions } from "./useAdminTransactions-C6Ld3R4g.mjs";
import { a as approveTransaction, d as declineTransaction } from "./reviewTransaction-CxquAjvj.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__storage.mjs";
import { g as Check, B as Bell, E as Eye, c as CircleX, b as CircleCheck, C as Clock } from "../_libs/lucide-react.mjs";
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
import "./adminConfig-D-CDJgKq.mjs";
import "./createNotification-Cw-Zxf1P.mjs";
import "./logAdminAction-DVr4geeY.mjs";
import "./formatCurrency-vYScEN6G.mjs";
function formatCurrency(v) {
  return v.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
function AdminNotificationsPage() {
  const {
    notifications,
    loading,
    markAllRead,
    markRead
  } = useAdminNotifications();
  const {
    transactions: allTransactions
  } = useAdminTransactions();
  const unreadCount = notifications.filter((n) => n.status === "unread").length;
  const [selectedNotif, setSelectedNotif] = reactExports.useState(null);
  const [actionLoading, setActionLoading] = reactExports.useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = reactExports.useState(false);
  const [rejectReason, setRejectReason] = reactExports.useState("");
  const [approveDialogOpen, setApproveDialogOpen] = reactExports.useState(false);
  const relatedTx = selectedNotif?.transactionId ? allTransactions.find((t) => t.id === selectedNotif.transactionId) : null;
  const handleNotifClick = async (notif) => {
    setSelectedNotif(notif);
    if (notif.status === "unread") {
      await markRead(notif.id);
    }
  };
  const handleApproveClick = () => setApproveDialogOpen(true);
  const confirmApprove = async () => {
    if (!relatedTx) return;
    setActionLoading(true);
    try {
      await approveTransaction(relatedTx.id);
      toast.success(`Approved — $${formatCurrency(relatedTx.amount)} deducted`);
      setApproveDialogOpen(false);
      setSelectedNotif(null);
    } catch (err) {
      toast.error(err?.message || "Failed to approve");
    } finally {
      setActionLoading(false);
    }
  };
  const handleRejectClick = () => {
    setRejectReason("");
    setRejectDialogOpen(true);
  };
  const confirmReject = async () => {
    if (!relatedTx || rejectReason.trim().length < 5) {
      toast.error("Please provide a reason (at least 5 characters)");
      return;
    }
    setActionLoading(true);
    try {
      await declineTransaction(relatedTx.id, rejectReason.trim());
      toast.success("Transaction declined — user notified");
      setRejectDialogOpen(false);
      setSelectedNotif(null);
    } catch (err) {
      toast.error(err?.message || "Failed to decline");
    } finally {
      setActionLoading(false);
    }
  };
  const getIcon = (type) => {
    switch (type) {
      case "new_transaction":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 20, style: {
          color: "#FFAB00"
        } });
      case "transaction_approved":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 20, style: {
          color: "#00E676"
        } });
      case "transaction_declined":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 20, style: {
          color: "#FF4D6A"
        } });
      case "admin_credit":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 20, style: {
          color: "#00E676"
        } });
      case "admin_debit":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 20, style: {
          color: "#FF4D6A"
        } });
      case "balance_override":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 20, style: {
          color: "#38BDF8"
        } });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 20, style: {
          color: "#38BDF8"
        } });
    }
  };
  const getIconBg = (type) => {
    switch (type) {
      case "new_transaction":
        return "rgba(255,171,0,0.12)";
      case "transaction_approved":
        return "rgba(0,230,118,0.12)";
      case "transaction_declined":
        return "rgba(255,77,106,0.12)";
      case "admin_credit":
        return "rgba(0,230,118,0.12)";
      case "admin_debit":
        return "rgba(255,77,106,0.12)";
      case "balance_override":
        return "rgba(56,189,248,0.12)";
      default:
        return "rgba(56,189,248,0.12)";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white", children: "Admin Notifications" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-300/60 text-xs", children: "Real-time transaction alerts" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2.5 py-1 rounded-full text-xs font-bold", style: {
          background: "rgba(56,189,248,0.15)",
          color: "#38BDF8"
        }, children: [
          unreadCount,
          " unread"
        ] }),
        unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: markAllRead, className: "flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg", style: {
          background: "rgba(56,189,248,0.1)",
          color: "#38BDF8",
          border: "1px solid rgba(56,189,248,0.2)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14 }),
          "Mark all read"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "glass-card border-0 overflow-hidden", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-12 text-center text-[#8A9BB5]", children: "Loading notifications..." }) : notifications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 40, className: "mx-auto mb-3 text-[#8A9BB5] opacity-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#8A9BB5]", children: "No notifications yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-300/40 text-xs mt-1", children: "New transaction requests will appear here" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-[rgba(255,255,255,0.04)]", children: notifications.map((notif) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 p-4 hover:bg-white/5 transition-all cursor-pointer", style: {
      background: notif.status === "unread" ? "rgba(56,189,248,0.03)" : "transparent",
      borderLeft: notif.status === "unread" ? "3px solid #38BDF8" : "3px solid transparent"
    }, onClick: () => handleNotifClick(notif), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", style: {
        background: getIconBg(notif.type)
      }, children: getIcon(notif.type) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-white", children: notif.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0 ml-3", children: [
            notif.status === "unread" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-cyan-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-blue-300/50", children: notif.createdAt instanceof Date ? notif.createdAt.toLocaleString() : "Just now" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-blue-300/60 mb-2", children: notif.message }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold flex items-center gap-1", style: {
            color: "#38BDF8"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 11 }),
            "View details"
          ] }),
          notif.type === "new_transaction" && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/pending-transactions", className: "text-xs font-semibold", style: {
            color: "#FFAB00"
          }, onClick: (e) => e.stopPropagation(), children: "→ Go to Pending" })
        ] })
      ] })
    ] }, notif.id)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!selectedNotif, onOpenChange: (o) => !o && setSelectedNotif(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-[#0F1829] border-[rgba(255,255,255,0.1)] max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-white flex items-center gap-2", children: [
        selectedNotif && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full flex items-center justify-center", style: {
          background: getIconBg(selectedNotif.type)
        }, children: getIcon(selectedNotif.type) }),
        selectedNotif?.title
      ] }) }),
      selectedNotif && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-blue-300/70", children: selectedNotif.message }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-blue-300/40", children: selectedNotif.createdAt instanceof Date ? selectedNotif.createdAt.toLocaleString() : "" }),
        relatedTx ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-[#070B14] px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-blue-300/60 uppercase tracking-wider", children: "Transaction Details" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-2 text-sm", children: [{
            label: "Amount",
            value: `$${formatCurrency(relatedTx.amount)}`,
            highlight: true
          }, {
            label: "Type",
            value: relatedTx.type?.replace(/_/g, " ")
          }, {
            label: "From",
            value: `${relatedTx.fundingAccount} account`
          }, ...relatedTx.toAccount ? [{
            label: "To",
            value: `${relatedTx.toAccount} account`
          }] : [], ...relatedTx.recipientName ? [{
            label: "Recipient",
            value: relatedTx.recipientName
          }] : [], ...relatedTx.toBank ? [{
            label: "Bank",
            value: relatedTx.toBank
          }] : [], ...relatedTx.toCountry ? [{
            label: "Country",
            value: relatedTx.toCountry
          }] : [], ...relatedTx.purpose ? [{
            label: "Purpose",
            value: relatedTx.purpose
          }] : [], ...relatedTx.note ? [{
            label: "Note",
            value: relatedTx.note
          }] : [], {
            label: "Reference",
            value: relatedTx.transactionRef || relatedTx.id
          }, {
            label: "Status",
            value: relatedTx.status,
            badge: relatedTx.status === "pending" ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" : relatedTx.status === "approved" ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-red-500/20 text-red-300 border-red-500/30"
          }].map(({
            label,
            value,
            highlight,
            badge
          }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center py-1 border-b border-[rgba(255,255,255,0.04)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-300/60", children: label }),
            badge ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: badge, children: value }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-semibold capitalize ${highlight ? "text-cyan-400 font-mono text-base" : "text-white"}`, children: value })
          ] }, label)) })
        ] }) : selectedNotif.transactionId ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-4 text-blue-300/50 text-sm", children: "Loading transaction details..." }) : null,
        selectedNotif.declineReason && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-xl", style: {
          background: "rgba(255,77,106,0.08)",
          border: "1px solid rgba(255,77,106,0.2)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-red-400 mb-1", children: "Decline Reason" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-300", children: selectedNotif.declineReason })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { className: "gap-2 mt-2", children: relatedTx?.status === "pending" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleRejectClick, disabled: actionLoading, className: "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 15, className: "mr-1" }),
          "Decline"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleApproveClick, disabled: actionLoading, className: "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 15, className: "mr-1" }),
          "Approve"
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setSelectedNotif(null), className: "w-full bg-transparent border border-[rgba(255,255,255,0.1)] text-blue-300/60 hover:bg-white/5", children: "Close" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: approveDialogOpen, onOpenChange: setApproveDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-[#0F1829] border-[rgba(255,255,255,0.1)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-white", children: "Confirm Approval" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-blue-300/60", children: "This will deduct the amount and notify the user." })
      ] }),
      relatedTx && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl space-y-2 text-sm", style: {
        background: "rgba(56,189,248,0.06)",
        border: "1px solid rgba(56,189,248,0.15)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-300/60", children: "User" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-semibold", children: relatedTx.userFullName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-300/60", children: "Amount to deduct" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-cyan-400 font-mono font-bold text-lg", children: [
            "$",
            formatCurrency(relatedTx.amount)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-300/60", children: "From account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white capitalize", children: relatedTx.fundingAccount })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-t border-[rgba(255,255,255,0.05)] pt-2 mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-300/60", children: "Balance after" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-green-400 font-semibold", children: [
            "$",
            formatCurrency(Math.max(0, (relatedTx.balanceAtSubmission || 0) - relatedTx.amount))
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setApproveDialogOpen(false), className: "bg-transparent border border-[rgba(255,255,255,0.1)] text-blue-300/60 hover:bg-white/5", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: confirmApprove, disabled: actionLoading, className: "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30", children: actionLoading ? "Approving..." : "Confirm Approval" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: rejectDialogOpen, onOpenChange: setRejectDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-[#0F1829] border-[rgba(255,255,255,0.1)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-white", children: "Decline Transaction" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-blue-300/60", children: "Provide a reason — the user will see this in their notification." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { placeholder: "Reason for declining (min 5 characters)...", value: rejectReason, onChange: (e) => setRejectReason(e.target.value), rows: 3, className: "bg-[#070B14] border-[rgba(255,255,255,0.1)] text-white placeholder:text-blue-300/40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setRejectDialogOpen(false), className: "bg-transparent border border-[rgba(255,255,255,0.1)] text-blue-300/60 hover:bg-white/5", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: confirmReject, disabled: actionLoading || rejectReason.trim().length < 5, className: "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30", children: actionLoading ? "Declining..." : "Confirm Decline" })
      ] })
    ] }) })
  ] });
}
export {
  AdminNotificationsPage as component
};
