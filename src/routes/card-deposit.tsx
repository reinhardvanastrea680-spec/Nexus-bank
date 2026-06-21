import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  CreditCard,
  Settings,
  Bell,
  Home as HomeIcon,
  History,
  Headphones,
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "../hooks/use-theme";
import { themeColors } from "../utils/theme";
import { BottomNav } from "../dashboard/components/BottomNav";
import { useUserAccount } from "../dashboard/hooks/useUserAccount";
import { submitTransaction } from "../dashboard/functions/submitTransaction";
import { TransactionSuccessScreen } from "../dashboard/components/TransactionSuccessScreen";

export const Route = createFileRoute("/card-deposit")({
  head: () => ({ meta: [{ title: "Card Deposit - Nexus Bank" }] }),
  component: CardDeposit,
});

const savedCards = [
  { id: "1", brand: "Visa", last4: "4242", expiry: "12/26", color: "#1A6FED" },
  { id: "2", brand: "Mastercard", last4: "5555", expiry: "09/25", color: "#EB001B" },
];

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function CardDeposit() {
  
  const { theme } = useTheme();
  const t = themeColors(theme);
  const { account } = useUserAccount();

  const [selectedCardId, setSelectedCardId] = useState<string | null>(savedCards[0]?.id ?? null);
  const [amount, setAmount] = useState("");
  const [destinationAccount, setDestinationAccount] = useState<"Checking" | "Savings">("Checking");
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{
    amount: number;
    transactionRef: string;
    fundingAccount: string;
  } | null>(null);

  const selectedCard = savedCards.find((c) => c.id === selectedCardId);

  const handleContinue = () => {
    if (!selectedCardId) {
      toast.error("Please select a card");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      const { transactionRef } = await submitTransaction({
        type: "check_deposit",
        subType: "card_deposit",
        description: `Card Deposit — ${selectedCard?.brand} ****${selectedCard?.last4}`,
        category: "Deposit",
        amount: parseFloat(amount),
        fundingAccount: destinationAccount.toLowerCase() as "checking" | "savings",
        toAccount: destinationAccount,
        note: `Card: ${selectedCard?.brand} ****${selectedCard?.last4}`,
      });

      setSuccessData({
        amount: parseFloat(amount),
        transactionRef,
        fundingAccount: destinationAccount,
      });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Deposit failed");
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <TransactionSuccessScreen
        amount={successData.amount}
        transactionRef={successData.transactionRef}
        fundingAccount={successData.fundingAccount}
      />
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col pb-24" style={{ background: t.pageBg }}>
      {/* Header */}
      <div className="px-5 pt-10 pb-6 flex items-center gap-4">
        <button onClick={() => navigate({ to: "/" })} className="p-2">
          <ArrowLeft size={24} style={{ color: t.textPrimary }} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center" style={{ color: t.textPrimary }}>
          Card Deposit
        </h1>
        <div className="w-10" />
      </div>

      <div className="px-5 flex-1 space-y-6">
        {/* Select Card */}
        <div>
          <label className="block text-sm font-semibold mb-3" style={{ color: t.textMuted }}>
            Select Card
          </label>
          <div className="space-y-3">
            {savedCards.map((card) => (
              <button
                key={card.id}
                onClick={() => setSelectedCardId(card.id)}
                className="w-full p-4 rounded-2xl text-left transition-all flex items-center gap-4"
                style={{
                  background: t.cardBg,
                  border:
                    selectedCardId === card.id
                      ? "2px solid #38BDF8"
                      : "1px solid rgba(255,255,255,0.07)",
                  boxShadow:
                    selectedCardId === card.id ? "0 0 0 3px rgba(56,189,248,0.15)" : "none",
                }}
              >
                <div
                  className="w-12 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: card.color }}
                >
                  <CreditCard size={18} style={{ color: t.textPrimary }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                    {card.brand} ••••{card.last4}
                  </p>
                  <p className="text-xs" style={{ color: t.textMuted }}>
                    Expires {card.expiry}
                  </p>
                </div>
                {selectedCardId === card.id && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: "#38BDF8" }}
                  >
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </button>
            ))}

            {/* Add new card placeholder */}
            <button
              className="w-full p-4 rounded-2xl text-center border-2 border-dashed transition-all"
              style={{ borderColor: "rgba(56,189,248,0.3)", color: t.accentCyan }}
              onClick={() => toast.info("Card management coming soon")}
            >
              <span className="text-sm font-semibold">+ Add New Card</span>
            </button>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-semibold mb-3" style={{ color: t.textMuted }}>
            Deposit Amount
          </label>
          <div className="flex items-center justify-center gap-2 py-6 rounded-2xl" style={{ background: t.cardBg }}>
            <span className="text-3xl font-mono" style={{ color: t.textMuted }}>$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="text-4xl font-mono font-bold bg-transparent outline-none text-center w-48"
              style={{ color: t.textPrimary }}
            />
          </div>
          <div className="flex justify-center gap-3 mt-3">
            {[100, 500, 1000, 5000].map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset.toString())}
                className="px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: t.inputBg, color: t.accentCyan }}
              >
                ${preset.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Deposit To */}
        <div>
          <label className="block text-sm font-semibold mb-3" style={{ color: t.textMuted }}>
            Deposit To
          </label>
          <div className="flex gap-3">
            {(["Checking", "Savings"] as const).map((acc) => (
              <button
                key={acc}
                onClick={() => setDestinationAccount(acc)}
                className="flex-1 py-3 px-4 rounded-xl font-bold transition-all"
                style={{
                  background: destinationAccount === acc ? "#38BDF8" : "#1A2438",
                  color: destinationAccount === acc ? t.pageBg : "#8A9BB5",
                }}
              >
                {acc}
              </button>
            ))}
          </div>
          <p className="text-xs mt-2 text-center" style={{ color: t.textMuted }}>
            Current:{" "}
            ${formatCurrency(
              destinationAccount === "Checking"
                ? account?.checkingBalance || 0
                : account?.savingsBalance || 0
            )}
          </p>
        </div>

        {/* Info */}
        <div
          className="p-4 rounded-2xl"
          style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)" }}
        >
          <p className="text-xs text-center" style={{ color: t.textMuted }}>
            Card deposits are subject to admin review. Funds will be credited once approved.
          </p>
        </div>
      </div>

      {/* Continue Button */}
      <div className="px-5 pb-8">
        <button
          onClick={handleContinue}
          disabled={!selectedCardId || !amount || parseFloat(amount) <= 0 || loading}
          className="w-full py-4 rounded-xl font-semibold transition-all"
          style={{
            background: "linear-gradient(135deg, #38BDF8, #6366F1)",
            color: t.textPrimary,
            opacity: !selectedCardId || !amount || parseFloat(amount) <= 0 || loading ? 0.5 : 1,
          }}
        >
          Continue
        </button>
      </div>

      {/* Confirmation Bottom Sheet */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setShowConfirm(false)}
          />
          <div className="relative w-full p-6 rounded-t-[28px]" style={{ background: t.cardBg }}>
            <div className="w-12 h-1 rounded-full mx-auto mb-6" style={{ background: t.mutedBg }} />
            <h3 className="text-xl font-bold mb-6 text-center" style={{ color: t.textPrimary }}>
              Confirm Deposit
            </h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: t.textMuted }}>Card</span>
                <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                  {selectedCard?.brand} ••••{selectedCard?.last4}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: t.textMuted }}>Amount</span>
                <span className="text-xl font-mono font-bold" style={{ color: t.textPrimary }}>
                  ${formatCurrency(parseFloat(amount))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: t.textMuted }}>Deposit To</span>
                <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                  {destinationAccount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: t.textMuted }}>Status</span>
                <span className="text-sm font-semibold" style={{ color: t.accentYellow }}>
                  Pending Admin Review
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="py-4 rounded-xl font-semibold"
                style={{ background: t.inputBg, color: t.textMuted }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="py-4 rounded-xl font-semibold"
                style={{
                  background: "linear-gradient(135deg, #38BDF8, #6366F1)",
                  color: t.textPrimary,
                  opacity: loading ? 0.6 : 1,
                }}
              >
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
