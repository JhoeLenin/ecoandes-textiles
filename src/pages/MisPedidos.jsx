import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMyOrders } from '../hooks/useMyOrders';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

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
  const { addToCart } = useCart();
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const repeatOrder = (items) => {
    items.forEach((item) => {
      for (let i = 0; i < item.qty; i++) {
        addToCart(item.id, 1);
      }
    });
    toast.success('Productos agregados al carrito');
  };

  if (loading) {
    return (
      <section className="section">
        <div className="container empty-state">
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--terracotta)' }} />
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
              {orders.map((o) => {
                const isExpanded = expanded[o.id];
                const items = o.items || [];
                const visibleItems = isExpanded ? items : items.slice(0, 2);
                return (
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
                      {visibleItems.map((item, i) => (
                        <div className="order-item" key={i}>
                          <span>{item.name} × {item.qty}</span>
                          <span>S/ {(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                      {items.length > 2 && !isExpanded && (
                        <button className="order-expand" onClick={() => toggleExpand(o.id)}>
                          +{items.length - 2} productos más
                        </button>
                      )}
                      {isExpanded && items.length > 2 && (
                        <button className="order-expand" onClick={() => toggleExpand(o.id)}>
                          Mostrar menos
                        </button>
                      )}
                    </div>
                    <div className="order-footer">
                      <span className="order-total">Total: S/ {(o.total || 0).toFixed(2)}</span>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span className="order-payment">{o.paymentMethod || '—'}</span>
                        <button className="btn btn-outline btn-sm" onClick={() => repeatOrder(items)}>
                          <i className="fa-solid fa-rotate" /> Volver a comprar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
