/**
 * Central theme palette.
 * Usage: const t = themeColors(theme);
 * Then use t.pageBg, t.cardBg, t.textPrimary, etc.
 */
export function themeColors(theme: "light" | "dark") {
  const dark = theme === "dark";
  return {
    dark,
    pageBg:       dark ? "#0F1A2E"                       : "#F0F4F8",
    cardBg:       dark ? "#152035"                       : "#FFFFFF",
    cardBg2:      dark ? "#1A2840"                       : "#F7F9FC",
    inputBg:      dark ? "#1E3048"                       : "#F3F6FA",
    mutedBg:      dark ? "#233552"                       : "#E4EAF2",
    iconBg:       dark ? "#1E3048"                       : "#EEF4FF",
    border:       dark ? "rgba(255,255,255,0.09)"        : "rgba(0,0,0,0.08)",
    borderStrong: dark ? "rgba(255,255,255,0.14)"        : "rgba(0,0,0,0.12)",
    textPrimary:  dark ? "#FFFFFF"                       : "#0D1B2A",
    textSecondary:dark ? "#CBD5E1"                       : "#374151",
    textMuted:    dark ? "#8A9BB5"                       : "#64748B",
    accentCyan:   dark ? "#38BDF8"                       : "#0EA5E9",
    accentViolet: dark ? "#6366F1"                       : "#6366F1",
    accentGreen:  dark ? "#00E676"                       : "#10B981",
    accentRed:    dark ? "#FF4D6A"                       : "#EF4444",
    accentYellow: dark ? "#FFAB00"                       : "#F59E0B",
    navBg:        dark ? "#152035"                       : "#FFFFFF",
    navBorder:    dark ? "rgba(255,255,255,0.09)"        : "#E5E7EB",
    navActive:    dark ? "#FFFFFF"                       : "#0D1B2A",
    navInactive:  dark ? "#8A9BB5"                       : "#9CA3AF",
    gradientBtn:  "linear-gradient(135deg, #0EA5E9, #6366F1)",
    shadow:       dark ? "0 4px 24px rgba(0,0,0,0.4)"   : "0 2px 12px rgba(0,0,0,0.08)",
  };
}
