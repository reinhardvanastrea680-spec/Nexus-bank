import { d as doc, e as getDoc, i as increment, u as updateDoc, l as arrayUnion, s as serverTimestamp } from "../_libs/firebase__firestore.mjs";
import { a as auth, d as db } from "./router-8iYk_PDV.mjs";
import { c as createNotification } from "./createNotification-Cw-Zxf1P.mjs";
import { l as logAdminAction } from "./logAdminAction-DVr4geeY.mjs";
import { f as formatCurrency } from "./formatCurrency-vYScEN6G.mjs";
async function approveTransaction(transactionId) {
  const adminUser = auth.currentUser;
  if (!adminUser) throw new Error("Admin not authenticated.");
  const txRef = doc(db, "transactions", transactionId);
  const txSnap = await getDoc(txRef);
  if (!txSnap.exists()) throw new Error("Transaction not found.");
  const tx = txSnap.data();
  if (tx.status !== "pending") throw new Error("Transaction is no longer pending.");
  const userRef = doc(db, "users", tx.userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) throw new Error("User not found.");
  const userData = userSnap.data();
  const balanceField = tx.fundingAccount === "checking" ? "checkingBalance" : "savingsBalance";
  const currentBalance = userData[balanceField];
  if (tx.amount > currentBalance) {
    throw new Error(
      `Insufficient funds. Current ${tx.fundingAccount} balance is ${formatCurrency(currentBalance)}.`
    );
  }
  const newBalance = currentBalance - tx.amount;
  const userUpdate = {
    [balanceField]: increment(-tx.amount),
    lastBalanceUpdatedAt: serverTimestamp(),
    lastBalanceUpdatedBy: "admin"
  };
  if (tx.type === "internal_transfer" && tx.toAccount) {
    const toAcctNorm = String(tx.toAccount).toLowerCase().trim();
    const toBalanceField = toAcctNorm === "checking" ? "checkingBalance" : "savingsBalance";
    userUpdate[toBalanceField] = increment(tx.amount);
  } else {
    userUpdate.totalBalance = increment(-tx.amount);
  }
  await updateDoc(userRef, userUpdate);
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
      timestamp: /* @__PURE__ */ new Date(),
      changedBy: "admin",
      changedById: adminUser.uid,
      reason: ""
    })
  });
  const approvalMessage = tx.type === "internal_transfer" && tx.toAccount ? `Your internal transfer of ${formatCurrency(tx.amount)} from ${tx.fundingAccount} to ${tx.toAccount} has been approved.` : `Your ${tx.type.replace(/_/g, " ")} of ${formatCurrency(tx.amount)} has been approved. Your ${tx.fundingAccount} account has been debited.`;
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
    transactionType: tx.type
  });
  await updateDoc(txRef, { userNotifiedOfResult: true });
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
      balanceAfter: newBalance
    }
  );
}
async function declineTransaction(transactionId, declineReason) {
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
  await updateDoc(txRef, {
    status: "declined",
    declineReason: declineReason.trim(),
    reviewedByAdminId: adminUser.uid,
    reviewedByAdminName: adminUser.displayName ?? "Admin",
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    statusHistory: arrayUnion({
      status: "declined",
      timestamp: /* @__PURE__ */ new Date(),
      changedBy: "admin",
      changedById: adminUser.uid,
      reason: declineReason.trim()
    })
  });
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
    declineReason: declineReason.trim()
  });
  await updateDoc(txRef, { userNotifiedOfResult: true });
  await logAdminAction(
    "TRANSACTION_DECLINED",
    `Declined ${tx.type.replace(/_/g, " ")} of ${formatCurrency(tx.amount)} for ${tx.userFullName}`,
    tx.userId,
    tx.userFullName,
    {
      transactionId,
      amount: tx.amount,
      fundingAccount: tx.fundingAccount,
      declineReason: declineReason.trim()
    }
  );
}
export {
  approveTransaction as a,
  declineTransaction as d
};
