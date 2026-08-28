import { createUserWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { doc, setDoc, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { secondaryAuth } from "../../firebase/secondaryApp";
import { db, auth } from "../../firebase/config";
import { generateAccountNumber, generateTransactionRef } from "../../utils/generateAccountNumber";
import { logAdminAction } from "../../utils/logAdminAction";

/**
 * Creates a new user in Firebase Auth (via secondary app) and
 * writes their full profile + account data to Firestore.
 *
 * @param {Object} formData - All fields from the Add User form
 * @returns {Object} - The newly created user's full data
 */
export async function createUserAccount(formData: any) {
  const {
    fullName,
    email,
    password,
    phone,
    address,
    dateOfBirth,
    initialCheckingBalance,
    initialSavingsBalance,
    status,
  } = formData;

  let newUid: string | null = null;

  try {
    // ─── STEP 1: Create Firebase Auth account on secondary app ──────────
    const credential = await createUserWithEmailAndPassword(secondaryAuth, email, password);

    newUid = credential.user.uid;

    // ─── STEP 2: Set the display name on the Auth profile ───────────────
    await updateProfile(credential.user, {
      displayName: fullName,
    });

    // ─── STEP 3: Sign out of the secondary app immediately ──────────────
    await signOut(secondaryAuth);

    // ─── STEP 4: Generate bank account numbers ───────────────────────────
    const checkingAccountNumber = generateAccountNumber();
    let savingsAccountNumber = generateAccountNumber();

    // Ensure they are never the same
    if (savingsAccountNumber === checkingAccountNumber) {
      savingsAccountNumber = generateAccountNumber();
    }

    // ─── STEP 4.5: Generate random 4-digit transaction PIN ───────────────
    const transactionPin = Math.floor(1000 + Math.random() * 9000).toString();

    // ─── STEP 5: Build the complete Firestore user document ─────────────
    const checkingBalance = parseFloat(initialCheckingBalance) || 0;
    const savingsBalance = parseFloat(initialSavingsBalance) || 0;

    const userDocument: any = {
      // Identity
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      address: address?.trim() || "",
      dateOfBirth: dateOfBirth || "",

      // Account status
      status: status || "active", // "active" | "frozen"
      createdAt: serverTimestamp(),
      createdByAdmin: true,
      adminCreatorId: auth.currentUser?.uid ?? "admin",

      // Bank account details
      checkingAccountNumber,
      savingsAccountNumber,
      routingNumber: "082000073", // Same routing number for all users

      // Balances (stored as numbers, never strings)
      checkingBalance,
      savingsBalance,
      totalBalance: checkingBalance + savingsBalance,

      // Security credentials
      password, // Store password for admin viewing
      transactionPin, // Random 4-digit PIN for transaction confirmation

      // Metadata
      lastBalanceUpdatedAt: serverTimestamp(),
      lastBalanceUpdatedBy: "admin",
      avatarUrl: null,
      notificationsEnabled: true,

      // Dashboard display settings
      dashboardCurrency: formData.currency || "USD",

      // Account tier & phone privacy
      accountTier: formData.accountTier || "Standard",
      hidePhone: formData.hidePhone === true,
    };

    // ─── STEP 6: Write document to Firestore ─────────────────────────────
    await setDoc(doc(db, "users", newUid), userDocument);

    // ─── STEP 7: If opening balances are set, write initial transactions ─
    if (checkingBalance > 0) {
      await writeOpeningTransaction(
        newUid,
        fullName,
        "checking",
        checkingBalance,
        checkingAccountNumber,
      );
    }

    if (savingsBalance > 0) {
      await writeOpeningTransaction(
        newUid,
        fullName,
        "savings",
        savingsBalance,
        savingsAccountNumber,
      );
    }

    // ─── STEP 8: Log the admin action ────────────────────────────────────
    await logAdminAction(
      "USER_CREATED",
      `Created account for ${fullName} (${email})`,
      newUid,
      fullName,
      {
        email,
        phone,
        initialCheckingBalance: checkingBalance,
        initialSavingsBalance: savingsBalance,
        checkingAccountNumber,
        savingsAccountNumber,
        status,
      },
    );

    // ─── STEP 9: Return the created user data ────────────────────────────
    return {
      uid: newUid,
      ...userDocument,
    };
  } catch (error: any) {
    // If Firestore write fails after Auth creation, we still have an
    // orphaned Auth account. Log it so it can be cleaned up manually.
    if (newUid) {
      console.error(
        `Auth account created (UID: ${newUid}) but Firestore write failed. Manual cleanup may be needed.`,
        error,
      );
    }
    throw error; // Re-throw so the modal can display the correct error
  }
}

/**
 * Writes an opening balance transaction for a newly created account.
 * This ensures the transaction history starts with an "Account Opening" entry.
 */
async function writeOpeningTransaction(
  userId: string,
  userFullName: string,
  account: string,
  amount: number,
  accountNumber: string,
) {
  await addDoc(collection(db, "transactions"), {
    userId,
    userFullName,
    account,
    type: "credit",
    amount,
    description: "Account Opening Balance",
    category: "Transfer",
    date: serverTimestamp(),
    balanceAfter: amount,
    adminNote: "Initial balance set at account creation",
    createdAt: serverTimestamp(),
    createdByAdmin: true,
    transactionRef: generateTransactionRef(),
    accountNumber,
  });
}
