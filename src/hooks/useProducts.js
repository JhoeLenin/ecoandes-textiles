import { useState, useEffect } from 'react';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';
import { uploadManyToCloudinary } from '../lib/cloudinary';

const COLLECTION = 'products';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, COLLECTION), orderBy('createdAt', 'desc')),
      (snap) => {
        // docId = id real del doc Firestore (para escribir).
        // id = id lógico del campo (PROD-XX, usado por tienda/ofertas); si no existe, cae al docId.
        setProducts(snap.docs.map((d) => ({ ...d.data(), docId: d.id, id: d.data().id || d.id })));
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
  if (!files || files.length === 0) return [];
  return uploadManyToCloudinary(files, 'products');
}
