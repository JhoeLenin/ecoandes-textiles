import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useCatalog } from './CatalogContext';

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
  const { getProduct } = useCatalog();

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const showToast = useCallback((msg) => toast(msg), []);

  const addToCart = useCallback((id, qty = 1) => {
    const product = getProduct(id);
    if (!product) return;
    setCart((prev) => {
      const item = prev.find((i) => i.id === id);
      const current = item ? item.qty : 0;
      const newQty = Math.min(current + qty, product.stock);
      if (newQty === current) {
        toast.error(`Stock máximo alcanzado (${product.stock} unidades)`);
        return prev;
      }
      toast.success(`${product.name} agregado al carrito`);
      return item
        ? prev.map((i) => (i.id === id ? { ...i, qty: newQty } : i))
        : [...prev, { id, qty: newQty }];
    });
  }, [getProduct]);

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
  }, [getProduct]);

  const clearCart = useCallback(() => setCart([]), []);

  const count = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => {
    const p = getProduct(i.id);
    return p ? s + p.priceOffer * i.qty : s;
  }, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, setQty, clearCart, count, subtotal, showToast }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
