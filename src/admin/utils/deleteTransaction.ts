import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { recalculateBalances } from "../../utils/recalculateBalances";
import { logAdminAction } from "../../utils/logAdminAction";

export async function deleteTransaction(
  transactionId: string,
  userId: string,
  userFullName: string,
  account: "checking" | "savings"
) {
  await deleteDoc(doc(db, "transactions", transactionId));
  await recalculateBalances(userId, account);

  await logAdminAction(
    "TRANSACTION_DELETED",
    `Deleted transaction for ${userFullName}`,
    userId,
    userFullName,
    { transactionId }
  );
}