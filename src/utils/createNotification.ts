import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface CreateNotificationParams {
  recipientId: string;
  recipientType: "admin" | "user";
  type:
    | "new_transaction"
    | "transaction_approved"
    | "transaction_declined"
    | "admin_credit"
    | "admin_debit"
    | "balance_override";
  title: string;
  message: string;
  transactionId?: string;
  userId: string;
  userFullName: string;
  amount: number;
  transactionType: string;
  declineReason?: string | null;
}

export async function createNotification({
  recipientId,
  recipientType,
  type,
  title,
  message,
  transactionId = "",
  userId,
  userFullName,
  amount,
  transactionType,
  declineReason = null,
}: CreateNotificationParams) {
  await addDoc(collection(db, "notifications"), {
    recipientId,
    recipientType,
    type,
    title,
    message,
    transactionId,
    userId,
    userFullName,
    amount,
    transactionType,
    status: "unread",
    declineReason,
    createdAt: serverTimestamp(),
    readAt: null,
  });
}
