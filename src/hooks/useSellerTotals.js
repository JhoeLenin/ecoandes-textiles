import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

// Agrega ventas por vendedor a partir de todos los pedidos.
// Devuelve un mapa { [sellerId]: { bruto, units, orders } }.
export function useSellerTotals() {
  const [totals, setTotals] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'orders'),
      (snap) => {
        const acc = {};
        snap.docs.forEach((d) => {
          const o = d.data();
          (o.items || []).forEach((i) => {
            if (!i.sellerId) return;
            const t = acc[i.sellerId] || { bruto: 0, units: 0, orders: new Set() };
            t.bruto += (i.price || 0) * (i.qty || 0);
            t.units += i.qty || 0;
            t.orders.add(d.id);
            acc[i.sellerId] = t;
          });
        });
        // Convertir Set de pedidos a conteo.
        const out = {};
        Object.entries(acc).forEach(([k, v]) => { out[k] = { bruto: v.bruto, units: v.units, orders: v.orders.size }; });
        setTotals(out);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, []);

  return { totals, loading };
}
