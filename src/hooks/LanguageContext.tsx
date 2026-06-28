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
  // Always start with "en" so SSR and first client render match (avoids hydration mismatch).
  // The real stored value is applied after mount in useEffect.
  const [language, setLang] = useState<LanguageCode>("en");

  useEffect(() => {
    // Read localStorage only after hydration
    try {
      const s = localStorage.getItem(STORAGE_KEY) as LanguageCode;
      if (s && SUPPORTED_LANGUAGES.some(l => l.code === s)) {
        setLang(s);
      }
    } catch {}

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
  // Fallback outside provider — safe for SSR (no localStorage access)
  return {
    language: "en",
    setLanguage: () => {},
    t: (k: string) => (translations as any)["en"]?.[k] ?? k,
    currentLanguage: SUPPORTED_LANGUAGES[0],
  };
}
