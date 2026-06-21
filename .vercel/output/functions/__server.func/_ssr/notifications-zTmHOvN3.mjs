import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { a as auth, d as db } from "./router-8iYk_PDV.mjs";
import { q as query, w as where, c as collection, o as onSnapshot, u as updateDoc, s as serverTimestamp, d as doc } from "../_libs/firebase__firestore.mjs";
import { u as useUserTransactions } from "./useUserTransactions-9P4nxOr4.mjs";
import { u as useTheme } from "./use-theme-BfOV-CAK.mjs";
import { B as BottomNav } from "./BottomNav-CtUMOiqo.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__storage.mjs";
import "../_libs/sonner.mjs";
import { A as ArrowLeft, g as Check, B as Bell, b as CircleCheck, c as CircleX, C as Clock, T as TriangleAlert } from "../_libs/lucide-react.mjs";
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
function useUserNotifications() {
  const [notifications, setNotifications] = reactExports.useState([]);
  const [unreadCount, setUnreadCount] = reactExports.useState(0);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, "notifications"),
      where("recipientId", "==", userId),
      where("recipientType", "==", "user")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map((doc2) => ({
        id: doc2.id,
        ...doc2.data(),
        createdAt: doc2.data().createdAt?.toDate() ?? /* @__PURE__ */ new Date(),
        readAt: doc2.data().readAt?.toDate() ?? null
      }));
      notifs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setNotifications(notifs);
      setUnreadCount(notifs.filter((n) => n.status === "unread").length);
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  async function markNotificationRead(notificationId) {
    await updateDoc(doc(db, "notifications", notificationId), {
      status: "read",
      readAt: serverTimestamp()
    });
  }
  async function markAllRead() {
    const unread = notifications.filter((n) => n.status === "unread");
    await Promise.all(unread.map((n) => markNotificationRead(n.id)));
  }
  return { notifications, unreadCount, loading, markNotificationRead, markAllRead };
}
function formatCurrency(v) {
  return v.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
function Notifications() {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    loading,
    markNotificationRead,
    markAllRead
  } = useUserNotifications();
  const {
    transactions
  } = useUserTransactions();
  const {
    theme
  } = useTheme();
  const [filter, setFilter] = reactExports.useState("all");
  const [selectedNotif, setSelectedNotif] = reactExports.useState(null);
  const bg = theme === "dark" ? "#0B1120" : "#f9fafb";
  const cardBg = theme === "dark" ? "#111827" : "#ffffff";
  const textPrimary = theme === "dark" ? "#FFFFFF" : "#111827";
  const textMuted = theme === "dark" ? "#8A9BB5" : "#6b7280";
  const filteredNotifications = filter === "unread" ? notifications.filter((n) => n.status === "unread") : notifications;
  const relatedTx = selectedNotif?.transactionId ? transactions.find((t) => t.id === selectedNotif.transactionId) : null;
  const handleClick = async (notif) => {
    setSelectedNotif(notif);
    if (notif.status === "unread") {
      await markNotificationRead(notif.id);
    }
  };
  const getIcon = (type) => {
    switch (type) {
      case "transaction_submitted":
      case "new_transaction":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 20, style: {
          color: "#FFAB00"
        } });
      case "transaction_approved":
      case "admin_credit":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 20, style: {
          color: "#00E676"
        } });
      case "transaction_declined":
      case "admin_debit":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 20, style: {
          color: "#FF4D6A"
        } });
      case "balance_override":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 20, style: {
          color: "#38BDF8"
        } });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 20, style: {
          color: "#38BDF8"
        } });
    }
  };
  const getIconBg = (type) => {
    switch (type) {
      case "transaction_submitted":
      case "new_transaction":
        return "rgba(255,171,0,0.2)";
      case "transaction_approved":
      case "admin_credit":
        return "rgba(0,230,118,0.2)";
      case "transaction_declined":
      case "admin_debit":
        return "rgba(255,77,106,0.2)";
      default:
        return theme === "dark" ? "#1A2438" : "#f3f4f6";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen w-full flex flex-col pb-24", style: {
    background: bg
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-10 pb-6 flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate({
        to: "/"
      }), className: "p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 24, style: {
        color: textPrimary
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold flex-1 text-center", style: {
        color: textPrimary
      }, children: "Notifications" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 relative", children: unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold", style: {
        background: "#FF4D6A",
        color: "#FFFFFF"
      }, children: unreadCount }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["all", "unread"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setFilter(f), className: "px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2 capitalize", style: {
        background: filter === f ? "#38BDF8" : theme === "dark" ? "#1A2438" : "#f3f4f6",
        color: filter === f ? "#0B1120" : textMuted
      }, children: [
        f,
        f === "unread" && unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1.5 py-0.5 rounded-full text-xs font-bold", style: {
          background: theme === "dark" ? "#1E2D45" : "#d1d5db"
        }, children: unreadCount })
      ] }, f)) }),
      unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: markAllRead, className: "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full", style: {
        background: "rgba(56,189,248,0.1)",
        color: "#38BDF8"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 12 }),
        "Mark all read"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 flex-1 space-y-3 overflow-y-auto", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12", style: {
      color: textMuted
    }, children: "Loading..." }) : filteredNotifications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center py-16 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full flex items-center justify-center", style: {
        background: theme === "dark" ? "#1A2438" : "#f3f4f6"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 28, style: {
        color: "#8A9BB5"
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
        color: textMuted
      }, children: filter === "unread" ? "All caught up!" : "No notifications yet." })
    ] }) : filteredNotifications.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full flex items-start gap-3 p-4 rounded-2xl transition-all cursor-pointer hover:opacity-90 active:scale-[0.99]", style: {
      background: cardBg,
      borderLeft: n.status === "unread" ? "3px solid #38BDF8" : "3px solid transparent"
    }, onClick: () => handleClick(n), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", style: {
        background: getIconBg(n.type)
      }, children: getIcon(n.type) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold truncate", style: {
            color: textPrimary
          }, children: n.title }),
          n.status === "unread" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2.5 h-2.5 rounded-full flex-shrink-0 ml-2", style: {
            background: "#38BDF8"
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mb-1", style: {
          color: textMuted
        }, children: n.message }),
        n.declineReason && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold", style: {
          color: "#FF4D6A"
        }, children: [
          "Reason: ",
          n.declineReason
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", style: {
          color: textMuted
        }, children: n.createdAt?.toLocaleString() || "Just now" })
      ] })
    ] }, n.id)) }),
    selectedNotif && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/50", onClick: () => setSelectedNotif(null) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full rounded-t-[28px] p-6 max-h-[85vh] overflow-y-auto", style: {
        background: theme === "dark" ? "#111827" : "#ffffff"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-1 rounded-full mx-auto mb-5", style: {
          background: "#1E2D45"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0", style: {
            background: getIconBg(selectedNotif.type)
          }, children: getIcon(selectedNotif.type) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-base", style: {
              color: textPrimary
            }, children: selectedNotif.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: {
              color: textMuted
            }, children: selectedNotif.createdAt?.toLocaleString() || "Just now" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mb-4", style: {
          color: textMuted
        }, children: selectedNotif.message }),
        selectedNotif.declineReason && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 p-3 rounded-xl", style: {
          background: "rgba(255,77,106,0.08)",
          border: "1px solid rgba(255,77,106,0.2)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold mb-1", style: {
            color: "#FF4D6A"
          }, children: "Decline Reason" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: {
            color: "#FF4D6A"
          }, children: selectedNotif.declineReason })
        ] }),
        relatedTx ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl overflow-hidden border", style: {
          borderColor: "rgba(255,255,255,0.08)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-2.5", style: {
            background: theme === "dark" ? "#070B14" : "#f9fafb"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider", style: {
            color: textMuted
          }, children: "Transaction Details" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-3 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mb-1", style: {
                color: textMuted
              }, children: "Amount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-3xl font-mono font-bold", style: {
                color: textPrimary
              }, children: [
                "$",
                formatCurrency(relatedTx.amount || selectedNotif.amount || 0)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-semibold", style: {
                background: relatedTx.status === "approved" ? "rgba(0,230,118,0.12)" : relatedTx.status === "declined" ? "rgba(255,77,106,0.12)" : "rgba(255,171,0,0.12)",
                color: relatedTx.status === "approved" ? "#00E676" : relatedTx.status === "declined" ? "#FF4D6A" : "#FFAB00"
              }, children: [
                relatedTx.status === "approved" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 11 }),
                relatedTx.status === "declined" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 11 }),
                relatedTx.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 11 }),
                relatedTx.status?.charAt(0).toUpperCase() + relatedTx.status?.slice(1)
              ] })
            ] }),
            [{
              label: "Type",
              value: relatedTx.type?.replace(/_/g, " ")
            }, {
              label: "From Account",
              value: relatedTx.fundingAccount
            }, ...relatedTx.toAccount ? [{
              label: "To Account",
              value: relatedTx.toAccount
            }] : [], ...relatedTx.recipientName ? [{
              label: "Recipient",
              value: relatedTx.recipientName
            }] : [], ...relatedTx.toBank ? [{
              label: "Bank",
              value: relatedTx.toBank
            }] : [], ...relatedTx.toCountry ? [{
              label: "Country",
              value: relatedTx.toCountry
            }] : [], ...relatedTx.purpose ? [{
              label: "Purpose",
              value: relatedTx.purpose
            }] : [], ...relatedTx.note ? [{
              label: "Note",
              value: relatedTx.note
            }] : [], {
              label: "Reference",
              value: relatedTx.transactionRef || relatedTx.id
            }, {
              label: "Date",
              value: relatedTx.createdAt instanceof Date ? relatedTx.createdAt.toLocaleString() : "-"
            }, ...relatedTx.reviewedAt instanceof Date ? [{
              label: "Reviewed",
              value: relatedTx.reviewedAt.toLocaleString()
            }] : [], ...relatedTx.balanceAfter != null ? [{
              label: "Balance After",
              value: `$${formatCurrency(relatedTx.balanceAfter)}`
            }] : []].map(({
              label,
              value
            }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between py-1.5 border-b", style: {
              borderColor: "rgba(255,255,255,0.05)"
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", style: {
                color: textMuted
              }, children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-right capitalize max-w-[55%] break-words", style: {
                color: textPrimary
              }, children: value })
            ] }, label))
          ] })
        ] }) : selectedNotif.transactionId ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-6", style: {
          color: textMuted
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Transaction details unavailable" }) }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            setSelectedNotif(null);
            navigate({
              to: "/transactions"
            });
          }, className: "py-4 rounded-xl font-semibold text-sm", style: {
            background: "linear-gradient(135deg, #00C6FF, #7B2FFF)",
            color: "#FFFFFF"
          }, children: "View History" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedNotif(null), className: "py-4 rounded-xl font-semibold text-sm", style: {
            background: theme === "dark" ? "#1A2438" : "#f3f4f6",
            color: textMuted
          }, children: "Close" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, { active: "notifications" })
  ] });
}
export {
  Notifications as component
};
