import { useState, useEffect } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    // 1. Check if user has manually set a preference
    const stored = localStorage.getItem("nexus-bank-theme");
    if (stored === "light" || stored === "dark") return stored;
    // 2. Fall back to system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    return "light";
  });

  useEffect(() => {
    // Apply theme to document
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("nexus-bank-theme", theme);
  }, [theme]);

  // Listen for system theme changes and apply automatically
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually overridden
      const stored = localStorage.getItem("nexus-bank-theme-manual");
      if (!stored) {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      // Mark as manually overridden so system changes don't override user choice
      localStorage.setItem("nexus-bank-theme-manual", "1");
      return next;
    });
  };

  return { theme, setTheme, toggleTheme };
}
