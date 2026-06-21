import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useUserAuth } from "./useUserAuth-Dj040xaQ.mjs";
import { u as useUserAccount } from "./useUserAccount-DGi8dU3l.mjs";
import { d as db } from "./router-8iYk_PDV.mjs";
import { e as getDoc, d as doc, h as setDoc, s as serverTimestamp, q as query, a as orderBy, c as collection, o as onSnapshot, u as updateDoc, b as addDoc, i as increment } from "../_libs/firebase__firestore.mjs";
import { u as useTheme } from "./use-theme-BfOV-CAK.mjs";
import { B as BottomNav, t as themeColors } from "./BottomNav-CtUMOiqo.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__storage.mjs";
import "../_libs/sonner.mjs";
import { A as ArrowLeft, M as MessageSquare, l as CheckCheck, g as Check, S as Send } from "../_libs/lucide-react.mjs";
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
function SupportPage() {
  const navigate = useNavigate();
  const {
    user
  } = useUserAuth();
  const {
    account
  } = useUserAccount();
  const {
    theme
  } = useTheme();
  const t = themeColors(theme);
  const [chatInput, setChatInput] = reactExports.useState("");
  const [chatMessages, setChatMessages] = reactExports.useState([]);
  const [isTyping, setIsTyping] = reactExports.useState(false);
  const chatEndRef = reactExports.useRef(null);
  const chatId = user?.uid;
  reactExports.useEffect(() => {
    if (!chatId) return;
    getDoc(doc(db, "chats", chatId)).then((snap) => {
      if (!snap.exists()) {
        setDoc(doc(db, "chats", chatId), {
          userId: chatId,
          userFullName: account?.fullName || "User",
          userEmail: user?.email || "",
          lastMessage: "",
          lastMessageAt: serverTimestamp(),
          unreadByUser: 0,
          unreadByAdmin: 0,
          isTypingAdmin: false,
          status: "active",
          createdAt: serverTimestamp()
        });
      }
    });
  }, [chatId, account, user]);
  reactExports.useEffect(() => {
    if (!chatId) return;
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((d) => {
        const data = d.data();
        const createdAt = data.createdAt?.toDate() || /* @__PURE__ */ new Date();
        return {
          id: d.id,
          text: data.text,
          sender: data.sender,
          createdAt,
          readByUser: data.readByUser ?? true,
          readByAdmin: data.readByAdmin ?? false,
          time: createdAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })
        };
      });
      setChatMessages(msgs);
      msgs.filter((m) => m.sender === "admin" && !m.readByUser).forEach((m) => updateDoc(doc(db, "chats", chatId, "messages", m.id), {
        readByUser: true
      }));
    });
    const chatDocUnsub = onSnapshot(doc(db, "chats", chatId), (snap) => {
      if (snap.exists()) setIsTyping(snap.data().isTypingAdmin === true);
    });
    return () => {
      unsub();
      chatDocUnsub();
    };
  }, [chatId]);
  reactExports.useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [chatMessages, isTyping]);
  const sendChatMessage = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || !chatId) return;
    const text = chatInput.trim();
    setChatInput("");
    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        text,
        sender: "user",
        readByUser: true,
        readByAdmin: false,
        createdAt: serverTimestamp()
      });
      await updateDoc(doc(db, "chats", chatId), {
        lastMessage: text,
        lastMessageAt: serverTimestamp(),
        unreadByAdmin: increment(1),
        userFullName: account?.fullName || "User",
        userEmail: user?.email || "",
        status: "active"
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen w-full flex flex-col", style: {
    background: t.pageBg
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-10 pb-4 flex items-center gap-4", style: {
      background: t.cardBg,
      borderBottom: `1px solid ${t.border}`
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate({
        to: "/"
      }), className: "p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 24, style: {
        color: t.textPrimary
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full flex items-center justify-center", style: {
          background: t.gradientBtn
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 18, style: {
          color: "#FFFFFF"
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold", style: {
            color: t.textPrimary
          }, children: "Support Team" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full", style: {
              background: t.accentGreen
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", style: {
              color: t.textMuted
            }, children: isTyping ? "Typing..." : "Online now" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 px-5 py-4 overflow-y-auto space-y-4", children: [
      chatMessages.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 48, className: "mx-auto mb-4 opacity-30", style: {
          color: t.textMuted
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", style: {
          color: t.textMuted
        }, children: "No messages yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", style: {
          color: t.textMuted,
          opacity: 0.6
        }, children: "Start a conversation with our support team" })
      ] }),
      chatMessages.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-[75%] p-3 rounded-2xl ${msg.sender === "user" ? "rounded-tr-sm" : "rounded-tl-sm"}`, style: {
        background: msg.sender === "user" ? t.gradientBtn : t.cardBg2,
        border: msg.sender !== "user" ? `1px solid ${t.border}` : "none"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed", style: {
          color: msg.sender === "user" ? "#FFFFFF" : t.textPrimary
        }, children: msg.text }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1 mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-60", style: {
            color: msg.sender === "user" ? "#FFFFFF" : t.textMuted
          }, children: msg.time }),
          msg.sender === "user" && (msg.readByAdmin ? /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { size: 12, style: {
            color: msg.sender === "user" ? "rgba(255,255,255,0.8)" : t.accentCyan
          } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 12, style: {
            color: "rgba(255,255,255,0.5)"
          } }))
        ] })
      ] }) }, msg.id)),
      isTyping && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 rounded-2xl rounded-tl-sm", style: {
        background: t.cardBg2,
        border: `1px solid ${t.border}`
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full animate-bounce", style: {
        background: t.textMuted,
        animationDelay: `${i * 0.15}s`
      } }, i)) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: chatEndRef })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pb-28 pt-4 border-t", style: {
      background: t.cardBg,
      borderColor: t.border
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: sendChatMessage, className: "flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Type your message...", value: chatInput, onChange: (e) => setChatInput(e.target.value), className: "flex-1 px-4 py-3 rounded-xl outline-none", style: {
        background: t.inputBg,
        color: t.textPrimary,
        border: `1px solid ${t.border}`
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: !chatInput.trim(), className: "px-5 py-3 rounded-xl text-white", style: {
        background: t.gradientBtn,
        opacity: !chatInput.trim() ? 0.5 : 1
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 18 }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, { active: "support" })
  ] });
}
export {
  SupportPage as component
};
