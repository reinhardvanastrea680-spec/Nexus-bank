/**
 * PASSWORD MIGRATION SCRIPT
 * This script updates passwords in Firestore for existing users
 * 
 * HOW TO USE:
 * 1. Open your app at http://localhost:5173/admin/users (must be logged in as admin)
 * 2. Open browser console (F12)
 * 3. Copy and paste this ENTIRE script into the console
 * 4. Press Enter
 * 5. The script will update all passwords automatically
 */

(async function updatePasswords() {
  console.log("🔄 Starting password migration...");
  
  // User credentials to update
  const users = [
    { email: "andrekent45@gmail.com", password: "Andrekent45@@" },
    { email: "johnsmith2026@gmail.com", password: "Gameofthrones##3" }
  ];
  
  // Check if Firebase is available
  if (typeof firebase === 'undefined') {
    console.error("❌ Firebase is not loaded. Please make sure you're on the admin dashboard page.");
    return;
  }
  
  const db = firebase.firestore();
  
  try {
    for (const user of users) {
      console.log(`📝 Updating password for ${user.email}...`);
      
      // Find user by email
      const usersQuery = await db.collection('users').where('email', '==', user.email).get();
      
      if (usersQuery.empty) {
        console.warn(`⚠️  User not found: ${user.email}`);
        continue;
      }
      
      const userDoc = usersQuery.docs[0];
      
      // Update password
      await userDoc.ref.update({
        password: user.password
      });
      
      console.log(`✅ Successfully updated password for ${user.email}`);
    }
    
    console.log("🎉 Password migration completed!");
    console.log("✅ All passwords have been stored in Firestore");
    console.log("💡 Refresh the user detail pages to see the passwords");
    
  } catch (error) {
    console.error("❌ Error during migration:", error);
  }
})();
