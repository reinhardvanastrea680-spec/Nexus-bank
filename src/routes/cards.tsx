import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CreditCard, Plus, MessageSquare } from "lucide-react";
import { useTheme } from "../hooks/use-theme";
import { themeColors } from "../utils/theme";
import { BottomNav } from "../dashboard/components/BottomNav";
import { useUserAccount } from "../dashboard/hooks/useUserAccount";

export const Route = createFileRoute("/cards")({
  head: () => ({ meta: [{ title: "Cards - Nexus Bank" }] }),
  component: CardsPage,
});

function CardsPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const t = themeColors(theme);
  const { account } = useUserAccount();

  const tier = account?.accountTier || "Standard";

  // Card gradient by tier
  const cardGradients: Record<string, string> = {
    Standard:  "linear-gradient(135deg, #1A2438 0%, #2D3A52 100%)",
    Bronze:    "linear-gradient(135deg, #7B4A2A 0%, #C47B3C 100%)",
    Silver:    "linear-gradient(135deg, #475569 0%, #94A3B8 100%)",
    Gold:      "linear-gradient(135deg, #92400E 0%, #FBBF24 100%)",
    Platinum:  "linear-gradient(135deg, #1e3a5f 0%, #38BDF8 100%)",
    VIP:       "linear-gradient(135deg, #4C1D95 0%, #7C3AED 100%)",
    Elite:     "linear-gradient(135deg, #064E3B 0%, #10B981 100%)",
    Diamond:   "linear-gradient(135deg, #0F172A 0%, #38BDF8 50%, #6366F1 100%)",
  };

  const cardGradient = cardGradients[tier] || cardGradients.Standard;

  const cardNumber = account?.checkingAccountNumber
    ? `**** **** **** ${account.checkingAccountNumber.slice(-4)}`
    : "**** **** **** ****";

  return (
    <div className="min-h-screen w-full flex flex-col pb-24" style={{ background: t.pageBg }}>
      {/* Header */}
      <div className="px-5 pt-10 pb-6 flex items-center gap-4">
        <button onClick={() => navigate({ to: "/" })} className="p-2">
          <ArrowLeft size={24} style={{ color: t.textOnBg }} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center" style={{ color: t.textOnBg }}>
          My Cards
        </h1>
        <div className="w-10" />
      </div>

      <div className="px-5 flex-1 space-y-6">
        {/* Virtual Card Display */}
        <div className="relative w-full rounded-3xl p-6 overflow-hidden"
          style={{
            background: cardGradient,
            minHeight: 200,
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          }}>
          {/* Decorative circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-10"
            style={{ background: "rgba(255,255,255,0.5)" }} />
          <div className="absolute -bottom-16 -left-8 w-56 h-56 rounded-full opacity-10"
            style={{ background: "rgba(255,255,255,0.3)" }} />

          <div className="relative z-10">
            {/* Bank name + tier */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-white/70 text-xs tracking-widest uppercase">Nexus Bank</p>
                <p className="text-white text-sm font-bold mt-0.5">{tier} Card</p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" }}>
                <CreditCard size={20} style={{ color: "white" }} />
              </div>
            </div>

            {/* Card Number */}
            <p className="text-white font-mono text-lg tracking-widest mb-6">{cardNumber}</p>

            {/* Cardholder + Expiry */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Card Holder</p>
                <p className="text-white text-sm font-semibold">{account?.fullName || "Account Holder"}</p>
              </div>
              <div className="text-right">
                <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Expires</p>
                <p className="text-white text-sm font-semibold">12/28</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card Details */}
        <div className="p-5 rounded-2xl space-y-3" style={{ background: t.cardBg, border: `1px solid ${t.border}` }}>
          <p className="text-sm font-bold" style={{ color: t.textPrimary }}>Card Details</p>
          {[
            { label: "Card Type", value: "Virtual Debit Card" },
            { label: "Account Tier", value: tier },
            { label: "Status", value: account?.status === "active" ? "✅ Active" : "❌ Frozen" },
            { label: "Currency", value: account?.dashboardCurrency || "USD" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-2 border-b"
              style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <span className="text-sm" style={{ color: t.textMuted }}>{label}</span>
              <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Connected Cards — Contact Support */}
        <div className="p-5 rounded-2xl" style={{ background: t.cardBg, border: `1px dashed ${t.accentCyan}40` }}>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
              style={{ background: t.inputBg }}>💳</div>
            <p className="text-sm font-semibold" style={{ color: t.textPrimary }}>No physical cards connected yet</p>
            <p className="text-xs" style={{ color: t.textMuted }}>
              To request a physical card or link an existing card, please contact support.
            </p>
            <button
              onClick={() => navigate({ to: "/support" })}
              className="mt-2 flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white"
              style={{ background: "linear-gradient(135deg, #38BDF8, #6366F1)" }}>
              <MessageSquare size={15} />
              Contact Support
            </button>
          </div>
        </div>
      </div>

      <BottomNav active="cards" />
    </div>
  );
}
