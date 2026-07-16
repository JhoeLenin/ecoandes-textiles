import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const REF = () => doc(db, 'config', 'marketplace');
const DEFAULT_RATE = 0.10; // 10 % comisión por defecto

// Configuración global del marketplace (tasa de comisión).
export function useMarketplaceConfig() {
  const [commissionRate, setCommissionRate] = useState(DEFAULT_RATE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      REF(),
      (snap) => {
        const r = snap.exists() ? snap.data().commissionRate : undefined;
        setCommissionRate(typeof r === 'number' ? r : DEFAULT_RATE);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, []);

  // Guarda la tasa (0–1). Recibe porcentaje 0–100 y lo normaliza.
  const saveCommissionPct = (pct) => {
    const rate = Math.min(1, Math.max(0, Number(pct) / 100));
    return setDoc(REF(), { commissionRate: rate }, { merge: true });
  };

  return { commissionRate, loading, saveCommissionPct };
}
