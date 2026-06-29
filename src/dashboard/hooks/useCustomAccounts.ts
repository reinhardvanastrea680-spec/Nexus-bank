import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import type { CustomAccount } from "../../admin/utils/customAccountOps";

/**
 * Real-time listener for a user's custom accounts subcollection.
 * Used by both the user dashboard (index.tsx) and the admin accounts page.
 */
export function useCustomAccounts(userId: string | null | undefined) {
  const [customAccounts, setCustomAccounts] = useState<CustomAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setCustomAccounts([]);
      setLoading(false);
      return;
    }

    // Use a simple collection query without orderBy to avoid needing a composite index.
    // Sort client-side instead.
    const q = query(collection(db, "users", userId, "customAccounts"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as CustomAccount);
        // Sort by createdAt ascending (handles both Timestamp and Date)
        docs.sort((a, b) => {
          const ta = a.createdAt?.toMillis?.() ?? a.createdAt?.getTime?.() ?? 0;
          const tb = b.createdAt?.toMillis?.() ?? b.createdAt?.getTime?.() ?? 0;
          return ta - tb;
        });
        setCustomAccounts(docs);
        setLoading(false);
      },
      (err) => {
        console.error("useCustomAccounts error:", err);
        setCustomAccounts([]);
        setLoading(false);
      },
    );

    return unsub;
  }, [userId]);

  return { customAccounts, loading };
}
