import { useState, useEffect } from "react";
import { Download, X, Shield } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function AdminInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Already installed as standalone
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const dismissed = localStorage.getItem("nexus-admin-install-dismissed");
    if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) return; // 7 days

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    if (ios) {
      const t = setTimeout(() => setShowBanner(true), 4000);
      return () => clearTimeout(t);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) { setShowIOSGuide(true); return; }
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const dismiss = () => {
    setShowBanner(false);
    setShowIOSGuide(false);
    localStorage.setItem("nexus-admin-install-dismissed", String(Date.now()));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Banner */}
      <div className="fixed bottom-6 right-6 z-50 rounded-2xl p-4 flex items-center gap-3 shadow-2xl max-w-sm"
        style={{
          background: "linear-gradient(135deg, #0A1020, #0F1829)",
          border: "1px solid rgba(6,182,212,0.4)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(6,182,212,0.1)",
        }}>
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #06B6D4, #6366F1)" }}>
          <Shield size={22} style={{ color: "#FFFFFF" }} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-white">Install Admin Console</p>
          <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>
            {isIOS ? "Add to Home Screen for quick access" : "Install for faster secure access"}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={handleInstall}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg, #06B6D4, #6366F1)" }}>
            <Download size={12} />
            Install
          </button>
          <button onClick={dismiss} className="p-1.5 rounded-lg" style={{ color: "#475569" }}>
            <X size={15} />
          </button>
        </div>
      </div>

      {/* iOS Guide */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-[60] flex items-end">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowIOSGuide(false)} />
          <div className="relative w-full rounded-t-[28px] p-6" style={{ background: "#0A1020", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="w-12 h-1 rounded-full mx-auto mb-5" style={{ background: "#1E293B" }} />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #06B6D4, #6366F1)" }}>
                <Shield size={22} style={{ color: "#FFFFFF" }} />
              </div>
              <div>
                <p className="text-white font-bold">Install Admin Console</p>
                <p className="text-xs" style={{ color: "#64748B" }}>Add to your iPhone home screen</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {[
                ["1", "⬆️", "Tap the Share button at the bottom of Safari"],
                ["2", "📲", 'Scroll down and tap "Add to Home Screen"'],
                ["3", "✅", 'Tap "Add" in the top right corner'],
              ].map(([step, icon, text]) => (
                <div key={step} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #06B6D4, #6366F1)" }}>
                    {step}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{icon}</span>
                    <p className="text-sm text-white">{text}</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setShowIOSGuide(false)}
              className="w-full py-4 rounded-xl font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #06B6D4, #6366F1)" }}>
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
