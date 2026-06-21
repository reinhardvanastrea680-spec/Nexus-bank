import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useTheme } from "./use-theme-BfOV-CAK.mjs";
import { d as Settings, B as Bell, H as House, e as History, f as Headphones } from "../_libs/lucide-react.mjs";
function themeColors(theme) {
  const dark = theme === "dark";
  return {
    dark,
    pageBg: dark ? "#0B1120" : "#F0F4F8",
    cardBg: dark ? "#0F1A2E" : "#FFFFFF",
    cardBg2: dark ? "#111827" : "#F7F9FC",
    inputBg: dark ? "#1A2438" : "#F3F6FA",
    mutedBg: dark ? "#1E2D45" : "#E4EAF2",
    iconBg: dark ? "#1E2D45" : "#EEF4FF",
    border: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
    borderStrong: dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
    textPrimary: dark ? "#FFFFFF" : "#0D1B2A",
    textSecondary: dark ? "#CBD5E1" : "#374151",
    textMuted: dark ? "#8A9BB5" : "#64748B",
    accentCyan: dark ? "#38BDF8" : "#0EA5E9",
    accentViolet: dark ? "#6366F1" : "#6366F1",
    accentGreen: dark ? "#00E676" : "#10B981",
    accentRed: dark ? "#FF4D6A" : "#EF4444",
    accentYellow: dark ? "#FFAB00" : "#F59E0B",
    navBg: dark ? "#0F1A2E" : "#FFFFFF",
    navBorder: dark ? "rgba(255,255,255,0.07)" : "#E5E7EB",
    navActive: dark ? "#FFFFFF" : "#0D1B2A",
    navInactive: dark ? "#8A9BB5" : "#9CA3AF",
    gradientBtn: "linear-gradient(135deg, #0EA5E9, #6366F1)",
    shadow: dark ? "0 4px 24px rgba(0,0,0,0.4)" : "0 2px 12px rgba(0,0,0,0.08)"
  };
}
const items = [
  { key: "settings", label: "Settings", icon: Settings, to: "/settings" },
  { key: "notifications", label: "Notifications", icon: Bell, to: "/notifications" },
  { key: "home", label: "Home", icon: House, to: "/" },
  { key: "transactions", label: "Transactions", icon: History, to: "/transactions" },
  { key: "support", label: "Support", icon: Headphones, to: "/support" }
];
function BottomNav({ active }) {
  const { theme } = useTheme();
  const t = themeColors(theme);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-3 border-t",
      style: { background: t.navBg, borderColor: t.navBorder },
      children: items.map(({ key, label, icon: Icon, to }) => {
        const isActive = key === active;
        const color = isActive ? t.navActive : t.navInactive;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to, className: "flex flex-col items-center gap-0.5 min-w-0 px-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 22, style: { color }, strokeWidth: isActive ? 2.5 : 1.8 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", style: { color }, children: label })
        ] }, key);
      })
    }
  );
}
export {
  BottomNav as B,
  themeColors as t
};
