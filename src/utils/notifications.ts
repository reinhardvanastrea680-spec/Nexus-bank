import {
  collection,
  addDoc,
  updateDoc,
  serverTimestamp,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/config";

export interface UserNotification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: "transaction_submitted" | "transaction_approved" | "transaction_declined" | "system" | "security";
  read: boolean;
  transactionId?: string;
  createdAt?: Date;
}

export async function createUserNotification(notification: Omit<UserNotification, "id" | "createdAt" | "read">) {
  const notificationsCol = collection(db, "notifications");
  const docRef = await addDoc(notificationsCol, {
    ...notification,
    read: false,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function markNotificationAsRead(notificationId: string) {
  const notificationDoc = doc(db, "notifications", notificationId);
  await updateDoc(notificationDoc, {
    read: true,
  });
}

export async function markAllUserNotificationsAsRead(userId: string) {
  // This would need a batch update in a real app, but for simplicity we'll leave this as a placeholder
}
