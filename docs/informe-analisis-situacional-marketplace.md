# Informe de Entregable — Análisis Situacional de E-Marketplace

**Asignatura:** Negocios Electrónicos
**Práctica N.º:** 04 — E-Marketplace
**Año lectivo:** 2026-A · Semestre IX
**Empresa analizada:** EcoAndes Textiles (textiles artesanales, Arequipa — Perú)
**Docente:** Dr. Ing. Juan Carlos Herrera Miranda
**Integrantes:** Jhoe Lenin Quea Vargas · Micaela Maribel Chambilla Condori
**Fecha:** 16/07/2026

> Nota: los **print screens** se insertan en el **Anexo A**. Incluyen tanto los e-marketplaces externos evaluados como el **prototipo de e-marketplace propio implementado** por el grupo de trabajo sobre la plataforma EcoAndes (React + Firebase), desplegado en `ecoandes-react.vercel.app`.

---

## 1. Resumen ejecutivo

EcoAndes Textiles es una empresa familiar arequipeña con 20 años de experiencia en textiles andinos (alpaca, algodón, lana), que vende chompas, bufandas, bolsos, mantas y accesorios de hogar mediante su tienda virtual propia con CRM integrado, atendiendo 5 sedes en distritos estratégicos de Arequipa (Cercado, Cayma, Yanahuara, Cerro Colorado y José Luis Bustamante y Rivero) y envíos a todo el Perú.

**Problema:** la tienda virtual es **mono-vendedor**: solo comercializa el catálogo propio. Los artesanos aliados de las comunidades proveedoras no tienen canal digital y los clientes demandan mayor variedad. La empresa pierde el efecto de red de un mercado digital: más vendedores → más catálogo → más compradores.

**Solución analizada e implementada:** el grupo evaluó **3 alternativas** de e-marketplace donde incorporarse y, adicionalmente, **implementó un prototipo funcional de e-marketplace propio** convirtiendo la plataforma EcoAndes en un mercado **vertical de artesanía textil** multi-vendedor: registro de tiendas de artesanos, portal de vendedor con gestión de productos y ventas, tiendas públicas por vendedor y sistema de comisiones administrable.

**Recomendación (adelanto):** estrategia mixta — operar el **e-marketplace propio** como canal principal (vertical, privado-controlado, comisión 10 %) e incorporarse a **Etsy** (vertical global de artesanía) para exportación, manteniendo **Mercado Libre Perú** como canal horizontal de alcance nacional. Sustento en la sección 7.

---

## 2. Marco conceptual

### 2.1 ¿Qué es un e-marketplace?
Entorno virtual que facilita procesos de negocio entre empresas y/o consumidores, usando tecnología para realizar transacciones, conectar compradores y vendedores y optimizar gastos de gestión (CECARM, 2013). Es un **punto de encuentro de múltiples compradores y vendedores** — a diferencia de la tienda virtual mono-vendedor, el marketplace agrega oferta de terceros.

### 2.2 Clasificación

| Criterio | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| **Por desarrollo** | Horizontal | Bienes/servicios de diversos sectores | Amazon, Mercado Libre, Alibaba |
| | Vertical | Especializado en un sector | Etsy (artesanía), Logismarket (logística) |
| **Por carácter** | Público | Acceso abierto con requisitos básicos | Mercado Libre |
| | Privado | Un operador abre el sistema a vendedores autorizados | Marketplace EcoAndes (curaduría de artesanos) |

### 2.3 Sistemas de venta en un e-marketplace
- **Subastas / subastas invertidas** — one-to-many; ventas puntuales, stocks, contratos.
- **Agregado de catálogos** — el comprador compara múltiples catálogos antes del pedido. *(Modelo adoptado por el prototipo EcoAndes: catálogo unificado multi-vendedor con precio fijo.)*
- **Lonjas (exchanges)** — many-to-many con pujas en tiempo real.

### 2.4 Beneficios

**Para el vendedor (artesano):**
- Canal digital sin invertir en plataforma propia.
- Acceso a la base de clientes y reputación de EcoAndes.
- Información en tiempo real: stock, pedidos, ingresos netos.
- Servicios centralizados: pasarela de pago (Culqi/Yape), logística, marketing.

