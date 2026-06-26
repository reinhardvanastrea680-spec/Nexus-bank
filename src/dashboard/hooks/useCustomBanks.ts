import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import {
  collection, onSnapshot, addDoc, serverTimestamp,
} from "firebase/firestore";

export interface CustomBank {
  id: string;
  name: string;
  country: string;
  addedAt: Date;
}

export function useCustomBanks() {
  const [customBanks, setCustomBanks] = useState<CustomBank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // No orderBy to avoid needing a composite index — sort client-side
    const unsub = onSnapshot(
      collection(db, "customBanks"),
      (snap) => {
        const banks = snap.docs.map((d) => ({
          id: d.id,
          name: d.data().name || "",
          country: d.data().country || "",
          addedAt: d.data().addedAt?.toDate?.() ?? new Date(),
        }));
        // Sort alphabetically by name client-side
        banks.sort((a, b) => a.name.localeCompare(b.name));
        setCustomBanks(banks);
        setLoading(false);
      },
      (err) => {
        console.error("useCustomBanks snapshot error:", err);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  async function addCustomBank(name: string, country = "") {
    if (!name.trim()) return;
    await addDoc(collection(db, "customBanks"), {
      name: name.trim(),
      country,
      addedAt: serverTimestamp(),
    });
  }

  return { customBanks, loading, addCustomBank };
}
