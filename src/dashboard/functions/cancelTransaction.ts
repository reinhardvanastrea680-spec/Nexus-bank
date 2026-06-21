import {
  doc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../../firebase/config";

export async function cancelTransaction(transactionId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated.");

  const txRef = doc(db, "transactions", transactionId);

  await updateDoc(txRef, {
    status: "cancelled",
    updatedAt: serverTimestamp(),
    statusHistory: arrayUnion({
      status: "cancelled",
      timestamp: new Date(),
      changedBy: "user",
      changedById: user.uid,
      reason: "Cancelled by user",
    }),
  });
}
