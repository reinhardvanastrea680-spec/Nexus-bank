import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

export function usePendingTransactions() {
  const [pendingTransactions, setPendingTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "pendingTransactions"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() ?? new Date(),
      }));
      setPendingTransactions(txData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { pendingTransactions, loading };
}
