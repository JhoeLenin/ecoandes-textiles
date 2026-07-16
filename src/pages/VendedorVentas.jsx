import { useAuth } from '../context/AuthContext';
import { useSellerSales } from '../hooks/useSellerSales';
import { formatPrice } from '../context/CatalogContext';

const fecha = (iso) => {
  try { return new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return '—'; }
};

export default function VendedorVentas() {
  const { user } = useAuth();
  const { sales, loading, totalRevenue, totalUnits, orderCount } = useSellerSales(user?.uid);

  if (loading) return <div className="admin-loading">Cargando ventas...</div>;

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Mis ventas</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--forest)' }}><i className="fa-solid fa-cart-shopping" /></div>
          <div className="stat-info"><span className="stat-value">{orderCount}</span><span className="stat-label">Pedidos</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--terracotta)' }}><i className="fa-solid fa-boxes-stacked" /></div>
          <div className="stat-info"><span className="stat-value">{totalUnits}</span><span className="stat-label">Unidades vendidas</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--gold)' }}><i className="fa-solid fa-sack-dollar" /></div>
          <div className="stat-info"><span className="stat-value">{formatPrice(totalRevenue)}</span><span className="stat-label">Ingresos (bruto)</span></div>
        </div>
      </div>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Fecha</th><th>Cliente</th><th>Mis productos</th><th>Unid.</th><th>Subtotal</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {sales.map((o) => (
              <tr key={o.id}>
                <td>{fecha(o.createdAt)}</td>
                <td>{o.customer?.name || '—'}</td>
                <td>{o.sellerItems.map((i) => `${i.name} ×${i.qty}`).join(', ')}</td>
                <td>{o.sellerUnits}</td>
                <td>{formatPrice(o.sellerTotal)}</td>
                <td><span className="badge badge-success">{o.status || '—'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {sales.length === 0 && <p className="empty-msg">Todavía no tienes ventas.</p>}
      </div>
    </div>
  );
}
