import { r as reactExports } from "../_libs/react.mjs";
import { a as auth } from "./router-8iYk_PDV.mjs";
import { o as onAuthStateChanged, a as signOut, c as signInWithEmailAndPassword } from "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import { A as ADMIN_UID } from "./adminConfig-D-CDJgKq.mjs";
function useUserAuth() {
  const [user, setUser] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.uid === ADMIN_UID) {
        signOut(auth);
        setUser(null);
      } else {
        setUser(firebaseUser);
      }
      setLoading(false);
    });
    return unsub;
  }, []);
  const userLogin = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    if (result.user.uid === ADMIN_UID) {
      await signOut(auth);
      throw new Error("Please use the admin login page!");
    }
    return result.user;
  };
  const userLogout = async () => {
    await signOut(auth);
  };
  return { user, loading, userLogin, userLogout };
}
export {
  useUserAuth as u
};
