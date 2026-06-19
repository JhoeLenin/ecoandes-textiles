import { useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  getProduct, formatPrice, shippingCost, DEPARTAMENTOS,
} from '../data/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import useCulqi from '../hooks/useCulqi';
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
    detail: 'Pago seguro con Visa o Mastercard.',
  },
];

export default function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [departamento, setDepartamento] = useState('');
  const [confirmed, setConfirmed] = useState(null);
  const [saving, setSaving] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const shipping = shippingCost(subtotal, departamento || null);
  const free = shipping === 0 && subtotal > 0;
  const total = subtotal + shipping;

  const handleCulqiToken = async (token) => {
    if (!token?.id) {
      toast.error('Error al procesar el pago');
      return;
    }

    setSaving(true);
    try {
      const form = document.querySelector('.checkout-form');
      if (!form?.reportValidity()) {
        setSaving(false);
        return;
      }

      const secretKey = import.meta.env.VITE_CULQI_SECRET_KEY;
      if (!secretKey || secretKey.includes('tu_llave')) {
        toast.error('Llave secreta de Culqi no configurada');
        setSaving(false);
        return;
      }

      const chargeResponse = await fetch('https://api.culqi.com/v2/charges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${secretKey}`,
        },
        body: JSON.stringify({
          amount: Math.round(total * 100),
          currency_code: 'PEN',
          email: form.email.value.trim(),
          description: `Pedido EcoAndes - ${form.nombre.value.trim()}`,
          source: { token_id: token.id },
        }),
      });

      const chargeData = await chargeResponse.json();

      if (chargeData.object !== 'charge') {
        toast.error('Pago rechazado: ' + (chargeData.user_message || 'Error desconocido'));
        setSaving(false);
        return;
      }

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
        paymentMethod: 'culqi',
        culqiChargeId: chargeData.id,
        subtotal,
        shipping,
        total,
        status: 'pagado',
        createdAt: new Date().toISOString(),
      });

      clearCart();
      setConfirmed(form.nombre.value.trim());
      toast.success('¡Pago procesado exitosamente!');
    } catch (err) {
      toast.error('Error al procesar pago: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCulqiError = (error) => {
    toast.error('Error en el pago: ' + (error?.user_message || 'Inténtalo de nuevo'));
  };

  const { open: openCulqi } = useCulqi({
    amount: total,
    email: customerEmail,
    onToken: handleCulqiToken,
    onError: handleCulqiError,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.reportValidity()) return;
    if (!form.pago.value) {
      toast.error('Selecciona un método de pago');
      return;
    }

    if (form.pago.value === 'culqi') {
      openCulqi();
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
        total,
        status: 'pendiente',
        createdAt: new Date().toISOString(),
      });

      clearCart();
      setConfirmed(form.nombre.value.trim());
      toast.success('Pedido registrado exitosamente');
    } catch (err) {
      toast.error('Error al registrar pedido: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (confirmed) {
    return (
      <div className="modal open">
        <div className="modal-box">
          <i className="fa-solid fa-circle-check" />
          <h2>¡Gracias por tu compra!</h2>
          <p>
            Hola <strong>{confirmed}</strong>, tu pedido fue registrado con éxito. Te
            contactaremos por email y WhatsApp para coordinar el envío.
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

  return (
    <>
      <section className="page-hero">
        <h1>Finalizar Compra</h1>
      </section>

      <section className="section">
        <div className="container checkout-layout">
          <div>
            <Link to="/carrito" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem', color: 'var(--ink-soft)', fontSize: '0.9rem' }}>
              <i className="fa-solid fa-arrow-left" /> Volver al carrito
            </Link>
          </div>
          <form onSubmit={handleSubmit} noValidate className="checkout-form">
            <h2 className="form-title">Datos de Envío</h2>
            <div className="form-grid">
              <label className="full">Nombre completo
                <input type="text" name="nombre" required maxLength={100} placeholder="Juan Pérez Quispe" />
              </label>
              <label>Email
                <input
                  type="email"
                  name="email"
                  required
                  maxLength={120}
                  placeholder="correo@ejemplo.com"
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
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
                  <input
                    type="radio"
                    name="pago"
                    value={m.value}
                    required
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <strong>{m.label}</strong>
                  <p className="payment-detail">{m.detail}</p>
                </label>
              ))}
            </div>

            {paymentMethod === 'culqi' && (
              <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', background: 'var(--sand-100)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <i className="fa-solid fa-info-circle" style={{ marginRight: '0.5rem' }} />
                Al hacer clic en "Pagar con Tarjeta", se abrirá el formulario seguro de Culqi.
              </p>
            )}

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={saving}>
              {saving ? 'Procesando...' : paymentMethod === 'culqi' ? 'Pagar con Tarjeta' : 'Confirmar Pedido'}
            </button>
            <p style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', textAlign: 'center', marginTop: '0.8rem' }}>
              {paymentMethod === 'culqi'
                ? 'Pago procesado de forma segura por Culqi.'
                : 'Al confirmar, recibirás un email de confirmación y nos contactaremos por WhatsApp.'}
            </p>
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
              <span>TOTAL</span><span>{formatPrice(total)}</span>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