**Para el comprador:**
- Mayor variedad en un solo lugar (efecto agregación).
- Comparación de precios y productos entre tiendas.
- Una sola cuenta, un solo carrito, una sola pasarela segura.

**Para el operador (EcoAndes):**
- Ingreso por comisión sin costo de inventario del tercero.
- Catálogo crece sin capital propio.
- Datos de mercado (qué vende cada tienda, a qué precio).

---

## 3. Análisis situacional de la empresa

### 3.1 Perfil
- **Sector:** textil artesanal / retail.
- **Canales:** tienda virtual propia, 5 sedes físicas (Arequipa), WhatsApp.
- **TI existente:** plataforma web React + Firebase con: catálogo, carrito, checkout (Culqi/Yape UI), CRM (clientes, campañas, reclamos, sugerencias, reportes), panel administrativo.
- **Sectores objetivo (CRM):** Moda, Hoteles y turismo, Empresas, Público general.

### 3.2 Diagnóstico FODA (frente al e-marketplace)

| | Positivo | Negativo |
|---|---|---|
| **Interno** | **F:** plataforma propia moderna y extensible; marca reconocida; CRM operativo; red de artesanos proveedores. | **D:** catálogo mono-vendedor limitado; artesanos aliados sin canal digital; dependencia del catálogo propio. |
| **Externo** | **O:** demanda global de artesanía andina; marketplaces verticales de artesanía consolidados (Etsy); turismo receptivo en Arequipa. | **A:** competencia en marketplaces masivos con precios bajos; comisiones externas altas (hasta 6.5–17 %); dependencia de reglas de plataformas de terceros. |

### 3.3 Problema
La tienda virtual no captura el valor de la red de artesanos: cada artesano vende por separado (o no vende en línea), el catálogo crece lento y el cliente no encuentra variedad. Se requiere decidir: ¿incorporarse a un marketplace de terceros, construir uno propio, o ambos?

---

## 4. Investigación de e-marketplaces

Se investigaron **3 horizontales** y **3 verticales** pertinentes al rubro artesanal:

### 4.1 Horizontales
**H1. Mercado Libre Perú** — https://www.mercadolibre.com.pe — líder LATAM; alcance nacional masivo, Mercado Envíos y Mercado Pago; comisión 11–17 %.
`[PRINT SCREEN — Mercado Libre: publicación y panel de vendedor]`

**H2. Amazon (Handmade)** — https://www.amazon.com/handmade — programa para artesanos dentro del marketplace global; exportación con FBA; comisión 15 %.
`[PRINT SCREEN — Amazon Handmade: registro de artesano]`

**H3. Alibaba / AliExpress** — https://www.alibaba.com — B2B/B2C global; útil para venta mayorista de lotes textiles a importadores.
`[PRINT SCREEN — Alibaba: RFQ / catálogo B2B]`

### 4.2 Verticales
**V1. Etsy** — https://www.etsy.com — marketplace global líder de artesanía y hechos a mano; comprador que valora lo artesanal y paga premium; comisión 6.5 % + fees.
`[PRINT SCREEN — Etsy: shop manager / listado]`

**V2. Novica (National Geographic)** — https://www.novica.com — artesanía de comercio justo por región (tiene hub andino); curaduría alta.
`[PRINT SCREEN — Novica: catálogo artesanos andinos]`

**V3. Marketplace propio EcoAndes** — `ecoandes-react.vercel.app` — prototipo **implementado por el grupo**: vertical de artesanía textil, multi-vendedor, con comisión configurable.
`[PRINT SCREEN — EcoAndes: registro de tienda /vendedor/registro]`
`[PRINT SCREEN — EcoAndes: portal vendedor /vendedor (productos y ventas)]`
`[PRINT SCREEN — EcoAndes: tienda pública de un vendedor /tienda/vendedor/:id]`
`[PRINT SCREEN — EcoAndes: admin Vendedores & Comisiones]`

### 4.3 Funcionalidades del prototipo propio (evidencia)

| Función de e-marketplace | Implementación en EcoAndes |
|---|---|
| Alta de vendedores | Auto-registro de tienda (nombre, descripción, logo) con rol `seller` |
| Catálogo agregado | Productos de todos los vendedores en la tienda única, con chip "Vendido por" |
| Tienda por vendedor | Página pública por tienda + filtro por vendedor |
| Gestión del vendedor | Portal con CRUD de productos propios y reporte de ventas (bruto/neto) |
| Transacción centralizada | Carrito y checkout únicos (Culqi/Yape); cada ítem registra su vendedor |
| Monetización del operador | Comisión % configurable por el administrador; liquidación bruto − comisión = neto |
| Gobernanza | Admin puede suspender/activar/eliminar tiendas |

