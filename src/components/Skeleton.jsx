// Placeholders de carga (mejoran la percepción de velocidad).

export function ProductCardSkeleton() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-img" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-line sm" />
        <div className="skeleton skeleton-line lg" />
        <div className="skeleton skeleton-line md" />
        <div className="skeleton skeleton-line price" />
        <div className="skeleton skeleton-btn" />
      </div>
    </div>
  );
}

// Rejilla de tarjetas fantasma.
export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="products-grid" aria-busy="true" aria-label="Cargando productos">
      {Array.from({ length: count }).map((_, i) => <ProductCardSkeleton key={i} />)}
    </div>
  );
}
