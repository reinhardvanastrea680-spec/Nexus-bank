import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useUserAuth } from "./useUserAuth-Dj040xaQ.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__storage.mjs";
import "../_libs/sonner.mjs";
import { a as Mail, L as Lock, v as EyeOff, E as Eye } from "../_libs/lucide-react.mjs";
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
import "./router-8iYk_PDV.mjs";
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
import "./adminConfig-D-CDJgKq.mjs";
function Login() {
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const navigate = useNavigate();
  const {
    user,
    loading: authLoading,
    userLogin
  } = useUserAuth();
  reactExports.useEffect(() => {
    if (!authLoading && user) navigate({
      to: "/"
    });
  }, [authLoading, user, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await userLogin(email, password);
      navigate({
        to: "/"
      });
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex items-center justify-center px-4 relative", style: {
    background: "linear-gradient(135deg, #F0F4F8 0%, #E4EDF9 100%)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl", style: {
        background: "#0EA5E9",
        opacity: 0.15
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-20 right-10 w-80 h-80 rounded-full blur-3xl", style: {
        background: "#6366F1",
        opacity: 0.12
      } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md z-10 rounded-2xl overflow-hidden shadow-2xl", style: {
      background: "#FFFFFF",
      border: "1px solid rgba(0,0,0,0.07)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-8 pt-5 pb-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "http://localhost:5174", className: "inline-flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity", style: {
        color: "#64748B"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "15 18 9 12 15 6" }) }),
        "Back to Nexus Bank"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-8 pt-6 pb-6 text-center", style: {
        background: "linear-gradient(135deg, #1D4ED8 0%, #0EA5E9 100%)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl flex items-center justify-center", style: {
            background: "rgba(255,255,255,0.2)"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-bold text-xl", children: "N" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-bold text-lg leading-tight", children: "Nexus Bank" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: {
              color: "rgba(255,255,255,0.7)"
            }, children: "Banking Beyond Boundaries" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white", children: "Welcome Back" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", style: {
          color: "rgba(255,255,255,0.75)"
        }, children: "Sign in to your account" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-8 py-8", children: [
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-5 p-3 rounded-xl text-sm flex items-center gap-2", style: {
          background: "#FEF2F2",
          border: "1px solid #FECACA",
          color: "#DC2626"
        }, children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold mb-2", style: {
              color: "#374151"
            }, children: "Email Address" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4", style: {
                color: "#9CA3AF"
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "you@nexusbank.com", required: true, className: "w-full pl-11 pr-4 py-3.5 rounded-xl outline-none text-sm", style: {
                background: "#F9FAFB",
                border: "1px solid #E5E7EB",
                color: "#0D1B2A"
              }, onFocus: (e) => {
                e.target.style.borderColor = "#0EA5E9";
                e.target.style.boxShadow = "0 0 0 3px rgba(14,165,233,0.12)";
              }, onBlur: (e) => {
                e.target.style.borderColor = "#E5E7EB";
                e.target.style.boxShadow = "none";
              } })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold mb-2", style: {
              color: "#374151"
            }, children: "Password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4", style: {
                color: "#9CA3AF"
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: showPassword ? "text" : "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "••••••••", required: true, className: "w-full pl-11 pr-12 py-3.5 rounded-xl outline-none text-sm", style: {
                background: "#F9FAFB",
                border: "1px solid #E5E7EB",
                color: "#0D1B2A"
              }, onFocus: (e) => {
                e.target.style.borderColor = "#0EA5E9";
                e.target.style.boxShadow = "0 0 0 3px rgba(14,165,233,0.12)";
              }, onBlur: (e) => {
                e.target.style.borderColor = "#E5E7EB";
                e.target.style.boxShadow = "none";
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-4 top-1/2 -translate-y-1/2", style: {
                color: "#9CA3AF"
              }, children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: loading, className: "w-full py-4 rounded-xl font-semibold text-white transition-all", style: {
            background: "linear-gradient(135deg, #1D4ED8, #0EA5E9)",
            opacity: loading ? 0.7 : 1,
            boxShadow: "0 4px 14px rgba(14,165,233,0.35)"
          }, children: loading ? "Signing in…" : "Sign In" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-sm mt-6", style: {
          color: "#9CA3AF"
        }, children: "Don't have an account? Contact your administrator." })
      ] })
    ] })
  ] });
}
export {
  Login as component
};
