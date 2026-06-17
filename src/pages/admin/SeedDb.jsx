import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { PRODUCTS, CATEGORIES } from '../../data/products';

export default function SeedDb() {
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState([]);

  const addLog = (msg) => setLog((l) => [...l, msg]);

  const handleSeed = async () => {
    if (!confirm('¿Poblar Firestore con datos iniciales?')) return;
    setLoading(true);
    setLog([]);

    try {
      addLog('Creando categorías...');
      for (const cat of CATEGORIES) {
        const ref = await addDoc(collection(db, 'categories'), { name: cat.name, image: '' });
        addLog(`  ✓ ${cat.name}`);
      }

      addLog('Creando productos...');
      for (const p of PRODUCTS) {
        const ref = await addDoc(collection(db, 'products'), {
          ...p,
          images: [],
          createdAt: new Date().toISOString(),
        });
        addLog(`  ✓ ${p.id} — ${p.name}`);
      }

      addLog('Creando ofertas...');
      await addDoc(collection(db, 'offers'), {
        name: 'Liquidación de Temporada',
        discountType: 'percent',
        discountValue: 20,
        startDate: '2026-06-01',
        endDate: '2026-07-31',
        active: true,
        productIds: ['PROD-01', 'PROD-03', 'PROD-05', 'PROD-08', 'PROD-11'],
        createdAt: new Date().toISOString(),
      });
      addLog('  ✓ Liquidación de Temporada');

      await addDoc(collection(db, 'offers'), {
        name: 'Envío Gratis + Descuento',
        discountType: 'fixed',
        discountValue: 15,
        startDate: '2026-06-15',
        endDate: '2026-07-15',
        active: true,
        productIds: ['PROD-02', 'PROD-04', 'PROD-06', 'PROD-10'],
        createdAt: new Date().toISOString(),
      });
      addLog('  ✓ Envío Gratis + Descuento');

      addLog('\n✅ Base de datos poblada correctamente.');
    } catch (err) {
      addLog(`\n❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <h1 className="admin-title">Poblar Base de Datos</h1>
      <p style={{ marginBottom: '1rem', color: '#666' }}>
        Este botón inserta las 3 categorías, 12 productos y 2 ofertas en Firestore.
      </p>
      <button className="btn btn-primary" onClick={handleSeed} disabled={loading}>
        {loading ? 'Poblando...' : 'Poblar Firestore'}
      </button>
      {log.length > 0 && (
        <pre style={{ marginTop: '1rem', background: '#f5f5f5', padding: '1rem', borderRadius: '8px', whiteSpace: 'pre-wrap' }}>
          {log.join('\n')}
        </pre>
      )}
    </div>
  );
}
