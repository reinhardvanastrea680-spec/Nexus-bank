import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, MessageSquare, Check, CheckCheck } from "lucide-react";
import { useUserAuth } from "../dashboard/hooks/useUserAuth";
import { useUserAccount } from "../dashboard/hooks/useUserAccount";
import { db } from "../firebase/config";
import { collection, addDoc, doc, setDoc, orderBy, query, onSnapshot, serverTimestamp, updateDoc, increment, getDoc } from "firebase/firestore";
import { useTheme } from "../hooks/use-theme";
import { themeColors } from "../utils/theme";
import { BottomNav } from "../dashboard/components/BottomNav";

type Message = { id: string; text: string; sender: "user" | "admin"; createdAt: Date; readByUser: boolean; readByAdmin: boolean; time?: string; };

export const Route = createFileRoute("/support")({
  head: () => ({ meta: [{ title: "Support - Nexus Bank" }] }),
  component: SupportPage,
});

function SupportPage() {
  const navigate = useNavigate();
  const { user } = useUserAuth();
  const { account } = useUserAccount();
  const { theme } = useTheme();
  const t = themeColors(theme);
  const [chatInput, setChatInput]     = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping]       = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatId = user?.uid;

  useEffect(() => {
    if (!chatId) return;
    getDoc(doc(db, "chats", chatId)).then((snap) => {
      if (!snap.exists()) {
        setDoc(doc(db, "chats", chatId), {
          userId: chatId, userFullName: account?.fullName || "User",
          userEmail: user?.email || "", lastMessage: "",
          lastMessageAt: serverTimestamp(), unreadByUser: 0, unreadByAdmin: 0,
          isTypingAdmin: false, status: "active", createdAt: serverTimestamp(),
        });
      }
    });
  }, [chatId, account, user]);

  useEffect(() => {
    if (!chatId) return;
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((d) => {
        const data = d.data();
        const createdAt = data.createdAt?.toDate() || new Date();
        return { id: d.id, text: data.text, sender: data.sender, createdAt, readByUser: data.readByUser ?? true, readByAdmin: data.readByAdmin ?? false, time: createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) } as Message;
      });
      setChatMessages(msgs);
      msgs.filter((m) => m.sender === "admin" && !m.readByUser)
        .forEach((m) => updateDoc(doc(db, "chats", chatId, "messages", m.id), { readByUser: true }));
    });
    const chatDocUnsub = onSnapshot(doc(db, "chats", chatId), (snap) => {
      if (snap.exists()) setIsTyping(snap.data().isTypingAdmin === true);
    });
    return () => { unsub(); chatDocUnsub(); };
  }, [chatId]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages, isTyping]);

  const sendChatMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim() || !chatId) return;
    const text = chatInput.trim();
    setChatInput("");
    try {
      await addDoc(collection(db, "chats", chatId, "messages"), { text, sender: "user", readByUser: true, readByAdmin: false, createdAt: serverTimestamp() });
      await updateDoc(doc(db, "chats", chatId), { lastMessage: text, lastMessageAt: serverTimestamp(), unreadByAdmin: increment(1), userFullName: account?.fullName || "User", userEmail: user?.email || "", status: "active" });
    } catch (error) { console.error("Error sending message:", error); }
  };

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: t.pageBg }}>
      {/* Header */}
      <div className="px-5 pt-10 pb-4 flex items-center gap-4"
        style={{ background: t.cardBg, borderBottom: `1px solid ${t.border}` }}>
        <button onClick={() => navigate({ to: "/" })} className="p-2">
          <ArrowLeft size={24} style={{ color: t.textPrimary }} />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: t.gradientBtn }}>
            <MessageSquare size={18} style={{ color: "#FFFFFF" }} />
          </div>
          <div>
            <p className="text-base font-bold" style={{ color: t.textPrimary }}>Support Team</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: t.accentGreen }} />
              <span className="text-xs" style={{ color: t.textMuted }}>
                "Online now"
              </span>
            </div>
          </div>
        </div>
        <div className="w-10" />
      </div>

      {/* Messages */}
      <div className="flex-1 px-5 py-4 overflow-y-auto space-y-4">
        {chatMessages.length === 0 && (
          <div className="text-center py-16">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-30" style={{ color: t.textMuted }} />
            <p className="text-sm font-medium" style={{ color: t.textMuted }}>No messages yet</p>
            <p className="text-xs mt-1" style={{ color: t.textMuted, opacity: 0.6 }}>Start a conversation with our support team</p>
          </div>
        )}
        {chatMessages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] p-3 rounded-2xl ${msg.sender === "user" ? "rounded-tr-sm" : "rounded-tl-sm"}`}
              style={{ background: msg.sender === "user" ? t.gradientBtn : t.cardBg2, border: msg.sender !== "user" ? `1px solid ${t.border}` : "none" }}>
              <p className="text-sm leading-relaxed" style={{ color: msg.sender === "user" ? "#FFFFFF" : t.textPrimary }}>{msg.text}</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <p className="text-xs opacity-60" style={{ color: msg.sender === "user" ? "#FFFFFF" : t.textMuted }}>{msg.time}</p>
                {msg.sender === "user" && (msg.readByAdmin
                  ? <CheckCheck size={12} style={{ color: msg.sender === "user" ? "rgba(255,255,255,0.8)" : t.accentCyan }} />
                  : <Check size={12} style={{ color: "rgba(255,255,255,0.5)" }} />
                )}
              </div>
            </div>
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="px-5 pb-28 pt-4 border-t" style={{ background: t.cardBg, borderColor: t.border }}>
        <form onSubmit={sendChatMessage} className="flex gap-3">
          <input type="text" placeholder="Type your message..." value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl outline-none"
            style={{ background: t.inputBg, color: t.textPrimary, border: `1px solid ${t.border}` }} />
          <button type="submit" disabled={!chatInput.trim()}
            className="px-5 py-3 rounded-xl text-white"
            style={{ background: t.gradientBtn, opacity: !chatInput.trim() ? 0.5 : 1 }}>
            <Send size={18} />
          </button>
        </form>
      </div>

      <BottomNav active="support" />
    </div>
  );
}
