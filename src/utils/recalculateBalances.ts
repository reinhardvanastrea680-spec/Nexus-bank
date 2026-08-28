import { db } from "../firebase/config";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";

export async function recalculateBalances(
  userId: string,
  account: "checking" | "savings",
): Promise<void> {
  // Get user document
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    throw new Error("User not found");
  }

  // Get all transactions for this account sorted by date
  const transactionsRef = collection(db, "transactions");
  const q = query(
    transactionsRef,
    where("userId", "==", userId),
    where("account", "==", account),
    orderBy("date", "asc"),
  );

  const querySnapshot = await getDocs(q);

  let currentBalance = 0;

  // Recalculate balance by processing each transaction in order
  for (const docSnap of querySnapshot.docs) {
    const tx = docSnap.data();
    if (tx.type === "deposit") {
      currentBalance += tx.amount;
    } else if (tx.type === "withdraw" || tx.type === "transfer" || tx.type === "payment") {
      currentBalance -= tx.amount;
    }

    // Update transaction's balanceAfter
    await updateDoc(docSnap.ref, { balanceAfter: currentBalance });
  }

  // Update user's current balance
  const balanceField = account === "checking" ? "checkingBalance" : "savingsBalance";

  await updateDoc(userRef, {
    [balanceField]: currentBalance,
    lastBalanceUpdatedAt: new Date(),
    lastBalanceUpdatedBy: "admin",
  });
}
