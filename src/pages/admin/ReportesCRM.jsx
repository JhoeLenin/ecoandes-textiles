import { useClientes } from '../../hooks/useClientes';
import { useCampanas } from '../../hooks/useCampanas';
import { useOffers } from '../../hooks/useOffers';
import { useSugerencias } from '../../hooks/useSugerencias';
import { useReclamos } from '../../hooks/useReclamos';
import { SECTORES, TIENDAS } from '../../data/crm';

function groupCount(items, key) {
  return items.reduce((acc, item) => {
    const k = item[key] || 'sin asignar';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
}

function DeviationBadge({ budget, result }) {
  const dev = (result || 0) - (budget || 0);
  const pct = budget > 0 ? ((dev / budget) * 100).toFixed(0) : null;
  return (
    <span className={`badge ${dev >= 0 ? 'badge-success' : 'badge-danger'}`}>
      {dev >= 0 ? '+' : ''}S/ {dev.toFixed(2)}{pct !== null ? ` (${dev >= 0 ? '+' : ''}${pct}%)` : ''}
    </span>
  );
}

export default function ReportesCRM() {
  const { clientes } = useClientes();
  const { campanas } = useCampanas();
  const { offers } = useOffers();
  const { sugerencias } = useSugerencias();
  const { reclamos } = useReclamos();

  // 1. Nuevos clientes por sector y tienda
  const porSector = groupCount(clientes, 'sector');
  const porTienda = groupCount(clientes, 'tienda');

  // 2. Presupuesto vs resultado de campañas
  const campTotalBudget = campanas.reduce((s, c) => s + (c.budget || 0), 0);
  const campTotalResult = campanas.reduce((s, c) => s + (c.result || 0), 0);

  // 3. Presupuesto vs resultado de promociones (offers sin budget/result = 0)
  const offTotalBudget = offers.reduce((s, o) => s + (o.budget || 0), 0);
  const offTotalResult = offers.reduce((s, o) => s + (o.result || 0), 0);

  // 4. Sugerencias por categoría y estado
  const sugPorCategoria = groupCount(sugerencias, 'categoria');
  const sugPorEstado = groupCount(sugerencias, 'status');

  // 5. Reclamos por estado
  const recPorEstado = groupCount(reclamos, 'status');

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Reportes CRM</h1>
      </div>

      {/* Reporte 1 */}
      <div className="admin-section">
        <h2><i className="fa-solid fa-users" /> 1. Nuevos clientes por sector y tienda</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--terracotta)' }}>
              <i className="fa-solid fa-address-book" />
            </div>
            <div className="stat-info">
              <span className="stat-value">{clientes.length}</span>
              <span className="stat-label">Clientes totales</span>
            </div>
          </div>
        </div>
        <div className="form-row" style={{ alignItems: 'flex-start' }}>
          <div className="table-wrap" style={{ flex: 1 }}>
            <table className="admin-table">
              <thead><tr><th>Sector</th><th>Clientes</th></tr></thead>
              <tbody>
                {SECTORES.map((s) => (
                  <tr key={s}>
                    <td>{s}</td>
                    <td>{porSector[s] || 0}</td>
                  </tr>
                ))}
                {clientes.length === 0 && (
                  <tr><td colSpan="2" className="empty-row">Sin datos de clientes</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="table-wrap" style={{ flex: 1 }}>
            <table className="admin-table">
              <thead><tr><th>Tienda</th><th>Clientes</th></tr></thead>
              <tbody>
                {TIENDAS.map((t) => (
                  <tr key={t}>
                    <td>{t}</td>
                    <td>{porTienda[t] || 0}</td>
                  </tr>
                ))}
                {clientes.length === 0 && (
                  <tr><td colSpan="2" className="empty-row">Sin datos de clientes</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reporte 2 */}
      <div className="admin-section">
        <h2><i className="fa-solid fa-bullhorn" /> 2. Presupuesto vs resultado de campañas</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--sage)' }}>
              <i className="fa-solid fa-coins" /></div>
            <div className="stat-info">
              <span className="stat-value">S/ {campTotalBudget.toFixed(2)}</span>
              <span className="stat-label">Presupuesto total</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--forest)' }}>
              <i className="fa-solid fa-chart-line" /></div>
            <div className="stat-info">
              <span className="stat-value">S/ {campTotalResult.toFixed(2)}</span>
              <span className="stat-label">Resultado total</span>
            </div>
          </div>
        </div>
        <div className="table-wrap">
          <table className="admin-table">
            <thead><tr><th>Campaña</th><th>Sector</th><th>Presupuesto</th><th>Resultado</th><th>Desviación</th></tr></thead>
            <tbody>
              {campanas.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{(c.targetSectors || (c.targetSector ? [c.targetSector] : [])).join(', ') || '—'}</td>
                  <td>S/ {(c.budget || 0).toFixed(2)}</td>
                  <td>S/ {(c.result || 0).toFixed(2)}</td>
                  <td><DeviationBadge budget={c.budget} result={c.result} /></td>
                </tr>
              ))}
              {campanas.length === 0 && (
                <tr><td colSpan="5" className="empty-row">Sin campañas registradas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reporte 3 */}
      <div className="admin-section">
        <h2><i className="fa-solid fa-percent" /> 3. Presupuesto vs resultado de promociones</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--gold)' }}>
              <i className="fa-solid fa-coins" /></div>
            <div className="stat-info">
              <span className="stat-value">S/ {offTotalBudget.toFixed(2)}</span>
              <span className="stat-label">Presupuesto total</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--clay)' }}>
              <i className="fa-solid fa-chart-line" /></div>
            <div className="stat-info">
              <span className="stat-value">S/ {offTotalResult.toFixed(2)}</span>
              <span className="stat-label">Resultado total</span>
            </div>
          </div>
        </div>
        <div className="table-wrap">
          <table className="admin-table">
            <thead><tr><th>Promoción</th><th>Presupuesto</th><th>Resultado</th><th>Desviación</th></tr></thead>
            <tbody>
              {offers.map((o) => (
                <tr key={o.id}>
                  <td>{o.name}</td>
                  <td>S/ {(o.budget || 0).toFixed(2)}</td>
                  <td>S/ {(o.result || 0).toFixed(2)}</td>
                  <td><DeviationBadge budget={o.budget} result={o.result} /></td>
                </tr>
              ))}
              {offers.length === 0 && (
                <tr><td colSpan="4" className="empty-row">Sin promociones registradas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reporte 4 */}
      <div className="admin-section">
        <h2><i className="fa-solid fa-lightbulb" /> 4. Lista y análisis de sugerencias</h2>
        <div className="form-row" style={{ alignItems: 'flex-start' }}>
          <div className="table-wrap" style={{ flex: 1 }}>
            <table className="admin-table">
              <thead><tr><th>Categoría</th><th>Cantidad</th></tr></thead>
              <tbody>
                {Object.entries(sugPorCategoria).map(([cat, count]) => (
                  <tr key={cat}><td>{cat}</td><td>{count}</td></tr>
                ))}
                {sugerencias.length === 0 && (
                  <tr><td colSpan="2" className="empty-row">Sin sugerencias</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="table-wrap" style={{ flex: 1 }}>
            <table className="admin-table">
              <thead><tr><th>Estado</th><th>Cantidad</th></tr></thead>
              <tbody>
                {Object.entries(sugPorEstado).map(([st, count]) => (
                  <tr key={st}><td>{st}</td><td>{count}</td></tr>
                ))}
                {sugerencias.length === 0 && (
                  <tr><td colSpan="2" className="empty-row">Sin sugerencias</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reporte 5 */}
      <div className="admin-section">
        <h2><i className="fa-solid fa-triangle-exclamation" /> 5. Lista y análisis de reclamos</h2>
        <div className="table-wrap">
          <table className="admin-table">
            <thead><tr><th>Estado</th><th>Cantidad</th><th>% del total</th></tr></thead>
            <tbody>
              {Object.entries(recPorEstado).map(([st, count]) => (
                <tr key={st}>
                  <td>{st}</td>
                  <td>{count}</td>
                  <td>{reclamos.length > 0 ? ((count / reclamos.length) * 100).toFixed(0) : 0}%</td>
                </tr>
              ))}
              {reclamos.length === 0 && (
                <tr><td colSpan="3" className="empty-row">Sin reclamos registrados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
