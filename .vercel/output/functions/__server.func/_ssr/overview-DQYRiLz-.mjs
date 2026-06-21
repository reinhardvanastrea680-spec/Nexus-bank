import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { C as Card, b as CardHeader, c as CardTitle, e as CardContent, B as Button } from "./router-8iYk_PDV.mjs";
import { u as useUsers } from "./useUsers-B9DgIn9o.mjs";
import { u as useTransactions } from "./useTransactions-eHbNsNyA.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__storage.mjs";
import "../_libs/sonner.mjs";
import { U as Users, W as Wallet, M as MessageSquare, ab as Activity, C as Clock } from "../_libs/lucide-react.mjs";
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
function AdminOverviewPage() {
  const {
    users
  } = useUsers();
  const {
    transactions
  } = useTransactions();
  const [stats, setStats] = reactExports.useState({
    totalUsers: 0,
    totalAssets: 0,
    activeChats: 0,
    transactionsToday: 0
  });
  reactExports.useEffect(() => {
    let totalAssets = 0;
    users.forEach((user) => {
      totalAssets += (user.checkingBalance || 0) + (user.savingsBalance || 0);
    });
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const txToday = transactions.filter((tx) => {
      const txDate = tx.createdAt?.toDate ? tx.createdAt.toDate() : new Date(tx.createdAt);
      txDate.setHours(0, 0, 0, 0);
      return txDate.getTime() === today.getTime();
    }).length;
    setStats((prev) => ({
      ...prev,
      totalUsers: users.length,
      totalAssets,
      transactionsToday: txToday
    }));
  }, [users, transactions]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0 shadow-lg shadow-cyan-500/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm text-blue-300/70 font-medium", children: "Total Users" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "text-cyan-400 w-5 h-5" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-white font-mono", children: stats.totalUsers.toLocaleString() }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0 shadow-lg shadow-violet-500/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm text-blue-300/70 font-medium", children: "Total Simulated Assets" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "text-violet-400 w-5 h-5" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-3xl font-bold text-white font-mono", children: [
          "$",
          stats.totalAssets.toLocaleString()
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0 shadow-lg shadow-yellow-500/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm text-blue-300/70 font-medium", children: "Active Chat Sessions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "text-yellow-400 w-5 h-5" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-white font-mono", children: stats.activeChats }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0 shadow-lg shadow-green-500/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm text-blue-300/70 font-medium", children: "Transactions Today" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "text-green-400 w-5 h-5" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-white font-mono", children: stats.transactionsToday.toLocaleString() }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "lg:col-span-2 glass-card border-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-white font-semibold", children: "Balance Distribution" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "h-8 text-cyan-400 border border-cyan-500/30 bg-cyan-500/10", children: "All Users" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[300px] w-full flex items-center justify-center text-[#8A9BB5]", children: "No data yet" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-white font-semibold", children: "Top Balances" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: (() => {
          const sortedUsers = [...users].sort((a, b) => {
            const balanceA = (a.checkingBalance || 0) + (a.savingsBalance || 0);
            const balanceB = (b.checkingBalance || 0) + (b.savingsBalance || 0);
            return balanceB - balanceA;
          }).slice(0, 5);
          if (sortedUsers.length === 0) {
            return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#8A9BB5] text-sm text-center py-4", children: "No users yet" });
          }
          return sortedUsers.map((user, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: `/admin/accounts?user=${user.id}`, className: "flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm", children: index + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-medium text-sm truncate", children: user.fullName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-300/60 text-xs truncate", children: user.email })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white font-mono text-sm font-semibold", children: [
              "$",
              ((user.checkingBalance || 0) + (user.savingsBalance || 0)).toLocaleString()
            ] })
          ] }, user.id));
        })() }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-white font-semibold", children: "Recent Activity" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: transactions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#8A9BB5] text-sm text-center py-4", children: "No activity yet" }) : transactions.slice(0, 5).map((tx) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-2 rounded-lg hover:bg-white/5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-2 h-2 rounded-full mt-2 ${tx.type === "credit" ? "bg-green-400" : "bg-red-400"}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-sm", children: tx.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-300/60 text-xs", children: tx.userFullName || "Unknown User" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `font-mono text-sm font-semibold ${tx.type === "credit" ? "text-green-400" : "text-red-400"}`, children: [
                tx.type === "credit" ? "+" : "",
                "$",
                Math.abs(tx.amount || 0).toLocaleString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-blue-300/50 text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 12 }),
                tx.createdAt?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })
              ] })
            ] })
          ] }, tx.id);
        }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-white font-semibold", children: "Live Chat Preview" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/chat", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "h-8 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10", children: "Open Chat Centre →" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#8A9BB5] text-sm text-center py-4", children: "No active chats" }) }) })
      ] })
    ] })
  ] });
}
export {
  AdminOverviewPage as component
};
