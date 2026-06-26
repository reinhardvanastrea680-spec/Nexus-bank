import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Trash2, User, AlertCircle, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useBeneficiaries } from "../dashboard/hooks/useBeneficiaries";
import { useUserAuth } from "../dashboard/hooks/useUserAuth";
import { useUserAccount } from "../dashboard/hooks/useUserAccount";
import { useCustomBanks } from "../dashboard/hooks/useCustomBanks";
import { useTheme } from "../hooks/use-theme";
import { themeColors } from "../utils/theme";
import { BottomNav } from "../dashboard/components/BottomNav";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ADMIN_UID } from "../config/adminConfig";

export const Route = createFileRoute("/add-beneficiary")({
  head: () => ({ meta: [{ title: "Beneficiaries - Nexus Bank" }] }),
  component: AddBeneficiary,
});

// International / US banks only — no Nigerian banks
const banks = [
  // United States
  { id: "chase",      name: "JPMorgan Chase Bank",         country: "US" },
  { id: "bofa",       name: "Bank of America",             country: "US" },
  { id: "wells",      name: "Wells Fargo",                 country: "US" },
  { id: "citi",       name: "Citibank",                    country: "US" },
  { id: "usbank",     name: "US Bank",                     country: "US" },
  { id: "pnc",        name: "PNC Bank",                    country: "US" },
  { id: "capital1",   name: "Capital One",                 country: "US" },
  { id: "td",         name: "TD Bank",                     country: "US" },
  { id: "truist",     name: "Truist Bank",                 country: "US" },
  { id: "ally",       name: "Ally Bank",                   country: "US" },
  { id: "goldman",    name: "Goldman Sachs (Marcus)",      country: "US" },
  { id: "suntrust",   name: "SunTrust Bank",               country: "US" },
  // United Kingdom
  { id: "hsbc",       name: "HSBC Bank",                   country: "UK" },
  { id: "barclays",   name: "Barclays",                    country: "UK" },
  { id: "lloyds",     name: "Lloyds Bank",                 country: "UK" },
  { id: "natwest",    name: "NatWest",                     country: "UK" },
  { id: "santander",  name: "Santander UK",                country: "UK" },
  // Europe
  { id: "deutsche",   name: "Deutsche Bank",               country: "DE" },
  { id: "bnp",        name: "BNP Paribas",                 country: "FR" },
  { id: "societe",    name: "Société Générale",            country: "FR" },
  { id: "ing",        name: "ING Bank",                    country: "NL" },
  { id: "unicredit",  name: "UniCredit",                   country: "IT" },
  { id: "ing_be",     name: "KBC Bank",                    country: "BE" },
  // Canada
  { id: "rbc",        name: "Royal Bank of Canada",        country: "CA" },
  { id: "td_ca",      name: "TD Canada Trust",             country: "CA" },
  { id: "scotiabank", name: "Scotiabank",                  country: "CA" },
  // Australia
  { id: "cba",        name: "Commonwealth Bank",           country: "AU" },
  { id: "westpac",    name: "Westpac Banking",             country: "AU" },
  { id: "anz",        name: "ANZ Bank",                    country: "AU" },
  // Asia / Middle East
  { id: "dbs",        name: "DBS Bank",                    country: "SG" },
  { id: "uob",        name: "United Overseas Bank",        country: "SG" },
  { id: "emirates",   name: "Emirates NBD",                country: "AE" },
  { id: "mashreq",    name: "Mashreq Bank",                country: "AE" },
  { id: "sbi",        name: "State Bank of India",         country: "IN" },
  { id: "hdfc",       name: "HDFC Bank",                   country: "IN" },
  { id: "icici",      name: "ICICI Bank",                  country: "IN" },
  // International
  { id: "other",      name: "Other",                       country: "" },
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
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
  const { user } = useUserAuth();
  const { account } = useUserAccount();
  const { beneficiaries, loading, removeBeneficiary } = useBeneficiaries();
  const { customBanks, addCustomBank } = useCustomBanks();

  const [fullName, setFullName] = useState("");
  const [selectedBankId, setSelectedBankId] = useState("");
  const [customBankName, setCustomBankName] = useState("");
  const [addingBank, setAddingBank] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [nickname, setNickname] = useState("");
  const [accountType, setAccountType] = useState<"Personal" | "Business">("Personal");
  const [saving, setSaving] = useState(false);

  // Blocked popup
  const [showBlockedPopup, setShowBlockedPopup] = useState(false);

  // Detail sheet
  const [selectedBen, setSelectedBen] = useState<(typeof beneficiaries)[0] | null>(null);
  const [showSheet, setShowSheet] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Merge static + custom banks for the dropdown (custom banks appear after the static list, before "Other")
  const allBanks = [
    ...banks.filter((b) => b.id !== "other"),
    ...customBanks.map((cb) => ({ id: `custom_${cb.id}`, name: cb.name, country: cb.country })),
    { id: "other", name: "Other", country: "" },
  ];

  const selectedBankName = selectedBankId === "other"
    ? (customBankName.trim() || "Other")
    : (allBanks.find((b) => b.id === selectedBankId)?.name || "");

  const canSave = fullName.trim() && selectedBankId &&
    (selectedBankId !== "other" || customBankName.trim()) &&
    accountNumber.trim();

  // Add the custom bank to Firestore so it appears everywhere
  const handleAddBank = async () => {
    if (!customBankName.trim()) return;
    setAddingBank(true);
    try {
      await addCustomBank(customBankName.trim());
      // Auto-select the newly added bank
      // Give Firestore a moment then the onSnapshot will update customBanks
      toast.success(`"${customBankName.trim()}" added to bank list`);
      // Keep the name in customBankName so selectedBankName still resolves correctly
    } catch {
      toast.error("Failed to add bank");
    } finally {
      setAddingBank(false);
    }
  };

  const handleSave = async () => {
    if (!canSave || !user) return;
    setSaving(true);
    try {
      const userName = account?.fullName || user.email || "A user";
      // 1. Write a pending beneficiary request to Firestore
      await addDoc(collection(db, "beneficiaryRequests"), {
        userId: user.uid,
        userFullName: userName,
        userEmail: user.email || "",
        fullName: fullName.trim(),
        nickname: nickname.trim(),
        bankName: selectedBankName,
        bankId: selectedBankId,
        accountNumber: accountNumber.trim(),
        accountType,
        initials: getInitials(fullName.trim()),
        status: "pending", // pending | approved | declined
        createdAt: serverTimestamp(),
      });

      // 2. Notify admin
      await addDoc(collection(db, "notifications"), {
        recipientId: ADMIN_UID,
        recipientType: "admin",
        type: "beneficiary_request",
        title: "Beneficiary Approval Request",
        message: `${userName} wants to add ${fullName.trim()} (${selectedBankName}) as a beneficiary. Approval required.`,
        userId: user.uid,
        userFullName: userName,
        amount: 0,
        transactionType: "beneficiary_request",
        status: "unread",
        declineReason: null,
        createdAt: serverTimestamp(),
        readAt: null,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
      // Always show the blocked popup — admin must approve first
      setShowBlockedPopup(true);
    }
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
            <div className="p-5 rounded-2xl text-center"
              style={{ background: t.cardBg, border: `1px dashed ${t.accentCyan}40` }}>
              <User size={32} className="mx-auto mb-2" style={{ color: t.accentCyan, opacity: 0.5 }} />
              <p className="text-sm font-medium" style={{ color: t.textMuted }}>
                No saved beneficiaries yet
              </p>
              <p className="text-xs mt-1" style={{ color: t.textMuted, opacity: 0.6 }}>
                Fill in the form below to request one
              </p>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {beneficiaries.map((ben) => {
                const color = getAvatarColor(ben.fullName);
                return (
                  <button key={ben.id}
                    onClick={() => { setSelectedBen(ben); setShowSheet(true); }}
                    className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg"
                      style={{ background: color, color: "#0B1120" }}>
                      {ben.initials}
                    </div>
                    <span className="text-xs font-medium text-center max-w-[60px] truncate"
                      style={{ color: t.textMuted }}>
                      {ben.nickname || ben.fullName}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Add New Beneficiary Form ── */}
        <div className="p-5 rounded-2xl space-y-4" style={{ background: t.cardBg }}>
          <p className="text-sm font-semibold" style={{ color: t.textPrimary }}>
            Add New Beneficiary
          </p>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: t.textMuted }}>Full Name *</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter full name" className="w-full px-4 py-3.5 rounded-xl outline-none"
              style={{ background: t.inputBg, color: t.textPrimary }} />
          </div>

          {/* Bank */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: t.textMuted }}>Bank *</label>
            <select value={selectedBankId} onChange={(e) => { setSelectedBankId(e.target.value); setCustomBankName(""); }}
              className="w-full px-4 py-3.5 rounded-xl outline-none appearance-none"
              style={{ background: t.inputBg, color: selectedBankId ? t.textPrimary : t.textMuted }}>
              <option value="" disabled>Select bank</option>
              {allBanks.map((bank) => (
                <option key={bank.id} value={bank.id}>{bank.name}</option>
              ))}
            </select>

            {/* Custom bank name input + Add Bank button — shown only when "Other" is selected */}
            {selectedBankId === "other" && (
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  value={customBankName}
                  onChange={(e) => setCustomBankName(e.target.value)}
                  placeholder="Type bank name *"
                  className="w-full px-4 py-3.5 rounded-xl outline-none"
                  style={{
                    background: t.inputBg,
                    color: t.textPrimary,
                    border: `1px solid ${t.accentCyan}50`,
                  }}
                  autoFocus
                />
                {/* "Add Bank" button — appears once name is typed */}
                {customBankName.trim().length >= 2 && (
                  <button
                    type="button"
                    onClick={handleAddBank}
                    disabled={addingBank}
                    className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                    style={{
                      background: addingBank ? "rgba(56,189,248,0.3)" : "rgba(56,189,248,0.15)",
                      color: t.accentCyan,
                      border: `1px solid ${t.accentCyan}40`,
                      opacity: addingBank ? 0.7 : 1,
                    }}
                  >
                    <PlusCircle size={16} />
                    {addingBank ? "Adding…" : `Add "${customBankName.trim()}" to bank list`}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: t.textMuted }}>Account Number *</label>
            <div className="flex gap-3">
              <input type="text" value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter account number" className="flex-1 px-4 py-3.5 rounded-xl outline-none"
                style={{ background: t.inputBg, color: t.textPrimary }} />
              <button onClick={() => accountNumber && toast.success("Account Verified")}
                disabled={!accountNumber || !selectedBankId}
                className="px-5 py-3.5 rounded-xl font-semibold text-sm"
                style={{ background: "#38BDF8", color: "#0B1120", opacity: !accountNumber || !selectedBankId ? 0.4 : 1 }}>
                Verify
              </button>
            </div>
            {accountNumber.length >= 6 && selectedBankId && (
              <div className="mt-2 p-3 rounded-xl flex items-center gap-2"
                style={{ background: "rgba(0,230,118,0.1)", border: "1px solid rgba(0,230,118,0.25)" }}>
                <CheckCircle2 size={16} style={{ color: "#00E676" }} />
                <span className="text-xs font-semibold" style={{ color: "#00E676" }}>
                  {fullName || "Account holder"} — {selectedBankName}
                </span>
              </div>
            )}
          </div>

          {/* Nickname */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: t.textMuted }}>Nickname (optional)</label>
            <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. Mom, Work Account" className="w-full px-4 py-3.5 rounded-xl outline-none"
              style={{ background: t.inputBg, color: t.textPrimary }} />
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: t.textMuted }}>Account Type</label>
            <div className="flex gap-3">
              {(["Personal", "Business"] as const).map((type) => (
                <button key={type} onClick={() => setAccountType(type)}
                  className="flex-1 py-3 rounded-xl font-bold transition-all"
                  style={{
                    background: accountType === type ? "#38BDF8" : t.inputBg,
                    color: accountType === type ? "#0B1120" : t.textMuted,
                  }}>
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="px-5 pb-8 mt-6">
        <button onClick={handleSave} disabled={!canSave || saving}
          className="w-full py-4 rounded-xl font-semibold transition-all"
          style={{
            background: "linear-gradient(135deg, #38BDF8, #6366F1)",
            color: t.textPrimary,
            opacity: !canSave || saving ? 0.5 : 1,
          }}>
          {saving ? "Submitting…" : "Save Beneficiary"}
        </button>
      </div>

      {/* ── Blocked Popup Modal ── */}
      {showBlockedPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: "rgba(0,0,0,0.65)" }}
          onClick={() => setShowBlockedPopup(false)}>
          <div className="w-full max-w-sm rounded-3xl p-7 space-y-5"
            style={{ background: theme === "dark" ? "#111827" : "#ffffff" }}
            onClick={(e) => e.stopPropagation()}>
            {/* Icon */}
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,171,0,0.15)" }}>
                <AlertCircle size={32} style={{ color: "#FFAB00" }} />
              </div>
              <h3 className="text-lg font-bold" style={{ color: t.textPrimary }}>
                Couldn't Save Beneficiary
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: t.textMuted }}>
                Adding beneficiaries requires admin approval. Your request has been sent — please contact support or wait for approval.
              </p>
            </div>
            {/* Buttons */}
            <button
              onClick={() => { setShowBlockedPopup(false); navigate({ to: "/support" }); }}
              className="w-full py-3.5 rounded-2xl font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #38BDF8, #6366F1)" }}>
              Contact Support
            </button>
            <button onClick={() => setShowBlockedPopup(false)}
              className="w-full py-3 rounded-2xl text-sm font-semibold"
              style={{ color: t.textMuted }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── Beneficiary Detail Sheet ── */}
      {showSheet && selectedBen && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)" }}
            onClick={() => setShowSheet(false)} />
          <div className="relative w-full p-6 rounded-t-[28px]" style={{ background: t.cardBg }}>
            <div className="w-12 h-1 rounded-full mx-auto mb-6" style={{ background: t.mutedBg }} />
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-2xl"
                style={{ background: getAvatarColor(selectedBen.fullName), color: "#0B1120" }}>
                {selectedBen.initials}
              </div>
              <h3 className="text-xl font-bold" style={{ color: t.textPrimary }}>
                {selectedBen.nickname || selectedBen.fullName}
              </h3>
              <p className="text-sm mt-1" style={{ color: t.textMuted }}>{selectedBen.bankName}</p>
            </div>
            <div className="space-y-2 mb-6">
              {[
                { label: "Full Name", value: selectedBen.fullName },
                { label: "Account Number", value: selectedBen.accountNumber },
                { label: "Bank", value: selectedBen.bankName },
                { label: "Account Type", value: selectedBen.accountType },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2 border-b"
                  style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  <span className="text-sm" style={{ color: t.textMuted }}>{label}</span>
                  <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>{value}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { setShowSheet(false); navigate({ to: "/local-transfer" }); }}
                className="py-4 rounded-xl font-semibold text-sm"
                style={{ background: "linear-gradient(135deg, #38BDF8, #6366F1)", color: t.textPrimary }}>
                Send Money
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                style={{ background: "rgba(255,77,106,0.1)", color: "#FF4D6A", border: "1px solid rgba(255,77,106,0.3)", opacity: deleting ? 0.6 : 1 }}>
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
