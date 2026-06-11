import { useState, useEffect } from 'react';
import { collection, updateDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION = 'orders';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, COLLECTION), orderBy('createdAt', 'desc')),
      (snap) => {
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const updateOrderStatus = async (id, status) => {
    await updateDoc(doc(db, COLLECTION, id), { status });
  };

  return { orders, loading, updateOrderStatus };
}
