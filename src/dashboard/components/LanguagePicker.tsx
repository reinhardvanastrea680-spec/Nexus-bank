import { useState } from "react";
import { ChevronUp, Check } from "lucide-react";
import { useLanguage, SUPPORTED_LANGUAGES } from "../../hooks/use-language";

// Flag emojis for each language
const FLAGS: Record<string, string> = {
  en: "🇺🇸",
  fr: "🇫🇷",
  es: "🇪🇸",
  de: "🇩🇪",
  pt: "🇧🇷",
  ar: "🇸🇦",
  zh: "🇨🇳",
};

export function LanguagePicker() {
  const { language, setLanguage, currentLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[90]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Language menu popup */}
      {open && (
        <div
          className="fixed bottom-24 left-4 z-[100] rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: "rgba(10,16,32,0.96)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(20px)",
            minWidth: "200px",
            animation: "nx-fadeUp 0.25s cubic-bezier(0.22,1,0.36,1) both",
          }}
        >
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              Select Language
            </p>
          </div>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 transition-all text-left"
              style={{
                background: language === lang.code
                  ? "rgba(56,189,248,0.12)"
                  : "transparent",
              }}
            >
              <span className="text-xl leading-none">{FLAGS[lang.code]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{lang.nameEn}</p>
                <p className="text-xs text-white/40">{lang.nameNative}</p>
              </div>
              {language === lang.code && (
                <Check size={14} className="text-cyan-400 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-20 left-4 z-[95] flex items-center gap-2 px-3 py-2 rounded-2xl shadow-lg transition-all active:scale-95 hover:scale-105"
        style={{
          background: "rgba(10,16,32,0.85)",
          border: "1px solid rgba(255,255,255,0.15)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
        aria-label="Select language"
      >
        <span className="text-lg leading-none">{FLAGS[language]}</span>
        <span className="text-xs font-bold text-white uppercase tracking-wide">
          {language}
        </span>
        <ChevronUp
          size={13}
          className="text-white/60 transition-transform duration-200"
          style={{ transform: open ? "rotate(0deg)" : "rotate(180deg)" }}
        />
      </button>
    </>
  );
}
