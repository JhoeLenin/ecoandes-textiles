import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="page-404">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <p className="not-found-text">Oops, esta página no existe o fue movida.</p>
        <div className="not-found-links">
          <Link to="/" className="btn btn-primary">
            <i className="fa-solid fa-house" /> Inicio
          </Link>
          <Link to="/tienda" className="btn btn-outline">
            <i className="fa-solid fa-store" /> Tienda
          </Link>
          <Link to="/contacto" className="btn btn-outline">
            <i className="fa-solid fa-envelope" /> Contacto
          </Link>
        </div>
      </div>
    </section>
  );
}
