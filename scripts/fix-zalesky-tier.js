/**
 * Updates James Zalesky's accountTier to "Gold".
 * Signs in as admin using the Firebase client SDK (already installed).
 *
 * Run with:
 *   node scripts/fix-zalesky-tier.js <admin-email> <admin-password>
 *
 * Example:
 *   node scripts/fix-zalesky-tier.js admin@nexsus.com MyPassword123
 */

// Use CommonJS dynamic import for the ESM Firebase packages
const TARGET_UID = "NlIazOFSF5fRxgzVvRqc0yOWdWw2"; // James Zalesky
const NEW_TIER   = "Gold";

const PROJECT_ID = "nexus-bank-b6820";
const API_KEY    = "AIzaSyBlXeem_vLL6xbOYxkAg2qV_JRMZG97U68";
const AUTH_DOMAIN = "nexus-bank-b6820.firebaseapp.com";

const [,, adminEmail, adminPassword] = process.argv;

if (!adminEmail || !adminPassword) {
  console.error("\n❌  Usage: node scripts/fix-zalesky-tier.js <admin-email> <admin-password>\n");
  process.exit(1);
}

async function run() {
  const { initializeApp, getApps } = await import("firebase/app");
  const { getAuth, signInWithEmailAndPassword } = await import("firebase/auth");
  const { getFirestore, doc, updateDoc } = await import("firebase/firestore");

  const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
  };

  const app = getApps().length === 0 ? initializeApp(firebaseConfig, "tier-fix") : getApps()[0];
  const auth = getAuth(app);
  const db   = getFirestore(app);

  // ── Step 1: Sign in as admin ─────────────────────────────────────────
  console.log(`\n🔑 Signing in as ${adminEmail} ...`);
  const cred = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
  console.log(`✅ Signed in (UID: ${cred.user.uid})`);

  // ── Step 2: Update the tier ──────────────────────────────────────────
  console.log(`⬆️  Setting accountTier → "${NEW_TIER}" for James Zalesky ...`);
  await updateDoc(doc(db, "users", TARGET_UID), { accountTier: NEW_TIER });

  console.log(`\n🎉 Done! James Zalesky's accountTier is now "${NEW_TIER}".`);
  console.log("💡 Refresh the profile page to confirm.\n");
  process.exit(0);
}

run().catch((err) => {
  console.error("\n❌ Error:", err.message || err);
  process.exit(1);
});
