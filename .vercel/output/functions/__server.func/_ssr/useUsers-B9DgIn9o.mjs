import { r as reactExports } from "../_libs/react.mjs";
import { d as db } from "./router-8iYk_PDV.mjs";
import { q as query, a as orderBy, c as collection, o as onSnapshot } from "../_libs/firebase__firestore.mjs";
function useUsers() {
  const [users, setUsers] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamps to JS Dates for display
        createdAt: doc.data().createdAt?.toDate() ?? /* @__PURE__ */ new Date()
      }));
      setUsers(userData);
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  return { users, loading };
}
export {
  useUsers as u
};
