import { useClientes } from '../../hooks/useClientes';

// MÓDULO: Clientes CRM (responsable: Jhoel)
// Pendiente: formulario (name, type, sector, tienda, email, phone, contactName, status)
// + tabla con filtros por sector/tienda. Enums en src/data/crm.js
export default function Clientes() {
  const { clientes, loading } = useClientes();

  if (loading) return <div className="admin-loading">Cargando clientes...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Clientes</h1>
      </div>
      <p className="empty-msg">Módulo en construcción — {clientes.length} clientes</p>
    </div>
  );
}
