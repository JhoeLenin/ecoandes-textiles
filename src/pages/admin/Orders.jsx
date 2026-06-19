import { useState, useMemo } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { formatPrice } from '../../context/CatalogContext';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];

const STATUS_META = {
  pendiente: { color: 'badge-warning', icon: 'fa-clock', label: 'Pendiente' },
  procesando: { color: 'badge-info', icon: 'fa-cog', label: 'Procesando' },
  enviado: { color: 'badge-info', icon: 'fa-truck', label: 'Enviado' },
  entregado: { color: 'badge-success', icon: 'fa-circle-check', label: 'Entregado' },
  cancelado: { color: 'badge-danger', icon: 'fa-xmark', label: 'Cancelado' },
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
}

export default function Orders() {
  const { orders, loading, updateOrderStatus } = useOrders();
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');

  const stats = useMemo(() => {
    const grouped = {};
    STATUS_OPTIONS.forEach((s) => { grouped[s] = 0; });
    let totalRevenue = 0;
    let pendingRevenue = 0;

    orders.forEach((o) => {
      if (grouped[o.status] !== undefined) grouped[o.status]++;
      if (o.status !== 'cancelado') totalRevenue += o.total || 0;
      if (o.status === 'pendiente') pendingRevenue += o.total || 0;
    });

    return { grouped, totalRevenue, pendingRevenue };
  }, [orders]);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = !filterStatus || o.status === filterStatus;
      const matchesSearch = !search ||
        o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
        o.customer?.email?.toLowerCase().includes(search.toLowerCase()) ||
        o.id?.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, filterStatus, search]);

  const handleStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      toast.success('Estado actualizado');
    } catch (err) {
      toast.error('Error al actualizar');
    }
  };

  if (loading) return <div className="admin-loading">Cargando pedidos...</div>;

  return (
    <div className="admin-page">
      <h1 className="admin-title">Pedidos</h1>

      <div className="stats-grid stats-grid-orders">
        {STATUS_OPTIONS.map((s) => {
          const meta = STATUS_META[s];
          return (
            <button
              key={s}
              className={`stat-card stat-card-clickable ${filterStatus === s ? 'stat-card-active' : ''}`}
              onClick={() => setFilterStatus(filterStatus === s ? '' : s)}
            >
              <div className={`stat-icon-sm ${meta.color}`}>
                <i className={`fa-solid ${meta.icon}`} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.grouped[s] || 0}</span>
                <span className="stat-label">{meta.label}</span>
              </div>
            </button>
          );
        })}
        <div className="stat-card stat-card-highlight">
          <div className="stat-icon-sm" style={{ background: '#ecfdf5', color: '#059669' }}>
            <i className="fa-solid fa-money-bill-trend-up" />
          </div>
          <div className="stat-info">
            <span className="stat-value">{formatPrice(stats.totalRevenue)}</span>
            <span className="stat-label">Ingresos</span>
          </div>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <i className="fa-solid fa-search admin-search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search"
          />
        </div>
        {filterStatus && (
          <button className="btn btn-outline btn-sm" onClick={() => setFilterStatus('')}>
            <i className="fa-solid fa-xmark" /> Limpiar filtro
          </button>
        )}
        <span className="filter-count">{filtered.length} de {orders.length}</span>
      </div>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Método</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => {
              const meta = STATUS_META[o.status] || STATUS_META.pendiente;
              return (
                <tr key={o.id}>
                  <td className="cell-mono cell-bold">{o.id.slice(0, 8)}...</td>
                  <td>
                    <div className="cell-bold">{o.customer?.name || '—'}</div>
                    <div className="cell-sub">{o.customer?.email || ''}</div>
                    {o.customer?.phone && <div className="cell-sub">{o.customer.phone}</div>}
                  </td>
                  <td>
                    <span className="badge badge-outline">{o.items?.length || 0} items</span>
                  </td>
                  <td className="cell-bold">{formatPrice(o.total || 0)}</td>
                  <td>
                    <span className={`badge badge-${o.paymentMethod === 'culqi' ? 'info' : 'outline'}`}>
                      {o.paymentMethod === 'culqi' ? 'Tarjeta' : o.paymentMethod || '—'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${meta.color}`}>
                      <i className={`fa-solid ${meta.icon}`} style={{ marginRight: '0.3rem' }} />
                      {meta.label}
                    </span>
                  </td>
                  <td>
                    <div>{formatDate(o.createdAt)}</div>
                    <div className="cell-sub">{formatTime(o.createdAt)}</div>
                  </td>
                  <td className="actions-cell">
                    <select
                      className="status-select"
                      value={o.status || 'pendiente'}
                      onChange={(e) => handleStatus(o.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{STATUS_META[s].label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan="8" className="empty-row">
                {search || filterStatus ? 'No se encontraron pedidos con esos filtros' : 'Sin pedidos recibidos'}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
