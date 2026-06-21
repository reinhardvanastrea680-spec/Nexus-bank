import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { g as useParams, d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useAdminAuth } from "./useAdminAuth-D1_k00My.mjs";
import { B as Button, C as Card, b as CardHeader, c as CardTitle, e as CardContent, d as db } from "./router-8iYk_PDV.mjs";
import { d as doc, o as onSnapshot, q as query, a as orderBy, w as where, c as collection } from "../_libs/firebase__firestore.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { t as toggleUserFreeze } from "./toggleUserFreeze-DIYZyRjz.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__storage.mjs";
import { A as ArrowLeft, M as MessageSquare, m as User, a as Mail, P as Phone, C as Clock, o as Shield, b as CircleCheck, c as CircleX, W as Wallet, v as EyeOff, E as Eye, D as CreditCard } from "../_libs/lucide-react.mjs";
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
import "./logAdminAction-DVr4geeY.mjs";
function useUserTransactionsById(userId) {
  const [transactions, setTransactions] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!userId) {
      setTransactions([]);
      setLoading(false);
      setError(null);
      return;
    }
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const txData = snapshot.docs.map((doc2) => ({
          id: doc2.id,
          ...doc2.data(),
          createdAt: doc2.data().createdAt?.toDate() ?? /* @__PURE__ */ new Date()
        }));
        setTransactions(txData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching user transactions:", err);
        setError("Failed to load transactions");
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [userId]);
  return { transactions, loading, error };
}
function AdminUserDetailPage() {
  const {
    userId
  } = useParams({
    from: "/admin/users/$userId"
  });
  const navigate = useNavigate();
  const {
    admin,
    loading: authLoading
  } = useAdminAuth();
  const [user, setUser] = reactExports.useState(null);
  const [userLoading, setUserLoading] = reactExports.useState(true);
  const [userError, setUserError] = reactExports.useState(null);
  const [showBalances, setShowBalances] = reactExports.useState(true);
  const {
    transactions,
    loading: txLoading,
    error: txError
  } = useUserTransactionsById(userId);
  reactExports.useEffect(() => {
    if (!userId) return;
    setUserLoading(true);
    setUserError(null);
    const userRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        setUser({
          id: snap.id,
          ...snap.data(),
          createdAt: snap.data().createdAt?.toDate() ?? /* @__PURE__ */ new Date()
        });
      } else {
        setUserError("User not found");
      }
      setUserLoading(false);
    }, (err) => {
      console.error(err);
      setUserError("Failed to load user data");
      setUserLoading(false);
    });
    return unsubscribe;
  }, [userId]);
  reactExports.useEffect(() => {
    if (!authLoading && !admin) {
      navigate({
        to: "/admin-login"
      });
    }
  }, [authLoading, admin, navigate]);
  const handleToggleFreeze = async () => {
    if (!user) return;
    try {
      await toggleUserFreeze(user.id, user.fullName, user.status);
      toast.success(`User ${user.status === "active" ? "frozen" : "unfrozen"} successfully!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user status");
    }
  };
  if (authLoading || userLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cyan-400 animate-pulse", children: "Loading user details..." }) });
  }
  if (userError) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full py-24 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-400", children: userError }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => navigate({
        to: "/admin/users"
      }), className: "bg-cyan-500 hover:bg-cyan-600 text-white", children: "Back to Users" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 pb-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", onClick: () => navigate({
      to: "/admin/users"
    }), className: "text-blue-300 hover:text-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 18, className: "mr-2" }),
      "Back"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white", children: "User Details" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-blue-300/70 mt-1", children: [
          "View and manage ",
          user.fullName
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white", onClick: () => navigate({
        to: "/admin/chat",
        search: {
          userId
        }
      }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 18, className: "mr-2" }),
        "Message User"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "lg:col-span-1 glass-card border-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-white flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 20, className: "text-cyan-400" }),
          "Profile Information"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white text-3xl font-bold", children: user.fullName.charAt(0).toUpperCase() }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-xl font-semibold", children: user.fullName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-300/70 text-sm", children: user.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${user.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`, children: user.status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "border-[rgba(255,255,255,0.05)]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 18, className: "text-cyan-400 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-blue-300/60", children: "Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-sm", children: user.email })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 18, className: "text-cyan-400 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-blue-300/60", children: "Phone" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-sm", children: user.phone || "Not provided" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 18, className: "text-cyan-400 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-blue-300/60", children: "Registration Date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white text-sm", children: [
                  user.createdAt.toLocaleDateString(),
                  " ",
                  user.createdAt.toLocaleTimeString()
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 18, className: "text-cyan-400 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-blue-300/60", children: "Verification" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-sm flex items-center gap-1", children: user.verified ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 14, className: "text-green-400" }),
                  "Verified"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 14, className: "text-yellow-400" }),
                  "Unverified"
                ] }) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "border-[rgba(255,255,255,0.05)]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "flex-1", onClick: handleToggleFreeze, variant: user.status === "active" ? "destructive" : "default", style: {
            background: user.status === "active" ? "rgba(239, 68, 68, 0.2)" : "linear-gradient(135deg, #38BDF8, #6366F1)",
            color: "white",
            border: user.status === "active" ? "1px solid rgba(239, 68, 68, 0.3)" : "none"
          }, children: user.status === "active" ? "Freeze User" : "Unfreeze User" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "lg:col-span-2 glass-card border-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-white flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { size: 20, className: "text-cyan-400" }),
            "Account Balances"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => setShowBalances(!showBalances), className: "text-blue-300 hover:text-white", children: showBalances ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 18 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 18 }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl bg-[#111827] border border-[rgba(255,255,255,0.05)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-blue-300/60 mb-2", children: "Checking Account" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-mono font-bold text-cyan-400", children: showBalances ? `$${(user.checkingBalance || 0).toLocaleString("en-US", {
              minimumFractionDigits: 2
            })}` : "••••••" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-blue-300/60 mt-1", children: [
              "#",
              user.checkingAccountNumber || "---"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl bg-[#111827] border border-[rgba(255,255,255,0.05)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-blue-300/60 mb-2", children: "Savings Account" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-mono font-bold text-violet-400", children: showBalances ? `$${(user.savingsBalance || 0).toLocaleString("en-US", {
              minimumFractionDigits: 2
            })}` : "••••••" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-blue-300/60 mt-1", children: [
              "#",
              user.savingsAccountNumber || "---"
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 20, className: "text-cyan-400" }),
        "Transaction History"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: txLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-[#8A9BB5]", children: "Loading transactions..." }) : txError ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-red-400", children: txError }) : transactions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-[#8A9BB5]", children: "No transactions yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-[#070B14]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase", children: "Transaction ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase", children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase", children: "Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase", children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: transactions.map((tx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-[rgba(255,255,255,0.05)] hover:bg-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-4 px-6 text-blue-300/70 font-mono text-sm", children: [
            "#",
            tx.transactionRef || tx.id.slice(0, 8).toUpperCase()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-4 px-6 text-blue-300/70 text-sm", children: [
            tx.createdAt.toLocaleDateString(),
            " ",
            tx.createdAt.toLocaleTimeString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-6 text-white text-sm", children: tx.description || "-" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${tx.type === "credit" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`, children: tx.type }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-4 px-6 text-cyan-400 font-mono text-sm font-semibold", children: [
            "$",
            (tx.amount || 0).toLocaleString("en-US", {
              minimumFractionDigits: 2
            })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${(tx.status || "completed") === "completed" ? "bg-green-500/20 text-green-400" : (tx.status || "pending") === "pending" ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`, children: tx.status || "completed" }) })
        ] }, tx.id)) })
      ] }) }) })
    ] })
  ] });
}
export {
  AdminUserDetailPage as component
};
