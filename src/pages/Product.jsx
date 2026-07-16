import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard, { Stars } from '../components/ProductCard';
import { useCatalog, productImg, discountPct, formatPrice } from '../context/CatalogContext';
import { useVendedor } from '../hooks/useVendedores';
import { useCart } from '../context/CartContext';

export default function Product() {
  const { id } = useParams();
  const { getProduct, getCategory, products: PRODUCTS, loading } = useCatalog();
  const product = getProduct(id);
  const { vendedor } = useVendedor(product?.sellerId);
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [mainImg, setMainImg] = useState(1);

  useEffect(() => {
    setQty(1);
    setMainImg(1);
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="admin-loading">Cargando producto...</div>;

  if (!product) {
    return (
      <section className="section">
        <div className="container empty-state">
          <i className="fa-solid fa-circle-question" />
          <h2>Producto no encontrado</h2>
          <p>El producto solicitado no existe en nuestro catálogo.</p>
          <Link to="/tienda" className="btn btn-primary">Ir a la Tienda</Link>
        </div>
      </section>
    );
  }

  const cat = getCategory(product.category);
  const related = PRODUCTS.filter((x) => x.category === product.category && x.id !== id).slice(0, 4);

  return (
    <>
      <section className="section">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Ruta de navegación">
            <Link to="/">Inicio</Link>
            <i className="fa-solid fa-chevron-right" />
            <Link to="/tienda">Tienda</Link>
            <i className="fa-solid fa-chevron-right" />
            <Link to={`/tienda?cat=${cat.id}`}>{cat.name}</Link>
            <i className="fa-solid fa-chevron-right" />
            <span>{product.name}</span>
          </nav>
        </div>
        <div className="container product-detail">
          <div className="product-gallery">
            <div className="gallery-main">
              <img src={productImg(product, mainImg)} alt={product.name} />
            </div>
            <div className="gallery-thumbs">
              {[1, 2].map((n) => (
                <img
                  key={n}
                  src={productImg(product, n)}
                  alt={`${product.name} foto ${n}`}
                  className={mainImg === n ? 'active' : ''}
                  onClick={() => setMainImg(n)}
                />
              ))}
            </div>
          </div>

          <div className="detail-info">
            <span className="card-category">{cat.name}</span>
            <h1>{product.name}</h1>
            <div className="detail-rating">
              <Stars rating={4.6} />
              <span className="rating-count">4.6 — opiniones verificadas</span>
            </div>
            <p className="detail-sku">SKU: {product.id}</p>
            {vendedor && (
              <p className="detail-seller">
                <i className="fa-solid fa-store" /> Vendido por{' '}
                <Link to={`/tienda/vendedor/${product.sellerId}`}>{vendedor.storeName}</Link>
              </p>
            )}
            <p>{product.description}</p>

            <div className="detail-prices">
              <span className="price-offer">{formatPrice(product.priceOffer)}</span>
              <span className="price-list">{formatPrice(product.priceList)}</span>
              <span className="badge-discount static">-{discountPct(product)}%</span>
            </div>

            <p className={`detail-stock ${product.stock <= 10 ? 'low' : ''}`}>
              <i className="fa-solid fa-box" /> {product.stock} unidades disponibles
            </p>

            <table className="specs-table">
              <tbody>
                {Object.entries(product.specs).map(([k, v]) => (
                  <tr key={k}>
                    <td>{k}</td>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="detail-actions">
              <div className="qty-selector">
                <button
                  className="qty-btn"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  disabled={qty <= 1}
                  aria-label="Disminuir"
                >
                  −
                </button>
                <span className="qty-value">{qty}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  disabled={qty >= product.stock}
                  aria-label="Aumentar"
                >
                  +
                </button>
              </div>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => addToCart(id, qty)}
                disabled={product.stock <= 0}
              >
                <i className="fa-solid fa-cart-plus" /> {product.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
              </button>
            </div>

            <div className="trust-badges">
              <span><i className="fa-solid fa-hand-holding-heart" /> Hecho a mano</span>
              <span><i className="fa-solid fa-truck-fast" /> Envío a todo el Perú</span>
              <span><i className="fa-solid fa-rotate-left" /> Devolución 7 días</span>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <h2 className="section-title">Productos Relacionados</h2>
            <div className="products-grid">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
