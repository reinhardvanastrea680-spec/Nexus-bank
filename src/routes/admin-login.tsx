import { useState, useEffect } from "react";
import { useNavigate, createFileRoute } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Mail, AlertTriangle, Shield } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "../admin/hooks/useAdminAuth";
import { AdminInstallPrompt } from "../dashboard/components/AdminInstallPrompt";
import {
  isRateLimited,
  getLockoutSeconds,
  recordFailedAttempt,
  resetAttempts,
  touchSession,
} from "../utils/adminSecurity";

export const Route = createFileRoute("/admin-login")({
  component: AdminLoginPage,
  head: () => ({
    meta: [
      { title: "Admin Login - Nexus Bank" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [
      { rel: "manifest", href: "/admin-manifest.json" },
    ],
  }),
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const { admin, loading: authLoading, adminLogin } = useAdminAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const [countdown, setCountdown] = useState(0);
  const [locked, setLocked]   = useState(false);

  // Mark this device as admin PWA so / always redirects here
  useEffect(() => {
    localStorage.setItem("nexus-pwa-type", "admin");
  }, []);

  // Refresh lockout countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      const secs = getLockoutSeconds();
      setCountdown(secs);
      setLocked(secs > 0);
    }, 1000);
    // Init immediately
    const secs = getLockoutSeconds();
    setCountdown(secs);
    setLocked(secs > 0);
    return () => clearInterval(timer);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && admin) {
      touchSession();
      navigate({ to: "/admin/overview" });
    }
  }, [authLoading, admin, navigate]);

  const formatCountdown = (s: number) => {
    if (s >= 3600) return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
    if (s >= 60)   return `${Math.floor(s / 60)}m ${s % 60}s`;
    return `${s}s`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isRateLimited()) {
      setError(`Account locked. Try again in ${formatCountdown(getLockoutSeconds())}.`);
      return;
    }

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      await adminLogin(email, password);
      resetAttempts();
      touchSession();
      toast.success("Welcome back, Admin");
      navigate({ to: "/admin/overview" });
    } catch (err: any) {
      const record = recordFailedAttempt();
      const remaining = Math.max(0, 5 - record.count);
      const lockSecs  = getLockoutSeconds();

      if (lockSecs > 0) {
        const msg = `Too many failed attempts. Locked for ${formatCountdown(lockSecs)}.`;
        setError(msg);
        toast.error(msg);
        setLocked(true);
        setCountdown(lockSecs);
      } else {
        const msg = remaining > 0
          ? `Invalid credentials. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`
          : "Invalid credentials.";
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070B14]">
        <div className="text-blue-300 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070B14] px-4">
      <div className="animated-bg"><div className="orb orb-1" /><div className="orb orb-2" /></div>

      <div className="w-full max-w-md z-10 rounded-2xl overflow-hidden shadow-2xl glass-card border-0">

        {/* Header */}
        <div className="px-8 pt-8 pb-6 text-center"
          style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #06B6D4, #6366F1)" }}>
            <Shield size={32} style={{ color: "#FFFFFF" }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "#FFFFFF" }}>Nexus Control Centre</h1>
          <p className="text-xs mt-2 flex items-center justify-center gap-1" style={{ color: "#EF4444" }}>
            <AlertTriangle size={12} />
            Restricted Access — Authorized Personnel Only
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-8" style={{ background: "#0D1625" }}>

          {/* Lockout banner */}
          {locked && (
            <div className="mb-5 p-4 rounded-xl flex items-center gap-3"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
              <Lock size={18} style={{ color: "#EF4444", flexShrink: 0 }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: "#EF4444" }}>Account Temporarily Locked</p>
                <p className="text-xs mt-0.5" style={{ color: "#FCA5A5" }}>
                  Too many failed attempts. Try again in <strong>{formatCountdown(countdown)}</strong>
                </p>
              </div>
            </div>
          )}

          {error && !locked && (
            <div className="mb-4 p-3 rounded-xl flex items-center gap-2"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
              <AlertTriangle size={15} style={{ color: "#EF4444", flexShrink: 0 }} />
              <p className="text-sm" style={{ color: "#EF4444" }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#E2E8F0" }}>Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#64748B" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nexusbank.com"
                  required
                  disabled={locked}
                  autoComplete="off"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl outline-none text-sm placeholder-slate-400"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    opacity: locked ? 0.5 : 1,
                    color: "#0F172A",
                    WebkitTextFillColor: "#0F172A",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "#06B6D4"; e.target.style.boxShadow = "0 0 0 3px rgba(6,182,212,0.12)"; }}
                  onBlur={(e)  => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#E2E8F0" }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#64748B" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={locked}
                  autoComplete="new-password"
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl outline-none text-sm placeholder-slate-400"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    opacity: locked ? 0.5 : 1,
                    color: "#0F172A",
                    WebkitTextFillColor: "#0F172A",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "#06B6D4"; e.target.style.boxShadow = "0 0 0 3px rgba(6,182,212,0.12)"; }}
                  onBlur={(e)  => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={locked}
                  className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "#64748B" }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading || locked}
              className="w-full py-4 rounded-xl font-bold text-white transition-all text-base"
              style={{
                background: locked ? "#1E293B" : "linear-gradient(135deg, #06B6D4, #6366F1)",
                opacity: loading || locked ? 0.6 : 1,
                cursor: locked ? "not-allowed" : "pointer",
                boxShadow: locked ? "none" : "0 4px 14px rgba(6,182,212,0.3)",
              }}>
              {loading ? "Signing in…" : locked ? `Locked — ${formatCountdown(countdown)}` : "Sign In to Console"}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: "#64748B" }}>
            All login attempts are logged and monitored
          </p>
        </div>
      </div>
      <AdminInstallPrompt />
    </div>
  );
}
