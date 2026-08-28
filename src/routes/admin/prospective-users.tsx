import { useState, useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Mail, Phone, Clock, Send, Users, FileText, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  collection, onSnapshot, query, orderBy, addDoc,
  updateDoc, doc, serverTimestamp, increment,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/prospective-users")({
  component: ProspectiveUsersPage,
});

type ProspectChat = {
  id: string;
  prospectName: string;
  prospectEmail: string;
  prospectPhone?: string;
  lastMessage: string;
  lastMessageAt: Date;
  unreadByAdmin: number;
  status: string;
  createdAt: Date;
};

type ProspectContact = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  createdAt: Date;
};

type ChatMsg = {
  id: string;
  text: string;
  sender: "user" | "admin";
  createdAt: Date;
};

function formatDate(d: Date) {
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function ProspectiveUsersPage() {
  const [tab, setTab] = useState<"chats" | "contacts">("chats");
  const [chats, setChats]         = useState<ProspectChat[]>([]);
  const [contacts, setContacts]   = useState<ProspectContact[]>([]);
  const [selectedChat, setSelectedChat]     = useState<ProspectChat | null>(null);
  const [selectedContact, setSelectedContact] = useState<ProspectContact | null>(null);
  const [messages, setMessages]   = useState<ChatMsg[]>([]);
  const [replyInput, setReplyInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ── Load prospective chats ──────────────────────────────────────────────
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "prospectiveChats"), (snap) => {
      const list: ProspectChat[] = snap.docs.map((d) => ({
        id: d.id,
        prospectName:  d.data().prospectName  || "Unknown",
        prospectEmail: d.data().prospectEmail || "",
        prospectPhone: d.data().prospectPhone || "",
        lastMessage:   d.data().lastMessage   || "",
        lastMessageAt: d.data().lastMessageAt?.toDate() || new Date(),
        unreadByAdmin: d.data().unreadByAdmin  || 0,
        status:        d.data().status         || "active",
        createdAt:     d.data().createdAt?.toDate() || new Date(),
      }));
      list.sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
      setChats(list);
    });
    return unsub;
  }, []);

  // ── Load contact form submissions ───────────────────────────────────────
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "prospectiveContacts"), (snap) => {
      const list: ProspectContact[] = snap.docs.map((d) => ({
        id:      d.id,
        name:    d.data().name    || d.data().fullName || "Unknown",
        email:   d.data().email   || "",
        phone:   d.data().phone   || "",
        subject: d.data().subject || "",
        message: d.data().message || "",
        status:  d.data().status  || "new",
        createdAt: d.data().createdAt?.toDate() || new Date(),
      }));
      list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setContacts(list);
    });
    return unsub;
  }, []);

  // ── Load messages for selected chat ────────────────────────────────────
  useEffect(() => {
    if (!selectedChat) { setMessages([]); return; }

    const q = query(collection(db, "prospectiveChats", selectedChat.id, "messages"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const msgs: ChatMsg[] = snap.docs.map((d) => ({
        id:     d.id,
        text:   d.data().text,
        sender: d.data().sender,
        createdAt: d.data().createdAt?.toDate() || new Date(),
      }));
      setMessages(msgs);
      // Reset unread
      updateDoc(doc(db, "prospectiveChats", selectedChat.id), { unreadByAdmin: 0 }).catch(() => {});
    });
    return unsub;
  }, [selectedChat]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send admin reply ────────────────────────────────────────────────────
  const sendReply = async () => {
    if (!replyInput.trim() || !selectedChat) return;
    const text = replyInput.trim();
    setReplyInput("");

    // Set typing indicator briefly
    await updateDoc(doc(db, "prospectiveChats", selectedChat.id), { isTypingAdmin: true });

    await addDoc(collection(db, "prospectiveChats", selectedChat.id, "messages"), {
      text,
      sender: "admin",
      createdAt: serverTimestamp(),
    });

    await updateDoc(doc(db, "prospectiveChats", selectedChat.id), {
      lastMessage:   text,
      lastMessageAt: serverTimestamp(),
      isTypingAdmin: false,
      unreadByUser:  increment(1),
    });
  };

  // ── Mark contact as handled ─────────────────────────────────────────────
  const markContactHandled = async (contactId: string) => {
    await updateDoc(doc(db, "prospectiveContacts", contactId), { status: "handled" });
    toast.success("Marked as handled");
    setSelectedContact(null);
  };

  const totalUnread = chats.reduce((s, c) => s + c.unreadByAdmin, 0);
  const newContacts = contacts.filter((c) => c.status === "new").length;

  const filteredChats    = chats.filter((c) => c.prospectName.toLowerCase().includes(searchTerm.toLowerCase()) || c.prospectEmail.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredContacts = contacts.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-cyan-400" size={24} />
            Prospective New Users
          </h1>
          <p className="text-blue-300/60 text-sm">Manage enquiries and live chats from the landing page</p>
        </div>
        <div className="flex items-center gap-2">
          {totalUnread > 0 && (
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              {totalUnread} unread messages
            </Badge>
          )}
          {newContacts > 0 && (
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              {newContacts} new enquiries
            </Badge>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab("chats")} className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all"
          style={{ background: tab === "chats" ? "rgba(56,189,248,0.15)" : "rgba(255,255,255,0.04)", color: tab === "chats" ? "#38BDF8" : "#8A9BB5", border: tab === "chats" ? "1px solid rgba(56,189,248,0.3)" : "1px solid transparent" }}>
          <MessageSquare size={15} /> Live Chats
          {totalUnread > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: "#EF4444", color: "#fff" }}>{totalUnread}</span>}
        </button>
        <button onClick={() => setTab("contacts")} className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all"
          style={{ background: tab === "contacts" ? "rgba(56,189,248,0.15)" : "rgba(255,255,255,0.04)", color: tab === "contacts" ? "#38BDF8" : "#8A9BB5", border: tab === "contacts" ? "1px solid rgba(56,189,248,0.3)" : "1px solid transparent" }}>
          <FileText size={15} /> Contact Enquiries
          {newContacts > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: "#FFAB00", color: "#0B1120" }}>{newContacts}</span>}
        </button>
      </div>

      {/* Search */}
      <Input placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
        className="w-56 bg-[#070B14] border-[rgba(255,255,255,0.1)] text-white" />

      {/* ── CHATS TAB ── */}
      {tab === "chats" && (
        <div className="flex gap-4 h-[580px]">
          {/* Sidebar — full width when no chat selected, collapses to icon strip when chat is open */}
          <div
            className="flex-shrink-0 flex flex-col overflow-y-auto"
            style={{
              width: selectedChat ? 52 : 224,
              transition: "width 0.25s cubic-bezier(.4,0,.2,1)",
            }}
          >
            {filteredChats.length === 0 ? (
              !selectedChat && (
                <div className="text-center py-12 text-[#8A9BB5]">
                  <MessageSquare size={28} className="mx-auto mb-3 opacity-30" />
                  <p className="text-xs">No live chats yet</p>
                </div>
              )
            ) : filteredChats.map((chat) => (
              <button key={chat.id} onClick={() => setSelectedChat(chat)}
                title={selectedChat ? chat.prospectName : undefined}
                className="rounded-xl transition-all mb-1.5 relative"
                style={{
                  background: selectedChat?.id === chat.id ? "rgba(56,189,248,0.15)" : "rgba(255,255,255,0.03)",
                  border: selectedChat?.id === chat.id ? "1px solid rgba(56,189,248,0.4)" : "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: selectedChat ? "center" : "flex-start",
                  gap: selectedChat ? 0 : 8,
                  padding: selectedChat ? "8px" : "10px 12px",
                  overflow: "hidden",
                  textAlign: "left",
                }}>
                {/* Avatar — always visible */}
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs">
                    {chat.prospectName.charAt(0).toUpperCase()}
                  </div>
                  {chat.unreadByAdmin > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ background: "#EF4444", fontSize: 9 }}>
                      {chat.unreadByAdmin}
                    </span>
                  )}
                </div>
                {/* Name + preview — only shown when sidebar is expanded */}
                {!selectedChat && (
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-xs truncate">{chat.prospectName}</p>
                    <p className="text-blue-300/50 text-xs truncate">{chat.lastMessage || chat.prospectEmail}</p>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Chat window — expands to fill all remaining space when sidebar collapses */}
          <Card className="glass-card border-0 flex-1 flex flex-col overflow-hidden">
            {!selectedChat ? (
              <div className="flex-1 flex items-center justify-center text-center text-[#8A9BB5]">
                <div>
                  <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
                  <p>Select a chat to start replying</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat header — back arrow re-expands sidebar */}
                <div className="p-4 border-b border-[rgba(255,255,255,0.05)] flex items-center gap-3">
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="p-1.5 rounded-lg text-blue-300 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0 text-base leading-none"
                    title="Back to all chats"
                  >
                    ←
                  </button>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {selectedChat.prospectName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">{selectedChat.prospectName}</p>
                    <p className="text-blue-300/60 text-xs flex items-center gap-3">
                      <span className="flex items-center gap-1 truncate"><Mail size={11} />{selectedChat.prospectEmail}</span>
                      {selectedChat.prospectPhone && <span className="flex items-center gap-1 flex-shrink-0"><Phone size={11} />{selectedChat.prospectPhone}</span>}
                    </p>
                  </div>
                  <Badge className="ml-auto flex-shrink-0 bg-green-500/20 text-green-400 border-green-500/30">Prospective User</Badge>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3" style={{ background: "#07101E" }}>
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                      <div className="max-w-[75%] p-3 rounded-2xl"
                        style={{
                          background: msg.sender === "admin" ? "linear-gradient(135deg, #38BDF8, #6366F1)" : "rgba(255,255,255,0.07)",
                          borderRadius: msg.sender === "admin" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        }}>
                        <p className="text-white text-sm">{msg.text}</p>
                        <p className="text-xs mt-1 opacity-60 text-white text-right">
                          {msg.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Reply input */}
                <div className="p-4 border-t border-[rgba(255,255,255,0.05)]">
                  <form onSubmit={(e) => { e.preventDefault(); void sendReply(); }} className="flex gap-3">
                    <Input value={replyInput} onChange={(e) => setReplyInput(e.target.value)}
                      placeholder="Type your reply..."
                      className="flex-1 h-12 bg-[#111827] border-[rgba(255,255,255,0.1)] text-white placeholder:text-blue-300/50" />
                    <Button type="submit" disabled={!replyInput.trim()}
                      className="h-12 bg-gradient-to-r from-cyan-500 to-violet-600 text-white px-6">
                      <Send size={16} />
                    </Button>
                  </form>
                </div>
              </>
            )}
          </Card>
        </div>
      )}

      {/* ── CONTACTS TAB ── */}
      {tab === "contacts" && (
        <div className="flex gap-4 h-[580px]">
          {/* List — narrow */}
          <div className="w-56 flex-shrink-0 flex flex-col gap-1.5 overflow-y-auto">
            {filteredContacts.length === 0 ? (
              <div className="text-center py-12 text-[#8A9BB5]">
                <FileText size={28} className="mx-auto mb-3 opacity-30" />
                <p className="text-xs">No enquiries yet</p>
              </div>
            ) : filteredContacts.map((c) => (
              <button key={c.id} onClick={() => setSelectedContact(c)}
                className="text-left px-3 py-2.5 rounded-xl transition-all"
                style={{ background: selectedContact?.id === c.id ? "rgba(56,189,248,0.1)" : "rgba(255,255,255,0.03)", border: selectedContact?.id === c.id ? "1px solid rgba(56,189,248,0.3)" : "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-white font-semibold text-xs truncate">{c.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${c.status === "new" ? "bg-yellow-500/20 text-yellow-300" : "bg-green-500/20 text-green-300"}`} style={{ fontSize: 10 }}>
                    {c.status === "new" ? "New" : "Done"}
                  </span>
                </div>
                <p className="text-blue-300/50 text-xs truncate">{c.subject || c.email}</p>
              </button>
            ))}
          </div>

          {/* Detail */}
          <Card className="glass-card border-0 flex-1 overflow-auto">
            {!selectedContact ? (
              <div className="flex-1 flex items-center justify-center text-center text-[#8A9BB5] h-full">
                <div>
                  <FileText size={48} className="mx-auto mb-4 opacity-30" />
                  <p>Select an enquiry to view details</p>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-white font-bold text-lg">{selectedContact.subject}</h2>
                  <Badge className={selectedContact.status === "new" ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" : "bg-green-500/20 text-green-300 border-green-500/30"}>
                    {selectedContact.status === "new" ? "New" : "Handled"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                  {[
                    { label: "Name",    value: selectedContact.name,  icon: <Users size={14} /> },
                    { label: "Email",   value: selectedContact.email, icon: <Mail  size={14} /> },
                    { label: "Phone",   value: selectedContact.phone || "—", icon: <Phone size={14} /> },
                    { label: "Received", value: formatDate(selectedContact.createdAt), icon: <Clock size={14} /> },
                  ].map(({ label, value, icon }) => (
                    <div key={label}>
                      <p className="text-blue-300/50 text-xs flex items-center gap-1 mb-1">{icon}{label}</p>
                      <p className="text-white text-sm font-medium">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <p className="text-blue-300/50 text-xs mb-2">Message</p>
                  <p className="text-white text-sm leading-relaxed">{selectedContact.message}</p>
                </div>

                {selectedContact.status === "new" && (
                  <Button onClick={() => void markContactHandled(selectedContact.id)}
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30">
                    <CheckCircle2 size={16} className="mr-2" />
                    Mark as Handled
                  </Button>
                )}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
