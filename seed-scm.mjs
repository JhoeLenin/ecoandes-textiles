// Siembra solo datos SCM (proveedores + órdenes de compra). Idempotente.
// Ejecutar: node --env-file=.env seed-scm.mjs
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const now = () => new Date().toISOString();

const PROVEEDORES = [
  { name: 'Alpacas del Sur S.A.C.',        ruc: '20456789012', category: 'Lana de alpaca',      contactName: 'Rosa Mamani',   email: 'ventas@alpacasdelsur.pe',  phone: '958111222', leadTimeDays: 7,  status: 'activo' },
  { name: 'Hilandería Arequipa E.I.R.L.',  ruc: '20567890123', category: 'Hilos y tintes',      contactName: 'Carlos Ticona', email: 'pedidos@hilanderiaaqp.pe', phone: '958222333', leadTimeDays: 5,  status: 'activo' },
  { name: 'Algodón Nativo Perú',           ruc: '20678901234', category: 'Algodón orgánico',    contactName: 'Elena Ríos',    email: 'contacto@algodonnativo.pe',phone: '958333444', leadTimeDays: 10, status: 'activo' },
  { name: 'Accesorios Textiles JLBR',      ruc: '20789012345', category: 'Cierres y herrajes',  contactName: 'Luis Choque',   email: 'ventas@accesoriosjlbr.pe', phone: '958444555', leadTimeDays: 3,  status: 'activo' },
  { name: 'Tejidos Comunales Cabana',      ruc: '20890123456', category: 'Telar artesanal',     contactName: 'Ana Huamán',    email: 'comunidad@cabana.pe',      phone: '958555666', leadTimeDays: 14, status: 'inactivo' },
];

async function isEmpty(name) {
  const snap = await getDocs(collection(db, name));
  return snap.empty;
}

async function main() {
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass) { console.error('Falta ADMIN_PASSWORD en .env'); process.exit(1); }
  await signInWithEmailAndPassword(auth, 'admin@ecoandes.com', pass);
  console.log('Autenticado como admin@ecoandes.com\n');

  // Proveedores
  const proveedorRefs = [];
  if (await isEmpty('proveedores')) {
    for (const p of PROVEEDORES) {
      const ref = await addDoc(collection(db, 'proveedores'), { ...p, createdAt: now() });
      proveedorRefs.push({ id: ref.id, name: p.name });
      console.log(`  ✓ proveedor ${p.name}`);
    }
  } else {
    console.log('  ⏭  proveedores ya existen; se reutilizan para las órdenes.');
    const snap = await getDocs(collection(db, 'proveedores'));
    snap.docs.forEach((d) => proveedorRefs.push({ id: d.id, name: d.data().name }));
  }

  // Órdenes de compra (referencian productos reales)
  if (await isEmpty('ordenesCompra')) {
    if (proveedorRefs.length < 3) { console.log('  ⏭  faltan proveedores.'); }
    else {
      const prodSnap = await getDocs(collection(db, 'products'));
      const prods = prodSnap.docs.slice(0, 6).map((d) => ({ id: d.id, ...d.data() }));
      if (prods.length < 5) { console.log('  ⏭  faltan productos.'); }
      else {
        const mkItem = (p, qty) => ({ productId: p.id, name: p.name, qty, unitCost: Number(p.priceList) || 0 });
        const totalOf = (its) => its.reduce((s, i) => s + i.qty * i.unitCost, 0);
        const ocs = [
          { prov: proveedorRefs[0], items: [mkItem(prods[0], 20), mkItem(prods[1], 15)], status: 'solicitado' },
          { prov: proveedorRefs[1], items: [mkItem(prods[2], 30)],                        status: 'aprobado' },
          { prov: proveedorRefs[2], items: [mkItem(prods[3], 25), mkItem(prods[4], 10)], status: 'recibido', receivedAt: now() },
        ];
        for (const oc of ocs) {
          await addDoc(collection(db, 'ordenesCompra'), {
            proveedorId: oc.prov.id, proveedorName: oc.prov.name,
            items: oc.items, total: totalOf(oc.items), status: oc.status,
            ...(oc.receivedAt ? { receivedAt: oc.receivedAt } : {}), createdAt: now(),
          });
          console.log(`  ✓ OC ${oc.prov.name} — ${oc.status} — S/ ${totalOf(oc.items)}`);
        }
      }
    }
  } else {
    console.log('  ⏭  ordenesCompra ya existen.');
  }

  console.log('\n✅ SCM sembrado.');
  process.exit(0);
}

main().catch((e) => { console.error('Error:', e.message); process.exit(1); });
