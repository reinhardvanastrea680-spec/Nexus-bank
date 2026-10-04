// Firebase Cloud Messaging Service Worker
// This handles background notifications when the admin panel is closed

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyBlXeem_vLL6xbOYxkAg2qV_JRMZG97U68",
  authDomain: "nexus-bank-b6820.firebaseapp.com",
  projectId: "nexus-bank-b6820",
  storageBucket: "nexus-bank-b6820.firebasestorage.app",
  messagingSenderId: "383216015173",
  appId: "1:383216015173:web:f833940e4cc9b92aa2902c"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);

  const notificationTitle = payload.notification?.title || 'New Chat Message';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: 'chat-notification',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Open or focus the admin panel
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if admin panel is already open
      for (const client of clientList) {
        if (client.url.includes('/admin') && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window if not found
      if (clients.openWindow) {
        return clients.openWindow('/admin/chat');
      }
    })
  );
});
