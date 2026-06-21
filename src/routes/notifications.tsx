import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Bell,
  AlertTriangle,
  Settings as SettingsIcon,
  CheckCircle2,
  XCircle,
  Check,
  Clock,
} from "lucide-react";
import { useUserNotifications } from "../dashboard/hooks/useUserNotifications";
import { useUserTransactions } from "../dashboard/hooks/useUserTransactions";
import { useTheme } from "../hooks/use-theme";
import { BottomNav } from "../dashboard/components/BottomNav";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications - Nexus Bank" }] }),
  component: Notifications,
});

function formatCurrency(v: number) {
  return v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function Notifications() {
  const navigate = useNavigate();
  const { notifications, unreadCount, loading, markNotificationRead, markAllRead } = useUserNotifications();
  const { transactions } = useUserTransactions();
  const { theme } = useTheme();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [selectedNotif, setSelectedNotif] = useState<any>(null);

  const bg = theme === "dark" ? "#0B1120" : "#f9fafb";
  const cardBg = theme === "dark" ? "#111827" : "#ffffff";
  const textPrimary = theme === "dark" ? "#FFFFFF" : "#111827";
  const textMuted = theme === "dark" ? "#8A9BB5" : "#6b7280";

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => n.status === "unread")
      : notifications;

  // Find related transaction for detail view
  const relatedTx = selectedNotif?.transactionId
    ? transactions.find((t: any) => t.id === selectedNotif.transactionId)
    : null;

  const handleClick = async (notif: any) => {
    setSelectedNotif(notif);
    if (notif.status === "unread") {
      await markNotificationRead(notif.id);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "transaction_submitted":
      case "new_transaction":
        return <AlertTriangle size={20} style={{ color: "#FFAB00" }} />;
      case "transaction_approved":
      case "admin_credit":
        return <CheckCircle2 size={20} style={{ color: "#00E676" }} />;
      case "transaction_declined":
      case "admin_debit":
        return <XCircle size={20} style={{ color: "#FF4D6A" }} />;
      case "balance_override":
        return <Bell size={20} style={{ color: "#38BDF8" }} />;
      default:
        return <Bell size={20} style={{ color: "#38BDF8" }} />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "transaction_submitted":
      case "new_transaction":
        return "rgba(255,171,0,0.2)";
      case "transaction_approved":
      case "admin_credit":
        return "rgba(0,230,118,0.2)";
      case "transaction_declined":
      case "admin_debit":
        return "rgba(255,77,106,0.2)";
      default:
        return theme === "dark" ? "#1A2438" : "#f3f4f6";
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col pb-24" style={{ background: bg }}>
      {/* Header */}
      <div className="px-5 pt-10 pb-6 flex items-center gap-4">
        <button onClick={() => navigate({ to: "/" })} className="p-2">
          <ArrowLeft size={24} style={{ color: textPrimary }} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center" style={{ color: textPrimary }}>
          Notifications
        </h1>
        <div className="w-10 relative">
          {unreadCount > 0 && (
            <div
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "#FF4D6A", color: "#FFFFFF" }}
            >
              {unreadCount}
            </div>
          )}
        </div>
      </div>

      {/* Filter & Actions */}
      <div className="px-5 mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2 capitalize"
              style={{
                background: filter === f ? "#38BDF8" : theme === "dark" ? "#1A2438" : "#f3f4f6",
                color: filter === f ? "#0B1120" : textMuted,
              }}
            >
              {f}
              {f === "unread" && unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: theme === "dark" ? "#1E2D45" : "#d1d5db" }}>
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: "rgba(56,189,248,0.1)", color: "#38BDF8" }}
          >
            <Check size={12} />
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="px-5 flex-1 space-y-3 overflow-y-auto">
        {loading ? (
          <div className="text-center py-12" style={{ color: textMuted }}>Loading...</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: theme === "dark" ? "#1A2438" : "#f3f4f6" }}>
              <Bell size={28} style={{ color: "#8A9BB5" }} />
            </div>
            <p style={{ color: textMuted }}>{filter === "unread" ? "All caught up!" : "No notifications yet."}</p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              className="w-full flex items-start gap-3 p-4 rounded-2xl transition-all cursor-pointer hover:opacity-90 active:scale-[0.99]"
              style={{
                background: cardBg,
                borderLeft: n.status === "unread" ? "3px solid #38BDF8" : "3px solid transparent",
              }}
              onClick={() => handleClick(n)}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: getIconBg(n.type) }}
              >
                {getIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold truncate" style={{ color: textPrimary }}>
                    {n.title}
                  </p>
                  {n.status === "unread" && (
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 ml-2" style={{ background: "#38BDF8" }} />
                  )}
                </div>
                <p className="text-xs mb-1" style={{ color: textMuted }}>{n.message}</p>
                {n.declineReason && (
                  <p className="text-xs font-semibold" style={{ color: "#FF4D6A" }}>Reason: {n.declineReason}</p>
                )}
                <p className="text-xs mt-1" style={{ color: textMuted }}>
                  {n.createdAt?.toLocaleString() || "Just now"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Notification Detail Bottom Sheet ── */}
      {selectedNotif && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedNotif(null)} />
          <div
            className="relative w-full rounded-t-[28px] p-6 max-h-[85vh] overflow-y-auto"
            style={{ background: theme === "dark" ? "#111827" : "#ffffff" }}
          >
            <div className="w-12 h-1 rounded-full mx-auto mb-5" style={{ background: "#1E2D45" }} />

            {/* Notif header */}
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: getIconBg(selectedNotif.type) }}
              >
                {getIcon(selectedNotif.type)}
              </div>
              <div>
                <p className="font-bold text-base" style={{ color: textPrimary }}>{selectedNotif.title}</p>
                <p className="text-xs" style={{ color: textMuted }}>
                  {selectedNotif.createdAt?.toLocaleString() || "Just now"}
                </p>
              </div>
            </div>

            <p className="text-sm mb-4" style={{ color: textMuted }}>{selectedNotif.message}</p>

            {/* Decline reason */}
            {selectedNotif.declineReason && (
              <div className="mb-4 p-3 rounded-xl" style={{ background: "rgba(255,77,106,0.08)", border: "1px solid rgba(255,77,106,0.2)" }}>
                <p className="text-xs font-semibold mb-1" style={{ color: "#FF4D6A" }}>Decline Reason</p>
                <p className="text-sm" style={{ color: "#FF4D6A" }}>{selectedNotif.declineReason}</p>
              </div>
            )}

            {/* Transaction details */}
            {relatedTx ? (
              <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="px-4 py-2.5" style={{ background: theme === "dark" ? "#070B14" : "#f9fafb" }}>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: textMuted }}>
                    Transaction Details
                  </p>
                </div>
                <div className="p-4 space-y-2.5">
                  {/* Amount hero */}
                  <div className="text-center py-3 mb-2">
                    <p className="text-xs mb-1" style={{ color: textMuted }}>Amount</p>
                    <p className="text-3xl font-mono font-bold" style={{ color: textPrimary }}>
                      ${formatCurrency((relatedTx as any).amount || selectedNotif.amount || 0)}
                    </p>
                    <span
                      className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: (relatedTx as any).status === "approved"
                          ? "rgba(0,230,118,0.12)"
                          : (relatedTx as any).status === "declined"
                            ? "rgba(255,77,106,0.12)"
                            : "rgba(255,171,0,0.12)",
                        color: (relatedTx as any).status === "approved"
                          ? "#00E676"
                          : (relatedTx as any).status === "declined"
                            ? "#FF4D6A"
                            : "#FFAB00",
                      }}
                    >
                      {(relatedTx as any).status === "approved" && <CheckCircle2 size={11} />}
                      {(relatedTx as any).status === "declined" && <XCircle size={11} />}
                      {(relatedTx as any).status === "pending" && <Clock size={11} />}
                      {(relatedTx as any).status?.charAt(0).toUpperCase() + (relatedTx as any).status?.slice(1)}
                    </span>
                  </div>

                  {[
                    { label: "Type", value: (relatedTx as any).type?.replace(/_/g, " ") },
                    { label: "From Account", value: (relatedTx as any).fundingAccount },
                    ...((relatedTx as any).toAccount ? [{ label: "To Account", value: (relatedTx as any).toAccount }] : []),
                    ...((relatedTx as any).recipientName ? [{ label: "Recipient", value: (relatedTx as any).recipientName }] : []),
                    ...((relatedTx as any).toBank ? [{ label: "Bank", value: (relatedTx as any).toBank }] : []),
                    ...((relatedTx as any).toCountry ? [{ label: "Country", value: (relatedTx as any).toCountry }] : []),
                    ...((relatedTx as any).purpose ? [{ label: "Purpose", value: (relatedTx as any).purpose }] : []),
                    ...((relatedTx as any).note ? [{ label: "Note", value: (relatedTx as any).note }] : []),
                    { label: "Reference", value: (relatedTx as any).transactionRef || (relatedTx as any).id },
                    { label: "Date", value: (relatedTx as any).createdAt instanceof Date ? (relatedTx as any).createdAt.toLocaleString() : "-" },
                    ...((relatedTx as any).reviewedAt instanceof Date ? [{ label: "Reviewed", value: (relatedTx as any).reviewedAt.toLocaleString() }] : []),
                    ...((relatedTx as any).balanceAfter != null ? [{ label: "Balance After", value: `$${formatCurrency((relatedTx as any).balanceAfter)}` }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-1.5 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                      <span className="text-xs" style={{ color: textMuted }}>{label}</span>
                      <span className="text-sm font-semibold text-right capitalize max-w-[55%] break-words" style={{ color: textPrimary }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : selectedNotif.transactionId ? (
              <div className="text-center py-6" style={{ color: textMuted }}>
                <p className="text-sm">Transaction details unavailable</p>
              </div>
            ) : null}

            {/* Action buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => { setSelectedNotif(null); navigate({ to: "/transactions" }); }}
                className="py-4 rounded-xl font-semibold text-sm"
                style={{ background: "linear-gradient(135deg, #00C6FF, #7B2FFF)", color: "#FFFFFF" }}
              >
                View History
              </button>
              <button
                onClick={() => setSelectedNotif(null)}
                className="py-4 rounded-xl font-semibold text-sm"
                style={{ background: theme === "dark" ? "#1A2438" : "#f3f4f6", color: textMuted }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav active="notifications" />
    </div>
  );
}