import { useState, useEffect } from "react";
import { db, auth } from "../../firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
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
  status: "pending" | "approved" | "declined" | "cancelled" | "completed" | "failed";
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

    // 1. Listen to user's account for transactionDateFilter changes
    let transactionDateFilter: Date | null = null;
    let txUnsubscribe: (() => void) | null = null;

    const subscribeToTransactions = () => {
      if (txUnsubscribe) txUnsubscribe();

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

      txUnsubscribe = onSnapshot(q, (snapshot) => {
        let txs = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
          updatedAt: d.data().updatedAt?.toDate?.() ?? new Date(),
        })) as Transaction[];

        // Apply the admin-controlled date visibility filter if set
        if (transactionDateFilter) {
          txs = txs.filter((tx) => tx.createdAt >= transactionDateFilter!);
        }

        // Sort newest first client-side
        txs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        setTransactions(txs);
        setLoading(false);
      });
    };

    // 2. Watch user document for transactionDateFilter field
    const userUnsub = onSnapshot(doc(db, "users", userId), (snap) => {
      if (snap.exists()) {
        const raw = snap.data().transactionDateFilter;
        if (raw) {
          transactionDateFilter = raw?.toDate ? raw.toDate() : new Date(raw);
        } else {
          transactionDateFilter = null;
        }
      } else {
        transactionDateFilter = null;
      }
      // Re-subscribe transactions whenever the filter changes
      subscribeToTransactions();
    });

    return () => {
      userUnsub();
      if (txUnsubscribe) txUnsubscribe();
    };
  }, [statusFilter]);

  return { transactions, loading };
}
