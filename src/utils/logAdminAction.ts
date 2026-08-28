import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "../firebase/config";

/**
 * Writes an entry to the adminActivityLog collection.
 * Called after every admin mutation.
 */
export async function logAdminAction(
  action: string,
  description: string,
  targetUserId: string | null = null,
  targetUserName: string | null = null,
  meta: Record<string, any> = {},
) {
  try {
    await addDoc(collection(db, "adminActivityLog"), {
      action,
      description,
      targetUserId,
      targetUserName,
      meta,
      timestamp: serverTimestamp(),
      adminId: auth.currentUser?.uid ?? "admin",
    });
  } catch (err) {
    // Log silently — never break the main flow over a log failure
    console.error("Activity log write failed:", err);
  }
}
