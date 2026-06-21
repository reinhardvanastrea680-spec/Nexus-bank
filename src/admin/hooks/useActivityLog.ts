import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

export function useActivityLog() {
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "adminActivityLog"),
      orderBy("timestamp", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setLog(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return unsub;
  }, []);

  return { log, loading };
}