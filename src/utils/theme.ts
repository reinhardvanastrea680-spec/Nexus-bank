/**
 * Central theme palette.
 * Light mode uses a deeper, richer royal blue (#1648B0) instead of bright sky blue.
 */
export function themeColors(theme: "light" | "dark") {
  const dark = theme === "dark";
  return {
    dark,
    pageBg:       dark ? "#0F1A2E"                       : "#1648B0",   // deeper royal blue for light
    cardBg:       dark ? "#152035"                       : "#FFFFFF",
    cardBg2:      dark ? "#1A2840"                       : "#FFFFFF",
    inputBg:      dark ? "#1E3048"                       : "#F3F6FA",
    mutedBg:      dark ? "#233552"                       : "#E8F0FE",
    iconBg:       dark ? "#1E3048"                       : "rgba(255,255,255,0.85)",
    border:       dark ? "rgba(255,255,255,0.09)"        : "rgba(255,255,255,0.25)",
    borderStrong: dark ? "rgba(255,255,255,0.14)"        : "rgba(255,255,255,0.4)",
    textPrimary:  dark ? "#FFFFFF"                       : "#0D1B2A",
    textSecondary:dark ? "#CBD5E1"                       : "#1E40AF",
    textMuted:    dark ? "#8A9BB5"                       : "#475569",
    accentCyan:   dark ? "#38BDF8"                       : "#1E6FDB",   // slightly deeper blue accent
    accentViolet: dark ? "#6366F1"                       : "#6366F1",
    accentGreen:  dark ? "#00E676"                       : "#10B981",
    accentRed:    dark ? "#FF4D6A"                       : "#EF4444",
    accentYellow: dark ? "#FFAB00"                       : "#F59E0B",
    navBg:        dark ? "#152035"                       : "#FFFFFF",
    navBorder:    dark ? "rgba(255,255,255,0.09)"        : "#E5E7EB",
    navActive:    dark ? "#FFFFFF"                       : "#1648B0",   // deeper blue for active nav
    navInactive:  dark ? "#8A9BB5"                       : "#9CA3AF",
    gradientBtn:  dark
      ? "linear-gradient(135deg, #0EA5E9, #6366F1)"
      : "linear-gradient(135deg, #1648B0, #4F46E5)",   // deeper blue gradient
    shadow:       dark ? "0 4px 24px rgba(0,0,0,0.4)"   : "0 2px 12px rgba(0,0,0,0.08)",
  };
}
