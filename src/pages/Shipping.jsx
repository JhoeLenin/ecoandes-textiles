import { Link } from 'react-router-dom';
import { STORE } from '../data/products';

const TIMELINE_STEPS = [
  { icon: 'fa-cart-shopping', label: 'Pedido confirmado', desc: 'Recibimos tu orden' },
  { icon: 'fa-gears', label: 'En preparación', desc: 'Empaquetamos tu pedido' },
  { icon: 'fa-truck-fast', label: 'Despachado', desc: 'En camino con Olva Courier' },
  { icon: 'fa-house', label: 'Entregado', desc: '¡Recibido en tu puerta!' },
];

export default function Shipping() {
  return (
    <>
      <section className="page-hero">
        <h1>Envíos y Devoluciones</h1>
      </section>

      <section className="section">
        <div className="container content-block">
          <h2><i className="fa-solid fa-route" /> ¿Cómo funciona tu envío?</h2>
          <div className="shipping-timeline">
            {TIMELINE_STEPS.map((step, i) => (
              <div className="timeline-step" key={i}>
                <div className="timeline-icon">
                  <i className={`fa-solid ${step.icon}`} />
                  {i < TIMELINE_STEPS.length - 1 && <div className="timeline-line" />}
                </div>
                <div className="timeline-info">
                  <strong>{step.label}</strong>
                  <span>{step.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <h2><i className="fa-solid fa-truck-fast" /> Política de Envío</h2>
          <p>Realizamos envíos a todo el Perú mediante <strong>Olva Courier</strong>:</p>
          <ul>
            <li><strong>Lima:</strong> 3 días hábiles — S/ 12.00</li>
            <li><strong>Provincias:</strong> 5-7 días hábiles — S/ 18.00</li>
            <li><strong>Envío GRATIS</strong> en compras mayores a S/ 150.00</li>
          </ul>
          <p>Una vez despachado tu pedido, te enviaremos el número de tracking por email y WhatsApp.</p>

          <h2><i className="fa-solid fa-rotate-left" /> Política de Devoluciones</h2>
          <ul>
            <li>Aceptamos devoluciones hasta <strong>7 días</strong> después de recibido el producto.</li>
            <li>El producto debe estar <strong>sin uso y con sus etiquetas originales</strong>.</li>
            <li>Para iniciar una devolución, escríbenos a <a href={`mailto:${STORE.email}`}><strong>{STORE.email}</strong></a>.</li>
            <li>Puedes elegir entre <strong>reembolso o cambio</strong> por otro producto.</li>
          </ul>

          <br />
          <Link to="/tienda" className="btn btn-primary">Ir a la Tienda</Link>
        </div>
      </section>
    </>
  );
}
