import { useState, useEffect } from "react";
import { db, auth } from "../../firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

export interface Transaction {
  id: string;
  transactionId: string;
  userId: string;
  userFullName: string;
  userEmail: string;
  type: string;
  subType: string;
  description: string;
  category: string;
  amount: number;
  currency: string;
  fundingAccount: "checking" | "savings";
  recipientName?: string;
  recipientAccount?: string;
  recipientBank?: string;
  note?: string;
  status: "pending" | "approved" | "declined" | "cancelled";
  statusHistory: Array<{
    status: string;
    timestamp: Date;
    changedBy: string;
    changedById: string;
    reason: string;
  }>;
  balanceAtSubmission: number;
  balanceAfter: number | null;
  reviewedByAdminId: string | null;
  reviewedByAdminName: string | null;
  reviewedAt: Date | null;
  declineReason: string | null;
  adminNotified: boolean;
  userNotifiedOfResult: boolean;
  createdAt: Date;
  updatedAt: Date;
  transactionRef: string;
}

export function useUserTransactions(statusFilter?: "pending" | "approved" | "declined" | "cancelled") {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    // Use only a single where clause to avoid needing a composite index.
    // Sort client-side instead.
    let q;
    if (statusFilter) {
      q = query(
        collection(db, "transactions"),
        where("userId", "==", userId),
        where("status", "==", statusFilter),
      );
    } else {
      q = query(
        collection(db, "transactions"),
        where("userId", "==", userId),
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() ?? new Date(),
        updatedAt: doc.data().updatedAt?.toDate() ?? new Date(),
      })) as Transaction[];

      // Sort newest first client-side
      txs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      setTransactions(txs);
      setLoading(false);
    });

    return unsubscribe;
  }, [statusFilter]);

  return { transactions, loading };
}
