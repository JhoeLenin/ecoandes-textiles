import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
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
      const next = favorites.includes(id)
        ? favorites.filter((x) => x !== id)
        : [...favorites, id];
      await setDoc(doc(db, 'favorites', user.uid), { productIds: next }, { merge: true });
    },
    [user, favorites]
  );

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
