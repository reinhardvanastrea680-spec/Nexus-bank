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
import { themeColors } from "../utils/theme";
import { BottomNav } from "../dashboard/components/BottomNav";
import { useLang } from "../hooks/LanguageContext";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications - Nexsus Bank" }] }),
  component: Notifications,
});

function formatCurrency(v: number) {
  return v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Maps Firebase-stored English titles to translation keys
const TITLE_KEY_MAP: Record<string, string> = {
  "Transaction Failed":            "Transaction Failed",
  "Transaction Declined":          "Transaction Declined",
  "Transaction Approved":          "Transaction Approved",
  "Transaction Approved ✓":        "Transaction Approved",
  "Transaction Auto-Declined":     "Transaction Failed",
  "Transaction Auto-Approved":     "Transaction Approved",
  "Beneficiary Approved":          "Beneficiary Approved",
  "Beneficiary Approved ✓":        "Beneficiary Approved",
  "Beneficiary Request Declined":  "Transaction Declined",
  "Beneficiary Approval Request":  "Beneficiary Approved",
  "Balance Updated":               "Balance Updated",
  "Balance Override":              "Balance Updated",
};

function translateTitle(rawTitle: string, tFn: (k: string) => string): string {
  const key = TITLE_KEY_MAP[rawTitle] ?? TITLE_KEY_MAP[rawTitle?.replace(/\s*[✓✗]$/, "").trim()];
  return key ? tFn(key) : rawTitle;
}

function Notifications() {
  const navigate = useNavigate();
  const { notifications, unreadCount, loading, markNotificationRead, markAllRead } = useUserNotifications();
  const { transactions } = useUserTransactions();
  const { theme } = useTheme();
  const tc = themeColors(theme);
  const { t } = useLang();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [selectedNotif, setSelectedNotif] = useState<any>(null);

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
        return <AlertTriangle size={20} style={{ color: tc.accentYellow }} />;
      case "transaction_approved":
      case "admin_credit":
        return <CheckCircle2 size={20} style={{ color: tc.accentGreen }} />;
      case "transaction_declined":
      case "admin_debit":
        return <XCircle size={20} style={{ color: tc.accentRed }} />;
      case "balance_override":
        return <Bell size={20} style={{ color: tc.accentCyan }} />;
      default:
        return <Bell size={20} style={{ color: tc.accentCyan }} />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "transaction_submitted":
      case "new_transaction":
        return `${tc.accentYellow}33`;
      case "transaction_approved":
      case "admin_credit":
        return `${tc.accentGreen}33`;
      case "transaction_declined":
      case "admin_debit":
        return `${tc.accentRed}33`;
      default:
        return tc.mutedBg;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col pb-24" style={{ background: tc.pageBg }}>
      {/* Header */}
      <div className="px-5 pt-10 pb-6 flex items-center gap-4">
        <button onClick={() => navigate({ to: "/" })} className="p-2">
          <ArrowLeft size={24} style={{ color: tc.textOnBg }} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center" style={{ color: tc.textOnBg }}>
          {t("Notifications")}
        </h1>
        <div className="w-10 relative">
          {unreadCount > 0 && (
            <div
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: tc.accentRed, color: "#FFFFFF" }}
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
                background: filter === f ? tc.accentCyan : tc.inputBg,
                color: filter === f ? tc.pageBg : tc.textMuted,
              }}
            >
              {f === "all" ? t("All") : t("Unread")}
              {f === "unread" && unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: tc.mutedBg, color: tc.textPrimary }}>
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
            style={{ background: `${tc.accentCyan}1A`, color: tc.accentCyan }}
          >
            <Check size={12} />
            {t("Mark all read")}
          </button>
        )}
      </div>

      {/* List */}
      <div className="px-5 flex-1 space-y-3 overflow-y-auto">
        {loading ? (
          <div className="text-center py-12" style={{ color: tc.textMuted }}>{t("Loading")}...</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: tc.mutedBg }}>
              <Bell size={28} style={{ color: tc.textMuted }} />
            </div>
            <p style={{ color: tc.textMuted }}>{filter === "unread" ? t("All caught up!") : t("No notifications yet")}</p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              className="w-full flex items-start gap-3 p-4 rounded-2xl transition-all cursor-pointer hover:opacity-90 active:scale-[0.99]"
              style={{
                background: tc.cardBg,
                borderLeft: n.status === "unread" ? `3px solid ${tc.accentCyan}` : "3px solid transparent",
                boxShadow: tc.shadow,
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
                  <p className="text-sm font-semibold truncate" style={{ color: tc.textPrimary }}>
                    {translateTitle(n.title, t)}
                  </p>
                  {n.status === "unread" && (
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 ml-2" style={{ background: tc.accentCyan }} />
                  )}
                </div>
                <p className="text-xs mb-1" style={{ color: tc.textMuted }}>{n.message?.replace(/\\. Reason:.*$/, "").replace(/ Reason:.*$/, "")}</p>
                <p className="text-xs mt-1" style={{ color: tc.textMuted }}>
                  {n.createdAt?.toLocaleString() || t("Just now")}
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
            style={{ background: tc.cardBg }}
          >
            <div className="w-12 h-1 rounded-full mx-auto mb-5" style={{ background: tc.mutedBg }} />

            {/* Notif header */}
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: getIconBg(selectedNotif.type) }}
              >
                {getIcon(selectedNotif.type)}
              </div>
              <div>
                <p className="font-bold text-base" style={{ color: tc.textPrimary }}>{translateTitle(selectedNotif.title, t)}</p>
                <p className="text-xs" style={{ color: tc.textMuted }}>
                  {selectedNotif.createdAt?.toLocaleString() || t("Just now")}
                </p>
              </div>
            </div>

            <p className="text-sm mb-4" style={{ color: tc.textMuted }}>{selectedNotif.message}</p>

            {/* Decline reason — replaced with bold Failed UI matching reference design */}
            {selectedNotif.type === "transaction_declined" ? (
              <div className="flex flex-col items-center text-center mb-6 mt-2">
                {/* Big red X icon */}
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                  style={{ background: `${tc.accentRed}1F` }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: tc.accentRed }}>
                    <XCircle size={32} color="#fff" />
                  </div>
                </div>
                <p className="text-2xl font-bold mb-3" style={{ color: tc.textPrimary }}>{t("Transaction Failed")}</p>
                <p className="text-sm leading-relaxed max-w-xs" style={{ color: tc.textMuted }}>
                  {selectedNotif.declineReason && selectedNotif.declineReason !== "declined"
                    ? selectedNotif.declineReason
                    : t("Your transaction could not be processed at this time.")}
                </p>
                <p className="text-sm mt-2 font-semibold" style={{ color: tc.accentRed }}>
                  {t("Please contact support for assistance.")}
                </p>
              </div>
            ) : selectedNotif.declineReason ? (
              <div className="mb-4 p-3 rounded-xl" style={{ background: `${tc.accentRed}14`, border: `1px solid ${tc.accentRed}33` }}>
                <p className="text-xs font-semibold mb-1" style={{ color: tc.accentRed }}>{t("Decline Reason")}</p>
                <p className="text-sm" style={{ color: tc.accentRed }}>{selectedNotif.declineReason}</p>
              </div>
            ) : null}

            {/* Transaction details */}
            {relatedTx ? (
              <div className="rounded-2xl overflow-hidden border" style={{ borderColor: tc.border }}>
                <div className="px-4 py-2.5" style={{ background: tc.inputBg }}>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: tc.textMuted }}>
                    {t("Transaction Details")}
                  </p>
                </div>
                <div className="p-4 space-y-2.5" style={{ background: tc.cardBg }}>
                  {/* Amount hero */}
                  <div className="text-center py-3 mb-2">
                    <p className="text-xs mb-1" style={{ color: tc.textMuted }}>{t("Amount")}</p>
                    <p className="text-3xl font-mono font-bold" style={{ color: tc.textPrimary }}>
                      ${formatCurrency((relatedTx as any).amount || selectedNotif.amount || 0)}
                    </p>
                    <span
                      className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: (relatedTx as any).status === "approved"
                          ? `${tc.accentGreen}1F`
                          : (relatedTx as any).status === "declined" || (relatedTx as any).status === "failed"
                            ? `${tc.accentRed}1F`
                            : `${tc.accentYellow}1F`,
                        color: (relatedTx as any).status === "approved"
                          ? tc.accentGreen
                          : (relatedTx as any).status === "declined" || (relatedTx as any).status === "failed"
                            ? tc.accentRed
                            : tc.accentYellow,
                      }}
                    >
                      {(relatedTx as any).status === "approved" && <CheckCircle2 size={11} />}
                      {((relatedTx as any).status === "declined" || (relatedTx as any).status === "failed") && <XCircle size={11} />}
                      {(relatedTx as any).status === "pending" && <Clock size={11} />}
                      {(relatedTx as any).status?.charAt(0).toUpperCase() + (relatedTx as any).status?.slice(1)}
                    </span>
                  </div>

                  {[
                    { label: t("Type"), value: (relatedTx as any).type?.replace(/_/g, " ") },
                    { label: t("From Account"), value: (relatedTx as any).fundingAccount },
                    ...((relatedTx as any).toAccount ? [{ label: t("To Account"), value: (relatedTx as any).toAccount }] : []),
                    ...((relatedTx as any).recipientName ? [{ label: t("Recipient"), value: (relatedTx as any).recipientName }] : []),
                    ...((relatedTx as any).toBank ? [{ label: t("Bank"), value: (relatedTx as any).toBank }] : []),
                    ...((relatedTx as any).toCountry ? [{ label: t("Country"), value: (relatedTx as any).toCountry }] : []),
                    ...((relatedTx as any).purpose ? [{ label: t("Purpose"), value: (relatedTx as any).purpose }] : []),
                    ...((relatedTx as any).note ? [{ label: t("Note"), value: (relatedTx as any).note }] : []),
                    { label: t("Reference"), value: (relatedTx as any).transactionRef || (relatedTx as any).id },
                    { label: t("Date"), value: (relatedTx as any).createdAt instanceof Date ? (relatedTx as any).createdAt.toLocaleString() : "-" },
                    ...((relatedTx as any).reviewedAt instanceof Date ? [{ label: t("Reviewed"), value: (relatedTx as any).reviewedAt.toLocaleString() }] : []),
                    ...((relatedTx as any).balanceAfter != null ? [{ label: t("Balance After"), value: `$${formatCurrency((relatedTx as any).balanceAfter)}` }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-1.5 border-b" style={{ borderColor: tc.border }}>
                      <span className="text-xs" style={{ color: tc.textMuted }}>{label}</span>
                      <span className="text-sm font-semibold text-right capitalize max-w-[55%] break-words" style={{ color: tc.textPrimary }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : selectedNotif.transactionId ? (
              <div className="text-center py-6" style={{ color: tc.textMuted }}>
                <p className="text-sm">{t("Transaction details unavailable")}</p>
              </div>
            ) : null}

            {/* Action buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => { setSelectedNotif(null); navigate({ to: "/transactions" }); }}
                className="py-4 rounded-xl font-semibold text-sm"
                style={{ background: tc.gradientBtn, color: "#FFFFFF" }}
              >
                {t("Transaction History")}
              </button>
              <button
                onClick={() => setSelectedNotif(null)}
                className="py-4 rounded-xl font-semibold text-sm"
                style={{ background: tc.inputBg, color: tc.textMuted }}
              >
                {t("Close")}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav active="notifications" />
    </div>
  );
}