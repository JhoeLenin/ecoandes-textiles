# EcoAndes — Lista de Mejoras Pendientes

## P0 — Críticos (Seguridad / Bugs)

| # | Mejora | Archivo | Descripción |
|---|--------|---------|-------------|
| 1 | Culqi secret key en frontend | `Checkout.jsx:63` | La `VITE_CULQI_SECRET_KEY` se usa en fetch directo desde el navegador. Cualquiera la ve en DevTools. Mover a Cloud Function o Edge Function. |
| 2 | Doble sistema de toast | `CartContext.jsx`, `Home.jsx:56`, `Contact.jsx:24` | CartContext tiene su propio toast HTML. El resto usa react-hot-toast. Unificar. Además Home y Contact silencian errores de Firestore con `catch {}`. |
| 3 | Memory leak createObjectURL | `admin/Products.jsx:261` | `URL.createObjectURL(f)` sin `URL.revokeObjectURL()`. Usar useMemo o useEffect para limpiar. |

## P1 — Performance (Bundle 824KB JS)

| # | Mejora | Impacto estimado |
|---|--------|-----------------|
| 4 | Code splitting con React.lazy | -60% JS inicial (~805KB → ~250KB). 25+ páginas importadas eagerly. Admin = 60% del bundle. |
| 5 | Font Awesome completo (~80KB) | Solo se usan ~30 iconos. Migrar a import selectivo o tree-shakeable. |
| 6 | Culqi script en index.html | Ya se carga dinámico con `useCulqi.js`. Eliminar línea de index.html. |
| 7 | Dashboard suscrito a 8 colecciones Firestore | 8 WebSocket simultáneos. Cambiar a `getDocs()` one-shot o consolidar hooks. |
| 8 | Búsqueda sin debounce en Shop | Filtra en cada keystroke. Agregar debounce 300ms. |

## P2 — Code Quality

| # | Mejora | Ahorro |
|---|--------|--------|
| 9 | 5 hooks idénticos | `useOffers`, `useCampanas`, `useClientes`, `useReclamos`, `useSugerencias` son copias. Crear `useFirestoreCollection(name)` genérico. -250 líneas. |
| 10 | Checkout lógica duplicada | Creación de orden repetida 2 veces (Culqi y no-Culqi). Extraer función `createOrder()`. |
| 11 | Rating hardcodeado | `Product.jsx:74` tiene `4.6` hardcodeado. Usar `ratingFor(id)` como en ProductCard. |

## P3 — UX/UI

| # | Mejora |
|---|--------|
| 12 | Sin Error Boundaries — si un componente crashea, toda la app muere |
| 13 | Sin skeletons/loading states — solo MisPedidos tiene spinner |
| 14 | Contraentrega sin validación — dice "solo Lima" pero no valida departamento |
| 15 | Sin botón de favoritos en página de detalle del producto |
| 16 | HeroCarousel sin atributos ARIA (accesibilidad) |

## P4 — Features Faltantes

| # | Feature |
|---|---------|
| 17 | Recuperar contraseña (sendPasswordResetEmail) |
| 18 | Tracking de pedidos con timeline (reutilizar Shipping.jsx) |
| 19 | Filtros de precio en tienda (slider o min/max) |
| 20 | Búsqueda global en Header |
| 21 | SEO — react-helmet-async, sitemap.xml, robots.txt |
| 22 | Paginación o infinite scroll en Shop |
| 23 | SeedDb protegido o eliminado en producción |

## Estimación de esfuerzo

| Prioridad | Items | Tiempo aprox |
|-----------|-------|-------------|
| P0 | 3 | 1-2 horas |
| P1 | 5 | 2-3 horas |
| P2 | 3 | 1 hora |
| P3 | 5 | 2-3 horas |
| P4 | 7 | 4-6 horas |
| **Total** | **23** | **~12-15 horas** |
