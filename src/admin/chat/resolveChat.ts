import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { logAdminAction } from "../../utils/logAdminAction";

export async function resolveChat(
  chatId: string,
  targetName: string,
  targetUserId: string | null = null
) {
  await updateDoc(doc(db, "chats", chatId), {
    status: "resolved",
    resolvedAt: serverTimestamp()
  });

  await logAdminAction(
    "CHAT_RESOLVED",
    `Resolved conversation with ${targetName}`,
    targetUserId,
    targetName,
    { chatId }
  );
}