import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCatalog, productImg, discountPct, formatPrice } from '../context/CatalogContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../hooks/useFavorites';
import { useAuthGate } from '../hooks/useAuthGate';

// Rating sintético estable por producto (hasta tener reseñas reales)
function ratingFor(id) {
  const n = parseInt(id.replace(/\D/g, ''), 10);
  const rating = 4 + ((n * 7) % 10) / 10; // 4.0 – 4.9
  const reviews = 12 + ((n * 13) % 48);
  return { rating: Math.min(rating, 4.9), reviews };
}

export function Stars({ rating }) {
  return (
    <span className="stars" aria-label={`${rating.toFixed(1)} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <i
          key={i}
          className={`fa-solid ${i <= Math.round(rating) ? 'fa-star' : 'fa-star empty'}`}
        />
      ))}
    </span>
  );
}

export default function ProductCard({ product: p }) {
  const { addToCart } = useCart();
  const { getCategory, getVendedor } = useCatalog();
  const { isFavorite, toggleFavorite } = useFavorites();
  const gate = useAuthGate();
  const { rating, reviews } = ratingFor(p.id);
  const lowStock = p.stock > 0 && p.stock < 10;
  const liked = isFavorite(p.id);
  const [justAdded, setJustAdded] = useState(false);
  const cat = getCategory(p.category);
  const vend = p.sellerId ? getVendedor(p.sellerId) : null;

  const handleAdd = () => {
    gate(() => {
      addToCart(p.id, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    });
  };

  return (
    <article className="product-card">
      <Link to={`/producto/${p.id}`} className="card-img-link">
        {discountPct(p) > 0 && <span className="badge-discount">-{discountPct(p)}%</span>}
        {lowStock && <span className="badge-stock">¡Pocas unidades!</span>}
        <img className="img-front" src={productImg(p, 1)} alt={p.name} loading="lazy" />
        <img
          className="img-back"
          src={productImg(p, 2)}
          alt=""
          loading="lazy"
          aria-hidden="true"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </Link>

      <button
        className={`wishlist-btn ${liked ? 'liked' : ''}`}
        aria-label={liked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        onClick={() => gate(() => toggleFavorite(p.id))}
      >
        <i className={`${liked ? 'fa-solid' : 'fa-regular'} fa-heart`} />
      </button>

      <div className="card-body">
        <div className="card-meta">
          <span className="card-category">{cat?.name || 'Sin categoría'}</span>
          {vend && (
            <Link to={`/tienda/vendedor/${p.sellerId}`} className="card-seller" title={`Tienda: ${vend.storeName}`}>
              <i className="fa-solid fa-store" /> {vend.storeName}
            </Link>
          )}
        </div>
        <h3>
          <Link to={`/producto/${p.id}`}>{p.name}</Link>
        </h3>
        <div className="card-rating">
          <Stars rating={rating} />
          <span className="rating-count">({reviews})</span>
        </div>
        <div className="card-prices">
          <span className="price-offer">{formatPrice(p.priceOffer)}</span>
          <span className="price-list">{formatPrice(p.priceList)}</span>
        </div>
        <button
          className="btn btn-primary btn-add"
          onClick={handleAdd}
          disabled={justAdded || p.stock <= 0}
        >
          <i className={`fa-solid ${justAdded ? 'fa-check' : p.stock > 0 ? 'fa-cart-plus' : 'fa-ban'}`} />
          {justAdded ? 'Agregado' : p.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
        </button>
      </div>
    </article>
  );
}
