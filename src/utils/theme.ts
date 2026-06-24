/**
 * Central theme palette.
 * Usage: const t = themeColors(theme);
 * Then use t.pageBg, t.cardBg, t.textPrimary, etc.
 */
export function themeColors(theme: "light" | "dark") {
  const dark = theme === "dark";
  return {
    dark,
    pageBg:       dark ? "#0F1A2E"                       : "#1D6BE5",   // light = blue header
    cardBg:       dark ? "#152035"                       : "#FFFFFF",
    cardBg2:      dark ? "#1A2840"                       : "#FFFFFF",
    inputBg:      dark ? "#1E3048"                       : "#F3F6FA",
    mutedBg:      dark ? "#233552"                       : "#E8F0FE",
    iconBg:       dark ? "#1E3048"                       : "rgba(255,255,255,0.85)",
    border:       dark ? "rgba(255,255,255,0.09)"        : "rgba(255,255,255,0.25)",
    borderStrong: dark ? "rgba(255,255,255,0.14)"        : "rgba(255,255,255,0.4)",
    textPrimary:  dark ? "#FFFFFF"                       : "#FFFFFF",   // white on blue header
    textSecondary:dark ? "#CBD5E1"                       : "#E8F0FE",
    textMuted:    dark ? "#8A9BB5"                       : "rgba(255,255,255,0.75)",
    accentCyan:   dark ? "#38BDF8"                       : "#38BDF8",
    accentViolet: dark ? "#6366F1"                       : "#6366F1",
    accentGreen:  dark ? "#00E676"                       : "#00E676",
    accentRed:    dark ? "#FF4D6A"                       : "#FF4D6A",
    accentYellow: dark ? "#FFAB00"                       : "#FFAB00",
    navBg:        dark ? "#152035"                       : "#FFFFFF",   // nav = white
    navBorder:    dark ? "rgba(255,255,255,0.09)"        : "#E5E7EB",
    navActive:    dark ? "#FFFFFF"                       : "#1D6BE5",   // active nav = blue
    navInactive:  dark ? "#8A9BB5"                       : "#9CA3AF",
    gradientBtn:  "linear-gradient(135deg, #0EA5E9, #6366F1)",
    shadow:       dark ? "0 4px 24px rgba(0,0,0,0.4)"   : "0 2px 12px rgba(0,0,0,0.08)",
  };
}
