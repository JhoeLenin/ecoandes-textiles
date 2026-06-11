import { Link } from 'react-router-dom';
import { STORE } from '../data/products';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h3 className="footer-logo">
            <i className="fa-solid fa-mountain-sun" /> EcoAndes Textiles
          </h3>
          <p>
            {STORE.slogan}. Textiles artesanales arequipeños hechos con fibras naturales y
            técnicas ancestrales.
          </p>
        </div>
        <div>
          <h4>Navegación</h4>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/tienda">Tienda</Link></li>
            <li><Link to="/nosotros">Sobre Nosotros</Link></li>
            <li><Link to="/envios">Envíos y Devoluciones</Link></li>
          </ul>
        </div>
        <div>
          <h4>Contacto</h4>
          <ul>
            <li><i className="fa-solid fa-location-dot" /> Arequipa, Perú</li>
            <li><i className="fa-solid fa-phone" /> {STORE.phone}</li>
            <li><i className="fa-solid fa-envelope" /> {STORE.email}</li>
          </ul>
        </div>
        <div>
          <h4>Síguenos</h4>
          <div className="social-links">
            <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook" /></a>
            <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram" /></a>
            <a
              href={`https://wa.me/${STORE.whatsapp}`}
              aria-label="WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-whatsapp" />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} EcoAndes Textiles — Arequipa, Perú. Todos los derechos reservados.</p>
        <div className="payment-icons" aria-label="Métodos de pago">
          <i className="fa-brands fa-cc-visa" title="Visa" />
          <i className="fa-brands fa-cc-mastercard" title="Mastercard" />
          <span className="pay-pill">Yape</span>
          <span className="pay-pill">Plin</span>
          <i className="fa-solid fa-building-columns" title="Transferencia bancaria" />
          <i className="fa-solid fa-hand-holding-dollar" title="Contraentrega" />
        </div>
      </div>
    </footer>
  );
}
