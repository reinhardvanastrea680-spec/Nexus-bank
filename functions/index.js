const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

/**
 * Send notification to admin when user sends a chat message
 */
exports.notifyAdminOnNewMessage = functions.firestore
  .document('chats/{userId}/messages/{messageId}')
  .onCreate(async (snap, context) => {
    const message = snap.data();
    const userId = context.params.userId;

    // Only notify if message is from user (not admin or system)
    if (message.sender !== 'user') {
      return null;
    }

    try {
      // Get chat document to find user details
      const chatDoc = await admin.firestore().collection('chats').doc(userId).get();
      const chatData = chatDoc.data();
      
      if (!chatData) {
        console.log('Chat document not found');
        return null;
      }

      const userFullName = chatData.userFullName || 'User';

      // Get admin FCM token
      const adminSnapshot = await admin.firestore().collection('admin').get();
      
      if (adminSnapshot.empty) {
        console.log('No admin found');
        return null;
      }

      // Send notification to all admins with FCM tokens
      const promises = [];
      
      adminSnapshot.forEach((adminDoc) => {
        const adminData = adminDoc.data();
        
        if (adminData.fcmToken && adminData.notificationsEnabled) {
          const payload = {
            notification: {
              title: `New message from ${userFullName}`,
              body: message.text.substring(0, 100), // First 100 chars
              icon: '/favicon.svg',
              badge: '/favicon.svg',
              tag: 'chat-notification',
            },
            data: {
              userId: userId,
              messageId: context.params.messageId,
              clickAction: '/admin/chat'
            },
            token: adminData.fcmToken
          };

          promises.push(
            admin.messaging().send(payload).catch((error) => {
              console.error('Error sending notification:', error);
              // If token is invalid, remove it
              if (error.code === 'messaging/invalid-registration-token' ||
                  error.code === 'messaging/registration-token-not-registered') {
                return admin.firestore().collection('admin').doc(adminDoc.id).update({
                  fcmToken: null,
                  notificationsEnabled: false
                });
              }
            })
          );
        }
      });

      await Promise.all(promises);
      console.log('Notifications sent successfully');
      return null;

    } catch (error) {
      console.error('Error in notifyAdminOnNewMessage:', error);
      return null;
    }
  });

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
