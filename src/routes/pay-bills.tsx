import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Search, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "../hooks/use-theme";
import { themeColors } from "../utils/theme";
import { BottomNav } from "../dashboard/components/BottomNav";
import { useUserAccount } from "../dashboard/hooks/useUserAccount";
import { submitTransaction } from "../dashboard/functions/submitTransaction";
import { TransactionSuccessScreen } from "../dashboard/components/TransactionSuccessScreen";

export const Route = createFileRoute("/pay-bills")({
  head: () => ({ meta: [{ title: "Pay Bills - Nexus Bank" }] }),
  component: PayBills,
});

const categories = [
  { id: "electricity", name: "Electricity",          icon: "⚡" },
  { id: "internet",    name: "Internet",             icon: "🌐" },
  { id: "mobile",      name: "Mobile Recharge",      icon: "📱" },
  { id: "cable",       name: "Cable TV",             icon: "📺" },
  { id: "insurance",   name: "Insurance",            icon: "🛡️" },
  { id: "credit-card", name: "Credit Card",          icon: "💳" },
  { id: "tax",         name: "Tax Payments",         icon: "📋" },
  { id: "subscription",name: "Subscriptions",        icon: "🔄" },
  { id: "government",  name: "Government Services",  icon: "🏛️" },
  { id: "education",   name: "Education",            icon: "🎓" },
];

const billers = [
  // United States
  { id: "comcast",     name: "Comcast Xfinity",           category: "internet",     initials: "CX", country: "United States"  },
  { id: "verizon",     name: "Verizon Wireless",          category: "mobile",       initials: "VZ", country: "United States"  },
  { id: "att",         name: "AT&T",                      category: "mobile",       initials: "AT", country: "United States"  },
  { id: "tmobile",     name: "T-Mobile",                  category: "mobile",       initials: "TM", country: "United States"  },
  { id: "geico",       name: "GEICO Insurance",           category: "insurance",    initials: "GI", country: "United States"  },
  { id: "irs",         name: "IRS Payments",              category: "tax",          initials: "IR", country: "United States"  },
  { id: "chase",       name: "Chase Credit Card",         category: "credit-card",  initials: "CH", country: "United States"  },
  { id: "duke-energy", name: "Duke Energy",               category: "electricity",  initials: "DE", country: "United States"  },
  { id: "pg-e",        name: "PG&E",                      category: "electricity",  initials: "PE", country: "United States"  },
  { id: "american-water", name: "American Water",         category: "electricity",  initials: "AW", country: "United States"  },
  // United Kingdom
  { id: "bt",          name: "BT Broadband",              category: "internet",     initials: "BT", country: "United Kingdom" },
  { id: "o2",          name: "O2 UK",                     category: "mobile",       initials: "O2", country: "United Kingdom" },
  { id: "sky",         name: "Sky UK",                    category: "cable",        initials: "SK", country: "United Kingdom" },
  { id: "ee",          name: "EE Mobile",                 category: "mobile",       initials: "EE", country: "United Kingdom" },
  { id: "hmrc",        name: "HMRC Tax",                  category: "tax",          initials: "HM", country: "United Kingdom" },
  { id: "british-gas",  name: "British Gas",               category: "electricity",  initials: "BG", country: "United Kingdom" },
  { id: "thames-water", name: "Thames Water",             category: "electricity",  initials: "TW", country: "United Kingdom" },
  // Europe
  { id: "edf",         name: "EDF Energy",                category: "electricity",  initials: "ED", country: "Europe"         },
  { id: "orange",      name: "Orange",                    category: "mobile",       initials: "OR", country: "Europe"         },
  { id: "vodafone",    name: "Vodafone",                  category: "mobile",       initials: "VF", country: "Global"         },
  // Canada
  { id: "rogers",      name: "Rogers Communications",     category: "mobile",       initials: "RG", country: "Canada"         },
  { id: "bell",        name: "Bell Canada",               category: "internet",     initials: "BL", country: "Canada"         },
  // Australia
  { id: "telstra",     name: "Telstra",                   category: "mobile",       initials: "TS", country: "Australia"      },
  { id: "optus",       name: "Optus",                     category: "mobile",       initials: "OP", country: "Australia"      },
  // Global subscriptions
  { id: "netflix",     name: "Netflix",                   category: "subscription", initials: "NF", country: "Global"         },
  { id: "spotify",     name: "Spotify",                   category: "subscription", initials: "SP", country: "Global"         },
  { id: "amazon",      name: "Amazon Prime",              category: "subscription", initials: "AP", country: "Global"         },
  { id: "apple-music", name: "Apple Music",               category: "subscription", initials: "AM", country: "Global"         },
  { id: "disney",      name: "Disney+",                   category: "subscription", initials: "DP", country: "Global"         },
  { id: "hbo",         name: "HBO Max",                   category: "subscription", initials: "HB", country: "Global"         },
  { id: "school-fees", name: "University Fees",           category: "education",    initials: "UF", country: "Global"         },
  { id: "microsoft",   name: "Microsoft 365",             category: "subscription", initials: "MS", country: "Global"         },
];

