/**
 * One-time cleanup: delete all presence/tracking notifications
 * that were incorrectly written to any user's notification feed.
 * 
 * Run with: node scripts/cleanup-presence-notifs.mjs
 */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            "AIzaSyBlXeem_vLL6xbOYxkAg2qV_JRMZG97U68",
  authDomain:        "nexus-bank-b6820.firebaseapp.com",
  projectId:         "nexus-bank-b6820",
  storageBucket:     "nexus-bank-b6820.firebasestorage.app",
  messagingSenderId: "383216015173",
  appId:             "1:383216015173:web:f833940e4cc9b92aa2902c",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cleanup() {
  console.log("🔍 Searching for presence/tracking notifications wrongly sent to users...");

  // Match any notification with transactionType=presence OR type=user_activity
  // that is NOT sent to the admin UID
  const ADMIN_UID = "rxj5upvJRFaUDqmH7Evfk95QuYN2";

  // Query by transactionType = presence
  const q1 = query(
    collection(db, "notifications"),
    where("transactionType", "==", "presence"),
  );

  const snap1 = await getDocs(q1);
  let deleted = 0;

  for (const docSnap of snap1.docs) {
    const data = docSnap.data();
    // Delete if it was sent to anyone who is NOT the admin
    if (data.recipientId !== ADMIN_UID) {
      await deleteDoc(docSnap.ref);
      console.log(`  ✓ Deleted: "${data.title}" (recipientId: ${data.recipientId})`);
      deleted++;
    }
  }

  // Also query by type = user_activity
  const q2 = query(
    collection(db, "notifications"),
    where("type", "==", "user_activity"),
  );
  const snap2 = await getDocs(q2);
  for (const docSnap of snap2.docs) {
    const data = docSnap.data();
    if (data.recipientId !== ADMIN_UID) {
      await deleteDoc(docSnap.ref);
      console.log(`  ✓ Deleted: "${data.title}" (recipientId: ${data.recipientId})`);
      deleted++;
    }
  }

  console.log(`\n✅ Cleanup complete — ${deleted} notifications deleted.`);
  process.exit(0);
}

cleanup().catch((err) => {
  console.error("❌ Cleanup failed:", err);
  process.exit(1);
});
