import { Link } from 'react-router-dom';
import { getProduct, productImg, formatPrice, shippingCost } from '../data/products';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, setQty, removeFromCart, subtotal } = useCart();
  const shipping = shippingCost(subtotal);
  const free = shipping === 0 && subtotal > 0;

  if (cart.length === 0) {
    return (
      <section className="section">
        <div className="container empty-state">
          <i className="fa-solid fa-basket-shopping" />
          <h2>Tu carrito está vacío</h2>
          <p>Descubre nuestros textiles artesanales arequipeños.</p>
          <Link to="/tienda" className="btn btn-primary">Ir a la Tienda</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-hero">
        <h1>Tu Carrito</h1>
      </section>

      <section className="section">
        <div className="container cart-layout">
          <div className="cart-items">
            {cart.map((i) => {
              const p = getProduct(i.id);
              if (!p) return null;
              return (
                <div className="cart-row" key={i.id}>
                  <Link to={`/producto/${p.id}`}>
                    <img src={productImg(p.id, 1)} alt={p.name} />
                  </Link>
                  <div className="cart-row-info">
                    <Link to={`/producto/${p.id}`}><strong>{p.name}</strong></Link>
                    <span className="cart-row-unit">{formatPrice(p.priceOffer)} c/u</span>
                  </div>
                  <div className="qty-selector">
                    <button className="qty-btn" onClick={() => setQty(i.id, i.qty - 1)} aria-label="Disminuir">−</button>
                    <span className="qty-value">{i.qty}</span>
                    <button className="qty-btn" onClick={() => setQty(i.id, i.qty + 1)} aria-label="Aumentar">+</button>
                  </div>
                  <span className="cart-row-subtotal">{formatPrice(p.priceOffer * i.qty)}</span>
                  <button className="cart-row-remove" onClick={() => removeFromCart(i.id)} aria-label="Eliminar">
                    <i className="fa-solid fa-xmark" />
                  </button>
                </div>
              );
            })}
          </div>

          <aside className="cart-summary">
            <h3>Resumen</h3>
            {free && (
              <div className="free-shipping-notice">
                <i className="fa-solid fa-truck-fast" /> ¡Envío GRATIS aplicado!
              </div>
            )}
            <div className="summary-line"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="summary-line">
              <span>Envío estimado</span>
              <span className={free ? 'free-tag' : ''}>{free ? 'GRATIS' : formatPrice(shipping)}</span>
            </div>
            {!free && (
              <p className="summary-note">
                Estimado para Lima — se calcula según departamento en el checkout.
              </p>
            )}
            <div className="summary-line summary-total">
              <span>TOTAL</span><span>{formatPrice(subtotal + shipping)}</span>
            </div>
            <Link to="/checkout" className="btn btn-primary btn-block">Continuar al Checkout</Link>
          </aside>
        </div>
      </section>
    </>
  );
}
