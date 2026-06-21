import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "../hooks/use-theme";
import { themeColors } from "../utils/theme";
import { BottomNav } from "../dashboard/components/BottomNav";

export const Route = createFileRoute("/crypto-deposit")({
  head: () => ({ meta: [{ title: "Crypto Deposit - Nexus Bank" }] }),
  component: CryptoDeposit,
});

const cryptos = [
  { id: "btc",  symbol: "BTC",  name: "Bitcoin",   address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", network: "Bitcoin Network",   minDeposit: 0.0001 },
  { id: "eth",  symbol: "ETH",  name: "Ethereum",  address: "0x71C7656EC7ab88b098defB751B7401B5f6d8F726",  network: "Ethereum Network",  minDeposit: 0.01   },
  { id: "sol",  symbol: "SOL",  name: "Solana",    address: "G5YQ5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q",   network: "Solana Network",    minDeposit: 0.1    },
  { id: "usdt", symbol: "USDT", name: "Tether",    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",  network: "TRC20 Network",     minDeposit: 10     },
];

const recentDeposits = [
  { id: 1, crypto: "BTC", amount: 0.5,  status: "Confirmed", date: "2 days ago" },
  { id: 2, crypto: "ETH", amount: 2,    status: "Pending",   date: "1 day ago"  },
];

function CryptoDeposit() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const t = themeColors(theme);
  const [selectedCrypto, setSelectedCrypto] = useState(cryptos[0]);

  return (
    <div className="min-h-screen w-full flex flex-col pb-24" style={{ background: t.pageBg }}>
      <div className="px-5 pt-10 pb-6 flex items-center gap-4">
        <button onClick={() => navigate({ to: "/" })} className="p-2">
          <ArrowLeft size={24} style={{ color: t.textPrimary }} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center" style={{ color: t.textPrimary }}>Crypto Deposit</h1>
        <div className="w-10" />
      </div>

      <div className="px-5 flex-1 space-y-6">
        <p className="text-sm text-center" style={{ color: t.textMuted }}>
          Send crypto to the address below. Deposits are credited after network confirmation.
        </p>

        {/* Selector */}
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          {cryptos.map((c) => (
            <button key={c.id} onClick={() => setSelectedCrypto(c)}
              className="flex-shrink-0 px-4 py-3 rounded-2xl border transition-all"
              style={{
                background: t.cardBg,
                borderColor: selectedCrypto.id === c.id ? t.accentCyan : t.border,
                boxShadow: selectedCrypto.id === c.id ? `0 0 0 3px ${t.accentCyan}25` : "none",
              }}>
              <div className="text-lg font-bold" style={{ color: t.textPrimary }}>{c.symbol}</div>
            </button>
          ))}
        </div>

        {/* Address card */}
        <div className="p-6 rounded-2xl" style={{ background: t.cardBg, border: `1px solid ${t.border}` }}>
          <p className="text-sm font-semibold text-center mb-5" style={{ color: t.textMuted }}>
            Your {selectedCrypto.symbol} Deposit Address
          </p>
          <div className="w-48 h-48 mx-auto bg-white rounded-2xl mb-6 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full grid grid-cols-10 gap-0.5 p-2">
              {Array(100).fill(0).map((_, i) => (
                <div key={i} className="rounded-sm" style={{ background: i % 2 === 0 ? "#000" : "#fff" }} />
              ))}
            </div>
          </div>
          <p className="text-sm font-mono break-all text-center mb-6" style={{ color: t.textPrimary }}>
            {selectedCrypto.address}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => { navigator.clipboard.writeText(selectedCrypto.address); toast.success("Address copied!"); }}
              className="py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
              style={{ background: t.inputBg, color: t.accentCyan, border: `1px solid ${t.accentCyan}40` }}>
              <Copy size={18} /> Copy
            </button>
            <button onClick={() => toast.success("Address shared!")}
              className="py-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-white"
              style={{ background: t.gradientBtn }}>
              <Share2 size={18} /> Share
            </button>
          </div>
        </div>

        {/* Warning */}
        <div className="p-4 rounded-2xl flex items-start gap-3"
          style={{ background: `${t.accentYellow}10`, borderLeft: `4px solid ${t.accentYellow}` }}>
          <span>⚠️</span>
          <p className="text-sm" style={{ color: t.accentYellow }}>
            Only send {selectedCrypto.symbol} on the {selectedCrypto.network}. Sending other assets may result in permanent loss.
          </p>
        </div>

        {/* Info */}
        <div className="p-5 rounded-2xl space-y-3" style={{ background: t.cardBg, border: `1px solid ${t.border}` }}>
          {[
            ["Minimum Deposit", `${selectedCrypto.minDeposit} ${selectedCrypto.symbol}`],
            ["Confirmations Required", "3 Confirmations"],
            ["Estimated Arrival", "10-30 minutes"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <span className="text-sm" style={{ color: t.textMuted }}>{label}</span>
              <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Recent */}
        <div className="space-y-3">
          <span className="text-sm font-semibold" style={{ color: t.textMuted }}>Recent Deposits</span>
          {recentDeposits.map((d) => (
            <div key={d.id} className="flex items-center justify-between p-4 rounded-2xl"
              style={{ background: t.cardBg, border: `1px solid ${t.border}` }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ background: t.accentCyan, color: "#0B1120" }}>{d.crypto}</div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: t.textPrimary }}>{d.amount} {d.crypto}</p>
                  <span className="text-xs" style={{ color: t.textMuted }}>{d.date}</span>
                </div>
              </div>
              <span className="text-xs px-3 py-1 rounded-full font-semibold"
                style={{
                  background: d.status === "Confirmed" ? `${t.accentGreen}20` : `${t.accentYellow}20`,
                  color: d.status === "Confirmed" ? t.accentGreen : t.accentYellow,
                }}>
                {d.status}
              </span>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
