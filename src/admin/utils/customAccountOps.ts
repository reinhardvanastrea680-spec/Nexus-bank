/**
 * Custom Account Operations
 * Handles create, balance-set, credit/debit, and delete for
 * admin-created custom accounts stored in the subcollection:
 *   users/{userId}/customAccounts/{accountId}
 */
import {
  collection, addDoc, doc, updateDoc, deleteDoc,
  serverTimestamp, increment, getDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { generateAccountNumber, generateTransactionRef } from "../../utils/generateAccountNumber";
import { logAdminAction } from "../../utils/logAdminAction";
import { createNotification } from "../../utils/createNotification";
import { ADMIN_UID } from "../../config/adminConfig";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface CustomAccount {
  id: string;
  name: string;
  balance: number;
  accountNumber: string;
  status: "active" | "frozen";
  createdAt: any;
}

// ── Create a new custom account ───────────────────────────────────────────────
export async function createCustomAccount(
  userId: string,
  userFullName: string,
  name: string,
  initialBalance: number,
): Promise<CustomAccount> {
  const accountNumber = generateAccountNumber();

  const docRef = await addDoc(collection(db, "users", userId, "customAccounts"), {
    name: name.trim(),
    balance: initialBalance,
    accountNumber,
    status: "active",
    createdAt: serverTimestamp(),
    createdByAdmin: true,
  });

  // Update user's totalBalance
  if (initialBalance > 0) {
    await updateDoc(doc(db, "users", userId), {
      totalBalance: increment(initialBalance),
      lastBalanceUpdatedAt: serverTimestamp(),
      lastBalanceUpdatedBy: "admin",
    });

    // Write an opening transaction
    await addDoc(collection(db, "transactions"), {
      userId,
      userFullName,
      account: name.trim().toLowerCase(),
      customAccountId: docRef.id,
      type: "credit",
      amount: initialBalance,
      fundingAccount: name.trim(),
      description: `${name.trim()} Account Opening Balance`,
      category: "Admin Adjustment",
      adminNote: "Custom account created by admin",
      balanceAfter: initialBalance,
      createdAt: serverTimestamp(),
      date: new Date(),
      createdByAdmin: true,
      transactionRef: generateTransactionRef(),
      status: "approved",
    });

    // Notify user
    await createNotification({
      recipientId: userId,
      recipientType: "user",
      type: "admin_credit",
      title: "New Account Created",
      message: `A new "${name.trim()}" account has been created for you with an opening balance of $${initialBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}.`,
      userId,
      userFullName,
      amount: initialBalance,
      transactionType: "admin_credit",
    });
  }

  await logAdminAction(
    "CUSTOM_ACCOUNT_CREATED",
    `Created custom account "${name.trim()}" for ${userFullName} with balance $${initialBalance.toFixed(2)}`,
    userId,
    userFullName,
    { accountId: docRef.id, name, initialBalance, accountNumber },
  );

  return { id: docRef.id, name: name.trim(), balance: initialBalance, accountNumber, status: "active", createdAt: new Date() };
}

// ── Set balance directly (no transaction record) ──────────────────────────────
export async function setCustomAccountBalance(
  userId: string,
  userFullName: string,
  accountId: string,
  accountName: string,
  newBalance: number,
  oldBalance: number,
): Promise<void> {
  const delta = newBalance - oldBalance;

  await updateDoc(doc(db, "users", userId, "customAccounts", accountId), {
    balance: newBalance,
    lastUpdatedAt: serverTimestamp(),
    lastUpdatedBy: "admin",
  });

  await updateDoc(doc(db, "users", userId), {
    totalBalance: increment(delta),
    lastBalanceUpdatedAt: serverTimestamp(),
    lastBalanceUpdatedBy: "admin",
  });

  await createNotification({
    recipientId: userId,
    recipientType: "user",
    type: "balance_override",
    title: "Account Balance Updated",
    message: `Your ${accountName} account balance has been updated to $${newBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })} by the admin.`,
    userId,
    userFullName,
    amount: newBalance,
    transactionType: "balance_override",
  });

  await logAdminAction(
    "CUSTOM_BALANCE_OVERRIDE",
    `Set "${accountName}" balance for ${userFullName} from $${oldBalance.toFixed(2)} to $${newBalance.toFixed(2)}`,
    userId,
    userFullName,
    { accountId, accountName, oldBalance, newBalance, delta },
  );
}

// ── Credit or debit (logs a transaction) ─────────────────────────────────────
export async function postCustomAccountTransaction(
  userId: string,
  userFullName: string,
  accountId: string,
  accountName: string,
  type: "credit" | "debit",
  amount: number,
  description: string,
  currentBalance: number,
): Promise<void> {
  const balanceDelta = type === "credit" ? amount : -amount;
  const balanceAfter = currentBalance + balanceDelta;
  const txRef = generateTransactionRef();

  // Update subcollection balance
  await updateDoc(doc(db, "users", userId, "customAccounts", accountId), {
    balance: increment(balanceDelta),
    lastUpdatedAt: serverTimestamp(),
    lastUpdatedBy: "admin",
  });

  // Update user totalBalance
  await updateDoc(doc(db, "users", userId), {
    totalBalance: increment(balanceDelta),
    lastBalanceUpdatedAt: serverTimestamp(),
    lastBalanceUpdatedBy: "admin",
  });

  // Write transaction record
  const txDocRef = await addDoc(collection(db, "transactions"), {
    userId,
    userFullName,
    account: accountName.toLowerCase(),
    customAccountId: accountId,
    type,
    amount,
    fundingAccount: accountName,
    description: description || (type === "credit" ? "Admin Credit" : "Admin Debit"),
    category: "Admin Adjustment",
    adminNote: `Manual ${type} by admin`,
    balanceAfter,
    createdAt: serverTimestamp(),
    date: new Date(),
    createdByAdmin: true,
    transactionRef: txRef,
    status: "approved",
  });

  // Notify user
  const amountStr = amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
  await createNotification({
    recipientId: userId,
    recipientType: "user",
    type: type === "credit" ? "admin_credit" : "admin_debit",
    title: type === "credit" ? "Funds Added to Your Account ✓" : "Funds Deducted from Your Account",
    message: type === "credit"
      ? `${amountStr} has been credited to your ${accountName} account by the admin.${description ? ` Reason: ${description}` : ""}`
      : `${amountStr} has been debited from your ${accountName} account by the admin.${description ? ` Reason: ${description}` : ""}`,
    transactionId: txDocRef.id,
    userId,
    userFullName,
    amount,
    transactionType: type === "credit" ? "admin_credit" : "admin_debit",
  });

  await logAdminAction(
    type === "credit" ? "CUSTOM_BALANCE_CREDITED" : "CUSTOM_BALANCE_DEBITED",
    `${type === "credit" ? "Credited" : "Debited"} $${amount.toFixed(2)} ${type === "credit" ? "to" : "from"} ${userFullName}'s "${accountName}" account`,
    userId,
    userFullName,
    { accountId, accountName, type, amount, description, balanceBefore: currentBalance, balanceAfter },
  );
}

// ── Rename a custom account ───────────────────────────────────────────────────
export async function renameCustomAccount(
  userId: string,
  userFullName: string,
  accountId: string,
  newName: string,
): Promise<void> {
  await updateDoc(doc(db, "users", userId, "customAccounts", accountId), {
    name: newName.trim(),
    lastUpdatedAt: serverTimestamp(),
    lastUpdatedBy: "admin",
  });

  await logAdminAction(
    "CUSTOM_ACCOUNT_RENAMED",
    `Renamed custom account to "${newName.trim()}" for ${userFullName}`,
    userId,
    userFullName,
    { accountId, newName },
  );
}

// ── Toggle account status (active / frozen) ───────────────────────────────────
export async function setCustomAccountStatus(
  userId: string,
  userFullName: string,
  accountId: string,
  accountName: string,
  status: "active" | "frozen",
): Promise<void> {
  await updateDoc(doc(db, "users", userId, "customAccounts", accountId), {
    status,
    lastUpdatedAt: serverTimestamp(),
    lastUpdatedBy: "admin",
  });

  await logAdminAction(
    "CUSTOM_ACCOUNT_STATUS",
    `Set "${accountName}" account status to ${status} for ${userFullName}`,
    userId,
    userFullName,
    { accountId, accountName, status },
  );
}

// ── Delete a custom account ───────────────────────────────────────────────────
export async function deleteCustomAccount(
  userId: string,
  userFullName: string,
  accountId: string,
  accountName: string,
  currentBalance: number,
): Promise<void> {
  // Remove balance from user total first
  if (currentBalance !== 0) {
    await updateDoc(doc(db, "users", userId), {
      totalBalance: increment(-currentBalance),
      lastBalanceUpdatedAt: serverTimestamp(),
      lastBalanceUpdatedBy: "admin",
    });
  }

  await deleteDoc(doc(db, "users", userId, "customAccounts", accountId));

  await logAdminAction(
    "CUSTOM_ACCOUNT_DELETED",
    `Deleted custom account "${accountName}" for ${userFullName} (balance was $${currentBalance.toFixed(2)})`,
    userId,
    userFullName,
    { accountId, accountName, finalBalance: currentBalance },
  );
}
