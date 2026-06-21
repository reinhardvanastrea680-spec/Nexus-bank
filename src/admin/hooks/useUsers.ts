import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamps to JS Dates for display
        createdAt: doc.data().createdAt?.toDate() ?? new Date(),
      }));
      setUsers(userData);
      setLoading(false);
    });

    // CRITICAL: always return the unsubscribe function
    // to prevent memory leaks when the component unmounts
    return unsubscribe;
  }, []);

  return { users, loading };
}
