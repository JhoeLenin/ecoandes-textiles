import { createContext, useContext, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useVendedores } from '../hooks/useVendedores';

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const { products, loading: loadingProducts } = useProducts();
  const { categories, loading: loadingCategories } = useCategories();
  const { vendedores } = useVendedores();

  const loading = loadingProducts || loadingCategories;

  const getProduct = useMemo(() => {
    const map = new Map(products.map((p) => [p.id, p]));
    return (id) => map.get(id) || null;
  }, [products]);

  const getCategory = useMemo(() => {
    const map = new Map(categories.map((c) => [c.id, c]));
    return (id) => map.get(id) || null;
  }, [categories]);

  const getVendedor = useMemo(() => {
    const map = new Map(vendedores.map((v) => [v.id, v]));
    return (id) => map.get(id) || null;
  }, [vendedores]);

  const value = useMemo(() => ({
    products,
    categories,
    vendedores,
    loading,
    getProduct,
    getCategory,
    getVendedor,
  }), [products, categories, vendedores, loading, getProduct, getCategory, getVendedor]);

  return (
    <CatalogContext.Provider value={value}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog debe usarse dentro de CatalogProvider');
  return ctx;
}

export function productImg(product, n = 1) {
  if (product?.images?.[n - 1]) return product.images[n - 1];
  if (product?.images?.[0]) return product.images[0];
  const id = product?.id || 'fallback';
  return `/img/${id}_foto${n}.jpg`;
}

export function discountPct(p) {
  if (!p || !p.priceList) return 0;
  return Math.round((1 - p.priceOffer / p.priceList) * 100);
}

export function formatPrice(n) {
  return `S/ ${(n || 0).toFixed(2)}`;
}

export function shippingCost(subtotal, departamento = null) {
  if (subtotal === 0) return 0;
  if (subtotal > 150) return 0;
  if (departamento === null) return 12;
  return departamento === 'Lima' ? 12 : 18;
}
