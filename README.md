# EcoAndes Textiles

Tienda online de textiles andinos + panel administrativo con módulo CRM.
Proyecto React + Vite + Firebase. Incluye el prototipo CRM de la práctica 02 de
Negocios Electrónicos (gestión de relaciones con clientes).

## Stack

- **React 18** + **React Router 6**
- **Vite 5** (build/dev)
- **Firebase 12** — Firestore (datos en tiempo real), Auth, Storage
- **react-hot-toast** (notificaciones)

## Requisitos

- Node.js 20.6+ (recomendado 24+, para `--env-file`)
- Cuenta/proyecto de Firebase

## Configuración

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Crear `.env` en la raíz (NO se commitea, está en `.gitignore`):
   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

## Scripts

```bash
npm run dev       # servidor de desarrollo
npm run build     # build de producción
npm run preview   # previsualizar el build
```

Poblar la base de datos con datos de ejemplo (lee credenciales del `.env`):
```bash
node --env-file=.env seed.mjs
```
> El seed solo **agrega** datos, no limpia. No correr sobre producción sin confirmar.

## Estructura

```
src/
  components/      Header, Footer, ProductCard, AdminSidebar, AdminLayout...
  context/         CartContext, AuthContext
  data/            products.js, crm.js (enums CRM compartidos)
  hooks/           useProducts, useCategories, useOffers, useOrders, useUsers,
                   useClientes, useCampanas, useReclamos, useSugerencias
  pages/           Home, Shop, Product, Cart, Checkout, About, Contact...
    admin/         Dashboard, Products, Categories, Offers, Orders, Users,
                   Clientes, Campanas, Reclamos, Sugerencias, ReportesCRM, SeedDb
  firebase.js      inicialización de Firebase (desde import.meta.env)
seed.mjs           script de poblado
docs/              guías de desarrollo por persona
```

## Rutas

**Tienda pública:** `/` `/tienda` `/producto/:id` `/carrito` `/checkout` `/nosotros` `/contacto` `/envios`

**Admin** (`/admin`, requiere login admin):
`/admin` (dashboard), `productos`, `categorias`, `ofertas`, `pedidos`, `usuarios`,
`clientes`, `campanas`, `reclamos`, `sugerencias`, `reportes`, `seed`

## Módulo CRM (práctica 02)

Gestión de relaciones con clientes integrada al panel admin:

| Módulo | Descripción |
|--------|-------------|
| Clientes | Clientes B2B con tipo, sector y tienda |
| Campañas | Campañas de marketing con presupuesto vs resultado |
| Reclamos | Reclamos de clientes y su seguimiento |
| Sugerencias | Sugerencias de clientes por categoría |
| Reportes CRM | Reportes: clientes por sector/tienda, presupuesto vs resultado, análisis de reclamos/sugerencias |

Enums compartidos en `src/data/crm.js`.

## Desarrollo en equipo

Reparto de módulos y reglas en:
- [`docs/DEV-JHOEL.md`](docs/DEV-JHOEL.md)
- [`docs/DEV-COMPANERA.md`](docs/DEV-COMPANERA.md)

## Seguridad

- Credenciales **solo** desde `.env` (`import.meta.env.VITE_*`). Nunca hardcodear.
- Las API keys web de Firebase son públicas por diseño: la seguridad real está en las
  **reglas de Firestore/Storage** y en restringir la API key en Google Cloud Console.
