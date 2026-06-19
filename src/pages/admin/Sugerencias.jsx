import { useState } from 'react';
import { useSugerencias } from '../../hooks/useSugerencias';
import { useClientes } from '../../hooks/useClientes';
import { CATEGORIA_SUGERENCIA, ESTADO_SUGERENCIA } from '../../data/crm';
import toast from 'react-hot-toast';

const emptyForm = {
  clienteId: '',
  clienteName: '',
  categoria: '',
  texto: '',
  status: 'nueva',
};

const STATUS_BADGE = { nueva: 'badge-info', revisada: 'badge-warning', aplicada: 'badge-success' };

export default function Sugerencias() {
  const { sugerencias, loading, addSugerencia, updateSugerencia, deleteSugerencia } = useSugerencias();
  const { clientes } = useClientes();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filtered = sugerencias.filter((s) => {
    const matchesCategoria = !filterCategoria || s.categoria === filterCategoria;
    const matchesStatus = !filterStatus || s.status === filterStatus;
    return matchesCategoria && matchesStatus;
  });

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (s) => {
    setEditing(s.id);
    setForm({
      clienteId: s.clienteId || '',
      clienteName: s.clienteName || '',
      categoria: s.categoria || '',
      texto: s.texto || '',
      status: s.status || 'nueva',
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
      if (editing) {
        await updateSugerencia(editing, form);
        toast.success('Sugerencia actualizada');
      } else {
        await addSugerencia(form);
        toast.success('Sugerencia creada');
      }
      setShowForm(false);
    } catch (err) {
      toast.error('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, texto) => {
    if (!confirm(`¿Eliminar sugerencia "${texto?.slice(0, 30)}..."?`)) return;
    try {
      await deleteSugerencia(id);
      toast.success('Sugerencia eliminada');
    } catch (err) {
      toast.error('Error al eliminar');
    }
  };

  if (loading) return <div className="admin-loading">Cargando sugerencias...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Sugerencias</h1>
        <button className="btn btn-primary" onClick={openNew}>
          <i className="fa-solid fa-plus" /> Nueva Sugerencia
        </button>
      </div>

      <div className="admin-toolbar" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <select value={filterCategoria} onChange={(e) => setFilterCategoria(e.target.value)}>
          <option value="">Todas las categorías</option>
          {CATEGORIA_SUGERENCIA.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">Todos los estados</option>
          {ESTADO_SUGERENCIA.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Editar Sugerencia' : 'Nueva Sugerencia'}</h2>
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
                <label>Categoría *</label>
                <select
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  required
                >
                  <option value="">Seleccionar...</option>
                  {CATEGORIA_SUGERENCIA.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Sugerencia *</label>
                <textarea
                  rows="3"
                  value={form.texto}
                  onChange={(e) => setForm({ ...form, texto: e.target.value })}
                  required
                  maxLength={500}
                />
              </div>

              <div className="form-group">
                <label>Estado</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {ESTADO_SUGERENCIA.map((s) => (
                    <option key={s} value={s}>{s}</option>
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
              <th>Cliente</th>
              <th>Categoría</th>
              <th>Sugerencia</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td>{s.clienteName}</td>
                <td>{s.categoria}</td>
                <td className="text-muted">{s.texto?.slice(0, 60)}{s.texto?.length > 60 ? '…' : ''}</td>
                <td>
                  <span className={`badge ${STATUS_BADGE[s.status] || 'badge-default'}`}>
                    {s.status}
                  </span>
                </td>
                <td>{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '—'}</td>
                <td className="actions-cell">
                  <button className="btn-icon" onClick={() => openEdit(s)}>
                    <i className="fa-solid fa-pen" />
                  </button>
                  <button className="btn-icon btn-danger" onClick={() => handleDelete(s.id, s.texto)}>
                    <i className="fa-solid fa-trash" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="6" className="empty-row">Sin sugerencias registradas</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
