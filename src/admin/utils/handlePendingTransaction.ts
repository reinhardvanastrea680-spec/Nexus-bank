import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { generateTransactionRef } from "../../utils/generateAccountNumber";
import { logAdminAction } from "../../utils/logAdminAction";
import { createUserNotification } from "../../utils/notifications";

interface ApprovePendingTransactionParams {
  pendingTxId: string;
  txData: any;
  adminNote?: string;
}

export async function approvePendingTransaction({
  pendingTxId,
  txData,
  adminNote = "",
}: ApprovePendingTransactionParams) {
  const {
    userId,
    userFullName,
    fromAccount,
    toAccount,
    toBank,
    toCountry,
    toAccountNumber,
    toSwiftCode,
    toRoutingNumber,
    recipientName,
    amount,
    fiatAmount,
    cryptoAmount,
    cryptoSymbol,
    cryptoId,
    priceAtTime,
    fee,
    toCurrency,
    purpose,
    fromAccountBalanceBefore,
    note,
    type,
  } = txData;

  // For crypto purchase, use fiatAmount as amount, otherwise use amount
  const actualAmount = type === "crypto_purchase" ? fiatAmount || 0 : amount || 0;

  // Get fresh user data to ensure we have current balances
  const userDoc = await getDoc(doc(db, "users", userId));
  if (!userDoc.exists()) {
    throw new Error("User not found");
  }

  const userData = userDoc.data();
  const fromBalanceField = fromAccount === "Checking" ? "checkingBalance" : "savingsBalance";
  const totalAmount = type === "wire-transfer" ? (amount || 0) + (fee || 0) : actualAmount;

  const fromCurrentBalance = userData[fromBalanceField] || 0;
  if (fromCurrentBalance < totalAmount) {
    throw new Error("Insufficient funds for this transfer");
  }

  // Calculate new from balance
  const newFromBalance = fromCurrentBalance - totalAmount;

  // Create transactions
  const transactionsCol = collection(db, "transactions");

  let finalTransactionId: string | null = null;

  if (type === "internal_transfer") {
    // Internal transfer needs both debit and credit
    const toBalanceField = toAccount === "Checking" ? "checkingBalance" : "savingsBalance";
    const newToBalance = (userData[toBalanceField] || 0) + amount;

    // Debit transaction
    const debitDocRef = await addDoc(transactionsCol, {
      userId,
      userFullName,
      account: fromAccount.toLowerCase() as "checking" | "savings",
      type: "debit",
      amount,
      description: `Internal transfer to ${toAccount} account${note ? ` - ${note}` : ""}`,
      balanceAfter: newFromBalance,
      adminNote,
      createdAt: serverTimestamp(),
      createdByAdmin: true,
      transactionRef: generateTransactionRef(),
      transactionType: "internal_transfer",
      status: "completed",
    });

    finalTransactionId = debitDocRef.id;

    // Credit transaction
    await addDoc(transactionsCol, {
      userId,
      userFullName,
      account: toAccount.toLowerCase() as "checking" | "savings",
      type: "credit",
      amount,
      description: `Internal transfer from ${fromAccount} account${note ? ` - ${note}` : ""}`,
      balanceAfter: newToBalance,
      adminNote,
      createdAt: serverTimestamp(),
      createdByAdmin: true,
      transactionRef: generateTransactionRef(),
      transactionType: "internal_transfer",
      status: "completed",
    });

    // Update both balances
    await updateDoc(doc(db, "users", userId), {
      [fromBalanceField]: newFromBalance,
      [toBalanceField]: newToBalance,
      lastBalanceUpdatedAt: serverTimestamp(),
      lastBalanceUpdatedBy: "admin",
    });
  } else if (type === "wire-transfer") {
    // Wire transfer - debit with fee
    const debitDocRef = await addDoc(transactionsCol, {
      userId,
      userFullName,
      account: fromAccount.toLowerCase() as "checking" | "savings",
      type: "debit",
      amount: totalAmount,
      description: `Wire transfer to ${recipientName} (${toBank || ""}, ${toCountry || ""})${purpose ? ` - ${purpose}` : ""}`,
      balanceAfter: newFromBalance,
      adminNote,
      createdAt: serverTimestamp(),
      createdByAdmin: true,
      transactionRef: generateTransactionRef(),
      transactionType: "wire-transfer",
      toBank,
      toCountry,
      toAccountNumber,
      toSwiftCode,
      toRoutingNumber,
      recipientName,
      fee,
      toCurrency,
      purpose,
      status: "completed",
    });

    finalTransactionId = debitDocRef.id;

    // Update only from balance
    await updateDoc(doc(db, "users", userId), {
      [fromBalanceField]: newFromBalance,
      lastBalanceUpdatedAt: serverTimestamp(),
      lastBalanceUpdatedBy: "admin",
    });
  } else if (type === "crypto_purchase") {
    // Crypto purchase - debit
    const debitDocRef = await addDoc(transactionsCol, {
      userId,
      userFullName,
      account: fromAccount.toLowerCase() as "checking" | "savings",
      type: "debit",
      amount: totalAmount,
      description: `Purchased ${cryptoAmount} ${cryptoSymbol} for $${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      balanceAfter: newFromBalance,
      adminNote,
      createdAt: serverTimestamp(),
      createdByAdmin: true,
      transactionRef: generateTransactionRef(),
      transactionType: "crypto_purchase",
      cryptoId,
      cryptoSymbol,
      cryptoAmount,
      priceAtTime,
      fiatAmount,
      status: "completed",
    });

    finalTransactionId = debitDocRef.id;

    // Update only from balance
    await updateDoc(doc(db, "users", userId), {
      [fromBalanceField]: newFromBalance,
      lastBalanceUpdatedAt: serverTimestamp(),
      lastBalanceUpdatedBy: "admin",
    });
  } else {
    // Local transfer or other types - just debit
    const debitDocRef = await addDoc(transactionsCol, {
      userId,
      userFullName,
      account: fromAccount.toLowerCase() as "checking" | "savings",
      type: "debit",
      amount,
      description: `${type === "local_transfer" ? "Local transfer" : "Transfer"} to ${recipientName} (${toBank || ""} - ${toAccountNumber || ""})${note ? ` - ${note}` : ""}`,
      balanceAfter: newFromBalance,
      adminNote,
      createdAt: serverTimestamp(),
      createdByAdmin: true,
      transactionRef: generateTransactionRef(),
      transactionType: type,
      toBank,
      toAccountNumber,
      recipientName,
      status: "completed",
    });

    finalTransactionId = debitDocRef.id;

    // Update only from balance
    await updateDoc(doc(db, "users", userId), {
      [fromBalanceField]: newFromBalance,
      lastBalanceUpdatedAt: serverTimestamp(),
      lastBalanceUpdatedBy: "admin",
    });
  }

  // Send user notification for approval
  await createUserNotification({
    userId,
    type: "transaction_approved",
    title: "Transaction Approved",
    message: `Your ${type} of $${actualAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} has been approved.`,
    transactionId: finalTransactionId ?? undefined,
  });

  // Delete pending transaction
  await deleteDoc(doc(db, "pendingTransactions", pendingTxId));

  await logAdminAction(
    "PENDING_TRANSACTION_APPROVED",
    `Approved ${type} of $${actualAmount.toFixed(2)} for ${userFullName}`,
    userId,
    userFullName,
    {
      txId: pendingTxId,
      fromAccount,
      toAccount,
      toBank,
      toCountry,
      toAccountNumber,
      recipientName,
      amount: actualAmount,
      cryptoId,
      cryptoSymbol,
      cryptoAmount,
      adminNote,
    },
  );
}

interface RejectPendingTransactionParams {
  pendingTxId: string;
  txData: any;
  adminNote?: string;
}

export async function rejectPendingTransaction({
  pendingTxId,
  txData,
  adminNote = "",
}: RejectPendingTransactionParams) {
  const { userId, userFullName, amount, fiatAmount, type } = txData;
  const actualAmount = type === "crypto_purchase" ? fiatAmount || 0 : amount || 0;

  // Send user notification for decline
  await createUserNotification({
    userId,
    type: "transaction_declined",
    title: "Transaction Declined",
    message: `Your ${type} of $${actualAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} has been declined. ${adminNote ? `Reason: ${adminNote}` : ""}`,
  });

  // Delete pending transaction
  await deleteDoc(doc(db, "pendingTransactions", pendingTxId));

  await logAdminAction(
    "PENDING_TRANSACTION_REJECTED",
    `Rejected ${type} of $${actualAmount.toFixed(2)} for ${userFullName}`,
    userId,
    userFullName,
    { txId: pendingTxId, adminNote },
  );
}
