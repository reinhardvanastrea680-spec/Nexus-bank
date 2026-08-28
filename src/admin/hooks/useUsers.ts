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

export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // No orderBy — fetch ALL documents regardless of whether createdAt exists.
    // Sort client-side so no user is silently excluded.
    const q = query(collection(db, "users"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userData = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: toDate(doc.data().createdAt),
        }))
        // Sort newest first, matching the previous orderBy behaviour
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      setUsers(userData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { users, loading };
}
