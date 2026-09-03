import { useState, useEffect } from "react";
import { db, auth } from "../../firebase/config";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useUserAuth } from "./useUserAuth";

interface UserAccount {
  id?: string;
  [key: string]: any;
}

export function useUserAccount() {
  const { user, loading: authLoading } = useUserAuth();
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    if (authLoading) {
      return;
    }

    if (!user) {
      setAccount(null);
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(
      doc(db, "users", user.uid),
      async (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          
          // Check if admin has forced logout
          if (data.forceLogout === true) {
            // NO notification - silent logout
            
            // Clear the force logout flag
            try {
              await updateDoc(doc(db, "users", user.uid), {
                forceLogout: false,
                forceLogoutAt: null,
                forceLogoutReason: null,
              });
            } catch (error) {
              console.error("Error clearing force logout flag:", error);
            }
            
            // Sign out the user silently
            await signOut(auth);
            
            // Redirect to login without explanation
            window.location.href = "/login";
            return;
          }
          
          setAccount({ id: snap.id, ...data });
        } else {
          setAccount(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching account data:", error);
        setLoading(false);
      },
    );

    return unsub;
  }, [user, authLoading]);

  return { account, loading };
}
