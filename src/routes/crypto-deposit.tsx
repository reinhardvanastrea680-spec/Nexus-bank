import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Copy, Share2, Check, AlertTriangle, Clock, CheckCircle2, XCircle, ChevronDown } from "lucide-react";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import { useTheme } from "../hooks/use-theme";
import { themeColors } from "../utils/theme";
import { BottomNav } from "../dashboard/components/BottomNav";
import { useUserAuth } from "../dashboard/hooks/useUserAuth";
import { useUserAccount } from "../dashboard/hooks/useUserAccount";
import { useUserTransactions } from "../dashboard/hooks/useUserTransactions";
import { submitTransaction } from "../dashboard/functions/submitTransaction";
import { TransactionSuccessScreen } from "../dashboard/components/TransactionSuccessScreen";
import { db } from "../firebase/config";
import { doc, onSnapshot } from "firebase/firestore";

export const Route = createFileRoute("/crypto-deposit")({
  head: () => ({ meta: [{ title: "Crypto Deposit - Nexus Bank" }] }),
  component: CryptoDeposit,
});

// ── Supported cryptos ────────────────────────────────────────────────────────
const CRYPTOS = [
  {
    id: "btc",  symbol: "BTC",  name: "Bitcoin",          network: "Bitcoin Network (BTC)",
    color: "#F7931A", minDeposit: 0.0001, confirmations: 3, arrivalTime: "10-60 minutes",
    fallbackAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    warning: "Only send BTC on the Bitcoin Network. Do NOT send BEP-20 or other tokens.",
  },
  {
    id: "eth",  symbol: "ETH",  name: "Ethereum",         network: "Ethereum Network (ERC-20)",
    color: "#627EEA", minDeposit: 0.01, confirmations: 12, arrivalTime: "5-15 minutes",
    fallbackAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8F726",
    warning: "Only send ETH on the Ethereum Mainnet. Sending from BEP-20 may result in permanent loss.",
  },
  {
    id: "usdt_erc20", symbol: "USDT", name: "Tether (ERC-20)", network: "Ethereum Network (ERC-20)",
    color: "#26A17B", minDeposit: 10, confirmations: 12, arrivalTime: "5-15 minutes",
    fallbackAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    warning: "Only send ERC-20 USDT. Do not send TRC-20 USDT to this address.",
  },
  {
    id: "usdt_trc20", symbol: "USDT", name: "Tether (TRC-20)", network: "TRON Network (TRC-20)",
    color: "#E84142", minDeposit: 10, confirmations: 20, arrivalTime: "2-5 minutes",
    fallbackAddress: "TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9",
    warning: "Only send TRC-20 USDT. Do not send ERC-20 USDT to this address.",
  },
  {
    id: "sol",  symbol: "SOL",  name: "Solana",           network: "Solana Network (SOL)",
    color: "#9945FF", minDeposit: 0.1, confirmations: 32, arrivalTime: "1-5 minutes",
    fallbackAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    warning: "Only send SOL on the Solana Network.",
  },
  {
    id: "bnb",  symbol: "BNB",  name: "BNB",              network: "BNB Smart Chain (BEP-20)",
    color: "#F3BA2F", minDeposit: 0.01, confirmations: 15, arrivalTime: "5-10 minutes",
    fallbackAddress: "0x8894E0a0c962CB723c1976a4421c95949bE2D4E3",
    warning: "Only send BNB on BNB Smart Chain (BEP-20).",
  },
];

function formatAmountDisplay(val: string): string {
  const clean = val.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
  const [int, dec] = clean.split(".");
  const formatted = (int || "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return dec !== undefined ? `${formatted}.${dec}` : formatted;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "completed": case "approved": return { text: "Confirmed", color: "#00E676", bg: "rgba(0,230,118,0.12)", icon: CheckCircle2 };
    case "pending":                    return { text: "Pending",   color: "#FFAB00", bg: "rgba(255,171,0,0.12)",  icon: Clock        };
    default:                           return { text: "Failed",    color: "#FF4D6A", bg: "rgba(255,77,106,0.12)", icon: XCircle      };
  }
}

