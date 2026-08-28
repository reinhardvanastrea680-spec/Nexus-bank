import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { recalculateBalances } from "../../utils/recalculateBalances";
import { logAdminAction } from "../../utils/logAdminAction";

export async function editTransaction(
  transactionId: string,
  userId: string,
  userFullName: string,
  account: "checking" | "savings",
  updatedFields: any
) {
  await updateDoc(doc(db, "transactions", transactionId), updatedFields);

  // Recalculate all balanceAfter values and live balance
  await recalculateBalances(userId, account);

  await logAdminAction(
    "TRANSACTION_EDITED",
    `Edited transaction for ${userFullName}`,
    userId,
    userFullName,
    { transactionId, updatedFields }
  );
}