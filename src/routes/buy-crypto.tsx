import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Settings,
  Bell,
  Home as HomeIcon,
  History,
  Headphones,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "../hooks/use-theme";
import { themeColors } from "../utils/theme";
import { BottomNav } from "../dashboard/components/BottomNav";
import { useUserAccount } from "../dashboard/hooks/useUserAccount";
import { submitTransaction } from "../dashboard/functions/submitTransaction";
import { TransactionSuccessScreen } from "../dashboard/components/TransactionSuccessScreen";

export const Route = createFileRoute("/buy-crypto")({
  head: () => ({ meta: [{ title: "Buy Crypto - Nexus Bank" }] }),
  component: BuyCrypto,
});

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  icon: string;
}

const initialCryptos: CryptoData[] = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 68000, change: 0, icon: "₿" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3600, change: 0, icon: "Ξ" },
  { id: "solana", name: "Solana", symbol: "SOL", price: 180, change: 0, icon: "◎" },
  { id: "tether", name: "USDT", symbol: "USDT", price: 1, change: 0, icon: "₮" },
  { id: "binancecoin", name: "BNB", symbol: "BNB", price: 580, change: 0, icon: "BNB" },
  { id: "ripple", name: "XRP", symbol: "XRP", price: 0.55, change: 0, icon: "XRP" },
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

