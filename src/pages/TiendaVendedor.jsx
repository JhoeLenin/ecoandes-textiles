import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeleton';
import { useVendedor } from '../hooks/useVendedores';
import { useCatalog } from '../context/CatalogContext';

// Página pública de la tienda de un vendedor: /tienda/vendedor/:id
export default function TiendaVendedor() {
  const { id } = useParams();
  const { vendedor, loading: loadingVend } = useVendedor(id);
  const { products, loading: loadingProd } = useCatalog();

  if (loadingVend || loadingProd) {
    return (
      <section className="section">
        <div className="container">
          <ProductGridSkeleton count={4} />
        </div>
      </section>
    );
  }

  if (!vendedor) {
    return (
      <section className="section">
        <div className="container empty-state">
          <i className="fa-solid fa-store-slash" />
          <h2>Tienda no encontrada</h2>
          <Link to="/tienda" className="btn btn-primary">Ir a la Tienda</Link>
        </div>
      </section>
    );
  }

  const mine = products.filter((p) => p.sellerId === id);

  return (
    <>
      <section className="section">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Ruta de navegación">
            <Link to="/">Inicio</Link>
            <i className="fa-solid fa-chevron-right" />
            <Link to="/tienda">Tienda</Link>
            <i className="fa-solid fa-chevron-right" />
            <span>{vendedor.storeName}</span>
          </nav>

          <div className="seller-store-head" style={{ marginTop: '1rem' }}>
            {vendedor.logo
              ? <img src={vendedor.logo} alt={vendedor.storeName} className="seller-logo" />
              : <div className="seller-logo seller-logo-empty"><i className="fa-solid fa-store" /></div>}
            <div>
              <span className="section-eyebrow">Tienda del marketplace</span>
              <h1 className="section-title left" style={{ margin: 0 }}>{vendedor.storeName}</h1>
              {vendedor.description && <p style={{ color: 'var(--ink-soft)' }}>{vendedor.description}</p>}
              {vendedor.phone && (
                <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem' }}>
                  <i className="fa-solid fa-phone" /> {vendedor.phone}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">Productos de {vendedor.storeName}</h2>
          {mine.length ? (
            <div className="products-grid">
              {mine.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '3rem 0' }}>
              <i className="fa-solid fa-box-open" />
              <h2>Esta tienda aún no publica productos</h2>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
