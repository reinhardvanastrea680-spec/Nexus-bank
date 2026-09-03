const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

/**
 * Update User Password
 * 
 * Callable function that allows admins to update a user's Firebase Auth password
 * 
 * @param {Object} data
 * @param {string} data.userId - The user's UID in Firebase Auth
 * @param {string} data.newPassword - The new password (min 6 characters)
 * @param {Object} context - Firebase auth context
 * 
 * @returns {Promise<{success: boolean, message: string}>}
 */
exports.updateUserPassword = functions.https.onCall(async (data, context) => {
  // Verify the caller is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated to call this function'
    );
  }

  // Verify the caller is an admin
  // You should implement your own admin check here
  const callerUid = context.auth.uid;
  const callerDoc = await admin.firestore().collection('admin').doc(callerUid).get();
  
  if (!callerDoc.exists) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can update user passwords'
    );
  }

  const { userId, newPassword } = data;

  if (!userId || !newPassword) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'userId and newPassword are required'
    );
  }

  if (newPassword.length < 6) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Password must be at least 6 characters'
    );
  }

  try {
    // Update Firebase Authentication password
    await admin.auth().updateUser(userId, {
      password: newPassword
    });

    // Also update Firestore password field for display in admin panel
    await admin.firestore().collection('users').doc(userId).update({
      password: newPassword,
      passwordUpdatedByAdmin: true,
      passwordUpdateTimestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      success: true,
      message: 'Password updated successfully in both Firebase Auth and Firestore'
    };
  } catch (error) {
    console.error('Error updating user password:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to update password: ${error.message}`
    );
  }
});

/**
 * Create User with Password
 * 
 * Callable function that creates a user in Firebase Auth with a password
 * and also creates their Firestore document
 */
exports.createUserWithPassword = functions.https.onCall(async (data, context) => {
  // Verify the caller is authenticated and is an admin
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const callerUid = context.auth.uid;
  const callerDoc = await admin.firestore().collection('admin').doc(callerUid).get();
  
  if (!callerDoc.exists) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can create users');
  }

  const { email, password, userData } = data;

  if (!email || !password) {
    throw new functions.https.HttpsError('invalid-argument', 'email and password are required');
  }

  try {
    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      emailVerified: false
    });

    // Create Firestore document
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email,
      password, // Store for admin display
      ...userData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdByAdmin: true
    });

    return {
      success: true,
      uid: userRecord.uid,
      message: 'User created successfully'
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw new functions.https.HttpsError('internal', `Failed to create user: ${error.message}`);
  }
});
