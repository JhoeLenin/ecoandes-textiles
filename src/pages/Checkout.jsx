import { useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  getProduct, formatPrice, shippingCost, DEPARTAMENTOS,
} from '../data/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  {
    value: 'transferencia',
    label: 'Transferencia bancaria',
    detail: 'BCP: 215-98765432-0-12 · Interbank: 200-3001234567 · Titular: EcoAndes Textiles S.A.C.',
  },
  {
    value: 'yape',
    label: 'Yape / Plin',
    detail: 'Número: +51 954 123 456 — envía tu constancia por WhatsApp.',
  },
  {
    value: 'contraentrega',
    label: 'Contraentrega',
    detail: 'Disponible solo en Lima Metropolitana. Pagas al recibir.',
  },
  {
    value: 'culqi',
    label: 'Tarjeta de crédito / débito (Culqi)',
    detail: 'Pago seguro con Visa o Mastercard. (Integración en proceso)',
  },
];

export default function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [departamento, setDepartamento] = useState('');
  const [confirmed, setConfirmed] = useState(null);
  const [saving, setSaving] = useState(false);

  const shipping = shippingCost(subtotal, departamento || null);
  const free = shipping === 0 && subtotal > 0;

  if (confirmed) {
    return (
      <div className="modal open">
        <div className="modal-box">
          <i className="fa-solid fa-circle-check" />
          <h2>¡Gracias por tu compra!</h2>
          <p>
            Hola <strong>{confirmed}</strong>, tu pedido fue registrado con éxito. Te
            contactaremos por email y WhatsApp para coordinar el pago y envío.
          </p>
          <Link to="/" className="btn btn-primary">Volver al Inicio</Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="section">
        <div className="container empty-state">
          <i className="fa-solid fa-basket-shopping" />
          <h2>Tu carrito está vacío</h2>
          <Link to="/tienda" className="btn btn-primary">Ir a la Tienda</Link>
        </div>
      </section>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.reportValidity()) return;
    if (!form.pago.value) {
      toast.error('Selecciona un método de pago');
      return;
    }

    setSaving(true);
    try {
      const items = cart.map((i) => {
        const p = getProduct(i.id);
        return {
          id: i.id,
          name: p?.name || i.id,
          price: p?.priceOffer || 0,
          qty: i.qty,
        };
      });

      await addDoc(collection(db, 'orders'), {
        userId: user?.uid || null,
        customer: {
          name: form.nombre.value.trim(),
          email: form.email.value.trim(),
          phone: form.telefono.value.trim(),
          address: form.direccion.value.trim(),
          distrito: form.distrito.value.trim(),
          departamento: form.departamento.value,
        },
        items,
        paymentMethod: form.pago.value,
        subtotal,
        shipping,
        total: subtotal + shipping,
        status: 'pendiente',
        createdAt: new Date().toISOString(),
      });

      await addDoc(collection(db, 'users'), {
        name: form.nombre.value.trim(),
        email: form.email.value.trim(),
        phone: form.telefono.value.trim(),
        role: 'cliente',
        createdAt: new Date().toISOString(),
      }).catch(() => {});

      clearCart();
      setConfirmed(form.nombre.value.trim());
      toast.success('Pedido registrado exitosamente');
    } catch (err) {
      toast.error('Error al registrar pedido: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <section className="page-hero">
        <h1>Finalizar Compra</h1>
      </section>

      <section className="section">
        <div className="container checkout-layout">
          <form onSubmit={handleSubmit} noValidate>
            <h2 className="form-title">Datos de Envío</h2>
            <div className="form-grid">
              <label className="full">Nombre completo
                <input type="text" name="nombre" required maxLength={100} placeholder="Juan Pérez Quispe" />
              </label>
              <label>Email
                <input type="email" name="email" required maxLength={120} placeholder="correo@ejemplo.com" />
              </label>
              <label>Teléfono
                <input type="tel" name="telefono" required pattern="[0-9+ ]{7,15}" maxLength={15} placeholder="954 123 456" />
              </label>
              <label className="full">Dirección
                <input type="text" name="direccion" required maxLength={150} placeholder="Av. Ejército 123, Yanahuara" />
              </label>
              <label>Distrito
                <input type="text" name="distrito" required maxLength={60} placeholder="Yanahuara" />
              </label>
              <label>Departamento
                <select
                  name="departamento"
                  required
                  value={departamento}
                  onChange={(e) => setDepartamento(e.target.value)}
                >
                  <option value="">Selecciona departamento</option>
                  {DEPARTAMENTOS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </label>
            </div>

            <h2 className="form-title">Método de Pago</h2>
            <div className="payment-methods">
              {PAYMENT_METHODS.map((m) => (
                <label className="payment-option" key={m.value}>
                  <input type="radio" name="pago" value={m.value} required />
                  <strong>{m.label}</strong>
                  <p className="payment-detail">{m.detail}</p>
                </label>
              ))}
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={saving}>
              {saving ? 'Registrando pedido...' : 'Confirmar Pedido'}
            </button>
          </form>

          <aside className="cart-summary">
            <h3>Resumen del Pedido</h3>
            {cart.map((i) => {
              const p = getProduct(i.id);
              return p ? (
                <div className="summary-line" key={i.id}>
                  <span>{p.name} × {i.qty}</span>
                  <span>{formatPrice(p.priceOffer * i.qty)}</span>
                </div>
              ) : null;
            })}
            <hr />
            <div className="summary-line"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="summary-line">
              <span>Envío{departamento ? ` (${departamento})` : ' (estimado Lima)'}</span>
              <span className={free ? 'free-tag' : ''}>{free ? 'GRATIS' : formatPrice(shipping)}</span>
            </div>
            <div className="summary-line summary-total">
              <span>TOTAL</span><span>{formatPrice(subtotal + shipping)}</span>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
