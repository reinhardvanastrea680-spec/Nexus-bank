import { useState, useEffect } from "react";
import { auth } from "../../firebase/config";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { ADMIN_UID } from "../../config/adminConfig";

export function useUserAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      // If user is admin, sign them out (only admin login is allowed on /admin/login)
      if (firebaseUser && firebaseUser.uid === ADMIN_UID) {
        signOut(auth);
        setUser(null);
      } else {
        setUser(firebaseUser);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const userLogin = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    // Check if user is admin (they shouldn't log in here!)
    if (result.user.uid === ADMIN_UID) {
      await signOut(auth);
      throw new Error("Please use the admin login page!");
    }
    
    return result.user;
  };

  const userLogout = async () => {
    await signOut(auth);
  };

  return { user, loading, userLogin, userLogout };
}
