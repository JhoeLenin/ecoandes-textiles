import { useState, useEffect } from 'react';
import {
  collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION = 'clientes';

export function useClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, COLLECTION), orderBy('createdAt', 'desc')),
      (snap) => {
        setClientes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const addCliente = async (data) => {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  };

  const updateCliente = async (id, data) => {
    await updateDoc(doc(db, COLLECTION, id), data);
  };

  const deleteCliente = async (id) => {
    await deleteDoc(doc(db, COLLECTION, id));
  };

  return { clientes, loading, addCliente, updateCliente, deleteCliente };
}
