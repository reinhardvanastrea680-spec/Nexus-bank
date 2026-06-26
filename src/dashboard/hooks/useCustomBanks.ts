import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, onSnapshot, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";

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
    const q = query(collection(db, "customBanks"), orderBy("addedAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setCustomBanks(
        snap.docs.map((d) => ({
          id: d.id,
          name: d.data().name,
          country: d.data().country || "",
          addedAt: d.data().addedAt?.toDate?.() ?? new Date(),
        }))
      );
      setLoading(false);
    });
    return unsub;
  }, []);

  async function addCustomBank(name: string, country = "") {
    // Prevent duplicates (case-insensitive)
    const exists = customBanks.some(
      (b) => b.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) return;
    await addDoc(collection(db, "customBanks"), {
      name: name.trim(),
      country,
      addedAt: serverTimestamp(),
    });
  }

  return { customBanks, loading, addCustomBank };
}
