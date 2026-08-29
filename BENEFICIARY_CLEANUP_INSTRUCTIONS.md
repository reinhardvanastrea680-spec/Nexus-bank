# Beneficiary Cleanup Instructions

## Problem
Mock/test beneficiaries are still present in all user accounts and need to be removed.

## Solution

We have THREE ways to remove all beneficiaries:

---

## Option 1: Using the Admin Dashboard (Recommended)

1. **Login to Admin Dashboard**
   - Go to: `https://your-dashboard.vercel.app/admin/login`
   - Login with admin credentials

2. **Navigate to Cleanup Page**
   - Go to: `/admin/cleanup-beneficiaries`
   - Or add this route to your admin sidebar if not already there

3. **Run Cleanup**
   - Click "Delete All Beneficiaries" button
   - Confirm the action twice (it will ask for double confirmation)
   - Wait for completion message

---

## Option 2: Using Node.js Script (If you have Firebase credentials)

1. **Create `.env` file** in `Nexus-bank-main/` with your Firebase config:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

2. **Run the cleanup script:**
   ```bash
   cd Nexus-bank-main/Nexus-bank-main
   node scripts/remove-all-beneficiaries.mjs
   ```

3. **Wait 5 seconds** (script gives you time to cancel with Ctrl+C)

4. **Script will delete:**
   - All top-level beneficiaries
   - All user-specific beneficiaries
   - All pending beneficiary requests

---

## Option 3: Manual Cleanup via Firebase Console

1. **Go to Firebase Console**
   - https://console.firebase.google.com/
   - Select your project

2. **Navigate to Firestore Database**

3. **Delete Collections:**
   - Delete entire `beneficiaries` collection
   - Delete entire `beneficiaryRequests` collection
   - For each user in `users` collection:
     - Go into user document
     - Delete `beneficiaries` subcollection

⚠️ **Warning:** This is manual and time-consuming for many users!

---

## What Happens After Cleanup?

✅ All existing beneficiaries are removed  
✅ Users can add new beneficiaries via the app  
✅ New beneficiaries require admin approval  
✅ No more automatic mock beneficiaries  

---

## Files Created for This Cleanup

1. **Admin UI Page:**
   - `src/routes/admin/cleanup-beneficiaries.tsx`
   - Full UI with warnings and confirmations

2. **Cleanup Utility:**
   - `src/admin/utils/cleanupBeneficiaries.ts`
   - Reusable cleanup function

3. **Node.js Script:**
   - `scripts/remove-all-beneficiaries.mjs`
   - Command-line cleanup tool

---

## Verification After Cleanup

1. **Check Admin Dashboard:**
   - Go to any user's account details
   - Verify "Saved Beneficiaries" section is empty

2. **Check User Dashboard:**
   - Login as a test user
   - Go to "Send Money" or "Beneficiaries" page
   - Should show "No beneficiaries yet"

3. **Check Firebase Console:**
   - All three collections should be empty or non-existent

---

## Need Help?

If cleanup doesn't work or you encounter errors:
1. Check browser console for error messages
2. Check Firebase Console > Firestore > Check if collections still exist
3. Verify Firebase permissions allow deletion
4. Try the Node.js script as it provides detailed error logs
