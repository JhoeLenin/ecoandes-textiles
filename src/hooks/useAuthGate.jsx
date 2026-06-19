import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Devuelve una función gate(action): si hay sesión ejecuta action,
// si no, muestra un aviso con enlace a /cuenta y no ejecuta nada.
export function useAuthGate() {
  const { user } = useAuth();

  return (action) => {
    if (user) {
      action();
      return true;
    }
    toast((t) => (
      <span className="toast-auth">
        Inicia sesión para continuar{' '}
        <Link to="/cuenta" className="toast-link" onClick={() => toast.dismiss(t.id)}>
          Entrar
        </Link>
      </span>
    ));
    return false;
  };
}
