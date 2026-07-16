import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

// Ventas de un vendedor: pedidos que contienen items suyos (item.sellerId === uid).
// Calcula el subtotal correspondiente al vendedor por pedido.
export function useSellerSales(uid) {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setLoading(false); return; }
    const unsub = onSnapshot(
      query(collection(db, 'orders'), orderBy('createdAt', 'desc')),
      (snap) => {
        const rows = [];
        snap.docs.forEach((d) => {
          const o = { id: d.id, ...d.data() };
          const mine = (o.items || []).filter((i) => i.sellerId === uid);
          if (mine.length === 0) return;
          const sellerTotal = mine.reduce((s, i) => s + (i.price || 0) * (i.qty || 0), 0);
          const sellerUnits = mine.reduce((s, i) => s + (i.qty || 0), 0);
          rows.push({ ...o, sellerItems: mine, sellerTotal, sellerUnits });
        });
        setSales(rows);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [uid]);

  const totalRevenue = sales.reduce((s, r) => s + r.sellerTotal, 0);
  const totalUnits = sales.reduce((s, r) => s + r.sellerUnits, 0);

  return { sales, loading, totalRevenue, totalUnits, orderCount: sales.length };
}
