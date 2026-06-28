import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { SUPPORTED_LANGUAGES, translations, type LanguageCode } from "./use-language";

const STORAGE_KEY = "nexus-user-language";

interface LangCtx {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: (key: string) => string;
  currentLanguage: typeof SUPPORTED_LANGUAGES[0];
}

const LanguageContext = createContext<LangCtx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLang] = useState<LanguageCode>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY) as LanguageCode;
      if (s && SUPPORTED_LANGUAGES.some(l => l.code === s)) return s;
    } catch {}
    return "en";
  });

  // Always sync from event — no stale closure
  useEffect(() => {
    const handler = (e: Event) => {
      const code = (e as CustomEvent).detail || localStorage.getItem(STORAGE_KEY);
      if (code && SUPPORTED_LANGUAGES.some(l => l.code === code)) {
        setLang(code as LanguageCode);
      }
    };
    window.addEventListener("nexus-language-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("nexus-language-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const setLanguage = (code: LanguageCode) => {
    setLang(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
      window.dispatchEvent(new CustomEvent("nexus-language-change", { detail: code }));
    } catch {}
  };

  const t = (key: string): string =>
    (translations as any)[language]?.[key] ??
    (translations as any)["en"]?.[key] ??
    key;

  const currentLanguage = SUPPORTED_LANGUAGES.find(l => l.code === language) ?? SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang(): LangCtx {
  const ctx = useContext(LanguageContext);
  if (ctx) return ctx;
  // Fallback outside provider
  const stored = (() => { try { return localStorage.getItem(STORAGE_KEY) as LanguageCode || "en"; } catch { return "en" as LanguageCode; } })();
  return {
    language: stored,
    setLanguage: () => {},
    t: (k: string) => (translations as any)[stored]?.[k] ?? (translations as any)["en"]?.[k] ?? k,
    currentLanguage: SUPPORTED_LANGUAGES.find(l => l.code === stored) ?? SUPPORTED_LANGUAGES[0],
  };
}
