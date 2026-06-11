import { useState, useEffect } from 'react';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

const COLLECTION = 'products';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, COLLECTION), orderBy('createdAt', 'desc')),
      (snap) => {
        setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const addProduct = async (data, images = []) => {
    const urls = await uploadImages(images);
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      images: urls,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  };

  const updateProduct = async (id, data, newImages = [], keptImages = []) => {
    let urls = [...keptImages];
    if (newImages.length > 0) {
      const uploaded = await uploadImages(newImages);
      urls = [...urls, ...uploaded];
    }
    await updateDoc(doc(db, COLLECTION, id), { ...data, images: urls });
  };

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, COLLECTION, id));
  };

  return { products, loading, addProduct, updateProduct, deleteProduct };
}

async function uploadImages(files) {
  const urls = [];
  for (const file of files) {
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    const snap = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snap.ref);
    urls.push(url);
  }
  return urls;
}
