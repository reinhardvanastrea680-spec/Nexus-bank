import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { doc, onSnapshot } from "firebase/firestore";

export function useSystemSettings() {
  const [settings, setSettings] = useState({
    chatEnabled: true,
    dashboardEnabled: true
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "global"), (snap) => {
      if (snap.exists()) setSettings(snap.data() as any);
    });
    return unsub;
  }, []);

  return settings;
}