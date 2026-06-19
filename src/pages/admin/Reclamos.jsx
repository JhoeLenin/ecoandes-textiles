import { useState } from 'react';
import { useReclamos } from '../../hooks/useReclamos';
import { useClientes } from '../../hooks/useClientes';
import { ESTADO_RECLAMO } from '../../data/crm';
import toast from 'react-hot-toast';

const emptyForm = {
  clienteId: '',
  clienteName: '',
  asunto: '',
  detalle: '',
  status: 'abierto',
  respuesta: '',
  history: [],
  statusNote: '',
};

const STATUS_BADGE = { abierto: 'badge-danger', en_proceso: 'badge-warning', resuelto: 'badge-success' };

export default function Reclamos() {
  const { reclamos, loading, addReclamo, updateReclamo, deleteReclamo } = useReclamos();
  const { clientes } = useClientes();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [origStatus, setOrigStatus] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

  const filtered = filterStatus ? reclamos.filter((r) => r.status === filterStatus) : reclamos;

  const openNew = () => {
    setEditing(null);
    setOrigStatus(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (r) => {
    setEditing(r.id);
    setOrigStatus(r.status || 'abierto');
    setForm({
      clienteId: r.clienteId || '',
      clienteName: r.clienteName || '',
      asunto: r.asunto || '',
      detalle: r.detalle || '',
      status: r.status || 'abierto',
      respuesta: r.respuesta || '',
      history: r.history || [],
      statusNote: '',
    });
    setShowForm(true);
  };

  const handleClienteChange = (id) => {
    const cliente = clientes.find((c) => c.id === id);
    setForm({ ...form, clienteId: id, clienteName: cliente ? cliente.name : '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const base = {
        clienteId: form.clienteId,
        clienteName: form.clienteName,
        asunto: form.asunto,
        detalle: form.detalle,
        status: form.status,
        respuesta: form.respuesta,
      };
      if (editing) {
        let history = form.history || [];
        if (form.status !== origStatus) {
          history = [
            ...history,
            { status: form.status, date: new Date().toISOString(), note: form.statusNote || '' },
          ];
        }
        await updateReclamo(editing, { ...base, history });
        toast.success('Reclamo actualizado');
      } else {
        const history = [
          { status: form.status, date: new Date().toISOString(), note: 'Reclamo creado' },
        ];
        await addReclamo({ ...base, history });
        toast.success('Reclamo creado');
      }
      setShowForm(false);
    } catch (err) {
      toast.error('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, asunto) => {
    if (!confirm(`¿Eliminar reclamo "${asunto}"?`)) return;
    try {
      await deleteReclamo(id);
      toast.success('Reclamo eliminado');
    } catch (err) {
      toast.error('Error al eliminar');
    }
  };

  if (loading) return <div className="admin-loading">Cargando reclamos...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Reclamos</h1>
        <button className="btn btn-primary" onClick={openNew}>
          <i className="fa-solid fa-plus" /> Nuevo Reclamo
        </button>
      </div>

      <div className="admin-toolbar">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">Todos los estados</option>
          {ESTADO_RECLAMO.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Editar Reclamo' : 'Nuevo Reclamo'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Cliente *</label>
                <select
                  value={form.clienteId}
                  onChange={(e) => handleClienteChange(e.target.value)}
                  required
                >
                  <option value="">Seleccionar cliente...</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {clientes.length === 0 && (
                  <span className="text-muted">No hay clientes registrados aún</span>
                )}
              </div>

              <div className="form-group">
                <label>Asunto *</label>
                <input
                  type="text"
                  value={form.asunto}
                  onChange={(e) => setForm({ ...form, asunto: e.target.value })}
                  required
                  maxLength={120}
                  placeholder="Ej: Retraso en entrega"
                />
              </div>

              <div className="form-group">
                <label>Detalle *</label>
                <textarea
                  rows="3"
                  value={form.detalle}
                  onChange={(e) => setForm({ ...form, detalle: e.target.value })}
                  required
                  maxLength={500}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    {ESTADO_RECLAMO.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                {editing && form.status !== origStatus && (
                  <div className="form-group">
                    <label>Nota del cambio de estado</label>
                    <input
                      type="text"
                      value={form.statusNote}
                      onChange={(e) => setForm({ ...form, statusNote: e.target.value })}
                      maxLength={200}
                      placeholder="¿Qué cambió? (opcional)"
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Respuesta</label>
                <textarea
                  rows="2"
                  value={form.respuesta}
                  onChange={(e) => setForm({ ...form, respuesta: e.target.value })}
                  maxLength={500}
                  placeholder="Respuesta dada al cliente (opcional)"
                />
              </div>

              {editing && form.history.length > 0 && (
                <div className="form-group">
                  <label>Historial de evolución</label>
                  <ul className="status-timeline">
                    {form.history.map((h, i) => (
                      <li key={i}>
                        <span className={`badge ${STATUS_BADGE[h.status] || 'badge-default'}`}>{h.status}</span>
                        <span className="cell-sub">{new Date(h.date).toLocaleString()}</span>
                        {h.note && <span className="timeline-note"> — {h.note}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

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
              <th>Cliente</th>
              <th>Asunto</th>
              <th>Detalle</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td>{r.clienteName}</td>
                <td>{r.asunto}</td>
                <td className="text-muted">{r.detalle?.slice(0, 60)}{r.detalle?.length > 60 ? '…' : ''}</td>
                <td>
                  <span className={`badge ${STATUS_BADGE[r.status] || 'badge-default'}`}>
                    {r.status}
                  </span>
                </td>
                <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}</td>
                <td className="actions-cell">
                  <button className="btn-icon" onClick={() => openEdit(r)}>
                    <i className="fa-solid fa-pen" />
                  </button>
                  <button className="btn-icon btn-danger" onClick={() => handleDelete(r.id, r.asunto)}>
                    <i className="fa-solid fa-trash" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="6" className="empty-row">Sin reclamos registrados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}