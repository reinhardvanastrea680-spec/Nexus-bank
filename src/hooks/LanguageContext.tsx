/**
 * LanguageContext — wraps the entire app so every component re-renders
 * when the language changes. This is the permanent fix for site-wide
 * language switching without needing to import useLanguage in every file.
 */
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { SUPPORTED_LANGUAGES, type LanguageCode, type TranslationKey } from "./use-language";

const STORAGE_KEY = "nexus-user-language";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: (key: string) => string;
  currentLanguage: typeof SUPPORTED_LANGUAGES[0];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// Import translations from the hook file
import { translations } from "./use-language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY) as LanguageCode;
      if (s && SUPPORTED_LANGUAGES.some(l => l.code === s)) return s;
    } catch {}
    return "en";
  });

  useEffect(() => {
    const handler = () => {
      try {
        const s = localStorage.getItem(STORAGE_KEY) as LanguageCode;
        if (s && SUPPORTED_LANGUAGES.some(l => l.code === s)) setLanguageState(s);
      } catch {}
    };
    window.addEventListener("nexus-language-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("nexus-language-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const setLanguage = (code: LanguageCode) => {
    setLanguageState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
      window.dispatchEvent(new CustomEvent("nexus-language-change", { detail: code }));
    } catch {}
  };

  const t = (key: string): string =>
    (translations as any)[language]?.[key] ??
    (translations as any)["en"]?.[key] ??
    key;

  const currentLanguage = SUPPORTED_LANGUAGES.find(l => l.code === language)!;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Fallback when used outside provider — read from localStorage directly
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as LanguageCode || "en";
      const t = (key: string): string =>
        (translations as any)[stored]?.[key] ?? (translations as any)["en"]?.[key] ?? key;
      return { language: stored, setLanguage: () => {}, t, currentLanguage: SUPPORTED_LANGUAGES.find(l => l.code === stored)! };
    } catch {}
    return { language: "en" as LanguageCode, setLanguage: () => {}, t: (k: string) => k, currentLanguage: SUPPORTED_LANGUAGES[0] };
  }
  return ctx;
}
