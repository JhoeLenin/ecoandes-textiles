import { useState, useEffect } from 'react';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import { uploadToCloudinary } from '../lib/cloudinary';

const COLLECTION = 'categories';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, COLLECTION), orderBy('name')),
      (snap) => {
        setCategories(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const addCategory = async (data, imageFile) => {
    let image = '';
    if (imageFile) {
      image = await uploadToCloudinary(imageFile, 'categories');
    }
    const docRef = await addDoc(collection(db, COLLECTION), { ...data, image });
    return docRef.id;
  };

  const updateCategory = async (id, data, imageFile) => {
    const update = { ...data };
    if (imageFile) {
      update.image = await uploadToCloudinary(imageFile, 'categories');
    }
    await updateDoc(doc(db, COLLECTION, id), update);
  };

  const deleteCategory = async (id) => {
    await deleteDoc(doc(db, COLLECTION, id));
  };

  return { categories, loading, addCategory, updateCategory, deleteCategory };
}
