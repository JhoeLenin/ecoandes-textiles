import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/tienda', label: 'Tienda' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/envios', label: 'Envíos' },
  { to: '/contacto', label: 'Contacto' },
];

export default function Header() {
  const { count } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Sesión cerrada');
  };

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="announcement-bar">
        <i className="fa-solid fa-truck-fast" /> Envío GRATIS en compras mayores a S/ 150 — a todo el Perú
      </div>
      <div className="header-inner container">
        <Link to="/" className="logo">
          <img src="/img/logo.png" alt="EcoAndes Textiles" className="logo-img" />
        </Link>

        <nav className={`main-nav ${open ? 'open' : ''}`} aria-expanded={open}>
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
          {user && !isAdmin && (
            <Link to="/mis-pedidos" className="header-account" aria-label="Mis pedidos">
              <i className="fa-solid fa-box" />
            </Link>
          )}
          {user && !isAdmin && (
            <Link to="/cuenta" className="header-account" aria-label="Mi cuenta">
              <i className="fa-solid fa-user" />
            </Link>
          )}
          {!user && (
            <Link to="/cuenta" className="header-account" aria-label="Iniciar sesión">
              <i className="fa-regular fa-user" />
            </Link>
          )}
          {user && (
            <button className="header-logout" onClick={handleLogout} aria-label="Cerrar sesión">
              <i className="fa-solid fa-right-from-bracket" />
            </button>
          )}
          <Link to="/carrito" className="cart-link" aria-label="Carrito">
            <i className="fa-solid fa-cart-shopping" />
            {count > 0 && <span className="cart-badge" aria-live="polite">{count}</span>}
          </Link>
          <button className="hamburger" aria-label="Menú" aria-expanded={open} onClick={() => setOpen(!open)}>
            <i className={`fa-solid ${open ? 'fa-xmark' : 'fa-bars'}`} />
          </button>
        </div>
      </div>
      {open && <div className="nav-backdrop" onClick={() => setOpen(false)} />}
    </header>
  );
}
