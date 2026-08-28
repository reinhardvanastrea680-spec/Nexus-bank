import {
  doc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { logAdminAction } from "../../utils/logAdminAction";

export async function deleteUserAndData(userId: string, userFullName: string) {
  const batch = writeBatch(db);

  // Delete user document
  batch.delete(doc(db, "users", userId));

  // Delete all their transactions
  const txQuery = query(collection(db, "transactions"), where("userId", "==", userId));
  const txSnap = await getDocs(txQuery);
  txSnap.forEach((d) => batch.delete(d.ref));

  await batch.commit();

  await logAdminAction(
    "USER_DELETED",
    `Deleted account and all data for ${userFullName}`,
    userId,
    userFullName,
    {}
  );
}
