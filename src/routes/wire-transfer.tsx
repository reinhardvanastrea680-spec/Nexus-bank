import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
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

export const Route = createFileRoute("/wire-transfer")({
  head: () => ({ meta: [{ title: "Wire Transfer - Nexus Bank" }] }),
  component: WireTransferWizard,
});

const countries = [
  { code: "US", name: "United States" },
  { code: "DE", name: "Germany" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "JP", name: "Japan" },
  { code: "CH", name: "Switzerland" },
];

const currencies = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CHF", name: "Swiss Franc" },
];

function WireTransferWizard() {
  
  const { theme } = useTheme();
  const t = themeColors(theme);
  const navigate = useNavigate();
  const { account } = useUserAccount();
  const [step, setStep] = useState(1);

  // Form data
  const [useSaved, setUseSaved] = useState(true);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<string | null>(null);
  const [beneficiary, setBeneficiary] = useState({
    fullName: "",
    bankName: "",
    bankCountry: "",
    swiftCode: "",
    accountNumber: "",
    routingNumber: "",
  });
  const [transfer, setTransfer] = useState({
    src: "Checking",
    amount: "",
    toCurrency: "EUR",
  });
  const [purpose, setPurpose] = useState("");
  const [otherPurposeText, setOtherPurposeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    amount: number;
    transactionRef: string;
    fundingAccount: string;
    recipientName: string;
    status: string;
    recipientBank: string;
    recipientRegion: string;
  } | null>(null);

  // Mock saved beneficiaries
  const savedBeneficiaries = [
    { id: "1", nickname: "John Doe", bankName: "Deutsche Bank", country: "Germany", cc: "DE" },
    { id: "2", nickname: "Sarah Smith", bankName: "Barclays", country: "United Kingdom", cc: "GB" },
  ];

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        if (useSaved) {
          if (!selectedBeneficiary) {
            toast.error("Please select a beneficiary");
            return false;
          }
        } else {
          if (!beneficiary.fullName.trim()) {
            toast.error("Please enter full name");
            return false;
          }
          if (!beneficiary.bankName.trim()) {
            toast.error("Please enter bank name");
            return false;
          }
          if (!beneficiary.bankCountry) {
            toast.error("Please select bank country");
            return false;
          }
          if (!beneficiary.swiftCode.trim()) {
            toast.error("Please enter SWIFT/BIC code");
            return false;
          }
          if (!beneficiary.accountNumber.trim()) {
            toast.error("Please enter account number");
            return false;
          }
          if (beneficiary.bankCountry === "US" && !beneficiary.routingNumber.trim()) {
            toast.error("Please enter routing number");
            return false;
          }
        }
        return true;
      case 2:
        if (!transfer.amount || parseFloat(transfer.amount) <= 0) {
          toast.error("Please enter a valid amount");
          return false;
        }
        return true;
      case 3:
        if (!purpose) {
          toast.error("Please select a purpose");
          return false;
        }
        if (purpose === "other" && !otherPurposeText.trim()) {
          toast.error("Please specify the purpose");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const next = () => {
    if (validateStep(step)) {
      setStep((p) => Math.min(p + 1, 6));
    }
  };
  const back = () => (step > 1 ? setStep((p) => p - 1) : navigate({ to: "/" }));

  const handleSubmit = async () => {
    if (!transfer.amount || parseFloat(transfer.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const fromBalance =
      transfer.src === "Checking" ? account?.checkingBalance || 0 : account?.savingsBalance || 0;
    const totalAmount = parseFloat(transfer.amount) + 25; // Add fee
    if (totalAmount > fromBalance) {
      toast.error("Insufficient funds");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const selectedBen = useSaved
        ? savedBeneficiaries.find((b) => b.id === selectedBeneficiary)
        : null;
      const recipientFullName = selectedBen?.nickname || beneficiary.fullName;
      const bankName = selectedBen?.bankName || beneficiary.bankName;
      const bankCountry = selectedBen?.country || beneficiary.bankCountry;

      const { transactionRef, status: txStatus } = await submitTransaction({
        type: "wire_transfer",
        subType: "outgoing",
        description: `Wire Transfer to ${recipientFullName} (${bankName}, ${bankCountry})`,
        category: "Transfer",
        amount: parseFloat(transfer.amount),
        fundingAccount: transfer.src.toLowerCase() as "checking" | "savings",
        recipientName: recipientFullName,
        recipientBank: bankName,
        toBank: bankName,
        toCountry: bankCountry,
        toAccountNumber: beneficiary.accountNumber,
        toSwiftCode: beneficiary.swiftCode,
        toRoutingNumber: beneficiary.routingNumber,
        toCurrency: transfer.toCurrency,
        purpose: purpose === "other" ? otherPurposeText : purpose,
        fee: 25,
      });

      setSuccessData({
        amount: parseFloat(transfer.amount),
        transactionRef,
        fundingAccount: transfer.src,
        recipientName: recipientFullName,
        status: txStatus,
        recipientBank: bankName,
        recipientRegion: bankCountry,
      });
      setStep(6);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to submit transfer request");
      toast.error(err.message || "Failed to submit transfer request");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatAmountDisplay = (val: string): string => {
    const clean = val.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
    const [int, dec] = clean.split(".");
    const formatted = (int || "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return dec !== undefined ? `${formatted}.${dec}` : formatted;
  };

  // Show success screen as full-page takeover
  if (successData) {
    return (
      <TransactionSuccessScreen
        amount={successData.amount}
        transactionRef={successData.transactionRef}
        fundingAccount={successData.fundingAccount}
        recipientName={successData.recipientName}
        status={successData.status}
        transactionType="wire_transfer"
        recipientBank={successData.recipientBank}
        recipientRegion={successData.recipientRegion}
      />
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col pb-24" style={{ background: t.pageBg }}>
      {/* Header */}
      <div className="px-5 pt-10 pb-6 flex items-center gap-4">
        <button onClick={back} className="p-2">
          <ArrowLeft size={24} style={{ color: t.textPrimary }} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center" style={{ color: t.textPrimary }}>
          Wire Transfer
        </h1>
        <div className="w-10" />
      </div>

      {/* Step Indicator */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
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

      <div className="px-5 flex-1 space-y-6">
        {/* Step 1: Beneficiary */}
        {step === 1 && (
          <>
            <div className="flex gap-3">
              <button
                onClick={() => setUseSaved(true)}
                className="flex-1 py-4 rounded-xl font-semibold transition-all"
                style={{
                  background: useSaved ? t.gradientBtn : t.inputBg,
                  color: useSaved ? "#FFFFFF" : t.textMuted,
                  border: useSaved ? "none" : `1px solid ${t.border}`,
                }}
              >
                Saved Beneficiary
              </button>
              <button
                onClick={() => setUseSaved(false)}
                className="flex-1 py-4 rounded-xl font-semibold transition-all"
                style={{
                  background: !useSaved ? t.gradientBtn : t.inputBg,
                  color: !useSaved ? "#FFFFFF" : t.textMuted,
                  border: !useSaved ? "none" : `1px solid ${t.border}`,
                }}
              >
                New Recipient
              </button>
            </div>

            {useSaved ? (
              <div className="space-y-3">
                {savedBeneficiaries.length === 0 ? (
                  <div className="p-6 rounded-2xl text-center" style={{ background: t.cardBg }}>
                    <p className="text-sm font-semibold mb-2" style={{ color: t.textPrimary }}>
                      No saved beneficiaries
                    </p>
                    <p className="text-xs" style={{ color: t.textMuted }}>
                      Switch to New Recipient to add one.
                    </p>
                  </div>
                ) : (
                  savedBeneficiaries.map((ben) => (
                    <button
                      key={ben.id}
                      onClick={() => setSelectedBeneficiary(ben.id)}
                      className="w-full p-4 rounded-2xl text-left transition-all"
                      style={{
                        background: t.cardBg,
                        border:
                          selectedBeneficiary === ben.id
                            ? "2px solid #38BDF8"
                            : "1px solid rgba(255,255,255,0.07)",
                        boxShadow:
                          selectedBeneficiary === ben.id
                            ? "0 0 0 3px rgba(56,189,248,0.15)"
                            : "none",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                          style={{ background: "#38BDF8", color: t.pageBg }}
                        >
                          {ben.cc}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                            {ben.nickname}
                          </p>
                          <p className="text-xs" style={{ color: t.textMuted }}>
                            {ben.bankName} · {ben.country}
                          </p>
                        </div>
                        {selectedBeneficiary === ben.id && (
                          <CheckCircle2 size={20} style={{ color: t.accentCyan }} />
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  { k: "fullName", label: "Full Legal Name", ph: "John Doe" },
                  { k: "bankName", label: "Bank Name", ph: "Deutsche Bank AG" },
                  { k: "swiftCode", label: "SWIFT / BIC", ph: "DEUTDEDB" },
                  { k: "accountNumber", label: "IBAN / Account", ph: "DE89370400440532013000" },
                ].map(({ k, label, ph }) => (
                  <div key={k}>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: t.textMuted }}
                    >
                      {label}
                    </label>
                    <input
                      type="text"
                      value={(beneficiary as any)[k]}
                      placeholder={ph}
                      className="w-full px-4 py-4 rounded-xl outline-none"
                      style={{ background: t.inputBg, color: t.textPrimary }}
                      onFocus={(e) => (e.target.style.borderColor = "#38BDF8")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                      onChange={(e) => setBeneficiary({ ...beneficiary, [k]: e.target.value })}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: t.textMuted }}>
                    Bank Country
                  </label>
                  <select
                    value={beneficiary.bankCountry}
                    className="w-full px-4 py-4 rounded-xl outline-none appearance-none"
                    style={{ background: t.inputBg, color: t.textPrimary }}
                    onChange={(e) =>
                      setBeneficiary({ ...beneficiary, bankCountry: e.target.value })
                    }
                  >
                    <option value="">Select country</option>
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                {beneficiary.bankCountry === "US" && (
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: t.textMuted }}
                    >
                      Routing Number
                    </label>
                    <input
                      type="text"
                      value={beneficiary.routingNumber}
                      placeholder="021000021"
                      className="w-full px-4 py-4 rounded-xl outline-none"
                      style={{ background: t.inputBg, color: t.textPrimary }}
                      onChange={(e) =>
                        setBeneficiary({ ...beneficiary, routingNumber: e.target.value })
                      }
                    />
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Step 2: Transfer Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: t.textMuted }}>
                Source Account
              </label>
              <select
                value={transfer.src}
                className="w-full px-4 py-4 rounded-xl outline-none appearance-none"
                style={{ background: t.inputBg, color: t.textPrimary }}
                onChange={(e) => setTransfer({ ...transfer, src: e.target.value })}
              >
                <option value="Checking">Checking Account</option>
                <option value="Savings">Savings Account</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: t.textMuted }}>
                Amount (USD)
              </label>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-mono"
                  style={{ color: t.textMuted }}
                >
                  $
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  min="0"
                  value={transfer.amount ? formatAmountDisplay(transfer.amount) : ""}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-4 rounded-xl outline-none text-xl font-mono"
                  style={{ background: t.inputBg, color: t.textPrimary }}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/,/g, "").replace(/[^0-9.]/g, "");
                    setTransfer({ ...transfer, amount: raw });
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: t.textMuted }}>
                Destination Currency
              </label>
              <select
                value={transfer.toCurrency}
                className="w-full px-4 py-4 rounded-xl outline-none appearance-none"
                style={{ background: t.inputBg, color: t.textPrimary }}
                onChange={(e) => setTransfer({ ...transfer, toCurrency: e.target.value })}
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Summary Card */}
            <div
              className="p-5 rounded-2xl"
              style={{
                background: "rgba(56,189,248,0.05)",
                border: "1px solid rgba(56,189,248,0.15)",
              }}
            >
              <div className="flex justify-between mb-2">
                <span className="text-sm" style={{ color: t.textMuted }}>
                  You send
                </span>
                <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                  ${formatCurrency(parseFloat(transfer.amount || "0"))} USD
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm" style={{ color: t.textMuted }}>
                  Exchange rate
                </span>
                <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                  1 USD = 0.92 {transfer.toCurrency}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm" style={{ color: t.textMuted }}>
                  Transfer fee
                </span>
                <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                  $25.00
                </span>
              </div>
              <hr style={{ borderColor: "rgba(255,255,255,0.07)" }} className="my-3" />
              <div className="flex justify-between">
                <span className="font-bold" style={{ color: t.textPrimary }}>
                  Recipient gets
                </span>
                <span className="font-bold text-lg" style={{ color: t.accentCyan }}>
                  {((parseFloat(transfer.amount || "0") - 25) * 0.92).toFixed(2)}{" "}
                  {transfer.toCurrency}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Purpose */}
        {step === 3 && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold" style={{ color: t.textPrimary }}>
              Why are you sending?
            </h3>
            {[
              { id: "family", label: "Family Support / Personal" },
              { id: "business", label: "Business Payment" },
              { id: "education", label: "Education Fees" },
              { id: "medical", label: "Medical Expenses" },
              { id: "investment", label: "Investment / Securities" },
              { id: "property", label: "Property Purchase" },
              { id: "loan", label: "Loan Repayment" },
              { id: "gift", label: "Gift / Donation" },
              { id: "travel", label: "Travel / Living Expenses" },
              { id: "other", label: "Other" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPurpose(p.id)}
                className="w-full p-4 rounded-2xl text-left text-sm font-semibold transition-all"
                style={{
                  background: t.cardBg,
                  border:
                    purpose === p.id ? "2px solid #38BDF8" : "1px solid rgba(255,255,255,0.07)",
                  color: purpose === p.id ? "#38BDF8" : "#FFFFFF",
                  boxShadow: purpose === p.id ? "0 0 0 3px rgba(56,189,248,0.15)" : "none",
                }}
              >
                {p.label}
              </button>
            ))}
            {purpose === "other" && (
              <input
                type="text"
                value={otherPurposeText}
                onChange={(e) => setOtherPurposeText(e.target.value)}
                placeholder="Please specify"
                className="w-full px-4 py-4 rounded-xl outline-none"
                style={{ background: t.inputBg, color: t.textPrimary }}
              />
            )}
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl" style={{ background: t.cardBg }}>
              <p
                className="text-xs uppercase tracking-wider font-semibold mb-3"
                style={{ color: t.textMuted }}
              >
                From Account
              </p>
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: t.textMuted }}>
                  Account
                </span>
                <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                  {transfer.src}
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl" style={{ background: t.cardBg }}>
              <p
                className="text-xs uppercase tracking-wider font-semibold mb-3"
                style={{ color: t.textMuted }}
              >
                Recipient
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: t.textMuted }}>
                    Name
                  </span>
                  <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                    {useSaved
                      ? savedBeneficiaries.find((b) => b.id === selectedBeneficiary)?.nickname
                      : beneficiary.fullName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: t.textMuted }}>
                    Bank
                  </span>
                  <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                    {useSaved
                      ? savedBeneficiaries.find((b) => b.id === selectedBeneficiary)?.bankName
                      : beneficiary.bankName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: t.textMuted }}>
                    Country
                  </span>
                  <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                    {useSaved
                      ? savedBeneficiaries.find((b) => b.id === selectedBeneficiary)?.country
                      : beneficiary.bankCountry}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl" style={{ background: t.cardBg }}>
              <p
                className="text-xs uppercase tracking-wider font-semibold mb-3"
                style={{ color: t.textMuted }}
              >
                Transfer Details
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: t.textMuted }}>
                    You send
                  </span>
                  <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                    ${formatCurrency(parseFloat(transfer.amount || "0"))} USD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: t.textMuted }}>
                    Exchange rate
                  </span>
                  <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                    1 USD = 0.92 {transfer.toCurrency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: t.textMuted }}>
                    Transfer fee
                  </span>
                  <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                    $25.00
                  </span>
                </div>
                <hr style={{ borderColor: "rgba(255,255,255,0.07)" }} className="my-2" />
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: t.textMuted }}>
                    Total debit
                  </span>
                  <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                    ${formatCurrency(parseFloat(transfer.amount || "0") + 25)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: t.textMuted }}>
                    Recipient gets
                  </span>
                  <span className="text-sm font-semibold" style={{ color: t.accentCyan }}>
                    {((parseFloat(transfer.amount || "0") - 25) * 0.92).toFixed(2)}{" "}
                    {transfer.toCurrency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: t.textMuted }}>
                    Purpose
                  </span>
                  <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                    {purpose === "other" ? otherPurposeText : purpose}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: t.textMuted }}>
                    Est. delivery
                  </span>
                  <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                    2-3 Hours
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Confirm */}
        {step === 5 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold" style={{ color: t.textPrimary }}>
              Confirm transfer
            </h3>
            {error && (
              <div
                className="flex items-center gap-2 rounded-xl p-4 text-sm"
                style={{
                  background: "rgba(255,77,106,0.1)",
                  border: "1px solid rgba(255,77,106,0.3)",
                  color: t.accentRed,
                }}
              >
                <XCircle size={20} />
                {error}
              </div>
            )}
            {/* Review Summary */}
            <div className="p-5 rounded-2xl" style={{ background: t.cardBg }}>
              <p
                className="text-xs uppercase tracking-wider font-semibold mb-3"
                style={{ color: t.textMuted }}
              >
                From Account
              </p>
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: t.textMuted }}>
                  Account
                </span>
                <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                  {transfer.src}
                </span>
              </div>
            </div>
            <div className="p-5 rounded-2xl" style={{ background: t.cardBg }}>
              <p
                className="text-xs uppercase tracking-wider font-semibold mb-3"
                style={{ color: t.textMuted }}
              >
                Transfer Details
              </p>
              <div className="flex justify-between mb-2">
                <span className="text-sm" style={{ color: t.textMuted }}>
                  You send
                </span>
                <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                  ${formatCurrency(parseFloat(transfer.amount || "0"))} USD
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: t.textMuted }}>
                  Recipient gets
                </span>
                <span className="text-lg font-mono font-bold" style={{ color: t.accentCyan }}>
                  {((parseFloat(transfer.amount || "0") - 25) * 0.92).toFixed(2)}{" "}
                  {transfer.toCurrency}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 6 is handled as a full-page early return above */}
      </div>

      {/* Navigation Buttons */}
      {step < 6 && (
        <div className="px-5 pb-8">
          {step > 1 ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={back}
                className="py-4 rounded-xl font-semibold"
                style={{ background: t.inputBg, color: t.textMuted }}
              >
                Back
              </button>
              <button
                onClick={step === 5 ? handleSubmit : next}
                disabled={loading}
                className="py-4 rounded-xl font-semibold"
                style={{
                  background: "linear-gradient(135deg, #38BDF8, #6366F1)",
                  color: t.textPrimary,
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "Submitting…" : step === 5 ? "Confirm & Send" : "Continue"}
              </button>
            </div>
          ) : (
            <button
              onClick={next}
              disabled={useSaved ? !selectedBeneficiary : !beneficiary.fullName}
              className="w-full py-4 rounded-xl font-semibold transition-all"
              style={{
                background: "linear-gradient(135deg, #38BDF8, #6366F1)",
                color: t.textPrimary,
                opacity: (useSaved ? !selectedBeneficiary : !beneficiary.fullName) ? 0.5 : 1,
              }}
            >
              Continue
            </button>
          )}
        </div>
      )}

      {step === 6 && (
        <div />
      )}
      <BottomNav />
    </div>
  );
}

