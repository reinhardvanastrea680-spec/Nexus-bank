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

    // Merge beneficiaries from two sources:
    // 1. Top-level `beneficiaries` collection (user-written, may not include admin-approved)
    // 2. User subcollection `users/{uid}/beneficiaries` (admin-approved always lands here)
    const topLevelMap = new Map<string, Beneficiary>();
    const subCollMap  = new Map<string, Beneficiary>();

    const merge = () => {
      const seen = new Set<string>();
      const merged: Beneficiary[] = [];
      // Subcollection takes precedence (admin-approved)
      for (const [, ben] of subCollMap) {
        const key = `${ben.accountNumber}-${ben.bankId}`;
        if (!seen.has(key)) { seen.add(key); merged.push(ben); }
      }
      for (const [, ben] of topLevelMap) {
        const key = `${ben.accountNumber}-${ben.bankId}`;
        if (!seen.has(key)) { seen.add(key); merged.push(ben); }
      }
      merged.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setBeneficiaries(merged);
      setLoading(false);
    };

    // Listen to top-level collection
    const q1 = query(collection(db, "beneficiaries"), where("userId", "==", userId));
    const unsub1 = onSnapshot(q1, (snap) => {
      topLevelMap.clear();
      snap.docs.forEach((d) => {
        topLevelMap.set(d.id, {
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
        } as Beneficiary);
      });
      merge();
    }, () => { /* ignore permission errors on top-level */ setLoading(false); });

    // Listen to user subcollection (admin-approved beneficiaries always land here)
    const q2 = collection(db, "users", userId, "beneficiaries");
    const unsub2 = onSnapshot(q2, (snap) => {
      subCollMap.clear();
      snap.docs.forEach((d) => {
        subCollMap.set(d.id, {
          id: `sub_${d.id}`,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
        } as Beneficiary);
      });
      merge();
    }, () => { /* ignore errors */ });

    return () => { unsub1(); unsub2(); };
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
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    // Handle both top-level and subcollection IDs
    if (beneficiaryId.startsWith("sub_")) {
      const realId = beneficiaryId.replace(/^sub_/, "");
      await deleteDoc(doc(db, "users", userId, "beneficiaries", realId));
    } else {
      await deleteDoc(doc(db, "beneficiaries", beneficiaryId));
    }
  }

  return { beneficiaries, loading, addBeneficiary, removeBeneficiary };
}
