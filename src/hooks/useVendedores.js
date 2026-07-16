import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, getDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION = 'vendedores';

// Lista de vendedores en tiempo real + operaciones admin.
export function useVendedores() {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, COLLECTION), orderBy('createdAt', 'desc')),
      (snap) => {
        setVendedores(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, []);

  const updateVendedor = (id, data) => updateDoc(doc(db, COLLECTION, id), data);
  const deleteVendedor = (id) => deleteDoc(doc(db, COLLECTION, id));

  return { vendedores, loading, updateVendedor, deleteVendedor };
}

// Un solo vendedor por id (para la página pública). One-shot.
export function useVendedor(id) {
  const [vendedor, setVendedor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    let active = true;
    getDoc(doc(db, COLLECTION, id))
      .then((snap) => { if (active) { setVendedor(snap.exists() ? { id: snap.id, ...snap.data() } : null); setLoading(false); } })
      .catch(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  return { vendedor, loading };
}
