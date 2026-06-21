import { r as reactExports } from "../_libs/react.mjs";
import { d as db } from "./router-8iYk_PDV.mjs";
import { q as query, a as orderBy, c as collection, o as onSnapshot } from "../_libs/firebase__firestore.mjs";
function useTransactions() {
  const [transactions, setTransactions] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const q = query(collection(db, "transactions"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() ?? /* @__PURE__ */ new Date()
      }));
      setTransactions(txData);
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  return { transactions, loading };
}
export {
  useTransactions as u
};
