import { useState } from 'react';
import { useCampanas } from '../../hooks/useCampanas';
import { CANALES, SECTORES, ESTADO_CAMPANA } from '../../data/crm';
import toast from 'react-hot-toast';

const EMPTY = {
  name: '',
  channel: 'email',
  targetSectors: ['Público general'],
  budget: '',
  result: '',
  startDate: '',
  endDate: '',
  status: 'activa',
};

// Compat: campañas viejas guardaban targetSector (string).
const readSectors = (c) =>
  c.targetSectors || (c.targetSector ? [c.targetSector] : []);

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const money = (n) => `S/ ${Number(n || 0).toFixed(2)}`;

export default function Campanas() {
  const { campanas, loading, addCampana, updateCampana, deleteCampana } = useCampanas();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  };

  const openEdit = (c) => {
    setEditing(c.id);
    setForm({
      ...EMPTY,
      ...c,
      targetSectors: readSectors(c),
      budget: c.budget ?? '',
      result: c.result ?? '',
    });
    setShowForm(true);
  };

  const toggleSector = (s) =>
    setForm((f) => ({
      ...f,
      targetSectors: f.targetSectors.includes(s)
        ? f.targetSectors.filter((x) => x !== s)
        : [...f.targetSectors, s],
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.targetSectors.length === 0) {
      toast.error('Selecciona al menos un sector objetivo');
      return;
    }
    setSaving(true);
    try {
      const data = {
        name: form.name,
        channel: form.channel,
        targetSectors: form.targetSectors,
        budget: Number(form.budget) || 0,
        result: Number(form.result) || 0,
        startDate: form.startDate,
        endDate: form.endDate,
        status: form.status,
      };
      if (editing) {
        await updateCampana(editing, data);
        toast.success('Campaña actualizada');
      } else {
        await addCampana(data);
        toast.success('Campaña creada');
      }
      setShowForm(false);
    } catch (err) {
      toast.error('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`¿Eliminar campaña "${name}"?`)) return;
    try {
      await deleteCampana(id);
      toast.success('Campaña eliminada');
    } catch (err) {
      toast.error('Error al eliminar');
    }
  };

  if (loading) return <div className="admin-loading">Cargando campañas...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Campañas</h1>
        <button className="btn btn-primary" onClick={openNew}>
          <i className="fa-solid fa-plus" /> Nueva Campaña
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Editar Campaña' : 'Nueva Campaña'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  required
                  maxLength={100}
                />
              </div>
              <div className="form-group">
                <label>Canal *</label>
                <select value={form.channel} onChange={(e) => setField('channel', e.target.value)}>
                  {CANALES.map((c) => (
                    <option key={c} value={c}>{cap(c)}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Sectores objetivo * (uno o varios)</label>
                <div className="checkbox-grid">
                  {SECTORES.map((s) => (
                    <label key={s} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={form.targetSectors.includes(s)}
                        onChange={() => toggleSector(s)}
                      />
                      {cap(s)}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Presupuesto (S/) *</label>
                  <input
                    type="number"
                    min="0"
                    max="9999999"
                    step="0.01"
                    value={form.budget}
                    onChange={(e) => setField('budget', e.target.value)}
                    required
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
                    onChange={(e) => setField('result', e.target.value)}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Inicio</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setField('startDate', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Fin</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setField('endDate', e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select value={form.status} onChange={(e) => setField('status', e.target.value)}>
                  {ESTADO_CAMPANA.map((s) => (
                    <option key={s} value={s}>{cap(s)}</option>
                  ))}
                </select>
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
              <th>Campaña</th>
              <th>Canal</th>
              <th>Sector</th>
              <th>Periodo</th>
              <th>Presupuesto</th>
              <th>Resultado</th>
              <th>Desviación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {campanas.map((c) => {
              const diff = (Number(c.result) || 0) - (Number(c.budget) || 0);
              return (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{cap(c.channel || '')}</td>
                  <td>{readSectors(c).map(cap).join(', ') || '—'}</td>
                  <td>
                    {c.startDate || '—'}
                    {c.endDate && <div className="cell-sub">a {c.endDate}</div>}
                  </td>
                  <td>{money(c.budget)}</td>
                  <td>{money(c.result)}</td>
                  <td className={diff >= 0 ? 'diff-pos' : 'diff-neg'}>
                    {diff >= 0 ? '+' : ''}{money(diff)}
                  </td>
                  <td>
                    <span className={`badge ${c.status === 'activa' ? 'badge-success' : 'badge-default'}`}>
                      {cap(c.status || '')}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="btn-icon" onClick={() => openEdit(c)}>
                      <i className="fa-solid fa-pen" />
                    </button>
                    <button className="btn-icon btn-danger" onClick={() => handleDelete(c.id, c.name)}>
                      <i className="fa-solid fa-trash" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {campanas.length === 0 && (
              <tr><td colSpan="9" className="empty-row">Sin campañas</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
