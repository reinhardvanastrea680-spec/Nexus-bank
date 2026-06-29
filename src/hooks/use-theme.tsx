import { useState, useEffect } from "react";

type Theme = "light" | "dark";

// Read theme synchronously — safe because we guard typeof window.
// On the server this returns "dark" (matches the inline script default).
// On the client this returns the actual stored value immediately,
// so there's no flash and useTheme() is correct on the very first render.
function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = localStorage.getItem("nexus-bank-theme");
    if (stored === "light" || stored === "dark") return stored;
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    return "dark"; // default
  } catch {
    return "dark";
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    // Apply theme class to document whenever theme changes
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("nexus-bank-theme", theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const manual = localStorage.getItem("nexus-bank-theme-manual");
      if (!manual) setTheme(e.matches ? "dark" : "light");
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("nexus-bank-theme-manual", "1");
      return next;
    });
  };

  return { theme, setTheme, toggleTheme };
}
