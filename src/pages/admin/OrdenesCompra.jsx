import { useState } from 'react';
import { useOrdenesCompra } from '../../hooks/useOrdenesCompra';
import { useProveedores } from '../../hooks/useProveedores';
import { useProducts } from '../../hooks/useProducts';
import { ESTADO_OC_LABEL } from '../../data/scm';
import { formatPrice } from '../../context/CatalogContext';
import toast from 'react-hot-toast';

const badgeClass = { solicitado: 'badge-warning', aprobado: 'badge-info', recibido: 'badge-success', rechazado: 'badge-danger' };
const fecha = (iso) => { try { return new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return '—'; } };

export default function OrdenesCompra() {
  const { ordenes, loading, addOrden, updateOrden, deleteOrden, recibirOrden } = useOrdenesCompra();
  const { proveedores } = useProveedores();
  const { products } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [proveedorId, setProveedorId] = useState('');
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);

  const total = items.reduce((s, i) => s + i.qty * i.unitCost, 0);

  const openNew = () => { setProveedorId(''); setItems([]); setShowForm(true); };
  const addItem = () => setItems([...items, { productId: '', name: '', qty: 1, unitCost: 0 }]);
  const setItem = (idx, patch) => setItems(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));

  const onPickProduct = (idx, docId) => {
    const p = products.find((x) => x.docId === docId);
    setItem(idx, { productId: docId, name: p?.name || '', unitCost: p?.priceList || 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proveedorId) { toast.error('Selecciona un proveedor'); return; }
    if (items.length === 0 || items.some((i) => !i.productId)) { toast.error('Agrega al menos un producto válido'); return; }
    setSaving(true);
    try {
      const prov = proveedores.find((p) => p.id === proveedorId);
      await addOrden({
        proveedorId, proveedorName: prov?.name || '',
        items: items.map((i) => ({ productId: i.productId, name: i.name, qty: Number(i.qty), unitCost: Number(i.unitCost) })),
        total,
      });
      toast.success('Orden de compra registrada');
      setShowForm(false);
    } catch (err) { toast.error('Error: ' + err.message); }
    finally { setSaving(false); }
  };

  const aprobar = async (o) => { try { await updateOrden(o.id, { status: 'aprobado' }); toast.success('Orden aprobada'); } catch { toast.error('Error'); } };
  const rechazar = async (o) => { try { await updateOrden(o.id, { status: 'rechazado' }); toast('Orden rechazada'); } catch { toast.error('Error'); } };
  const recibir = async (o) => {
    if (!confirm('¿Confirmar recepción? Sumará las cantidades al stock.')) return;
    try { await recibirOrden(o); toast.success('Recepción registrada, stock actualizado'); }
    catch (err) { toast.error('Error al recibir: ' + err.message); }
  };
  const borrar = async (o) => {
    if (!confirm('¿Eliminar la orden de compra?')) return;
    try { await deleteOrden(o.id); toast.success('Orden eliminada'); } catch { toast.error('Error'); }
  };

  if (loading) return <div className="admin-loading">Cargando órdenes...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Órdenes de Compra</h1>
        <button className="btn btn-primary" onClick={openNew}>
          <i className="fa-solid fa-plus" /> Nueva Orden
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nueva Orden de Compra</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}><i className="fa-solid fa-xmark" /></button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Proveedor *</label>
                <select value={proveedorId} onChange={(e) => setProveedorId(e.target.value)} required>
                  <option value="">Seleccionar...</option>
                  {proveedores.filter((p) => p.status === 'activo').map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Productos a comprar</label>
                {items.map((it, idx) => (
                  <div className="form-row" key={idx} style={{ alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                    <div className="form-group" style={{ flex: 2 }}>
                      <select value={it.productId} onChange={(e) => onPickProduct(idx, e.target.value)} required>
                        <option value="">Producto...</option>
                        {products.map((p) => <option key={p.docId} value={p.docId}>{p.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <input type="number" min="1" max="99999" value={it.qty} placeholder="Cant."
                        onChange={(e) => setItem(idx, { qty: Number(e.target.value) })} />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <input type="number" min="0" step="0.01" value={it.unitCost} placeholder="Costo unit."
                        onChange={(e) => setItem(idx, { unitCost: Number(e.target.value) })} />
                    </div>
                    <button type="button" className="btn-icon btn-danger" onClick={() => removeItem(idx)}><i className="fa-solid fa-xmark" /></button>
                  </div>
                ))}
                <button type="button" className="btn btn-outline btn-sm" onClick={addItem}>
                  <i className="fa-solid fa-plus" /> Agregar producto
                </button>
              </div>

              <p style={{ textAlign: 'right', fontWeight: 700 }}>Total: {formatPrice(total)}</p>

              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancelar</button>
                <button className="btn btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Registrar orden'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Fecha</th><th>Proveedor</th><th>Ítems</th><th>Total</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {ordenes.map((o) => (
              <tr key={o.id}>
                <td>{fecha(o.createdAt)}</td>
                <td>{o.proveedorName || '—'}</td>
                <td>{(o.items || []).map((i) => `${i.name} ×${i.qty}`).join(', ')}</td>
                <td>{formatPrice(o.total)}</td>
                <td><span className={`badge ${badgeClass[o.status] || ''}`}>{ESTADO_OC_LABEL[o.status] || o.status}</span></td>
                <td className="actions-cell">
                  {o.status === 'solicitado' && (
                    <>
                      <button className="btn-icon" onClick={() => aprobar(o)} title="Aprobar"><i className="fa-solid fa-check" /></button>
                      <button className="btn-icon btn-danger" onClick={() => rechazar(o)} title="Rechazar"><i className="fa-solid fa-ban" /></button>
                    </>
                  )}
                  {o.status === 'aprobado' && (
                    <button className="btn-icon" onClick={() => recibir(o)} title="Recibir (suma stock)"><i className="fa-solid fa-truck-ramp-box" /></button>
                  )}
                  <button className="btn-icon btn-danger" onClick={() => borrar(o)} title="Eliminar"><i className="fa-solid fa-trash" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {ordenes.length === 0 && <p className="empty-msg">No hay órdenes de compra</p>}
      </div>
    </div>
  );
}
