import { d as db } from "./router-8iYk_PDV.mjs";
import { b as addDoc, s as serverTimestamp, c as collection } from "../_libs/firebase__firestore.mjs";
async function createNotification({
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
  declineReason = null
}) {
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
    readAt: null
  });
}
export {
  createNotification as c
};
