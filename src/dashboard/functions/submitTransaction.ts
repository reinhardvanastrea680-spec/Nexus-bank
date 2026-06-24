import {
  collection,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { generateTransactionRef } from "../../utils/generateTransactionRef";
import { createNotification } from "../../utils/createNotification";
import { ADMIN_UID } from "../../config/adminConfig";

interface SubmitTransactionParams {
  type: "wire_transfer" | "local_transfer" | "internal_transfer" | "bill_payment" | "buy_crypto" | "check_deposit" | "crypto_deposit";
  subType?: string;
  description: string;
  category: string;
  amount: number;
  currency?: string;
  fundingAccount: "checking" | "savings";
  recipientName?: string;
  recipientAccount?: string;
  recipientBank?: string;
  note?: string;
  // wire transfer specific
  toBank?: string;
  toCountry?: string;
  toAccountNumber?: string;
  toSwiftCode?: string;
  toRoutingNumber?: string;
  toCurrency?: string;
  purpose?: string;
  fee?: number;
  // crypto specific
  cryptoId?: string;
  cryptoSymbol?: string;
  cryptoAmount?: number;
  fiatAmount?: number;
  priceAtTime?: number;
  // check deposit specific
  checkNumber?: string;
  routingNumber?: string;
  accountNumber?: string;
  memo?: string;
  toAccount?: string;
}

export async function submitTransaction({
  type,
  subType = "outgoing",
  description,
  category,
  amount,
  currency = "USD",
  fundingAccount,
  recipientName = "",
  recipientAccount = "",
  recipientBank = "",
  note = "",
  toBank = "",
  toCountry = "",
  toAccountNumber = "",
  toSwiftCode = "",
  toRoutingNumber = "",
  toCurrency = "",
  purpose = "",
  fee = 0,
  cryptoId = "",
  cryptoSymbol = "",
  cryptoAmount = 0,
  fiatAmount = 0,
  priceAtTime = 0,
  checkNumber = "",
  routingNumber = "",
  accountNumber = "",
  memo = "",
  toAccount = "",
}: SubmitTransactionParams): Promise<{ transactionId: string; transactionRef: string }> {
  const user = auth.currentUser;
  if (!user) throw new Error("User is not authenticated.");

  // Fetch the user's current account data
  let userSnap;
  try {
    userSnap = await getDoc(doc(db, "users", user.uid));
  } catch (err) {
    throw new Error("Could not read account data. Check your connection and try again.");
  }

  if (!userSnap.exists()) throw new Error("User account not found.");

  const userData = userSnap.data();
  const balanceAtSubmission =
    fundingAccount === "checking"
      ? (userData.checkingBalance ?? 0)
      : (userData.savingsBalance ?? 0);

  // Validate sufficient funds
  if (amount > balanceAtSubmission) {
    throw new Error(
      `Insufficient funds. Available ${fundingAccount} balance: $${balanceAtSubmission.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
    );
  }

  // Determine initial status based on the user's transaction mode
  const transactionMode: string = userData.transactionMode ?? "manual";
  let initialStatus: "pending" | "completed" | "declined" = "pending";
  if (transactionMode === "auto_approve") {
    initialStatus = "completed";
  } else if (transactionMode === "auto_decline") {
    initialStatus = "declined";
  }

  // Build the transaction reference
  const transactionRef = generateTransactionRef();

  // Build the status history array
  const initialStatusHistory = [
    {
      status: initialStatus,
      timestamp: new Date(),
      changedBy: transactionMode === "manual" ? "user" : "system",
      changedById: transactionMode === "manual" ? user.uid : "system",
      reason: transactionMode === "auto_approve"
        ? "Auto-approved by system"
        : transactionMode === "auto_decline"
        ? "Auto-declined by system"
        : "",
    },
  ];

  // Build transaction payload
  const transactionPayload = {
    userId: user.uid,
    userFullName: userData.fullName,
    userEmail: userData.email,
    type,
    subType,
    description,
    category,
    amount,
    currency,
    fundingAccount,
    recipientName,
    recipientAccount,
    recipientBank,
    note,
    // Extended fields for admin review
    toBank,
    toCountry,
    toAccountNumber,
    toSwiftCode,
    toRoutingNumber,
    toCurrency,
    purpose,
    fee,
    cryptoId,
    cryptoSymbol,
    cryptoAmount,
    fiatAmount,
    priceAtTime,
    checkNumber,
    routingNumber,
    accountNumber,
    memo,
    toAccount,
    status: initialStatus,
    statusHistory: initialStatusHistory,
    balanceAtSubmission,
    balanceAfter: null,
    reviewedByAdminId: null,
    reviewedByAdminName: null,
    reviewedAt: null,
    declineReason: null,
    adminNotified: false,
    userNotifiedOfResult: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    transactionRef,
  };

  // Write the transaction document
  const docRef = await addDoc(
    collection(db, "transactions"),
    transactionPayload
  );

  // Non-critical: store doc ID back on the document
  try {
    await updateDoc(docRef, { transactionId: docRef.id });
  } catch {
    // Non-critical, continue
  }

  // Non-critical: notify admin
  try {
    await createNotification({
      recipientId: ADMIN_UID,
      recipientType: "admin",
      type: "new_transaction",
      title: "New Pending Transaction",
      message: `${userData.fullName} submitted a ${type.replace(/_/g, " ")} of ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)}`,
      transactionId: docRef.id,
      userId: user.uid,
      userFullName: userData.fullName,
      amount,
      transactionType: type,
    });
    await updateDoc(docRef, { adminNotified: true });
  } catch {
    // Non-critical, continue
  }

  return { transactionId: docRef.id, transactionRef };
}
