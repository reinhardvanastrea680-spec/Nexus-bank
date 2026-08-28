import { db } from "../../firebase/config";
import { collection, getDocs, deleteDoc, doc, query } from "firebase/firestore";

/**
 * Removes all beneficiaries from all accounts
 * This includes:
 * 1. Top-level beneficiaries collection
 * 2. User-specific beneficiaries subcollections (users/{uid}/beneficiaries)
 * 3. Beneficiary requests collection
 */
export async function cleanupAllBeneficiaries() {
  const results = {
    topLevel: 0,
    userSubcollections: 0,
    requests: 0,
    errors: [] as string[],
  };

  try {
    // 1. Delete all documents from top-level beneficiaries collection
    console.log("Cleaning up top-level beneficiaries...");
    const beneficiariesSnap = await getDocs(collection(db, "beneficiaries"));
    for (const docSnap of beneficiariesSnap.docs) {
      try {
        await deleteDoc(doc(db, "beneficiaries", docSnap.id));
        results.topLevel++;
      } catch (error: any) {
        results.errors.push(`Failed to delete beneficiary ${docSnap.id}: ${error.message}`);
      }
    }
    console.log(`Deleted ${results.topLevel} beneficiaries from top-level collection`);

    // 2. Delete all beneficiaries from user subcollections
    console.log("Cleaning up user subcollections...");
    const usersSnap = await getDocs(collection(db, "users"));
    for (const userDoc of usersSnap.docs) {
      try {
        const userBeneficiariesSnap = await getDocs(
          collection(db, "users", userDoc.id, "beneficiaries")
        );
        for (const benDoc of userBeneficiariesSnap.docs) {
          try {
            await deleteDoc(doc(db, "users", userDoc.id, "beneficiaries", benDoc.id));
            results.userSubcollections++;
          } catch (error: any) {
            results.errors.push(
              `Failed to delete user beneficiary ${benDoc.id} for user ${userDoc.id}: ${error.message}`
            );
          }
        }
      } catch (error: any) {
        results.errors.push(`Failed to access beneficiaries for user ${userDoc.id}: ${error.message}`);
      }
    }
    console.log(`Deleted ${results.userSubcollections} beneficiaries from user subcollections`);

    // 3. Delete all pending beneficiary requests
    console.log("Cleaning up beneficiary requests...");
    const requestsSnap = await getDocs(collection(db, "beneficiaryRequests"));
    for (const docSnap of requestsSnap.docs) {
      try {
        await deleteDoc(doc(db, "beneficiaryRequests", docSnap.id));
        results.requests++;
      } catch (error: any) {
        results.errors.push(`Failed to delete beneficiary request ${docSnap.id}: ${error.message}`);
      }
    }
    console.log(`Deleted ${results.requests} pending beneficiary requests`);

    return results;
  } catch (error: any) {
    console.error("Error during beneficiary cleanup:", error);
    throw error;
  }
}
