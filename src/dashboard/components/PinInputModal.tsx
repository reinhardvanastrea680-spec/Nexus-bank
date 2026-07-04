import { useState } from "react";
import * as React from "react";
import { X } from "lucide-react";
import { useTheme } from "../../hooks/use-theme";
import { themeColors } from "../../utils/theme";

interface PinInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pin: string) => void;
  loading?: boolean;
  externalError?: string; // Error from parent (e.g., incorrect PIN from server)
}

export function PinInputModal({ isOpen, onClose, onSubmit, loading = false, externalError = "" }: PinInputModalProps) {
  const { theme } = useTheme();
  const t = themeColors(theme);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  // Update error when external error changes
  React.useEffect(() => {
    if (externalError) {
      setError(externalError);
    }
  }, [externalError]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (pin.length !== 4) {
      setError("PIN must be 4 digits");
      return;
    }
    if (!/^\d{4}$/.test(pin)) {
      setError("PIN must contain only numbers");
      return;
    }
    setError(""); // Clear any previous errors
    onSubmit(pin);
  };

  const handlePinChange = (value: string) => {
    // Only allow numbers and max 4 digits
    const numericValue = value.replace(/\D/g, "").slice(0, 4);
    setPin(numericValue);
    setError(""); // Clear error when user types
  };

  const handleContactSupport = () => {
    onClose();
    // Navigate to support page
    window.location.href = "/support";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: t.cardBg, border: `1px solid ${t.border}` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold" style={{ color: t.textPrimary }}>
            Enter Transaction PIN
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors"
            style={{ background: t.inputBg }}
            disabled={loading}
          >
            <X size={18} style={{ color: t.textMuted }} />
          </button>
        </div>

        {/* Info */}
        <p className="text-sm mb-5" style={{ color: t.textMuted }}>
          Please enter your 4-digit transaction PIN to confirm this transaction.
        </p>

        {/* PIN Input */}
        <div className="mb-5">
          <label className="block text-sm font-semibold mb-2" style={{ color: t.textMuted }}>
            Transaction PIN
          </label>
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => handlePinChange(e.target.value)}
            placeholder="••••"
            className="w-full px-4 py-4 rounded-xl outline-none text-center text-2xl font-mono tracking-widest"
            style={{
              background: t.inputBg,
              color: t.textPrimary,
              border: error ? "2px solid #EF4444" : `1px solid ${t.border}`,
            }}
            autoFocus
            disabled={loading}
          />
          {error && (
            <p className="text-sm mt-2" style={{ color: "#EF4444" }}>
              {error}
            </p>
          )}
        </div>

        {/* Support Button */}
        <button
          onClick={handleContactSupport}
          className="w-full p-3 rounded-xl mb-5 font-semibold text-sm transition-all"
          style={{
            background: "rgba(56,189,248,0.1)",
            color: t.accentCyan,
            border: `1px solid ${t.accentCyan}`,
          }}
          disabled={loading}
        >
          Don't have a PIN yet? Contact Support →
        </button>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-semibold transition-all"
            style={{ background: t.inputBg, color: t.textMuted }}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl font-semibold text-white transition-all"
            style={{
              background: "linear-gradient(135deg, #1D4ED8, #0EA5E9)",
              opacity: loading ? 0.6 : 1,
            }}
            disabled={loading || pin.length !== 4}
          >
            {loading ? "Confirming..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
