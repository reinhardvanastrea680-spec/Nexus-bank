import { r as reactExports } from "../_libs/react.mjs";
import { d as db } from "./router-8iYk_PDV.mjs";
import { q as query, w as where, c as collection, o as onSnapshot } from "../_libs/firebase__firestore.mjs";
function useAdminTransactions(statusFilter) {
  const [transactions, setTransactions] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    let q;
    if (statusFilter) {
      q = query(
        collection(db, "transactions"),
        where("status", "==", statusFilter)
      );
    } else {
      q = query(collection(db, "transactions"));
    }
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() ?? /* @__PURE__ */ new Date(),
        updatedAt: doc.data().updatedAt?.toDate() ?? /* @__PURE__ */ new Date(),
        reviewedAt: doc.data().reviewedAt?.toDate() ?? null
      }));
      txs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setTransactions(txs);
      setLoading(false);
    });
    return unsubscribe;
  }, [statusFilter]);
  const pendingCount = transactions.filter((t) => t.status === "pending").length;
  const approvedCount = transactions.filter((t) => t.status === "approved").length;
  const declinedCount = transactions.filter((t) => t.status === "declined").length;
  return { transactions, loading, pendingCount, approvedCount, declinedCount };
}
export {
  useAdminTransactions as u
};
