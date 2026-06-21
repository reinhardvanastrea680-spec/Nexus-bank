import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { C as Card, e as CardContent, I as Input, B as Button, g as Badge, d as db, f as cn } from "./router-8iYk_PDV.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DguZ9IUy.mjs";
import { D as Dialog, d as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, e as DialogClose } from "./dialog-vES-p4nC.mjs";
import { q as query, a as orderBy, c as collection, o as onSnapshot } from "../_libs/firebase__firestore.mjs";
import { e as exportToCSV } from "./exportToCSV-BTbsCjk3.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__storage.mjs";
import "../_libs/sonner.mjs";
import { u as Search, a9 as Download, ac as ArrowUpDown, E as Eye } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
const Table = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("table", { ref, className: cn("w-full caption-bottom text-sm", className), ...props }) })
);
Table.displayName = "Table";
const TableHeader = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { ref, className: cn("[&_tr]:border-b", className), ...props }));
TableHeader.displayName = "TableHeader";
const TableBody = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { ref, className: cn("[&_tr:last-child]:border-0", className), ...props }));
TableBody.displayName = "TableBody";
const TableFooter = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "tfoot",
  {
    ref,
    className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
    ...props
  }
));
TableFooter.displayName = "TableFooter";
const TableRow = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tr",
    {
      ref,
      className: cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      ),
      ...props
    }
  )
);
TableRow.displayName = "TableRow";
const TableHead = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "th",
  {
    ref,
    className: cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  }
));
TableHead.displayName = "TableHead";
const TableCell = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "td",
  {
    ref,
    className: cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  }
));
TableCell.displayName = "TableCell";
const TableCaption = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("caption", { ref, className: cn("mt-4 text-sm text-muted-foreground", className), ...props }));
TableCaption.displayName = "TableCaption";
function useActivityLog() {
  const [log, setLog] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const q = query(
      collection(db, "adminActivityLog"),
      orderBy("timestamp", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setLog(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);
  return { log, loading };
}
function AdminActivityPage() {
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [actionFilter, setActionFilter] = reactExports.useState("all");
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const [sortOrder, setSortOrder] = reactExports.useState("desc");
  const [selectedItem, setSelectedItem] = reactExports.useState(null);
  const itemsPerPage = 25;
  const {
    log: logData,
    loading
  } = useActivityLog();
  const handleFilter = () => {
    let data = [...logData];
    if (searchQuery) {
      const query2 = searchQuery.toLowerCase();
      data = data.filter((item) => item.description.toLowerCase().includes(query2) || item.targetUserName && item.targetUserName.toLowerCase().includes(query2));
    }
    if (actionFilter !== "all") {
      data = data.filter((item) => item.action === actionFilter);
    }
    data.sort((a, b) => {
      const aDate = new Date(a.timestamp).getTime();
      const bDate = new Date(b.timestamp).getTime();
      return sortOrder === "desc" ? bDate - aDate : aDate - bDate;
    });
    return data;
  };
  const filteredData = handleFilter();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const getActionPillColor = (action) => {
    if (action.includes("USER")) return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
    if (action.includes("BALANCE") || action.includes("TRANSACTION")) return "bg-green-500/20 text-green-400 border border-green-500/30";
    if (action.includes("CHAT")) return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
    if (action.includes("DELETE")) return "bg-red-500/20 text-red-400 border border-red-500/30";
    return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white", children: "Activity Log" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-[#8A9BB5]", children: "Complete, immutable audit trail of every admin action" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 rounded-xl border border-[#38BDF8]/30 bg-[#38BDF8]/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-[#8A9BB5]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-[#38BDF8]", children: "Notice" }),
      ": Activity logs are retained indefinitely. All actions are final and cannot be retroactively edited."
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "glass-card border-0 bg-[#111827]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-[200px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9BB5]", size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search description or user...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pl-10 bg-[#1A2438] border border-[rgba(255,255,255,0.1)] text-white" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: actionFilter, onValueChange: setActionFilter, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[200px] bg-[#1A2438] border border-[rgba(255,255,255,0.1)] text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Filter by action" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-[#111827] border border-[rgba(255,255,255,0.1)] text-white", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Actions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "BALANCE_OVERRIDE", children: "Balance Override" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "TRANSACTION_POSTED", children: "Transaction Posted" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "USER_CREATED", children: "User Created" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "USER_DELETED", children: "User Deleted" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "CHAT_REPLIED", children: "Chat Replied" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => exportToCSV(logData, "nexus-bank-activity-log.csv"), className: "bg-[#1A2438] text-white border border-[rgba(255,255,255,0.1)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 16, className: "mr-2" }),
          "Export Log"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-xl border border-[rgba(255,255,255,0.07)]", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-12 text-center text-[#8A9BB5]", children: "Loading activity log..." }) : filteredData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-12 text-center text-[#8A9BB5]", children: "No activity yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { className: "bg-[#070B14]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-b border-[rgba(255,255,255,0.07)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-[#8A9BB5] font-semibold", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", className: "text-[#8A9BB5] hover:text-white p-0", onClick: () => setSortOrder(sortOrder === "desc" ? "asc" : "desc"), children: [
            "Timestamp",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { size: 14, className: "ml-1" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-[#8A9BB5] font-semibold", children: "Action Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-[#8A9BB5] font-semibold", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-[#8A9BB5] font-semibold", children: "Target User" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-[#8A9BB5] font-semibold", children: "Details" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: currentItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-b border-[rgba(255,255,255,0.07)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-[#8A9BB5]", children: new Date(item.timestamp).toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: getActionPillColor(item.action), children: item.action }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-white", children: item.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-white", children: item.targetUserName || "-" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "text-[#38BDF8]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-[#111827] border border-[rgba(255,255,255,0.1)] text-white", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-white", children: "Activity Details" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-[rgba(255,255,255,0.07)] pb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#8A9BB5]", children: "Action" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: getActionPillColor(item.action), children: item.action })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-[rgba(255,255,255,0.07)] pb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#8A9BB5]", children: "Description" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: item.description })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-[rgba(255,255,255,0.07)] pb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#8A9BB5]", children: "Target User" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: item.targetUserName || "-" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-[rgba(255,255,255,0.07)] pb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#8A9BB5]", children: "Admin ID" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white", children: item.adminId })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#8A9BB5] block mb-1", children: "Meta Data" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-[#1A2438] rounded-lg p-3 font-mono text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "text-[#8A9BB5]", children: JSON.stringify(item.meta, null, 2) }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full bg-gradient-to-r from-[#38BDF8] to-[#6366F1] text-white", children: "Close" }) })
            ] })
          ] }) })
        ] }, item.id)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[#8A9BB5] text-sm", children: [
          "Showing ",
          indexOfFirstItem + 1,
          " to ",
          Math.min(indexOfLastItem, filteredData.length),
          " of",
          " ",
          filteredData.length,
          " items"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "text-[#8A9BB5] border border-[rgba(255,255,255,0.1)]", disabled: currentPage === 1, onClick: () => setCurrentPage((prev) => Math.max(1, prev - 1)), children: "Previous" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "text-[#8A9BB5] border border-[rgba(255,255,255,0.1)]", disabled: indexOfLastItem >= filteredData.length, onClick: () => setCurrentPage((prev) => prev + 1), children: "Next" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  AdminActivityPage as component
};
