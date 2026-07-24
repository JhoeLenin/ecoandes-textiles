import { useState, useEffect } from 'react';
import {
  collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, getDoc
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION = 'ordenesCompra';

// Órdenes de compra a proveedores. Al recibirse, incrementan el stock del producto.
export function useOrdenesCompra() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, COLLECTION), orderBy('createdAt', 'desc')),
      (snap) => {
        setOrdenes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, []);

  const addOrden = (data) => addDoc(collection(db, COLLECTION), {
    ...data, status: 'solicitado', createdAt: new Date().toISOString(),
  });

  const updateOrden = (id, data) => updateDoc(doc(db, COLLECTION, id), data);
  const deleteOrden = (id) => deleteDoc(doc(db, COLLECTION, id));

  // Marca la orden como recibida y suma las cantidades al stock de cada producto.
  const recibirOrden = async (orden) => {
    for (const it of orden.items || []) {
      if (!it.productId) continue;
      const ref = doc(db, 'products', it.productId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const current = Number(snap.data().stock) || 0;
        await updateDoc(ref, { stock: current + (Number(it.qty) || 0) });
      }
    }
    await updateDoc(doc(db, COLLECTION, orden.id), {
      status: 'recibido', receivedAt: new Date().toISOString(),
    });
  };

  return { ordenes, loading, addOrden, updateOrden, deleteOrden, recibirOrden };
}
