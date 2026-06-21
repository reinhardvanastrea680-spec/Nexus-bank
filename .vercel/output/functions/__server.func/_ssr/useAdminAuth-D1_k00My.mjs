import { r as reactExports } from "../_libs/react.mjs";
import { a as auth, d as db } from "./router-8iYk_PDV.mjs";
import { o as onAuthStateChanged, a as signOut, c as signInWithEmailAndPassword } from "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import { u as updateDoc, s as serverTimestamp, d as doc } from "../_libs/firebase__firestore.mjs";
import { A as ADMIN_UID } from "./adminConfig-D-CDJgKq.mjs";
function useAdminAuth() {
  const [admin, setAdmin] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user && user.uid === ADMIN_UID) {
        setAdmin(user);
      } else {
        if (user) await signOut(auth);
        setAdmin(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);
  async function adminLogin(email, password) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    if (result.user.uid !== ADMIN_UID) {
      await signOut(auth);
      throw new Error("Access denied. This console is restricted.");
    }
    await updateDoc(doc(db, "admins", ADMIN_UID), {
      lastLoginAt: serverTimestamp()
    });
    return result.user;
  }
  async function adminLogout() {
    await signOut(auth);
  }
  return { admin, loading, adminLogin, adminLogout };
}
export {
  useAdminAuth as u
};
