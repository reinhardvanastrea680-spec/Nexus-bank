import { useState, useRef, useEffect } from "react";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { MessageSquare, Send, User, Users, CheckCheck, Check, ArrowLeft, Circle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useUsers } from "../../admin/hooks/useUsers";
import { db } from "../../firebase/config";
import {
  collection, addDoc, doc, orderBy, query,
  onSnapshot, serverTimestamp, updateDoc, increment,
} from "firebase/firestore";

type Message = {
  id: string; text: string; sender: "user" | "admin";
  createdAt: Date; readByUser: boolean; readByAdmin: boolean; time: string;
};
type Chat = {
  id: string; userFullName: string; userEmail: string;
  lastMessage: string; lastMessageAt: Date; unreadByAdmin: number; status: string;
};

export const Route = createFileRoute("/admin/chat")({
  component: AdminChatPage,
  validateSearch: (search: Record<string, unknown>) => ({
    userId: (search.userId as string) || undefined,
  }),
});

function AdminChatPage() {
  const { userId } = useSearch({ from: "/admin/chat" });
  const { users } = useUsers();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(userId ?? null);
  const [chatInput, setChatInput]   = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chats, setChats]           = useState<Chat[]>([]);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const selectedUser = selectedUserId ? users.find((u) => u.id === selectedUserId) : null;
  const totalUnread  = chats.reduce((s, c) => s + c.unreadByAdmin, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatInput(e.target.value);
    if (!selectedUserId) return;
    updateDoc(doc(db, "chats", selectedUserId), { isTypingAdmin: e.target.value.length > 0 }).catch(() => {});
  };

  // Load all chats
  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, "chats")), (snap) => {
      const list: Chat[] = snap.docs.map((d) => ({
        id: d.id,
        userFullName: d.data().userFullName || "User",
        userEmail:    d.data().userEmail    || "",
        lastMessage:  d.data().lastMessage  || "",
        lastMessageAt: d.data().lastMessageAt?.toDate() || new Date(),
        unreadByAdmin: d.data().unreadByAdmin || 0,
        status:       d.data().status        || "active",
      }));
      list.sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
      setChats(list);
    });
    return unsub;
  }, []);

  // Load messages
  useEffect(() => {
    if (!selectedUserId) { setChatMessages([]); return; }
    const q = query(collection(db, "chats", selectedUserId, "messages"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const msgs: Message[] = snap.docs.map((d) => {
        const data = d.data();
        const createdAt = data.createdAt?.toDate() || new Date();
        return { id: d.id, text: data.text, sender: data.sender, createdAt,
          readByUser: data.readByUser ?? false, readByAdmin: data.readByAdmin ?? true,
          time: createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
      });
      setChatMessages(msgs);
      msgs.filter((m) => m.sender === "user" && !m.readByAdmin)
        .forEach((m) => updateDoc(doc(db, "chats", selectedUserId, "messages", m.id), { readByAdmin: true }));
      updateDoc(doc(db, "chats", selectedUserId), { unreadByAdmin: 0 }).catch(() => {});
    });
    return unsub;
  }, [selectedUserId]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);

  const sendAdminMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim() || !selectedUserId) return;
    const text = chatInput.trim();
    setChatInput("");
    await addDoc(collection(db, "chats", selectedUserId, "messages"), {
      text, sender: "admin", readByAdmin: true, readByUser: false, createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, "chats", selectedUserId), {
      lastMessage: text, lastMessageAt: serverTimestamp(),
      unreadByUser: increment(1), isTypingAdmin: false,
    });
  };

  const openChat = (id: string) => {
    setSelectedUserId(id);
    setShowMobileChat(true);
  };

  // ── Chat list panel ──────────────────────────────────────────────────────
  const ChatList = () => (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-[rgba(255,255,255,0.05)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Users size={16} className="text-cyan-400" aria-hidden="true" />
            Chats
          </div>
          {totalUnread > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ background: "#EF4444", color: "#FFFFFF" }}>
              {totalUnread} new
            </span>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {chats.length === 0 ? (
          <div className="text-center py-12 text-blue-300/50 text-sm">
            <MessageSquare size={32} className="mx-auto mb-3 opacity-30" aria-hidden="true" />
            No active chats
          </div>
        ) : chats.map((chat) => (
          <button key={chat.id} onClick={() => openChat(chat.id)}
            className={`w-full p-2.5 rounded-xl cursor-pointer transition-all text-left ${
              selectedUserId === chat.id
                ? "bg-gradient-to-r from-cyan-500/10 to-violet-600/10 border border-cyan-500/30"
                : "hover:bg-white/5 border border-transparent"
            }`}
            aria-label={`Chat with ${chat.userFullName}${chat.unreadByAdmin > 0 ? `, ${chat.unreadByAdmin} unread` : ""}`}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0" aria-hidden="true">
                {chat.userFullName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-white font-medium truncate text-sm">{chat.userFullName}</p>
                  {chat.unreadByAdmin > 0 && (
                    <span className="min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: "#38BDF8", color: "#0B1120" }} aria-hidden="true">
                      {chat.unreadByAdmin}
                    </span>
                  )}
                </div>
                <p className="text-blue-300/50 text-xs truncate">{chat.lastMessage || chat.userEmail}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // ── Chat window panel ────────────────────────────────────────────────────
  const ChatWindow = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-[rgba(255,255,255,0.05)] flex items-center gap-3">
        {/* Back button on mobile */}
        <button onClick={() => setShowMobileChat(false)} aria-label="Back to chat list"
          className="lg:hidden p-2 -ml-1 rounded-lg text-blue-300 hover:text-white hover:bg-white/10 mr-1">
          <ArrowLeft size={20} aria-hidden="true" />
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white flex-shrink-0" aria-hidden="true">
          {selectedUser ? selectedUser.fullName.charAt(0).toUpperCase() : <User size={20} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold truncate">
            {selectedUser ? selectedUser.fullName : "Select a chat"}
          </p>
          {selectedUser && (
            <div className="flex items-center gap-1.5 text-xs" style={{ color: "#8A9BB5" }}>
              <Circle size={6} className="fill-green-400 text-green-400" aria-hidden="true" />
              {selectedUser.email}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: "#07101E" }} aria-label="Chat messages" aria-live="polite">
        {!selectedUserId ? (
          <div className="flex flex-col items-center justify-center h-full text-blue-300/50 py-12">
            <MessageSquare size={48} className="mb-4 opacity-30" aria-hidden="true" />
            <p>Select a chat to start replying</p>
          </div>
        ) : chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-blue-300/50 py-12">
            <MessageSquare size={48} className="mb-4 opacity-30" aria-hidden="true" />
            <p>No messages yet</p>
          </div>
        ) : chatMessages.map((msg) => {
          // ── System presence message (online/offline indicator) ──
          if ((msg as any).sender === "system" || (msg as any).isPresence) {
            return (
              <div key={msg.id} className="flex justify-center my-1">
                <span className="text-xs px-3 py-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.05)", color: "#8A9BB5" }}>
                  {msg.text}
                </span>
              </div>
            );
          }
          // ── Regular message ──
          return (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-start" : "justify-end"}`}>
            <div className="max-w-[80%] p-3 rounded-2xl"
              style={{
                background: msg.sender === "admin" ? "linear-gradient(135deg, #38BDF8, #6366F1)" : "#1A2438",
                borderRadius: msg.sender === "admin" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              }}>
              <p className="text-sm leading-relaxed text-white">{msg.text}</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <p className="text-xs opacity-60 text-white">{msg.time}</p>
                {msg.sender === "admin" && (
                  msg.readByUser
                    ? <CheckCheck size={12} style={{ color: "rgba(255,255,255,0.8)" }} aria-label="Read" />
                    : <Check     size={12} style={{ color: "rgba(255,255,255,0.5)" }} aria-label="Sent" />
                )}
              </div>
            </div>
          </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 md:p-4 border-t border-[rgba(255,255,255,0.05)]">
        <form onSubmit={sendAdminMessage} className="flex gap-2 md:gap-3">
          <Input type="text" placeholder={selectedUserId ? "Type your reply..." : "Select a chat first"}
            value={chatInput} onChange={handleInputChange} disabled={!selectedUserId}
            aria-label="Reply message"
            className="flex-1 h-11 md:h-12 bg-[#111827] border-[rgba(255,255,255,0.1)] text-white placeholder:text-blue-300/50" />
          <Button type="submit" disabled={!chatInput.trim() || !selectedUserId}
            aria-label="Send reply"
            className="h-11 md:h-12 px-4 md:px-6 bg-gradient-to-r from-cyan-500 to-violet-600 text-white">
            <Send size={16} aria-hidden="true" />
          </Button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="text-cyan-400" aria-hidden="true" />
          Live Chat Center
          {totalUnread > 0 && (
            <span className="ml-2 px-2.5 py-0.5 rounded-full text-sm font-bold"
              style={{ background: "#EF4444", color: "#FFFFFF" }} aria-label={`${totalUnread} unread messages`}>
              {totalUnread}
            </span>
          )}
        </h1>
        <p className="text-blue-300/70 mt-1 text-sm">Manage customer conversations in real-time</p>
      </div>

      {/* Desktop: side by side | Mobile: conditional panels */}
      <div className="flex-1 flex min-h-0 rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.05)]" style={{ minHeight: "calc(100vh - 200px)" }}>

        {/* Chat list — narrow sidebar, always visible on desktop */}
        <div className={`${showMobileChat ? "hidden" : "flex"} lg:flex flex-col w-full lg:w-56 xl:w-64 flex-shrink-0 border-r border-[rgba(255,255,255,0.05)] bg-[#0A1020]`}>
          <ChatList />
        </div>

        {/* Chat window — takes all remaining space */}
        <div className={`${showMobileChat ? "flex" : "hidden"} lg:flex flex-col flex-1 min-w-0 bg-[#0A1020]`}>
          <ChatWindow />
        </div>
      </div>
    </div>
  );
}
