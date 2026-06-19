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

// Barra horizontal simple. data: [{ label, value }]
function BarChart({ data, color = 'var(--terracotta)', money = false }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  if (!data.some((d) => d.value > 0)) return <p className="empty-msg">Sin datos para graficar</p>;
  return (
    <div className="bar-chart">
      {data.map((d) => (
        <div className="bar-row" key={d.label}>
          <span className="bar-label">{d.label}</span>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${(d.value / max) * 100}%`, background: color }} />
          </div>
          <span className="bar-value">{money ? `S/ ${d.value.toFixed(2)}` : d.value}</span>
        </div>
      ))}
    </div>
  );
}

// Barras agrupadas presupuesto vs resultado. data: [{ label, budget, result }]
function BudgetResultChart({ data }) {
  const max = Math.max(1, ...data.flatMap((d) => [d.budget || 0, d.result || 0]));
  if (data.length === 0) return <p className="empty-msg">Sin datos para graficar</p>;
  return (
    <div className="bar-chart">
      {data.map((d) => (
        <div className="bar-group" key={d.label}>
          <span className="bar-label">{d.label}</span>
          <div className="bar-pair">
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${((d.budget || 0) / max) * 100}%`, background: 'var(--sage)' }} />
              <span className="bar-inline-value">S/ {(d.budget || 0).toFixed(0)}</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${((d.result || 0) / max) * 100}%`, background: 'var(--forest)' }} />
              <span className="bar-inline-value">S/ {(d.result || 0).toFixed(0)}</span>
            </div>
          </div>
        </div>
      ))}
      <div className="bar-legend">
        <span><i style={{ background: 'var(--sage)' }} /> Presupuesto</span>
        <span><i style={{ background: 'var(--forest)' }} /> Resultado</span>
      </div>
    </div>
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

  // Datos para gráficos
  const sectorBars = SECTORES.map((s) => ({ label: s, value: porSector[s] || 0 }));
  const tiendaBars = TIENDAS.map((t) => ({ label: t, value: porTienda[t] || 0 }));
  const campBars = campanas.map((c) => ({ label: c.name, budget: c.budget || 0, result: c.result || 0 }));
  const offBars = offers.map((o) => ({ label: o.name, budget: o.budget || 0, result: o.result || 0 }));
  const sugCatBars = Object.entries(sugPorCategoria).map(([label, value]) => ({ label, value }));
  const recBars = Object.entries(recPorEstado).map(([label, value]) => ({ label, value }));

  return (
    <div className="admin-page report-page">
      <div className="admin-header">
        <h1 className="admin-title">Reportes CRM</h1>
        <button className="btn btn-outline no-print" onClick={() => window.print()}>
          <i className="fa-solid fa-print" /> Exportar / Imprimir
        </button>
      </div>
      <p className="report-print-date">Generado: {new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}</p>

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
        <div className="form-row" style={{ alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <h4 className="chart-title">Clientes por sector</h4>
            <BarChart data={sectorBars} color="var(--terracotta)" />
          </div>
          <div style={{ flex: 1 }}>
            <h4 className="chart-title">Clientes por tienda</h4>
            <BarChart data={tiendaBars} color="var(--forest)" />
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
        <h4 className="chart-title">Presupuesto vs resultado por campaña</h4>
        <BudgetResultChart data={campBars} />
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
        <h4 className="chart-title">Presupuesto vs resultado por promoción</h4>
        <BudgetResultChart data={offBars} />
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
        <h4 className="chart-title">Sugerencias por categoría</h4>
        <BarChart data={sugCatBars} color="var(--gold)" />
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
        <h4 className="chart-title">Reclamos por estado</h4>
        <BarChart data={recBars} color="var(--clay)" />
      </div>
    </div>
  );
}
