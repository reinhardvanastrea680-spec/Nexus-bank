import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTheme } from "../hooks/use-theme";
import { themeColors } from "../utils/theme";
import {
  ArrowLeft, Filter, ArrowDown, ArrowUp,
  Clock, CheckCircle2, XCircle,
} from "lucide-react";
import { useUserAuth } from "../dashboard/hooks/useUserAuth";
import { useUserTransactions } from "../dashboard/hooks/useUserTransactions";
import { BottomNav } from "../dashboard/components/BottomNav";
import { useLang } from "../hooks/LanguageContext";

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Determine if a transaction is a credit (incoming money) or debit (outgoing)
export function isTransactionCredit(tx: any): boolean {
  const type = tx.type || "";
  // Explicit credit types
  if (type === "credit" || type === "check_deposit" || type === "crypto_deposit") return true;
  // Explicit debit types — always outgoing regardless of status
  if (
    type === "debit" ||
    type === "wire_transfer" ||
    type === "local_transfer" ||
    type === "internal_transfer" ||
    type === "buy_crypto" ||
    type === "bill_payment"
  ) return false;
  // Admin-posted with explicit type field
  if (tx.subType === "incoming") return true;
  if (tx.subType === "outgoing") return false;
  // Fallback: check_deposit / crypto_deposit as credit
  return false;
}

