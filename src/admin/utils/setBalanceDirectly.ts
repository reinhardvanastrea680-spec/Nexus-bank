import { doc, updateDoc, serverTimestamp, increment } from "firebase/firestore";
import { db } from "../../firebase/config";
import { logAdminAction } from "../../utils/logAdminAction";
import { createNotification } from "../../utils/createNotification";
import { ADMIN_UID } from "../../config/adminConfig";

export async function setBalanceDirectly(
  userId: string,
  userFullName: string,
  account: "checking" | "savings",
  newBalance: number,
  oldBalance: number,
) {
  const balanceField = account === "checking" ? "checkingBalance" : "savingsBalance";
  const delta = newBalance - oldBalance;

  // ── STEP 1: Update balance (most critical — do this first) ────────────────
  await updateDoc(doc(db, "users", userId), {
    [balanceField]: newBalance,
    totalBalance: increment(delta),
    lastBalanceUpdatedAt: serverTimestamp(),
    lastBalanceUpdatedBy: "admin",
  });

  // ── STEP 2: Notify the user ───────────────────────────────────────────────
  try {
    const newStr = newBalance.toLocaleString("en-US", { style: "currency", currency: "USD" });
    await createNotification({
      recipientId: userId,
      recipientType: "user",
      type: "balance_override",
      title: "Account Balance Updated",
      message: `Your ${account} account balance has been updated to ${newStr} by the admin.`,
      userId,
      userFullName,
      amount: newBalance,
      transactionType: "balance_override",
    });
  } catch (err) {
    console.error("User notification failed (non-critical):", err);
  }

  // ── STEP 3: Notify the admin ──────────────────────────────────────────────
  try {
    await createNotification({
      recipientId: ADMIN_UID,
      recipientType: "admin",
      type: "balance_override",
      title: "Balance Override",
      message: `${userFullName}'s ${account} balance set to $${newBalance.toFixed(2)} (was $${oldBalance.toFixed(2)})`,
      userId,
      userFullName,
      amount: newBalance,
      transactionType: "balance_override",
    });
  } catch (err) {
    console.error("Admin notification failed (non-critical):", err);
  }

  // ── STEP 4: Log admin action ──────────────────────────────────────────────
  await logAdminAction(
    "BALANCE_OVERRIDE",
    `Set ${account} balance for ${userFullName} from $${oldBalance.toFixed(2)} to $${newBalance.toFixed(2)}`,
    userId,
    userFullName,
    { account, oldBalance, newBalance, delta },
  );
}