function CryptoDeposit() {
  const navigate  = useNavigate();
  const { theme } = useTheme();
  const t         = themeColors(theme);
  const { user }  = useUserAuth();
  const { account } = useUserAccount();
  const { transactions } = useUserTransactions();

  const [selectedCrypto, setSelectedCrypto] = useState(CRYPTOS[0]);
  const [adminAddresses, setAdminAddresses]  = useState<Record<string, string>>({});
  const [showSelector, setShowSelector]      = useState(false);

  // Amount & deposit flow
  const [amount, setAmount]           = useState("");
  const [amountBlurred, setAmountBlurred] = useState(false);
  const [txHash, setTxHash]           = useState("");
  const [network, setNetwork]         = useState(selectedCrypto.network);
  const [loading, setLoading]         = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  // Load admin-set crypto addresses from user's Firestore document
  useEffect(() => {
    if (!user?.uid) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (snap.exists()) {
        setAdminAddresses(snap.data().cryptoAddresses || {});
      }
    });
    return unsub;
  }, [user?.uid]);

  // When crypto changes, update network default
  useEffect(() => {
    setNetwork(selectedCrypto.network);
    setAmount("");
    setTxHash("");
    setAmountBlurred(false);
  }, [selectedCrypto.id]);

  // Address for current crypto (admin-set takes priority)
  const depositAddress = adminAddresses[selectedCrypto.id]
    || adminAddresses[selectedCrypto.symbol]
    || selectedCrypto.fallbackAddress;

  // Recent crypto deposits from real transaction history
  const recentDeposits = transactions
    .filter((tx) => tx.type === "crypto_deposit")
    .slice(0, 5);

  const handleCopy = () => {
    navigator.clipboard.writeText(depositAddress);
    toast.success("Address copied to clipboard");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: `${selectedCrypto.symbol} Deposit Address`, text: depositAddress })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(depositAddress);
      toast.success("Address copied (share not supported on this device)");
    }
  };

  const handleSubmitDeposit = async () => {
    const rawAmt = parseFloat((amount || "0").replace(/,/g, ""));
    if (!rawAmt || rawAmt <= 0) { toast.error("Enter the amount you are depositing"); return; }
    if (rawAmt < selectedCrypto.minDeposit) {
      toast.error(`Minimum deposit is ${selectedCrypto.minDeposit} ${selectedCrypto.symbol}`);
      return;
    }

    setLoading(true);
    try {
      const { transactionRef, status: txStatus } = await submitTransaction({
        type: "crypto_deposit",
        subType: "incoming",
        description: `Crypto Deposit — ${rawAmt} ${selectedCrypto.symbol}`,
        category: "Deposit",
        // We use a nominal $1 so it doesn't debit the account — admin will credit after confirmation
        amount: 0.01,
        fundingAccount: "checking",
        note: `${selectedCrypto.symbol} deposit of ${rawAmt} on ${network}${txHash ? ` | TxHash: ${txHash}` : ""}`,
        cryptoSymbol: selectedCrypto.symbol,
        cryptoAmount: rawAmt,
        toBank: selectedCrypto.network,
        toAccountNumber: depositAddress,
      });

      setSuccessData({
        amount: 0.01,
        transactionRef,
        fundingAccount: "checking",
        recipientName: `${rawAmt} ${selectedCrypto.symbol}`,
        status: txStatus,
      });
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit deposit request");
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="min-h-screen flex flex-col pb-24" style={{ background: t.pageBg }}>
        <div className="px-5 pt-10 pb-6 flex items-center gap-4">
          <button onClick={() => navigate({ to: "/" })} className="p-2">
            <ArrowLeft size={24} style={{ color: t.textPrimary }} />
          </button>
          <h1 className="text-xl font-bold flex-1 text-center" style={{ color: t.textPrimary }}>Crypto Deposit</h1>
          <div className="w-10" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-5 gap-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: "rgba(0,230,118,0.15)" }}>
            <CheckCircle2 size={40} style={{ color: "#00E676" }} />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold" style={{ color: t.textPrimary }}>Deposit Request Submitted</h2>
            <p className="text-sm" style={{ color: t.textMuted }}>
              Your {selectedCrypto.symbol} deposit has been received and is pending confirmation. Funds will be credited once the blockchain confirms the transaction.
            </p>
          </div>
          <div className="w-full p-5 rounded-2xl space-y-3" style={{ background: t.cardBg }}>
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: t.textMuted }}>Crypto</span>
              <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>{selectedCrypto.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: t.textMuted }}>Network</span>
              <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>{selectedCrypto.network}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: t.textMuted }}>Reference</span>
              <span className="text-sm font-mono font-semibold" style={{ color: t.accentCyan }}>{successData.transactionRef}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: t.textMuted }}>Status</span>
              <span className="text-sm font-semibold" style={{ color: "#FFAB00" }}>Pending Confirmation</span>
            </div>
          </div>
          <button onClick={() => navigate({ to: "/" })}
            className="w-full py-4 rounded-xl font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #38BDF8, #6366F1)" }}>
            Back to Home
          </button>
          <button onClick={() => { setSuccessData(null); setAmount(""); setTxHash(""); }}
            className="w-full py-3 rounded-xl font-semibold text-sm"
            style={{ color: t.textMuted }}>
            Make Another Deposit
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col pb-24" style={{ background: t.pageBg }}>
      {/* Header */}
      <div className="px-5 pt-10 pb-6 flex items-center gap-4">
        <button onClick={() => navigate({ to: "/" })} className="p-2">
          <ArrowLeft size={24} style={{ color: t.textPrimary }} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center" style={{ color: t.textPrimary }}>Crypto Deposit</h1>
        <div className="w-10" />
      </div>

      <div className="px-5 flex-1 space-y-5">

        {/* ── Step 1: Select Crypto ── */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: t.textMuted }}>Select Asset</label>
          <button
            onClick={() => setShowSelector(!showSelector)}
            className="w-full flex items-center justify-between p-4 rounded-2xl transition-all"
            style={{ background: t.cardBg, border: `1px solid ${t.border}` }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                style={{ background: selectedCrypto.color, color: "#fff" }}>
                {selectedCrypto.symbol.slice(0, 3)}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold" style={{ color: t.textPrimary }}>{selectedCrypto.name}</p>
                <p className="text-xs" style={{ color: t.textMuted }}>{selectedCrypto.network}</p>
              </div>
            </div>
            <ChevronDown size={18} style={{ color: t.textMuted, transform: showSelector ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>

          {/* Dropdown */}
          {showSelector && (
            <div className="mt-2 rounded-2xl overflow-hidden" style={{ background: t.cardBg, border: `1px solid ${t.border}` }}>
              {CRYPTOS.map((c) => (
                <button key={c.id}
                  onClick={() => { setSelectedCrypto(c); setShowSelector(false); }}
                  className="w-full flex items-center gap-3 p-4 transition-all border-b"
                  style={{
                    borderColor: "rgba(255,255,255,0.05)",
                    background: selectedCrypto.id === c.id ? `${t.accentCyan}10` : "transparent",
                  }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                    style={{ background: c.color, color: "#fff" }}>
                    {c.symbol.slice(0, 3)}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold" style={{ color: t.textPrimary }}>{c.name}</p>
                    <p className="text-xs" style={{ color: t.textMuted }}>{c.network}</p>
                  </div>
                  {selectedCrypto.id === c.id && <Check size={16} style={{ color: t.accentCyan }} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Step 2: Deposit Address + QR ── */}
        <div className="p-5 rounded-2xl space-y-5" style={{ background: t.cardBg, border: `1px solid ${t.border}` }}>
          <p className="text-sm font-semibold text-center" style={{ color: t.textMuted }}>
            Your {selectedCrypto.symbol} Deposit Address
          </p>

          {/* Real QR Code */}
          <div className="flex justify-center">
            <div className="p-4 rounded-2xl bg-white">
              <QRCode value={depositAddress} size={180} level="H" />
            </div>
          </div>

          {/* Address */}
          <div className="p-3 rounded-xl flex items-start gap-2" style={{ background: t.inputBg }}>
            <p className="flex-1 text-xs font-mono break-all leading-relaxed" style={{ color: t.textPrimary }}>
              {depositAddress}
            </p>
          </div>

          {/* Copy + Share */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleCopy}
              className="py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
              style={{ background: t.inputBg, color: t.accentCyan, border: `1px solid ${t.accentCyan}40` }}>
              <Copy size={16} /> Copy Address
            </button>
            <button onClick={handleShare}
              className="py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 text-white"
              style={{ background: "linear-gradient(135deg, #38BDF8, #6366F1)" }}>
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>

        {/* ── Warning ── */}
        <div className="p-4 rounded-2xl flex items-start gap-3"
          style={{ background: "rgba(255,171,0,0.08)", border: "1px solid rgba(255,171,0,0.3)" }}>
          <AlertTriangle size={18} style={{ color: "#FFAB00", flexShrink: 0, marginTop: 1 }} />
          <p className="text-xs leading-relaxed" style={{ color: "#FFAB00" }}>
            {selectedCrypto.warning}
          </p>
        </div>

        {/* ── Deposit Info ── */}
        <div className="p-4 rounded-2xl space-y-3" style={{ background: t.cardBg, border: `1px solid ${t.border}` }}>
          {[
            { label: "Minimum Deposit",       value: `${selectedCrypto.minDeposit} ${selectedCrypto.symbol}` },
            { label: "Confirmations Required", value: `${selectedCrypto.confirmations} Confirmations`        },
            { label: "Estimated Arrival",      value: selectedCrypto.arrivalTime                             },
            { label: "Network Fee",            value: "Covered by sender"                                    },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-sm" style={{ color: t.textMuted }}>{label}</span>
              <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>{value}</span>
            </div>
          ))}
        </div>

        {/* ── Step 3: Confirm Deposit ── */}
        <div className="p-5 rounded-2xl space-y-4" style={{ background: t.cardBg, border: `1px solid ${t.border}` }}>
          <p className="text-sm font-semibold" style={{ color: t.textPrimary }}>Confirm Your Deposit</p>
          <p className="text-xs" style={{ color: t.textMuted }}>
            After sending, enter the amount below so we can credit your account after confirmation.
          </p>

          {/* Amount sent */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: t.textMuted }}>
              Amount Sent ({selectedCrypto.symbol}) *
            </label>
            <div className="relative">
              <input type="text" inputMode="decimal"
                value={amount}
                onChange={(e) => { setAmount(formatAmountDisplay(e.target.value)); setAmountBlurred(false); }}
                onBlur={() => setAmountBlurred(true)}
                placeholder={`e.g. ${selectedCrypto.minDeposit}`}
                className="w-full px-4 py-3.5 rounded-xl outline-none font-mono"
                style={{ background: t.inputBg, color: t.textPrimary, border: `1px solid ${amountBlurred && !amount ? "#FF4D6A50" : t.border}` }}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold"
                style={{ color: t.textMuted }}>
                {selectedCrypto.symbol}
              </span>
            </div>
            {amountBlurred && amount && parseFloat(amount.replace(/,/g, "")) < selectedCrypto.minDeposit && (
              <p className="text-xs mt-1" style={{ color: "#FF4D6A" }}>
                Minimum deposit: {selectedCrypto.minDeposit} {selectedCrypto.symbol}
              </p>
            )}
          </div>

          {/* Transaction hash (optional) */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: t.textMuted }}>
              Transaction Hash / TxID (optional but recommended)
            </label>
            <input type="text"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="Paste the transaction hash from your wallet"
              className="w-full px-4 py-3.5 rounded-xl outline-none font-mono text-xs"
              style={{ background: t.inputBg, color: t.textPrimary, border: `1px solid ${t.border}` }}
            />
          </div>

          {/* Network confirmation */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: t.textMuted }}>Network</label>
            <div className="px-4 py-3.5 rounded-xl flex items-center justify-between"
              style={{ background: t.inputBg, border: `1px solid ${t.border}` }}>
              <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>{selectedCrypto.network}</span>
              <div className="w-2 h-2 rounded-full" style={{ background: "#00E676" }} />
            </div>
          </div>

          <button
            onClick={handleSubmitDeposit}
            disabled={!amount || parseFloat(amount.replace(/,/g, "")) <= 0 || loading}
            className="w-full py-4 rounded-xl font-semibold text-white transition-all"
            style={{
              background: "linear-gradient(135deg, #38BDF8, #6366F1)",
              opacity: !amount || parseFloat(amount.replace(/,/g, "")) <= 0 || loading ? 0.5 : 1,
            }}>
            {loading ? "Submitting…" : `Confirm ${selectedCrypto.symbol} Deposit`}
          </button>
        </div>

        {/* ── Recent Deposits ── */}
        <div className="space-y-3">
          <p className="text-sm font-semibold" style={{ color: t.textMuted }}>Recent Crypto Deposits</p>
          {recentDeposits.length === 0 ? (
            <div className="p-5 rounded-2xl text-center" style={{ background: t.cardBg, border: `1px solid ${t.border}` }}>
              <p className="text-sm" style={{ color: t.textMuted }}>No crypto deposits yet</p>
            </div>
          ) : (
            recentDeposits.map((tx) => {
              const badge = getStatusBadge(tx.status);
              const BadgeIcon = badge.icon;
              // Parse crypto symbol from description e.g. "Crypto Deposit — 0.5 BTC"
              const descParts = tx.description?.match(/(\d+\.?\d*)\s+([A-Z]+)/);
              const cryptoAmt  = descParts?.[1] || "";
              const cryptoSym  = descParts?.[2] || tx.cryptoSymbol || "CRYPTO";
              return (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl"
                  style={{ background: t.cardBg, border: `1px solid ${t.border}` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs"
                      style={{ background: CRYPTOS.find(c => c.symbol === cryptoSym)?.color || t.accentCyan, color: "#fff" }}>
                      {cryptoSym.slice(0, 3)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                        {cryptoAmt ? `${cryptoAmt} ${cryptoSym}` : tx.description}
                      </p>
                      <p className="text-xs" style={{ color: t.textMuted }}>
                        {tx.createdAt instanceof Date
                          ? tx.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          : "—"}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-1"
                    style={{ background: badge.bg, color: badge.color }}>
                    <BadgeIcon size={11} />
                    {badge.text}
                  </span>
                </div>
              );
            })
          )}
        </div>

      </div>
      <BottomNav />
    </div>
  );
}
