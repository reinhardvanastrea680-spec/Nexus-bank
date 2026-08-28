import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "../hooks/use-theme";
import { themeColors } from "../utils/theme";
import { BottomNav } from "../dashboard/components/BottomNav";
import { useUserAccount } from "../dashboard/hooks/useUserAccount";
import { submitTransaction } from "../dashboard/functions/submitTransaction";
import { TransactionSuccessScreen } from "../dashboard/components/TransactionSuccessScreen";
import { PinInputModal } from "../dashboard/components/PinInputModal";
import { useCustomAccounts } from "../dashboard/hooks/useCustomAccounts";
import { getAllAccountOptions, getAccountBalance } from "../utils/accountHelpers";

export const Route = createFileRoute("/local-transfer")({
  head: () => ({ meta: [{ title: "Local Transfer - Nexsus Bank" }] }),
  component: LocalTransfer,
});

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatAmountDisplay(val: string): string {
  const clean = val.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
  const [int, dec] = clean.split(".");
  const formatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return dec !== undefined ? `${formatted}.${dec}` : formatted;
}

function LocalTransfer() {
  const { theme } = useTheme();
  const t = themeColors(theme);
  const navigate = useNavigate();
  const { account } = useUserAccount();
  const { customAccounts } = useCustomAccounts(account?.id);

  const allAccountOptions = getAllAccountOptions(account, customAccounts);

  const [step, setStep] = useState(1);

  // ── Step 1 fields ───────────────────────────────────────────────────
  const [bankName, setBankName]           = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [bankAddress, setBankAddress]     = useState("");
  const [homeAddress, setHomeAddress]     = useState("");

  // ── Step 2 fields ───────────────────────────────────────────────────
  const [amount, setAmount]               = useState("");
  const [note, setNote]                   = useState("");
  const [sourceAccount, setSourceAccount] = useState("checking");

  const [loading, setLoading]             = useState(false);
  const [showPinModal, setShowPinModal]   = useState(false);
  const [pinError, setPinError]           = useState("");

  const fromBalance = getAccountBalance(sourceAccount, allAccountOptions);

  const [successData, setSuccessData] = useState<{
    amount: number;
    transactionRef: string;
    fundingAccount: string;
    recipientName: string;
    status: string;
    saveBeneficiary?: {
      fullName: string;
      bankName: string;
      bankId: string;
      accountNumber: string;
    };
  } | null>(null);

  // Step 1 is valid when all required fields are filled
  const step1Valid =
    bankName.trim().length > 0 &&
    accountNumber.trim().length > 0 &&
    routingNumber.trim().length > 0 &&
    recipientName.trim().length > 0 &&
    bankAddress.trim().length > 0 &&
    homeAddress.trim().length > 0;

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount.replace(/,/g, "")) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (parseFloat(amount.replace(/,/g, "")) > fromBalance) {
      toast.error("Insufficient funds");
      return;
    }
    setShowPinModal(true);
  };

  const handlePinSubmit = async (enteredPin: string) => {
    if (!account?.transactionPin) {
      setPinError("No PIN set for this account. Please contact support.");
      return;
    }
    if (enteredPin !== account.transactionPin) {
      setPinError("Incorrect PIN. Please try again.");
      return;
    }

    setPinError("");
    setLoading(true);
    try {
      const { transactionRef, status: txStatus } = await submitTransaction({
        type: "local_transfer",
        subType: "outgoing",
        description: `Local Transfer to ${recipientName} (${bankName})`,
        category: "Transfer",
        amount: parseFloat(amount.replace(/,/g, "")),
        fundingAccount: sourceAccount as "checking" | "savings",
        recipientName,
        recipientAccount: accountNumber,
        recipientBank: bankName,
        toBank: bankName,
        toCountry: "",
        toAccountNumber: accountNumber,
        toSwiftCode: "",
        toRoutingNumber: routingNumber,
        note,
      });

      setShowPinModal(false);
      setSuccessData({
        amount: parseFloat(amount.replace(/,/g, "")),
        transactionRef,
        status: txStatus,
        fundingAccount: sourceAccount,
        recipientName,
        saveBeneficiary: {
          fullName: recipientName,
          bankName,
          bankId: `manual_${bankName.toLowerCase().replace(/\s+/g, "_")}`,
          accountNumber,
        },
      });
    } catch (err) {
      console.error(err);
      setPinError(err instanceof Error ? err.message : "Failed to submit transfer");
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
        recipientName={successData.recipientName}
        status={successData.status}
        transactionType="local_transfer"
        saveBeneficiary={successData.saveBeneficiary}
      />
    );
  }

  const inputStyle = {
    background: t.inputBg,
    color: t.textPrimary,
  };

  const labelStyle: React.CSSProperties = {
    color: t.textMutedOnBg,
    fontSize: "0.8125rem",
    fontWeight: 600,
    marginBottom: "0.375rem",
    display: "block",
  };

  return (
    <div className="min-h-screen w-full flex flex-col pb-24" style={{ background: t.pageBg }}>
      {/* Header */}
      <div className="px-5 pt-10 pb-6 flex items-center gap-4">
        <button
          onClick={() => (step > 1 ? setStep(1) : navigate({ to: "/" }))}
          className="p-2"
        >
          <ArrowLeft size={24} style={{ color: t.textOnBg }} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center" style={{ color: t.textOnBg }}>
          Local Transfer
        </h1>
        <div className="w-10" />
      </div>

      {/* Step indicator */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-center gap-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className="h-2 rounded-full transition-all"
              style={{
                width: s === step ? 24 : 8,
                background: s <= step ? t.accentCyan : t.inputBg,
              }}
            />
          ))}
        </div>
      </div>

      <div className="px-5 flex-1 space-y-4">

        {/* ── Step 1: Recipient details ── */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm font-semibold" style={{ color: t.textMutedOnBg }}>
              Enter recipient & bank details
            </p>

            {/* 1. Name of Bank */}
            <div>
              <label style={labelStyle}>Name of Bank *</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. JPMorgan Chase Bank"
                className="w-full px-4 py-4 rounded-xl outline-none"
                style={inputStyle}
              />
            </div>

            {/* 2. Account Number */}
            <div>
              <label style={labelStyle}>Account Number *</label>
              <input
                type="text"
                inputMode="numeric"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter account number"
                className="w-full px-4 py-4 rounded-xl outline-none font-mono"
                style={inputStyle}
              />
            </div>

            {/* 3. Routing Number */}
            <div>
              <label style={labelStyle}>Routing Number *</label>
              <input
                type="text"
                inputMode="numeric"
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value)}
                placeholder="e.g. 021000021"
                className="w-full px-4 py-4 rounded-xl outline-none font-mono"
                style={inputStyle}
              />
            </div>

            {/* 4. Beneficiary Name */}
            <div>
              <label style={labelStyle}>Beneficiary Name *</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Full name of recipient"
                className="w-full px-4 py-4 rounded-xl outline-none"
                style={inputStyle}
              />
            </div>

            {/* 5. Bank Address */}
            <div>
              <label style={labelStyle}>Bank Address *</label>
              <input
                type="text"
                value={bankAddress}
                onChange={(e) => setBankAddress(e.target.value)}
                placeholder="Bank's full address"
                className="w-full px-4 py-4 rounded-xl outline-none"
                style={inputStyle}
              />
            </div>

            {/* 6. Home Address */}
            <div>
              <label style={labelStyle}>Home Address *</label>
              <input
                type="text"
                value={homeAddress}
                onChange={(e) => setHomeAddress(e.target.value)}
                placeholder="Recipient's home address"
                className="w-full px-4 py-4 rounded-xl outline-none"
                style={inputStyle}
              />
            </div>
          </div>
        )}

        {/* ── Step 2: Amount ── */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="relative inline-flex items-center gap-2">
                <span className="text-3xl font-mono" style={{ color: t.textMuted }}>$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(formatAmountDisplay(e.target.value))}
                  placeholder="0.00"
                  className="text-5xl font-mono font-bold bg-transparent outline-none text-center w-48"
                  style={{ color: t.textPrimary }}
                />
              </div>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="text-sm" style={{ color: t.textMuted }}>
                  Available: ${formatCurrency(fromBalance)}
                </span>
                <button
                  onClick={() => setAmount(formatAmountDisplay(fromBalance.toFixed(2)))}
                  className="text-sm font-semibold"
                  style={{ color: t.accentCyan }}
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Source Account */}
            <div className="space-y-2">
              <label className="text-sm font-semibold" style={{ color: t.textMuted }}>
                Source Account
              </label>
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                {allAccountOptions.map((acc) => (
                  <button
                    key={acc.value}
                    onClick={() => setSourceAccount(acc.value)}
                    className="py-3 px-2 rounded-xl font-bold transition-all text-xs truncate"
                    style={{
                      background: sourceAccount === acc.value ? t.accentCyan : t.inputBg,
                      color: sourceAccount === acc.value ? t.pageBg : t.textMuted,
                    }}
                    title={`${acc.label} - $${formatCurrency(acc.balance)}`}
                  >
                    {acc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <label className="text-sm font-semibold" style={{ color: t.textMuted }}>
                Note (Optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's this for?"
                className="w-full px-4 py-4 rounded-xl outline-none"
                style={{ background: t.inputBg, color: t.textPrimary }}
              />
            </div>

            {/* Summary */}
            <div className="p-5 rounded-2xl" style={{ background: t.cardBg }}>
              <div className="flex justify-between mb-2">
                <span className="text-sm" style={{ color: t.textMuted }}>Transfer to</span>
                <span className="text-sm font-semibold text-right" style={{ color: t.textPrimary }}>
                  {recipientName} — {bankName}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm" style={{ color: t.textMuted }}>Routing</span>
                <span className="text-sm font-mono" style={{ color: t.textPrimary }}>
                  {routingNumber}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm" style={{ color: t.textMuted }}>Transfer fee</span>
                <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>$0.00</span>
              </div>
              <hr style={{ borderColor: "rgba(255,255,255,0.07)" }} className="my-3" />
              <div className="flex justify-between">
                <span className="font-bold" style={{ color: t.textPrimary }}>Total</span>
                <span className="text-xl font-mono font-bold" style={{ color: t.accentCyan }}>
                  ${parseFloat((amount || "0").replace(/,/g, "")).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="px-5 pb-8 mt-6">
        {step === 2 ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setStep(1)}
              className="py-4 rounded-xl font-semibold"
              style={{ background: t.inputBg, color: t.textMuted }}
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!amount || parseFloat(amount.replace(/,/g, "")) <= 0 || loading}
              className="py-4 rounded-xl font-semibold transition-all"
              style={{
                background: "linear-gradient(135deg, #38BDF8, #6366F1)",
                color: "#fff",
                opacity:
                  !amount || parseFloat(amount.replace(/,/g, "")) <= 0 || loading ? 0.5 : 1,
              }}
            >
              {loading ? "Submitting…" : "Confirm Transfer"}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setStep(2)}
            disabled={!step1Valid}
            className="w-full py-4 rounded-xl font-semibold transition-all"
            style={{
              background: "linear-gradient(135deg, #38BDF8, #6366F1)",
              color: "#fff",
              opacity: !step1Valid ? 0.5 : 1,
            }}
          >
            Continue
          </button>
        )}
      </div>

      {/* PIN Modal */}
      <PinInputModal
        isOpen={showPinModal}
        onClose={() => {
          setShowPinModal(false);
          setPinError("");
        }}
        onSubmit={handlePinSubmit}
        loading={loading}
        externalError={pinError}
      />

      <BottomNav />
    </div>
  );
}
