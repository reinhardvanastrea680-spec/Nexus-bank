import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { doc, onSnapshot } from "firebase/firestore";
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
      (snap) => {
        if (snap.exists()) {
          setAccount({ id: snap.id, ...snap.data() });
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
