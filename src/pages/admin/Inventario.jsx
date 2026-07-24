import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { REORDER_POINT } from '../../data/scm';
import { formatPrice } from '../../context/CatalogContext';

function estadoStock(stock) {
  if (stock <= 0) return { label: 'Agotado', cls: 'badge-danger' };
  if (stock <= REORDER_POINT) return { label: 'Bajo', cls: 'badge-warning' };
  return { label: 'OK', cls: 'badge-success' };
}

export default function Inventario() {
  const { products, loading } = useProducts();
  const { categories } = useCategories();

  if (loading) return <div className="admin-loading">Cargando inventario...</div>;

  const totalSku = products.length;
  const bajos = products.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= REORDER_POINT);
  const agotados = products.filter((p) => (p.stock || 0) <= 0);
  const valor = products.reduce((s, p) => s + (Number(p.stock) || 0) * (Number(p.priceList) || 0), 0);

  // Ordena mostrando primero lo crítico (menor stock arriba).
  const ordenados = [...products].sort((a, b) => (a.stock || 0) - (b.stock || 0));

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Inventario</h1>
        <Link to="/admin/ordenes-compra" className="btn btn-primary">
          <i className="fa-solid fa-file-invoice" /> Generar orden de compra
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--terracotta)' }}><i className="fa-solid fa-boxes-stacked" /></div>
          <div className="stat-info"><span className="stat-value">{totalSku}</span><span className="stat-label">SKU en catálogo</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--gold)' }}><i className="fa-solid fa-triangle-exclamation" /></div>
          <div className="stat-info"><span className="stat-value">{bajos.length}</span><span className="stat-label">En alerta de reposición</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--clay)' }}><i className="fa-solid fa-circle-xmark" /></div>
          <div className="stat-info"><span className="stat-value">{agotados.length}</span><span className="stat-label">Agotados</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--forest)' }}><i className="fa-solid fa-sack-dollar" /></div>
          <div className="stat-info"><span className="stat-value">{formatPrice(valor)}</span><span className="stat-label">Valor de inventario</span></div>
        </div>
      </div>

      {(bajos.length > 0 || agotados.length > 0) && (
        <div className="admin-section">
          <p style={{ color: 'var(--ink-soft)' }}>
            <i className="fa-solid fa-bell" /> {agotados.length + bajos.length} producto(s) requieren reposición (punto de reorden: {REORDER_POINT} unidades).
          </p>
        </div>
      )}

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Producto</th><th>Categoría</th><th>Stock</th><th>Punto reorden</th><th>Estado</th><th>Valor (costo)</th></tr>
          </thead>
          <tbody>
            {ordenados.map((p) => {
              const cat = categories.find((c) => c.id === p.category);
              const st = estadoStock(p.stock || 0);
              return (
                <tr key={p.docId || p.id}>
                  <td>{p.name}</td>
                  <td>{cat?.name || '—'}</td>
                  <td>{p.stock || 0}</td>
                  <td>{REORDER_POINT}</td>
                  <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                  <td>{formatPrice((Number(p.stock) || 0) * (Number(p.priceList) || 0))}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {products.length === 0 && <p className="empty-msg">Sin productos en inventario</p>}
      </div>
    </div>
  );
}
