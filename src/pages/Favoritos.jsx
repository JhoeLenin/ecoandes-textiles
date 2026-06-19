import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import { getProduct } from '../data/products';

export default function Favoritos() {
  const { favorites } = useFavorites();

  const products = favorites.map((id) => getProduct(id)).filter(Boolean);

  return (
    <>
      <section className="page-hero">
        <h1>Mis Favoritos</h1>
      </section>

      <section className="section">
        <div className="container">
          {products.length === 0 ? (
            <div className="empty-state">
              <i className="fa-regular fa-heart" />
              <h2>Aún no tienes favoritos</h2>
              <p>Explora nuestra tienda y guarda los productos que más te gusten.</p>
              <Link to="/tienda" className="btn btn-primary">Ir a la Tienda</Link>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
