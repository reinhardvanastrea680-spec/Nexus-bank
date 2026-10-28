import { useState, useRef, useEffect } from "react";
import {
  collection, addDoc, doc, setDoc, updateDoc,
  onSnapshot, orderBy, query, serverTimestamp, increment,
} from "firebase/firestore";
import { db, ADMIN_UID } from "../lib/firebase";

type ChatMsg = {
  id: string;
  text: string;
  sender: "user" | "admin";
  time: string;
  createdAt?: unknown;
};

export default function ContactPage() {
  // ── Info collection ────────────────────────────────────────────────────
  const [chatInfo, setChatInfo]           = useState({ name: "", email: "", phone: "" });
  const [chatInfoFilled, setChatInfoFilled] = useState(false);
  const [starting, setStarting]           = useState(false);

  // ── Chat state ─────────────────────────────────────────────────────────
  const [chatInput, setChatInput]   = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatId, setChatId]         = useState<string | null>(null);
  const [isTyping, setIsTyping]     = useState(false);
  const [sending, setSending]       = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ── Start chat ─────────────────────────────────────────────────────────
  const startChat = async () => {
    if (!chatInfo.name.trim() || !chatInfo.email.trim()) return;
    setStarting(true);
    try {
      const id = `prospect_${chatInfo.email.replace(/[^a-zA-Z0-9]/g, "_")}_${Date.now()}`;
      setChatId(id);
      await setDoc(doc(db, "prospectiveChats", id), {
        prospectName: chatInfo.name,
        prospectEmail: chatInfo.email,
        prospectPhone: chatInfo.phone,
        lastMessage: "",
        lastMessageAt: serverTimestamp(),
        unreadByAdmin: 0,
        isTypingAdmin: false,
        status: "active",
        createdAt: serverTimestamp(),
      });
      // Welcome message from admin
      await addDoc(collection(db, "prospectiveChats", id, "messages"), {
        text: `Hi ${chatInfo.name}! 👋 Welcome to Nexsus Bank. How can we help you today?`,
        sender: "admin",
        createdAt: serverTimestamp(),
      });
      // Notify admin dashboard
      await addDoc(collection(db, "notifications"), {
        recipientId: ADMIN_UID,
        recipientType: "admin",
        type: "new_prospective_chat",
        title: "New Prospective User Chat",
        message: `${chatInfo.name} (${chatInfo.email}) started a live chat`,
        chatId: id,
        userId: "",
        userFullName: chatInfo.name,
        amount: 0,
        transactionType: "live_chat",
        status: "unread",
        declineReason: null,
        createdAt: serverTimestamp(),
        readAt: null,
      });
      setChatInfoFilled(true);
    } catch (err) {
      console.error("Failed to start chat:", err);
    } finally {
      setStarting(false);
    }
  };

  // ── Listen to messages & typing indicator ─────────────────────────────
  useEffect(() => {
    if (!chatId) return;
    const q = query(
      collection(db, "prospectiveChats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsubMessages = onSnapshot(q, (snap) => {
      setChatMessages(
        snap.docs.map((d) => {
          const ts = d.data().createdAt?.toDate();
          return {
            id: d.id,
            text: d.data().text as string,
            sender: d.data().sender as "user" | "admin",
            time: ts
              ? ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "...",
          };
        })
      );
    });
    const unsubTyping = onSnapshot(doc(db, "prospectiveChats", chatId), (snap) => {
      if (snap.exists()) setIsTyping(snap.data().isTypingAdmin === true);
    });
    return () => { unsubMessages(); unsubTyping(); };
  }, [chatId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  // ── Send message ───────────────────────────────────────────────────────
  const sendMsg = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = chatInput.trim();
    if (!text || !chatId || sending) return;
    setChatInput("");
    setSending(true);
    try {
      await addDoc(collection(db, "prospectiveChats", chatId, "messages"), {
        text,
        sender: "user",
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, "prospectiveChats", chatId), {
        lastMessage: text,
        lastMessageAt: serverTimestamp(),
        unreadByAdmin: increment(1),
      });
    } finally {
      setSending(false);
    }
  };

  const canStart = chatInfo.name.trim() && chatInfo.email.trim();

  return (
    <>
      {/* ── Page Banner ── */}
      <div className="page-banner">
        <div className="container">
          <div className="page-banner-inner">
            <div className="breadcrumb">
              <a href="/">Home</a><span>›</span><span>Contact</span>
            </div>
            <h1>Talk to Us, Live</h1>
            <p>Connect with a Nexsus Bank specialist instantly. Real people, real answers, 24/7.</p>
          </div>
        </div>
      </div>

      {/* ── Brand Logo Section ── */}
      <section style={{ background: "var(--primary)", padding: "64px 0 48px" }}>
        <div className="container">
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: 32,
          }}>
            {/* Professional bank logo */}
            <div style={{
              width: 120,
              height: 120,
              borderRadius: 28,
              background: "linear-gradient(135deg, #1d4ed8, #0891b2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 20px 60px rgba(8,145,178,0.35), 0 0 0 1px rgba(255,255,255,0.1)",
              position: "relative",
            }}>
              <div style={{
                fontSize: 56,
                fontWeight: 900,
                color: "#fff",
                fontFamily: "var(--font-head)",
                letterSpacing: -2,
              }}>N</div>
              {/* Glow effect */}
              <div style={{
                position: "absolute",
                inset: -2,
                borderRadius: 28,
                background: "linear-gradient(135deg, rgba(29,78,216,0.4), rgba(8,145,178,0.4))",
                filter: "blur(20px)",
                zIndex: -1,
              }} />
            </div>

            {/* Bank name and tagline */}
            <div>
              <h2 style={{
                fontFamily: "var(--font-head)",
                fontSize: 42,
                fontWeight: 900,
                color: "#fff",
                marginBottom: 12,
                letterSpacing: -1,
              }}>
                Nexsus Bank
              </h2>
              <p style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: 18,
                fontWeight: 500,
                letterSpacing: 0.5,
              }}>
                Banking Beyond Boundaries
              </p>
            </div>

            {/* Trust badges */}
            <div style={{
              display: "flex",
              gap: 28,
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: 16,
            }}>
              {[
                { icon: "🏛️", label: "FDIC Insured", sub: "Up to $250,000" },
                { icon: "🔒", label: "bank grade Security", sub: "256-bit Encryption" },
                { icon: "⚡", label: "24/7 Support", sub: "Always Available" },
                { icon: "🌍", label: "Global Access", sub: "40+ Currencies" },
              ].map((badge) => (
                <div key={badge.label} style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  padding: "20px 24px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 16,
                  minWidth: 140,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                >
                  <div style={{ fontSize: 32 }}>{badge.icon}</div>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#fff",
                    textAlign: "center",
                  }}>{badge.label}</div>
                  <div style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.6)",
                    textAlign: "center",
                  }}>{badge.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Live Chat (full width, centered) ── */}
      <section style={{ background: "var(--bg-light)", padding: "64px 0 80px" }}>
        <div className="container">

          {/* Section heading */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="section-label">Live Support</div>
            <h2 style={{
              fontFamily: "var(--font-head)", fontSize: "clamp(26px, 3.5vw, 36px)",
              fontWeight: 800, color: "var(--text-dark)", marginBottom: 12,
            }}>
              Chat with a Specialist Now
            </h2>
            <p style={{ color: "var(--text-body)", fontSize: 15, maxWidth: 480, margin: "0 auto" }}>
              Our support team is online and ready to help. Average response time under 2 minutes.
            </p>
          </div>

          {/* Chat card — max 680px wide, centered */}
          <div style={{
            maxWidth: 680,
            margin: "0 auto",
            background: "#fff",
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
            border: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            minHeight: 520,
          }}>

            {/* ── Chat header ── */}
            <div style={{
              background: "linear-gradient(135deg, #0891b2, #1d4ed8)",
              padding: "22px 28px",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                background: "rgba(255,255,255,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, flexShrink: 0,
              }}>💬</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 17, fontFamily: "var(--font-head)" }}>
                  Live Chat Support
                </div>
                <div style={{
                  color: "rgba(255,255,255,0.8)", fontSize: 13,
                  display: "flex", alignItems: "center", gap: 7, marginTop: 3,
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: "#2ecc71", display: "inline-block",
                    boxShadow: "0 0 0 2px rgba(46,204,113,0.3)",
                  }} />
                  {isTyping ? "Agent is typing…" : "We're online · Reply instantly"}
                </div>
              </div>
              <div style={{
                fontSize: 12, color: "rgba(255,255,255,0.85)",
                background: "rgba(255,255,255,0.15)",
                padding: "5px 14px", borderRadius: 100,
                fontWeight: 600, letterSpacing: 0.3,
              }}>
                Avg. &lt;2 min
              </div>
            </div>

            {/* ── Body ── */}
            {!chatInfoFilled ? (
              /* ── Info collection form ── */
              <div style={{ flex: 1, padding: "36px 40px" }}>
                <div style={{ marginBottom: 28 }}>
                  <h3 style={{
                    fontFamily: "var(--font-head)", fontSize: 20,
                    fontWeight: 800, color: "var(--text-dark)", marginBottom: 6,
                  }}>
                    Before we start
                  </h3>
                  <p style={{ fontSize: 14, color: "var(--text-body)", margin: 0 }}>
                    Share a few details so we can personalise your support experience.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Name + Email row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label className="form-label">Full Name *</label>
                      <input
                        className="form-control"
                        placeholder="John Doe"
                        value={chatInfo.name}
                        onChange={(e) => setChatInfo((p) => ({ ...p, name: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && canStart && void startChat()}
                      />
                    </div>
                    <div>
                      <label className="form-label">Email Address *</label>
                      <input
                        className="form-control"
                        type="email"
                        placeholder="john@example.com"
                        value={chatInfo.email}
                        onChange={(e) => setChatInfo((p) => ({ ...p, email: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && canStart && void startChat()}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Phone (optional)</label>
                    <input
                      className="form-control"
                      type="tel"
                      placeholder="+1 (555) 000 0000"
                      value={chatInfo.phone}
                      onChange={(e) => setChatInfo((p) => ({ ...p, phone: e.target.value }))}
                    />
                  </div>

                  {/* Trust badges */}
                  <div style={{
                    display: "flex", gap: 20, flexWrap: "wrap",
                    padding: "14px 18px",
                    background: "rgba(8,145,178,0.04)",
                    border: "1px solid rgba(8,145,178,0.12)",
                    borderRadius: 12,
                  }}>
                    {["🔒 End to end encrypted", "🛡️ Your data is never shared", "⚡ Instant connection"].map((b) => (
                      <span key={b} style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>{b}</span>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => void startChat()}
                    disabled={!canStart || starting}
                    style={{
                      width: "100%",
                      padding: "15px 24px",
                      borderRadius: 100,
                      background: canStart && !starting
                        ? "linear-gradient(135deg, #0891b2, #1d4ed8)"
                        : "var(--border)",
                      color: canStart && !starting ? "#fff" : "var(--text-muted)",
                      border: "none",
                      fontFamily: "var(--font-head)",
                      fontWeight: 700,
                      fontSize: 15,
                      cursor: canStart && !starting ? "pointer" : "not-allowed",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    {starting ? (
                      <>
                        <span style={{
                          width: 16, height: 16, borderRadius: "50%",
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "#fff",
                          animation: "spin 0.7s linear infinite",
                          display: "inline-block",
                        }} />
                        Connecting…
                      </>
                    ) : (
                      <>💬 Start Live Chat</>
                    )}
                  </button>
                </div>
              </div>

            ) : (
              /* ── Active chat ── */
              <>
                {/* User info bar */}
                <div style={{
                  padding: "12px 24px",
                  background: "rgba(8,145,178,0.04)",
                  borderBottom: "1px solid var(--border)",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--teal), var(--blue))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 700, fontSize: 15, flexShrink: 0,
                  }}>
                    {chatInfo.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-dark)" }}>
                      {chatInfo.name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{chatInfo.email}</div>
                  </div>
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: "#2ecc71", display: "inline-block",
                    }} />
                    <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>Connected</span>
                  </div>
                </div>

                {/* Messages */}
                <div style={{
                  flex: 1,
                  padding: "20px 24px",
                  overflowY: "auto",
                  background: "#f8fafc",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  minHeight: 280,
                }}>
                  {chatMessages.map((m) => (
                    <div key={m.id} style={{
                      display: "flex",
                      justifyContent: m.sender === "user" ? "flex-end" : "flex-start",
                      alignItems: "flex-end",
                      gap: 8,
                    }}>
                      {m.sender === "admin" && (
                        <div style={{
                          width: 30, height: 30, borderRadius: "50%",
                          background: "linear-gradient(135deg, var(--teal), var(--blue))",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 14, flexShrink: 0,
                        }}>🏦</div>
                      )}
                      <div style={{
                        maxWidth: "72%",
                        padding: "12px 16px",
                        borderRadius: m.sender === "user"
                          ? "18px 18px 4px 18px"
                          : "18px 18px 18px 4px",
                        background: m.sender === "user"
                          ? "linear-gradient(135deg, #0891b2, #1d4ed8)"
                          : "#fff",
                        color: m.sender === "user" ? "#fff" : "var(--text-dark)",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
                      }}>
                        {m.sender === "admin" && (
                          <div style={{
                            fontSize: 10, fontWeight: 700, color: "var(--teal)",
                            textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4,
                          }}>
                            Nexsus Support
                          </div>
                        )}
                        <div style={{ fontSize: 14, lineHeight: 1.55 }}>{m.text}</div>
                        <div style={{
                          fontSize: 10, marginTop: 5,
                          textAlign: "right",
                          opacity: 0.55,
                        }}>{m.time}</div>
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--teal), var(--blue))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, flexShrink: 0,
                      }}>🏦</div>
                      <div style={{
                        padding: "12px 18px",
                        borderRadius: "18px 18px 18px 4px",
                        background: "#fff",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
                        display: "flex", gap: 5, alignItems: "center",
                      }}>
                        {[0, 1, 2].map((i) => (
                          <span key={i} style={{
                            width: 7, height: 7, borderRadius: "50%",
                            background: "var(--teal)",
                            display: "inline-block",
                            animation: "bounce 1.4s infinite",
                            animationDelay: `${i * 0.2}s`,
                          }} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input bar */}
                <form
                  onSubmit={(e) => void sendMsg(e)}
                  style={{
                    display: "flex", gap: 10,
                    padding: "14px 20px",
                    borderTop: "1px solid var(--border)",
                    background: "#fff",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Type your message…"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "12px 18px",
                      borderRadius: 100,
                      border: "1.5px solid var(--border)",
                      fontSize: 14,
                      outline: "none",
                      fontFamily: "var(--font-body)",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--teal)")}
                    onBlur={(e)  => (e.target.style.borderColor = "var(--border)")}
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || sending}
                    style={{
                      width: 46, height: 46, borderRadius: "50%",
                      background: chatInput.trim() && !sending
                        ? "linear-gradient(135deg, #0891b2, #1d4ed8)"
                        : "var(--bg-light)",
                      border: "none",
                      color: chatInput.trim() && !sending ? "#fff" : "var(--text-muted)",
                      fontSize: 18,
                      cursor: chatInput.trim() && !sending ? "pointer" : "not-allowed",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                      transition: "background 0.2s",
                    }}
                  >
                    ➤
                  </button>
                </form>

                {/* Footer */}
                <div style={{
                  padding: "8px 20px",
                  textAlign: "center",
                  fontSize: 11,
                  color: "var(--text-muted)",
                  background: "#fff",
                  borderTop: "1px solid var(--border)",
                }}>
                  🔒 Encrypted · Powered by Nexsus Bank Live Support
                </div>
              </>
            )}
          </div>


        </div>
      </section>

      {/* ── Branch Locations ── */}
      <section style={{ background: "var(--primary)", padding: "56px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div className="section-label">Nationwide Network</div>
            <h2 style={{
              fontFamily: "var(--font-head)", fontSize: 32,
              fontWeight: 800, color: "#fff", marginBottom: 12,
            }}>
              Find a Branch Near You
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, maxWidth: 480, margin: "0 auto" }}>
              With branches across the United States and a world class digital platform, Nexsus Bank is always within reach.
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            {[
              { city: "Charlotte, NC",   addr: "214 North Tryon Street", flag: "🏛️" },
              { city: "New York, NY",    addr: "1 World Trade Center",   flag: "🗽" },
              { city: "Los Angeles, CA", addr: "350 S Grand Avenue",     flag: "🌴" },
              { city: "Chicago, IL",    addr: "233 S Wacker Drive",      flag: "🌆" },
            ].map((b) => (
              <div key={b.city}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 16, padding: "20px 24px",
                  display: "flex", gap: 14, alignItems: "center",
                  minWidth: 220, transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
              >
                <div style={{ fontSize: 28 }}>{b.flag}</div>
                <div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{b.city}</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 2 }}>{b.addr}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30%            { transform: translateY(-6px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 600px) {
          .chat-name-email-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
