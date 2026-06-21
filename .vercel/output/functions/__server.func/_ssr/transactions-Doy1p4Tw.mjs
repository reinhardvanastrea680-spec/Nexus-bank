import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { B as Button, I as Input, C as Card } from "./router-8iYk_PDV.mjs";
import { u as useTransactions } from "./useTransactions-eHbNsNyA.mjs";
import { e as exportToCSV } from "./exportToCSV-BTbsCjk3.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__storage.mjs";
import "../_libs/sonner.mjs";
import { a9 as Download } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
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
function AdminTransactionsPage() {
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const {
    transactions,
    loading
  } = useTransactions();
  const filteredTransactions = transactions.filter((tx) => tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) || tx.userFullName?.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalCredits = transactions.filter((tx) => tx.type === "credit").reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const totalDebits = transactions.filter((tx) => tx.type === "debit").reduce((sum, tx) => sum + (tx.amount || 0), 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white", children: "Transaction Manager" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-300/60 text-sm", children: "View and manage all transactions" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => exportToCSV(transactions, "nexus-bank-transactions.csv"), className: "bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 18 }),
        "Export CSV"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-3 items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search transactions...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-80 bg-[#070B14] border-[rgba(255,255,255,0.1)] text-white" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-[rgba(255,255,255,0.05)] flex flex-wrap gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-300/70 text-sm", children: "Total Credits:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-green-400 font-mono text-sm", children: [
            "$",
            totalCredits.toLocaleString()
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-300/70 text-sm", children: "Total Debits:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-red-400 font-mono text-sm", children: [
            "$",
            totalDebits.toLocaleString()
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-12 text-center text-[#8A9BB5]", children: "Loading transactions..." }) : filteredTransactions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-12 text-center text-[#8A9BB5]", children: "No transactions yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-[#070B14]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase", children: "User" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase", children: "Account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase", children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase", children: "Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-4 px-6 text-blue-300/60 text-xs font-medium uppercase", children: "Balance After" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filteredTransactions.map((tx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-[rgba(255,255,255,0.05)] hover:bg-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-6 text-blue-300/60 text-sm", children: tx.createdAt?.toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-6 text-white font-medium", children: tx.userFullName || "Unknown" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-6 text-blue-300/60 text-sm capitalize", children: tx.account || "Checking" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-6 text-white text-sm", children: tx.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${tx.type === "credit" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`, children: tx.type }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: `py-4 px-6 font-mono text-sm font-semibold ${tx.type === "credit" ? "text-green-400" : "text-red-400"}`, children: [
            tx.type === "credit" ? "+" : "",
            "$",
            Math.abs(tx.amount || 0).toLocaleString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-4 px-6 text-white font-mono text-sm", children: [
            "$",
            tx.balanceAfter?.toLocaleString() || "N/A"
          ] })
        ] }, tx.id)) })
      ] }) })
    ] })
  ] });
}
export {
  AdminTransactionsPage as component
};
