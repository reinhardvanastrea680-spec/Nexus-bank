import { r as reactExports } from "../_libs/react.mjs";
function useTheme() {
  const [theme, setTheme] = reactExports.useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nexus-bank-theme");
      if (stored === "light" || stored === "dark") return stored;
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    }
    return "light";
  });
  reactExports.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("nexus-bank-theme", theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme((prev) => prev === "light" ? "dark" : "light");
  };
  return { theme, setTheme, toggleTheme };
}
export {
  useTheme as u
};
