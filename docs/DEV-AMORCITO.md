# Guía de desarrollo — Compañera

Proyecto: EcoAndes (React + Vite + Firebase). Práctica 02 Negocios Electrónicos — prototipo CRM
sobre el panel admin existente.

> **ESTADO: tus 3 módulos COMPLETADOS y mergeados a `master`** (PR #1). Auth + Favoritos de clientes implementados. ✅

---

## Tus módulos

| Módulo | Página | Hook | Colección | Estado |
|--------|--------|------|-----------|--------|
| Reclamos | `src/pages/admin/Reclamos.jsx` | `src/hooks/useReclamos.js` | `reclamos` | ✅ Hecho |
| Sugerencias | `src/pages/admin/Sugerencias.jsx` | `src/hooks/useSugerencias.js` | `sugerencias` | ✅ Hecho |
| Reportes CRM | `src/pages/admin/ReportesCRM.jsx` | (varios) | — | ✅ Hecho (5 reportes) |

Los módulos de Jhoel (Clientes, Campañas, Promociones, Dashboard) también están en `master`.
El CRM funciona de punta a punta.

---

## Especificaciones por módulo

### 1. Reclamos (`Reclamos.jsx`)
Formulario + tabla. Campos:
```js
{ clienteId, clienteName, asunto, detalle, status, respuesta, createdAt }
```
- Selector de cliente: importa `useClientes` (`src/hooks/useClientes.js`) para listar y elegir.
  Al elegir, guarda **ambos**: `clienteId` (id del doc) y `clienteName` (denormalizado, para
  mostrar el nombre sin consultar otra vez).
- `status` → enum `ESTADO_RECLAMO` de `src/data/crm.js` (`abierto`, `en_proceso`, `resuelto`)
- Patrón de referencia: copia la estructura de `Categories.jsx` (modal form + tabla + toast)

### 2. Sugerencias (`Sugerencias.jsx`)
```js
{ clienteId, clienteName, categoria, texto, status, createdAt }
```
- Igual que reclamos: selector de cliente con `useClientes`, guarda `clienteId` + `clienteName`
- `categoria` → `CATEGORIA_SUGERENCIA`, `status` → `ESTADO_SUGERENCIA`

### 3. Reportes CRM (`ReportesCRM.jsx`)
Los 5 reportes que pide el documento (ya hay imports listos en el archivo):
1. **Nuevos clientes por sector y tienda** → agrupar `clientes` por `sector` y por `tienda`
2. **Presupuesto vs resultado de campañas** → `campanas`, comparar `budget` vs `result`
3. **Presupuesto vs resultado de promociones** → `offers`, `budget` vs `result` (puede venir vacío = 0)
4. **Lista y análisis de sugerencias** → `sugerencias` agrupadas por `categoria` y `status`
5. **Lista y análisis de reclamos** → `reclamos` agrupados por `status`
- Solo lectura (no CRUD). Tablas o tarjetas con conteos. Cálculos con `.filter()`/`.reduce()`.

---

## Qué SÍ puedes tocar
- Tus páginas y hooks (lista arriba)
- `src/data/crm.js` → **solo agregar** enums nuevos, nunca renombrar/borrar (Jhoel los usa)

## Qué NO tocar (sin coordinar primero)
- `src/App.jsx` y `src/components/AdminSidebar.jsx` → ya tienen las rutas/links. Si necesitas
  cambiar uno, avisa antes (archivo compartido = conflictos)
- Páginas/hooks de Jhoel: `Clientes.jsx`, `Campanas.jsx`, `Offers.jsx`, `Dashboard.jsx`,
  `useClientes.js`, `useCampanas.js`, `useOffers.js`
  (sí puedes **importar** `useClientes` para leer clientes — solo no lo edites)
- Todo el ecommerce público (`Home`, `Shop`, `Cart`, `Checkout`, `CartContext`, etc.)
- `src/firebase.js`, `.env`

---

## Reglas de seguridad (CRÍTICO)
- **NUNCA** hardcodear credenciales. Todo sale de `.env` (`import.meta.env.VITE_*`).
- `.env` está en `.gitignore` — **jamás** lo commitees.
- Scripts node se ejecutan con `node --env-file=.env <script>.mjs`.

## Base de datos
- **NUNCA borrar/sobrescribir datos de producción.** Hay data real poblada.
- No corras scripts de seed sin confirmar con Jhoel.

---

## Flujo git
1. `git pull` antes de empezar el día
2. Branch por módulo: `feat/crm-reclamos`, `feat/crm-sugerencias`, `feat/crm-reportes`
3. Commits chicos, mensaje en inglés (Conventional Commits: `feat:`, `fix:`)
4. PR/merge a `master` al terminar módulo
5. `master` siempre debe compilar (`npm run build`)

## Esquema de datos compartido

```js
// clientes (lo crea Jhoel — tú lo lees)
{ name, type, sector, tienda, email, phone, contactName, status, createdAt }

// reclamos (tuyo)
{ clienteId, clienteName, asunto, detalle, status, respuesta, createdAt }

// sugerencias (tuyo)
{ clienteId, clienteName, categoria, texto, status, createdAt }
```
Enums centralizados en `src/data/crm.js`.

---

## Pendiente del equipo (no de código)
- ⬜ **Datos demo CRM** — `seed.mjs` aún NO puebla clientes/campañas/reclamos/sugerencias.
  Sin datos, los reportes salen en cero.
- ⬜ **Cuestionario** — 4 preguntas sobre tiendas virtuales.
- ⬜ **Informe + capturas** — documento final de la práctica.

---

## Auth + Pedidos de clientes (nuevo)

### Rutas públicas nuevas
| Ruta | Descripción |
|------|-------------|
| `/cuenta` | Login + Registro de clientes (tabs) |
| `/mis-pedidos` | Historial de pedidos del cliente logueado |
| `/perfil` | Editar nombre y contraseña |

### Archivos nuevos
| Archivo | Descripción |
|---------|-------------|
| `src/pages/Cuenta.jsx` | Página auth clientes con tabs Login/Registro + dashboard |
| `src/pages/MisPedidos.jsx` | Lista de pedidos del cliente con estado |
| `src/pages/Perfil.jsx` | Editar nombre y contraseña |
| `src/hooks/useAuthGate.jsx` | Gate que pide login antes de acciones |
| `src/hooks/useFavorites.js` | Favoritos en Firestore por usuario |
| `src/hooks/useMyOrders.js` | Pedidos filtrados por email del usuario |

### Flujo de pedidos
- Checkout crea orden con `userId` (si logueado) + `customer.email`
- `useMyOrders` filtra por `customer.email` del usuario actual
- Admin sigue viendo todos los pedidos en `/admin/pedidos`

### Login admin
- `/login` → exclusivo admin, redirect a `/admin`
- `/cuenta` → clientes, redirect a `/` al loguearse
- Header muestra icono de pedidos + cuenta + logout para clientes
