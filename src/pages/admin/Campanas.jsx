import { useCampanas } from '../../hooks/useCampanas';

// MÓDULO: Campañas (responsable: Jhoel)
// Pendiente: formulario (name, channel, budget, result, targetSector, startDate, endDate, status)
// + tabla con presupuesto vs resultado. Enums en src/data/crm.js
export default function Campanas() {
  const { campanas, loading } = useCampanas();

  if (loading) return <div className="admin-loading">Cargando campañas...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Campañas</h1>
      </div>
      <p className="empty-msg">Módulo en construcción — {campanas.length} campañas</p>
    </div>
  );
}
