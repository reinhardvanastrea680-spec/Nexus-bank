import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  User,
  Lock,
  Shield,
  Bell,
  Languages,
  Palette,
  LogOut,
  Home as HomeIcon,
  History,
  Headphones,
  Settings as SettingsIcon,
  Mail,
  Smartphone,
  Fingerprint,
  Eye,
  Link2,
  Globe,
  Check,
  X,
} from "lucide-react";
import { useUserAuth } from "../dashboard/hooks/useUserAuth";
import { useUserAccount } from "../dashboard/hooks/useUserAccount";
import { useTheme } from "../hooks/use-theme";
import { themeColors } from "../utils/theme";
import { BottomNav } from "../dashboard/components/BottomNav";
import { useLanguage, SUPPORTED_LANGUAGES } from "../hooks/use-language";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { ADMIN_UID } from "../config/adminConfig";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings - Nexus Bank" }] }),
  component: Settings,
});

function Settings() {
  const navigate = useNavigate();
  const { user, userLogout } = useUserAuth();
  const { account } = useUserAccount();
  const { theme, toggleTheme } = useTheme();
  const t = themeColors(theme);

  const { language, setLanguage, currentLanguage } = useLanguage();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  // Modal state for settings items
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const openModal = (id: string) => setActiveModal(id);
  const closeModal = () => setActiveModal(null);

  const handleLogout = async () => {
    try {
      // Notify admin that user has signed out
      const userName = account?.fullName || user?.email || "A user";
      const userId = user?.uid;
      if (userId) {
        try {
          // Clear the session presence key so re-entry fires again
          sessionStorage.removeItem(`nexus-presence-${userId}`);
          await addDoc(collection(db, "notifications"), {
            recipientId: ADMIN_UID,
            recipientType: "admin",
            type: "user_activity",
            title: `${userName} signed out`,
            message: `${userName} has signed out of the banking app`,
            userId,
            userFullName: userName,
            amount: 0,
            transactionType: "presence",
            status: "unread",
            declineReason: null,
            createdAt: serverTimestamp(),
            readAt: null,
          });
          // Also write to chat thread
          await addDoc(collection(db, "chats", userId, "messages"), {
            text: `⚫ ${userName} has signed out`,
            sender: "system",
            createdAt: serverTimestamp(),
            readByUser: true,
            readByAdmin: false,
            isPresence: true,
          });
          await updateDoc(doc(db, "chats", userId), {
            lastMessage: `⚫ ${userName} has signed out`,
            lastMessageAt: serverTimestamp(),
            userFullName: userName,
            userEmail: user?.email || "",
            status: "active",
          });
        } catch { /* non-critical */ }
      }
      await userLogout();
      navigate({ to: "/login" });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col pb-24"
      style={{ background: t.pageBg }}
    >
      {/* Header */}
      <div className="px-5 pt-10 pb-6 flex items-center gap-4">
        <button onClick={() => navigate({ to: "/" })} className="p-2">
          <ArrowLeft size={24} style={{ color: t.textPrimary }} />
        </button>
        <h1
          className="text-xl font-bold flex-1 text-center"
          style={{ color: t.textPrimary }}
        >
          Settings
        </h1>
        <div className="w-10" />
      </div>

      <div className="px-5 flex-1 space-y-6">
        {/* Profile Section */}
        <div className="space-y-3">
          <p
            className="text-sm font-semibold"
            style={{ color: t.textMuted }}
          >
            Profile
          </p>
          <Link to="/profile" className="w-full flex items-center justify-between p-4 rounded-2xl"
            style={{ background: t.cardBg }}>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "#EF4444", color: "#fff" }}
              >
                <span className="text-sm font-bold">
                  {(account?.fullName || "U").split(" ").slice(0,2).map((w: string) => w[0]).join("").toUpperCase()}
                </span>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                  {account?.fullName || "User Name"}
                </p>
                <p className="text-xs" style={{ color: t.textMuted }}>{user?.email}</p>
              </div>
            </div>
            <span className="text-xs" style={{ color: t.textMuted }}>›</span>
          </Link>

          <div
            className="p-4 rounded-2xl space-y-4"
            style={{ background: t.cardBg }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: t.inputBg }}
                >
                  <User size={16} style={{ color: "#38BDF8" }} />
                </div>
                <span
                  className="text-sm font-semibold"
                  style={{ color: t.textPrimary }}
                >
                  Personal Information
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: t.inputBg }}
                >
                  <Mail size={16} style={{ color: "#38BDF8" }} />
                </div>
                <span
                  className="text-sm font-semibold"
                  style={{ color: t.textPrimary }}
                >
                  Contact Details
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-3">
          <p
            className="text-sm font-semibold"
            style={{ color: t.textMuted }}
          >
            Notifications
          </p>
          <div
            className="p-4 rounded-2xl space-y-4"
            style={{ background: t.cardBg }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: t.inputBg }}
                >
                  <Bell size={16} style={{ color: "#38BDF8" }} />
                </div>
                <span
                  className="text-sm font-semibold"
                  style={{ color: t.textPrimary }}
                >
                  Enable Notifications
                </span>
              </div>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className="w-12 h-6 rounded-full flex items-center"
                style={{
                  background: notificationsEnabled ? t.accentCyan : t.inputBg,
                  paddingLeft: notificationsEnabled ? "26px" : "2px",
                }}
              >
                <div className="w-5 h-5 rounded-full" style={{ background: "#FFFFFF" }} />
              </button>
            </div>

            {notificationsEnabled && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail size={16} style={{ color: "#38BDF8" }} />
                    <span
                      className="text-sm"
                      style={{ color: t.textPrimary }}
                    >
                      Email Alerts
                    </span>
                  </div>
                  <button
                    onClick={() => setEmailAlerts(!emailAlerts)}
                    className="w-12 h-6 rounded-full flex items-center"
                    style={{
                      background: emailAlerts ? t.accentCyan : t.inputBg,
                      paddingLeft: emailAlerts ? "26px" : "2px",
                    }}
                  >
                    <div className="w-5 h-5 rounded-full" style={{ background: "#FFFFFF" }} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone size={16} style={{ color: "#38BDF8" }} />
                    <span className="text-sm" style={{ color: t.textPrimary }}>
                      Push Alerts
                    </span>
                  </div>
                  <button
                    onClick={() => setPushAlerts(!pushAlerts)}
                    className="w-12 h-6 rounded-full flex items-center"
                    style={{
                      background: pushAlerts ? t.accentCyan : t.inputBg,
                      paddingLeft: pushAlerts ? "26px" : "2px",
                    }}
                  >
                    <div className="w-5 h-5 rounded-full" style={{ background: "#FFFFFF" }} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Security */}
        <div className="space-y-3">
          <p
            className="text-sm font-semibold"
            style={{ color: t.textMuted }}
          >
            Security
          </p>
          <div className="space-y-3">
            <button
              className="w-full flex items-center justify-between p-4 rounded-2xl"
              style={{ background: t.cardBg }}
              onClick={() => openModal("change-password")}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: t.inputBg }}>
                  <Lock size={16} style={{ color: "#38BDF8" }} />
                </div>
                <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>Change Password</span>
              </div>
            </button>

            <div
              className="p-4 rounded-2xl"
              style={{ background: t.cardBg }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: t.inputBg }}
                  >
                    <Shield size={16} style={{ color: "#38BDF8" }} />
                  </div>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: t.textPrimary }}
                  >
                    Two-Factor Authentication
                  </span>
                </div>
                <button
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className="w-12 h-6 rounded-full flex items-center"
                  style={{
                    background: twoFactorEnabled ? t.accentCyan : t.inputBg,
                    paddingLeft: twoFactorEnabled ? "26px" : "2px",
                  }}
                >
                  <div className="w-5 h-5 rounded-full" style={{ background: "#FFFFFF" }} />
                </button>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: t.inputBg }}
                  >
                    <Fingerprint size={16} style={{ color: "#38BDF8" }} />
                  </div>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: t.textPrimary }}
                  >
                    Biometric Login
                  </span>
                </div>
                <button
                  onClick={() => setBiometricsEnabled(!biometricsEnabled)}
                  className="w-12 h-6 rounded-full flex items-center"
                  style={{
                    background: biometricsEnabled ? t.accentCyan : t.inputBg,
                    paddingLeft: biometricsEnabled ? "26px" : "2px",
                  }}
                >
                  <div className="w-5 h-5 rounded-full" style={{ background: "#FFFFFF" }} />
                </button>
              </div>
            </div>

            <button className="w-full flex items-center justify-between p-4 rounded-2xl" style={{ background: t.cardBg }} onClick={() => openModal("login-activity")}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: t.inputBg }}>
                  <History size={16} style={{ color: "#38BDF8" }} />
                </div>
                <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>Login Activity</span>
              </div>
            </button>
          </div>
        </div>

        {/* Privacy */}
        <div className="space-y-3">
          <p
            className="text-sm font-semibold"
            style={{ color: t.textMuted }}
          >
            Privacy
          </p>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 rounded-2xl" style={{ background: t.cardBg }} onClick={() => openModal("privacy")}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: t.inputBg }}>
                  <Eye size={16} style={{ color: "#38BDF8" }} />
                </div>
                <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>Privacy Controls</span>
              </div>
            </button>
          </div>
        </div>

        {/* Linked Accounts */}
        <div className="space-y-3">
          <p
            className="text-sm font-semibold"
            style={{ color: t.textMuted }}
          >
            Linked Accounts
          </p>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 rounded-2xl" style={{ background: t.cardBg }} onClick={() => openModal("external-banks")}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: t.inputBg }}>
                  <Link2 size={16} style={{ color: "#38BDF8" }} />
                </div>
                <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>External Bank Accounts</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-2xl" style={{ background: t.cardBg }} onClick={() => openModal("connected-cards")}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: t.inputBg }}>
                  <Link2 size={16} style={{ color: "#38BDF8" }} />
                </div>
                <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>Connected Cards</span>
              </div>
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-3">
          <p
            className="text-sm font-semibold"
            style={{ color: t.textMuted }}
          >
            Preferences
          </p>
          <div className="space-y-3">
            <button
              className="w-full flex items-center justify-between p-4 rounded-2xl"
              style={{ background: t.cardBg }}
              onClick={() => setShowLanguageModal(true)}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: t.inputBg }}
                >
                  <Languages size={16} style={{ color: "#38BDF8" }} />
                </div>
                <span
                  className="text-sm font-semibold"
                  style={{ color: t.textPrimary }}
                >
                  Language
                </span>
              </div>
              <span className="text-sm" style={{ color: t.textMuted }}>
                {currentLanguage.nameEn}
              </span>
            </button>
            <button
              className="w-full flex items-center justify-between p-4 rounded-2xl"
              style={{ background: t.cardBg }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: t.inputBg }}
                >
                  <Globe size={16} style={{ color: "#38BDF8" }} />
                </div>
                <span
                  className="text-sm font-semibold"
                  style={{ color: t.textPrimary }}
                >
                  Region
                </span>
              </div>
              <span className="text-sm" style={{ color: t.textMuted }}>
                United States
              </span>
            </button>
            <div
              className="p-4 rounded-2xl"
              style={{ background: t.cardBg }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: t.inputBg }}
                  >
                    <Palette size={16} style={{ color: "#38BDF8" }} />
                  </div>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: t.textPrimary }}
                  >
                    Theme
                  </span>
                </div>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-3 py-2 rounded-full"
                  style={{ background: t.inputBg }}
                >
                  <span
                    className="text-sm font-semibold"
                    style={{ color: t.textPrimary }}
                  >
                    {theme === "dark" ? "Dark" : "Light"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={() => setShowSignOutConfirm(true)}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl"
          style={{ background: "rgba(255,77,106,0.1)" }}
        >
          <LogOut size={18} style={{ color: "#FF4D6A" }} />
          <span className="text-sm font-semibold" style={{ color: "#FF4D6A" }}>
            Sign Out
          </span>
        </button>
      </div>

      {/* ── Settings Modals ─────────────────────────────────────────────── */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-8"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={closeModal}>
          <div className="w-full max-w-sm rounded-3xl p-6"
            style={{ background: theme === "dark" ? "#111827" : "#ffffff" }}
            onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: "rgba(100,100,100,0.3)" }} />

            {/* Change Password */}
            {activeModal === "change-password" && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-center" style={{ color: t.textPrimary }}>Change Password</h3>
                <p className="text-sm text-center" style={{ color: t.textMuted }}>For security, password changes must be done through our support team.</p>
                <div className="p-4 rounded-2xl" style={{ background: t.inputBg }}>
                  {[
                    { icon: "🔐", text: "Your password is encrypted with AES-256 banking-grade security" },
                    { icon: "📧", text: "Password change requests are verified via email" },
                    { icon: "⏱️", text: "Requests are processed within 24 hours" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-start gap-3 mb-3">
                      <span className="text-lg">{item.icon}</span>
                      <p className="text-xs" style={{ color: t.textMuted }}>{item.text}</p>
                    </div>
                  ))}
                </div>
                <button onClick={closeModal} className="w-full py-3 rounded-2xl font-semibold text-white" style={{ background: "linear-gradient(135deg, #38BDF8, #6366F1)" }}>
                  Contact Support
                </button>
                <button onClick={closeModal} className="w-full py-3 rounded-2xl text-sm font-semibold" style={{ color: t.textMuted }}>Close</button>
              </div>
            )}

            {/* Login Activity */}
            {activeModal === "login-activity" && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-center" style={{ color: t.textPrimary }}>Login Activity</h3>
                <div className="space-y-3">
                  {[
                    { device: "iPhone 15 Pro", location: "Current session", time: "Now", current: true },
                    { device: "Chrome Browser", location: "Last session", time: "2 days ago", current: false },
                    { device: "Safari Browser", location: "Previous session", time: "5 days ago", current: false },
                  ].map((session) => (
                    <div key={session.time} className="flex items-center justify-between p-3 rounded-xl"
                      style={{ background: t.inputBg, border: session.current ? `1px solid ${t.accentCyan}40` : "none" }}>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: t.textPrimary }}>{session.device}</p>
                        <p className="text-xs" style={{ color: t.textMuted }}>{session.location} · {session.time}</p>
                      </div>
                      {session.current
                        ? <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: `${t.accentCyan}20`, color: t.accentCyan }}>Active</span>
                        : <span className="text-xs" style={{ color: t.textMuted }}>✓ Secure</span>}
                    </div>
                  ))}
                </div>
                <button onClick={closeModal} className="w-full py-3 rounded-2xl text-sm font-semibold" style={{ color: t.textMuted, background: t.inputBg }}>Close</button>
              </div>
            )}

            {/* Privacy Controls */}
            {activeModal === "privacy" && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-center" style={{ color: t.textPrimary }}>Privacy Controls</h3>
                {[
                  { label: "Share data for service improvement", desc: "Help us improve Nexus Bank" },
                  { label: "Personalised recommendations", desc: "Receive tailored financial tips" },
                  { label: "Marketing communications", desc: "Receive offers and promotions" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: t.inputBg }}>
                    <div className="flex-1 pr-3">
                      <p className="text-sm font-semibold" style={{ color: t.textPrimary }}>{item.label}</p>
                      <p className="text-xs" style={{ color: t.textMuted }}>{item.desc}</p>
                    </div>
                    <div className="w-10 h-6 rounded-full flex items-center px-0.5" style={{ background: i === 0 ? t.accentCyan : t.mutedBg }}>
                      <div className="w-5 h-5 rounded-full bg-white shadow" style={{ transform: i === 0 ? "translateX(16px)" : "translateX(0)" }} />
                    </div>
                  </div>
                ))}
                <p className="text-xs text-center" style={{ color: t.textMuted }}>Your data is protected under our Privacy Policy and applicable data laws.</p>
                <button onClick={closeModal} className="w-full py-3 rounded-2xl text-sm font-semibold" style={{ color: t.textMuted, background: t.inputBg }}>Done</button>
              </div>
            )}

            {/* External Bank Accounts */}
            {activeModal === "external-banks" && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-center" style={{ color: t.textPrimary }}>External Bank Accounts</h3>
                <div className="flex flex-col items-center py-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 text-3xl" style={{ background: t.inputBg }}>🏦</div>
                  <p className="text-sm font-semibold text-center" style={{ color: t.textPrimary }}>No external banks linked yet</p>
                  <p className="text-xs text-center mt-2 max-w-xs" style={{ color: t.textMuted }}>To link an external bank account, please contact support. We support ACH, SWIFT, and SEPA transfers.</p>
                </div>
                <button onClick={closeModal} className="w-full py-3 rounded-2xl font-semibold text-white" style={{ background: "linear-gradient(135deg, #38BDF8, #6366F1)" }}>Contact Support</button>
                <button onClick={closeModal} className="w-full py-3 rounded-2xl text-sm font-semibold" style={{ color: t.textMuted }}>Close</button>
              </div>
            )}

            {/* Connected Cards */}
            {activeModal === "connected-cards" && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-center" style={{ color: t.textPrimary }}>Connected Cards</h3>
                <div className="flex flex-col items-center py-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 text-3xl" style={{ background: t.inputBg }}>💳</div>
                  <p className="text-sm font-semibold text-center" style={{ color: t.textPrimary }}>No cards connected yet</p>
                  <p className="text-xs text-center mt-2 max-w-xs" style={{ color: t.textMuted }}>To add a card, please contact support. We accept Visa, Mastercard, and American Express.</p>
                </div>
                <button onClick={closeModal} className="w-full py-3 rounded-2xl font-semibold text-white" style={{ background: "linear-gradient(135deg, #38BDF8, #6366F1)" }}>Contact Support</button>
                <button onClick={closeModal} className="w-full py-3 rounded-2xl text-sm font-semibold" style={{ color: t.textMuted }}>Close</button>
              </div>
            )}

            {/* Language Selector */}
            {activeModal === "language" && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-center" style={{ color: t.textPrimary }}>Select Language</h3>
                {[
                  { code: "en", label: "English", native: "English" },
                  { code: "fr", label: "French", native: "Français" },
                  { code: "es", label: "Spanish", native: "Español" },
                  { code: "de", label: "German", native: "Deutsch" },
                  { code: "pt", label: "Portuguese", native: "Português" },
                  { code: "ar", label: "Arabic", native: "العربية" },
                  { code: "zh", label: "Chinese", native: "中文" },
                ].map((lang) => {
                  const stored = typeof window !== "undefined" ? localStorage.getItem("nexus-user-language") || "en" : "en";
                  const isActive = stored === lang.code;
                  return (
                    <button key={lang.code}
                      onClick={() => {
                        localStorage.setItem("nexus-user-language", lang.code);
                        closeModal();
                        window.location.reload(); // Apply language change
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl transition-all"
                      style={{
                        background: isActive ? `${t.accentCyan}15` : t.inputBg,
                        border: isActive ? `1px solid ${t.accentCyan}50` : "1px solid transparent",
                      }}>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>{lang.label}</span>
                        <span className="text-xs" style={{ color: t.textMuted }}>{lang.native}</span>
                      </div>
                      {isActive && <span style={{ color: t.accentCyan }}>✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center px-5 pb-10"
          style={{ background: "rgba(0,0,0,0.55)" }}
          onClick={() => setShowSignOutConfirm(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-6 space-y-5"
            style={{ background: t.cardBg }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,77,106,0.12)" }}
              >
                <LogOut size={26} style={{ color: "#FF4D6A" }} />
              </div>
              <h2 className="text-lg font-bold" style={{ color: t.textPrimary }}>
                Sign Out
              </h2>
              <p className="text-sm" style={{ color: t.textMuted }}>
                Are you sure you want to sign out?
              </p>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowSignOutConfirm(false)}
                className="flex-1 py-3 rounded-2xl text-sm font-semibold"
                style={{ background: t.inputBg, color: t.textPrimary }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-2xl text-sm font-semibold"
                style={{ background: "#FF4D6A", color: "#FFFFFF" }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

            <BottomNav active="settings" />
      {/* Language Modal */}
      {showLanguageModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center px-0 pb-0"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setShowLanguageModal(false)}
        >
          <div
            className="w-full max-w-md rounded-t-[28px] p-6 space-y-3"
            style={{ background: t.cardBg }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="w-12 h-1 rounded-full mx-auto mb-4" style={{ background: t.mutedBg }} />
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: t.textPrimary }}>
                Select Language
              </h2>
              <button onClick={() => setShowLanguageModal(false)} className="p-1">
                <X size={20} style={{ color: t.textMuted }} />
              </button>
            </div>

            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setShowLanguageModal(false);
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-2xl transition-all"
                  style={{
                    background: isSelected ? "rgba(56,189,248,0.12)" : t.inputBg,
                    border: isSelected ? "1.5px solid #38BDF8" : `1.5px solid transparent`,
                  }}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                      {lang.nameEn}
                    </span>
                    <span className="text-xs mt-0.5" style={{ color: t.textMuted }}>
                      {lang.nameNative}
                    </span>
                  </div>
                  {isSelected && <Check size={18} style={{ color: "#38BDF8" }} />}
                </button>
              );
            })}
            <div className="pb-4" />
          </div>
        </div>
      )}
    </div>
  );
}
