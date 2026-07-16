import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { useSellerSales } from '../hooks/useSellerSales';
import { formatPrice } from '../context/CatalogContext';

// Índice del portal de vendedor: resumen de tienda + métricas reales.
export default function VendedorPanel() {
  const { user } = useAuth();
  const { products } = useProducts();
  const { totalRevenue, orderCount } = useSellerSales(user?.uid);
  const [store, setStore] = useState(null);

  useEffect(() => {
    if (user) getDoc(doc(db, 'vendedores', user.uid)).then((s) => s.exists() && setStore(s.data()));
  }, [user]);

  const myProducts = products.filter((p) => p.sellerId === user?.uid);

  return (
    <>
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
          <div className="stat-info"><span className="stat-value">{myProducts.length}</span><span className="stat-label">Mis productos</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--forest)' }}><i className="fa-solid fa-cart-shopping" /></div>
          <div className="stat-info"><span className="stat-value">{orderCount}</span><span className="stat-label">Pedidos con mis productos</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--gold)' }}><i className="fa-solid fa-sack-dollar" /></div>
          <div className="stat-info"><span className="stat-value">{formatPrice(totalRevenue)}</span><span className="stat-label">Ingresos (bruto)</span></div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
        <Link to="/vendedor/productos" className="btn btn-primary"><i className="fa-solid fa-plus" /> Gestionar productos</Link>
        <Link to="/vendedor/ventas" className="btn btn-outline"><i className="fa-solid fa-chart-line" /> Ver ventas</Link>
      </div>
    </>
  );
}
