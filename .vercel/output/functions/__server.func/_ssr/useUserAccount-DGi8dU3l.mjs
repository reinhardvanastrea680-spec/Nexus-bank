import { r as reactExports } from "../_libs/react.mjs";
import { d as db } from "./router-8iYk_PDV.mjs";
import { o as onSnapshot, d as doc } from "../_libs/firebase__firestore.mjs";
import { u as useUserAuth } from "./useUserAuth-Dj040xaQ.mjs";
function useUserAccount() {
  const { user, loading: authLoading } = useUserAuth();
  const [account, setAccount] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    setLoading(true);
    if (authLoading) {
      return;
    }
    if (!user) {
      setAccount(null);
      setLoading(false);
      return;
    }
    const unsub = onSnapshot(
      doc(db, "users", user.uid),
      (snap) => {
        if (snap.exists()) {
          setAccount({ id: snap.id, ...snap.data() });
        } else {
          setAccount(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching account data:", error);
        setLoading(false);
      }
    );
    return unsub;
  }, [user, authLoading]);
  return { account, loading };
}
export {
  useUserAccount as u
};
