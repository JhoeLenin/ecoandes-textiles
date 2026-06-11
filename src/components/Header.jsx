import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/tienda', label: 'Tienda' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/envios', label: 'Envíos' },
  { to: '/contacto', label: 'Contacto' },
];

export default function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="announcement-bar">
        <i className="fa-solid fa-truck-fast" /> Envío GRATIS en compras mayores a S/ 150 — a todo el Perú
      </div>
      <div className="header-inner container">
        <Link to="/" className="logo">
          <img src="/img/logo.png" alt="EcoAndes Textiles" className="logo-img" />
        </Link>

        <nav className={`main-nav ${open ? 'open' : ''}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <Link to="/carrito" className="cart-link" aria-label="Carrito">
            <i className="fa-solid fa-cart-shopping" />
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>
          <button className="hamburger" aria-label="Menú" onClick={() => setOpen(!open)}>
            <i className={`fa-solid ${open ? 'fa-xmark' : 'fa-bars'}`} />
          </button>
        </div>
      </div>
    </header>
  );
}
