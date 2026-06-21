import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { ADMIN_UID } from "../../config/adminConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export interface AdminNotification {
  id: string;
  recipientId: string;
  recipientType: "admin" | "user";
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

export function useAdminNotifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      where("recipientId", "==", ADMIN_UID),
      where("recipientType", "==", "admin"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() ?? new Date(),
        readAt: doc.data().readAt?.toDate() ?? null,
      })) as AdminNotification[];

      // Sort newest first client-side
      notifs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      setNotifications(notifs);
      setUnreadCount(notifs.filter((n) => n.status === "unread").length);
    });

    return unsubscribe;
  }, []);

  async function markRead(notificationId: string) {
    await updateDoc(doc(db, "notifications", notificationId), {
      status: "read",
      readAt: serverTimestamp(),
    });
  }

  async function markAllRead() {
    const unread = notifications.filter((n) => n.status === "unread");
    await Promise.all(unread.map((n) => markRead(n.id)));
  }

  return { notifications, unreadCount, markRead, markAllRead };
}
