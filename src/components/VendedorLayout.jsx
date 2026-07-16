import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Guarda el portal de vendedor y muestra la subnavegación.
export default function VendedorLayout() {
  const { user, isSeller, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate('/vendedor/registro', { replace: true });
    else if (!isSeller) navigate('/vendedor/registro', { replace: true });
  }, [user, isSeller, loading, navigate]);

  if (loading || !isSeller) return <div className="admin-loading">Cargando...</div>;

  return (
    <section className="section">
      <div className="container">
        <nav className="seller-subnav">
          <NavLink to="/vendedor" end className={({ isActive }) => `seller-tab ${isActive ? 'active' : ''}`}>
            <i className="fa-solid fa-gauge" /> Panel
          </NavLink>
          <NavLink to="/vendedor/productos" className={({ isActive }) => `seller-tab ${isActive ? 'active' : ''}`}>
            <i className="fa-solid fa-box" /> Mis productos
          </NavLink>
          <NavLink to="/vendedor/ventas" className={({ isActive }) => `seller-tab ${isActive ? 'active' : ''}`}>
            <i className="fa-solid fa-cart-shopping" /> Mis ventas
          </NavLink>
        </nav>
        <Outlet />
      </div>
    </section>
  );
}
