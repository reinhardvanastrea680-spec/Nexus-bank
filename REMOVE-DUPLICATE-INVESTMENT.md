# Remove Duplicate Investment Account

## Issue
User **andrekent45@gmail.com** has TWO investment accounts:
1. Standard Investment Account (correct one - keep this)
2. Custom Investment Account with 0.00 Euro (duplicate - DELETE this)

## Solution: Delete from Firebase Console

### Step-by-Step Instructions:

1. **Go to Firebase Console**
   - Open: https://console.firebase.google.com/
   - Select your project

2. **Navigate to Firestore Database**
   - Click on "Firestore Database" in the left sidebar
   - Click on "Data" tab

3. **Find the User**
   - Go to collection: `users`
   - Search for: `andrekent45@gmail.com`
   - Note the document ID (User ID)

4. **Navigate to Accounts**
   - Go to collection: `accounts`
   - Find the document with the same ID as the user
   - Click to open it

5. **Find Custom Accounts Subcollection**
   - Inside the account document, look for `customAccounts` subcollection
   - Click on it

6. **Identify the Duplicate Investment Account**
   - Look for documents with:
     - `name`: "Investment" 
     - `balance`: 0 or 0.00
     - `currency`: "EUR" or "Euro"

7. **Delete the Document**
   - Click on the document ID
   - Click the three dots menu (⋮) in the top right
   - Select "Delete document"
   - Confirm the deletion

8. **Verify**
   - Log in as andrekent45@gmail.com on the website
   - Check that only ONE investment account shows up
   - The remaining investment account should have the correct balance

## Important Notes
- **DO NOT** delete the main investment account fields from the `accounts` document
- **DO NOT** delete any other custom accounts
- Only delete the custom account with name "Investment" and 0.00 Euro balance
- The standard investment account (with `investmentBalance`, `investmentAccountNumber` fields) should remain in the main `accounts` document

## Expected Result
After deletion, andrekent should have:
- ✅ 1 Checking Account (standard)
- ✅ 1 Savings Account (standard)
- ✅ 1 Investment Account (standard - with proper balance)
- ✅ Any other custom accounts that were properly created

## Troubleshooting
If you can't find the duplicate:
1. Check all documents in the `customAccounts` subcollection
2. Look for any document where `name` contains "investment" (case-insensitive)
3. Delete any with 0 balance that match
