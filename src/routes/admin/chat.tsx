import { useState, useRef, useEffect } from "react";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { MessageSquare, Send, User, Users, CheckCheck, Check } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ScrollArea } from "../../components/ui/scroll-area";
import { useUsers } from "../../admin/hooks/useUsers";
import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  doc,
  orderBy,
  query,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  increment,
  getDocs,
} from "firebase/firestore";

type Message = {
  id: string;
  text: string;
  sender: "user" | "admin";
  createdAt: Date;
  readByUser: boolean;
  readByAdmin: boolean;
  time: string;
};

type Chat = {
  id: string;
  userFullName: string;
  userEmail: string;
  lastMessage: string;
  lastMessageAt: Date;
  unreadByAdmin: number;
  status: string;
};

export const Route = createFileRoute("/admin/chat")({
  component: AdminChatPage,
  validateSearch: (search: Record<string, unknown>) => ({
    userId: (search.userId as string) || undefined,
  }),
});

function AdminChatPage() {
  const { userId } = useSearch({ from: "/admin/chat" });
  const { users, loading: usersLoading } = useUsers();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(userId ?? null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const selectedUser = selectedUserId ? users.find((u) => u.id === selectedUserId) : null;

  // Typing indicator: set isTypingAdmin on the chat doc
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatInput(e.target.value);
    if (!selectedUserId) return;
    updateDoc(doc(db, "chats", selectedUserId), {
      isTypingAdmin: e.target.value.length > 0,
    }).catch(() => {});
  };

  // Load all chats (one per user)
  useEffect(() => {
    const q = query(collection(db, "chats"));
    const unsub = onSnapshot(q, (snap) => {
      const chatList: Chat[] = snap.docs.map((d) => ({
        id: d.id,
        userFullName: d.data().userFullName || "User",
        userEmail: d.data().userEmail || "",
        lastMessage: d.data().lastMessage || "",
        lastMessageAt: d.data().lastMessageAt?.toDate() || new Date(),
        unreadByAdmin: d.data().unreadByAdmin || 0,
        status: d.data().status || "active",
      }));
      // Sort by latest message
      chatList.sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
      setChats(chatList);
    });
    return unsub;
  }, []);

  // Load messages for selected chat
  useEffect(() => {
    if (!selectedUserId) {
      setChatMessages([]);
      return;
    }

    const q = query(
      collection(db, "chats", selectedUserId, "messages"),
      orderBy("createdAt", "asc"),
    );

    const unsub = onSnapshot(q, (snap) => {
      const msgs: Message[] = snap.docs.map((d) => {
        const data = d.data();
        const createdAt = data.createdAt?.toDate() || new Date();
        return {
          id: d.id,
          text: data.text,
          sender: data.sender,
          createdAt,
          readByUser: data.readByUser ?? false,
          readByAdmin: data.readByAdmin ?? true,
          time: createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
      });
      setChatMessages(msgs);

      // Mark all user messages as read by admin
      msgs
        .filter((m) => m.sender === "user" && !m.readByAdmin)
        .forEach((m) =>
          updateDoc(doc(db, "chats", selectedUserId, "messages", m.id), {
            readByAdmin: true,
          }),
        );

      // Reset unread count
      updateDoc(doc(db, "chats", selectedUserId), { unreadByAdmin: 0 }).catch(() => {});
    });

    return unsub;
  }, [selectedUserId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendAdminMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim() || !selectedUserId) return;

    const text = chatInput.trim();
    setChatInput("");

    await addDoc(collection(db, "chats", selectedUserId, "messages"), {
      text,
      sender: "admin",
      readByAdmin: true,
      readByUser: false,
      createdAt: serverTimestamp(),
    });

    await updateDoc(doc(db, "chats", selectedUserId), {
      lastMessage: text,
      lastMessageAt: serverTimestamp(),
      unreadByUser: increment(1),
      isTypingAdmin: false,
    });
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="text-cyan-400" />
          Live Chat Center
        </h1>
        <p className="text-blue-300/70 mt-1">Manage customer conversations in real-time</p>
      </div>

      <div className="flex gap-6 flex-1 min-h-[600px]">
        {/* Left Sidebar */}
        <div className="w-80 bg-[#0A1020] border border-[rgba(255,255,255,0.05)] rounded-2xl flex flex-col">
          <div className="p-4 border-b border-[rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Users size={18} className="text-cyan-400" />
              Customer Chats
            </div>
          </div>
          <div className="flex-1 p-3 space-y-2 overflow-y-auto">
            {chats.length === 0 ? (
              <div className="text-center py-8 text-blue-300/50 text-sm">No active chats</div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                    selectedUserId === chat.id
                      ? "bg-gradient-to-r from-cyan-500/10 to-violet-600/10 border border-cyan-500/30"
                      : "hover:bg-white/5 border border-transparent"
                  }`}
                  onClick={() => setSelectedUserId(chat.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {chat.userFullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-white font-medium truncate text-sm">
                          {chat.userFullName}
                        </p>
                        {chat.unreadByAdmin > 0 && (
                          <span
                            className="ml-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ background: "#38BDF8", color: "#0B1120" }}
                          >
                            {chat.unreadByAdmin}
                          </span>
                        )}
                      </div>
                      <p className="text-blue-300/60 text-xs truncate">{chat.lastMessage || chat.userEmail}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-[#0A1020] border border-[rgba(255,255,255,0.05)] rounded-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-[rgba(255,255,255,0.05)] flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white text-xl">
              {selectedUser ? selectedUser.fullName.charAt(0).toUpperCase() : <User size={24} />}
            </div>
            <div>
              <p className="text-white font-semibold">
                {selectedUser ? selectedUser.fullName : "Select a chat"}
              </p>
              <div className="flex items-center gap-2 text-blue-300/60 text-xs">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                {selectedUser ? selectedUser.email : "No chat selected"}
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {!selectedUserId ? (
                <div className="text-center text-blue-300/50 py-20">
                  <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Select a chat to start messaging</p>
                </div>
              ) : chatMessages.length === 0 ? (
                <div className="text-center text-blue-300/50 py-20">
                  <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No messages yet</p>
                </div>
              ) : (
                chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[75%] p-3 rounded-2xl ${
                        message.sender === "user" ? "rounded-tl-sm" : "rounded-tr-sm"
                      }`}
                      style={{
                        background:
                          message.sender === "admin"
                            ? "linear-gradient(135deg, #38BDF8, #6366F1)"
                            : "#1A2438",
                      }}
                    >
                      <p className="text-sm leading-relaxed text-white">{message.text}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <p className="text-xs opacity-70 text-white">{message.time}</p>
                        {message.sender === "admin" &&
                          (message.readByUser ? (
                            <CheckCheck size={12} style={{ color: "rgba(255,255,255,0.8)" }} />
                          ) : (
                            <Check size={12} style={{ color: "rgba(255,255,255,0.5)" }} />
                          ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-[rgba(255,255,255,0.05)]">
            <form onSubmit={sendAdminMessage} className="flex gap-3">
              <Input
                type="text"
                placeholder={selectedUserId ? "Type your reply..." : "Select a chat first"}
                value={chatInput}
                onChange={handleInputChange}
                disabled={!selectedUserId}
                className="flex-1 h-12 bg-[#111827] border-[rgba(255,255,255,0.1)] text-white placeholder:text-blue-300/50"
              />
              <Button
                type="submit"
                disabled={!chatInput.trim() || !selectedUserId}
                className="h-12 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white px-6"
              >
                <Send size={18} />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
