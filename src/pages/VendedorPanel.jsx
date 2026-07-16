import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

// Panel de vendedor (Fase 1: resumen de la tienda). La gestión de productos
// y ventas se agrega en la Fase 2.
export default function VendedorPanel() {
  const { user, isSeller, loading } = useAuth();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);

  useEffect(() => {
    if (!loading && (!user || !isSeller)) navigate('/vendedor/registro', { replace: true });
  }, [user, isSeller, loading, navigate]);

  useEffect(() => {
    if (user && isSeller) {
      getDoc(doc(db, 'vendedores', user.uid)).then((s) => s.exists() && setStore(s.data()));
    }
  }, [user, isSeller]);

  if (loading || !isSeller) return <div className="admin-loading">Cargando...</div>;

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <div className="seller-store-head">
          {store?.logo
            ? <img src={store.logo} alt={store.storeName} className="seller-logo" />
            : <div className="seller-logo seller-logo-empty"><i className="fa-solid fa-store" /></div>}
          <div>
            <span className="section-eyebrow">Panel de vendedor</span>
            <h1 className="section-title left" style={{ margin: 0 }}>{store?.storeName || 'Mi tienda'}</h1>
            {store?.description && <p style={{ color: 'var(--ink-soft)' }}>{store.description}</p>}
          </div>
        </div>

        <div className="stats-grid" style={{ marginTop: '1.5rem' }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--terracotta)' }}><i className="fa-solid fa-box" /></div>
            <div className="stat-info"><span className="stat-value">—</span><span className="stat-label">Mis productos</span></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--forest)' }}><i className="fa-solid fa-cart-shopping" /></div>
            <div className="stat-info"><span className="stat-value">—</span><span className="stat-label">Ventas</span></div>
          </div>
        </div>

        <p style={{ color: 'var(--ink-soft)', marginTop: '1.5rem' }}>
          <i className="fa-solid fa-hammer" /> La gestión de productos y el detalle de ventas se habilitan próximamente.
        </p>
        <Link to="/" className="btn btn-outline" style={{ marginTop: '1rem' }}>Volver a la tienda</Link>
      </div>
    </section>
  );
}
