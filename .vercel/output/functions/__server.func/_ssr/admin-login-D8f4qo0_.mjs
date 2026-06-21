import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useAdminAuth } from "./useAdminAuth-D1_k00My.mjs";
import { C as Card, b as CardHeader, c as CardTitle, e as CardContent, I as Input, B as Button } from "./router-8iYk_PDV.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__storage.mjs";
import { L as Lock, T as TriangleAlert, a as Mail, v as EyeOff, E as Eye } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/tanstack__history.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "async_hooks";
import "stream";
import "util";
import "crypto";
import "../_libs/isbot.mjs";
import "./adminConfig-D-CDJgKq.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/firebase__component.mjs";
import "../_libs/firebase__util.mjs";
import "../_libs/firebase__webchannel-wrapper.mjs";
import "../_libs/@grpc/grpc-js.mjs";
import "process";
import "tls";
import "fs";
import "os";
import "net";
import "events";
import "http2";
import "http";
import "url";
import "dns";
import "zlib";
import "../_libs/@grpc/proto-loader.mjs";
import "path";
import "../_libs/lodash.camelcase.mjs";
import "../_libs/protobufjs.mjs";
import "../_libs/protobufjs__aspromise.mjs";
import "../_libs/protobufjs__base64.mjs";
import "../_libs/protobufjs__eventemitter.mjs";
import "../_libs/protobufjs__float.mjs";
import "../_libs/protobufjs__utf8.mjs";
import "../_libs/protobufjs__pool.mjs";
import "../_libs/long.mjs";
import "../_libs/protobufjs__codegen.mjs";
import "../_libs/protobufjs__fetch.mjs";
import "../_libs/protobufjs__path.mjs";
import "../_libs/re2js.mjs";
import "../_libs/idb.mjs";
const MAX_LOGIN_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 6e4;
function AdminLoginPage() {
  const navigate = useNavigate();
  const {
    admin,
    loading: authLoading,
    adminLogin
  } = useAdminAuth();
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(false);
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [loginAttempts, setLoginAttempts] = reactExports.useState(() => {
    const saved = localStorage.getItem("nexus-admin-login-attempts");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {
          count: 0,
          timestamp: Date.now()
        };
      }
    }
    return {
      count: 0,
      timestamp: Date.now()
    };
  });
  reactExports.useEffect(() => {
    const now = Date.now();
    if (now - loginAttempts.timestamp > RATE_LIMIT_WINDOW_MS) {
      setLoginAttempts({
        count: 0,
        timestamp: now
      });
    }
  }, []);
  reactExports.useEffect(() => {
    if (!authLoading && admin) {
      navigate({
        to: "/admin/overview"
      });
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
    return Math.ceil(timeLeft / 1e3);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (isRateLimited()) {
      const timeLeft = getTimeUntilReset();
      const errorMsg = `Too many login attempts. Please try again in ${timeLeft} seconds.`;
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
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
      setLoginAttempts({
        count: 0,
        timestamp: Date.now()
      });
      localStorage.removeItem("nexus-admin-login-attempts");
      toast.success("Welcome back, Admin");
      navigate({
        to: "/admin/overview"
      });
    } catch (err) {
      const newAttempts = {
        count: loginAttempts.count + 1,
        timestamp: Date.now()
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-[#070B14]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-blue-300 animate-pulse", children: "Loading..." }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex items-center justify-center bg-[#070B14]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animated-bg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "orb orb-1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "orb orb-2" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card w-full max-w-md mx-4 border-0 shadow-2xl z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center pb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-violet-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-8 h-8 text-white" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl font-bold text-white", children: "Nexus Control Centre" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-red-400 mt-2 flex items-center justify-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 14 }),
          "Restricted Access — Authorized Personnel Only"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleLogin, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "admin-email", className: "text-sm font-medium text-blue-200", children: "Admin Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "admin-email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "pl-10 h-12 bg-[#0d1625] border-[rgba(255,255,255,0.1)] text-white placeholder:text-blue-300/50 focus:ring-cyan-500", placeholder: "admin@nexusbank.com", autoComplete: "email", autoFocus: true, required: true, disabled: isRateLimited() })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "admin-password", className: "text-sm font-medium text-blue-200", children: "Password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "admin-password", type: showPassword ? "text" : "password", value: password, onChange: (e) => setPassword(e.target.value), className: "pl-10 pr-10 h-12 bg-[#0d1625] border-[rgba(255,255,255,0.1)] text-white placeholder:text-blue-300/50 focus:ring-cyan-500", placeholder: "••••••••", autoComplete: "current-password", required: true, disabled: isRateLimited() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors", "aria-label": showPassword ? "Hide password" : "Show password", disabled: isRateLimited(), children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 }) })
            ] })
          ] }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "text-red-400 flex-shrink-0", size: 16 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-400 text-sm", children: error })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: loading || isRateLimited(), className: "w-full h-12 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100", children: loading ? "Signing in..." : isRateLimited() ? "Try again later" : "Sign in to Console" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-sm text-blue-300 hover:text-white transition-colors", children: "← Back to User Dashboard" }) })
      ] })
    ] })
  ] });
}
export {
  AdminLoginPage as component
};