---

## 5. Las 3 alternativas evaluadas (matriz de decisión)

Criterios según las condiciones de la guía (seguridad, integración, servicios diferenciales, adecuación al proceso comercial), ponderados:

| Criterio (peso) | Alt. 1 · Mercado Libre (H) | Alt. 2 · Etsy (V) | Alt. 3 · Marketplace propio (V) |
|---|---|---|---|
| Alcance de mercado (20 %) | 5 (nacional masivo) | 4 (global nicho) | 2 (propio, en crecimiento) |
| Adecuación al rubro artesanal (20 %) | 2 | 5 | 5 |
| Control del canal y los datos (15 %) | 1 | 2 | 5 |
| Costo/comisión (15 %) | 2 (11–17 %) | 3 (6.5 % + fees) | 5 (comisión propia 10 % = ingreso) |
| Integración con TI propia (15 %) | 2 | 2 | 5 (nativa) |
| Seguridad de transacción (15 %) | 5 (Mercado Pago) | 5 | 4 (Culqi + reglas Firestore) |
| **Puntaje ponderado (sobre 5)** | **2.90** | **3.55** | **4.35** |

---

## 6. Comparación: Horizontal vs Vertical

| Aspecto | Horizontal (Mercado Libre, Amazon) | Vertical (Etsy, Novica, EcoAndes) |
|---|---|---|
| Tráfico | Masivo, genérico | Menor pero **cualificado** (busca artesanía) |
| Competencia | Contra todo el retail (precio manda) | Entre pares del rubro (valor manda) |
| Percepción de marca | Diluida (un vendedor más) | Reforzada (contexto artesanal premium) |
| Comisiones | 11–17 % | 6.5 % (Etsy) / definida por el operador (propio) |
| Datos del cliente | Del marketplace | Del operador (propio) |
| Ideal para | Volumen y alcance rápido | Margen, marca y fidelización |

**Conclusión:** para artesanía, el vertical gana en margen y marca; el horizontal aporta alcance. La combinación cubre ambos objetivos.

---

## 7. Recomendación (sustento — más de 15 líneas)

El grupo de trabajo sugiere **DOS alternativas complementarias: (1) operar el e-marketplace propio EcoAndes y (2) incorporarse a Etsy**, por las siguientes razones:

1. El marketplace propio obtuvo el mayor puntaje ponderado (4.35), porque convierte una debilidad estructural (catálogo mono-vendedor) en una ventaja de red: cada artesano que se registra amplía el catálogo sin costo de inventario para la empresa.
2. Está **ya implementado y probado** sobre la plataforma existente (React + Firebase), por lo que la inversión incremental fue mínima y no hay dependencia de terceros ni cuotas de plataforma.
3. Genera un **nuevo flujo de ingresos**: la comisión configurable (10 % inicial) sobre cada venta de terceros, administrable desde el panel (Vendedores & Comisiones) con liquidación transparente bruto/neto por vendedor.
4. Mantiene el **control de los datos** de clientes y ventas, insumo directo del CRM ya operativo (campañas, reportes), algo imposible en marketplaces de terceros.
5. Es un marketplace **vertical y curado**: solo artesanía textil andina, lo que protege la percepción premium de la marca frente a la guerra de precios de los horizontales.
6. La seguridad de la transacción se resolvió con pasarela Culqi server-side y reglas de Firestore por rol (vendedor solo edita lo suyo; comisión solo la fija el admin).
7. Etsy complementa como **canal de exportación**: es el marketplace vertical de artesanía más grande del mundo, con compradores que valoran lo hecho a mano y pagan precios superiores a los del mercado local.
8. La comisión de Etsy (6.5 % + fees) es sustancialmente menor a la de Mercado Libre (11–17 %) o Amazon (15 %), preservando el margen artesanal.
9. Publicar en Etsy no requiere desarrollo: solo producción de contenido (fotos, fichas en inglés), lo que cabe en el presupuesto y en las capacidades del equipo.
10. Se descarta priorizar **Mercado Libre** porque su tráfico masivo orientado a precio erosiona el posicionamiento premium; queda como canal táctico futuro para líneas de entrada.
11. La estrategia dual reduce riesgo: si un canal externo cambia sus reglas o comisiones, el canal propio permanece bajo control total de la empresa.

