import { db } from "../../firebase/config";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

/**
 * Forces a user to be logged out by setting a flag in their Firestore document.
 * The user's app will detect this flag and log them out immediately.
 * 
 * @param userId - The user's ID to force logout
 * @param userName - The user's name (for logging purposes)
 */
export async function forceLogoutUser(userId: string, userName: string) {
  try {
    // Set a force logout flag in the user's document
    await updateDoc(doc(db, "users", userId), {
      forceLogout: true,
      forceLogoutAt: serverTimestamp(),
      forceLogoutReason: "Admin initiated logout",
    });

    console.log(`Force logout initiated for user: ${userName} (${userId})`);
    
    return { success: true };
  } catch (error: any) {
    console.error("Error forcing user logout:", error);
    throw new Error(`Failed to force logout: ${error.message}`);
  }
}

/**
 * Clears the force logout flag after the user has been logged out
 * 
 * @param userId - The user's ID
 */
export async function clearForceLogout(userId: string) {
  try {
    await updateDoc(doc(db, "users", userId), {
      forceLogout: false,
      forceLogoutAt: null,
      forceLogoutReason: null,
    });
  } catch (error: any) {
    console.error("Error clearing force logout flag:", error);
  }
}
