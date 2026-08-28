/**
 * Script to remove duplicate investment account with 0.00 Euro from andrekent45@gmail.com
 * 
 * Run with: node scripts/remove-duplicate-investment.js
 */

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, query, where, getDocs, doc, getDoc } = require("firebase/firestore");
const fs = require("fs");
const path = require("path");

// Read .env file
function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) {
    console.log("❌ .env file not found!");
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, "utf-8");
  const env = {};
  
  envContent.split("\n").forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, "");
      env[key] = value;
    }
  });
  
  return env;
}

const env = loadEnv();

// Firebase configuration
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TARGET_EMAIL = "andrekent45@gmail.com";

async function removeDuplicateInvestmentAccount() {
  try {
    console.log(`\n🔍 Looking for user: ${TARGET_EMAIL}...`);

    // Find user by email
    const usersQuery = query(
      collection(db, "users"),
      where("email", "==", TARGET_EMAIL)
    );
    const usersSnapshot = await getDocs(usersQuery);

    if (usersSnapshot.empty) {
      console.log("❌ User not found!");
      return;
    }

    const userDoc = usersSnapshot.docs[0];
    const userId = userDoc.id;
    const userData = userDoc.data();

    console.log(`✅ Found user: ${userId}`);
    console.log(`📧 Email: ${userData.email}`);
    console.log(`👤 Name: ${userData.fullName}`);

    // Get user account data
    const accountRef = doc(db, "accounts", userId);
    const accountSnapshot = await getDoc(accountRef);

    if (!accountSnapshot.exists()) {
      console.log("❌ Account document not found!");
      return;
    }

    const accountData = accountSnapshot.data();
    console.log("\n📊 Current Account Data:");
    console.log("Investment Balance:", accountData.investmentBalance);
    console.log("Investment Account Number:", accountData.investmentAccountNumber);

    // Check custom accounts
    const customAccountsRef = collection(db, "accounts", userId, "customAccounts");
    const customAccountsSnapshot = await getDocs(customAccountsRef);

    console.log(`\n🔍 Found ${customAccountsSnapshot.size} custom account(s):`);
    
    let investmentAccountsFound = [];
    customAccountsSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`\n  ID: ${doc.id}`);
      console.log(`  Name: ${data.name}`);
      console.log(`  Balance: ${data.balance || 0}`);
      console.log(`  Currency: ${data.currency || 'N/A'}`);
      console.log(`  Account Number: ${data.accountNumber || 'N/A'}`);
      console.log(`  Status: ${data.status || 'N/A'}`);

      if (data.name === "Investment" || data.name?.toLowerCase().includes("investment")) {
        investmentAccountsFound.push({
          id: doc.id,
          data: data
        });
      }
    });

    if (investmentAccountsFound.length === 0) {
      console.log("\n✅ No custom investment accounts found. Nothing to remove.");
      return;
    }

    console.log(`\n🎯 Found ${investmentAccountsFound.length} investment account(s) in custom accounts.`);

    // Find the one with 0.00 balance
    const zeroBalanceAccount = investmentAccountsFound.find(acc => 
      (acc.data.balance === 0 || acc.data.balance === "0" || acc.data.balance === 0.00) &&
      (acc.data.currency === "EUR" || acc.data.currency === "Euro")
    );

    if (!zeroBalanceAccount) {
      console.log("\n⚠️ No investment account with 0.00 Euro found.");
      console.log("Investment accounts found:");
      investmentAccountsFound.forEach(acc => {
        console.log(`  - ${acc.data.name}: ${acc.data.balance} ${acc.data.currency}`);
      });
      return;
    }

    console.log("\n⚠️ Found duplicate investment account to remove:");
    console.log(`  ID: ${zeroBalanceAccount.id}`);
    console.log(`  Name: ${zeroBalanceAccount.data.name}`);
    console.log(`  Balance: ${zeroBalanceAccount.data.balance} ${zeroBalanceAccount.data.currency}`);
    console.log(`  Account Number: ${zeroBalanceAccount.data.accountNumber || 'N/A'}`);

    // Confirm before deletion
    console.log("\n⚠️ This document needs to be deleted from Firestore Console.");
    console.log("⚠️ The main investment account (standard account) will remain untouched.");
    console.log(`\n📍 Path: accounts/${userId}/customAccounts/${zeroBalanceAccount.id}`);
    console.log("\nSteps to delete:");
    console.log("1. Go to Firebase Console: https://console.firebase.google.com/");
    console.log("2. Select your project");
    console.log("3. Navigate to Firestore Database");
    console.log("4. Go to: accounts → " + userId + " → customAccounts → " + zeroBalanceAccount.id);
    console.log("5. Click the three dots menu and select 'Delete document'");

    console.log("\n✅ Script completed. Please manually delete the document from Firebase Console.");

  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.error(error);
  }

  process.exit(0);
}

// Run the script
removeDuplicateInvestmentAccount();
