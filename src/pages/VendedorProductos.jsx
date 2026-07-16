import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { GENERO_PRODUCTO } from '../data/crm';
import { productImg } from '../context/CatalogContext';
import toast from 'react-hot-toast';

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const empty = {
  name: '', category: '', gender: 'unisex', description: '',
  priceList: '', priceOffer: '', stock: '', featured: false,
};

export default function VendedorProductos() {
  const { user } = useAuth();
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [images, setImages] = useState([]);
  const [keptImages, setKeptImages] = useState([]);
  const [saving, setSaving] = useState(false);

  const imagePreviews = useMemo(() => images.map((f) => URL.createObjectURL(f)), [images]);
  useEffect(() => () => imagePreviews.forEach((url) => URL.revokeObjectURL(url)), [imagePreviews]);

  const mine = products.filter((p) => p.sellerId === user?.uid);

  const openNew = () => {
    setEditing(null); setForm(empty); setImages([]); setKeptImages([]); setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing(p.docId);
    setForm({
      name: p.name || '', category: p.category || '', gender: p.gender || 'unisex',
      description: p.description || '', priceList: p.priceList || '',
      priceOffer: p.priceOffer || '', stock: p.stock || '', featured: p.featured || false,
    });
    setImages([]); setKeptImages(p.images || []); setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        priceList: Number(form.priceList),
        priceOffer: Number(form.priceOffer),
        stock: Number(form.stock),
        sellerId: user.uid,
      };
      if (editing) {
        await updateProduct(editing, data, images, keptImages);
        toast.success('Producto actualizado');
      } else {
        await addProduct(data, images);
        toast.success('Producto publicado');
      }
      setShowForm(false);
    } catch (err) {
      toast.error('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (docId, name) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    try { await deleteProduct(docId); toast.success('Producto eliminado'); }
    catch { toast.error('Error al eliminar'); }
  };

  if (loading) return <div className="admin-loading">Cargando productos...</div>;

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Mis productos</h1>
        <button className="btn btn-primary" onClick={openNew}>
          <i className="fa-solid fa-plus" /> Nuevo producto
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Editar producto' : 'Nuevo producto'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}><i className="fa-solid fa-xmark" /></button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input type="text" value={form.name} maxLength={120} required
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Categoría *</label>
                  <select value={form.category} required
                    onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option value="">Seleccionar...</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Género</label>
                <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                  {GENERO_PRODUCTO.map((g) => <option key={g} value={g}>{cap(g)}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea rows={3} value={form.description} maxLength={1000}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Precio lista (S/)</label>
                  <input type="number" min="0" max="99999" step="0.01" value={form.priceList}
                    onChange={(e) => setForm({ ...form, priceList: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Precio oferta (S/)</label>
                  <input type="number" min="0" max="99999" step="0.01" value={form.priceOffer}
                    onChange={(e) => setForm({ ...form, priceOffer: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input type="number" min="0" max="99999" step="1" value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label>Imágenes</label>
                <input type="file" accept="image/*" multiple
                  onChange={(e) => setImages([...images, ...Array.from(e.target.files)])} />
                <div className="image-preview-list">
                  {keptImages.map((url, i) => (
                    <div key={i} className="image-preview-item">
                      <img src={url} alt="" />
                      <button type="button" onClick={() => setKeptImages(keptImages.filter((_, j) => j !== i))}>
                        <i className="fa-solid fa-xmark" />
                      </button>
                    </div>
                  ))}
                  {images.map((f, i) => (
                    <div key={i} className="image-preview-item">
                      <img src={imagePreviews[i]} alt="" />
                      <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))}>
                        <i className="fa-solid fa-xmark" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancelar</button>
                <button className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Publicar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Imagen</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {mine.map((p) => {
              const cat = categories.find((c) => c.id === p.category);
              return (
                <tr key={p.docId}>
                  <td><img src={productImg(p, 1)} alt={p.name} className="table-img"
                    onError={(e) => { e.target.src = '/img/logo.png'; }} /></td>
                  <td>{p.name}</td>
                  <td>{cat?.name || '—'}</td>
                  <td>S/ {(p.priceOffer || 0).toFixed(2)}</td>
                  <td><span className={`badge ${p.stock <= 10 ? 'badge-warning' : 'badge-success'}`}>{p.stock}</span></td>
                  <td className="actions-cell">
                    <button className="btn-icon" onClick={() => openEdit(p)} title="Editar"><i className="fa-solid fa-pen" /></button>
                    <button className="btn-icon btn-danger" onClick={() => handleDelete(p.docId, p.name)} title="Eliminar"><i className="fa-solid fa-trash" /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {mine.length === 0 && <p className="empty-msg">Aún no publicas productos. Crea el primero.</p>}
      </div>
    </div>
  );
}
