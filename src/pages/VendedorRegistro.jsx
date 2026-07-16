import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { uploadToCloudinary } from '../lib/cloudinary';
import toast from 'react-hot-toast';

export default function VendedorRegistro() {
  const { user, isSeller, isAdmin, becomeSeller } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ storeName: '', description: '', phone: '' });
  const [logoFile, setLogoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  // No logueado: invitar a iniciar sesión.
  if (!user) {
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: 480, textAlign: 'center' }}>
          <i className="fa-solid fa-store" style={{ fontSize: '3rem', color: 'var(--terracotta)', marginBottom: '0.75rem' }} />
          <h1>Vende en EcoAndes</h1>
          <p style={{ color: 'var(--ink-soft)', margin: '0.5rem 0 1.5rem' }}>
            Inicia sesión o crea una cuenta para abrir tu tienda.
          </p>
          <Link to="/cuenta" className="btn btn-primary btn-block">Iniciar sesión / Registrarse</Link>
        </div>
      </section>
    );
  }

  // Ya es vendedor o admin: no repetir registro.
  if (isSeller) {
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: 480, textAlign: 'center' }}>
          <i className="fa-solid fa-circle-check" style={{ fontSize: '3rem', color: 'var(--forest)', marginBottom: '0.75rem' }} />
          <h1>Ya tienes una tienda</h1>
          <Link to="/vendedor" className="btn btn-primary btn-block" style={{ marginTop: '1rem' }}>
            Ir a mi panel de vendedor
          </Link>
        </div>
      </section>
    );
  }
  if (isAdmin) {
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: 480, textAlign: 'center' }}>
          <p>El administrador no puede registrarse como vendedor.</p>
        </div>
      </section>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.storeName.trim()) { toast.error('Ingresa el nombre de tu tienda'); return; }
    setSaving(true);
    try {
      let logo = '';
      if (logoFile) logo = await uploadToCloudinary(logoFile, 'vendedores');
      await becomeSeller({ ...form, logo });
      toast.success('¡Bienvenido! Tu tienda está activa');
      navigate('/vendedor', { replace: true });
    } catch (err) {
      toast.error(err.message || 'No se pudo registrar la tienda');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 560 }}>
        <span className="section-eyebrow">Marketplace</span>
        <h1 className="section-title left">Abre tu tienda en EcoAndes</h1>
        <p style={{ color: 'var(--ink-soft)', marginBottom: '1.5rem' }}>
          Publica tus productos artesanales y llega a más clientes. El registro es inmediato.
        </p>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Nombre de la tienda *</label>
            <input
              type="text"
              value={form.storeName}
              onChange={(e) => setForm({ ...form, storeName: e.target.value })}
              required
              maxLength={80}
              placeholder="Ej. Tejidos Doña Rosa"
            />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              maxLength={500}
              placeholder="Cuenta qué vendes y qué te hace único..."
            />
          </div>
          <div className="form-group">
            <label>Teléfono / WhatsApp</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              maxLength={20}
              placeholder="+51 999 999 999"
            />
          </div>
          <div className="form-group">
            <label>Logo de la tienda</label>
            <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} />
          </div>
          <button className="btn btn-primary btn-block" disabled={saving}>
            {saving ? 'Creando tienda...' : 'Crear mi tienda'}
          </button>
        </form>
      </div>
    </section>
  );
}
