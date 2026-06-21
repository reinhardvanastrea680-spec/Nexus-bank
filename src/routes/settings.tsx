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
} from "lucide-react";
import { useUserAuth } from "../dashboard/hooks/useUserAuth";
import { useUserAccount } from "../dashboard/hooks/useUserAccount";
import { useTheme } from "../hooks/use-theme";
import { themeColors } from "../utils/theme";
import { BottomNav } from "../dashboard/components/BottomNav";

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

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [language] = useState("English");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  const handleLogout = async () => {
    try {
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
          <button
            className="w-full flex items-center justify-between p-4 rounded-2xl"
            style={{ background: t.cardBg }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "#38BDF8", color: "#0B1120" }}
              >
                <User size={18} />
              </div>
              <div className="text-left">
                <p
                  className="text-sm font-semibold"
                  style={{ color: t.textPrimary }}
                >
                  {account?.fullName || "User Name"}
                </p>
                <p className="text-xs" style={{ color: t.textMuted }}>
                  {user?.email}
                </p>
              </div>
            </div>
          </button>

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
                    <span
                      className="text-sm"
                      style={{ color: t.textPrimary }}
                    >
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell size={16} style={{ color: "#38BDF8" }} />
                    <span
                      className="text-sm"
                      style={{ color: t.textPrimary }}
                    >
                      SMS Alerts
                    </span>
                  </div>
                  <button
                    onClick={() => setSmsAlerts(!smsAlerts)}
                    className="w-12 h-6 rounded-full flex items-center"
                    style={{
                      background: smsAlerts ? t.accentCyan : t.inputBg,
                      paddingLeft: smsAlerts ? "26px" : "2px",
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
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: t.inputBg }}
                >
                  <Lock size={16} style={{ color: "#38BDF8" }} />
                </div>
                <span
                  className="text-sm font-semibold"
                  style={{ color: t.textPrimary }}
                >
                  Change Password
                </span>
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

            <button
              className="w-full flex items-center justify-between p-4 rounded-2xl"
              style={{ background: t.cardBg }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: t.inputBg }}
                >
                  <History size={16} style={{ color: "#38BDF8" }} />
                </div>
                <span
                  className="text-sm font-semibold"
                  style={{ color: t.textPrimary }}
                >
                  Login Activity
                </span>
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
            <button
              className="w-full flex items-center justify-between p-4 rounded-2xl"
              style={{ background: t.cardBg }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: t.inputBg }}
                >
                  <Eye size={16} style={{ color: "#38BDF8" }} />
                </div>
                <span
                  className="text-sm font-semibold"
                  style={{ color: t.textPrimary }}
                >
                  Privacy Controls
                </span>
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
            <button
              className="w-full flex items-center justify-between p-4 rounded-2xl"
              style={{ background: t.cardBg }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: t.inputBg }}
                >
                  <Link2 size={16} style={{ color: "#38BDF8" }} />
                </div>
                <span
                  className="text-sm font-semibold"
                  style={{ color: t.textPrimary }}
                >
                  External Bank Accounts
                </span>
              </div>
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
                  <Link2 size={16} style={{ color: "#38BDF8" }} />
                </div>
                <span
                  className="text-sm font-semibold"
                  style={{ color: t.textPrimary }}
                >
                  Connected Cards
                </span>
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
                {language}
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

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl"
          style={{ background: "rgba(255,77,106,0.1)" }}
        >
          <LogOut size={18} style={{ color: "#FF4D6A" }} />
          <span className="text-sm font-semibold" style={{ color: "#FF4D6A" }}>
            Log Out
          </span>
        </button>
      </div>

            <BottomNav active="settings" />
    </div>
  );
}