// OTP step component — inserted as step 5 between Review and Confirm
function OtpStep({ amount, onVerified, onBack }: {
  amount: string;
  onVerified: (token: string) => void;
  onBack: () => void;
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [maskedPhone, setMaskedPhone] = useState("**45");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Auto-generate OTP on mount
  useEffect(() => {
    sendOtp();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const sendOtp = async () => {
    setError("");
    try {
      const res = await fetch("http://localhost:3000/api/otp/generate", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        setSent(true);
        setMaskedPhone(data.maskedPhone ?? "**45");
        setCountdown(data.expiresIn ?? 300);
      } else {
        setError(data.error ?? "Failed to send code");
      }
    } catch {
      setError("Could not connect to server");
    }
  };

  const handleChange = (i: number, v: string) => {
    if (!/^[0-9]?$/.test(v)) return;
    const n = [...otp];
    n[i] = v;
    setOtp(n);
    if (v && i < 5) {
      (document.querySelector(`input[data-otp="${i + 1}"]`) as HTMLInputElement)?.focus();
    }
  };

  const handleKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && otp[i] === "" && i > 0) {
      (document.querySelector(`input[data-otp="${i - 1}"]`) as HTMLInputElement)?.focus();
    }
  };

  const verify = async () => {
    const code = otp.join("");
    if (code.length < 6) { setError("Enter all 6 digits"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3000/api/otp/verify", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (res.ok && data.transferToken) {
        onVerified(data.transferToken);
      } else {
        setError(data.error ?? "Invalid code");
        setOtp(["", "", "", "", "", ""]);
        (document.querySelector('input[data-otp="0"]') as HTMLInputElement)?.focus();
      }
    } catch {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  const mins = String(Math.floor(countdown / 60)).padStart(2, "0");
  const secs = String(countdown % 60).padStart(2, "0");

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold" style={{ color: t.textPrimary }}>Verify Transfer</h3>
      <div className="p-5 rounded-2xl" style={{ background: t.cardBg }}>
        <p className="text-sm" style={{ color: t.textMuted }}>
          To authorize the transfer of{" "}
          <span className="font-bold" style={{ color: t.accentCyan }}>
            ${parseFloat(amount || "0").toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          , enter the 6-digit code {sent ? `sent to ${maskedPhone}` : "being sent to your phone"}.
        </p>
      </div>

      <div className="flex justify-center gap-3">
        {otp.map((d, i) => (
          <input
            key={i}
            data-otp={i}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKey(i, e)}
            className="w-12 h-16 text-center text-2xl font-bold rounded-xl outline-none transition"
            style={{
              border: d ? "2px solid #38BDF8" : "1.5px solid rgba(255,255,255,0.1)",
              background: t.cardBg,
              color: t.textPrimary,
              boxShadow: d ? "0 0 0 3px rgba(56,189,248,0.15)" : "none",
            }}
          />
        ))}
      </div>

      {error && (
        <div
          className="flex items-center gap-2 rounded-xl p-4 text-sm"
          style={{ background: "rgba(255,77,106,0.1)", border: "1px solid rgba(255,77,106,0.3)", color: t.accentRed }}
        >
          <XCircle size={18} />
          {error}
        </div>
      )}

      <div className="text-center">
        {countdown > 0 ? (
          <p className="text-sm" style={{ color: t.textMuted }}>
            Code expires in{" "}
            <span className="font-bold" style={{ color: t.accentCyan }}>{mins}:{secs}</span>
          </p>
        ) : (
          <button
            onClick={sendOtp}
            className="text-sm font-semibold"
            style={{ color: t.accentCyan }}
          >
            Resend Code
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onBack}
          className="py-4 rounded-xl font-semibold"
          style={{ background: t.inputBg, color: t.textMuted }}
        >
          Back
        </button>
        <button
          onClick={verify}
          disabled={otp.some((d) => d === "") || loading}
          className="py-4 rounded-xl font-semibold"
          style={{
            background: "linear-gradient(135deg, #38BDF8, #6366F1)",
            color: t.textPrimary,
            opacity: otp.some((d) => d === "") || loading ? 0.5 : 1,
          }}
        >
          {loading ? "Verifying…" : "Confirm"}
        </button>
      </div>
    </div>
  );
}
