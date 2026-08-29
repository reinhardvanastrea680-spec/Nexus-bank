#!/usr/bin/env node

/**
 * Script to remove ALL beneficiaries from ALL accounts
 * This is a one-time cleanup script for removing mock/test data
 * 
 * Usage: node scripts/remove-all-beneficiaries.mjs
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { config } from 'dotenv';

// Load environment variables
config();

// Firebase configuration - update with your actual config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

console.log('🔥 Initializing Firebase...');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function removeAllBeneficiaries() {
  const results = {
    topLevel: 0,
    userSubcollections: 0,
    requests: 0,
    errors: [],
  };

  try {
    // 1. Delete all documents from top-level beneficiaries collection
    console.log('\n📋 Step 1: Cleaning up top-level beneficiaries collection...');
    const beneficiariesSnap = await getDocs(collection(db, 'beneficiaries'));
    console.log(`   Found ${beneficiariesSnap.size} beneficiaries in top-level collection`);
    
    for (const docSnap of beneficiariesSnap.docs) {
      try {
        await deleteDoc(doc(db, 'beneficiaries', docSnap.id));
        results.topLevel++;
        process.stdout.write(`\r   Deleted: ${results.topLevel}/${beneficiariesSnap.size}`);
      } catch (error) {
        results.errors.push(`Failed to delete beneficiary ${docSnap.id}: ${error.message}`);
      }
    }
    console.log(`\n   ✅ Deleted ${results.topLevel} beneficiaries from top-level collection`);

    // 2. Delete all beneficiaries from user subcollections
    console.log('\n📋 Step 2: Cleaning up user subcollections...');
    const usersSnap = await getDocs(collection(db, 'users'));
    console.log(`   Checking ${usersSnap.size} user accounts...`);
    
    let userCount = 0;
    for (const userDoc of usersSnap.docs) {
      userCount++;
      try {
        const userBeneficiariesSnap = await getDocs(
          collection(db, 'users', userDoc.id, 'beneficiaries')
        );
        
        if (userBeneficiariesSnap.size > 0) {
          console.log(`   User ${userCount}/${usersSnap.size}: Found ${userBeneficiariesSnap.size} beneficiaries`);
          
          for (const benDoc of userBeneficiariesSnap.docs) {
            try {
              await deleteDoc(doc(db, 'users', userDoc.id, 'beneficiaries', benDoc.id));
              results.userSubcollections++;
            } catch (error) {
              results.errors.push(
                `Failed to delete user beneficiary ${benDoc.id} for user ${userDoc.id}: ${error.message}`
              );
            }
          }
        }
      } catch (error) {
        results.errors.push(`Failed to access beneficiaries for user ${userDoc.id}: ${error.message}`);
      }
    }
    console.log(`   ✅ Deleted ${results.userSubcollections} beneficiaries from user subcollections`);

    // 3. Delete all pending beneficiary requests
    console.log('\n📋 Step 3: Cleaning up beneficiary requests...');
    const requestsSnap = await getDocs(collection(db, 'beneficiaryRequests'));
    console.log(`   Found ${requestsSnap.size} pending requests`);
    
    for (const docSnap of requestsSnap.docs) {
      try {
        await deleteDoc(doc(db, 'beneficiaryRequests', docSnap.id));
        results.requests++;
        process.stdout.write(`\r   Deleted: ${results.requests}/${requestsSnap.size}`);
      } catch (error) {
        results.errors.push(`Failed to delete beneficiary request ${docSnap.id}: ${error.message}`);
      }
    }
    console.log(`\n   ✅ Deleted ${results.requests} pending beneficiary requests`);

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('🎉 CLEANUP COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log(`📊 Summary:`);
    console.log(`   • Top-level beneficiaries: ${results.topLevel} deleted`);
    console.log(`   • User subcollection beneficiaries: ${results.userSubcollections} deleted`);
    console.log(`   • Pending requests: ${results.requests} deleted`);
    console.log(`   • Total deleted: ${results.topLevel + results.userSubcollections + results.requests}`);
    
    if (results.errors.length > 0) {
      console.log(`\n⚠️  Errors encountered: ${results.errors.length}`);
      results.errors.forEach((err, i) => {
        console.log(`   ${i + 1}. ${err}`);
      });
    } else {
      console.log(`\n✨ No errors encountered!`);
    }
    
    console.log('\n✅ All beneficiaries have been removed from the system.');
    console.log('   Users can now manually add beneficiaries which will require admin approval.\n');

    return results;
  } catch (error) {
    console.error('\n❌ Error during beneficiary cleanup:', error);
    throw error;
  }
}

// Run the cleanup
console.log('⚠️  WARNING: This will DELETE ALL beneficiaries from ALL accounts!');
console.log('   Press Ctrl+C within 5 seconds to cancel...\n');

setTimeout(async () => {
  try {
    await removeAllBeneficiaries();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Cleanup failed:', error);
    process.exit(1);
  }
}, 5000);
