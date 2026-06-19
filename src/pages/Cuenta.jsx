import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Cuenta() {
  const [tab, setTab] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const { login, register, user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [user, isAdmin, navigate]);

  if (user && !isAdmin) {
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: 480, textAlign: 'center' }}>
          <i className="fa-solid fa-circle-user" style={{ fontSize: '3rem', color: 'var(--terracotta)', marginBottom: '0.75rem' }} />
          <h1 style={{ marginBottom: '0.25rem' }}>Hola, {user.displayName || user.email}</h1>
          <p style={{ color: 'var(--ink-soft)', marginBottom: '1.5rem' }}>{user.email}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/mis-pedidos" className="btn btn-primary btn-block">
              <i className="fa-solid fa-box" /> Mis Pedidos
            </Link>
            <Link to="/favoritos" className="btn btn-outline btn-block">
              <i className="fa-solid fa-heart" /> Mis Favoritos
            </Link>
            <Link to="/perfil" className="btn btn-outline btn-block">
              <i className="fa-solid fa-gear" /> Mi Perfil
            </Link>
            <button
              className="btn btn-outline btn-block"
              onClick={async () => { await logout(); toast.success('Sesión cerrada'); }}
            >
              <i className="fa-solid fa-right-from-bracket" /> Cerrar Sesión
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (user && isAdmin) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Bienvenido de vuelta');
      navigate('/', { replace: true });
    } catch {
      toast.error('Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Cuenta creada correctamente');
      navigate('/', { replace: true });
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        toast.error('Este correo ya está registrado');
      } else {
        toast.error('Error al crear la cuenta');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img src="/img/logo.png" alt="EcoAndes" className="login-logo" />
        <h1>{tab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}</h1>
        <p>{tab === 'login' ? 'Accede a tu cuenta para comprar' : 'Regístrate para empezar a comprar'}</p>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); resetForm(); }}
          >
            Iniciar Sesión
          </button>
          <button
            className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); resetForm(); }}
          >
            Crear Cuenta
          </button>
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@correo.com"
              />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <div className="password-field">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={tab === 'register' ? 'Mínimo 6 caracteres' : '••••••••'}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPwd(!showPwd)}
                  aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  <i className={`fa-solid ${showPwd ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
            </div>
            <button className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Nombre completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Juan Pérez"
              />
            </div>
            <div className="form-group">
              <label>Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@correo.com"
              />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <button className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
