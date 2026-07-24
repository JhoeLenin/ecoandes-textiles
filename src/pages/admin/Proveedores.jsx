import { useState } from 'react';
import { useProveedores } from '../../hooks/useProveedores';
import { ESTADO_PROVEEDOR } from '../../data/scm';
import toast from 'react-hot-toast';

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

const EMPTY = {
  name: '', ruc: '', category: '', contactName: '',
  email: '', phone: '', leadTimeDays: '', status: 'activo',
};

export default function Proveedores() {
  const { proveedores, loading, addProveedor, updateProveedor, deleteProveedor } = useProveedores();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = proveedores.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setEditing(null); setForm(EMPTY); setShowForm(true); };
  const openEdit = (p) => {
    setEditing(p.id);
    setForm({
      name: p.name || '', ruc: p.ruc || '', category: p.category || '',
      contactName: p.contactName || '', email: p.email || '', phone: p.phone || '',
      leadTimeDays: p.leadTimeDays || '', status: p.status || 'activo',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form, leadTimeDays: Number(form.leadTimeDays) || 0 };
      if (editing) { await updateProveedor(editing, data); toast.success('Proveedor actualizado'); }
      else { await addProveedor(data); toast.success('Proveedor registrado'); }
      setShowForm(false);
    } catch (err) { toast.error('Error al guardar: ' + err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`¿Eliminar proveedor "${name}"?`)) return;
    try { await deleteProveedor(id); toast.success('Proveedor eliminado'); }
    catch { toast.error('Error al eliminar'); }
  };

  if (loading) return <div className="admin-loading">Cargando proveedores...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Proveedores</h1>
        <button className="btn btn-primary" onClick={openNew}>
          <i className="fa-solid fa-plus" /> Nuevo Proveedor
        </button>
      </div>

      <div className="admin-toolbar">
        <input type="text" placeholder="Buscar proveedor o rubro..." value={search}
          onChange={(e) => setSearch(e.target.value)} className="admin-search" />
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}><i className="fa-solid fa-xmark" /></button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Razón social *</label>
                  <input type="text" value={form.name} maxLength={120} required
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>RUC</label>
                  <input type="text" value={form.ruc} maxLength={11}
                    onChange={(e) => setForm({ ...form, ruc: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Rubro / categoría</label>
                  <input type="text" value={form.category} maxLength={80} placeholder="Ej. Lana de alpaca"
                    onChange={(e) => setForm({ ...form, category: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Plazo de entrega (días)</label>
                  <input type="number" min="0" max="365" value={form.leadTimeDays}
                    onChange={(e) => setForm({ ...form, leadTimeDays: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Contacto</label>
                  <input type="text" value={form.contactName} maxLength={80}
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {ESTADO_PROVEEDOR.map((s) => <option key={s} value={s}>{cap(s)}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={form.email} maxLength={120}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input type="tel" value={form.phone} maxLength={20}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancelar</button>
                <button className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Razón social</th><th>Rubro</th><th>Contacto</th><th>Plazo</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category || '—'}</td>
                <td>{p.contactName || '—'}</td>
                <td>{p.leadTimeDays ? `${p.leadTimeDays} d` : '—'}</td>
                <td><span className={`badge ${p.status === 'activo' ? 'badge-success' : 'badge-warning'}`}>{cap(p.status)}</span></td>
                <td className="actions-cell">
                  <button className="btn-icon" onClick={() => openEdit(p)} title="Editar"><i className="fa-solid fa-pen" /></button>
                  <button className="btn-icon btn-danger" onClick={() => handleDelete(p.id, p.name)} title="Eliminar"><i className="fa-solid fa-trash" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="empty-msg">No hay proveedores registrados</p>}
      </div>
    </div>
  );
}
