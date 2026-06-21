import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { o as onSnapshot, c as collection, q as query, a as orderBy, g as getFirestore, u as updateDoc, d as doc, b as addDoc, i as increment, s as serverTimestamp } from "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import { g as getAuth, s as setPersistence, b as browserLocalPersistence } from "../_libs/firebase__auth.mjs";
import { i as initializeApp } from "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import { g as getStorage } from "../_libs/firebase__storage.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { U as Users, M as MessageSquare, F as FileText, a as Mail, P as Phone, S as Send, C as Clock, b as CircleCheck } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-compose-refs.mjs";
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
const appCss = "/assets/styles-BzMjpkgb.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$s = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  reactExports.useEffect(() => {
    const stored = localStorage.getItem("nexus-bank-theme");
    if (stored === "light" || stored === "dark") {
      document.documentElement.classList.add(stored);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$s.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) });
}
const $$splitComponentImporter$q = () => import("./wire-transfer-0vgJTgt3.mjs");
const Route$r = createFileRoute("/wire-transfer")({
  head: () => ({
    meta: [{
      title: "Wire Transfer - Nexus Bank"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$q, "component")
});
const $$splitComponentImporter$p = () => import("./transactions-1AJDidoE.mjs");
const Route$q = createFileRoute("/transactions")({
  head: () => ({
    meta: [{
      title: "Transaction History - Nexus Bank"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$p, "component")
});
const $$splitComponentImporter$o = () => import("./support-2OG4sogJ.mjs");
const Route$p = createFileRoute("/support")({
  head: () => ({
    meta: [{
      title: "Support - Nexus Bank"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const $$splitComponentImporter$n = () => import("./settings-D_CBWtkW.mjs");
const Route$o = createFileRoute("/settings")({
  head: () => ({
    meta: [{
      title: "Settings - Nexus Bank"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitComponentImporter$m = () => import("./pay-bills-BaK9PqpD.mjs");
const Route$n = createFileRoute("/pay-bills")({
  head: () => ({
    meta: [{
      title: "Pay Bills - Nexus Bank"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const $$splitComponentImporter$l = () => import("./notifications-zTmHOvN3.mjs");
const Route$m = createFileRoute("/notifications")({
  head: () => ({
    meta: [{
      title: "Notifications - Nexus Bank"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("./login-DLBrFeSv.mjs");
const Route$l = createFileRoute("/login")({
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./local-transfer-8wREl70L.mjs");
const Route$k = createFileRoute("/local-transfer")({
  head: () => ({
    meta: [{
      title: "Local Transfer - Nexus Bank"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./internal-transfer-DDvi7uQn.mjs");
const Route$j = createFileRoute("/internal-transfer")({
  head: () => ({
    meta: [{
      title: "Internal Transfer - Nexus Bank"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./crypto-deposit-DzLvGnak.mjs");
const Route$i = createFileRoute("/crypto-deposit")({
  head: () => ({
    meta: [{
      title: "Crypto Deposit - Nexus Bank"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./check-deposit-NinYKHOk.mjs");
const Route$h = createFileRoute("/check-deposit")({
  head: () => ({
    meta: [{
      title: "Check Deposit - Nexus Bank"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./card-deposit-yzzs4M99.mjs");
const Route$g = createFileRoute("/card-deposit")({
  head: () => ({
    meta: [{
      title: "Card Deposit - Nexus Bank"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./buy-crypto-CYonA3r8.mjs");
const Route$f = createFileRoute("/buy-crypto")({
  head: () => ({
    meta: [{
      title: "Buy Crypto - Nexus Bank"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./admin-login-D8f4qo0_.mjs");
const Route$e = createFileRoute("/admin-login")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component"),
  head: () => ({
    meta: [{
      title: "Admin Login - Nexus Bank"
    }, {
      name: "robots",
      content: "noindex, nofollow"
    }]
  })
});
const $$splitErrorComponentImporter = () => import("./admin-DChc2hml.mjs");
const $$splitComponentImporter$c = () => import("./admin-CP-LKG6Y.mjs");
const Route$d = createFileRoute("/admin")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component"),
  loader: () => {
    return null;
  },
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
const $$splitComponentImporter$b = () => import("./add-beneficiary-DInhp7Y-.mjs");
const Route$c = createFileRoute("/add-beneficiary")({
  head: () => ({
    meta: [{
      title: "Beneficiaries - Nexus Bank"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./index-BfdTV30d.mjs");
const Route$b = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Nexus Bank - Mobile Banking"
    }, {
      description: "Manage your accounts, transfers, deposits, and bills with Nexus Bank."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./users-VT_CFuwo.mjs");
const Route$a = createFileRoute("/admin/users")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./transactions-Doy1p4Tw.mjs");
const Route$9 = createFileRoute("/admin/transactions")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component"),
  getParentRoute: () => Route$d
});
const $$splitComponentImporter$7 = () => import("./settings-DvKKxRAq.mjs");
const Route$8 = createFileRoute("/admin/settings")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component"),
  getParentRoute: () => Route$d
});
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Card = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
      ...props
    }
  )
);
Card.displayName = "Card";
const CardHeader = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props })
);
CardHeader.displayName = "CardHeader";
const CardTitle = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className: cn("font-semibold leading-none tracking-tight", className),
      ...props
    }
  )
);
CardTitle.displayName = "CardTitle";
const CardDescription = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("text-sm text-muted-foreground", className), ...props })
);
CardDescription.displayName = "CardDescription";
const CardContent = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("p-6 pt-0", className), ...props })
);
CardContent.displayName = "CardContent";
const CardFooter = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("flex items-center p-6 pt-0", className), ...props })
);
CardFooter.displayName = "CardFooter";
const Input = reactExports.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const firebaseConfig = {
  apiKey: "AIzaSyBlXeem_vLL6xbOYxkAg2qV_JRMZG97U68",
  authDomain: "nexus-bank-b6820.firebaseapp.com",
  projectId: "nexus-bank-b6820",
  storageBucket: "nexus-bank-b6820.firebasestorage.app",
  messagingSenderId: "383216015173",
  appId: "1:383216015173:web:f833940e4cc9b92aa2902c"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
getStorage(app);
setPersistence(auth, browserLocalPersistence);
const Route$7 = createFileRoute("/admin/prospective-users")({
  component: ProspectiveUsersPage
});
function formatDate(d) {
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
function ProspectiveUsersPage() {
  const [tab, setTab] = reactExports.useState("chats");
  const [chats, setChats] = reactExports.useState([]);
  const [contacts, setContacts] = reactExports.useState([]);
  const [selectedChat, setSelectedChat] = reactExports.useState(null);
  const [selectedContact, setSelectedContact] = reactExports.useState(null);
  const [messages, setMessages] = reactExports.useState([]);
  const [replyInput, setReplyInput] = reactExports.useState("");
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const chatEndRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const unsub = onSnapshot(collection(db, "prospectiveChats"), (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        prospectName: d.data().prospectName || "Unknown",
        prospectEmail: d.data().prospectEmail || "",
        prospectPhone: d.data().prospectPhone || "",
        lastMessage: d.data().lastMessage || "",
        lastMessageAt: d.data().lastMessageAt?.toDate() || /* @__PURE__ */ new Date(),
        unreadByAdmin: d.data().unreadByAdmin || 0,
        status: d.data().status || "active",
        createdAt: d.data().createdAt?.toDate() || /* @__PURE__ */ new Date()
      }));
      list.sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
      setChats(list);
    });
    return unsub;
  }, []);
  reactExports.useEffect(() => {
    const unsub = onSnapshot(collection(db, "prospectiveContacts"), (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        name: d.data().name || d.data().fullName || "Unknown",
        email: d.data().email || "",
        phone: d.data().phone || "",
        subject: d.data().subject || "",
        message: d.data().message || "",
        status: d.data().status || "new",
        createdAt: d.data().createdAt?.toDate() || /* @__PURE__ */ new Date()
      }));
      list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setContacts(list);
    });
    return unsub;
  }, []);
  reactExports.useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      return;
    }
    const q = query(collection(db, "prospectiveChats", selectedChat.id, "messages"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((d) => ({
        id: d.id,
        text: d.data().text,
        sender: d.data().sender,
        createdAt: d.data().createdAt?.toDate() || /* @__PURE__ */ new Date()
      }));
      setMessages(msgs);
      updateDoc(doc(db, "prospectiveChats", selectedChat.id), { unreadByAdmin: 0 }).catch(() => {
      });
    });
    return unsub;
  }, [selectedChat]);
  reactExports.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const sendReply = async () => {
    if (!replyInput.trim() || !selectedChat) return;
    const text = replyInput.trim();
    setReplyInput("");
    await updateDoc(doc(db, "prospectiveChats", selectedChat.id), { isTypingAdmin: true });
    await addDoc(collection(db, "prospectiveChats", selectedChat.id, "messages"), {
      text,
      sender: "admin",
      createdAt: serverTimestamp()
    });
    await updateDoc(doc(db, "prospectiveChats", selectedChat.id), {
      lastMessage: text,
      lastMessageAt: serverTimestamp(),
      isTypingAdmin: false,
      unreadByUser: increment(1)
    });
  };
  const markContactHandled = async (contactId) => {
    await updateDoc(doc(db, "prospectiveContacts", contactId), { status: "handled" });
    toast.success("Marked as handled");
    setSelectedContact(null);
  };
  const totalUnread = chats.reduce((s, c) => s + c.unreadByAdmin, 0);
  const newContacts = contacts.filter((c) => c.status === "new").length;
  const filteredChats = chats.filter((c) => c.prospectName.toLowerCase().includes(searchTerm.toLowerCase()) || c.prospectEmail.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredContacts = contacts.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase()));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-white flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "text-cyan-400", size: 24 }),
          "Prospective New Users"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-300/60 text-sm", children: "Manage enquiries and live chats from the landing page" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        totalUnread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-red-500/20 text-red-400 border-red-500/30", children: [
          totalUnread,
          " unread messages"
        ] }),
        newContacts > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", children: [
          newContacts,
          " new enquiries"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setTab("chats"),
          className: "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all",
          style: { background: tab === "chats" ? "rgba(56,189,248,0.15)" : "rgba(255,255,255,0.04)", color: tab === "chats" ? "#38BDF8" : "#8A9BB5", border: tab === "chats" ? "1px solid rgba(56,189,248,0.3)" : "1px solid transparent" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 15 }),
            " Live Chats",
            totalUnread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold", style: { background: "#EF4444", color: "#fff" }, children: totalUnread })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setTab("contacts"),
          className: "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all",
          style: { background: tab === "contacts" ? "rgba(56,189,248,0.15)" : "rgba(255,255,255,0.04)", color: tab === "contacts" ? "#38BDF8" : "#8A9BB5", border: tab === "contacts" ? "1px solid rgba(56,189,248,0.3)" : "1px solid transparent" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 15 }),
            " Contact Enquiries",
            newContacts > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold", style: { background: "#FFAB00", color: "#0B1120" }, children: newContacts })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        placeholder: "Search by name or email...",
        value: searchTerm,
        onChange: (e) => setSearchTerm(e.target.value),
        className: "w-80 bg-[#070B14] border-[rgba(255,255,255,0.1)] text-white"
      }
    ),
    tab === "chats" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 h-[580px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-72 flex-shrink-0 flex flex-col gap-2 overflow-y-auto", children: filteredChats.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 text-[#8A9BB5]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 32, className: "mx-auto mb-3 opacity-30" }),
        "No live chats yet"
      ] }) : filteredChats.map((chat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setSelectedChat(chat),
          className: "text-left p-4 rounded-xl transition-all",
          style: { background: selectedChat?.id === chat.id ? "rgba(56,189,248,0.1)" : "rgba(255,255,255,0.03)", border: selectedChat?.id === chat.id ? "1px solid rgba(56,189,248,0.3)" : "1px solid rgba(255,255,255,0.05)" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0", children: chat.prospectName.charAt(0).toUpperCase() }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-semibold text-sm truncate max-w-[120px]", children: chat.prospectName })
              ] }),
              chat.unreadByAdmin > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0", style: { background: "#EF4444", color: "#fff" }, children: chat.unreadByAdmin })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-300/60 text-xs truncate", children: chat.lastMessage || chat.prospectEmail }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-300/40 text-xs mt-1", children: formatDate(chat.lastMessageAt) })
          ]
        },
        chat.id
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "glass-card border-0 flex-1 flex flex-col overflow-hidden", children: !selectedChat ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center text-center text-[#8A9BB5]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 48, className: "mx-auto mb-4 opacity-30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Select a chat to start replying" })
      ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-[rgba(255,255,255,0.05)] flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold", children: selectedChat.prospectName.charAt(0).toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-semibold", children: selectedChat.prospectName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-blue-300/60 text-xs flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 11 }),
                selectedChat.prospectEmail
              ] }),
              selectedChat.prospectPhone && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 11 }),
                selectedChat.prospectPhone
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-auto bg-green-500/20 text-green-400 border-green-500/30", children: "Prospective User" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 p-4 overflow-y-auto space-y-3", style: { background: "#07101E" }, children: [
          messages.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "max-w-[70%] p-3 rounded-2xl",
              style: {
                background: msg.sender === "admin" ? "linear-gradient(135deg, #38BDF8, #6366F1)" : "rgba(255,255,255,0.07)",
                borderRadius: msg.sender === "admin" ? "16px 16px 4px 16px" : "16px 16px 16px 4px"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-sm", children: msg.text }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1 opacity-60 text-white text-right", children: msg.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })
              ]
            }
          ) }, msg.id)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: chatEndRef })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-t border-[rgba(255,255,255,0.05)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
          e.preventDefault();
          void sendReply();
        }, className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: replyInput,
              onChange: (e) => setReplyInput(e.target.value),
              placeholder: "Type your reply...",
              className: "flex-1 h-12 bg-[#111827] border-[rgba(255,255,255,0.1)] text-white placeholder:text-blue-300/50"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              disabled: !replyInput.trim(),
              className: "h-12 bg-gradient-to-r from-cyan-500 to-violet-600 text-white px-6",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 16 })
            }
          )
        ] }) })
      ] }) })
    ] }),
    tab === "contacts" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 h-[580px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-80 flex-shrink-0 flex flex-col gap-2 overflow-y-auto", children: filteredContacts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 text-[#8A9BB5]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 32, className: "mx-auto mb-3 opacity-30" }),
        "No contact enquiries yet"
      ] }) : filteredContacts.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setSelectedContact(c),
          className: "text-left p-4 rounded-xl transition-all",
          style: { background: selectedContact?.id === c.id ? "rgba(56,189,248,0.1)" : "rgba(255,255,255,0.03)", border: selectedContact?.id === c.id ? "1px solid rgba(56,189,248,0.3)" : "1px solid rgba(255,255,255,0.05)" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-semibold text-sm", children: c.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: c.status === "new" ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" : "bg-green-500/20 text-green-300 border-green-500/30", children: c.status === "new" ? "New" : "Handled" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-300/60 text-xs", children: c.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-cyan-400/80 text-xs mt-1 truncate", children: c.subject }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-blue-300/40 text-xs mt-1 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 10 }),
              formatDate(c.createdAt)
            ] })
          ]
        },
        c.id
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "glass-card border-0 flex-1 overflow-auto", children: !selectedContact ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center text-center text-[#8A9BB5] h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 48, className: "mx-auto mb-4 opacity-30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Select an enquiry to view details" })
      ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-white font-bold text-lg", children: selectedContact.subject }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: selectedContact.status === "new" ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" : "bg-green-500/20 text-green-300 border-green-500/30", children: selectedContact.status === "new" ? "New" : "Handled" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4 p-4 rounded-xl", style: { background: "rgba(255,255,255,0.03)" }, children: [
          { label: "Name", value: selectedContact.name, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 14 }) },
          { label: "Email", value: selectedContact.email, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 14 }) },
          { label: "Phone", value: selectedContact.phone || "—", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 14 }) },
          { label: "Received", value: formatDate(selectedContact.createdAt), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 14 }) }
        ].map(({ label, value, icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-blue-300/50 text-xs flex items-center gap-1 mb-1", children: [
            icon,
            label
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-sm font-medium", children: value })
        ] }, label)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl", style: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-300/50 text-xs mb-2", children: "Message" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-sm leading-relaxed", children: selectedContact.message })
        ] }),
        selectedContact.status === "new" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => void markContactHandled(selectedContact.id),
            className: "bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 16, className: "mr-2" }),
              "Mark as Handled"
            ]
          }
        )
      ] }) })
    ] })
  ] });
}
const $$splitComponentImporter$6 = () => import("./pending-transactions-YBhBpWCL.mjs");
const Route$6 = createFileRoute("/admin/pending-transactions")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./overview-DQYRiLz-.mjs");
const Route$5 = createFileRoute("/admin/overview")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component"),
  getParentRoute: () => Route$d
});
const $$splitComponentImporter$4 = () => import("./notifications-B_CXRanN.mjs");
const Route$4 = createFileRoute("/admin/notifications")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./chat-BUHMWhGU.mjs");
const Route$3 = createFileRoute("/admin/chat")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component"),
  validateSearch: (search) => ({
    userId: search.userId || void 0
  })
});
const $$splitComponentImporter$2 = () => import("./activity-CqE-r1u_.mjs");
const Route$2 = createFileRoute("/admin/activity")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component"),
  getParentRoute: () => Route$d
});
const $$splitComponentImporter$1 = () => import("./accounts-CEpj3Dzq.mjs");
const Route$1 = createFileRoute("/admin/accounts")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./users._userId-LT2NcH4q.mjs");
const Route = createFileRoute("/admin/users/$userId")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const WireTransferRoute = Route$r.update({
  id: "/wire-transfer",
  path: "/wire-transfer",
  getParentRoute: () => Route$s
});
const TransactionsRoute = Route$q.update({
  id: "/transactions",
  path: "/transactions",
  getParentRoute: () => Route$s
});
const SupportRoute = Route$p.update({
  id: "/support",
  path: "/support",
  getParentRoute: () => Route$s
});
const SettingsRoute = Route$o.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => Route$s
});
const PayBillsRoute = Route$n.update({
  id: "/pay-bills",
  path: "/pay-bills",
  getParentRoute: () => Route$s
});
const NotificationsRoute = Route$m.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => Route$s
});
const LoginRoute = Route$l.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$s
});
const LocalTransferRoute = Route$k.update({
  id: "/local-transfer",
  path: "/local-transfer",
  getParentRoute: () => Route$s
});
const InternalTransferRoute = Route$j.update({
  id: "/internal-transfer",
  path: "/internal-transfer",
  getParentRoute: () => Route$s
});
const CryptoDepositRoute = Route$i.update({
  id: "/crypto-deposit",
  path: "/crypto-deposit",
  getParentRoute: () => Route$s
});
const CheckDepositRoute = Route$h.update({
  id: "/check-deposit",
  path: "/check-deposit",
  getParentRoute: () => Route$s
});
const CardDepositRoute = Route$g.update({
  id: "/card-deposit",
  path: "/card-deposit",
  getParentRoute: () => Route$s
});
const BuyCryptoRoute = Route$f.update({
  id: "/buy-crypto",
  path: "/buy-crypto",
  getParentRoute: () => Route$s
});
const AdminLoginRoute = Route$e.update({
  id: "/admin-login",
  path: "/admin-login",
  getParentRoute: () => Route$s
});
const AdminRoute = Route$d.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$s
});
const AddBeneficiaryRoute = Route$c.update({
  id: "/add-beneficiary",
  path: "/add-beneficiary",
  getParentRoute: () => Route$s
});
const IndexRoute = Route$b.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$s
});
const AdminUsersRoute = Route$a.update({
  id: "/users",
  path: "/users",
  getParentRoute: () => AdminRoute
});
const AdminTransactionsRoute = Route$9.update({
  id: "/transactions",
  path: "/transactions",
  getParentRoute: () => AdminRoute
});
const AdminSettingsRoute = Route$8.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AdminRoute
});
const AdminProspectiveUsersRoute = Route$7.update({
  id: "/prospective-users",
  path: "/prospective-users",
  getParentRoute: () => AdminRoute
});
const AdminPendingTransactionsRoute = Route$6.update({
  id: "/pending-transactions",
  path: "/pending-transactions",
  getParentRoute: () => AdminRoute
});
const AdminOverviewRoute = Route$5.update({
  id: "/overview",
  path: "/overview",
  getParentRoute: () => AdminRoute
});
const AdminNotificationsRoute = Route$4.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => AdminRoute
});
const AdminChatRoute = Route$3.update({
  id: "/chat",
  path: "/chat",
  getParentRoute: () => AdminRoute
});
const AdminActivityRoute = Route$2.update({
  id: "/activity",
  path: "/activity",
  getParentRoute: () => AdminRoute
});
const AdminAccountsRoute = Route$1.update({
  id: "/accounts",
  path: "/accounts",
  getParentRoute: () => AdminRoute
});
const AdminUsersUserIdRoute = Route.update({
  id: "/$userId",
  path: "/$userId",
  getParentRoute: () => AdminUsersRoute
});
const AdminUsersRouteChildren = {
  AdminUsersUserIdRoute
};
const AdminUsersRouteWithChildren = AdminUsersRoute._addFileChildren(
  AdminUsersRouteChildren
);
const AdminRouteChildren = {
  AdminAccountsRoute,
  AdminActivityRoute,
  AdminChatRoute,
  AdminNotificationsRoute,
  AdminOverviewRoute,
  AdminPendingTransactionsRoute,
  AdminProspectiveUsersRoute,
  AdminSettingsRoute,
  AdminTransactionsRoute,
  AdminUsersRoute: AdminUsersRouteWithChildren
};
const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AddBeneficiaryRoute,
  AdminRoute: AdminRouteWithChildren,
  AdminLoginRoute,
  BuyCryptoRoute,
  CardDepositRoute,
  CheckDepositRoute,
  CryptoDepositRoute,
  InternalTransferRoute,
  LocalTransferRoute,
  LoginRoute,
  NotificationsRoute,
  PayBillsRoute,
  SettingsRoute,
  SupportRoute,
  TransactionsRoute,
  WireTransferRoute
};
const routeTree = Route$s._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Button as B,
  Card as C,
  Input as I,
  auth as a,
  CardHeader as b,
  CardTitle as c,
  db as d,
  CardContent as e,
  cn as f,
  Badge as g,
  router as r
};
