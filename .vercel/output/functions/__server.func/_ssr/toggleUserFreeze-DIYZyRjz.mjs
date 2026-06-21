import { u as updateDoc, d as doc } from "../_libs/firebase__firestore.mjs";
import { d as db } from "./router-8iYk_PDV.mjs";
import { l as logAdminAction } from "./logAdminAction-DVr4geeY.mjs";
async function toggleUserFreeze(userId, userFullName, currentStatus) {
  const newStatus = currentStatus === "active" ? "frozen" : "active";
  await updateDoc(doc(db, "users", userId), { status: newStatus });
  await logAdminAction(
    newStatus === "frozen" ? "USER_FROZEN" : "USER_UNFROZEN",
    `${newStatus === "frozen" ? "Froze" : "Unfroze"} account for ${userFullName}`,
    userId,
    userFullName,
    { previousStatus: currentStatus, newStatus }
  );
}
export {
  toggleUserFreeze as t
};
