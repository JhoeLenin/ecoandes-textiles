import { useClientes } from '../../hooks/useClientes';
import { useCampanas } from '../../hooks/useCampanas';
import { useOffers } from '../../hooks/useOffers';
import { useSugerencias } from '../../hooks/useSugerencias';
import { useReclamos } from '../../hooks/useReclamos';

// MÓDULO: Reportes CRM (responsable: compañera)
// Pendiente (5 reportes de la guía):
//  1. Nuevos clientes por sector y tienda    -> clientes
//  2. Presupuesto vs resultado de campañas   -> campanas (budget/result)
//  3. Presupuesto vs resultado de promociones-> offers (budget/result)
//  4. Lista y análisis de sugerencias        -> sugerencias
//  5. Lista y análisis de reclamos           -> reclamos
export default function ReportesCRM() {
  const { clientes } = useClientes();
  const { campanas } = useCampanas();
  const { offers } = useOffers();
  const { sugerencias } = useSugerencias();
  const { reclamos } = useReclamos();

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Reportes CRM</h1>
      </div>
      <p className="empty-msg">
        Módulo en construcción — {clientes.length} clientes, {campanas.length} campañas,{' '}
        {offers.length} promociones, {sugerencias.length} sugerencias, {reclamos.length} reclamos
      </p>
    </div>
  );
}
