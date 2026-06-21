import { initializeApp, getApps } from "firebase/app"; 
import { getAuth } from "firebase/auth"; 

const secondaryFirebaseConfig = { 
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, 
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, 
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID, 
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, 
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, 
  appId: import.meta.env.VITE_FIREBASE_APP_ID, 
}; 

// Only initialize the secondary app once — check if it already exists 
const secondaryApp = 
  getApps().find((app) => app.name === "secondary") || 
  initializeApp(secondaryFirebaseConfig, "secondary"); 

export const secondaryAuth = getAuth(secondaryApp);