function formatCurrency(v: number) {
  return v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatAmountDisplay(val: string): string {
  // Strip everything except digits and first decimal point
  const clean = val.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
  const [int, dec] = clean.split(".");
  const formatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return dec !== undefined ? `${formatted}.${dec}` : formatted;
}

function PayBills() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const t = themeColors(theme);
  const { account } = useUserAccount();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBiller, setSelectedBiller] = useState<(typeof billers)[0] | null>(null);
  const [searchQuery, setSearchQuery]   = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [customerVerified, setCustomerVerified] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount]             = useState("");
  const [selectedAccount, setSelectedAccount] = useState<"Checking" | "Savings">("Checking");
  const [showConfirm, setShowConfirm]   = useState(false);
  const [loading, setLoading]           = useState(false);
  const [successData, setSuccessData]   = useState<{ amount: number; transactionRef: string; fundingAccount: string; recipientName: string; status: string } | null>(null);

  const fromBalance = selectedAccount === "Checking" ? account?.checkingBalance || 0 : account?.savingsBalance || 0;

  const filteredBillers = billers.filter((b) => {
    const matchesCat    = !selectedCategory || b.category === selectedCategory;
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleConfirm = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      const { transactionRef, status: txStatus } = await submitTransaction({
        type: "bill_payment", subType: "outgoing",
        description: `Bill Payment - ${selectedBiller?.name}`,
        category: categories.find((c) => c.id === selectedBiller?.category)?.name || "Bills",
        amount: parseFloat(amount.replace(/,/g,"")),
        fundingAccount: selectedAccount.toLowerCase() as "checking" | "savings",
        recipientName: selectedBiller?.name || "Biller",
        note: `Customer Ref: ${customerNumber}`,
      });
      setSuccessData({ amount: parseFloat(amount.replace(/,/g,"")), transactionRef, status: txStatus, fundingAccount: selectedAccount, recipientName: selectedBiller?.name || "Biller" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed");
    } finally { setLoading(false); }
  };

  if (successData) return <TransactionSuccessScreen {...successData} transactionType="bill_payment" />;

  /* ── Biller detail / payment page ── */
  if (selectedBiller) return (
    <div className="min-h-screen w-full flex flex-col pb-24" style={{ background: t.pageBg }}>
      <div className="px-5 pt-10 pb-6 flex items-center gap-4">
        <button onClick={() => setSelectedBiller(null)} className="p-2">
          <ArrowLeft size={24} style={{ color: t.textPrimary }} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center" style={{ color: t.textPrimary }}>{selectedBiller.name}</h1>
        <div className="w-10" />
      </div>

      <div className="px-5 flex-1 space-y-6">
        {/* Customer number */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold" style={{ color: t.textMuted }}>Customer Number / Reference</label>
          <div className="space-y-3">
            <input type="text" value={customerNumber} onChange={(e) => { setCustomerNumber(e.target.value); setCustomerVerified(false); setCustomerName(""); }}
              placeholder="Enter customer number" className="w-full px-4 py-4 rounded-xl outline-none"
              style={{ background: t.inputBg, color: t.textPrimary, border: `1px solid ${t.border}` }} />
            {customerNumber.trim().length >= 4 && (
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: t.textMuted }}>Customer Name *</label>
                <input type="text" value={customerName}
                  onChange={(e) => { setCustomerName(e.target.value); setCustomerVerified(false); }}
                  onBlur={() => { if (customerName.trim().length >= 2) setCustomerVerified(true); }}
                  placeholder="Enter customer name"
                  className="w-full px-4 py-4 rounded-xl outline-none"
                  style={{ background: t.inputBg, color: t.textPrimary, border: `1px solid ${t.border}` }} />
              </div>
            )}
            {customerVerified && customerName.trim().length >= 2 && (
              <div className="p-4 rounded-xl flex items-center gap-3"
                style={{ background: "rgba(0,230,118,0.1)", border: "1px solid rgba(0,230,118,0.3)" }}>
                <CheckCircle2 size={20} style={{ color: t.accentGreen }} />
                <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>Customer Verified — {customerName.trim()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Amount */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold" style={{ color: t.textMuted }}>Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-mono" style={{ color: t.textMuted }}>$</span>
            <input type="text" inputMode="decimal" value={amount} onChange={(e) => setAmount(formatAmountDisplay(e.target.value))} placeholder="0.00"
              className="w-full pl-10 pr-4 py-4 rounded-xl text-xl font-mono outline-none"
              style={{ background: t.inputBg, color: t.textPrimary, border: `1px solid ${t.border}` }} />
          </div>
        </div>

        {/* Pay From */}
        <div className="p-5 rounded-2xl" style={{ background: t.cardBg, border: `1px solid ${t.border}` }}>
          <label className="block text-sm font-semibold mb-4" style={{ color: t.textMuted }}>Pay From</label>
          <div className="flex gap-3">
            {(["Checking", "Savings"] as const).map((acc) => (
              <button key={acc} onClick={() => setSelectedAccount(acc)} className="flex-1 py-3 px-4 rounded-xl font-bold transition-all"
              style={{ background: selectedAccount === acc ? t.accentCyan : t.inputBg, color: selectedAccount === acc ? t.pageBg : t.textMuted }}>
                {acc}
              </button>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: t.textMuted }}>Available: ${formatCurrency(fromBalance)}</p>
        </div>
      </div>

      <div className="px-5 pb-8">
        <button onClick={() => { if (!amount || parseFloat(amount.replace(/,/g,"")) <= 0) { toast.error("Enter valid amount"); return; } if (parseFloat(amount.replace(/,/g,"")) > fromBalance) { toast.error("Insufficient funds"); return; } setShowConfirm(true); }}
          disabled={!customerVerified || !customerName.trim() || !amount || parseFloat(amount.replace(/,/g,"")) <= 0}
          className="w-full py-4 rounded-xl font-semibold text-white"
          style={{ background: t.gradientBtn, opacity: !customerVerified || !customerName.trim() || !amount || parseFloat(amount.replace(/,/g,"")) <= 0 ? 0.5 : 1 }}>
          Continue to Payment
        </button>
      </div>

      {/* Confirm sheet */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)" }} onClick={() => setShowConfirm(false)} />
          <div className="relative w-full p-6 rounded-t-[28px]" style={{ background: t.cardBg }}>
            <div className="w-12 h-1 rounded-full mx-auto mb-6" style={{ background: t.mutedBg }} />
            <h3 className="text-xl font-bold mb-6 text-center" style={{ color: t.textPrimary }}>Confirm Payment</h3>
            <div className="space-y-4 mb-8">
              {[["Biller", selectedBiller.name], ["Amount", `$${formatCurrency(parseFloat(amount.replace(/,/g,"") || "0"))}`]].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-sm" style={{ color: t.textMuted }}>{label}</span>
                  <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>{value}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setShowConfirm(false)} className="py-4 rounded-xl font-semibold"
                style={{ background: t.inputBg, color: t.textMuted }}>Cancel</button>
              <button onClick={handleConfirm} disabled={loading} className="py-4 rounded-xl font-semibold text-white"
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

  /* ── Biller list page ── */
  return (
    <div className="min-h-screen w-full flex flex-col pb-24" style={{ background: t.pageBg }}>
      <div className="px-5 pt-10 pb-6 flex items-center gap-4">
        <button onClick={() => navigate({ to: "/" })} className="p-2">
          <ArrowLeft size={24} style={{ color: t.textPrimary }} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center" style={{ color: t.textPrimary }}>Pay Bills</h1>
        <div className="w-10" />
      </div>

      <div className="px-5 flex-1 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: t.textMuted }} />
          <input type="text" placeholder="Search billers or countries..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl outline-none"
            style={{ background: t.inputBg, color: t.textPrimary, border: `1px solid ${t.border}` }} />
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          <button onClick={() => setSelectedCategory(null)} className="flex-shrink-0 px-4 py-2 rounded-full font-semibold"
            style={{ background: !selectedCategory ? t.accentCyan : t.inputBg, color: !selectedCategory ? t.pageBg : t.textMuted }}>
            All
          </button>
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
              className="flex-shrink-0 px-4 py-2 rounded-full font-semibold flex items-center gap-2"
              style={{ background: selectedCategory === cat.id ? t.accentCyan : t.inputBg, color: selectedCategory === cat.id ? t.pageBg : t.textMuted }}>
              <span>{cat.icon}</span>{cat.name}
            </button>
          ))}
        </div>

        {/* Billers grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredBillers.map((biller) => (
            <button key={biller.id} onClick={() => setSelectedBiller(biller)}
              className="p-6 rounded-2xl text-center transition-all"
              style={{ background: t.cardBg, border: `1px solid ${t.border}` }}>
              <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-lg"
                style={{ background: t.accentCyan, color: t.pageBg }}>
                {biller.initials}
              </div>
              <div className="text-sm font-semibold" style={{ color: t.textPrimary }}>{biller.name}</div>
              <div className="text-xs mt-1" style={{ color: t.textMuted }}>
                {categories.find((c) => c.id === biller.category)?.name} • {biller.country}
              </div>
            </button>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
