import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategory, productImg, discountPct, formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';

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
  const [liked, setLiked] = useState(false);
  const { rating, reviews } = ratingFor(p.id);
  const lowStock = p.stock <= 10;

  return (
    <article className="product-card">
      <Link to={`/producto/${p.id}`} className="card-img-link">
        <span className="badge-discount">-{discountPct(p)}%</span>
        {lowStock && <span className="badge-stock">¡Pocas unidades!</span>}
        <img className="img-front" src={productImg(p.id, 1)} alt={p.name} loading="lazy" />
        <img className="img-back" src={productImg(p.id, 2)} alt="" loading="lazy" aria-hidden="true" />
      </Link>

      <button
        className={`wishlist-btn ${liked ? 'liked' : ''}`}
        aria-label={liked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        onClick={() => setLiked(!liked)}
      >
        <i className={`${liked ? 'fa-solid' : 'fa-regular'} fa-heart`} />
      </button>

      <div className="card-body">
        <span className="card-category">{getCategory(p.category).name}</span>
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
        <button className="btn btn-primary btn-add" onClick={() => addToCart(p.id, 1)}>
          <i className="fa-solid fa-cart-plus" /> Agregar al carrito
        </button>
      </div>
    </article>
  );
}
