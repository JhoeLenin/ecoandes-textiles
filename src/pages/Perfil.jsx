import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile, updatePassword } from 'firebase/auth';
import toast from 'react-hot-toast';

export default function Perfil() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.displayName || '');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user || isAdmin) {
    navigate('/', { replace: true });
    return null;
  }

  const handleName = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('El nombre no puede estar vacío');
      return;
    }
    setLoading(true);
    try {
      await updateProfile(user, { displayName: name.trim() });
      toast.success('Nombre actualizado');
    } catch {
      toast.error('Error al actualizar nombre');
    } finally {
      setLoading(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      await updatePassword(user, newPassword);
      toast.success('Contraseña actualizada');
      setNewPassword('');
    } catch {
      toast.error('Error al actualizar contraseña. Intenta iniciar sesión de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 480 }}>
        <h1 style={{ marginBottom: '1.5rem' }}>Mi Perfil</h1>

        <div className="profile-section">
          <h3>Nombre</h3>
          <form onSubmit={handleName} className="profile-form">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="profile-input"
            />
            <button className="btn btn-primary" disabled={loading}>
              Guardar
            </button>
          </form>
        </div>

        <div className="profile-section">
          <h3>Email</h3>
          <p className="profile-email">{user.email}</p>
        </div>

        <div className="profile-section">
          <h3>Cambiar Contraseña</h3>
          <form onSubmit={handlePassword} className="profile-form">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nueva contraseña (mín. 6 caracteres)"
              className="profile-input"
            />
            <button className="btn btn-primary" disabled={loading}>
              Actualizar
            </button>
          </form>
        </div>

        <button
          className="btn btn-outline btn-block"
          style={{ marginTop: '1rem' }}
          onClick={() => navigate('/cuenta')}
        >
          Volver
        </button>
      </div>
    </section>
  );
}
