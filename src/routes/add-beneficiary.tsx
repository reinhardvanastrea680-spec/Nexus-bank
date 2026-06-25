import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Plus, CheckCircle2, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { useBeneficiaries } from "../dashboard/hooks/useBeneficiaries";
import { useTheme } from "../hooks/use-theme";
import { themeColors } from "../utils/theme";
import { BottomNav } from "../dashboard/components/BottomNav";

export const Route = createFileRoute("/add-beneficiary")({
  head: () => ({ meta: [{ title: "Beneficiaries - Nexus Bank" }] }),
  component: AddBeneficiary,
});

const banks = [
  { id: "mtn", name: "MTN MoMo" },
  { id: "opay", name: "Opay" },
  { id: "kuda", name: "Kuda" },
  { id: "gtb", name: "GTBank" },
  { id: "access", name: "Access Bank" },
  { id: "zenith", name: "Zenith Bank" },
  { id: "first", name: "First Bank" },
  { id: "uba", name: "UBA" },
  { id: "stanbic", name: "Stanbic IBTC" },
  { id: "palmpay", name: "Palmpay" },
  { id: "moniepoint", name: "Moniepoint" },
  { id: "chase", name: "JPMorgan Chase" },
  { id: "bofa", name: "Bank of America" },
  { id: "wells", name: "Wells Fargo" },
  { id: "hsbc", name: "HSBC" },
  { id: "barclays", name: "Barclays" },
  { id: "deutsche", name: "Deutsche Bank" },
  { id: "other", name: "Other" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const avatarColors = [
  "#38BDF8", "#6366F1", "#00E676", "#FFAB00", "#FF4D6A",
  "#A855F7", "#EC4899", "#14B8A6", "#F97316",
];

function getAvatarColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

function AddBeneficiary() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const t = themeColors(theme);
  const { beneficiaries, loading, addBeneficiary, removeBeneficiary } = useBeneficiaries();

  const [fullName, setFullName] = useState("");
  const [selectedBankId, setSelectedBankId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [nickname, setNickname] = useState("");
  const [accountType, setAccountType] = useState<"Personal" | "Business">("Personal");
  const [saving, setSaving] = useState(false);

  // Detail sheet
  const [selectedBen, setSelectedBen] = useState<(typeof beneficiaries)[0] | null>(null);
  const [showSheet, setShowSheet] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const selectedBankName = banks.find((b) => b.id === selectedBankId)?.name || "";
  const canSave = fullName.trim() && selectedBankId && accountNumber.trim();

  const handleSave = async () => {
    if (!canSave) return;
    // Beneficiary saving requires admin approval — show support message
    toast.error("Trouble saving beneficiary. Please contact support.", { duration: 5000 });
  };

  const handleDelete = async () => {
    if (!selectedBen) return;
    setDeleting(true);
    try {
      await removeBeneficiary(selectedBen.id);
      toast.success("Beneficiary removed");
      setShowSheet(false);
      setSelectedBen(null);
    } catch (err) {
      toast.error("Failed to remove beneficiary");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col pb-24" style={{ background: t.pageBg }}>
      {/* Header */}
      <div className="px-5 pt-10 pb-6 flex items-center gap-4">
        <button onClick={() => navigate({ to: "/" })} className="p-2">
          <ArrowLeft size={24} style={{ color: t.textPrimary }} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center" style={{ color: t.textPrimary }}>
          Beneficiaries
        </h1>
        <div className="w-10" />
      </div>

      <div className="px-5 flex-1 space-y-6">

        {/* ── Saved Beneficiaries ── */}
        <div>
          <label className="block text-sm font-semibold mb-3" style={{ color: t.textMuted }}>
            Saved Beneficiaries {beneficiaries.length > 0 && `(${beneficiaries.length})`}
          </label>

          {loading ? (
            <p className="text-sm" style={{ color: t.textMuted }}>Loading...</p>
          ) : beneficiaries.length === 0 ? (
            <div
              className="p-5 rounded-2xl text-center"
              style={{ background: t.cardBg, border: `1px dashed ${t.accentCyan}40` }}
            >
              <User size={32} className="mx-auto mb-2" style={{ color: t.accentCyan, opacity: 0.5 }} />
              <p className="text-sm font-medium" style={{ color: t.textMuted }}>
                No saved beneficiaries yet
              </p>
              <p className="text-xs mt-1" style={{ color: t.textMuted, opacity: 0.6 }}>
                Fill in the form below to add one
              </p>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {beneficiaries.map((ben) => {
                const color = getAvatarColor(ben.fullName);
                return (
                  <button
                    key={ben.id}
                    onClick={() => { setSelectedBen(ben); setShowSheet(true); }}
                    className="flex-shrink-0 flex flex-col items-center gap-2 group"
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg relative"
                      style={{ background: color, color: "#0B1120" }}
                    >
                      {ben.initials}
                    </div>
                    <span
                      className="text-xs font-medium text-center max-w-[60px] truncate"
                      style={{ color: t.textMuted }}
                    >
                      {ben.nickname || ben.fullName}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Add New Beneficiary Form ── */}
        <div
          className="p-5 rounded-2xl space-y-4"
          style={{ background: t.cardBg }}
        >
          <p className="text-sm font-semibold" style={{ color: t.textPrimary }}>
            Add New Beneficiary
          </p>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: t.textMuted }}>
              Full Name *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter full name"
              className="w-full px-4 py-3.5 rounded-xl outline-none"
              style={{ background: t.inputBg, color: t.textPrimary }}
            />
          </div>

          {/* Bank */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: t.textMuted }}>
              Bank *
            </label>
            <select
              value={selectedBankId}
              onChange={(e) => setSelectedBankId(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl outline-none appearance-none"
              style={{ background: t.inputBg, color: selectedBankId ? "#FFFFFF" : "#8A9BB5" }}
            >
              <option value="" disabled>Select bank</option>
              {banks.map((bank) => (
                <option key={bank.id} value={bank.id}>{bank.name}</option>
              ))}
            </select>
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: t.textMuted }}>
              Account Number *
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter account number"
                className="flex-1 px-4 py-3.5 rounded-xl outline-none"
                style={{ background: t.inputBg, color: t.textPrimary }}
              />
              <button
                onClick={() => accountNumber && toast.success("Account Verified")}
                disabled={!accountNumber || !selectedBankId}
                className="px-5 py-3.5 rounded-xl font-semibold text-sm"
                style={{
                  background: "#38BDF8",
                  color: "#0B1120",
                  opacity: !accountNumber || !selectedBankId ? 0.4 : 1,
                }}
              >
                Verify
              </button>
            </div>
            {accountNumber.length >= 6 && selectedBankId && (
              <div
                className="mt-2 p-3 rounded-xl flex items-center gap-2"
                style={{ background: "rgba(0,230,118,0.1)", border: "1px solid rgba(0,230,118,0.25)" }}
              >
                <CheckCircle2 size={16} style={{ color: "#00E676" }} />
                <span className="text-xs font-semibold" style={{ color: "#00E676" }}>
                  {fullName || "Account holder"} — {selectedBankName}
                </span>
              </div>
            )}
          </div>

          {/* Nickname */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: t.textMuted }}>
              Nickname (optional)
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. Mom, Work Account"
              className="w-full px-4 py-3.5 rounded-xl outline-none"
              style={{ background: t.inputBg, color: t.textPrimary }}
            />
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: t.textMuted }}>
              Account Type
            </label>
            <div className="flex gap-3">
              {(["Personal", "Business"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setAccountType(t)}
                  className="flex-1 py-3 rounded-xl font-bold transition-all"
                  style={{
                    background: accountType === t ? "#38BDF8" : "#1A2438",
                    color: accountType === t ? "#0B1120" : "#8A9BB5",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="px-5 pb-8 mt-6">
        <button
          onClick={handleSave}
          disabled={!canSave || saving}
          className="w-full py-4 rounded-xl font-semibold transition-all"
          style={{
            background: "linear-gradient(135deg, #38BDF8, #6366F1)",
            color: t.textPrimary,
            opacity: !canSave || saving ? 0.5 : 1,
          }}
        >
          {saving ? "Saving…" : "Save Beneficiary"}
        </button>
      </div>

      {/* ── Beneficiary Detail Sheet ── */}
      {showSheet && selectedBen && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.55)" }}
            onClick={() => setShowSheet(false)}
          />
          <div className="relative w-full p-6 rounded-t-[28px]" style={{ background: t.cardBg }}>
            <div className="w-12 h-1 rounded-full mx-auto mb-6" style={{ background: t.mutedBg }} />

            {/* Avatar + name */}
            <div className="text-center mb-6">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-2xl"
                style={{ background: getAvatarColor(selectedBen.fullName), color: "#0B1120" }}
              >
                {selectedBen.initials}
              </div>
              <h3 className="text-xl font-bold" style={{ color: t.textPrimary }}>
                {selectedBen.nickname || selectedBen.fullName}
              </h3>
              <p className="text-sm mt-1" style={{ color: t.textMuted }}>
                {selectedBen.bankName}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-6">
              {[
                { label: "Full Name", value: selectedBen.fullName },
                { label: "Account Number", value: selectedBen.accountNumber },
                { label: "Bank", value: selectedBen.bankName },
                { label: "Account Type", value: selectedBen.accountType },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  <span className="text-sm" style={{ color: t.textMuted }}>{label}</span>
                  <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setShowSheet(false); navigate({ to: "/local-transfer" }); }}
                className="py-4 rounded-xl font-semibold text-sm"
                style={{ background: "linear-gradient(135deg, #38BDF8, #6366F1)", color: t.textPrimary }}
              >
                Send Money
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                style={{ background: "rgba(255,77,106,0.1)", color: "#FF4D6A", border: "1px solid rgba(255,77,106,0.3)", opacity: deleting ? 0.6 : 1 }}
              >
                <Trash2 size={16} />
                {deleting ? "Removing…" : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}

            <BottomNav />
    </div>
  );
}
