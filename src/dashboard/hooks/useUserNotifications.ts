import { useState, useEffect } from "react";
import { db, auth } from "../../firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

export interface UserNotification {
  id: string;
  recipientId: string;
  recipientType: string;
  type: "new_transaction" | "transaction_approved" | "transaction_declined" | "admin_credit" | "admin_debit" | "balance_override";
  title: string;
  message: string;
  transactionId: string;
  userId: string;
  userFullName: string;
  amount: number;
  transactionType: string;
  status: "unread" | "read";
  declineReason?: string | null;
  createdAt: Date;
  readAt?: Date | null;
}

export function useUserNotifications() {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      where("recipientType", "==", "user"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Silently delete any presence/tracking notifications that slipped through to this user
      snapshot.docs.forEach((d) => {
        const n = d.data();
        const isPresence =
          n.transactionType === "presence" ||
          n.type === "user_activity" ||
          [
            "entered the app", "exited the app",
            "left the app", "signed out",
          ].some((p) => (n.title || "").toLowerCase().includes(p));
        if (isPresence) {
          deleteDoc(doc(db, "notifications", d.id)).catch(() => {});
        }
      });

      const notifs = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() ?? new Date(),
          readAt: doc.data().readAt?.toDate() ?? null,
        }))
        // Never show presence/tracking notifications to the user — those are admin-only
        // Multiple checks: type, transactionType, title pattern
        .filter((n: any) => {
          if (n.transactionType === "presence") return false;
          if (n.type === "user_activity") return false;
          const title = (n.title || "").toLowerCase();
          if (title.includes("entered the app") || title.includes("exited the app") ||
              title.includes("left the app") || title.includes("signed out")) return false;
          return true;
        }) as UserNotification[];

      // Sort newest first client-side
      notifs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      setNotifications(notifs);
      setUnreadCount(notifs.filter((n) => n.status === "unread").length);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function markNotificationRead(notificationId: string) {
    await updateDoc(doc(db, "notifications", notificationId), {
      status: "read",
      readAt: serverTimestamp(),
    });
  }

  async function markAllRead() {
    const unread = notifications.filter((n) => n.status === "unread");
    await Promise.all(unread.map((n) => markNotificationRead(n.id)));
  }

  return { notifications, unreadCount, loading, markNotificationRead, markAllRead };
}
