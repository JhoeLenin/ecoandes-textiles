import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="page-404">
      <h1>404</h1>
      <p>Oops, esta página no existe.</p>
      <Link to="/" className="btn btn-primary">Volver al Inicio</Link>
    </section>
  );
}
