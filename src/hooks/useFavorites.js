import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

// Favoritos por usuario en Firestore: favorites/{uid} = { productIds: [] }
export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }
    const ref = doc(db, 'favorites', user.uid);
    const unsub = onSnapshot(ref, (snap) => {
      setFavorites(snap.exists() ? snap.data().productIds || [] : []);
    });
    return unsub;
  }, [user]);

  const toggleFavorite = useCallback(
    async (id) => {
      if (!user) return;
      const ref = doc(db, 'favorites', user.uid);
      const snap = await getDoc(ref);
      const current = snap.exists() ? snap.data().productIds || [] : [];
      const next = current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id];
      await setDoc(ref, { productIds: next }, { merge: true });
    },
    [user]
  );

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