function formatDate(dateInput: any) {
  let d: Date | null = null;

  if (dateInput instanceof Date) {
    d = dateInput;
  } else if (dateInput?.toDate) {
    d = dateInput.toDate();
  } else if (typeof dateInput === "string" && dateInput) {
    d = new Date(dateInput);
  } else if (typeof dateInput === "number") {
    d = new Date(dateInput);
  }

  if (!d || isNaN(d.getTime())) return "—";

  // Show time only (e.g. "3:42 PM")
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getStatusBadge(status: string, tl: (key: string) => string) {
  switch (status) {
    case "pending":
      return { text: tl("Pending"),   color: "#FFAB00", icon: Clock         };
    case "approved":
    case "completed":
      return { text: tl("Completed"), color: "#00E676", icon: CheckCircle2  };
    case "failed":
      return { text: tl("Failed"),    color: "#FF4D6A", icon: XCircle       };
    case "declined":
      return { text: tl("Failed"),    color: "#FF4D6A", icon: XCircle       };
    case "cancelled":
      return { text: tl("Cancelled"), color: "#8A9BB5", icon: XCircle       };
    default:
      // Admin-posted transactions with no status field — show completed
      return { text: tl("Completed"), color: "#00E676", icon: CheckCircle2  };
  }
}

export const Route = createFileRoute("/transactions")({
  head: () => ({ meta: [{ title: "Transaction History - Nexsus Bank" }] }),
  component: Transactions,
});

function Transactions() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const t = themeColors(theme);
  const { user } = useUserAuth();
  const { t: tl } = useLang();
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterAccount, setFilterAccount] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);

  const { transactions, loading } = useUserTransactions();

  const filteredTransactions = transactions.filter((tx: any) => {
    if (filterType) {
      const isCredit = isTransactionCredit(tx);
      if (filterType === "credits" && !isCredit) return false;
      if (filterType === "debits" && isCredit) return false;
    }
    const txAccount = (tx.account || tx.fundingAccount || "").toLowerCase();
    if (filterAccount && txAccount !== filterAccount.toLowerCase()) return false;
    return true;
  });

  const groupedTransactions = filteredTransactions.reduce((groups: any, tx: any) => {
    const dateSource = tx.date?.toDate ? tx.date.toDate() : tx.createdAt instanceof Date ? tx.createdAt : null;
    const dateKey = dateSource ? dateSource.toDateString() : "Unknown Date";
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(tx);
    return groups;
  }, {});

  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: t.pageBg }}
      >
        <p style={{ color: t.textOnBg }}>{tl("Please log in to view transactions.")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col pb-24" style={{ background: t.pageBg }}>
      {/* Header */}
      <div className="px-5 pt-10 pb-6 flex items-center gap-4">
        <button onClick={() => navigate({ to: "/" })} className="p-2">
          <ArrowLeft size={24} style={{ color: t.textOnBg }} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center" style={{ color: t.textOnBg }}>
          {tl("Transaction History")}
        </h1>
        <button onClick={() => setShowFilters(!showFilters)} className="p-2">
          <Filter size={24} style={{ color: t.textOnBg }} />
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="px-5 pb-6 space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {[
              { id: null, label: tl("All") },
              { id: "credits", label: tl("Credits Only") },
              { id: "debits", label: tl("Debits Only") },
            ].map((opt) => (
              <button
                key={opt.id || "all"}
                onClick={() => setFilterType(opt.id)}
                className="flex-shrink-0 px-4 py-2 rounded-full font-semibold transition-all"
                style={{
                  background: filterType === opt.id ? t.accentCyan : t.inputBg,
                  color: filterType === opt.id ? t.pageBg : t.textMuted,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {[
              { id: null, label: tl("All Accounts") },
              { id: "checking", label: tl("Checking") },
              { id: "savings", label: tl("Savings") },
            ].map((opt) => (
              <button
                key={opt.id || "all"}
                onClick={() => setFilterAccount(opt.id)}
                className="flex-shrink-0 px-4 py-2 rounded-full font-semibold transition-all"
                style={{
                  background: filterAccount === opt.id ? t.accentCyan : t.inputBg,
                  color: filterAccount === opt.id ? t.pageBg : t.textMuted,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Transactions List */}
      <div className="px-5 flex-1 space-y-6 overflow-y-auto">
        {loading ? (
          <div className="text-center py-12" style={{ color: t.textMuted }}>{tl("Loading")}...</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12" style={{ color: t.textMuted }}>{tl("No transactions found")}</div>
        ) : (
          Object.keys(groupedTransactions).map((dateKey) => (
            <div key={dateKey} className="space-y-3">
              <span className="text-xs font-semibold" style={{ color: t.textMutedOnBg }}>
                {dateKey}
              </span>
              {groupedTransactions[dateKey].map((tx: any) => {
                const badge = getStatusBadge(tx.status || "approved", tl);
                const IconComponent = badge.icon;
                const isCredit = isTransactionCredit(tx);
                const txAccount = tx.account || tx.fundingAccount || "account";
                const txDescription = tx.description || tx.type?.replace(/_/g, " ") || "Transaction";
                return (
                  <button
                    key={tx.id}
                    onClick={() => setSelectedTransaction(tx)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl transition-all"
                    style={{ background: t.cardBg, border: `1px solid ${t.border}` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: isCredit ? `${t.accentGreen}20` : `${t.accentRed}20` }}>
                        {isCredit
                          ? <ArrowDown size={18} style={{ color: t.accentGreen }} />
                          : <ArrowUp   size={18} style={{ color: t.accentRed   }} />}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold" style={{ color: t.textPrimary }}>{txDescription}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs" style={{ color: t.textMuted }}>{formatDate(tx.date || tx.createdAt)}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                            style={{ background: t.mutedBg, color: badge.color }}>
                            <IconComponent size={10} />
                            {badge.text}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono font-bold" style={{ color: isCredit ? t.accentGreen : t.accentRed }}>
                        {isCredit ? "+" : "-"}${formatCurrency(tx.amount)}
                      </p>
                      <span className="text-xs" style={{ color: t.textMuted }}>
                        {txAccount.charAt(0).toUpperCase() + txAccount.slice(1)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Transaction Detail Bottom Sheet */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setSelectedTransaction(null)}
          />
          <div className="relative w-full p-6 rounded-t-[28px]" style={{ background: t.cardBg }}>
            <div className="w-12 h-1 rounded-full mx-auto mb-6" style={{ background: t.mutedBg }} />
            <div className="text-center mb-6">
              {(() => {
                const isCredit = isTransactionCredit(selectedTransaction);
                const badge = getStatusBadge(selectedTransaction.status || "approved", tl);
                const txAccount = selectedTransaction.account || selectedTransaction.fundingAccount || "account";
                const txDesc = selectedTransaction.description || selectedTransaction.type?.replace(/_/g, " ") || "Transaction";
                const StatusIcon = badge.icon;
                return (
                  <>
                    <p
                      className={`text-3xl font-mono font-bold mb-2 ${isCredit ? "text-green-400" : "text-red-400"}`}
                    >
                      {isCredit ? "+" : "-"}$
                      {formatCurrency(selectedTransaction.amount)}
                    </p>
                    <p className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                      {txDesc}
                    </p>
                    <div className="mt-4 space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm" style={{ color: t.textMuted }}>{tl("Date & Time")}</span>
                        <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                          {formatDate(selectedTransaction.date || selectedTransaction.createdAt)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm" style={{ color: t.textMuted }}>{tl("Status")}</span>
                        <div className="flex items-center gap-2">
                          <StatusIcon size={12} style={{ color: badge.color }} />
                          <span className="text-sm font-semibold" style={{ color: badge.color }}>{badge.text}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm" style={{ color: t.textMuted }}>{tl("Account")}</span>
                        <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                          {txAccount.charAt(0).toUpperCase() + txAccount.slice(1)}
                        </span>
                      </div>
                      {selectedTransaction.recipientName && (
                        <div className="flex justify-between">
                          <span className="text-sm" style={{ color: t.textMuted }}>{tl("Recipient")}</span>
                          <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>{selectedTransaction.recipientName}</span>
                        </div>
                      )}
                      {selectedTransaction.declineReason && (
                        <div className="flex justify-between gap-4">
                          <span className="text-sm" style={{ color: t.textMuted }}>{tl("Decline Reason")}</span>
                          <span className="text-sm font-semibold text-right" style={{ color: t.accentRed }}>{selectedTransaction.declineReason}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm" style={{ color: t.textMuted }}>{tl("Reference")}</span>
                        <span className="text-sm font-mono font-semibold" style={{ color: t.textPrimary }}>
                          {selectedTransaction.transactionRef || selectedTransaction.id}
                        </span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <button onClick={() => setSelectedTransaction(null)} className="py-4 rounded-xl font-semibold"
                style={{ background: t.inputBg, color: t.textMuted }}>
                {tl("Close")}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav active="transactions" />
    </div>
  );
}
