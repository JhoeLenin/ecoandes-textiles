import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { CATEGORIES, PRODUCTS } from '../data/products';

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const category = params.get('cat') || '';
  const [sort, setSort] = useState('default');
  const [search, setSearch] = useState('');
  const [genero, setGenero] = useState('');

  const list = useMemo(() => {
    let l = [...PRODUCTS];
    if (category) l = l.filter((p) => p.category === category);
    if (genero) {
      // Mujer/Varón incluyen también productos unisex.
      l = l.filter((p) => p.gender === genero || p.gender === 'unisex');
    }
    if (search) {
      const q = search.toLowerCase();
      l = l.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (sort === 'price-asc') l.sort((a, b) => a.priceOffer - b.priceOffer);
    if (sort === 'price-desc') l.sort((a, b) => b.priceOffer - a.priceOffer);
    if (sort === 'name-asc') l.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    return l;
  }, [category, sort, search, genero]);

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

  return (
    <>
      <section className="page-hero">
        <span className="section-eyebrow">Catálogo completo</span>
        <h1>Nuestra Tienda</h1>
        <p>Textiles artesanales arequipeños hechos a mano</p>
      </section>

      <section className="section">
        <div className="container shop-layout">
          <aside className="shop-sidebar">
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
            {(category || search) && (
              <div className="active-filters">
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
              <p className="no-results">No se encontraron productos. Prueba con otros filtros.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
