import { useProducts } from '../../hooks/useProducts';
import { useOrders } from '../../hooks/useOrders';
import { useCategories } from '../../hooks/useCategories';
import { useUsers } from '../../hooks/useUsers';
import { useClientes } from '../../hooks/useClientes';
import { useCampanas } from '../../hooks/useCampanas';
import { useReclamos } from '../../hooks/useReclamos';
import { useSugerencias } from '../../hooks/useSugerencias';

export default function Dashboard() {
  const { products } = useProducts();
  const { orders } = useOrders();
  const { categories } = useCategories();
  const { users } = useUsers();
  const { clientes } = useClientes();
  const { campanas } = useCampanas();
  const { reclamos } = useReclamos();
  const { sugerencias } = useSugerencias();

  const lowStock = products.filter((p) => p.stock <= 10);
  const todayOrders = orders.filter((o) => {
    const d = new Date(o.createdAt);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelado')
    .reduce((s, o) => s + (o.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pendiente');

  const activeCampanas = campanas.filter((c) => c.status === 'activa');
  const openReclamos = reclamos.filter((r) => r.status !== 'resuelto');
  const newSugerencias = sugerencias.filter((s) => s.status === 'nueva');

  const crmStats = [
    { label: 'Clientes', value: clientes.length, icon: 'fa-address-book', color: 'var(--terracotta)' },
    { label: 'Campañas activas', value: activeCampanas.length, icon: 'fa-bullhorn', color: 'var(--sage)' },
    { label: 'Reclamos abiertos', value: openReclamos.length, icon: 'fa-triangle-exclamation', color: 'var(--gold)' },
    { label: 'Sugerencias nuevas', value: newSugerencias.length, icon: 'fa-lightbulb', color: 'var(--forest)' },
  ];

  const stats = [
    { label: 'Productos', value: products.length, icon: 'fa-box', color: 'var(--terracotta)' },
    { label: 'Pedidos totales', value: orders.length, icon: 'fa-receipt', color: 'var(--sage)' },
    { label: 'Pedidos pendientes', value: pendingOrders.length, icon: 'fa-clock', color: 'var(--gold)' },
    { label: 'Ingresos totales', value: `S/ ${totalRevenue.toFixed(2)}`, icon: 'fa-money-bill', color: 'var(--forest)' },
    { label: 'Categorías', value: categories.length, icon: 'fa-tags', color: 'var(--clay)' },
    { label: 'Usuarios', value: users.length, icon: 'fa-users', color: 'var(--ink-soft)' },
  ];

  return (
    <div className="admin-page">
      <h1 className="admin-title">Dashboard</h1>

      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.color }}>
              <i className={`fa-solid ${s.icon}`} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-section">
        <h2><i className="fa-solid fa-users-gear" /> CRM</h2>
        <div className="stats-grid">
          {crmStats.map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{ background: s.color }}>
                <i className={`fa-solid ${s.icon}`} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="admin-section">
          <h2><i className="fa-solid fa-triangle-exclamation" /> Stock Bajo</h2>
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Stock</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.stock}</td>
                    <td>
                      <span className={`badge ${p.stock === 0 ? 'badge-danger' : 'badge-warning'}`}>
                        {p.stock === 0 ? 'Agotado' : 'Bajo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="admin-section">
        <h2><i className="fa-solid fa-clock" /> Últimos Pedidos</h2>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id}>
                  <td>{o.customer?.name || '—'}</td>
                  <td>S/ {(o.total || 0).toFixed(2)}</td>
                  <td><span className={`badge badge-${o.status}`}>{o.status}</span></td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan="4" className="empty-row">Sin pedidos aún</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
