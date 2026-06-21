import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

let adminTypingTimer: NodeJS.Timeout | null = null;

export function handleAdminTyping(chatId: string) {
  updateDoc(doc(db, "chats", chatId), { isTypingAdmin: true });

  if (adminTypingTimer) clearTimeout(adminTypingTimer);
  adminTypingTimer = setTimeout(() => {
    updateDoc(doc(db, "chats", chatId), { isTypingAdmin: false });
  }, 2000);
}