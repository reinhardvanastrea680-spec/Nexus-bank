import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { createNotification } from "../../utils/createNotification";
import { logAdminAction } from "../../utils/logAdminAction";
import { formatCurrency } from "../../utils/formatCurrency";

/**
 * Admin approves a pending transaction.
 * Deducts the balance from the user's funding account.
 * Updates transaction status to "approved".
 * Notifies the user.
 */
export async function approveTransaction(transactionId: string): Promise<void> {
  const adminUser = auth.currentUser;
  if (!adminUser) throw new Error("Admin not authenticated.");

  // Fetch the transaction
  const txRef = doc(db, "transactions", transactionId);
  const txSnap = await getDoc(txRef);
  if (!txSnap.exists()) throw new Error("Transaction not found.");

  const tx = txSnap.data();
  if (tx.status !== "pending") throw new Error("Transaction is no longer pending.");

  // Fetch the user's current balance
  const userRef = doc(db, "users", tx.userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) throw new Error("User not found.");

  const userData = userSnap.data();
  const balanceField =
    tx.fundingAccount === "checking" ? "checkingBalance" : "savingsBalance";
  const currentBalance = userData[balanceField];

  // Final balance check
  if (tx.amount > currentBalance) {
    throw new Error(
      `Insufficient funds. Current ${tx.fundingAccount} balance is ${formatCurrency(currentBalance)}.`
    );
  }

  const newBalance = currentBalance - tx.amount;

  // Deduct balance from user's funding account
  const userUpdate: Record<string, any> = {
    [balanceField]: increment(-tx.amount),
    lastBalanceUpdatedAt: serverTimestamp(),
    lastBalanceUpdatedBy: "admin",
  };

  // For internal transfers, also credit the destination account
  if (tx.type === "internal_transfer" && tx.toAccount) {
    const toAcctNorm = String(tx.toAccount).toLowerCase().trim();
    const toBalanceField =
      toAcctNorm === "checking" ? "checkingBalance" : "savingsBalance";
    userUpdate[toBalanceField] = increment(tx.amount);
    // totalBalance stays the same — money moves within the bank
  } else {
    // For external transfers, money leaves the bank — deduct from total
    userUpdate.totalBalance = increment(-tx.amount);
  }

  await updateDoc(userRef, userUpdate);

  // Update the transaction document
  await updateDoc(txRef, {
    status: "approved",
    balanceAfter: newBalance,
    reviewedByAdminId: adminUser.uid,
    reviewedByAdminName: adminUser.displayName ?? "Admin",
    reviewedAt: serverTimestamp(),
    userNotifiedOfResult: false,
    updatedAt: serverTimestamp(),
    statusHistory: arrayUnion({
      status: "approved",
      timestamp: new Date(),
      changedBy: "admin",
      changedById: adminUser.uid,
      reason: "",
    }),
  });

  // Notify the user
  const approvalMessage = tx.type === "internal_transfer" && tx.toAccount
    ? `Your internal transfer of ${formatCurrency(tx.amount)} from ${tx.fundingAccount} to ${tx.toAccount} has been approved.`
    : `Your ${tx.type.replace(/_/g, " ")} of ${formatCurrency(tx.amount)} has been approved. Your ${tx.fundingAccount} account has been debited.`;

  await createNotification({
    recipientId: tx.userId,
    recipientType: "user",
    type: "transaction_approved",
    title: "Transaction Approved ✓",
    message: approvalMessage,
    transactionId,
    userId: tx.userId,
    userFullName: tx.userFullName,
    amount: tx.amount,
    transactionType: tx.type,
  });

  // Mark userNotifiedOfResult
  await updateDoc(txRef, { userNotifiedOfResult: true });

  // Log admin action
  await logAdminAction(
    "TRANSACTION_APPROVED",
    `Approved ${tx.type.replace(/_/g, " ")} of ${formatCurrency(tx.amount)} for ${tx.userFullName}`,
    tx.userId,
    tx.userFullName,
    {
      transactionId,
      amount: tx.amount,
      fundingAccount: tx.fundingAccount,
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
    }
  );
}

/**
 * Admin declines a pending transaction.
 * Does NOT touch the user's balance.
 * Notifies the user with the reason.
 *
 * @param {string} transactionId
 * @param {string} declineReason - Required. Admin must provide a reason.
 */
export async function declineTransaction(transactionId: string, declineReason: string): Promise<void> {
  const adminUser = auth.currentUser;
  if (!adminUser) throw new Error("Admin not authenticated.");

  if (!declineReason || declineReason.trim().length < 5) {
    throw new Error("A decline reason of at least 5 characters is required.");
  }

  const txRef = doc(db, "transactions", transactionId);
  const txSnap = await getDoc(txRef);
  if (!txSnap.exists()) throw new Error("Transaction not found.");

  const tx = txSnap.data();
  if (tx.status !== "pending") throw new Error("Transaction is no longer pending.");

  // Update transaction status
  await updateDoc(txRef, {
    status: "declined",
    declineReason: declineReason.trim(),
    reviewedByAdminId: adminUser.uid,
    reviewedByAdminName: adminUser.displayName ?? "Admin",
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    statusHistory: arrayUnion({
      status: "declined",
      timestamp: new Date(),
      changedBy: "admin",
      changedById: adminUser.uid,
      reason: declineReason.trim(),
    }),
  });

  // Notify the user
  await createNotification({
    recipientId: tx.userId,
    recipientType: "user",
    type: "transaction_declined",
    title: "Transaction Declined",
    message: `Your ${tx.type.replace(/_/g, " ")} of ${formatCurrency(tx.amount)} was declined. Reason: ${declineReason.trim()}`,
    transactionId,
    userId: tx.userId,
    userFullName: tx.userFullName,
    amount: tx.amount,
    transactionType: tx.type,
    declineReason: declineReason.trim(),
  });

  await updateDoc(txRef, { userNotifiedOfResult: true });

  // Log admin action
  await logAdminAction(
    "TRANSACTION_DECLINED",
    `Declined ${tx.type.replace(/_/g, " ")} of ${formatCurrency(tx.amount)} for ${tx.userFullName}`,
    tx.userId,
    tx.userFullName,
    {
      transactionId,
      amount: tx.amount,
      fundingAccount: tx.fundingAccount,
      declineReason: declineReason.trim(),
    }
  );
}