function BuyCrypto() {
  
  const { theme } = useTheme();
  const navigate = useNavigate();
  const t = themeColors(theme);
  const { account } = useUserAccount();

  const [cryptos, setCryptos] = useState<CryptoData[]>(initialCryptos);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData>(initialCryptos[0]);
  const [amount, setAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<"Checking" | "Savings" | "Investment">("Checking");
  const [showConfirm, setShowConfirm] = useState(false);
  const [successData, setSuccessData] = useState<{
    amount: number;
    transactionRef: string;
    fundingAccount: string;
    recipientName: string;
    status: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingRates, setFetchingRates] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fromBalance =
    selectedAccount === "Checking" ? account?.checkingBalance || 0 :
    selectedAccount === "Savings" ? account?.savingsBalance || 0 :
    account?.investmentBalance || 0;
  const cryptoAmount =
    amount && selectedCrypto.price ? (parseFloat(amount.replace(/,/g, "") || "0") / selectedCrypto.price).toFixed(6) : "0";

  // Fetch real-time crypto rates from CoinGecko
  const fetchCryptoRates = async () => {
    setFetchingRates(true);
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tether,binancecoin,ripple&vs_currencies=usd&include_24hr_change=true",
      );
      const data = await response.json();

      setCryptos((prev) =>
        prev.map((crypto) => {
          const apiData = data[crypto.id];
          if (apiData) {
            return {
              ...crypto,
              price: apiData.usd,
              change: apiData.usd_24h_change || 0,
            };
          }
          return crypto;
        }),
      );

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching crypto rates:", error);
      toast.error("Failed to fetch crypto rates, using cached data");
    } finally {
      setFetchingRates(false);
    }
  };

  useEffect(() => {
    fetchCryptoRates();
    // Refresh rates every 5 minutes
    const interval = setInterval(fetchCryptoRates, 300000);
    return () => clearInterval(interval);
  }, []);

  // Update selected crypto when rates refresh
  useEffect(() => {
    const updatedSelected = cryptos.find((c) => c.id === selectedCrypto.id);
    if (updatedSelected) {
      setSelectedCrypto(updatedSelected);
    }
  }, [cryptos]);

  const handleBuy = () => {
    if (!amount || parseFloat(amount.replace(/,/g,"")) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (parseFloat(amount.replace(/,/g,"")) > fromBalance) {
      toast.error("Insufficient funds");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setLoading(true);

    try {
      const cryptoQty = amount && selectedCrypto.price ? parseFloat(amount.replace(/,/g,"")) / selectedCrypto.price : 0;
      const { transactionRef, status: txStatus } = await submitTransaction({
        type: "buy_crypto",
        subType: "outgoing",
        description: `Bought ${cryptoQty.toFixed(6)} ${selectedCrypto.symbol} for $${formatCurrency(parseFloat(amount.replace(/,/g,"")))}`,
        category: "Crypto",
        amount: parseFloat(amount.replace(/,/g,"")),
        fundingAccount: selectedAccount.toLowerCase() as "checking" | "savings",
        cryptoId: selectedCrypto.id,
        cryptoSymbol: selectedCrypto.symbol,
        cryptoAmount: cryptoQty,
        fiatAmount: parseFloat(amount.replace(/,/g,"")),
        priceAtTime: selectedCrypto.price,
      });

      setSuccessData({
        amount: parseFloat(amount.replace(/,/g,"")),
        transactionRef,
        status: txStatus,
        fundingAccount: selectedAccount,
        recipientName: `${cryptoQty.toFixed(6)} ${selectedCrypto.symbol}`,
      });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to submit purchase");
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
        transactionType="buy_crypto"
      />
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col pb-24" style={{ background: t.pageBg }}>
      {/* Header */}
      <div className="px-5 pt-10 pb-6 flex items-center gap-4">
        <button onClick={() => navigate({ to: "/" })} className="p-2">
          <ArrowLeft size={24} style={{ color: t.textOnBg }} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center" style={{ color: t.textOnBg }}>
          Buy Crypto
        </h1>
        <button onClick={fetchCryptoRates} disabled={fetchingRates} className="p-2">
          <RefreshCw
            size={20}
            style={{ color: fetchingRates ? "#8A9BB5" : "#38BDF8" }}
            className={fetchingRates ? "animate-spin" : ""}
          />
        </button>
      </div>

      {/* Last Updated */}
      <div className="px-5 pb-4">
        <p className="text-xs text-center" style={{ color: t.textMutedOnBg }}>
          {lastUpdated
            ? `Rates last updated: ${lastUpdated.toLocaleTimeString()}`
            : "Fetching rates..."}
        </p>
      </div>

      <div className="px-5 flex-1 space-y-6">
        {/* Crypto Selector */}
        <div>
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            {cryptos.map((crypto) => (
              <button
                key={crypto.id}
                onClick={() => setSelectedCrypto(crypto)}
                className="flex-shrink-0 px-4 py-3 rounded-2xl border transition-all"
                style={{
                  background: t.cardBg,
                  borderColor:
                    selectedCrypto.id === crypto.id ? "#38BDF8" : "rgba(255,255,255,0.07)",
                  boxShadow:
                    selectedCrypto.id === crypto.id ? "0 0 0 3px rgba(56,189,248,0.15)" : "none",
                }}
              >
                <div className="text-2xl mb-1">{crypto.icon}</div>
                <div className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                  {crypto.symbol}
                </div>
                <div className="text-xs" style={{ color: t.textMuted }}>
                  ${crypto.price.toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Crypto Details */}
        <div className="p-6 rounded-2xl text-center" style={{ background: t.cardBg }}>
          <div className="text-5xl mb-2">{selectedCrypto.icon}</div>
          <h2 className="text-xl font-bold mb-1" style={{ color: t.textPrimary }}>
            {selectedCrypto.name}
          </h2>
          <p className="text-2xl font-mono font-bold mb-3" style={{ color: t.textPrimary }}>
            $
            {selectedCrypto.price.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p
            className="text-sm font-semibold"
            style={{ color: selectedCrypto.change >= 0 ? "#00E676" : "#FF4D6A" }}
          >
            {selectedCrypto.change >= 0 ? "+" : ""}
            {selectedCrypto.change.toFixed(2)}% 24h
          </p>
        </div>

        {/* Amount Input */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold" style={{ color: t.textMutedOnBg }}>
            You Pay
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
              value={amount}
              onChange={(e) => setAmount(formatAmountDisplay(e.target.value))}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-4 rounded-xl text-xl font-mono outline-none"
              style={{ background: t.inputBg, color: t.textPrimary }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: t.textMutedOnBg }}>
              You Receive: {cryptoAmount} {selectedCrypto.symbol}
            </span>
            <span className="text-sm font-semibold" style={{ color: t.accentCyan }}>
              USD
            </span>
          </div>
        </div>

        {/* Payment Source */}
        <div className="p-5 rounded-2xl" style={{ background: t.cardBg }}>
          <label className="block text-sm font-semibold mb-4" style={{ color: t.textMuted }}>
            Pay From
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(["Checking", "Savings", "Investment"] as const).map((acc) => (
              <button
                key={acc}
                onClick={() => setSelectedAccount(acc)}
                className="py-3 px-2 rounded-xl font-bold transition-all text-sm"
                style={{
                  background: selectedAccount === acc ? t.accentCyan : t.inputBg,
                  color: selectedAccount === acc ? t.pageBg : t.textMuted,
                }}
              >
                {acc}
              </button>
            ))}
          </div>
          <div className="mt-4 text-center">
            <span className="text-sm" style={{ color: t.textMuted }}>
              ${formatCurrency(fromBalance)}
            </span>
          </div>
        </div>

        {/* Fee Breakdown */}
        <div className="p-5 rounded-2xl" style={{ background: t.inputBg }}>
          <div className="flex justify-between mb-2">
            <span className="text-sm" style={{ color: t.textMuted }}>
              Network Fee
            </span>
            <span className="text-sm font-mono" style={{ color: t.textMuted }}>
              $2.99
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm" style={{ color: t.textMuted }}>
              Platform Fee
            </span>
            <span className="text-sm font-mono" style={{ color: t.textMuted }}>
              $0.99
            </span>
          </div>
          <hr style={{ borderColor: "rgba(255,255,255,0.07)" }} className="my-3" />
          <div className="flex justify-between">
            <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>
              Total
            </span>
            <span className="text-lg font-mono font-bold" style={{ color: t.textPrimary }}>
            ${formatCurrency(parseFloat(amount.replace(/,/g,"") || "0") + 3.98)}
            </span>
          </div>
        </div>
      </div>

      {/* Buy Button */}
      <div className="px-5 pb-8">
        <button
          onClick={handleBuy}
          disabled={!amount || parseFloat(amount.replace(/,/g,"")) <= 0 || loading}
          className="w-full py-4 rounded-xl font-semibold transition-all"
          style={{
            background: "linear-gradient(135deg, #38BDF8, #6366F1)",
            color: "#FFFFFF",
            opacity: !amount || parseFloat(amount.replace(/,/g,"")) <= 0 || loading ? 0.5 : 1,
          }}
        >
          {loading ? "Submitting…" : "Buy Now"}
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
              Confirm Purchase
            </h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: t.textMuted }}>
                  Coin
                </span>
                <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                  {selectedCrypto.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: t.textMuted }}>
                  You Pay
                </span>
                <span className="text-lg font-mono font-bold" style={{ color: t.textPrimary }}>
                  ${formatCurrency(parseFloat(amount.replace(/,/g,"") || "0"))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: t.textMuted }}>
                  You Receive
                </span>
                <span className="text-lg font-mono font-bold" style={{ color: t.textPrimary }}>
                  {cryptoAmount} {selectedCrypto.symbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: t.textMuted }}>
                  Total
                </span>
                <span className="text-lg font-mono font-bold" style={{ color: t.textPrimary }}>
                  ${formatCurrency(parseFloat(amount.replace(/,/g,"") || "0") + 3.98)}
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
