import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { generateTransactionRef } from "../../utils/generateAccountNumber";
import { logAdminAction } from "../../utils/logAdminAction";
import { createNotification } from "../../utils/createNotification";
import { ADMIN_UID } from "../../config/adminConfig";

interface PostTransactionParams {
  userId: string;
  userFullName: string;
  account: "checking" | "savings";
  type: "credit" | "debit";
  amount: number;
  description: string;
  category?: string;
  adminNote?: string;
  currentBalance: number;
}

export async function postTransaction({
  userId,
  userFullName,
  account,
  type,
  amount,
  description,
  category = "Admin Adjustment",
  adminNote = "",
  currentBalance,
}: PostTransactionParams): Promise<string> {
  const balanceField = account === "checking" ? "checkingBalance" : "savingsBalance";
  const balanceDelta = type === "credit" ? amount : -amount;
  const balanceAfter = currentBalance + balanceDelta;
  const txRef = generateTransactionRef();

  // ── STEP 1: Update user balance (most critical — do this first) ───────────
  await updateDoc(doc(db, "users", userId), {
    [balanceField]: increment(balanceDelta),
    totalBalance: increment(balanceDelta),
    lastBalanceUpdatedAt: serverTimestamp(),
    lastBalanceUpdatedBy: "admin",
  });

  // ── STEP 2: Write transaction record ─────────────────────────────────────
  const txDocRef = await addDoc(collection(db, "transactions"), {
    userId,
    userFullName,
    account,
    type,
    amount,
    fundingAccount: account,
    description,
    category,
    adminNote,
    balanceAfter,
    createdAt: serverTimestamp(),
    date: new Date(),
    createdByAdmin: true,
    transactionRef: txRef,
    status: "approved",
  });

  const txId = txDocRef.id;

  // ── STEP 3: Notify the user ───────────────────────────────────────────────
  try {
    const amountStr = amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    await createNotification({
      recipientId: userId,
      recipientType: "user",
      type: type === "credit" ? "admin_credit" : "admin_debit",
      title: type === "credit" ? "Funds Added to Your Account ✓" : "Funds Deducted from Your Account",
      message:
        type === "credit"
          ? `${amountStr} has been credited to your ${account} account by the admin. ${description ? `Reason: ${description}` : ""}`
          : `${amountStr} has been debited from your ${account} account by the admin. ${description ? `Reason: ${description}` : ""}`,
      transactionId: txId,
      userId,
      userFullName,
      amount,
      transactionType: type === "credit" ? "admin_credit" : "admin_debit",
    });
  } catch (err) {
    console.error("User notification failed (non-critical):", err);
  }

  // ── STEP 4: Notify the admin ──────────────────────────────────────────────
  try {
    const amountStr = amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    await createNotification({
      recipientId: ADMIN_UID,
      recipientType: "admin",
      type: type === "credit" ? "admin_credit" : "admin_debit",
      title: type === "credit" ? "Funds Added" : "Funds Deducted",
      message: `${amountStr} ${type === "credit" ? "credited to" : "debited from"} ${userFullName}'s ${account} account. ${description ? `(${description})` : ""}`,
      transactionId: txId,
      userId,
      userFullName,
      amount,
      transactionType: type === "credit" ? "admin_credit" : "admin_debit",
    });
  } catch (err) {
    console.error("Admin notification failed (non-critical):", err);
  }

  // ── STEP 5: Log admin action ──────────────────────────────────────────────
  await logAdminAction(
    type === "credit" ? "BALANCE_CREDITED" : "BALANCE_DEBITED",
    `${type === "credit" ? "Credited" : "Debited"} $${amount.toFixed(2)} ${type === "credit" ? "to" : "from"} ${userFullName}'s ${account} account`,
    userId,
    userFullName,
    { account, type, amount, description, balanceBefore: currentBalance, balanceAfter, txId },
  );

  return txId;
}
