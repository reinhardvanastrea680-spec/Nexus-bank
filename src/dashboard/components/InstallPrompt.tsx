import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Already installed (running as standalone PWA)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
      return;
    }

    // Detect iOS
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    // Check if already dismissed recently
    const dismissed = localStorage.getItem("nexus-install-dismissed");
    if (dismissed && Date.now() - parseInt(dismissed) < 3 * 24 * 60 * 60 * 1000) return; // 3 days

    if (ios) {
      // Show iOS guide after 3 seconds
      const t = setTimeout(() => setShowBanner(true), 3000);
      return () => clearTimeout(t);
    }

    // Android / Chrome — listen for native prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") {
      setInstalled(true);
    }
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const dismiss = () => {
    setShowBanner(false);
    setShowIOSGuide(false);
    localStorage.setItem("nexus-install-dismissed", String(Date.now()));
  };

  if (installed || !showBanner) return null;

  return (
    <>
      {/* Install banner */}
      <div
        className="fixed bottom-20 left-4 right-4 z-50 rounded-2xl p-4 flex items-center gap-3 shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #0F1829, #1A2438)",
          border: "1px solid rgba(56,189,248,0.3)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(56,189,248,0.1)",
        }}
      >
        {/* App icon */}
        <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-xl text-white"
          style={{ background: "linear-gradient(135deg, #1D4ED8, #0EA5E9)" }}>
          N
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm">Install Nexus Bank</p>
          <p className="text-xs mt-0.5" style={{ color: "#8A9BB5" }}>
            {isIOS
              ? "Add to your Home Screen for the best experience"
              : "Install the app for faster access & offline use"}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleInstall}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg, #0EA5E9, #6366F1)" }}
          >
            <Download size={13} />
            Install
          </button>
          <button onClick={dismiss} className="p-1.5 rounded-lg" style={{ color: "#8A9BB5" }}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* iOS step-by-step guide */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-[60] flex items-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowIOSGuide(false)} />
          <div className="relative w-full rounded-t-[28px] p-6" style={{ background: "#0F1829" }}>
            <div className="w-12 h-1 rounded-full mx-auto mb-5" style={{ background: "#1E2D45" }} />
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl text-white"
                style={{ background: "linear-gradient(135deg, #1D4ED8, #0EA5E9)" }}>N</div>
              <div>
                <p className="text-white font-bold">Install Nexus Bank</p>
                <p className="text-xs" style={{ color: "#8A9BB5" }}>Add to your iPhone home screen</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {[
                { step: "1", icon: "⬆️", text: 'Tap the Share button at the bottom of Safari' },
                { step: "2", icon: "📲", text: 'Scroll down and tap "Add to Home Screen"' },
                { step: "3", icon: "✅", text: 'Tap "Add" in the top right corner' },
              ].map(({ step, icon, text }) => (
                <div key={step} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                    style={{ background: "linear-gradient(135deg, #0EA5E9, #6366F1)" }}>
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
              style={{ background: "linear-gradient(135deg, #0EA5E9, #6366F1)" }}>
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
