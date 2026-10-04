import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

// VAPID key - you'll need to generate this in Firebase Console
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

/**
 * Request notification permission and get FCM token
 * Only call this for ADMIN users
 */
export async function requestNotificationPermission(adminId: string): Promise<boolean> {
  try {
    // Check if browser supports notifications
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return false;
    }

    // Check if messaging is available
    if (!messaging) {
      console.log("Firebase Messaging not supported");
      return false;
    }

    // Request permission
    const permission = await Notification.requestPermission();
    
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return false;
    }

    // Get FCM token
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
    });

    if (token) {
      // Save token to Firestore admin document
      await setDoc(
        doc(db, "admin", adminId),
        {
          fcmToken: token,
          notificationsEnabled: true,
          lastTokenUpdate: new Date(),
        },
        { merge: true }
      );

      console.log("FCM token saved successfully");
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error getting notification permission:", error);
    return false;
  }
}

/**
 * Check if admin has notifications enabled
 */
export async function hasNotificationsEnabled(adminId: string): Promise<boolean> {
  try {
    const adminDoc = await getDoc(doc(db, "admin", adminId));
    return adminDoc.exists() && adminDoc.data()?.notificationsEnabled === true;
  } catch (error) {
    console.error("Error checking notification status:", error);
    return false;
  }
}

/**
 * Setup foreground message listener
 * Shows notification when admin panel is open
 */
export function setupForegroundNotifications() {
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);

    const notificationTitle = payload.notification?.title || "New Message";
    const notificationOptions = {
      body: payload.notification?.body || "You have a new message",
      icon: "/favicon.svg",
      badge: "/favicon.svg",
      tag: "chat-notification",
      requireInteraction: false,
    };

    // Show browser notification
    if (Notification.permission === "granted") {
      new Notification(notificationTitle, notificationOptions);
    }
  });
}

/**
 * Disable notifications for admin
 */
export async function disableNotifications(adminId: string): Promise<void> {
  try {
    await setDoc(
      doc(db, "admin", adminId),
      {
        notificationsEnabled: false,
        fcmToken: null,
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error disabling notifications:", error);
  }
}
