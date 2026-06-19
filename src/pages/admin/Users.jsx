import { useMemo } from 'react';
import { useUsers } from '../../hooks/useUsers';
import toast from 'react-hot-toast';

export default function Users() {
  const { users, loading, updateUserRole } = useUsers();

  const stats = useMemo(() => {
    const admins = users.filter((u) => u.role === 'admin').length;
    const clients = users.filter((u) => !u.role || u.role === 'cliente').length;
    const recent = [...users]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    return { admins, clients, recent };
  }, [users]);

  const handleRole = async (id, role) => {
    try {
      await updateUserRole(id, role);
      toast.success('Rol actualizado');
    } catch (err) {
      toast.error('Error al actualizar');
    }
  };

  if (loading) return <div className="admin-loading">Cargando usuarios...</div>;

  return (
    <div className="admin-page">
      <h1 className="admin-title">Usuarios</h1>

      <div className="stats-grid stats-grid-users">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <i className="fa-solid fa-users" />
          </div>
          <div className="stat-info">
            <span className="stat-value">{users.length}</span>
            <span className="stat-label">Total usuarios</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
            <i className="fa-solid fa-user-shield" />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.admins}</span>
            <span className="stat-label">Administradores</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
            <i className="fa-solid fa-user" />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.clients}</span>
            <span className="stat-label">Clientes</span>
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">
                      {(u.name || u.email || '?').charAt(0).toUpperCase()}
                    </div>
                    <span className="cell-bold">{u.name || 'Sin nombre'}</span>
                  </div>
                </td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge ${u.role === 'admin' ? 'badge-success' : 'badge-default'}`}>
                    <i className={`fa-solid ${u.role === 'admin' ? 'fa-user-shield' : 'fa-user'}`} style={{ marginRight: '0.3rem' }} />
                    {u.role === 'admin' ? 'Admin' : 'Cliente'}
                  </span>
                </td>
                <td className="cell-sub">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                </td>
                <td className="actions-cell">
                  <select
                    className="status-select"
                    value={u.role || 'cliente'}
                    onChange={(e) => handleRole(u.id, e.target.value)}
                  >
                    <option value="cliente">Cliente</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan="5" className="empty-row">Sin usuarios registrados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
