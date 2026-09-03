# Nexus Bank Cloud Functions

Firebase Cloud Functions for admin operations that require server-side Firebase Admin SDK.

## Features

### `updateUserPassword`
Updates a user's Firebase Authentication password AND their Firestore password field.

**Why needed:** Client-side code cannot update another user's Firebase Auth password for security reasons. Only Firebase Admin SDK (server-side) can do this.

### `createUserWithPassword`
Creates a new user in both Firebase Auth and Firestore with a specific password.

## Setup & Deployment

### Prerequisites
- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase project initialized
- Admin credentials configured

### Installation

1. **Navigate to functions folder:**
   ```bash
   cd functions
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Initialize Firebase (if not already done):**
   ```bash
   firebase init functions
   ```
   - Choose "Use an existing project"
   - Select your Nexus Bank project
   - Choose JavaScript
   - Install dependencies: Yes

### Deployment

**Deploy all functions:**
```bash
firebase deploy --only functions
```

**Deploy specific function:**
```bash
firebase deploy --only functions:updateUserPassword
```

### Testing Locally

**Start emulator:**
```bash
npm run serve
```

The functions will be available at:
- http://localhost:5001/YOUR_PROJECT_ID/us-central1/updateUserPassword

## Usage from Frontend

### Update User Password

```javascript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const updatePassword = httpsCallable(functions, 'updateUserPassword');

try {
  const result = await updatePassword({
    userId: 'firebase-auth-uid-here',
    newPassword: 'newpassword123'
  });
  
  if (result.data.success) {
    console.log('Password updated!');
  }
} catch (error) {
  console.error('Error:', error);
}
```

### Create User

```javascript
const createUser = httpsCallable(functions, 'createUserWithPassword');

const result = await createUser({
  email: 'user@example.com',
  password: 'initialPassword123',
  userData: {
    fullName: 'John Doe',
    accountTier: 'Standard',
    // ... other Firestore fields
  }
});
```

## Security

- Only authenticated admins can call these functions
- Admin verification is done by checking the `admin` collection
- All operations are logged in Firebase Functions logs

## Monitoring

**View logs:**
```bash
firebase functions:log
```

**View specific function logs:**
```bash
firebase functions:log --only updateUserPassword
```

## Troubleshooting

### Error: "Cloud Function not found"
**Solution:** Deploy the functions first:
```bash
cd functions
npm install
firebase deploy --only functions
```

### Error: "Permission denied"
**Solution:** Make sure the caller is authenticated and exists in the `admin` collection in Firestore.

### Error: "Firebase Admin SDK not initialized"
**Solution:** Make sure Firebase Admin is properly initialized in `index.js`:
```javascript
admin.initializeApp();
```

## Cost Considerations

Firebase Cloud Functions pricing:
- **Free tier:** 2 million invocations/month
- **Paid:** $0.40 per million invocations after free tier

For Nexus Bank admin operations (password updates), this should stay well within free tier.

## Development

To add new Cloud Functions:

1. Open `functions/index.js`
2. Add new `exports.functionName = functions.https.onCall(...)`
3. Deploy: `firebase deploy --only functions`
4. Use from frontend with `httpsCallable(functions, 'functionName')`

## Support

If you encounter issues:
1. Check Firebase Console → Functions section for errors
2. Run `firebase functions:log` to see logs
3. Test locally with `npm run serve` before deploying
