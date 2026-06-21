import { useState, useEffect } from "react";
import { Link, useNavigate, createFileRoute } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Mail, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "../admin/hooks/useAdminAuth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

// Rate limiting: 5 attempts per minute
const MAX_LOGIN_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 60000;

export const Route = createFileRoute("/admin-login")({
  component: AdminLoginPage,
  head: () => ({
    meta: [
      { title: "Admin Login - Nexus Bank" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const { admin, loading: authLoading, adminLogin } = useAdminAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginAttempts, setLoginAttempts] = useState<{ count: number; timestamp: number }>(() => {
    const saved = localStorage.getItem("nexus-admin-login-attempts");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { count: 0, timestamp: Date.now() };
      }
    }
    return { count: 0, timestamp: Date.now() };
  });

  // Check if we need to reset rate limit
  useEffect(() => {
    const now = Date.now();
    if (now - loginAttempts.timestamp > RATE_LIMIT_WINDOW_MS) {
      setLoginAttempts({ count: 0, timestamp: now });
    }
  }, []);

  // Check if already logged in
  useEffect(() => {
    if (!authLoading && admin) {
      navigate({ to: "/admin/overview" });
    }
  }, [authLoading, admin, navigate]);

  const isRateLimited = () => {
    const now = Date.now();
    if (now - loginAttempts.timestamp > RATE_LIMIT_WINDOW_MS) {
      return false;
    }
    return loginAttempts.count >= MAX_LOGIN_ATTEMPTS;
  };

  const getTimeUntilReset = () => {
    const now = Date.now();
    const timePassed = now - loginAttempts.timestamp;
    const timeLeft = Math.max(0, RATE_LIMIT_WINDOW_MS - timePassed);
    return Math.ceil(timeLeft / 1000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Check rate limit
    if (isRateLimited()) {
      const timeLeft = getTimeUntilReset();
      const errorMsg = `Too many login attempts. Please try again in ${timeLeft} seconds.`;
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Basic input validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }

    setLoading(true);

    try {
      await adminLogin(email, password);
      // Reset login attempts on success
      setLoginAttempts({ count: 0, timestamp: Date.now() });
      localStorage.removeItem("nexus-admin-login-attempts");
      toast.success("Welcome back, Admin");
      navigate({ to: "/admin/overview" });
    } catch (err: any) {
      // Increment login attempts on failure
      const newAttempts = {
        count: loginAttempts.count + 1,
        timestamp: Date.now(),
      };
      setLoginAttempts(newAttempts);
      localStorage.setItem("nexus-admin-login-attempts", JSON.stringify(newAttempts));
      
      const errorMsg = err.message || "Invalid credentials";
      setError(errorMsg);
      toast.error(errorMsg);
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
    <div className="min-h-screen flex items-center justify-center bg-[#070B14]">
      {/* Animated background */}
      <div className="animated-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>

      <Card className="glass-card w-full max-w-md mx-4 border-0 shadow-2xl z-10">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-violet-600">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Nexus Control Centre</CardTitle>
          <p className="text-sm text-red-400 mt-2 flex items-center justify-center gap-1">
            <AlertTriangle size={14} />
            Restricted Access — Authorized Personnel Only
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="admin-email" className="text-sm font-medium text-blue-200">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-[#0d1625] border-[rgba(255,255,255,0.1)] text-white placeholder:text-blue-300/50 focus:ring-cyan-500"
                  placeholder="admin@nexusbank.com"
                  autoComplete="email"
                  autoFocus
                  required
                  disabled={isRateLimited()}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-password" className="text-sm font-medium text-blue-200">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-[#0d1625] border-[rgba(255,255,255,0.1)] text-white placeholder:text-blue-300/50 focus:ring-cyan-500"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  disabled={isRateLimited()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isRateLimited()}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <AlertTriangle className="text-red-400 flex-shrink-0" size={16} />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || isRateLimited()}
              className="w-full h-12 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? "Signing in..." : isRateLimited() ? "Try again later" : "Sign in to Console"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-blue-300 hover:text-white transition-colors">
              ← Back to User Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
