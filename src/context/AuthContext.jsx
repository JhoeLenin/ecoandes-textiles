import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext(null);

const ADMIN_EMAIL = 'admin@ecoandes.com';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // doc users/{uid} (incluye role)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubProfile = null;
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (unsubProfile) { unsubProfile(); unsubProfile = null; }
      if (u) {
        // Suscripción al perfil: el rol puede cambiar (p.ej. al hacerse vendedor).
        unsubProfile = onSnapshot(doc(db, 'users', u.uid), (snap) => {
          setProfile(snap.exists() ? snap.data() : null);
          setLoading(false);
        }, () => setLoading(false));
      } else {
        setProfile(null);
        setLoading(false);
      }
    });
    return () => { unsub(); if (unsubProfile) unsubProfile(); };
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const register = async (name, email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name) await updateProfile(cred.user, { displayName: name });
    await setDoc(doc(db, 'users', cred.user.uid), {
      name: name || '',
      email,
      role: 'cliente',
      createdAt: new Date().toISOString(),
    });
    return cred;
  };

  // Convierte al usuario logueado en vendedor: crea su tienda y actualiza su rol.
  const becomeSeller = async (store) => {
    if (!user) throw new Error('Debes iniciar sesión');
    const existing = await getDoc(doc(db, 'vendedores', user.uid));
    if (existing.exists()) throw new Error('Ya tienes una tienda registrada');
    await setDoc(doc(db, 'vendedores', user.uid), {
      uid: user.uid,
      storeName: store.storeName.trim(),
      description: (store.description || '').trim(),
      phone: (store.phone || '').trim(),
      logo: store.logo || '',
      status: 'activo',
      createdAt: new Date().toISOString(),
    });
    await setDoc(doc(db, 'users', user.uid), { role: 'seller', vendedorId: user.uid }, { merge: true });
  };

  const logout = () => signOut(auth);
  const isAdmin = user?.email === ADMIN_EMAIL;
  const role = profile?.role || (isAdmin ? 'admin' : 'cliente');
  const isSeller = role === 'seller';
  const isCustomer = !!user && !isAdmin;

  return (
    <AuthContext.Provider
      value={{ user, profile, role, loading, login, register, becomeSeller, logout, isAdmin, isSeller, isCustomer }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
