import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { f as useSearch } from "../_libs/tanstack__react-router.mjs";
import { d as db, I as Input, B as Button, f as cn } from "./router-8iYk_PDV.mjs";
import { R as Root, V as Viewport, C as Corner, S as ScrollAreaScrollbar, a as ScrollAreaThumb } from "../_libs/radix-ui__react-scroll-area.mjs";
import { u as useUsers } from "./useUsers-B9DgIn9o.mjs";
import { q as query, c as collection, o as onSnapshot, a as orderBy, u as updateDoc, d as doc, b as addDoc, s as serverTimestamp, i as increment } from "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__storage.mjs";
import "../_libs/sonner.mjs";
import { M as MessageSquare, U as Users, m as User, l as CheckCheck, g as Check, S as Send } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
const ScrollArea = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Root,
  {
    ref,
    className: cn("relative overflow-hidden", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Viewport, { className: "h-full w-full rounded-[inherit]", children }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollBar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Corner, {})
    ]
  }
));
ScrollArea.displayName = Root.displayName;
const ScrollBar = reactExports.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  ScrollAreaScrollbar,
  {
    ref,
    orientation,
    className: cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
  }
));
ScrollBar.displayName = ScrollAreaScrollbar.displayName;
function AdminChatPage() {
  const {
    userId
  } = useSearch({
    from: "/admin/chat"
  });
  const {
    users
  } = useUsers();
  const [selectedUserId, setSelectedUserId] = reactExports.useState(userId ?? null);
  const [chatInput, setChatInput] = reactExports.useState("");
  const [chatMessages, setChatMessages] = reactExports.useState([]);
  const [chats, setChats] = reactExports.useState([]);
  const chatEndRef = reactExports.useRef(null);
  const selectedUser = selectedUserId ? users.find((u) => u.id === selectedUserId) : null;
  const handleInputChange = (e) => {
    setChatInput(e.target.value);
    if (!selectedUserId) return;
    updateDoc(doc(db, "chats", selectedUserId), {
      isTypingAdmin: e.target.value.length > 0
    }).catch(() => {
    });
  };
  reactExports.useEffect(() => {
    const q = query(collection(db, "chats"));
    const unsub = onSnapshot(q, (snap) => {
      const chatList = snap.docs.map((d) => ({
        id: d.id,
        userFullName: d.data().userFullName || "User",
        userEmail: d.data().userEmail || "",
        lastMessage: d.data().lastMessage || "",
        lastMessageAt: d.data().lastMessageAt?.toDate() || /* @__PURE__ */ new Date(),
        unreadByAdmin: d.data().unreadByAdmin || 0,
        status: d.data().status || "active"
      }));
      chatList.sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
      setChats(chatList);
    });
    return unsub;
  }, []);
  reactExports.useEffect(() => {
    if (!selectedUserId) {
      setChatMessages([]);
      return;
    }
    const q = query(collection(db, "chats", selectedUserId, "messages"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((d) => {
        const data = d.data();
        const createdAt = data.createdAt?.toDate() || /* @__PURE__ */ new Date();
        return {
          id: d.id,
          text: data.text,
          sender: data.sender,
          createdAt,
          readByUser: data.readByUser ?? false,
          readByAdmin: data.readByAdmin ?? true,
          time: createdAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })
        };
      });
      setChatMessages(msgs);
      msgs.filter((m) => m.sender === "user" && !m.readByAdmin).forEach((m) => updateDoc(doc(db, "chats", selectedUserId, "messages", m.id), {
        readByAdmin: true
      }));
      updateDoc(doc(db, "chats", selectedUserId), {
        unreadByAdmin: 0
      }).catch(() => {
      });
    });
    return unsub;
  }, [selectedUserId]);
  reactExports.useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [chatMessages]);
  const sendAdminMessage = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || !selectedUserId) return;
    const text = chatInput.trim();
    setChatInput("");
    await addDoc(collection(db, "chats", selectedUserId, "messages"), {
      text,
      sender: "admin",
      readByAdmin: true,
      readByUser: false,
      createdAt: serverTimestamp()
    });
    await updateDoc(doc(db, "chats", selectedUserId), {
      lastMessage: text,
      lastMessageAt: serverTimestamp(),
      unreadByUser: increment(1),
      isTypingAdmin: false
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "text-cyan-400" }),
        "Live Chat Center"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-300/70 mt-1", children: "Manage customer conversations in real-time" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6 flex-1 min-h-[600px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-80 bg-[#0A1020] border border-[rgba(255,255,255,0.05)] rounded-2xl flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-b border-[rgba(255,255,255,0.05)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-white font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 18, className: "text-cyan-400" }),
          "Customer Chats"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 p-3 space-y-2 overflow-y-auto", children: chats.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-blue-300/50 text-sm", children: "No active chats" }) : chats.map((chat) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-3 rounded-xl cursor-pointer transition-all ${selectedUserId === chat.id ? "bg-gradient-to-r from-cyan-500/10 to-violet-600/10 border border-cyan-500/30" : "hover:bg-white/5 border border-transparent"}`, onClick: () => setSelectedUserId(chat.id), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white font-semibold flex-shrink-0", children: chat.userFullName.charAt(0).toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-medium truncate text-sm", children: chat.userFullName }),
              chat.unreadByAdmin > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0", style: {
                background: "#38BDF8",
                color: "#0B1120"
              }, children: chat.unreadByAdmin })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-300/60 text-xs truncate", children: chat.lastMessage || chat.userEmail })
          ] })
        ] }) }, chat.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 bg-[#0A1020] border border-[rgba(255,255,255,0.05)] rounded-2xl flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-[rgba(255,255,255,0.05)] flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white text-xl", children: selectedUser ? selectedUser.fullName.charAt(0).toUpperCase() : /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 24 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-semibold", children: selectedUser ? selectedUser.fullName : "Select a chat" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-blue-300/60 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-green-500" }),
              selectedUser ? selectedUser.email : "No chat selected"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          !selectedUserId ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-blue-300/50 py-20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 48, className: "mx-auto mb-4 opacity-50" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Select a chat to start messaging" })
          ] }) : chatMessages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-blue-300/50 py-20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 48, className: "mx-auto mb-4 opacity-50" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "No messages yet" })
          ] }) : chatMessages.map((message) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex ${message.sender === "user" ? "justify-start" : "justify-end"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-[75%] p-3 rounded-2xl ${message.sender === "user" ? "rounded-tl-sm" : "rounded-tr-sm"}`, style: {
            background: message.sender === "admin" ? "linear-gradient(135deg, #38BDF8, #6366F1)" : "#1A2438"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed text-white", children: message.text }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-70 text-white", children: message.time }),
              message.sender === "admin" && (message.readByUser ? /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { size: 12, style: {
                color: "rgba(255,255,255,0.8)"
              } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 12, style: {
                color: "rgba(255,255,255,0.5)"
              } }))
            ] })
          ] }) }, message.id)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: chatEndRef })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-t border-[rgba(255,255,255,0.05)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: sendAdminMessage, className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", placeholder: selectedUserId ? "Type your reply..." : "Select a chat first", value: chatInput, onChange: handleInputChange, disabled: !selectedUserId, className: "flex-1 h-12 bg-[#111827] border-[rgba(255,255,255,0.1)] text-white placeholder:text-blue-300/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: !chatInput.trim() || !selectedUserId, className: "h-12 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 18 }) })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  AdminChatPage as component
};
