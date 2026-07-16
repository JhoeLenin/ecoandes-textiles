import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useCatalog } from '../context/CatalogContext';
import { useVendedor } from '../hooks/useVendedores';

export default function Shop() {
  const { products: PRODUCTS, categories: CATEGORIES, loading } = useCatalog();
  const [params, setParams] = useSearchParams();
  const category = params.get('cat') || '';
  const vendedorId = params.get('vendedor') || '';
  const { vendedor } = useVendedor(vendedorId);
  const [sort, setSort] = useState('default');
  const [search, setSearch] = useState('');
  const [genero, setGenero] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const list = useMemo(() => {
    let l = [...PRODUCTS];
    if (vendedorId) l = l.filter((p) => p.sellerId === vendedorId);
    if (category) l = l.filter((p) => p.category === category);
    if (genero) {
      // Mujer/Varón incluyen también productos unisex.
      l = l.filter((p) => p.gender === genero || p.gender === 'unisex');
    }
    if (search) {
      const q = search.toLowerCase();
      l = l.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          CATEGORIES.find((c) => c.id === p.category)?.name.toLowerCase().includes(q)
      );
    }
    if (sort === 'price-asc') l.sort((a, b) => a.priceOffer - b.priceOffer);
    if (sort === 'price-desc') l.sort((a, b) => b.priceOffer - a.priceOffer);
    if (sort === 'name-asc') l.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    return l;
  }, [category, sort, search, genero, vendedorId]);

  const clearVendedor = () => {
    const next = new URLSearchParams(params);
    next.delete('vendedor');
    setParams(next);
  };

  const setCategory = (id) => {
    if (id) setParams({ cat: id });
    else setParams({});
  };

  const clearFilters = () => {
    setParams({});
    setSort('default');
    setSearch('');
    setGenero('');
  };

  const GENEROS_TIENDA = [
    { value: '', label: 'Todos' },
    { value: 'mujer', label: 'Mujeres' },
    { value: 'varon', label: 'Varones' },
  ];

  if (loading) return <div className="admin-loading">Cargando productos...</div>;

  return (
    <>
      <section className="page-hero">
        <span className="section-eyebrow">Catálogo completo</span>
        <h1>Nuestra Tienda</h1>
        <p>Textiles artesanales arequipeños hechos a mano</p>
      </section>

      <section className="section">
        <div className="container shop-layout">
          <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
            <i className={`fa-solid ${showFilters ? 'fa-xmark' : 'fa-filter'}`} />
            {showFilters ? 'Ocultar Filtros' : 'Filtros'}
          </button>
          <aside className={`shop-sidebar ${showFilters ? 'open' : ''}`}>
            <h3>Sección</h3>
            {GENEROS_TIENDA.map((g) => (
              <label key={g.value} className="filter-option">
                <input
                  type="radio"
                  name="genero"
                  checked={genero === g.value}
                  onChange={() => setGenero(g.value)}
                />{' '}
                {g.label}
              </label>
            ))}
            <h3>Categorías</h3>
            {CATEGORIES.map((c) => (
              <label key={c.id} className="filter-option">
                <input
                  type="radio"
                  name="category"
                  checked={category === c.id}
                  onChange={() => setCategory(c.id)}
                />{' '}
                {c.name}
              </label>
            ))}
            <button className="btn btn-outline btn-block" onClick={clearFilters}>
              Limpiar filtros
            </button>
          </aside>

          <div>
            {(category || search || genero || vendedorId) && (
              <div className="active-filters">
                {vendedorId && (
                  <button className="filter-chip" onClick={clearVendedor}>
                    <i className="fa-solid fa-store" /> {vendedor?.storeName || 'Tienda'} <i className="fa-solid fa-xmark" />
                  </button>
                )}
                {genero && (
                  <button className="filter-chip" onClick={() => setGenero('')}>
                    {GENEROS_TIENDA.find((g) => g.value === genero)?.label} <i className="fa-solid fa-xmark" />
                  </button>
                )}
                {category && (
                  <button className="filter-chip" onClick={() => setCategory('')}>
                    {CATEGORIES.find((c) => c.id === category)?.name} <i className="fa-solid fa-xmark" />
                  </button>
                )}
                {search && (
                  <button className="filter-chip" onClick={() => setSearch('')}>
                    "{search}" <i className="fa-solid fa-xmark" />
                  </button>
                )}
              </div>
            )}
            <div className="shop-toolbar">
              <input
                type="search"
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="default">Ordenar por</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="name-asc">Nombre: A-Z</option>
              </select>
              <span className="shop-count">
                {list.length} producto{list.length !== 1 ? 's' : ''}
              </span>
            </div>

            {list.length ? (
              <div className="products-grid">
                {list.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '3rem 0' }}>
                <i className="fa-solid fa-magnifying-glass" />
                <h2>No se encontraron productos</h2>
                <p>Prueba con otros filtros o términos de búsqueda.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
