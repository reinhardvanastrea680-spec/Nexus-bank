import { useState } from "react";
import { CheckCircle2, XCircle, FileText, Home } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { formatCurrency } from "../../utils/formatCurrency";

interface TransactionSuccessScreenProps {
  amount: number;
  transactionRef: string;
  fundingAccount: string;
  recipientName?: string;
  /** Transaction status — "pending" | "completed" | "declined" | "failed" */
  status?: string;
  /** Transaction type e.g. "wire_transfer" | "local_transfer" | "internal_transfer" */
  transactionType?: string;
  /** Bank name (wire transfer) */
  recipientBank?: string;
  /** Region/country (wire transfer only) */
  recipientRegion?: string;
  /** Kept for backward-compat — no longer used */
  saveBeneficiary?: unknown;
}

export function TransactionSuccessScreen({
  amount,
  transactionRef,
  fundingAccount,
  recipientName,
  status = "pending",
  transactionType = "",
  recipientBank,
  recipientRegion,
}: TransactionSuccessScreenProps) {
  const navigate = useNavigate();
  const [showReceipt, setShowReceipt] = useState(false);

  const isFailed    = status === "declined" || status === "failed" || status === "failed";
  const isCompleted = status === "completed";
  const isWire      = transactionType?.includes("wire");
  const timeNow     = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  // ── RECEIPT VIEW ──────────────────────────────────────────────────────
  if (showReceipt) {
    return (
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center px-6 pb-24"
        style={{ background: "#0B1120" }}
      >
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setShowReceipt(false)} className="p-2 rounded-xl"
              style={{ background: "rgba(255,255,255,0.06)", color: "#8A9BB5" }}>
              ←
            </button>
            <h2 className="text-lg font-bold text-white">Transaction Receipt</h2>
          </div>

          {/* Status hero */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
              style={{ background: isFailed ? "rgba(239,68,68,0.15)" : "rgba(0,230,118,0.12)" }}>
              {isFailed
                ? <XCircle size={36} style={{ color: "#EF4444" }} />
                : <CheckCircle2 size={36} style={{ color: "#00E676" }} />}
            </div>
            <p className="text-lg font-bold" style={{ color: isFailed ? "#EF4444" : "#00E676" }}>
              {isFailed ? "Failed" : "Submitted"}
            </p>
            {isFailed && (
              <p className="text-xs mt-1 text-center" style={{ color: "#8A9BB5" }}>
                Please contact support for assistance.
              </p>
            )}
          </div>

          {/* Receipt card */}
          <div className="w-full rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            {/* Header band */}
            <div className="px-4 py-3" style={{ background: "#070B14" }}>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8A9BB5" }}>
                Transaction Details
              </p>
            </div>

            {/* Amount */}
            <div className="text-center py-5" style={{ background: "#111827", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <p className="text-xs mb-1" style={{ color: "#8A9BB5" }}>Amount</p>
              <p className="text-3xl font-mono font-bold text-white">{formatCurrency(amount)}</p>
              {/* Status badge */}
              <span
                className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: isFailed ? "rgba(239,68,68,0.15)" : isCompleted ? "rgba(0,230,118,0.12)" : "rgba(255,171,0,0.12)",
                  color:      isFailed ? "#EF4444"              : isCompleted ? "#00E676"               : "#FFAB00",
                  border: `1px solid ${isFailed ? "rgba(239,68,68,0.3)" : isCompleted ? "rgba(0,230,118,0.3)" : "rgba(255,171,0,0.3)"}`,
                }}
              >
                {isFailed     ? <XCircle size={11} />     : <CheckCircle2 size={11} />}
                {isFailed ? "Failed" : isCompleted ? "Approved" : "Pending"}
              </span>
            </div>

            {/* Detail rows */}
            <div className="p-4 space-y-3" style={{ background: "#111827" }}>
              {[
                { label: "Type",         value: transactionType?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Transfer" },
                { label: "From Account", value: fundingAccount.charAt(0).toUpperCase() + fundingAccount.slice(1) },
                ...(recipientName ? [{ label: "Recipient", value: recipientName }] : []),
                ...(recipientBank  ? [{ label: "Bank",     value: recipientBank }] : []),
                // Region only for wire transfers
                ...(isWire && recipientRegion ? [{ label: "Region", value: recipientRegion }] : []),
                { label: "Reference", value: transactionRef },
                { label: "Time",      value: timeNow },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-1 border-b"
                  style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  <span className="text-sm" style={{ color: "#8A9BB5" }}>{label}</span>
                  <span className="text-sm font-semibold text-right capitalize max-w-[55%] break-words text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Back button */}
          <button
            onClick={() => setShowReceipt(false)}
            className="w-full mt-6 py-4 rounded-xl font-semibold"
            style={{ background: "rgba(255,255,255,0.06)", color: "#8A9BB5" }}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // ── FAILED SCREEN ─────────────────────────────────────────────────────
  if (isFailed) {
    return (
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center px-6 pb-24"
        style={{ background: "#0B1120" }}
      >
        {/* Red X icon */}
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
          style={{ background: "rgba(239,68,68,0.12)" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "#EF4444", boxShadow: "0 0 32px rgba(239,68,68,0.4)" }}>
            <XCircle size={36} color="#fff" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-3 text-white">Transaction Failed</h1>

        <p className="text-sm text-center max-w-xs mb-2" style={{ color: "#8A9BB5" }}>
          Your transaction could not be processed at this time.
        </p>
        <p className="text-sm font-semibold mb-8" style={{ color: "#EF4444" }}>
          Please contact support for assistance.
        </p>

        {/* Reference */}
        <p className="text-xs font-mono mb-8" style={{ color: "#8A9BB5" }}>{transactionRef}</p>

        {/* Buttons */}
        <div className="w-full max-w-xs space-y-3">
          <button
            onClick={() => navigate({ to: "/" })}
            className="w-full py-4 rounded-xl font-semibold text-white"
            style={{ background: "#EF4444" }}
          >
            OK
          </button>
          <button
            onClick={() => navigate({ to: "/support" })}
            className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
            style={{ background: "rgba(255,255,255,0.06)", color: "#8A9BB5", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <FileText size={16} />
            Report This Issue
          </button>
        </div>

        <style>{`
          @keyframes scale-in {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  // ── SUCCESS SCREEN ────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 pb-24"
      style={{ background: "#0B1120" }}
    >
      {/* Green check icon */}
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6 border-2"
        style={{
          background: "rgba(0, 230, 118, 0.12)",
          borderColor: "#00E676",
          boxShadow: "0 0 32px rgba(0, 230, 118, 0.3)",
          animation: "scale-in 0.4s ease-out",
        }}
      >
        <CheckCircle2 size={48} style={{ color: "#00E676" }} />
      </div>

      <h1 className="text-2xl font-bold mb-2" style={{ color: "#FFFFFF" }}>
        {isCompleted ? "Transaction Approved" : "Transaction Submitted"}
      </h1>
      <p className="text-sm mb-8 text-center max-w-xs" style={{ color: "#7A8FA6" }}>
        {isCompleted
          ? "Your transaction has been approved and processed successfully."
          : "Your request has been received and is pending admin review."}
      </p>

      {/* Transaction summary */}
      <div
        className="w-full max-w-xs p-5 rounded-2xl border"
        style={{ background: "#111827", borderColor: "rgba(0, 230, 118, 0.2)" }}
      >
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: "#7A8FA6" }}>Amount</span>
            <span className="text-xl font-mono font-semibold" style={{ color: "#FFFFFF" }}>
              {formatCurrency(amount)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: "#7A8FA6" }}>Reference</span>
            <span className="text-sm font-mono" style={{ color: "#00C6FF" }}>{transactionRef}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: "#7A8FA6" }}>From Account</span>
            <span className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>
              {fundingAccount.charAt(0).toUpperCase() + fundingAccount.slice(1)}
            </span>
          </div>
          {recipientName && (
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "#7A8FA6" }}>Recipient</span>
              <span className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>{recipientName}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: "#7A8FA6" }}>Status</span>
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
              style={isCompleted ? {
                backgroundColor: "rgba(0,230,118,0.12)",
                borderColor: "rgba(0,230,118,0.3)",
                color: "#00E676",
              } : {
                backgroundColor: "rgba(255, 171, 0, 0.12)",
                borderColor: "rgba(255, 171, 0, 0.3)",
                color: "#FFAB00",
              }}
            >
              {isCompleted
                ? <><CheckCircle2 size={11} /> Approved</>
                : <><div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#FFAB00" }} /> Pending</>}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: "#7A8FA6" }}>Submitted</span>
            <span className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>Just now</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="w-full max-w-xs mt-6 space-y-3">
        <button
          onClick={() => navigate({ to: "/" })}
          className="w-full py-4 rounded-xl font-semibold"
          style={{ background: "linear-gradient(135deg, #00C6FF, #7B2FFF)", color: "#FFFFFF" }}
        >
          Back to Home
        </button>
        {isCompleted && (
          <button
            onClick={() => setShowReceipt(true)}
            className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
            style={{ background: "rgba(255,255,255,0.06)", color: "#8A9BB5", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <FileText size={16} />
            View Receipt
          </button>
        )}
      </div>

      <style>{`
        @keyframes scale-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
