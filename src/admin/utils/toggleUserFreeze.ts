import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { logAdminAction } from "../../utils/logAdminAction";

export async function toggleUserFreeze(
  userId: string,
  userFullName: string,
  currentStatus: "active" | "frozen"
) {
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
