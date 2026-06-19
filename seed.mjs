import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

// Credenciales desde .env (NO hardcodear). Ejecutar con:
//   node --env-file=.env seed.mjs
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const missing = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k);
if (missing.length) {
  console.error(`Faltan variables de entorno: ${missing.join(', ')}`);
  console.error('Ejecuta con: node --env-file=.env seed.mjs');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const now = () => new Date().toISOString();

// Inserta solo si la colección está vacía (idempotente, no duplica producción).
async function seedIfEmpty(name, label, fn) {
  const snap = await getDocs(collection(db, name));
  if (!snap.empty) {
    console.log(`\n⏭  ${label}: ya tiene ${snap.size} docs, se omite.`);
    return false;
  }
  console.log(`\nCreando ${label}...`);
  await fn();
  return true;
}

const CATEGORIES = [
  { name: 'Chompas y Bufandas' },
  { name: 'Accesorios para el Hogar' },
  { name: 'Bolsos y Mochilas' },
];

const PRODUCTS = [
  { id: 'PROD-01', name: 'Chompa de Alpaca (cuello alto)',         category: 'CAT-01', description: 'Tejido de lana de alpaca con mezcla acrílica, cuello alto, colores gris y beige.', specs: { Composición: '80% alpaca, 20% acrílico', Tallas: 'S / M / L / XL', Elaboración: 'Tejido a mano', Colores: 'Gris y beige' }, priceList: 89, priceOffer: 69, stock: 25, featured: true },
  { id: 'PROD-02', name: 'Bufanda Multicolor (180×30)',            category: 'CAT-01', description: 'Franjas horizontales tradicionales en rojo, naranja, amarillo y verde.', specs: { Composición: '100% acrílico hipoalergénico', Dimensiones: '180 cm × 30 cm', Acabado: 'Finales con flecos' }, priceList: 35, priceOffer: 29.9, stock: 40, featured: true },
  { id: 'PROD-03', name: 'Manta Totoras (150×200)',                category: 'CAT-02', description: 'Manta decorativa con patrones inspirados en totora, tonos tierra.', specs: { Composición: '100% algodón', Dimensiones: '150 cm × 200 cm', Cuidado: 'Lavable a máquina' }, priceList: 120, priceOffer: 99, stock: 15, featured: true },
  { id: 'PROD-04', name: 'Cojín Aymara (40×40 bordado)',           category: 'CAT-02', description: 'Cojín cuadrado con bordado manual de símbolos andinos aymara.', specs: { Dimensiones: '40 cm × 40 cm', Funda: 'Removible', Relleno: 'Fibra', Colores: 'Vibrantes' }, priceList: 45, priceOffer: 39.9, stock: 30, featured: false },
  { id: 'PROD-05', name: 'Mochila Wayra (35×25, yute)',            category: 'CAT-03', description: 'Mochila pequeña de yute natural con cierre cremallera y tiradores ajustables.', specs: { Dimensiones: '35 cm × 25 cm', Material: 'Yute natural', Colores: 'Rojo y azul' }, priceList: 65, priceOffer: 55, stock: 20, featured: true },
  { id: 'PROD-06', name: 'Bolso Chumpi (bandolera)',               category: 'CAT-03', description: 'Bandolera con correa tejida andina, cierre magnético y bolsillo interior.', specs: { Dimensiones: '28 cm × 18 cm', Correa: 'Cinturón tejido', Diseño: 'Patrones tradicionales' }, priceList: 79, priceOffer: 69.9, stock: 12, featured: false },
  { id: 'PROD-07', name: 'Chompa Niños Alpaca (tallas 4-10)',      category: 'CAT-01', description: 'Motivos geométricos andinos tradicionales, colores blanco, rosa y beige.', specs: { Composición: '100% alpaca', Tallas: '4, 6, 8, 10', Textura: 'Suave y cálido' }, priceList: 59, priceOffer: 49, stock: 18, featured: false },
  { id: 'PROD-08', name: 'Gorro Andino Chullo (orejeras)',         category: 'CAT-01', description: 'Gorro tradicional con orejeras y cordón trenzado, multicolor.', specs: { Composición: '100% alpaca', Talla: 'Única', Diseño: 'Patrones andinos tradicionales' }, priceList: 25, priceOffer: 21.5, stock: 35, featured: true },
  { id: 'PROD-09', name: 'Alfombra Trenzada (200×300)',            category: 'CAT-02', description: 'Alfombra grande tejida a mano con grecas tradicionales.', specs: { Composición: '100% lana de oveja', Dimensiones: '200 cm × 300 cm', Tratamiento: 'Antipolilla', Colores: 'Cálidos' }, priceList: 150, priceOffer: 125, stock: 8, featured: false },
  { id: 'PROD-10', name: 'Camino de Mesa (35×180)',                category: 'CAT-02', description: 'Bordado andino en algodón, motivos tradicionales, lavable.', specs: { Composición: '100% algodón', Dimensiones: '35 cm × 180 cm', Cuidado: 'Lavable a máquina' }, priceList: 55, priceOffer: 45, stock: 22, featured: false },
  { id: 'PROD-11', name: 'Morral Telar (40×35, cordón)',           category: 'CAT-03', description: 'Morral grande tejido en telar tradicional con cierre de cordón.', specs: { Dimensiones: '40 cm × 35 cm', Forro: 'Reforzado', Colores: 'Terracota, verde y azul' }, priceList: 89, priceOffer: 75, stock: 14, featured: true },
  { id: 'PROD-12', name: 'Riñonera Textil (20×12)',               category: 'CAT-03', description: 'Riñonera pequeña tejida con cierre zipper y correa ajustable.', specs: { Dimensiones: '20 cm × 12 cm', Colores: 'Azul, beige y mostaza', Diseño: 'Patrones tradicionales' }, priceList: 39, priceOffer: 32.5, stock: 28, featured: false },
];

const OFFERS = [
  { name: 'Liquidación de Temporada', discountType: 'percent', discountValue: 20, budget: 800, result: 1250, cumulative: false, startDate: '2026-06-01', endDate: '2026-07-31', active: true, productIds: ['PROD-01', 'PROD-03', 'PROD-05', 'PROD-08', 'PROD-11'] },
  { name: 'Envío Gratis + Descuento', discountType: 'fixed', discountValue: 15, budget: 500, result: 430, cumulative: false, startDate: '2026-06-15', endDate: '2026-07-15', active: true, productIds: ['PROD-02', 'PROD-04', 'PROD-06', 'PROD-10'] },
];

// ---------- CRM ----------
const CLIENTES = [
  { name: 'Minera Aruntani SAC',        type: 'prospecto', sector: 'minero',     tienda: 'Cayma',          contactName: 'Juan Pérez',    email: 'compras@aruntani.pe',   phone: '951234567', status: 'activo' },
  { name: 'Comercial Los Andes EIRL',   type: 'regular',   sector: 'comercial',  tienda: 'Cercado',        contactName: 'María Quispe',  email: 'ventas@losandes.pe',    phone: '952345678', status: 'activo' },
  { name: 'Textiles del Sur SA',        type: 'proveedor', sector: 'industrial', tienda: 'Cerro Colorado', contactName: 'Carlos Mamani', email: 'info@textilsur.pe',     phone: '953456789', status: 'activo' },
  { name: 'Hotel Casona Plaza',         type: 'regular',   sector: 'servicios',  tienda: 'Cercado',        contactName: 'Ana Flores',    email: 'reservas@casona.pe',    phone: '954567890', status: 'activo' },
  { name: 'Distribuidora Paucarpata',   type: 'agente',    sector: 'comercial',  tienda: 'Paucarpata',     contactName: 'Luis Choque',   email: 'dist@paucarpata.pe',    phone: '955678901', status: 'activo' },
  { name: 'Bordados Hunter',            type: 'regular',   sector: 'hogar',      tienda: 'Hunter',         contactName: 'Rosa Huamán',   email: 'bordados@hunter.pe',    phone: '956789012', status: 'inactivo' },
  { name: 'Constructora Misti',         type: 'prospecto', sector: 'industrial', tienda: 'Cayma',          contactName: 'Pedro Ríos',    email: 'logistica@misti.pe',    phone: '957890123', status: 'activo' },
  { name: 'Artesanías Yanahuara',       type: 'regular',   sector: 'comercial',  tienda: 'Cerro Colorado', contactName: 'Elena Vargas',  email: 'arte@yanahuara.pe',     phone: '958901234', status: 'migrado' },
];

const CAMPANAS = [
  { name: 'Campaña Invierno B2B',   channel: 'email',    targetSector: 'minero',    budget: 1500, result: 1820, startDate: '2026-06-01', endDate: '2026-06-30', status: 'activa' },
  { name: 'Feria Regional Arequipa', channel: 'visita',  targetSector: 'comercial', budget: 3000, result: 2400, startDate: '2026-04-10', endDate: '2026-04-20', status: 'finalizada' },
  { name: 'Promo Día de la Madre',  channel: 'virtual',  targetSector: 'hogar',     budget: 800,  result: 1100, startDate: '2026-05-01', endDate: '2026-05-12', status: 'finalizada' },
  { name: 'Captación Hoteles',      channel: 'telefono', targetSector: 'servicios', budget: 1200, result: 0,    startDate: '2026-06-10', endDate: '2026-07-10', status: 'activa' },
];

// clienteIdx referencia el índice en CLIENTES (se resuelve al id real tras crearlos).
const RECLAMOS = [
  { clienteIdx: 3, asunto: 'Entrega tardía',      detalle: 'El pedido llegó 5 días después de lo acordado.',        status: 'resuelto',   respuesta: 'Se reprogramó envío y se aplicó descuento del 10%.' },
  { clienteIdx: 1, asunto: 'Producto defectuoso', detalle: 'Dos chompas llegaron con costuras abiertas.',          status: 'en_proceso', respuesta: '' },
  { clienteIdx: 0, asunto: 'Factura incorrecta',  detalle: 'La factura no coincide con el monto del pedido.',      status: 'abierto',    respuesta: '' },
  { clienteIdx: 4, asunto: 'Faltante en pedido',  detalle: 'Faltaron 3 unidades del lote de bufandas.',            status: 'abierto',    respuesta: '' },
  { clienteIdx: 2, asunto: 'Demora en respuesta', detalle: 'No respondieron la cotización en 1 semana.',           status: 'resuelto',   respuesta: 'Se asignó un ejecutivo de cuenta dedicado.' },
];

const SUGERENCIAS = [
  { clienteIdx: 1, categoria: 'producto', texto: 'Ampliar la gama de colores en las chompas de alpaca.',   status: 'nueva' },
  { clienteIdx: 3, categoria: 'servicio', texto: 'Atención más rápida en el canal de WhatsApp.',           status: 'revisada' },
  { clienteIdx: 5, categoria: 'entrega',  texto: 'Habilitar entregas los días sábado.',                    status: 'aplicada' },
  { clienteIdx: 6, categoria: 'precio',   texto: 'Ofrecer descuentos por compras de gran volumen.',        status: 'nueva' },
  { clienteIdx: 7, categoria: 'otro',     texto: 'Publicar un catálogo digital descargable en PDF.',       status: 'revisada' },
];

async function seed() {
  console.log('Poblando Firestore (idempotente)...');

  await seedIfEmpty('categories', 'categorías', async () => {
    for (const cat of CATEGORIES) {
      const ref = await addDoc(collection(db, 'categories'), { name: cat.name, image: '' });
      console.log(`  ✓ ${cat.name} (${ref.id})`);
    }
  });

  await seedIfEmpty('products', 'productos', async () => {
    for (const p of PRODUCTS) {
      const ref = await addDoc(collection(db, 'products'), { ...p, images: [], createdAt: now() });
      console.log(`  ✓ ${p.id} — ${p.name} (${ref.id})`);
    }
  });

  await seedIfEmpty('offers', 'ofertas', async () => {
    for (const o of OFFERS) {
      const ref = await addDoc(collection(db, 'offers'), { ...o, createdAt: now() });
      console.log(`  ✓ ${o.name} (${ref.id})`);
    }
  });

  // Clientes: capturamos id+name para enlazar reclamos/sugerencias.
  const clienteRefs = [];
  await seedIfEmpty('clientes', 'clientes', async () => {
    for (const c of CLIENTES) {
      const ref = await addDoc(collection(db, 'clientes'), { ...c, createdAt: now() });
      clienteRefs.push({ id: ref.id, name: c.name });
      console.log(`  ✓ ${c.name} (${ref.id})`);
    }
  });

  await seedIfEmpty('campanas', 'campañas', async () => {
    for (const c of CAMPANAS) {
      const ref = await addDoc(collection(db, 'campanas'), { ...c, createdAt: now() });
      console.log(`  ✓ ${c.name} (${ref.id})`);
    }
  });

  // Reclamos/sugerencias necesitan los clientes recién creados.
  if (clienteRefs.length) {
    await seedIfEmpty('reclamos', 'reclamos', async () => {
      for (const r of RECLAMOS) {
        const cli = clienteRefs[r.clienteIdx];
        const { clienteIdx, ...rest } = r;
        const ref = await addDoc(collection(db, 'reclamos'), {
          ...rest, clienteId: cli.id, clienteName: cli.name, createdAt: now(),
        });
        console.log(`  ✓ ${r.asunto} — ${cli.name} (${ref.id})`);
      }
    });

    await seedIfEmpty('sugerencias', 'sugerencias', async () => {
      for (const s of SUGERENCIAS) {
        const cli = clienteRefs[s.clienteIdx];
        const { clienteIdx, ...rest } = s;
        const ref = await addDoc(collection(db, 'sugerencias'), {
          ...rest, clienteId: cli.id, clienteName: cli.name, createdAt: now(),
        });
        console.log(`  ✓ ${s.categoria} — ${cli.name} (${ref.id})`);
      }
    });
  } else {
    console.log('\n⏭  reclamos/sugerencias: requieren clientes nuevos, se omiten (clientes ya existían).');
  }

  console.log('\n✅ Poblado correctamente.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
