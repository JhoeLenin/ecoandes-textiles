import { useState, useMemo } from 'react';
import { useClientes } from '../../hooks/useClientes';
import { TIPOS_CLIENTE, SECTORES, TIENDAS, ESTADO_CLIENTE } from '../../data/crm';
import toast from 'react-hot-toast';

const EMPTY = {
  name: '',
  type: 'prospecto',
  sector: 'comercial',
  tienda: 'Cayma',
  contactName: '',
  email: '',
  phone: '',
  status: 'activo',
};

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function Clientes() {
  const { clientes, loading, addCliente, updateCliente, deleteCliente } = useClientes();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [filterSector, setFilterSector] = useState('');
  const [filterTienda, setFilterTienda] = useState('');

  const filtered = useMemo(
    () =>
      clientes.filter(
        (c) =>
          (!filterSector || c.sector === filterSector) &&
          (!filterTienda || c.tienda === filterTienda)
      ),
    [clientes, filterSector, filterTienda]
  );

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  };

  const openEdit = (c) => {
    setEditing(c.id);
    setForm({ ...EMPTY, ...c });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        name: form.name,
        type: form.type,
        sector: form.sector,
        tienda: form.tienda,
        contactName: form.contactName,
        email: form.email,
        phone: form.phone,
        status: form.status,
      };
      if (editing) {
        await updateCliente(editing, data);
        toast.success('Cliente actualizado');
      } else {
        await addCliente(data);
        toast.success('Cliente creado');
      }
      setShowForm(false);
    } catch (err) {
      toast.error('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`¿Eliminar cliente "${name}"?`)) return;
    try {
      await deleteCliente(id);
      toast.success('Cliente eliminado');
    } catch (err) {
      toast.error('Error al eliminar');
    }
  };

  if (loading) return <div className="admin-loading">Cargando clientes...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Clientes</h1>
        <button className="btn btn-primary" onClick={openNew}>
          <i className="fa-solid fa-plus" /> Nuevo Cliente
        </button>
      </div>

      <div className="admin-filters">
        <select
          className="status-select"
          value={filterSector}
          onChange={(e) => setFilterSector(e.target.value)}
        >
          <option value="">Todos los sectores</option>
          {SECTORES.map((s) => (
            <option key={s} value={s}>{cap(s)}</option>
          ))}
        </select>
        <select
          className="status-select"
          value={filterTienda}
          onChange={(e) => setFilterTienda(e.target.value)}
        >
          <option value="">Todas las tiendas</option>
          {TIENDAS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <span className="filter-count">{filtered.length} de {clientes.length}</span>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Nombre / Razón social *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  required
                  maxLength={100}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo *</label>
                  <select value={form.type} onChange={(e) => setField('type', e.target.value)}>
                    {TIPOS_CLIENTE.map((t) => (
                      <option key={t} value={t}>{cap(t)}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select value={form.status} onChange={(e) => setField('status', e.target.value)}>
                    {ESTADO_CLIENTE.map((s) => (
                      <option key={s} value={s}>{cap(s)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Sector *</label>
                  <select value={form.sector} onChange={(e) => setField('sector', e.target.value)}>
                    {SECTORES.map((s) => (
                      <option key={s} value={s}>{cap(s)}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Tienda *</label>
                  <select value={form.tienda} onChange={(e) => setField('tienda', e.target.value)}>
                    {TIENDAS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Persona de contacto</label>
                <input
                  type="text"
                  value={form.contactName}
                  onChange={(e) => setField('contactName', e.target.value)}
                  maxLength={80}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                    maxLength={120}
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setField('phone', e.target.value.replace(/[^\d+]/g, ''))}
                    maxLength={15}
                    inputMode="tel"
                  />
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
              <th>Tipo</th>
              <th>Sector</th>
              <th>Tienda</th>
              <th>Contacto</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{cap(c.type || '')}</td>
                <td>{cap(c.sector || '')}</td>
                <td>{c.tienda}</td>
                <td>
                  {c.contactName || '—'}
                  {c.email && <div className="cell-sub">{c.email}</div>}
                  {c.phone && <div className="cell-sub">{c.phone}</div>}
                </td>
                <td>
                  <span className={`badge ${c.status === 'activo' ? 'badge-success' : 'badge-default'}`}>
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
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="7" className="empty-row">Sin clientes</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
