import { useState, useEffect, useCallback } from "react";
import { ChevronDown, Check, Languages } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "../../hooks/use-language";
import { useLang } from "../../hooks/LanguageContext";

// All 15 language flags
const FLAGS: Record<string, string> = {
  en: "🇺🇸", fr: "🇫🇷", es: "🇪🇸", de: "🇩🇪", pt: "🇧🇷",
  it: "🇮🇹", nl: "🇳🇱", ru: "🇷🇺", tr: "🇹🇷", hi: "🇮🇳",
  ar: "🇸🇦", zh: "🇨🇳", ja: "🇯🇵", ko: "🇰🇷", sw: "🇰🇪",
};

export function LanguagePicker({ variant = "floating" }: { variant?: "floating" | "header" }) {
  const { language, setLanguage } = useLang();
  const [open, setOpen] = useState(false);

  // ── Feature 3: Scroll lock while menu is open ────────────────────────────
  useEffect(() => {
    if (open) {
      // Save current scroll position and lock body
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }
    return () => {
      // Cleanup on unmount
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [open]);

  // ── Keyboard close ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  const handleSelect = useCallback((code: string) => {
    setLanguage(code as any);
    setOpen(false);
  }, [setLanguage]);

  const flag = FLAGS[language] || "🌐";

  if (variant === "header") {
    return (
      <>
        {/* ── Full-screen backdrop overlay with screen lock ── */}
        {open && (
          <div
            className="fixed inset-0 z-[9998]"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ── Language modal (centered, on top of everything) ── */}
        {open && (
          <div
            role="listbox"
            aria-label="Select language"
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] rounded-3xl shadow-2xl overflow-hidden"
            style={{
              background: "rgba(8,14,28,0.98)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(24px)",
              width: "min(90vw, 380px)",
              maxHeight: "75vh",
              overflowY: "auto",
              animation: "nx-scaleIn 0.25s cubic-bezier(0.22,1,0.36,1) both",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 px-5 py-4 flex items-center justify-between"
              style={{ background: "rgba(8,14,28,0.98)", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
              <div className="flex items-center gap-2">
                <Languages size={18} className="text-cyan-400" />
                <p className="text-base font-bold text-white uppercase tracking-wider">
                  Select Language
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-white/10 active:scale-90"
                style={{ background: "rgba(255,255,255,0.08)" }}
                aria-label="Close"
              >
                <span className="text-white/70 text-2xl leading-none font-light">×</span>
              </button>
            </div>

            {/* Language options */}
            <div className="p-3">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isActive = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => handleSelect(lang.code)}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all text-left mb-2 hover:bg-white/5"
                    style={{
                      background: isActive ? "rgba(56,189,248,0.18)" : "transparent",
                      border: isActive ? "1px solid rgba(56,189,248,0.5)" : "1px solid transparent",
                    }}
                  >
                    <span className="text-3xl leading-none flex-shrink-0" role="img" aria-label={lang.nameEn}>
                      {FLAGS[lang.code] || "🌐"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold leading-tight"
                        style={{ color: isActive ? "#38BDF8" : "#FFFFFF" }}>
                        {lang.nameEn}
                      </p>
                      <p className="text-sm leading-tight mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                        {lang.nameNative}
                      </p>
                    </div>
                    {isActive && <Check size={18} className="text-cyan-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Header button ── */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={`Language: ${SUPPORTED_LANGUAGES.find(l => l.code === language)?.nameEn || "English"}. Click to change.`}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-90"
          style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}
        >
          <span className="text-lg leading-none" role="img" aria-hidden="true">{flag}</span>
        </button>
      </>
    );
  }

  return (
    <>
      {/* ── Scroll-locking backdrop ── */}
      {open && (
        <div
          className="fixed inset-0 z-[98]"
          style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Language menu ── */}
      {open && (
        <div
          role="listbox"
          aria-label="Select language"
          className="fixed left-4 z-[99] rounded-2xl shadow-2xl overflow-hidden"
          style={{
            bottom: "84px",
            background: "rgba(8,14,28,0.97)",
            border: "1px solid rgba(255,255,255,0.14)",
            backdropFilter: "blur(24px)",
            minWidth: "220px",
            maxHeight: "60vh",
            overflowY: "auto",
            animation: "nx-fadeUp 0.2s cubic-bezier(0.22,1,0.36,1) both",
          }}
        >
          {/* Header */}
          <div className="sticky top-0 px-4 py-3 flex items-center gap-2"
            style={{ background: "rgba(8,14,28,0.98)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <Languages size={14} className="text-cyan-400" />
            <p className="text-xs font-bold text-white/60 uppercase tracking-widest">
              Language
            </p>
          </div>

          {/* Language options */}
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isActive = language === lang.code;
            return (
              <button
                key={lang.code}
                role="option"
                aria-selected={isActive}
                onClick={() => handleSelect(lang.code)}
                className="w-full flex items-center gap-3 px-4 py-2.5 transition-all text-left"
                style={{
                  background: isActive ? "rgba(56,189,248,0.14)" : "transparent",
                  borderLeft: isActive ? "3px solid #38BDF8" : "3px solid transparent",
                }}
              >
                <span className="text-2xl leading-none flex-shrink-0" role="img" aria-label={lang.nameEn}>
                  {FLAGS[lang.code] || "🌐"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-tight"
                    style={{ color: isActive ? "#38BDF8" : "#FFFFFF" }}>
                    {lang.nameEn}
                  </p>
                  <p className="text-xs leading-tight mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {lang.nameNative}
                  </p>
                </div>
                {isActive && <Check size={14} className="text-cyan-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Floating trigger button ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Language: ${SUPPORTED_LANGUAGES.find(l => l.code === language)?.nameEn || "English"}. Click to change.`}
        className="fixed left-4 z-[97] flex items-center gap-2 rounded-2xl shadow-xl transition-all active:scale-95"
        style={{
          bottom: "80px",
          padding: "10px 14px",
          background: open ? "rgba(56,189,248,0.18)" : "rgba(8,14,28,0.88)",
          border: open ? "1px solid rgba(56,189,248,0.5)" : "1px solid rgba(255,255,255,0.16)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          minWidth: "82px",
        }}
      >
        <span className="text-2xl leading-none" role="img" aria-hidden="true">{flag}</span>
        <span className="text-sm font-bold text-white uppercase tracking-wide">
          {language.toUpperCase()}
        </span>
        <ChevronDown
          size={13}
          style={{
            color: "rgba(255,255,255,0.55)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
      </button>
    </>
  );
}
