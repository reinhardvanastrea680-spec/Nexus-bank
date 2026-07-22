import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, onSnapshot, query } from "firebase/firestore";

/**
 * Converts any createdAt value (Firestore Timestamp, ISO string, JS Date, or
 * missing) to a JS Date so downstream code always gets a consistent type.
 */
function toDate(value: any): Date {
  if (!value) return new Date(0);
  if (typeof value.toDate === "function") return value.toDate();   // Firestore Timestamp
  if (value instanceof Date) return value;
  const d = new Date(value);                                        // ISO string / number
  return isNaN(d.getTime()) ? new Date(0) : d;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // No orderBy — fetch ALL transactions regardless of whether createdAt exists.
    // Sort client-side so no transaction is silently excluded.
    const q = query(collection(db, "transactions"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txData = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: toDate(doc.data().createdAt),
        }))
        // Sort newest first
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      setTransactions(txData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { transactions, loading };
}
