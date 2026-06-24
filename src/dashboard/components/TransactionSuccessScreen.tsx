import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { formatCurrency } from "../../utils/formatCurrency";

interface TransactionSuccessScreenProps {
  amount: number;
  transactionRef: string;
  fundingAccount: string;
  recipientName?: string;
  /** Kept for backward-compat — no longer used */
  saveBeneficiary?: unknown;
}

export function TransactionSuccessScreen({
  amount,
  transactionRef,
  fundingAccount,
  recipientName,
}: TransactionSuccessScreenProps) {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 pb-24"
      style={{ background: "#0B1120" }}
    >
      {/* Success icon */}
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
        Transaction Submitted
      </h1>
      <p className="text-sm mb-8 text-center max-w-xs" style={{ color: "#7A8FA6" }}>
        Your request has been received and is pending admin review.
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
              <span className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>
                {recipientName}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: "#7A8FA6" }}>Status</span>
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
              style={{
                backgroundColor: "rgba(255, 171, 0, 0.12)",
                borderColor: "rgba(255, 171, 0, 0.3)",
                color: "#FFAB00",
              }}
            >
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#FFAB00" }} />
              Pending
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: "#7A8FA6" }}>Submitted</span>
            <span className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>Just now</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="w-full max-w-xs mt-6">
        <button
          onClick={() => navigate({ to: "/" })}
          className="w-full py-4 rounded-xl font-semibold"
          style={{ background: "linear-gradient(135deg, #00C6FF, #7B2FFF)", color: "#FFFFFF" }}
        >
          Back to Home
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
