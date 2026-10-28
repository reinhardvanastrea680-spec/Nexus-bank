import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Request notification permission
 * Client-side only - no FCM tokens needed
 */
export async function requestNotificationPermission(adminId: string): Promise<boolean> {
  try {
    // Check if browser supports notifications
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return false;
    }

    // Request permission
    const permission = await Notification.requestPermission();
    
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return false;
    }

    // Save notification preference to Firestore
    await setDoc(
      doc(db, "admin", adminId),
      {
        notificationsEnabled: true,
        lastNotificationUpdate: new Date(),
      },
      { merge: true }
    );

    console.log("Notification permission granted");
    return true;
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
 * Show browser notification
 * Called directly from Firestore listener
 */
export function showNotification(title: string, body: string, userId?: string) {
  if (Notification.permission !== "granted") {
    return;
  }

  const notification = new Notification(title, {
    body: body,
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    tag: "chat-notification",
    requireInteraction: false,
    silent: false,
  });

  // Handle notification click
  notification.onclick = () => {
    window.focus();
    notification.close();
    // Navigate to chat if userId provided
    if (userId) {
      window.location.href = `/admin/chat?userId=${userId}`;
    }
  };

  // Auto-close after 5 seconds
  setTimeout(() => {
    notification.close();
  }, 5000);
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
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error disabling notifications:", error);
  }
}
