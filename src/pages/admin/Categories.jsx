import { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import toast from 'react-hot-toast';

export default function Categories() {
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const openNew = () => {
    setEditing(null);
    setName('');
    setImageFile(null);
    setShowForm(true);
  };

  const openEdit = (c) => {
    setEditing(c.id);
    setName(c.name);
    setImageFile(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateCategory(editing, { name }, imageFile);
        toast.success('Categoría actualizada');
      } else {
        await addCategory({ name }, imageFile);
        toast.success('Categoría creada');
      }
      setShowForm(false);
    } catch (err) {
      toast.error('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, catName) => {
    if (!confirm(`¿Eliminar "${catName}"?`)) return;
    try {
      await deleteCategory(id);
      toast.success('Categoría eliminada');
    } catch (err) {
      toast.error('Error al eliminar');
    }
  };

  if (loading) return <div className="admin-loading">Cargando categorías...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Categorías</h1>
        <button className="btn btn-primary" onClick={openNew}>
          <i className="fa-solid fa-plus" /> Nueva Categoría
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
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

      <div className="categories-grid-admin">
        {categories.map((c) => (
          <div key={c.id} className="category-admin-card">
            <img src={c.image || '/img/placeholder.jpg'} alt={c.name} />
            <div className="category-admin-info">
              <h3>{c.name}</h3>
              <div className="category-admin-actions">
                <button className="btn-icon" onClick={() => openEdit(c)}>
                  <i className="fa-solid fa-pen" />
                </button>
                <button className="btn-icon btn-danger" onClick={() => handleDelete(c.id, c.name)}>
                  <i className="fa-solid fa-trash" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {categories.length === 0 && <p className="empty-msg">Sin categorías</p>}
      </div>
    </div>
  );
}
