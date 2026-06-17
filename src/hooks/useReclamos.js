import { useState, useEffect } from 'react';
import {
  collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION = 'reclamos';

export function useReclamos() {
  const [reclamos, setReclamos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, COLLECTION), orderBy('createdAt', 'desc')),
      (snap) => {
        setReclamos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const addReclamo = async (data) => {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  };

  const updateReclamo = async (id, data) => {
    await updateDoc(doc(db, COLLECTION, id), data);
  };

  const deleteReclamo = async (id) => {
    await deleteDoc(doc(db, COLLECTION, id));
  };

  return { reclamos, loading, addReclamo, updateReclamo, deleteReclamo };
}
