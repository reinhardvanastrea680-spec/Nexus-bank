import { CheckCircle2 } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

interface ApproveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  transaction: {
    userFullName: string;
    userEmail: string;
    amount: number;
    type: string;
    fundingAccount: string;
    balanceAtSubmission: number;
  };
  loading?: boolean;
}

export function ApproveConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  transaction,
  loading = false,
}: ApproveConfirmModalProps) {
  if (!isOpen) return null;

  const balanceAfter = transaction.balanceAtSubmission - transaction.amount;
  const isLowBalance = balanceAfter < transaction.amount * 0.1;

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
          borderColor: "rgba(0, 230, 118, 0.15)",
        }}
      >
        <div className="mb-6 flex flex-col items-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-3 border-2"
            style={{
              background: "rgba(0, 230, 118, 0.1)",
              borderColor: "rgba(0, 230, 118, 0.3)",
            }}
          >
            <CheckCircle2 size={32} style={{ color: "#00E676" }} />
          </div>
          <h2 className="text-xl font-bold" style={{ color: "#FFFFFF" }}>
            Approve Transaction?
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
                style={{ color: "#00E676" }}
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
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "#7A8FA6" }}>
                From
              </span>
              <span className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>
                {transaction.fundingAccount.charAt(0).toUpperCase() + transaction.fundingAccount.slice(1)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "#7A8FA6" }}>
                Balance at submission
              </span>
              <span className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>
                {formatCurrency(transaction.balanceAtSubmission)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "#7A8FA6" }}>
                Balance after deduction
              </span>
              <span
                className="text-sm font-semibold"
                style={{ color: isLowBalance ? "#FFAB00" : "#FFFFFF" }}
              >
                {formatCurrency(balanceAfter)}
              </span>
            </div>
          </div>
        </div>

        <p
          className="text-xs mb-6 text-center"
          style={{ color: "#7A8FA6" }}
        >
          Approving will immediately deduct {formatCurrency(transaction.amount)} from the user's{" "}
          {transaction.fundingAccount} account. This action cannot be undone.
        </p>

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
            onClick={onConfirm}
            disabled={loading}
            className="py-3 rounded-xl font-semibold"
            style={{
              background: "#00E676",
              color: "#0B1120",
            }}
          >
            {loading ? "Processing…" : "Confirm Approval"}
          </button>
        </div>
      </div>
    </div>
  );
}
