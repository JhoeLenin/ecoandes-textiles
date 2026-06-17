import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const links = [
  { to: '/admin', icon: 'fa-chart-line', label: 'Dashboard', end: true },
  { to: '/admin/productos', icon: 'fa-box', label: 'Productos' },
  { to: '/admin/categorias', icon: 'fa-tags', label: 'Categorías' },
  { to: '/admin/ofertas', icon: 'fa-percent', label: 'Ofertas' },
  { to: '/admin/pedidos', icon: 'fa-receipt', label: 'Pedidos' },
  { to: '/admin/usuarios', icon: 'fa-users', label: 'Usuarios' },
  { to: '/admin/clientes', icon: 'fa-address-book', label: 'Clientes' },
  { to: '/admin/campanas', icon: 'fa-bullhorn', label: 'Campañas' },
  { to: '/admin/reclamos', icon: 'fa-triangle-exclamation', label: 'Reclamos' },
  { to: '/admin/sugerencias', icon: 'fa-lightbulb', label: 'Sugerencias' },
  { to: '/admin/reportes', icon: 'fa-chart-pie', label: 'Reportes CRM' },
  { to: '/admin/seed', icon: 'fa-database', label: 'Poblar DB' },
];

export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Sesión cerrada');
    navigate('/login', { replace: true });
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <img src="/img/logo.png" alt="EcoAndes" className="sidebar-logo" />
        <span>Admin</span>
      </div>
      <nav className="sidebar-nav">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <i className={`fa-solid ${l.icon}`} />
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <NavLink to="/" className="sidebar-link">
          <i className="fa-solid fa-store" />
          <span>Ver tienda</span>
        </NavLink>
        <button className="sidebar-link logout" onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
