import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useOrders } from '../../hooks/useOrders';
import { useCategories } from '../../hooks/useCategories';
import { useUsers } from '../../hooks/useUsers';
import { useClientes } from '../../hooks/useClientes';
import { useCampanas } from '../../hooks/useCampanas';
import { useReclamos } from '../../hooks/useReclamos';
import { useSugerencias } from '../../hooks/useSugerencias';
import { formatPrice } from '../../context/CatalogContext';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Ahora';
  if (mins < 60) return `Hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `Hace ${days}d`;
}

export default function Dashboard() {
  const { products } = useProducts();
  const { orders } = useOrders();
  const { categories } = useCategories();
  const { users } = useUsers();
  const { clientes } = useClientes();
  const { campanas } = useCampanas();
  const { reclamos } = useReclamos();
  const { sugerencias } = useSugerencias();

  const stats = useMemo(() => {
    const lowStock = products.filter((p) => p.stock <= 10);
    const outOfStock = products.filter((p) => p.stock === 0);
    const today = new Date().toDateString();
    const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today);
    const pendingOrders = orders.filter((o) => o.status === 'pendiente');
    const deliveredOrders = orders.filter((o) => o.status === 'entregado');
    const totalRevenue = orders
      .filter((o) => o.status !== 'cancelado')
      .reduce((s, o) => s + (o.total || 0), 0);
    const todayRevenue = todayOrders
      .filter((o) => o.status !== 'cancelado')
      .reduce((s, o) => s + (o.total || 0), 0);
    const activeCampanas = campanas.filter((c) => c.status === 'activa');
    const openReclamos = reclamos.filter((r) => r.status !== 'resuelto');
    const newSugerencias = sugerencias.filter((s) => s.status === 'nueva');

    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    return {
      lowStock, outOfStock, todayOrders, pendingOrders, deliveredOrders,
      totalRevenue, todayRevenue, activeCampanas, openReclamos, newSugerencias,
      recentOrders,
    };
  }, [products, orders, campanas, reclamos, sugerencias]);

  const primaryStats = [
    {
      label: 'Ingresos totales',
      value: formatPrice(stats.totalRevenue),
      icon: 'fa-money-bill-trend-up',
      color: '#059669',
      bg: '#ecfdf5',
      link: '/admin/pedidos',
    },
    {
      label: 'Pedidos hoy',
      value: stats.todayOrders.length,
      icon: 'fa-receipt',
      color: '#2563eb',
      bg: '#eff6ff',
      sub: `${formatPrice(stats.todayRevenue)} en ventas`,
      link: '/admin/pedidos',
    },
    {
      label: 'Pendientes',
      value: stats.pendingOrders.length,
      icon: 'fa-clock',
      color: '#d97706',
      bg: '#fffbeb',
      sub: stats.pendingOrders.length > 0 ? 'Requieren atención' : 'Todo al día',
      link: '/admin/pedidos',
    },
    {
      label: 'Productos',
      value: products.length,
      icon: 'fa-box',
      color: '#7c3aed',
      bg: '#f5f3ff',
      sub: stats.outOfStock.length > 0 ? `${stats.outOfStock.length} agotados` : 'En stock',
      link: '/admin/productos',
    },
  ];

  const crmStats = [
    {
      label: 'Clientes',
      value: clientes.length,
      icon: 'fa-address-book',
      color: '#0891b2',
      bg: '#ecfeff',
      link: '/admin/clientes',
    },
    {
      label: 'Campañas activas',
      value: stats.activeCampanas.length,
      icon: 'fa-bullhorn',
      color: '#059669',
      bg: '#ecfdf5',
      link: '/admin/campanas',
    },
    {
      label: 'Reclamos abiertos',
      value: stats.openReclamos.length,
      icon: 'fa-triangle-exclamation',
      color: stats.openReclamos.length > 0 ? '#dc2626' : '#059669',
      bg: stats.openReclamos.length > 0 ? '#fef2f2' : '#ecfdf5',
      link: '/admin/reclamos',
    },
    {
      label: 'Sugerencias nuevas',
      value: stats.newSugerencias.length,
      icon: 'fa-lightbulb',
      color: '#ca8a04',
      bg: '#fefce8',
      link: '/admin/sugerencias',
    },
  ];

  return (
    <div className="admin-page">
      <div className="dashboard-welcome">
        <div>
          <h1 className="admin-title">{getGreeting()}, Admin</h1>
          <p className="dashboard-subtitle">Resumen de tu tienda EcoAndes Textiles</p>
        </div>
        <div className="dashboard-quick-actions">
          <Link to="/admin/productos" className="btn btn-outline btn-sm">
            <i className="fa-solid fa-plus" /> Producto
          </Link>
          <Link to="/admin/pedidos" className="btn btn-outline btn-sm">
            <i className="fa-solid fa-receipt" /> Pedidos
          </Link>
          <Link to="/" className="btn btn-primary btn-sm" target="_blank">
            <i className="fa-solid fa-store" /> Ver tienda
          </Link>
        </div>
      </div>

      <div className="stats-grid stats-grid-primary">
        {primaryStats.map((s) => (
          <Link to={s.link} key={s.label} className="stat-card stat-card-interactive">
            <div className="stat-icon-lg" style={{ background: s.bg, color: s.color }}>
              <i className={`fa-solid ${s.icon}`} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
              {s.sub && <span className="stat-sub">{s.sub}</span>}
            </div>
          </Link>
        ))}
      </div>

      <div className="admin-grid-2col">
        <div className="admin-section">
          <div className="section-header">
            <h2><i className="fa-solid fa-clock-rotate-left" /> Últimos Pedidos</h2>
            <Link to="/admin/pedidos" className="section-link">Ver todos →</Link>
          </div>
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Hace</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <div className="cell-bold">{o.customer?.name || '—'}</div>
                      <div className="cell-sub">{o.customer?.email || ''}</div>
                    </td>
                    <td className="cell-bold">{formatPrice(o.total || 0)}</td>
                    <td><span className={`badge badge-${o.status}`}>{o.status}</span></td>
                    <td className="cell-sub">{formatTimeAgo(o.createdAt)}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan="4" className="empty-row">Sin pedidos aún</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-section">
          <div className="section-header">
            <h2><i className="fa-solid fa-triangle-exclamation" /> Alertas</h2>
          </div>
          <div className="alerts-list">
            {stats.outOfStock.length > 0 && (
              <div className="alert-item alert-danger">
                <i className="fa-solid fa-box-open" />
                <div>
                  <strong>{stats.outOfStock.length} productos agotados</strong>
                  <p>{stats.outOfStock.slice(0, 3).map((p) => p.name).join(', ')}{stats.outOfStock.length > 3 ? '...' : ''}</p>
                </div>
                <Link to="/admin/productos" className="alert-link">Ver →</Link>
              </div>
            )}
            {stats.lowStock.length > 0 && stats.outOfStock.length !== stats.lowStock.length && (
              <div className="alert-item alert-warning">
                <i className="fa-solid fa-boxes-stacked" />
                <div>
                  <strong>{stats.lowStock.length - stats.outOfStock.length} productos con stock bajo</strong>
                  <p>Menos de 10 unidades disponibles</p>
                </div>
                <Link to="/admin/productos" className="alert-link">Ver →</Link>
              </div>
            )}
            {stats.pendingOrders.length > 0 && (
              <div className="alert-item alert-info">
                <i className="fa-solid fa-hourglass-half" />
                <div>
                  <strong>{stats.pendingOrders.length} pedidos pendientes</strong>
                  <p>Esperando procesamiento o envío</p>
                </div>
                <Link to="/admin/pedidos" className="alert-link">Ver →</Link>
              </div>
            )}
            {stats.openReclamos.length > 0 && (
              <div className="alert-item alert-danger">
                <i className="fa-solid fa-headset" />
                <div>
                  <strong>{stats.openReclamos.length} reclamos abiertos</strong>
                  <p>Requieren respuesta al cliente</p>
                </div>
                <Link to="/admin/reclamos" className="alert-link">Ver →</Link>
              </div>
            )}
            {stats.outOfStock.length === 0 && stats.lowStock.length === 0 && stats.pendingOrders.length === 0 && stats.openReclamos.length === 0 && (
              <div className="alert-item alert-success">
                <i className="fa-solid fa-circle-check" />
                <div>
                  <strong>Todo en orden</strong>
                  <p>No hay alertas pendientes</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="admin-section">
        <div className="section-header">
          <h2><i className="fa-solid fa-users-gear" /> CRM Overview</h2>
          <Link to="/admin/reportes" className="section-link">Ver reportes →</Link>
        </div>
        <div className="stats-grid">
          {crmStats.map((s) => (
            <Link to={s.link} key={s.label} className="stat-card stat-card-interactive">
              <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
                <i className={`fa-solid ${s.icon}`} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="admin-grid-2col">
        <div className="admin-section">
          <div className="section-header">
            <h2><i className="fa-solid fa-box" /> Inventario</h2>
            <Link to="/admin/productos" className="section-link">Ver productos →</Link>
          </div>
          <div className="inventory-summary">
            <div className="inv-stat">
              <span className="inv-number">{products.length}</span>
              <span className="inv-label">Total</span>
            </div>
            <div className="inv-stat">
              <span className="inv-number" style={{ color: '#059669' }}>{products.length - stats.lowStock.length}</span>
              <span className="inv-label">Stock OK</span>
            </div>
            <div className="inv-stat">
              <span className="inv-number" style={{ color: '#d97706' }}>{stats.lowStock.length - stats.outOfStock.length}</span>
              <span className="inv-label">Bajo</span>
            </div>
            <div className="inv-stat">
              <span className="inv-number" style={{ color: '#dc2626' }}>{stats.outOfStock.length}</span>
              <span className="inv-label">Agotado</span>
            </div>
          </div>
        </div>

        <div className="admin-section">
          <div className="section-header">
            <h2><i className="fa-solid fa-chart-simple" /> Pedidos por Estado</h2>
          </div>
          <div className="orders-status-grid">
            {['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'].map((status) => {
              const count = orders.filter((o) => o.status === status).length;
              const pct = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0;
              return (
                <div key={status} className="status-bar-item">
                  <div className="status-bar-header">
                    <span className={`badge badge-${status}`}>{status}</span>
                    <span className="status-bar-count">{count}</span>
                  </div>
                  <div className="status-bar-track">
                    <div
                      className={`status-bar-fill status-bar-${status}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
