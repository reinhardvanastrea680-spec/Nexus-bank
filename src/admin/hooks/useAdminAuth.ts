import { useState, useEffect } from "react";
import { auth, db } from "../../firebase/config";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ADMIN_UID } from "../../config/adminConfig";

export function useAdminAuth() {
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user && user.uid === ADMIN_UID) {
        setAdmin(user);
      } else {
        if (user) await signOut(auth);
        setAdmin(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function adminLogin(email: string, password: string) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    if (result.user.uid !== ADMIN_UID) {
      await signOut(auth);
      throw new Error("Access denied. This console is restricted.");
    }
    await updateDoc(doc(db, "admins", ADMIN_UID), {
      lastLoginAt: serverTimestamp()
    });
    return result.user;
  }

  async function adminLogout() {
    await signOut(auth);
  }

  return { admin, loading, adminLogin, adminLogout };
}
