import { r as reactExports } from "../_libs/react.mjs";
import { d as db } from "./router-8iYk_PDV.mjs";
import { A as ADMIN_UID } from "./adminConfig-D-CDJgKq.mjs";
import { q as query, w as where, c as collection, o as onSnapshot, u as updateDoc, s as serverTimestamp, d as doc } from "../_libs/firebase__firestore.mjs";
function useAdminNotifications() {
  const [notifications, setNotifications] = reactExports.useState([]);
  const [unreadCount, setUnreadCount] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      where("recipientId", "==", ADMIN_UID),
      where("recipientType", "==", "admin")
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
    });
    return unsubscribe;
  }, []);
  async function markRead(notificationId) {
    await updateDoc(doc(db, "notifications", notificationId), {
      status: "read",
      readAt: serverTimestamp()
    });
  }
  async function markAllRead() {
    const unread = notifications.filter((n) => n.status === "unread");
    await Promise.all(unread.map((n) => markRead(n.id)));
  }
  return { notifications, unreadCount, markRead, markAllRead };
}
export {
  useAdminNotifications as u
};
