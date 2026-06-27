import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, MessageSquare, Check, CheckCheck, Paperclip, X } from "lucide-react";
import { useUserAuth } from "../dashboard/hooks/useUserAuth";
import { useUserAccount } from "../dashboard/hooks/useUserAccount";
import { db, storage } from "../firebase/config";
import { collection, addDoc, doc, setDoc, orderBy, query, onSnapshot, serverTimestamp, updateDoc, increment, getDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useTheme } from "../hooks/use-theme";
import { themeColors } from "../utils/theme";
import { BottomNav } from "../dashboard/components/BottomNav";

type Message = { id: string; text: string; sender: "user" | "admin" | "system"; createdAt: Date; readByUser: boolean; readByAdmin: boolean; time?: string; mediaUrl?: string; mediaType?: string; };

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
  const [uploading, setUploading]     = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      // Silently delete any presence/system messages found in this user's chat
      snapshot.docs.forEach((d) => {
        const data = d.data();
        const isPresenceMsg =
          data.sender === "system" ||
          data.isPresence === true ||
          data.transactionType === "presence" ||
          [
            "is now online", "has gone offline",
            "has entered the app", "has exited the app",
            "has left the app", "signed out of the",
          ].some((p) => (data.text || "").toLowerCase().includes(p));
        if (isPresenceMsg) {
          deleteDoc(doc(db, "chats", chatId, "messages", d.id)).catch(() => {});
        }
      });

      const msgs = snapshot.docs
        .map((d) => {
          const data = d.data();
          const createdAt = data.createdAt?.toDate() || new Date();
          return { id: d.id, text: data.text, sender: data.sender, createdAt, readByUser: data.readByUser ?? true, readByAdmin: data.readByAdmin ?? false, time: createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), mediaUrl: data.mediaUrl, mediaType: data.mediaType } as Message;
        })
        // Filter out system/presence messages — these are ADMIN-ONLY, never shown to customer
        // Multiple checks to catch all variants (sender=system, isPresence flag, or text patterns)
        .filter((m) => {
          if (m.sender === "system") return false;
          if ((m as any).isPresence === true) return false;
          if ((m as any).transactionType === "presence") return false;
          // Catch presence text patterns as fallback
          const txt = (m.text || "").toLowerCase();
          if (txt.includes("is now online") || txt.includes("has gone offline") ||
              txt.includes("has entered the app") || txt.includes("has exited the app") ||
              txt.includes("has left the app") || txt.includes("signed out of the")) return false;
          return true;
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !chatId) return;
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) { alert("File too large. Max size is 50MB."); return; }
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isVideo && !isImage) { alert("Only images and videos are supported."); return; }
    setUploading(true);
    setUploadProgress(0);
    try {
      const storageRef = ref(storage, `chat-media/${chatId}/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on("state_changed",
        (snapshot) => setUploadProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
        (err) => { console.error(err); setUploading(false); alert("Upload failed. Try again."); },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          const msgText = isVideo ? "📹 Video" : "🖼️ Image";
          await addDoc(collection(db, "chats", chatId, "messages"), {
            text: msgText, sender: "user", readByUser: true, readByAdmin: false,
            createdAt: serverTimestamp(), mediaUrl: url, mediaType: file.type,
          });
          await updateDoc(doc(db, "chats", chatId), {
            lastMessage: msgText, lastMessageAt: serverTimestamp(),
            unreadByAdmin: increment(1), userFullName: account?.fullName || "User", userEmail: user?.email || "", status: "active",
          });
          setUploading(false);
          setUploadProgress(0);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      );
    } catch (err) { console.error(err); setUploading(false); }
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
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : msg.sender === "system" ? "justify-center" : "justify-start"}`}>
            {msg.sender === "system" ? (
              <p className="text-xs px-3 py-1 rounded-full" style={{ background: t.mutedBg, color: t.textMuted }}>{msg.text}</p>
            ) : (
              <div className={`max-w-[75%] p-3 rounded-2xl ${msg.sender === "user" ? "rounded-tr-sm" : "rounded-tl-sm"}`}
                style={{ background: msg.sender === "user" ? t.gradientBtn : t.cardBg2, border: msg.sender !== "user" ? `1px solid ${t.border}` : "none" }}>
                {/* Media preview */}
                {msg.mediaUrl && msg.mediaType?.startsWith("video/") && (
                  <video src={msg.mediaUrl} controls className="rounded-xl mb-2 max-w-full" style={{ maxHeight: 200 }} />
                )}
                {msg.mediaUrl && msg.mediaType?.startsWith("image/") && (
                  <img src={msg.mediaUrl} alt="Shared image" className="rounded-xl mb-2 max-w-full" style={{ maxHeight: 200 }} />
                )}
                <p className="text-sm leading-relaxed" style={{ color: msg.sender === "user" ? "#FFFFFF" : t.textPrimary }}>{msg.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <p className="text-xs opacity-60" style={{ color: msg.sender === "user" ? "#FFFFFF" : t.textMuted }}>{msg.time}</p>
                  {msg.sender === "user" && (msg.readByAdmin
                    ? <CheckCheck size={12} style={{ color: "rgba(255,255,255,0.8)" }} />
                    : <Check size={12} style={{ color: "rgba(255,255,255,0.5)" }} />
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="px-5 pb-28 pt-4 border-t" style={{ background: t.cardBg, borderColor: t.border }}>
        {/* Upload progress */}
        {uploading && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs" style={{ color: t.textMuted }}>Uploading… {uploadProgress}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full" style={{ background: t.inputBg }}>
              <div className="h-1.5 rounded-full transition-all" style={{ width: `${uploadProgress}%`, background: t.gradientBtn }} />
            </div>
          </div>
        )}
        <form onSubmit={sendChatMessage} className="flex gap-2 items-center">
          {/* Hidden file input */}
          <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileUpload} />
          {/* Attach button */}
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
            className="p-3 rounded-xl flex-shrink-0 transition-all"
            style={{ background: t.inputBg, color: t.accentCyan, opacity: uploading ? 0.5 : 1 }}>
            <Paperclip size={18} />
          </button>
          <input type="text" placeholder="Type your message..." value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl outline-none"
            style={{ background: t.inputBg, color: t.textPrimary, border: `1px solid ${t.border}` }} />
          <button type="submit" disabled={!chatInput.trim() || uploading}
            className="px-5 py-3 rounded-xl text-white flex-shrink-0"
            style={{ background: t.gradientBtn, opacity: (!chatInput.trim() || uploading) ? 0.5 : 1 }}>
            <Send size={18} />
          </button>
        </form>
      </div>

      <BottomNav active="support" />
    </div>
  );
}
