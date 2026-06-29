import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useUserAccount } from "../dashboard/hooks/useUserAccount";
import { submitTransaction } from "../dashboard/functions/submitTransaction";
import { TransactionSuccessScreen } from "../dashboard/components/TransactionSuccessScreen";
import { BottomNav } from "../dashboard/components/BottomNav";
import { useTheme } from "../hooks/use-theme";
import { themeColors } from "../utils/theme";

export const Route = createFileRoute("/internal-transfer")({
  head: () => ({ meta: [{ title: "Internal Transfer - Nexus Bank" }] }),
  component: InternalTransfer,
});

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function InternalTransfer() {
  const navigate = useNavigate();
  const { account } = useUserAccount();
  const { theme } = useTheme();
  const t = themeColors(theme);

  const [fromAccount, setFromAccount] = useState("Checking");
  const [toAccount, setToAccount]     = useState("Savings");
  const [amount, setAmount]           = useState("");
  const [note, setNote]               = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [successData, setSuccessData] = useState<{
    amount: number; transactionRef: string; fundingAccount: string; recipientName: string; status: string;
  } | null>(null);

  const fromBalance = fromAccount === "Checking" ? account?.checkingBalance || 0 : account?.savingsBalance || 0;
  const toBalance   = toAccount   === "Checking" ? account?.checkingBalance || 0 : account?.savingsBalance || 0;

  const handleConfirm = async () => {
    if (!amount || parseFloat(amount) <= 0)    { toast.error("Please enter a valid amount"); return; }
    if (parseFloat(amount) > fromBalance)       { toast.error("Insufficient funds");          return; }
    if (fromAccount === toAccount)              { toast.error("Cannot transfer to same account"); return; }
    setLoading(true);
    try {
      const { transactionRef, status: txStatus } = await submitTransaction({
        type: "internal_transfer", subType: "between_accounts",
        description: `Internal Transfer from ${fromAccount} to ${toAccount}`,
        category: "Transfer", amount: parseFloat(amount),
        fundingAccount: fromAccount.toLowerCase() as "checking" | "savings",
        recipientName: `Your ${toAccount} Account`,
        recipientAccount: toAccount.toLowerCase(),
        toAccount: toAccount.toLowerCase(), note,
      });
      setShowConfirm(false);
      setSuccessData({ amount: parseFloat(amount), transactionRef, status: txStatus, fundingAccount: fromAccount, recipientName: `Your ${toAccount} Account` });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit transfer request");
    } finally { setLoading(false); }
  };

  if (successData) return (
    <TransactionSuccessScreen amount={successData.amount} transactionRef={successData.transactionRef}
      fundingAccount={successData.fundingAccount} recipientName={successData.recipientName}
      status={successData.status} transactionType="internal_transfer" />
  );

  return (
    <div className="min-h-screen w-full flex flex-col pb-24" style={{ background: t.pageBg }}>
      {/* Header */}
      <div className="px-5 pt-10 pb-6 flex items-center gap-4">
        <button onClick={() => navigate({ to: "/" })} className="p-2">
          <ArrowLeft size={24} style={{ color: t.textOnBg }} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center" style={{ color: t.textOnBg }}>Internal Transfer</h1>
        <div className="w-10" />
      </div>

      <div className="px-5 flex-1 space-y-6">
        {/* From */}
        <div className="p-5 rounded-2xl" style={{ background: t.cardBg, border: `1px solid ${t.border}` }}>
          <label className="block text-sm font-semibold mb-4" style={{ color: t.textMuted }}>From</label>
          <div className="flex gap-3">
            {["Checking", "Savings"].map((acc) => (
              <button key={acc} onClick={() => setFromAccount(acc)} className="flex-1 py-3 px-4 rounded-xl font-bold transition-all"
              style={{ background: fromAccount === acc ? t.accentCyan : t.inputBg, color: fromAccount === acc ? t.pageBg : t.textMuted }}>
                {acc}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm" style={{ color: t.textMuted }}>Available: ${formatCurrency(fromBalance)}</p>
        </div>

        {/* To */}
        <div className="p-5 rounded-2xl" style={{ background: t.cardBg, border: `1px solid ${t.border}` }}>
          <label className="block text-sm font-semibold mb-4" style={{ color: t.textMuted }}>To</label>
          <div className="flex gap-3">
            {["Checking", "Savings"].map((acc) => (
              <button key={acc} onClick={() => setToAccount(acc)} disabled={acc === fromAccount}
                className="flex-1 py-3 px-4 rounded-xl font-bold transition-all"
                style={{ background: toAccount === acc ? t.accentCyan : t.inputBg, color: toAccount === acc ? t.pageBg : t.textMuted, opacity: acc === fromAccount ? 0.3 : 1 }}>
                {acc}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm" style={{ color: t.textMuted }}>Current: ${formatCurrency(toBalance)}</p>
        </div>

        {/* Amount */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-2xl font-mono" style={{ color: t.textMuted }}>$</span>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00" className="text-4xl font-mono font-bold bg-transparent outline-none text-center w-48"
              style={{ color: t.textPrimary }} />
          </div>
          <button onClick={() => setAmount(fromBalance.toString())} className="text-sm font-semibold" style={{ color: t.accentCyan }}>MAX</button>
        </div>

        {/* Note */}
        <input type="text" value={note} onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note (optional)" className="w-full px-4 py-4 rounded-xl outline-none"
          style={{ background: t.inputBg, color: t.textPrimary, border: `1px solid ${t.border}` }} />

        {/* Summary */}
        {amount && parseFloat(amount) > 0 && fromAccount !== toAccount && (
          <div className="p-5 rounded-2xl" style={{ background: t.cardBg, border: `1px solid ${t.border}` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: t.textMuted }}>{fromAccount}</span>
              <span className="text-sm" style={{ color: t.textMuted }}>→</span>
              <span className="text-sm" style={{ color: t.textMuted }}>{toAccount}</span>
            </div>
          </div>
        )}
      </div>

      {/* Button */}
      <div className="px-5 pb-8">
        <button onClick={() => setShowConfirm(true)}
          disabled={!amount || parseFloat(amount) <= 0 || fromAccount === toAccount || loading}
          className="w-full py-4 rounded-xl font-semibold transition-all text-white"
          style={{ background: t.gradientBtn, opacity: !amount || parseFloat(amount) <= 0 || fromAccount === toAccount || loading ? 0.5 : 1 }}>
          {loading ? "Submitting…" : "Request Transfer"}
        </button>
      </div>

      {/* Confirm sheet */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)" }} onClick={() => setShowConfirm(false)} />
          <div className="relative w-full p-6 rounded-t-[28px]" style={{ background: t.cardBg }}>
            <div className="w-12 h-1 rounded-full mx-auto mb-6" style={{ background: t.mutedBg }} />
            <h3 className="text-xl font-bold mb-6 text-center" style={{ color: t.textPrimary }}>Confirm Transfer Request</h3>
            <div className="space-y-4 mb-8">
              {[["From", fromAccount], ["To", toAccount], ["Note", note || "No note"]].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-sm" style={{ color: t.textMuted }}>{label}</span>
                  <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>{value}</span>
                </div>
              ))}
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: t.textMuted }}>Amount</span>
                <span className="text-2xl font-mono font-bold" style={{ color: t.textPrimary }}>${formatCurrency(parseFloat(amount))}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setShowConfirm(false)} className="py-4 rounded-xl font-semibold"
                style={{ background: t.inputBg, color: t.textMuted }}>Cancel</button>
              <button onClick={handleConfirm} disabled={loading}
                className="py-4 rounded-xl font-semibold text-white"
                style={{ background: t.gradientBtn, opacity: loading ? 0.6 : 1 }}>
                {loading ? "Submitting…" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
