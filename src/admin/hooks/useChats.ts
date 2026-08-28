import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import {
  collection, onSnapshot, orderBy, query
} from "firebase/firestore";

export function useChats() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "chats"),
      orderBy("lastMessageAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setChats(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return unsub;
  }, []);

  // Total unread count across all chats (for sidebar badge)
  const totalUnread = chats.reduce((sum, c: any) => sum + (c.unreadByAdmin || 0), 0);

  return { chats, loading, totalUnread };
}