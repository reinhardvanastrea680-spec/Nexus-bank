import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

export function useUserTransactionsById(userId: string | null) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setTransactions([]);
      setLoading(false);
      setError(null);
      return;
    }

    const q = query(
      collection(db, "transactions"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const txData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() ?? new Date(),
        }));
        setTransactions(txData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching user transactions:", err);
        setError("Failed to load transactions");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userId]);

  return { transactions, loading, error };
}
