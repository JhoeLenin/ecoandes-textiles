import { useState, useEffect } from 'react';
import {
  collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION = 'proveedores';

// Proveedores de la cadena de suministro (empresas que abastecen el inventario).
export function useProveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, COLLECTION), orderBy('createdAt', 'desc')),
      (snap) => {
        setProveedores(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, []);

  const addProveedor = (data) => addDoc(collection(db, COLLECTION), { ...data, createdAt: new Date().toISOString() });
  const updateProveedor = (id, data) => updateDoc(doc(db, COLLECTION, id), data);
  const deleteProveedor = (id) => deleteDoc(doc(db, COLLECTION, id));

  return { proveedores, loading, addProveedor, updateProveedor, deleteProveedor };
}
