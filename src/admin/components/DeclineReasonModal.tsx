import { XCircle } from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "../../utils/formatCurrency";

interface DeclineReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  transaction: {
    userFullName: string;
    userEmail: string;
    amount: number;
    type: string;
  };
  loading?: boolean;
}

export function DeclineReasonModal({
  isOpen,
  onClose,
  onConfirm,
  transaction,
  loading = false,
}: DeclineReasonModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!reason.trim() || reason.length < 5) {
      setError("A reason of at least 5 characters is required");
      return;
    }
    setError(null);
    await onConfirm(reason.trim());
    setReason("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-sm rounded-3xl border p-6"
        style={{
          background: "#0D1625",
          borderColor: "rgba(255, 23, 68, 0.15)",
        }}
      >
        <div className="mb-6 flex flex-col items-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-3 border-2"
            style={{
              background: "rgba(255, 23, 68, 0.1)",
              borderColor: "rgba(255, 23, 68, 0.3)",
            }}
          >
            <XCircle size={32} style={{ color: "#FF1744" }} />
          </div>
          <h2 className="text-xl font-bold" style={{ color: "#FFFFFF" }}>
            Decline Transaction?
          </h2>
        </div>

        {/* Transaction summary */}
        <div
          className="mb-6 p-4 rounded-2xl"
          style={{ background: "#111827" }}
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "#7A8FA6" }}>
                User
              </span>
              <span className="text-sm font-semibold text-right" style={{ color: "#FFFFFF" }}>
                {transaction.userFullName}
                <br />
                <span className="text-xs" style={{ color: "#7A8FA6" }}>
                  {transaction.userEmail}
                </span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "#7A8FA6" }}>
                Amount
              </span>
              <span
                className="text-xl font-mono font-bold"
                style={{ color: "#FF1744" }}
              >
                {formatCurrency(transaction.amount)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "#7A8FA6" }}>
                Type
              </span>
              <span className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>
                {transaction.type.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        </div>

        {/* Reason input */}
        <div className="mb-4">
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: "#FFFFFF" }}
          >
            Reason for Declining *
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Explain why this transaction is being declined. The user will see this message."
            rows={4}
            maxLength={500}
            className="w-full px-4 py-3 rounded-xl border text-sm resize-none outline-none"
            style={{
              background: "#1A2438",
              color: "#FFFFFF",
              borderColor: error ? "#FF1744" : "rgba(255,255,255,0.1)",
            }}
          />
          <div className="mt-1 flex justify-between text-xs" style={{ color: "#7A8FA6" }}>
            {error ? (
              <span style={{ color: "#FF1744" }}>{error}</span>
            ) : null}
            <span>{reason.length}/500</span>
          </div>
        </div>

        {/* Preview box */}
        {reason.trim() && (
          <div
            className="mb-6 p-3 rounded-xl border"
            style={{
              background: "rgba(255, 23, 68, 0.06)",
              borderColor: "rgba(255, 23, 68, 0.15)",
            }}
          >
            <p className="text-xs font-semibold mb-1" style={{ color: "#FF1744" }}>
              User will see:
            </p>
            <p className="text-sm italic" style={{ color: "#7A8FA6" }}>
              {reason.trim()}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="py-3 rounded-xl font-semibold"
            style={{ background: "#1A2438", color: "#7A8FA6" }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="py-3 rounded-xl font-semibold"
            style={{
              background: "#FF1744",
              color: "#FFFFFF",
            }}
          >
            {loading ? "Processing…" : "Confirm Decline"}
          </button>
        </div>
      </div>
    </div>
  );
}
