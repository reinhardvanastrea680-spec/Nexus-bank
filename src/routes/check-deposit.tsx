import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Camera,
  X,
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

export const Route = createFileRoute("/check-deposit")({
  head: () => ({ meta: [{ title: "Check Deposit - Nexus Bank" }] }),
  component: CheckDeposit,
});

function formatAmountDisplay(val: string): string {
  const clean = val.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
  const [int, dec] = clean.split(".");
  const formatted = (int || "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return dec !== undefined ? `${formatted}.${dec}` : formatted;
}

function CheckDeposit() {
  
  const { theme } = useTheme();
  const navigate = useNavigate();
  const t = themeColors(theme);
  const { account } = useUserAccount();
  const [step, setStep] = useState(1);
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [amount, setAmount] = useState("");
  const [checkNumber, setCheckNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<"Checking" | "Savings">("Checking");
  const [memo, setMemo] = useState("");
  const [successData, setSuccessData] = useState<{
    amount: number;
    transactionRef: string;
    fundingAccount: string;
    status: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

  const handleFileSelect = (side: "front" | "back", file: File) => {
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG, and PDF files are allowed");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 10MB");
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      if (side === "front") {
        setFrontFile(file);
        setFrontImage(reader.result as string);
      } else {
        setBackFile(file);
        setBackImage(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = (side: "front" | "back", useCamera = false) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = useCamera ? "image/*" : "image/*,.pdf";
    input.capture = useCamera ? "environment" : undefined;

    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        handleFileSelect(side, file);
      }
    };

    input.click();
  };

  const steps = [
    { id: 1, label: "Photo" },
    { id: 2, label: "Details" },
    { id: 3, label: "Confirm" },
  ];

  const handleNext = () => {
    if (step === 1 && (!frontImage || !backImage)) {
      toast.error("Please upload both sides of the check");
      return;
    }
    if (step === 2 && (!amount || !checkNumber || !routingNumber || !accountNumber)) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    if (step === 1) {
      navigate({ to: "/" });
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const depositAmount = parseFloat((amount || "0").replace(/,/g, ""));
      const { transactionRef, status: txStatus } = await submitTransaction({
        type: "check_deposit",
        subType: "incoming",
        description: `Check Deposit #${checkNumber}`,
        category: "Deposit",
        amount: depositAmount,
        fundingAccount: selectedAccount.toLowerCase() as "checking" | "savings",
        toAccount: selectedAccount,
        checkNumber,
        routingNumber,
        accountNumber,
        memo,
      });

      setSuccessData({
        amount: depositAmount,
        transactionRef,
        status: txStatus,
        fundingAccount: selectedAccount,
      });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to submit check deposit");
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
        status={successData.status}
        transactionType="check_deposit"
      />
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col pb-24" style={{ background: t.pageBg }}>
      {/* Header */}
      <div className="px-5 pt-10 pb-6 flex items-center gap-4">
        <button onClick={handleBack} className="p-2">
          <ArrowLeft size={24} style={{ color: t.textPrimary }} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center" style={{ color: t.textPrimary }}>
          Check Deposit
        </h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Step Indicator */}
      <div className="px-5 mb-8">
        <div className="flex items-center justify-between">
          {steps.map((s) => (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{
                    background: s.id <= step ? "#38BDF8" : "#1A2438",
                    color: s.id <= step ? t.pageBg : "#8A9BB5",
                  }}
                >
                  {s.id}
                </div>
                <span className="text-xs mt-1" style={{ color: t.textMuted }}>
                  {s.label}
                </span>
              </div>
              {s.id < steps.length && (
                <div
                  className="flex-1 h-0.5 mx-2"
                  style={{ background: s.id < step ? "#38BDF8" : "#1A2438" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 flex-1 space-y-6">
        {step === 1 && (
          <>
            {/* Intro Card */}
            <div className="p-6 rounded-2xl" style={{ background: t.cardBg }}>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "#38BDF820" }}
                >
                  <span style={{ color: t.accentCyan }}>📄</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: t.textPrimary }}>
                    Deposit a Check
                  </h3>
                  <p className="text-sm" style={{ color: t.textMuted }}>
                    Take photos of the front and back of your check to deposit it
                  </p>
                </div>
              </div>
            </div>

            {/* Upload Front */}
            <div className="space-y-2">
              <label className="text-sm font-semibold" style={{ color: t.textMuted }}>
                Front of Check
              </label>
              {frontImage ? (
                <div className="relative">
                  {frontFile?.type === "application/pdf" ? (
                    <div
                      className="w-full h-48 rounded-2xl flex flex-col items-center justify-center"
                      style={{ background: t.inputBg }}
                    >
                      <span className="text-lg font-bold" style={{ color: t.accentCyan }}>
                        PDF
                      </span>
                      <span className="text-xs" style={{ color: t.textMuted }}>
                        {frontFile.name}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={frontImage}
                      alt="Front of check"
                      className="w-full h-48 object-cover rounded-2xl"
                    />
                  )}
                  <button
                    onClick={() => {
                      setFrontImage(null);
                      setFrontFile(null);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: t.inputBg, color: t.accentRed }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => triggerFileInput("front", true)}
                    className="flex-1 h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2"
                    style={{ borderColor: "rgba(56,189,248,0.4)", background: t.inputBg }}
                  >
                    <Camera size={32} style={{ color: t.accentCyan }} />
                    <span className="text-xs" style={{ color: t.accentCyan }}>
                      Take Photo
                    </span>
                  </button>
                  <button
                    onClick={() => triggerFileInput("front", false)}
                    className="flex-1 h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2"
                    style={{ borderColor: "rgba(56,189,248,0.4)", background: t.inputBg }}
                  >
                    <span className="text-3xl" style={{ color: t.accentCyan }}>
                      📁
                    </span>
                    <span className="text-xs" style={{ color: t.accentCyan }}>
                      Upload File
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Upload Back */}
            <div className="space-y-2">
              <label className="text-sm font-semibold" style={{ color: t.textMuted }}>
                Back of Check
              </label>
              {backImage ? (
                <div className="relative">
                  {backFile?.type === "application/pdf" ? (
                    <div
                      className="w-full h-48 rounded-2xl flex flex-col items-center justify-center"
                      style={{ background: t.inputBg }}
                    >
                      <span className="text-lg font-bold" style={{ color: t.accentCyan }}>
                        PDF
                      </span>
                      <span className="text-xs" style={{ color: t.textMuted }}>
                        {backFile.name}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={backImage}
                      alt="Back of check"
                      className="w-full h-48 object-cover rounded-2xl"
                    />
                  )}
                  <button
                    onClick={() => {
                      setBackImage(null);
                      setBackFile(null);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: t.inputBg, color: t.accentRed }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => triggerFileInput("back", true)}
                    className="flex-1 h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2"
                    style={{ borderColor: "rgba(56,189,248,0.4)", background: t.inputBg }}
                  >
                    <Camera size={32} style={{ color: t.accentCyan }} />
                    <span className="text-xs" style={{ color: t.accentCyan }}>
                      Take Photo
                    </span>
                  </button>
                  <button
                    onClick={() => triggerFileInput("back", false)}
                    className="flex-1 h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2"
                    style={{ borderColor: "rgba(56,189,248,0.4)", background: t.inputBg }}
                  >
                    <span className="text-3xl" style={{ color: t.accentCyan }}>
                      📁
                    </span>
                    <span className="text-xs" style={{ color: t.accentCyan }}>
                      Upload File
                    </span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {/* Amount */}
            <div className="space-y-2">
              <label className="text-sm font-semibold" style={{ color: t.textMuted }}>
                Check Amount
              </label>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-mono"
                  style={{ color: t.textMuted }}
                >
                  $
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(formatAmountDisplay(e.target.value))}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-4 rounded-xl outline-none"
                  style={{ background: t.inputBg, color: t.textPrimary }}
                />
              </div>
            </div>

            {/* Check Number */}
            <div className="space-y-2">
              <label className="text-sm font-semibold" style={{ color: t.textMuted }}>
                Check Number
              </label>
              <input
                type="text"
                value={checkNumber}
                onChange={(e) => setCheckNumber(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-4 rounded-xl outline-none"
                style={{ background: t.inputBg, color: t.textPrimary }}
              />
            </div>

            {/* Routing Number */}
            <div className="space-y-2">
              <label className="text-sm font-semibold" style={{ color: t.textMuted }}>
                Routing Number on Check
              </label>
              <input
                type="text"
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value)}
                placeholder="123456789"
                className="w-full px-4 py-4 rounded-xl outline-none"
                style={{ background: t.inputBg, color: t.textPrimary }}
              />
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <label className="text-sm font-semibold" style={{ color: t.textMuted }}>
                Account Number on Check
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="1234567890"
                className="w-full px-4 py-4 rounded-xl outline-none"
                style={{ background: t.inputBg, color: t.textPrimary }}
              />
            </div>

            {/* Deposit to Account */}
            <div className="space-y-2">
              <label className="text-sm font-semibold" style={{ color: t.textMuted }}>
                Deposit To
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedAccount("Checking")}
                  className="flex-1 py-3 px-4 rounded-xl font-bold transition-all"
                  style={{
                    background: selectedAccount === "Checking" ? "#38BDF8" : "#1A2438",
                    color: selectedAccount === "Checking" ? t.pageBg : "#8A9BB5",
                  }}
                >
                  Checking
                </button>
                <button
                  onClick={() => setSelectedAccount("Savings")}
                  className="flex-1 py-3 px-4 rounded-xl font-bold transition-all"
                  style={{
                    background: selectedAccount === "Savings" ? "#38BDF8" : "#1A2438",
                    color: selectedAccount === "Savings" ? t.pageBg : "#8A9BB5",
                  }}
                >
                  Savings
                </button>
              </div>
            </div>

            {/* Memo */}
            <div className="space-y-2">
              <label className="text-sm font-semibold" style={{ color: t.textMuted }}>
                Memo / Note (Optional)
              </label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="Add a memo"
                className="w-full px-4 py-4 rounded-xl outline-none resize-none"
                rows={3}
                style={{ background: t.inputBg, color: t.textPrimary }}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            {/* Summary Card */}
            <div className="p-6 rounded-2xl" style={{ background: t.cardBg }}>
              <h3 className="text-lg font-bold mb-6" style={{ color: t.textPrimary }}>
                Review Deposit
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: t.textMuted }}>
                    Amount
                  </span>
                  <span className="text-lg font-mono font-bold" style={{ color: t.textPrimary }}>
                    $
                    {parseFloat((amount || "0").replace(/,/g, "")).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: t.textMuted }}>
                    Check Number
                  </span>
                  <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                    {checkNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: t.textMuted }}>
                    Deposit To
                  </span>
                  <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                    {selectedAccount}
                  </span>
                </div>
                {memo && (
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: t.textMuted }}>
                      Memo
                    </span>
                    <span className="text-sm" style={{ color: t.textPrimary }}>
                      {memo}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-4 rounded-2xl" style={{ background: t.inputBg }}>
              <p className="text-xs" style={{ color: t.textMuted }}>
                Check deposits are subject to review. Funds may be held for 1-3 business days.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="px-5 pb-8">
        {step > 1 && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleBack}
              className="py-4 rounded-xl font-semibold"
              style={{ background: t.inputBg, color: t.textMuted }}
            >
              Back
            </button>
            <button
              onClick={step === 3 ? handleSubmit : handleNext}
              disabled={loading}
              className="py-4 rounded-xl font-semibold transition-all"
              style={{
                background: "linear-gradient(135deg, #38BDF8, #6366F1)",
                color: t.textPrimary,
                opacity: loading ? 0.5 : 1,
              }}
            >
              {step === 3 ? (loading ? "Submitting…" : "Submit Deposit") : "Continue"}
            </button>
          </div>
        )}
        {step === 1 && (
          <button
            onClick={handleNext}
            disabled={!frontImage || !backImage}
            className="w-full py-4 rounded-xl font-semibold transition-all"
            style={{
              background: "linear-gradient(135deg, #38BDF8, #6366F1)",
              color: t.textPrimary,
              opacity: !frontImage || !backImage ? 0.5 : 1,
            }}
          >
            Continue
          </button>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
