import { d as db, a as auth } from "./router-8iYk_PDV.mjs";
import { b as addDoc, c as collection, s as serverTimestamp } from "../_libs/firebase__firestore.mjs";
async function logAdminAction(action, description, targetUserId = null, targetUserName = null, meta = {}) {
  try {
    await addDoc(collection(db, "adminActivityLog"), {
      action,
      description,
      targetUserId,
      targetUserName,
      meta,
      timestamp: serverTimestamp(),
      adminId: auth.currentUser?.uid ?? "admin"
    });
  } catch (err) {
    console.error("Activity log write failed:", err);
  }
}
export {
  logAdminAction as l
};
