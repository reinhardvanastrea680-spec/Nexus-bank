import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
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

export function useAdminTransactions(statusFilter?: "pending" | "approved" | "declined" | "cancelled") {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Avoid composite index requirement — filter client-side where possible.
    // Only orderBy on a single-field query (no where) is safe without an index.
    let q;
    if (statusFilter) {
      q = query(
        collection(db, "transactions"),
        where("status", "==", statusFilter),
      );
    } else {
      q = query(collection(db, "transactions"));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() ?? new Date(),
        updatedAt: doc.data().updatedAt?.toDate() ?? new Date(),
        reviewedAt: doc.data().reviewedAt?.toDate() ?? null,
      })) as Transaction[];

      // Sort newest first client-side
      txs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      setTransactions(txs);
      setLoading(false);
    });

    return unsubscribe;
  }, [statusFilter]);

  // Derived counts
  const pendingCount = transactions.filter((t) => t.status === "pending").length;
  const approvedCount = transactions.filter((t) => t.status === "approved").length;
  const declinedCount = transactions.filter((t) => t.status === "declined").length;

  return { transactions, loading, pendingCount, approvedCount, declinedCount };
}
