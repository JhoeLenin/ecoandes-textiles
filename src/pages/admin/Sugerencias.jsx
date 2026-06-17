import { useSugerencias } from '../../hooks/useSugerencias';

// MÓDULO: Sugerencias (responsable: compañera)
// Pendiente: formulario (clienteId, clienteName, categoria, texto, status)
// selector de cliente desde useClientes. Enums en src/data/crm.js
export default function Sugerencias() {
  const { sugerencias, loading } = useSugerencias();

  if (loading) return <div className="admin-loading">Cargando sugerencias...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Sugerencias</h1>
      </div>
      <p className="empty-msg">Módulo en construcción — {sugerencias.length} sugerencias</p>
    </div>
  );
}
