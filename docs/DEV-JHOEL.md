# Guía de desarrollo — Jhoel

Proyecto: EcoAndes (React + Vite + Firebase). Práctica 02 Negocios Electrónicos — prototipo CRM
sobre el panel admin existente.

> **ESTADO: tus 4 módulos COMPLETADOS y mergeados a `master`.** ✅

---

## Tus módulos

| Módulo | Página | Hook | Colección | Estado |
|--------|--------|------|-----------|--------|
| Clientes CRM | `src/pages/admin/Clientes.jsx` | `src/hooks/useClientes.js` | `clientes` | ✅ Hecho |
| Campañas | `src/pages/admin/Campanas.jsx` | `src/hooks/useCampanas.js` | `campanas` | ✅ Hecho |
| Promociones (extender) | `src/pages/admin/Offers.jsx` | `src/hooks/useOffers.js` | `offers` | ✅ Hecho |
| Dashboard CRM | `src/pages/admin/Dashboard.jsx` | (varios) | — | ✅ Hecho |

Todos en `master`. Los módulos de tu compañera (Reclamos, Sugerencias, Reportes) también
están mergeados (PR #1). El CRM funciona de punta a punta.

---

## Especificaciones por módulo

### 1. Clientes (`Clientes.jsx`)
Formulario + tabla. Campos del documento:
```js
{ name, type, sector, tienda, email, phone, contactName, status, createdAt }
```
- `type`, `sector`, `tienda`, `status`: usar enums de `src/data/crm.js`
  (`TIPOS_CLIENTE`, `SECTORES`, `TIENDAS`, `ESTADO_CLIENTE`)
- Tabla con **filtro por sector y por tienda** (lo pide el reporte "nuevos clientes por sector/tienda")
- Patrón de referencia: copia la estructura de `Categories.jsx` (modal form + tabla + toast)

### 2. Campañas (`Campanas.jsx`)
```js
{ name, channel, budget, result, targetSector, startDate, endDate, status, createdAt }
```
- `channel` → `CANALES`, `targetSector` → `SECTORES`, `status` → `ESTADO_CAMPANA`
- `budget` y `result` numéricos (S/). La tabla debe mostrar la diferencia/desviación
  (presupuesto vs resultado) — eso alimenta el reporte de tu compañera.

### 3. Promociones — extender `offers`
NO crear colección nueva. Agregar 2 campos opcionales al form de `Offers.jsx`:
```js
{ ...campos actuales, budget, result }
```
Ofertas viejas sin esos campos = tratarlas como 0 en reportes.

### 4. Dashboard CRM (`Dashboard.jsx`)
Va al final. Agregar tarjetas: total clientes, clientes por sector, campañas activas,
reclamos abiertos. Reusa los hooks. No rompas las stats de ecommerce ya existentes.

---

## Qué SÍ puedes tocar
- Tus páginas y hooks (lista arriba)
- `src/data/crm.js` → **solo agregar** enums nuevos, nunca renombrar/borrar (tu compañera los usa)

## Qué NO tocar (sin coordinar primero)
- `src/App.jsx` y `src/components/AdminSidebar.jsx` → ya tienen las rutas/links. Si necesitas
  cambiar uno, avisa antes (archivo compartido = conflictos)
- Páginas/hooks de tu compañera: `Reclamos.jsx`, `Sugerencias.jsx`, `ReportesCRM.jsx`,
  `useReclamos.js`, `useSugerencias.js`
- Todo el ecommerce público (`Home`, `Shop`, `Cart`, `Checkout`, `CartContext`, etc.)
- `src/firebase.js`, `.env`

---

## Reglas de seguridad (CRÍTICO)
- **NUNCA** hardcodear credenciales. Todo sale de `.env` (`import.meta.env.VITE_*`).
- `.env` está en `.gitignore` — **jamás** lo commitees.
- Scripts node (como `seed.mjs`) se ejecutan con `node --env-file=.env seed.mjs`.

## Base de datos
- **NUNCA borrar/sobrescribir datos de producción.** Hay data real poblada.
- `seed.mjs` solo AGREGA, no limpia. Aun así, confirma antes de correrlo.

---

## Flujo git
1. `git pull` antes de empezar el día
2. Branch por módulo: `feat/crm-clientes`, `feat/crm-campanas`
3. Commits chicos, mensaje en inglés (Conventional Commits: `feat:`, `fix:`)
4. PR/merge a `master` al terminar módulo
5. `master` siempre debe compilar (`npm run build`)

## Esquema de datos (referencia)
Ver `docs/DEV-AMORCITO.md` — mismo esquema compartido.

---

## Pendiente del equipo (no de código)
- ⬜ **Datos demo CRM** — `seed.mjs` aún NO puebla clientes/campañas/reclamos/sugerencias.
  Sin datos, los reportes salen en cero. Falta extender el seed o cargar datos a mano.
- ⬜ **Cuestionario** — 4 preguntas sobre tiendas virtuales (entregable de la guía).
- ⬜ **Informe + capturas** — documento final de la práctica.
