import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, onSnapshot, query } from "firebase/firestore";
import type { CustomAccount } from "../../admin/utils/customAccountOps";

/**
 * Real-time listener for a user's custom accounts subcollection.
 * - Starts loading=true immediately when userId is known so the parent
 *   can defer showing totals until data is confirmed.
 * - Sorts client-side (no composite index needed).
 * - Works for any future custom accounts automatically.
 */
export function useCustomAccounts(userId: string | null | undefined) {
  const [customAccounts, setCustomAccounts] = useState<CustomAccount[]>([]);
  const [loading, setLoading] = useState(!!userId); // true if we have a userId

  useEffect(() => {
    if (!userId) {
      setCustomAccounts([]);
      setLoading(false);
      return;
    }

    setLoading(true); // reset loading when userId changes

    const q = query(collection(db, "users", userId, "customAccounts"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as CustomAccount);
        docs.sort((a, b) => {
          const ta = (a.createdAt as any)?.toMillis?.() ?? (a.createdAt as any)?.getTime?.() ?? 0;
          const tb = (b.createdAt as any)?.toMillis?.() ?? (b.createdAt as any)?.getTime?.() ?? 0;
          return ta - tb;
        });
        setCustomAccounts(docs);
        setLoading(false);
      },
      (err) => {
        console.error("useCustomAccounts snapshot error:", err);
        setLoading(false);
      },
    );

    return unsub;
  }, [userId]);

  return { customAccounts, loading };
}
