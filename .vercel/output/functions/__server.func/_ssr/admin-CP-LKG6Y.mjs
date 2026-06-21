import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, e as useLocation, L as Link, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import { u as useAdminAuth } from "./useAdminAuth-D1_k00My.mjs";
import { u as useAdminTransactions } from "./useAdminTransactions-C6Ld3R4g.mjs";
import { u as useAdminNotifications } from "./useAdminNotifications-B2ieRrUM.mjs";
import { d as db, B as Button, I as Input, f as cn } from "./router-8iYk_PDV.mjs";
import { o as onSnapshot, c as collection } from "../_libs/firebase__firestore.mjs";
import { R as Root2, T as Trigger, P as Portal2, C as Content2, L as Label2, S as Separator2, I as Item2, a as SubTrigger2, b as SubContent2, c as CheckboxItem2, d as ItemIndicator2, e as RadioItem2 } from "../_libs/radix-ui__react-dropdown-menu.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__storage.mjs";
import { I as LayoutDashboard, B as Bell, U as Users, W as Wallet, C as Clock, J as ArrowLeftRight, M as MessageSquare, h as UserPlus, K as ScrollText, d as Settings, m as User, t as LogOut, N as Menu, X, u as Search, O as ChevronRight, g as Check, Q as Circle } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
const DropdownMenu = Root2;
const DropdownMenuTrigger = Trigger;
const DropdownMenuSubTrigger = reactExports.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SubTrigger2,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-auto" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
const DropdownMenuSubContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SubContent2,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = SubContent2.displayName;
const DropdownMenuContent = reactExports.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = Content2.displayName;
const DropdownMenuItem = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Item2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = Item2.displayName;
const DropdownMenuCheckboxItem = reactExports.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  CheckboxItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
const DropdownMenuRadioItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  RadioItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
const DropdownMenuLabel = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Label2,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
    ...props
  }
));
DropdownMenuLabel.displayName = Label2.displayName;
const DropdownMenuSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Separator2,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = Separator2.displayName;
const navItems = [{
  label: "Overview",
  icon: LayoutDashboard,
  to: "/admin/overview"
}, {
  label: "Notifications",
  icon: Bell,
  to: "/admin/notifications"
}, {
  label: "User Management",
  icon: Users,
  to: "/admin/users"
}, {
  label: "Account Control",
  icon: Wallet,
  to: "/admin/accounts"
}, {
  label: "Pending Transfers",
  icon: Clock,
  to: "/admin/pending-transactions"
}, {
  label: "Transaction Manager",
  icon: ArrowLeftRight,
  to: "/admin/transactions"
}, {
  label: "Live Chat Center",
  icon: MessageSquare,
  to: "/admin/chat"
}, {
  label: "Prospective New Users",
  icon: UserPlus,
  to: "/admin/prospective-users"
}, {
  label: "Activity Log",
  icon: ScrollText,
  to: "/admin/activity"
}, {
  label: "System Settings",
  icon: Settings,
  to: "/admin/settings"
}];
function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = reactExports.useState(false);
  const {
    admin,
    loading,
    adminLogout
  } = useAdminAuth();
  const {
    pendingCount
  } = useAdminTransactions("pending");
  const {
    unreadCount: unreadNotifCount
  } = useAdminNotifications();
  const [unreadChatCount, setUnreadChatCount] = reactExports.useState(0);
  const [prospectiveCount, setProspectiveCount] = reactExports.useState(0);
  const [currentTime, setCurrentTime] = reactExports.useState(/* @__PURE__ */ new Date());
  const prevPendingCountRef = reactExports.useRef(pendingCount);
  reactExports.useEffect(() => {
    const unsub = onSnapshot(collection(db, "chats"), (snap) => {
      const total = snap.docs.reduce((sum, d) => sum + (d.data().unreadByAdmin || 0), 0);
      setUnreadChatCount(total);
    });
    return unsub;
  }, []);
  reactExports.useEffect(() => {
    const chatUnsub = onSnapshot(collection(db, "prospectiveChats"), (snap) => {
      const unread = snap.docs.reduce((sum, d) => sum + (d.data().unreadByAdmin || 0), 0);
      setProspectiveCount((prev) => {
        return unread;
      });
    });
    const contactUnsub = onSnapshot(collection(db, "prospectiveContacts"), (snap) => {
      const newCount = snap.docs.filter((d) => d.data().status === "new").length;
      setProspectiveCount((chatUnread) => chatUnread + newCount);
    });
    return () => {
      chatUnsub();
      contactUnsub();
    };
  }, []);
  reactExports.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(timer);
  }, []);
  reactExports.useEffect(() => {
    if (pendingCount > prevPendingCountRef.current && prevPendingCountRef.current !== 0) {
      toast.info("New transaction request pending approval", {
        action: {
          label: "Review",
          onClick: () => navigate({
            to: "/admin/pending-transactions"
          })
        }
      });
    }
    prevPendingCountRef.current = pendingCount;
  }, [pendingCount, navigate]);
  reactExports.useEffect(() => {
    if (!loading && !admin) {
      navigate({
        to: "/admin-login"
      });
    }
  }, [loading, admin, navigate]);
  const handleLogout = async () => {
    try {
      await adminLogout();
      navigate({
        to: "/admin-login"
      });
    } catch (e) {
      console.error(e);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-[#070B14]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-blue-300 animate-pulse", children: "Loading..." }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animated-bg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "orb orb-1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "orb orb-2" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: `fixed left-0 top-0 h-full bg-[#0A1020] border-r border-[rgba(255,255,255,0.05)] transition-all duration-300 z-40 ${sidebarCollapsed ? "w-[72px]" : "w-[260px]"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-b border-[rgba(255,255,255,0.05)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-bold text-lg", children: "N" }) }),
        !sidebarCollapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-bold text-lg", children: "Admin Console" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "p-3 space-y-1", children: navItems.map((item) => {
        const isActive = location.pathname === item.to;
        let badge = 0;
        if (item.to === "/admin/notifications") badge = unreadNotifCount;
        if (item.to === "/admin/pending-transactions") badge = pendingCount;
        if (item.to === "/admin/chat") badge = unreadChatCount;
        if (item.to === "/admin/prospective-users") badge = prospectiveCount;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: item.to, className: `flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${isActive ? "bg-[rgba(0,198,255,0.07)] text-white border-l-3 border-l-cyan-500" : "text-blue-300/70 hover:text-white hover:bg-white/5"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { size: 20, className: isActive ? "text-cyan-400" : "" }),
            badge > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center text-[10px] font-bold", style: {
              background: "#FF4D6A",
              color: "#FFFFFF"
            }, children: badge > 99 ? "99+" : badge })
          ] }),
          !sidebarCollapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium flex-1 flex items-center justify-between", children: [
            item.label,
            badge > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 px-2 py-0.5 rounded-full text-xs font-bold", style: {
              background: "#FF4D6A",
              color: "#FFFFFF"
            }, children: badge > 99 ? "99+" : badge })
          ] })
        ] }, item.to);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-3 border-t border-[rgba(255,255,255,0.05)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 18, className: "text-white" }) }),
          !sidebarCollapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-medium truncate", children: "Admin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-300/60 text-xs truncate", children: admin?.email || "admin@nexusbank.com" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleLogout, className: "w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 20 }),
          !sidebarCollapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Sign Out" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex-1 transition-all ${sidebarCollapsed ? "ml-[72px]" : "ml-[260px]"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "h-[64px] bg-[#0D1625]/90 backdrop-blur-md border-b border-[rgba(255,255,255,0.05)] sticky top-0 z-30 px-6 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => setSidebarCollapsed(!sidebarCollapsed), className: "text-blue-300 hover:text-white", children: sidebarCollapsed ? /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { size: 20 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-white font-semibold text-lg", children: "Nexus Control Centre" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-300/60 text-xs", children: navItems.find((item) => location.pathname === item.to)?.label || "Dashboard" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative hidden md:block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/50" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search users, transactions...", className: "w-80 pl-10 h-10 bg-[#070B14] border-[rgba(255,255,255,0.1)] text-white placeholder:text-blue-300/50 focus:ring-cyan-500" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right hidden sm:block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-mono text-sm", children: currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-300/60 text-xs", children: currentTime.toLocaleDateString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/notifications", className: "relative w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "text-white w-5 h-5" }),
            unreadNotifCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1 right-1 min-w-[18px] h-[18px] px-0.5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white", children: unreadNotifCount > 99 ? "99+" : unreadNotifCount })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "flex items-center gap-2 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 16, className: "text-white" }) }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { className: "bg-[#0D1625] border-[rgba(255,255,255,0.1)] text-white", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuLabel, { children: "Admin Account" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, { className: "bg-[rgba(255,255,255,0.1)]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { className: "hover:bg-white/10", children: "Profile" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { className: "hover:bg-white/10", children: "Settings" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, { className: "bg-[rgba(255,255,255,0.1)]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: handleLogout, className: "text-red-400 hover:text-red-300 hover:bg-red-500/10", children: "Logout" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "p-6 min-h-[calc(100vh-64px)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
    ] })
  ] });
}
export {
  AdminLayout as component
};
