import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <div className="admin-loading">Cargando...</div>;
  if (!user || !isAdmin) return <Navigate to="/login" replace />;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
