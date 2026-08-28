import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

export function useAllTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "transactions"),
      orderBy("date", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return unsub;
  }, []);

  return { transactions, loading };
}