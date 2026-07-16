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

// Detalle de producto fantasma (galería + info).
export function ProductDetailSkeleton() {
  return (
    <section className="section" aria-busy="true" aria-label="Cargando producto">
      <div className="container product-detail">
        <div className="product-gallery">
          <div className="skeleton skeleton-detail-main" />
          <div className="gallery-thumbs">
            <div className="skeleton skeleton-detail-thumb" />
            <div className="skeleton skeleton-detail-thumb" />
          </div>
        </div>
        <div className="skeleton-body" style={{ padding: 0 }}>
          <div className="skeleton skeleton-line sm" />
          <div className="skeleton skeleton-line lg" />
          <div className="skeleton skeleton-line md" />
          <div className="skeleton skeleton-line price" />
          <div className="skeleton skeleton-line md" />
          <div className="skeleton skeleton-line md" />
          <div className="skeleton skeleton-btn" style={{ maxWidth: 260 }} />
        </div>
      </div>
    </section>
  );
}