En síntesis: **el marketplace propio captura la red de artesanos local y el margen; Etsy abre la exportación** — ambos verticales, coherentes con la identidad artesanal de EcoAndes.

---

## 8. Presupuesto referencial (tope S/ 8 000)

| Concepto | Estimado (S/) |
|---|---|
| Desarrollo del marketplace propio (fases 1–4, ya ejecutado) | 3 500 |
| Hosting/infraestructura año 1 (Vercel + Firebase + Cloudinary, capas gratuitas/pro) | 600 |
| Apertura y curaduría de tienda Etsy (fichas, traducción, fotos) | 1 800 |
| Onboarding y capacitación de artesanos vendedores | 1 200 |
| Marketing de lanzamiento del marketplace (campañas CRM) | 900 |
| **Total** | **8 000** |

---

## 9. Cuestionario

**1. ¿Qué es un e-marketplace?**
Entorno virtual que conecta múltiples compradores y vendedores para realizar transacciones de bienes o servicios por medios telemáticos (principalmente Internet), facilitando la relación entre las partes y optimizando los gastos de gestión.

**2. ¿Cuál es la clasificación de los e-marketplace?**
Por **desarrollo**: horizontal (múltiples sectores) y vertical (un sector). Por **carácter**: público (acceso abierto con requisitos básicos) y privado (un operador autoriza a sus vendedores/proveedores).

**3. ¿Cuáles son los beneficios del e-marketplace?**
Vendedor: más clientes potenciales, menores costes de transacción, servicios centralizados (pago, logística, facturación), información de mercado. Comprador: acceso a más proveedores, comparación de precios, automatización de la compra, menos carga administrativa. Operador: ingreso por comisión, catálogo que crece sin inventario propio, datos del mercado.

**4. ¿Cuáles son los diferentes sistemas de venta que ofrece un e-marketplace?**
Subastas y subastas invertidas (one-to-many), agregado de catálogos (comparación multi-catálogo con precio fijo — el usado por EcoAndes) y lonjas/exchanges (many-to-many con pujas en tiempo real).

**5. Los 10 principales e-marketplace (según nuestro criterio, de los analizados):**
1. Amazon · 2. Alibaba/AliExpress · 3. Mercado Libre · 4. Etsy · 5. eBay · 6. Rakuten · 7. Zalando · 8. Novica · 9. Solostocks · 10. Wallapop.

---

## 10. Referencias

- CECARM (2013). Definición de e-marketplace.
- Asociación Española de Comercio Electrónico @ece (2002).
- marketing4ecommerce.net — Top 10 de marketplaces en España (2017).
- ecommerce-news.es — 10 mejores marketplaces de venta B2B internacional (2020).
- Video: «Cómo funciona el Marketplace de Facebook» — https://www.youtube.com/watch?v=8nCvtOWlgr0
- Etsy, Novica, Mercado Libre, Amazon Handmade, Alibaba (sitios oficiales).
- Repositorio del prototipo: https://github.com/JhoeLenin/ecoandes-textiles — despliegue: ecoandes-react.vercel.app

---

## Anexo A — Print screens

**A.1 Marketplaces externos evaluados** — capturas de Mercado Libre, Etsy, Novica, Amazon Handmade, Alibaba (funcionalidades, panel de vendedor, comisiones).

**A.2 Prototipo propio EcoAndes** — capturas sugeridas:
1. `/vendedor/registro` — auto-registro de tienda de artesano.
2. `/vendedor` — panel del vendedor (métricas de productos, pedidos, ingresos).
3. `/vendedor/productos` — CRUD de productos propios.
4. `/vendedor/ventas` — ventas con bruto, comisión y neto.
5. `/tienda` — catálogo agregado con chip "Vendido por [tienda]".
6. `/tienda/vendedor/:id` — tienda pública de un vendedor.
7. `/admin/vendedores` — panel Vendedores & Comisiones (tasa %, liquidación por vendedor, suspender/activar).
