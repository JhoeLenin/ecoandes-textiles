import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useVendedores } from '../../hooks/useVendedores';
import { useSellerTotals } from '../../hooks/useSellerTotals';
import { useMarketplaceConfig } from '../../hooks/useMarketplaceConfig';
import { formatPrice } from '../../context/CatalogContext';
import toast from 'react-hot-toast';

export default function Vendedores() {
  const { vendedores, loading, updateVendedor, deleteVendedor } = useVendedores();
  const { totals } = useSellerTotals();
  const { commissionRate, saveCommissionPct } = useMarketplaceConfig();
  const [pct, setPct] = useState('');

  // Sincroniza el input cuando llega/actualiza la tasa.
  useEffect(() => { setPct((commissionRate * 100).toString()); }, [commissionRate]);

  const saveRate = async () => {
    try { await saveCommissionPct(pct); toast.success('Comisión actualizada'); }
    catch (err) { toast.error('Error: ' + err.message); }
  };

  const toggleStatus = async (v) => {
    const next = v.status === 'activo' ? 'suspendido' : 'activo';
    try { await updateVendedor(v.id, { status: next }); toast.success(`Tienda ${next}`); }
    catch { toast.error('Error al actualizar'); }
  };

  const handleDelete = async (v) => {
    if (!confirm(`¿Eliminar la tienda "${v.storeName}"? El usuario dejará de ser vendedor.`)) return;
    try { await deleteVendedor(v.id); toast.success('Tienda eliminada'); }
    catch { toast.error('Error al eliminar'); }
  };

  if (loading) return <div className="admin-loading">Cargando vendedores...</div>;

  const grandBruto = Object.values(totals).reduce((s, t) => s + t.bruto, 0);
  const grandComision = grandBruto * commissionRate;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Vendedores &amp; Comisiones</h1>
      </div>

      {/* Config comisión */}
      <div className="admin-section">
        <h2><i className="fa-solid fa-percent" /> Comisión del marketplace</h2>
        <div className="form-row" style={{ alignItems: 'flex-end', maxWidth: 420 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Comisión por venta (%)</label>
            <input type="number" min="0" max="100" step="0.5" value={pct}
              onChange={(e) => setPct(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={saveRate}>Guardar</button>
        </div>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem' }}>
          Se aplica sobre el monto bruto de cada venta. Actual: <strong>{(commissionRate * 100).toFixed(1)}%</strong>.
        </p>
      </div>

      {/* Resumen */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--terracotta)' }}><i className="fa-solid fa-store" /></div>
          <div className="stat-info"><span className="stat-value">{vendedores.length}</span><span className="stat-label">Vendedores</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--forest)' }}><i className="fa-solid fa-sack-dollar" /></div>
          <div className="stat-info"><span className="stat-value">{formatPrice(grandBruto)}</span><span className="stat-label">Ventas brutas (todas)</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--gold)' }}><i className="fa-solid fa-hand-holding-dollar" /></div>
          <div className="stat-info"><span className="stat-value">{formatPrice(grandComision)}</span><span className="stat-label">Comisión total</span></div>
        </div>
      </div>

      {/* Tabla vendedores + comisión */}
      <div className="admin-section">
        <h2><i className="fa-solid fa-table-list" /> Detalle por vendedor</h2>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tienda</th><th>Estado</th><th>Pedidos</th><th>Unid.</th>
                <th>Bruto</th><th>Comisión</th><th>Neto vendedor</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vendedores.map((v) => {
                const t = totals[v.id] || { bruto: 0, units: 0, orders: 0 };
                const comision = t.bruto * commissionRate;
                const neto = t.bruto - comision;
                return (
                  <tr key={v.id}>
                    <td>
                      <Link to={`/tienda/vendedor/${v.id}`}>{v.storeName}</Link>
                    </td>
                    <td>
                      <span className={`badge ${v.status === 'activo' ? 'badge-success' : 'badge-warning'}`}>{v.status}</span>
                    </td>
                    <td>{t.orders}</td>
                    <td>{t.units}</td>
                    <td>{formatPrice(t.bruto)}</td>
                    <td>{formatPrice(comision)}</td>
                    <td>{formatPrice(neto)}</td>
                    <td className="actions-cell">
                      <button className="btn-icon" onClick={() => toggleStatus(v)} title={v.status === 'activo' ? 'Suspender' : 'Activar'}>
                        <i className={`fa-solid ${v.status === 'activo' ? 'fa-ban' : 'fa-check'}`} />
                      </button>
                      <button className="btn-icon btn-danger" onClick={() => handleDelete(v)} title="Eliminar">
                        <i className="fa-solid fa-trash" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {vendedores.length === 0 && (
                <tr><td colSpan="8" className="empty-row">Sin vendedores registrados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
