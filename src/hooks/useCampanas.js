import { useState, useEffect } from 'react';
import {
  collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION = 'campanas';

export function useCampanas() {
  const [campanas, setCampanas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, COLLECTION), orderBy('createdAt', 'desc')),
      (snap) => {
        setCampanas(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const addCampana = async (data) => {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  };

  const updateCampana = async (id, data) => {
    await updateDoc(doc(db, COLLECTION, id), data);
  };

  const deleteCampana = async (id) => {
    await deleteDoc(doc(db, COLLECTION, id));
  };

  return { campanas, loading, addCampana, updateCampana, deleteCampana };
}
