import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const navGroups = [
  {
    title: 'General',
    links: [
      { to: '/admin', icon: 'fa-chart-line', label: 'Dashboard', end: true },
    ],
  },
  {
    title: 'Tienda',
    links: [
      { to: '/admin/productos', icon: 'fa-box', label: 'Productos' },
      { to: '/admin/categorias', icon: 'fa-tags', label: 'Categorías' },
      { to: '/admin/ofertas', icon: 'fa-percent', label: 'Ofertas' },
    ],
  },
  {
    title: 'Operaciones',
    links: [
      { to: '/admin/pedidos', icon: 'fa-receipt', label: 'Pedidos' },
      { to: '/admin/usuarios', icon: 'fa-users', label: 'Usuarios' },
      { to: '/admin/vendedores', icon: 'fa-store', label: 'Vendedores' },
    ],
  },
  {
    title: 'SCM',
    links: [
      { to: '/admin/inventario', icon: 'fa-boxes-stacked', label: 'Inventario' },
      { to: '/admin/proveedores', icon: 'fa-truck-field', label: 'Proveedores' },
      { to: '/admin/ordenes-compra', icon: 'fa-file-invoice', label: 'Órdenes de Compra' },
    ],
  },
  {
    title: 'CRM',
    links: [
      { to: '/admin/clientes', icon: 'fa-address-book', label: 'Clientes' },
      { to: '/admin/campanas', icon: 'fa-bullhorn', label: 'Campañas' },
      { to: '/admin/reclamos', icon: 'fa-triangle-exclamation', label: 'Reclamos' },
      { to: '/admin/sugerencias', icon: 'fa-lightbulb', label: 'Sugerencias' },
      { to: '/admin/reportes', icon: 'fa-chart-pie', label: 'Reportes CRM' },
    ],
  },
  {
    title: 'Sistema',
    links: [
      { to: '/admin/seed', icon: 'fa-database', label: 'Poblar DB' },
    ],
  },
];

export default function AdminSidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    toast.success('Sesión cerrada');
    navigate('/login', { replace: true });
  };

  return (
    <>
      <button className="admin-menu-toggle" onClick={() => setOpen(!open)} aria-label="Menú">
        <i className={`fa-solid ${open ? 'fa-xmark' : 'fa-bars'}`} />
      </button>

      {open && <div className="admin-sidebar-backdrop" onClick={() => setOpen(false)} />}

      <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src="/img/logo.png" alt="EcoAndes" className="sidebar-logo" />
          <div className="sidebar-brand">
            <span className="sidebar-brand-name">EcoAndes</span>
            <span className="sidebar-brand-role">Panel Admin</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navGroups.map((group) => (
            <div key={group.title} className="sidebar-group">
              <div className="sidebar-group-title">{group.title}</div>
              {group.links.map((l) => (
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
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {(user?.email || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user?.email?.split('@')[0] || 'Admin'}</span>
              <span className="sidebar-user-email">{user?.email || ''}</span>
            </div>
          </div>
          <NavLink to="/" className="sidebar-link">
            <i className="fa-solid fa-store" />
            <span>Ver tienda</span>
          </NavLink>
          <button className="sidebar-link sidebar-logout" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
