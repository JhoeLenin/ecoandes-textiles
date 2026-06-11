import { useState, useEffect } from 'react';
import {
  collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION = 'offers';

export function useOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, COLLECTION), orderBy('createdAt', 'desc')),
      (snap) => {
        setOffers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const addOffer = async (data) => {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  };

  const updateOffer = async (id, data) => {
    await updateDoc(doc(db, COLLECTION, id), data);
  };

  const deleteOffer = async (id) => {
    await deleteDoc(doc(db, COLLECTION, id));
  };

  return { offers, loading, addOffer, updateOffer, deleteOffer };
}
