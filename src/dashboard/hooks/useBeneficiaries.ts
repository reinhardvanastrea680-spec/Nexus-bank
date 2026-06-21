import { useState, useEffect } from "react";
import { db, auth } from "../../firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

export interface Beneficiary {
  id: string;
  userId: string;
  fullName: string;
  nickname: string;
  bankName: string;
  bankId: string;
  accountNumber: string;
  accountType: "Personal" | "Business";
  initials: string;
  createdAt: Date;
}

export function useBeneficiaries() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setBeneficiaries([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "beneficiaries"),
      where("userId", "==", userId),
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate() ?? new Date(),
      })) as Beneficiary[];

      // Sort newest first client-side (avoids composite index)
      data.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setBeneficiaries(data);
      setLoading(false);
    });

    return unsub;
  }, []);

  async function addBeneficiary(data: Omit<Beneficiary, "id" | "userId" | "createdAt">) {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("Not authenticated");

    await addDoc(collection(db, "beneficiaries"), {
      ...data,
      userId,
      createdAt: serverTimestamp(),
    });
  }

  async function removeBeneficiary(beneficiaryId: string) {
    await deleteDoc(doc(db, "beneficiaries", beneficiaryId));
  }

  return { beneficiaries, loading, addBeneficiary, removeBeneficiary };
}
