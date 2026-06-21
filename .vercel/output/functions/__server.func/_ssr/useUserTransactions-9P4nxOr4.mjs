import { r as reactExports } from "../_libs/react.mjs";
import { a as auth, d as db } from "./router-8iYk_PDV.mjs";
import { q as query, w as where, c as collection, o as onSnapshot } from "../_libs/firebase__firestore.mjs";
function useUserTransactions(statusFilter) {
  const [transactions, setTransactions] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setTransactions([]);
      setLoading(false);
      return;
    }
    let q;
    {
      q = query(
        collection(db, "transactions"),
        where("userId", "==", userId)
      );
    }
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() ?? /* @__PURE__ */ new Date(),
        updatedAt: doc.data().updatedAt?.toDate() ?? /* @__PURE__ */ new Date()
      }));
      txs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setTransactions(txs);
      setLoading(false);
    });
    return unsubscribe;
  }, [statusFilter]);
  return { transactions, loading };
}
export {
  useUserTransactions as u
};
