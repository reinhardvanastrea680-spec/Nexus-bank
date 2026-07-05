import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { ArrowLeft, Camera } from "lucide-react";
import { useUserAuth } from "../dashboard/hooks/useUserAuth";
import { useUserAccount } from "../dashboard/hooks/useUserAccount";
import { useTheme } from "../hooks/use-theme";
import { themeColors } from "../utils/theme";
import { BottomNav } from "../dashboard/components/BottomNav";
import { db } from "../firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile - Nexsus Bank" }] }),
  component: ProfilePage,
});

function InfoRow({ label, value, masked }: { label: string; value: string; masked?: boolean }) {
  const { theme } = useTheme();
  const t = themeColors(theme);
  return (
    <div className="flex items-center justify-between py-3"
      style={{ borderBottom: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}` }}>
      <span className="text-sm" style={{ color: t.textMuted }}>{label}</span>
      <span className="text-sm font-medium" style={{ color: t.textPrimary }}>
        {masked ? "........" : value || "—"}
      </span>
    </div>
  );
}

function SectionHeader({ title, actionLabel, onAction }: { title: string; actionLabel?: string; onAction?: () => void }) {
  const { theme } = useTheme();
  const t = themeColors(theme);
  return (
    <div className="flex items-center justify-between mb-2 mt-6">
      <p className="text-base font-bold" style={{ color: t.textOnBg }}>{title}</p>
      {actionLabel && (
        <button onClick={onAction} className="text-sm font-semibold" style={{ color: "#EF4444" }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useUserAuth();
  const { account, loading } = useUserAccount();
  const { theme } = useTheme();
  const t = themeColors(theme);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const fullName: string = account?.fullName || user?.displayName || "User";
  const initials = fullName.split(" ").slice(0, 2).map((w: string) => w.charAt(0).toUpperCase()).join("");
  const nameParts = fullName.split(" ");
  const firstName  = nameParts[0] || "";
  const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";
  const lastName   = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
  const photoURL   = account?.photoURL || user?.photoURL || null;
  const phoneHidden = account?.hidePhone === true;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.uid) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Photo must be under 5MB"); return; }
    if (!file.type.startsWith("image/")) { toast.error("Only image files are allowed"); return; }
    setUploading(true);
    try {
      // Convert to base64 — no CORS, no Firebase Storage needed
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      await updateDoc(doc(db, "users", user.uid), { photoURL: base64 });
      toast.success("Profile photo updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload photo. Please try again.");
    } finally {
      setUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: t.pageBg }}>
        <div className="text-sm animate-pulse" style={{ color: t.textMuted }}>Loading profile…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col pb-24" style={{ background: t.pageBg }}>
      {/* Header */}
      <div className="px-5 pt-10 pb-4 flex items-center gap-3">
        <button onClick={() => navigate({ to: "/settings" })} className="p-2 -ml-2">
          <ArrowLeft size={22} style={{ color: t.textOnBg }} />
        </button>
        <div>
          <h1 className="text-lg font-bold" style={{ color: t.textOnBg }}>Profile</h1>
          <p className="text-xs" style={{ color: t.textMutedOnBg }}>View or update account information</p>
        </div>
      </div>

      <div className="px-5 flex-1">
        {/* Avatar card with photo upload */}
        <div className="flex items-center gap-4 p-4 rounded-2xl mb-2"
          style={{
            background: theme === "dark" ? "linear-gradient(135deg, #1a0a0a 0%, #2d1515 100%)" : "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
            border: `1px solid ${theme === "dark" ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.15)"}`,
          }}>
          {/* Clickable avatar */}
          <div className="relative flex-shrink-0">
            <button onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center relative group"
              style={{ background: "#EF4444" }}
              disabled={uploading}>
              {photoURL
                ? <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                : <span className="text-white font-bold text-xl">{initials}</span>}
              {/* Camera overlay on hover */}
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={18} color="#fff" />
              </div>
              {uploading && (
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </button>
            {/* Small camera badge */}
            <button onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "#EF4444", border: "2px solid white" }}>
              <Camera size={10} color="#fff" />
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />

          <div>
            <p className="text-xs" style={{ color: t.textMuted }}>Full Name</p>
            <p className="text-base font-bold" style={{ color: t.textPrimary }}>{fullName}</p>
            <p className="text-xs mt-0.5" style={{ color: t.textMuted }}>Tap photo to change</p>
          </div>
        </div>

        {/* Basic Information — includes account number */}
        <SectionHeader title="Basic Information" />
        <div className="rounded-2xl px-4" style={{ background: t.cardBg }}>
          <InfoRow label="First Name"      value={firstName} />
          <InfoRow label="Middle Name"     value={middleName} />
          <InfoRow label="Last Name"       value={lastName} />
          <InfoRow label="Account Number"  value={account?.checkingAccountNumber || account?.accountNumber || ""} masked />
        </div>

        {/* Contact Information — Update shows error */}
        <SectionHeader
          title="Contact Information"
          actionLabel="Update"
          onAction={() => toast.error("Unable to update. Please contact support.", { duration: 4000 })}
        />
        <div className="rounded-2xl px-4" style={{ background: t.cardBg }}>
          <InfoRow
            label="Mobile Number"
            value={phoneHidden ? ".........." : (account?.phone || account?.phoneNumber || "—")}
          />
          <InfoRow label="Email Address" value={user?.email || account?.email || "—"} />
        </div>

        {/* Account Status */}
        <SectionHeader title="Account Status" />
        <div className="rounded-2xl px-4" style={{ background: t.cardBg }}>
          <InfoRow label="Account Tier"  value={account?.accountTier || account?.accountType || "Standard"} />
          <InfoRow label="Status"        value={account?.status || "Active"} />
          <InfoRow label="Member Since"
            value={account?.createdAt
              ? new Date(typeof account.createdAt.toDate === "function" ? account.createdAt.toDate() : account.createdAt)
                  .toLocaleDateString("en-US", { year: "numeric", month: "long" })
              : "—"}
          />
        </div>
      </div>

      <BottomNav active="settings" />
    </div>
  );
}
