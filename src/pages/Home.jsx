import { useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard, { Stars } from '../components/ProductCard';
import { CATEGORIES, PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';

const BENEFITS = [
  { icon: 'fa-hand-holding-heart', title: 'Hecho a mano', text: 'Cada pieza es única, tejida por artesanos arequipeños' },
  { icon: 'fa-truck-fast', title: 'Envío nacional', text: 'Olva Courier a todo el Perú — gratis desde S/ 150' },
  { icon: 'fa-shield-halved', title: 'Pago seguro', text: 'Yape, Plin, transferencia o contraentrega' },
  { icon: 'fa-rotate-left', title: 'Devoluciones', text: 'Hasta 7 días después de recibir tu pedido' },
];

const TESTIMONIALS = [
  {
    name: 'María Fernanda C.',
    city: 'Lima',
    rating: 5,
    text: 'La chompa de alpaca es hermosa, súper suave y abrigadora. Se nota la calidad artesanal en cada detalle. Llegó en 2 días.',
    product: 'Chompa de Alpaca',
  },
  {
    name: 'Jorge Luis M.',
    city: 'Arequipa',
    rating: 5,
    text: 'Compré la manta Totoras para mi sala y todos preguntan dónde la conseguí. Los colores son aún más bonitos en persona.',
    product: 'Manta Totoras',
  },
  {
    name: 'Claudia R.',
    city: 'Cusco',
    rating: 4.5,
    text: 'El morral telar es resistente y precioso. Me encanta apoyar el trabajo de artesanos peruanos. Volveré a comprar seguro.',
    product: 'Morral Telar',
  },
];

export default function Home() {
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 6);
  const { showToast } = useCart();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!e.target.reportValidity()) return;
    setSending(true);
    try {
      await addDoc(collection(db, 'newsletter'), {
        email,
        createdAt: new Date().toISOString(),
      });
    } catch {
      // silent
    }
    setEmail('');
    setSending(false);
    showToast('¡Gracias por suscribirte! Recibirás nuestras novedades.');
  };

  return (
    <>
      <HeroCarousel />

      {/* Beneficios */}
      <section className="benefits-strip">
        <div className="container benefits-grid">
          {BENEFITS.map((b) => (
            <div className="benefit" key={b.title}>
              <i className={`fa-solid ${b.icon}`} />
              <div>
                <strong>{b.title}</strong>
                <p>{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorías */}
      <section className="section">
        <div className="container">
          <span className="section-eyebrow">Colecciones</span>
          <h2 className="section-title">Nuestras Categorías</h2>
          <p className="section-subtitle">Explora nuestra colección artesanal</p>
          <div className="categories-grid">
            {CATEGORIES.map((c) => (
              <Link key={c.id} to={`/tienda?cat=${c.id}`} className="category-card">
                <img src={c.img} alt={c.name} />
                <div className="cat-overlay">
                  <h3>{c.name}</h3>
                  <span className="cat-cta">
                    Ver productos <i className="fa-solid fa-arrow-right" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Destacados */}
      <section className="section section-alt">
        <div className="container">
          <span className="section-eyebrow">Lo más vendido</span>
          <h2 className="section-title">Productos Destacados</h2>
          <p className="section-subtitle">Los favoritos de nuestros clientes</p>
          <div className="products-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="section-footer-cta">
            <Link to="/tienda" className="btn btn-outline btn-lg">
              Ver toda la tienda <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      {/* Sobre nosotros */}
      <section className="section">
        <div className="container about-preview">
          <div>
            <span className="section-eyebrow">Desde Arequipa</span>
            <h2 className="section-title left">Sobre Nosotros</h2>
            <p>
              Somos una familia de artesanos arequipeños con 20 años de experiencia en textiles
              andinos. Ofrecemos productos de calidad, preservando técnicas tradicionales y
              generando desarrollo sostenible para nuestras comunidades.
            </p>
            <br />
            <Link to="/nosotros" className="btn btn-outline">
              Conoce nuestra historia
            </Link>
          </div>
          <img src="/img/nosotros-1.jpg" alt="Artesanos tejiendo en telar tradicional" />
        </div>
      </section>

      {/* Testimonios */}
      <section className="section section-alt">
        <div className="container">
          <span className="section-eyebrow">Testimonios</span>
          <h2 className="section-title">Lo que dicen nuestros clientes</h2>
          <p className="section-subtitle">Más de 500 pedidos entregados en todo el Perú</p>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <figure className="testimonial-card" key={t.name}>
                <Stars rating={t.rating} />
                <blockquote>"{t.text}"</blockquote>
                <figcaption>
                  <span className="testimonial-avatar">{t.name.charAt(0)}</span>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.city} — compró {t.product}</span>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="container newsletter-inner">
          <div>
            <h2>Únete a la familia EcoAndes</h2>
            <p>Recibe novedades, lanzamientos y descuentos exclusivos. Sin spam.</p>
          </div>
          <form onSubmit={handleNewsletter} noValidate>
            <input
              type="email"
              required
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Correo electrónico"
            />
            <button type="submit" className="btn btn-primary" disabled={sending}>
              {sending ? 'Enviando...' : 'Suscribirme'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
