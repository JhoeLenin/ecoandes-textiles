import { useUsers } from '../../hooks/useUsers';
import toast from 'react-hot-toast';

export default function Users() {
  const { users, loading, updateUserRole } = useUsers();

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

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name || '—'}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge ${u.role === 'admin' ? 'badge-success' : 'badge-default'}`}>
                    {u.role || 'cliente'}
                  </span>
                </td>
                <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
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
