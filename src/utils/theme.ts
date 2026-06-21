/**
 * Central theme palette.
 * Usage: const t = themeColors(theme);
 * Then use t.pageBg, t.cardBg, t.textPrimary, etc.
 */
export function themeColors(theme: "light" | "dark") {
  const dark = theme === "dark";
  return {
    dark,
    pageBg:       dark ? "#0B1120"                       : "#F0F4F8",
    cardBg:       dark ? "#0F1A2E"                       : "#FFFFFF",
    cardBg2:      dark ? "#111827"                       : "#F7F9FC",
    inputBg:      dark ? "#1A2438"                       : "#F3F6FA",
    mutedBg:      dark ? "#1E2D45"                       : "#E4EAF2",
    iconBg:       dark ? "#1E2D45"                       : "#EEF4FF",
    border:       dark ? "rgba(255,255,255,0.07)"        : "rgba(0,0,0,0.08)",
    borderStrong: dark ? "rgba(255,255,255,0.12)"        : "rgba(0,0,0,0.12)",
    textPrimary:  dark ? "#FFFFFF"                       : "#0D1B2A",
    textSecondary:dark ? "#CBD5E1"                       : "#374151",
    textMuted:    dark ? "#8A9BB5"                       : "#64748B",
    accentCyan:   dark ? "#38BDF8"                       : "#0EA5E9",
    accentViolet: dark ? "#6366F1"                       : "#6366F1",
    accentGreen:  dark ? "#00E676"                       : "#10B981",
    accentRed:    dark ? "#FF4D6A"                       : "#EF4444",
    accentYellow: dark ? "#FFAB00"                       : "#F59E0B",
    navBg:        dark ? "#0F1A2E"                       : "#FFFFFF",
    navBorder:    dark ? "rgba(255,255,255,0.07)"        : "#E5E7EB",
    navActive:    dark ? "#FFFFFF"                       : "#0D1B2A",
    navInactive:  dark ? "#8A9BB5"                       : "#9CA3AF",
    gradientBtn:  "linear-gradient(135deg, #0EA5E9, #6366F1)",
    shadow:       dark ? "0 4px 24px rgba(0,0,0,0.4)"   : "0 2px 12px rgba(0,0,0,0.08)",
  };
}
