import { db } from "../../firebase/config";
import {
  collection, addDoc, doc, updateDoc,
  serverTimestamp, increment
} from "firebase/firestore";
import { logAdminAction } from "../../utils/logAdminAction";

export async function sendAdminReply(
  chatId: string,
  text: string,
  targetName: string,
  targetUserId: string | null = null
) {
  // 1. Add message to subcollection
  await addDoc(collection(db, "chats", chatId, "messages"), {
    sender: "admin",
    text,
    timestamp: serverTimestamp(),
    readByAdmin: true,
    readByUser: false
  });

  // 2. Update chat document
  await updateDoc(doc(db, "chats", chatId), {
    lastMessage: text,
    lastMessageAt: serverTimestamp(),
    unreadByUser: increment(1),
    isTypingAdmin: false
  });

  // 3. Log the action
  await logAdminAction(
    "CHAT_REPLIED",
    `Admin replied to ${targetName}`,
    targetUserId,
    targetName,
    { chatId, replyPreview: text.substring(0, 60) }
  );
}