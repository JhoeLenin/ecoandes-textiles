import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getProduct } from '../data/products';

const CART_KEY = 'ecoandes_cart';
const CartContext = createContext(null);

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const showToast = useCallback((msg) => {
    setToast(msg);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const addToCart = useCallback((id, qty = 1) => {
    const product = getProduct(id);
    if (!product) return;
    setCart((prev) => {
      const item = prev.find((i) => i.id === id);
      const current = item ? item.qty : 0;
      const newQty = Math.min(current + qty, product.stock);
      if (newQty === current) {
        setToast(`Stock máximo alcanzado (${product.stock} unidades)`);
        return prev;
      }
      setToast(`${product.name} agregado al carrito`);
      return item
        ? prev.map((i) => (i.id === id ? { ...i, qty: newQty } : i))
        : [...prev, { id, qty: newQty }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setQty = useCallback((id, qty) => {
    const product = getProduct(id);
    if (!product) return;
    setCart((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, Math.min(qty, product.stock)) } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const count = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => {
    const p = getProduct(i.id);
    return p ? s + p.priceOffer * i.qty : s;
  }, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, setQty, clearCart, count, subtotal, toast, showToast }}
    >
      {children}
      {toast && <div className="toast show">{toast}</div>}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
