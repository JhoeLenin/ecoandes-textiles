import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import { getProduct, formatPrice, productImg } from '../data/products';

export default function Favoritos() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

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
                <article className="product-card" key={p.id}>
                  <Link to={`/producto/${p.id}`} className="card-img-wrap">
                    <img src={productImg(p.id, 1)} alt={p.name} loading="lazy" />
                  </Link>
                  <button
                    className={`wishlist-btn liked`}
                    aria-label="Quitar de favoritos"
                    onClick={() => toggleFavorite(p.id)}
                  >
                    <i className="fa-solid fa-heart" />
                  </button>
                  <div className="card-body">
                    <span className="card-category">{p.category}</span>
                    <Link to={`/producto/${p.id}`}>
                      <h3 className="card-title">{p.name}</h3>
                    </Link>
                    <div className="card-prices">
                      <span className="price-offer">{formatPrice(p.priceOffer)}</span>
                      <span className="price-list">{formatPrice(p.priceList)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
