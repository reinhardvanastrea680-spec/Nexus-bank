import { r as reactExports } from "../_libs/react.mjs";
import { a as auth, d as db } from "./router-8iYk_PDV.mjs";
import { q as query, w as where, c as collection, o as onSnapshot, f as deleteDoc, d as doc, b as addDoc, s as serverTimestamp } from "../_libs/firebase__firestore.mjs";
function useBeneficiaries() {
  const [beneficiaries, setBeneficiaries] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setBeneficiaries([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, "beneficiaries"),
      where("userId", "==", userId)
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate() ?? /* @__PURE__ */ new Date()
      }));
      data.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setBeneficiaries(data);
      setLoading(false);
    });
    return unsub;
  }, []);
  async function addBeneficiary(data) {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("Not authenticated");
    await addDoc(collection(db, "beneficiaries"), {
      ...data,
      userId,
      createdAt: serverTimestamp()
    });
  }
  async function removeBeneficiary(beneficiaryId) {
    await deleteDoc(doc(db, "beneficiaries", beneficiaryId));
  }
  return { beneficiaries, loading, addBeneficiary, removeBeneficiary };
}
export {
  useBeneficiaries as u
};
