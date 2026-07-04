import { useState, useEffect } from "react";

type Theme = "light" | "dark";

// Read theme synchronously — safe because we guard typeof window.
// Auto-detects system theme preference and follows device theme changes.
function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    // Always follow system preference - removed stored theme check
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
    return "dark"; // fallback default
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
    
    // Store current theme for consistency during session
    localStorage.setItem("nexus-bank-theme", theme);
  }, [theme]);

  // Listen for system theme changes and auto-sync
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Automatically sync with device theme changes
      setTheme(e.matches ? "dark" : "light");
    };
    
    // Use addEventListener for better browser support
    mediaQuery.addEventListener("change", handleChange);
    
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Optional: Manual toggle if needed (currently not used but kept for compatibility)
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, setTheme, toggleTheme };
}
