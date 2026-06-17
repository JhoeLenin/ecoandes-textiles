import { useReclamos } from '../../hooks/useReclamos';

// MÓDULO: Reclamos (responsable: compañera)
// Pendiente: formulario (clienteId, clienteName, asunto, detalle, status, respuesta)
// selector de cliente desde useClientes. Enums en src/data/crm.js
export default function Reclamos() {
  const { reclamos, loading } = useReclamos();

  if (loading) return <div className="admin-loading">Cargando reclamos...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Reclamos</h1>
      </div>
      <p className="empty-msg">Módulo en construcción — {reclamos.length} reclamos</p>
    </div>
  );
}
