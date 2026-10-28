import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";

type Message = {
  id: number;
  text: string;
  sender: "user" | "admin" | "bot";
  time: string;
};

export default function AdminSupportPage() {
  // Prevent search engines from indexing or following links on this page
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);
  const [chatInput, setChatInput] = useState("");
  // Load chat from localStorage (same as ContactPage)
  const [chatMessages, setChatMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("nexus-bank-chat");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Save chat to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("nexus-bank-chat", JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Listen for changes to localStorage from other windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "nexus-bank-chat" && e.newValue) {
        try {
          setChatMessages(JSON.parse(e.newValue));
        } catch {
          // Ignore invalid JSON
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const sendChatMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const adminMessage: Message = {
      id: chatMessages.length + 1,
      text: chatInput,
      sender: "admin",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, adminMessage]);
    setChatInput("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      {/* Admin Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a2332, #165dff)",
        padding: "24px 20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ fontSize: "32px" }}>🔧</div>
            <div>
              <h1 style={{ color: "#fff", fontFamily: "var(--font-head)", fontSize: "24px", margin: 0 }}>
                Nexsus Bank Admin Support
              </h1>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", margin: 0 }}>
                Manage customer conversations
              </p>
            </div>
          </div>
          <Link to="/">
            <button style={{
              padding: "10px 20px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.3)",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
              transition: "all 0.3s",
            }} onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.25)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }} onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.15)";
              e.currentTarget.style.transform = "translateY(0)";
            }}>
              ← Back to Home
            </button>
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "24px", height: "70vh" }}>
          {/* Chats List (Left Sidebar) */}
          <div style={{
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}>
            <div style={{
              padding: "16px",
              background: "linear-gradient(135deg, var(--teal), var(--blue))",
              color: "#fff",
              fontWeight: 700,
              fontSize: "15px",
            }}>
              Customer Chats
            </div>
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "8px",
            }}>
              <div style={{
                padding: "12px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, rgba(22,93,255,0.1), rgba(0,184,166,0.1))",
                cursor: "pointer",
                border: "2px solid var(--teal)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--teal), var(--blue))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "18px",
                    fontWeight: 700,
                  }}>
                    JD
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "var(--text-dark)", fontSize: "14px" }}>
                      John Doe
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                      Last message: {chatMessages[chatMessages.length - 1]?.text?.slice(0, 25) || "No messages yet"}...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Window (Right Side) */}
          <div style={{
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}>
            {/* Chat Header */}
            <div style={{
              background: "linear-gradient(135deg, var(--teal), var(--blue))",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
              }}>👤</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>John Doe</div>
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#2ecc71",
                    display: "inline-block",
                  }}></span>
                  Online
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div style={{
              flex: 1,
              padding: "16px",
              overflowY: "auto",
              background: "#f8f9fa",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}>
              {chatMessages.map((message) => (
                <div key={message.id} style={{
                  display: "flex",
                  justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                }}>
                  <div style={{
                    maxWidth: "75%",
                    padding: "12px 16px",
                    borderRadius: message.sender === "user" 
                      ? "16px 16px 4px 16px" 
                      : message.sender === "admin" 
                        ? "16px 16px 16px 4px" 
                        : "16px 16px 4px 16px",
                    background: message.sender === "user" 
                      ? "linear-gradient(135deg, var(--teal), var(--blue))" 
                      : message.sender === "admin" 
                        ? "#2d3748" 
                        : "#fff",
                    color: message.sender === "user" || message.sender === "admin" ? "#fff" : "var(--text-dark)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}>
                    <div style={{ fontSize: "14px", lineHeight: "1.5" }}>{message.text}</div>
                    <div style={{ fontSize: "11px", marginTop: "6px", textAlign: "right", opacity: 0.7 }}>
                      {message.time}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div style={{
              padding: "12px 16px",
              background: "#fff",
              borderTop: "1px solid #eaeaea",
            }}>
              <form onSubmit={sendChatMessage} style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="Type your reply as admin..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: "24px",
                    border: "1px solid #eaeaea",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--teal), var(--blue))",
                    border: "none",
                    color: "#fff",
                    fontSize: "20px",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >➤</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
