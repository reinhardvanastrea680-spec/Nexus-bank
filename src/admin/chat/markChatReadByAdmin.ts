import { db } from "../../firebase/config";
import {
  collection, getDocs, writeBatch, doc, updateDoc
} from "firebase/firestore";

export async function markChatReadByAdmin(chatId: string) {
  // Reset unread count on the chat document
  await updateDoc(doc(db, "chats", chatId), {
    unreadByAdmin: 0
  });

  // Mark all messages as readByAdmin
  const messagesSnap = await getDocs(
    collection(db, "chats", chatId, "messages")
  );
  const batch = writeBatch(db);
  messagesSnap.forEach(d => {
    batch.update(d.ref, { readByAdmin: true });
  });
  await batch.commit();
}