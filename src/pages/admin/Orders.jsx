import { useOrders } from '../../hooks/useOrders';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];

const STATUS_COLORS = {
  pendiente: 'badge-warning',
  procesando: 'badge-info',
  enviado: 'badge-info',
  entregado: 'badge-success',
  cancelado: 'badge-danger',
};

export default function Orders() {
  const { orders, loading, updateOrderStatus } = useOrders();

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

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="order-id">{o.id.slice(0, 8)}...</td>
                <td>
                  <div>{o.customer?.name || '—'}</div>
                  <div className="text-muted">{o.customer?.email || ''}</div>
                </td>
                <td>{o.items?.length || 0} items</td>
                <td>S/ {(o.total || 0).toFixed(2)}</td>
                <td>
                  <span className={`badge ${STATUS_COLORS[o.status] || 'badge-default'}`}>
                    {o.status || 'pendiente'}
                  </span>
                </td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="actions-cell">
                  <select
                    className="status-select"
                    value={o.status || 'pendiente'}
                    onChange={(e) => handleStatus(o.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan="7" className="empty-row">Sin pedidos recibidos</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
