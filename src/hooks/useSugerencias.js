import { useState, useEffect } from 'react';
import {
  collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION = 'sugerencias';

export function useSugerencias() {
  const [sugerencias, setSugerencias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, COLLECTION), orderBy('createdAt', 'desc')),
      (snap) => {
        setSugerencias(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const addSugerencia = async (data) => {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  };

  const updateSugerencia = async (id, data) => {
    await updateDoc(doc(db, COLLECTION, id), data);
  };

  const deleteSugerencia = async (id) => {
    await deleteDoc(doc(db, COLLECTION, id));
  };

  return { sugerencias, loading, addSugerencia, updateSugerencia, deleteSugerencia };
}
