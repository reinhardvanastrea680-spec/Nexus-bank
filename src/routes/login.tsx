import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useUserAuth } from "../dashboard/hooks/useUserAuth";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading, userLogin } = useUserAuth();

  // Clear admin flag so this device is treated as user going forward
  useEffect(() => {
    localStorage.removeItem("nexus-pwa-type");
  }, []);

  useEffect(() => {
    if (!authLoading && user) navigate({ to: "/" });
  }, [authLoading, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await userLogin(email, password);
      navigate({ to: "/" });
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative"
      style={{ background: "linear-gradient(135deg, #F0F4F8 0%, #E4EDF9 100%)" }}
    >
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl"
          style={{ background: "#0EA5E9", opacity: 0.15 }} />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full blur-3xl"
          style={{ background: "#6366F1", opacity: 0.12 }} />
      </div>

      <div
        className="w-full max-w-md z-10 rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.07)" }}
      >
        {/* ── Back to landing page ── */}
        <div className="px-8 pt-5 pb-0">
          <a
            href={import.meta.env.VITE_LANDING_URL || "https://nexus-bank-landing.vercel.app"}
            className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: "#64748B" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Nexus Bank
          </a>
        </div>

        {/* ── Header band ── */}
        <div
          className="px-8 pt-6 pb-6 text-center"
          style={{ background: "linear-gradient(135deg, #1D4ED8 0%, #0EA5E9 100%)" }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-lg leading-tight">Nexus Bank</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
                Banking Beyond Boundaries
              </p>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.75)" }}>
            Sign in to your account
          </p>
        </div>

        {/* ── Form ── */}
        <div className="px-8 py-8">
          {error && (
            <div
              className="mb-5 p-3 rounded-xl text-sm flex items-center gap-2"
              style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "#9CA3AF" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@nexusbank.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl outline-none text-sm"
                  style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", color: "#0D1B2A" }}
                  onFocus={(e) => { e.target.style.borderColor = "#0EA5E9"; e.target.style.boxShadow = "0 0 0 3px rgba(14,165,233,0.12)"; }}
                  onBlur={(e)  => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "#9CA3AF" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl outline-none text-sm"
                  style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", color: "#0D1B2A" }}
                  onFocus={(e) => { e.target.style.borderColor = "#0EA5E9"; e.target.style.boxShadow = "0 0 0 3px rgba(14,165,233,0.12)"; }}
                  onBlur={(e)  => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: "#9CA3AF" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-semibold text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #1D4ED8, #0EA5E9)",
                opacity: loading ? 0.7 : 1,
                boxShadow: "0 4px 14px rgba(14,165,233,0.35)",
              }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "#9CA3AF" }}>
            Don't have an account? Contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
