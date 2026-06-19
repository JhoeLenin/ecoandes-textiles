import { Link } from 'react-router-dom';
import { useMyOrders } from '../hooks/useMyOrders';

const STATUS_LABELS = {
  pendiente: 'Pendiente',
  procesando: 'Procesando',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

const STATUS_COLORS = {
  pendiente: 'badge-warning',
  procesando: 'badge-info',
  enviado: 'badge-info',
  entregado: 'badge-success',
  cancelado: 'badge-danger',
};

export default function MisPedidos() {
  const { orders, loading } = useMyOrders();

  if (loading) {
    return (
      <section className="section">
        <div className="container empty-state">
          <p>Cargando tus pedidos...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-hero">
        <h1>Mis Pedidos</h1>
      </section>

      <section className="section">
        <div className="container">
          {orders.length === 0 ? (
            <div className="empty-state">
              <i className="fa-solid fa-basket-shopping" />
              <h2>Aún no tienes pedidos</h2>
              <Link to="/tienda" className="btn btn-primary">Ir a la Tienda</Link>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((o) => (
                <div className="order-card" key={o.id}>
                  <div className="order-header">
                    <span className="order-id">Pedido #{o.id.slice(0, 8)}</span>
                    <span className={`badge ${STATUS_COLORS[o.status] || 'badge-default'}`}>
                      {STATUS_LABELS[o.status] || o.status}
                    </span>
                  </div>
                  <div className="order-date">
                    {new Date(o.createdAt).toLocaleDateString('es-PE', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </div>
                  <div className="order-items">
                    {o.items?.map((item, i) => (
                      <div className="order-item" key={i}>
                        <span>{item.name} × {item.qty}</span>
                        <span>S/ {(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-footer">
                    <span className="order-total">Total: S/ {(o.total || 0).toFixed(2)}</span>
                    <span className="order-payment">{o.paymentMethod || '—'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
