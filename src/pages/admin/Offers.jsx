import { useState } from 'react';
import { useOffers } from '../../hooks/useOffers';
import { useProducts } from '../../hooks/useProducts';
import toast from 'react-hot-toast';

export default function Offers() {
  const { offers, loading, addOffer, updateOffer, deleteOffer } = useOffers();
  const { products } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    discountType: 'percent',
    discountValue: '',
    budget: '',
    result: '',
    startDate: '',
    endDate: '',
    active: true,
    productIds: [],
  });
  const [saving, setSaving] = useState(false);

  const openNew = () => {
    setEditing(null);
    setForm({ name: '', discountType: 'percent', discountValue: '', budget: '', result: '', startDate: '', endDate: '', active: true, productIds: [] });
    setShowForm(true);
  };

  const openEdit = (o) => {
    setEditing(o.id);
    setForm({
      name: o.name || '',
      discountType: o.discountType || 'percent',
      discountValue: o.discountValue || '',
      budget: o.budget ?? '',
      result: o.result ?? '',
      startDate: o.startDate || '',
      endDate: o.endDate || '',
      active: o.active ?? true,
      productIds: o.productIds || [],
    });
    setShowForm(true);
  };

  const toggleProduct = (id) => {
    setForm((f) => ({
      ...f,
      productIds: f.productIds.includes(id)
        ? f.productIds.filter((i) => i !== id)
        : [...f.productIds, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        discountValue: Number(form.discountValue),
        budget: Number(form.budget) || 0,
        result: Number(form.result) || 0,
      };
      if (editing) {
        await updateOffer(editing, data);
        toast.success('Oferta actualizada');
      } else {
        await addOffer(data);
        toast.success('Oferta creada');
      }
      setShowForm(false);
    } catch (err) {
      toast.error('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`¿Eliminar oferta "${name}"?`)) return;
    try {
      await deleteOffer(id);
      toast.success('Oferta eliminada');
    } catch (err) {
      toast.error('Error al eliminar');
    }
  };

  if (loading) return <div className="admin-loading">Cargando ofertas...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Ofertas</h1>
        <button className="btn btn-primary" onClick={openNew}>
          <i className="fa-solid fa-plus" /> Nueva Oferta
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Editar Oferta' : 'Nueva Oferta'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Nombre de la oferta *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  maxLength={100}
                  placeholder="Ej: Liquidación de invierno"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tipo de descuento</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                  >
                    <option value="percent">Porcentaje (%)</option>
                    <option value="fixed">Monto fijo (S/)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Valor del descuento *</label>
                  <input
                    type="number"
                    min="0"
                    max={form.discountType === 'percent' ? 100 : 99999}
                    step="0.01"
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha inicio</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Fecha fin</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Presupuesto (S/)</label>
                  <input
                    type="number"
                    min="0"
                    max="9999999"
                    step="0.01"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label>Resultado (S/)</label>
                  <input
                    type="number"
                    min="0"
                    max="9999999"
                    step="0.01"
                    value={form.result}
                    onChange={(e) => setForm({ ...form, result: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    style={{ width: 'auto', marginRight: '0.5rem' }}
                  />
                  Oferta activa
                </label>
              </div>

              <div className="form-group">
                <label>Productos incluidos</label>
                <div className="product-checkbox-list">
                  {products.map((p) => (
                    <label key={p.id} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={form.productIds.includes(p.id)}
                        onChange={() => toggleProduct(p.id)}
                      />
                      {p.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
                <button className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descuento</th>
              <th>Período</th>
              <th>Presup. / Result.</th>
              <th>Estado</th>
              <th>Productos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((o) => {
              const discText = o.discountType === 'percent'
                ? `${o.discountValue}%`
                : `S/ ${o.discountValue}`;
              const now = new Date();
              const start = o.startDate ? new Date(o.startDate) : null;
              const end = o.endDate ? new Date(o.endDate) : null;
              const isExpired = end && end < now;
              const isFuture = start && start > now;

              return (
                <tr key={o.id}>
                  <td>{o.name}</td>
                  <td>{discText}</td>
                  <td>
                    {o.startDate || '—'} → {o.endDate || '—'}
                  </td>
                  <td>
                    S/ {Number(o.budget || 0).toFixed(2)}
                    <div className="cell-sub">Result: S/ {Number(o.result || 0).toFixed(2)}</div>
                  </td>
                  <td>
                    <span className={`badge ${isExpired ? 'badge-danger' : isFuture ? 'badge-warning' : o.active ? 'badge-success' : 'badge-default'}`}>
                      {isExpired ? 'Vencida' : isFuture ? 'Programada' : o.active ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td>{o.productIds?.length || 0}</td>
                  <td className="actions-cell">
                    <button className="btn-icon" onClick={() => openEdit(o)}>
                      <i className="fa-solid fa-pen" />
                    </button>
                    <button className="btn-icon btn-danger" onClick={() => handleDelete(o.id, o.name)}>
                      <i className="fa-solid fa-trash" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {offers.length === 0 && (
              <tr><td colSpan="7" className="empty-row">Sin ofertas creadas</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
