import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Search,
  X,
  Settings,
  Bell,
  Home as HomeIcon,
  History,
  Headphones,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "../hooks/use-theme";
import { themeColors } from "../utils/theme";
import { BottomNav } from "../dashboard/components/BottomNav";
import { useUserAccount } from "../dashboard/hooks/useUserAccount";
import { submitTransaction } from "../dashboard/functions/submitTransaction";
import { TransactionSuccessScreen } from "../dashboard/components/TransactionSuccessScreen";
import { useBeneficiaries } from "../dashboard/hooks/useBeneficiaries";
import { useCustomBanks } from "../dashboard/hooks/useCustomBanks";

export const Route = createFileRoute("/local-transfer")({
  head: () => ({ meta: [{ title: "Local Transfer - Nexus Bank" }] }),
  component: LocalTransfer,
});

// Comprehensive global banks database
const globalBanks = [
  // United States
  {
    id: "us-chase",
    name: "JPMorgan Chase Bank",
    country: "United States",
    swift: "CHASUS33",
    routing: "021000021",
  },
  {
    id: "us-bofa",
    name: "Bank of America",
    country: "United States",
    swift: "BOFAUS3N",
    routing: "026009593",
  },
  {
    id: "us-wells",
    name: "Wells Fargo Bank",
    country: "United States",
    swift: "WFBIUS6S",
    routing: "121000248",
  },
  {
    id: "us-citi",
    name: "Citibank N.A.",
    country: "United States",
    swift: "CITIUS33",
    routing: "021000089",
  },

  // United Kingdom
  {
    id: "uk-hsbc",
    name: "HSBC Bank UK",
    country: "United Kingdom",
    swift: "MIDLGB22",
    sort: "40-00-00",
  },
  {
    id: "uk-barclays",
    name: "Barclays Bank",
    country: "United Kingdom",
    swift: "BARCGB22",
    sort: "20-00-00",
  },
  {
    id: "uk-lloyds",
    name: "Lloyds Bank",
    country: "United Kingdom",
    swift: "LOYDGB2L",
    sort: "30-00-00",
  },
  {
    id: "uk-natwest",
    name: "NatWest Bank",
    country: "United Kingdom",
    swift: "NWBKGB2L",
    sort: "60-00-00",
  },

  // European Union
  {
    id: "de-deutsche",
    name: "Deutsche Bank",
    country: "Germany",
    swift: "DEUTDEFF",
    blz: "50070001",
  },
  { id: "fr-societe", name: "Société Générale", country: "France", swift: "SOGEFRPP" },
  { id: "nl-ing", name: "ING Bank Netherlands", country: "Netherlands", swift: "INGBNL2A" },
  { id: "es-santander", name: "Banco Santander", country: "Spain", swift: "BSCHESMM" },

  // Additional US banks
  { id: "us-chase", name: "Chase Bank", country: "United States", swift: "CHASUS33" },
  { id: "us-boa", name: "Bank of America", country: "United States", swift: "BOFAUS3N" },
  { id: "us-wells", name: "Wells Fargo", country: "United States", swift: "WFBIUS6S" },
  { id: "us-citi", name: "Citibank", country: "United States", swift: "CITIUS33" },
  { id: "us-usbank", name: "US Bank", country: "United States", swift: "USBKUS44" },
  { id: "us-pnc", name: "PNC Bank", country: "United States", swift: "PNCCUS33" },
  { id: "us-capital", name: "Capital One", country: "United States", swift: "NFBKUS33" },
  { id: "us-td", name: "TD Bank", country: "United States", swift: "NRTHUS33" },

  // Canada
  { id: "ca-rbc", name: "Royal Bank of Canada", country: "Canada", swift: "ROYCCAT2" },
  { id: "ca-td", name: "TD Canada Trust", country: "Canada", swift: "TDOMCATT" },

  // Australia
  { id: "au-cba", name: "Commonwealth Bank of Australia", country: "Australia", swift: "CTBAAU2S" },
  {
    id: "au-westpac",
    name: "Westpac Banking Corporation",
    country: "Australia",
    swift: "WBCAAU2S",
  },

  // Singapore
  { id: "sg-dbs", name: "DBS Bank", country: "Singapore", swift: "DBSSSGSG" },
  { id: "sg-uob", name: "United Overseas Bank", country: "Singapore", swift: "UOVBSGSG" },

  // India
  { id: "in-sbi", name: "State Bank of India", country: "India", swift: "SBININBB" },
  { id: "in-hdfc", name: "HDFC Bank", country: "India", swift: "HDFCINBB" },

  // UAE
  {
    id: "ae-emirates",
    name: "Emirates NBD Bank",
    country: "United Arab Emirates",
    swift: "EBILAEAD",
  },
  {
    id: "ae-dubai",
    name: "Dubai Islamic Bank",
    country: "United Arab Emirates",
    swift: "DIBBAEAD",
  },
];

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatAmountDisplay(val: string): string {
  // Strip everything except digits and first decimal point
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
  const { beneficiaries } = useBeneficiaries();
  const { customBanks } = useCustomBanks();

  // Merge static globalBanks with custom banks from Firestore
  const allBanks = [
    ...globalBanks,
    ...customBanks.map((cb) => ({
      id: `custom_${cb.id}`,
      name: cb.name,
      country: cb.country || "Custom",
      swift: undefined as string | undefined,
      routing: undefined as string | undefined,
    })),
  ];

  const [step, setStep] = useState(1);
  const [selectedBank, setSelectedBank] = useState<(typeof globalBanks)[0] | null>(null);
  const [bankSearchQuery, setBankSearchQuery] = useState("");
  const [showBankResults, setShowBankResults] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientSwift, setRecipientSwift] = useState("");
  const [recipientRouting, setRecipientRouting] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [sourceAccount, setSourceAccount] = useState("Checking");
  const [loading, setLoading] = useState(false);

  const fromBalance =
    sourceAccount === "Checking" ? account?.checkingBalance || 0 : account?.savingsBalance || 0;

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

  // Filter banks based on search query
  const filteredBanks = allBanks.filter(
    (bank) =>
      bank.name.toLowerCase().includes(bankSearchQuery.toLowerCase()) ||
      bank.country.toLowerCase().includes(bankSearchQuery.toLowerCase()) ||
      (bank.swift && bank.swift.toLowerCase().includes(bankSearchQuery.toLowerCase())) ||
      (bank.routing && bank.routing.includes(bankSearchQuery)),
  );

  const handleSelectBank = (bank: (typeof allBanks)[0]) => {
    setSelectedBank(bank);
    setRecipientSwift(bank.swift || "");
    setRecipientRouting(bank.routing || "");
    setBankSearchQuery(bank.name);
    setShowBankResults(false);
  };

  const handleSubmit = async () => {
    if (!selectedBank) {
      toast.error("Please select a bank");
      return;
    }
    if (!recipientName) {
      toast.error("Please enter recipient name");
      return;
    }
    if (!accountNumber) {
      toast.error("Please enter account number");
      return;
    }
    if (!amount || parseFloat(amount.replace(/,/g,"")) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (parseFloat(amount.replace(/,/g,"")) > fromBalance) {
      toast.error("Insufficient funds");
      return;
    }

    setLoading(true);
    try {
      const { transactionRef, status: txStatus } = await submitTransaction({
        type: "local_transfer",
        subType: "outgoing",
        description: `Local Transfer to ${recipientName} (${selectedBank.name})`,
        category: "Transfer",
        amount: parseFloat(amount.replace(/,/g,"")),
        fundingAccount: sourceAccount.toLowerCase() as "checking" | "savings",
        recipientName,
        recipientAccount: accountNumber,
        recipientBank: selectedBank.name,
        toBank: selectedBank.name,
        toCountry: selectedBank.country,
        toAccountNumber: accountNumber,
        toSwiftCode: recipientSwift,
        toRoutingNumber: recipientRouting,
        note,
      });

      setSuccessData({
        amount: parseFloat(amount.replace(/,/g,"")),
        transactionRef,
        status: txStatus,
        fundingAccount: sourceAccount,
        recipientName,
        saveBeneficiary: {
          fullName: recipientName,
          bankName: selectedBank.name,
          bankId: selectedBank.id,
          accountNumber,
        },
      });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to submit transfer request");
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

  return (
    <div className="min-h-screen w-full flex flex-col pb-24" style={{ background: t.pageBg }}>
      {/* Header */}
      <div className="px-5 pt-10 pb-6 flex items-center gap-4">
        <button onClick={() => (step > 1 ? setStep(1) : navigate({ to: "/" }))} className="p-2">
          <ArrowLeft size={24} style={{ color: t.textOnBg }} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center" style={{ color: t.textOnBg }}>
          Local Transfer
        </h1>
        <div className="w-10" />
      </div>

      {/* Step Indicator */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-center gap-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className="h-2 rounded-full transition-all"
              style={{ width: s === step ? 24 : 8, background: s <= step ? t.accentCyan : t.inputBg }}
            />
          ))}
        </div>
      </div>

      <div className="px-5 flex-1 space-y-6">
        {/* Step 1: Recipient */}
        {step === 1 && (
          <div className="space-y-4">

            {/* Saved beneficiaries quick-select */}
            {beneficiaries.length > 0 && (
              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: t.textMutedOnBg }}>
                  <Star size={13} className="inline mr-1" style={{ color: t.accentYellow }} />
                  Saved Beneficiaries
                </label>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {beneficiaries.map((ben) => (
                    <button
                      key={ben.id}
                      onClick={() => {
                        setRecipientName(ben.fullName);
                        setAccountNumber(ben.accountNumber);
                        // Find matching bank in globalBanks or create a placeholder
                        const match = allBanks.find(
                          (b) => b.id === ben.bankId || b.name.toLowerCase() === ben.bankName.toLowerCase(),
                        );
                        if (match) {
                          handleSelectBank(match);
                        } else {
                          setSelectedBank({ id: ben.bankId, name: ben.bankName, country: "", swift: undefined, routing: undefined });
                          setBankSearchQuery(ben.bankName);
                          setShowBankResults(false);
                        }
                      }}
                      className="flex-shrink-0 flex flex-col items-center gap-1.5"
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm"
                        style={{ background: "#38BDF8", color: t.pageBg }}
                      >
                        {ben.initials}
                      </div>
                      <span className="text-xs max-w-[56px] truncate text-center" style={{ color: t.textMuted }}>
                        {ben.nickname || ben.fullName}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Bank Search */}
            <div className="space-y-2">
              <label className="text-sm font-semibold" style={{ color: t.textMutedOnBg }}>
                Search & Select Bank
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/60" />
                <input
                  type="text"
                  value={bankSearchQuery}
                  onChange={(e) => {
                    setBankSearchQuery(e.target.value);
                    setShowBankResults(true);
                  }}
                  onFocus={() => setShowBankResults(true)}
                  placeholder="Search by bank name, country, SWIFT, routing..."
                  className="w-full pl-10 pr-3 py-4 rounded-xl outline-none"
                  style={{ background: t.inputBg, color: t.textPrimary }}
                />
                {showBankResults && (
                  <button
                    onClick={() => setShowBankResults(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X size={16} style={{ color: t.textMuted }} />
                  </button>
                )}
              </div>

              {/* Search Results */}
              {showBankResults && (
                <div
                  className="max-h-80 overflow-y-auto rounded-xl border border-[rgba(255,255,255,0.07)]"
                  style={{ background: t.cardBg }}
                >
                  {filteredBanks.length > 0 ? (
                    filteredBanks.map((bank) => (
                      <button
                        key={bank.id}
                        onClick={() => handleSelectBank(bank)}
                        className="w-full text-left p-4 border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(56,189,248,0.1)] transition-colors"
                      >
                        <div className="font-semibold" style={{ color: t.textPrimary }}>{bank.name}</div>
                        <div className="text-xs text-blue-300/70">
                          {bank.country}
                          {bank.swift && <span className="ml-3">SWIFT: {bank.swift}</span>}
                          {bank.routing && <span className="ml-3">Routing: {bank.routing}</span>}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 space-y-3">
                      <p className="text-center text-sm" style={{ color: t.textMuted }}>No matching bank found</p>
                      {bankSearchQuery.trim().length >= 2 && (
                        <button
                          onClick={() => {
                            toast.info(`Bank not found. Your request to add "${bankSearchQuery}" has been noted. Please contact support to add this bank.`, { duration: 5000 });
                          }}
                          className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all"
                          style={{ background: "linear-gradient(135deg, #38BDF8, #6366F1)" }}
                        >
                          + Request to Add "{bankSearchQuery}"
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Bank Details */}
            {selectedBank && (
              <div className="p-4 rounded-xl" style={{ background: t.cardBg }}>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="font-semibold" style={{ color: t.textPrimary }}>
                      {selectedBank.name}
                    </div>
                    <div className="text-xs text-blue-300/70">{selectedBank.country}</div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedBank(null);
                      setBankSearchQuery("");
                    }}
                    className="p-2 rounded-full"
                    style={{ background: t.inputBg }}
                  >
                    <X size={16} style={{ color: t.accentRed }} />
                  </button>
                </div>

                {/* Recipient Name - Manual Entry */}
                <div className="space-y-2 mb-4">
                  <label className="text-sm font-semibold" style={{ color: t.textMuted }}>
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Enter recipient name"
                    className="w-full px-4 py-4 rounded-xl outline-none"
                    style={{ background: t.inputBg, color: t.textPrimary }}
                    required
                  />
                </div>

                {/* Account Number - Manual Entry */}
                <div className="space-y-2 mb-4">
                  <label className="text-sm font-semibold" style={{ color: t.textMutedOnBg }}>
                    Account Number *
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter recipient account number"
                    className="w-full px-4 py-4 rounded-xl outline-none"
                    style={{ background: t.inputBg, color: t.textPrimary }}
                    required
                  />
                </div>

                {/* SWIFT/Routing Number - Optional Manual Entry */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold" style={{ color: t.textMutedOnBg }}>
                      SWIFT Code (Optional)
                    </label>
                    <input
                      type="text"
                      value={recipientSwift}
                      onChange={(e) => setRecipientSwift(e.target.value.toUpperCase())}
                      placeholder="Enter SWIFT code"
                      className="w-full px-4 py-4 rounded-xl outline-none"
                      style={{ background: t.inputBg, color: t.textPrimary }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold" style={{ color: t.textMutedOnBg }}>
                      Routing/Sort Code (Optional)
                    </label>
                    <input
                      type="text"
                      value={recipientRouting}
                      onChange={(e) => setRecipientRouting(e.target.value)}
                      placeholder="Enter routing code"
                      className="w-full px-4 py-4 rounded-xl outline-none"
                      style={{ background: t.inputBg, color: t.textPrimary }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Amount */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="relative inline-flex items-center gap-2">
                <span className="text-3xl font-mono" style={{ color: t.textMuted }}>
                  $
                </span>
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

            <div className="space-y-2">
              <label className="text-sm font-semibold" style={{ color: t.textMuted }}>
                Source Account
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setSourceAccount("Checking")}
                  className="flex-1 py-4 px-4 rounded-xl font-bold transition-all"
                  style={{
                    background: sourceAccount === "Checking" ? t.accentCyan : t.inputBg,
                    color: sourceAccount === "Checking" ? t.pageBg : t.textMuted,
                  }}
                >
                  Checking
                </button>
                <button
                  onClick={() => setSourceAccount("Savings")}
                  className="flex-1 py-4 px-4 rounded-xl font-bold transition-all"
                  style={{
                    background: sourceAccount === "Savings" ? t.accentCyan : t.inputBg,
                    color: sourceAccount === "Savings" ? t.pageBg : t.textMuted,
                  }}
                >
                  Savings
                </button>
              </div>
            </div>

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

            <div className="p-5 rounded-2xl" style={{ background: t.cardBg }}>
              <div className="flex justify-between mb-2">
                <span className="text-sm" style={{ color: t.textMuted }}>
                  Transfer to
                </span>
                <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                  {recipientName} - {selectedBank?.name}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm" style={{ color: t.textMuted }}>
                  Transfer fee
                </span>
                <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                  $0.00
                </span>
              </div>
              <hr style={{ borderColor: "rgba(255,255,255,0.07)" }} className="my-3" />
              <div className="flex justify-between">
                <span className="font-bold" style={{ color: t.textPrimary }}>
                  Total
                </span>
                <span className="text-xl font-mono font-bold" style={{ color: t.accentCyan }}>
                  ${parseFloat((amount || "0").replace(/,/g,"")).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="px-5 pb-8">
        {step > 1 ? (
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
              disabled={!amount || parseFloat(amount.replace(/,/g,"")) <= 0 || loading}
              className="py-4 rounded-xl font-semibold"
              style={{
                background: "linear-gradient(135deg, #38BDF8, #6366F1)",
                color: t.textPrimary,
                opacity: !amount || parseFloat(amount.replace(/,/g,"")) <= 0 || loading ? 0.5 : 1,
              }}
            >
              {loading ? "Submitting…" : "Confirm Transfer"}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setStep(2)}
            disabled={!selectedBank || !recipientName || !accountNumber}
            className="w-full py-4 rounded-xl font-semibold transition-all"
            style={{
              background: "linear-gradient(135deg, #38BDF8, #6366F1)",
              color: t.textPrimary,
              opacity: !selectedBank || !recipientName || !accountNumber ? 0.5 : 1,
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
