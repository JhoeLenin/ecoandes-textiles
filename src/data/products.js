// EcoAndes Textiles — catálogo (fuente única de datos)

export const CATEGORIES = [
  { id: 'CAT-01', name: 'Chompas y Bufandas', img: '/img/cat-01.jpg' },
  { id: 'CAT-02', name: 'Accesorios para el Hogar', img: '/img/cat-02.jpg' },
  { id: 'CAT-03', name: 'Bolsos y Mochilas', img: '/img/cat-03.jpg' },
];

export const PRODUCTS = [
  {
    id: 'PROD-01',
    name: 'Chompa de Alpaca (cuello alto)',
    category: 'CAT-01',
    description: 'Tejido de lana de alpaca con mezcla acrílica, cuello alto, colores gris y beige.',
    specs: {
      'Composición': '80% alpaca, 20% acrílico',
      'Tallas': 'S / M / L / XL',
      'Elaboración': 'Tejido a mano',
      'Colores': 'Gris y beige',
    },
    priceList: 89,
    priceOffer: 69,
    stock: 25,
    featured: true,
  },
  {
    id: 'PROD-02',
    name: 'Bufanda Multicolor (180×30)',
    category: 'CAT-01',
    description: 'Franjas horizontales tradicionales en rojo, naranja, amarillo y verde.',
    specs: {
      'Composición': '100% acrílico hipoalergénico',
      'Dimensiones': '180 cm × 30 cm',
      'Acabado': 'Finales con flecos',
    },
    priceList: 35,
    priceOffer: 29.9,
    stock: 40,
    featured: true,
  },
  {
    id: 'PROD-03',
    name: 'Manta Totoras (150×200)',
    category: 'CAT-02',
    description: 'Manta decorativa con patrones inspirados en totora, tonos tierra.',
    specs: {
      'Composición': '100% algodón',
      'Dimensiones': '150 cm × 200 cm',
      'Cuidado': 'Lavable a máquina',
    },
    priceList: 120,
    priceOffer: 99,
    stock: 15,
    featured: true,
  },
  {
    id: 'PROD-04',
    name: 'Cojín Aymara (40×40 bordado)',
    category: 'CAT-02',
    description: 'Cojín cuadrado con bordado manual de símbolos andinos aymara.',
    specs: {
      'Dimensiones': '40 cm × 40 cm',
      'Funda': 'Removible',
      'Relleno': 'Fibra',
      'Colores': 'Vibrantes',
    },
    priceList: 45,
    priceOffer: 39.9,
    stock: 30,
    featured: false,
  },
  {
    id: 'PROD-05',
    name: 'Mochila Wayra (35×25, yute)',
    category: 'CAT-03',
    description: 'Mochila pequeña de yute natural con cierre cremallera y tiradores ajustables.',
    specs: {
      'Dimensiones': '35 cm × 25 cm',
      'Material': 'Yute natural',
      'Colores': 'Rojo y azul',
    },
    priceList: 65,
    priceOffer: 55,
    stock: 20,
    featured: true,
  },
  {
    id: 'PROD-06',
    name: 'Bolso Chumpi (bandolera)',
    category: 'CAT-03',
    description: 'Bandolera con correa tejida andina, cierre magnético y bolsillo interior.',
    specs: {
      'Dimensiones': '28 cm × 18 cm',
      'Correa': 'Cinturón tejido',
      'Diseño': 'Patrones tradicionales',
    },
    priceList: 79,
    priceOffer: 69.9,
    stock: 12,
    featured: false,
  },
  {
    id: 'PROD-07',
    name: 'Chompa Niños Alpaca (tallas 4-10)',
    category: 'CAT-01',
    description: 'Motivos geométricos andinos tradicionales, colores blanco, rosa y beige.',
    specs: {
      'Composición': '100% alpaca',
      'Tallas': '4, 6, 8, 10',
      'Textura': 'Suave y cálido',
    },
    priceList: 59,
    priceOffer: 49,
    stock: 18,
    featured: false,
  },
  {
    id: 'PROD-08',
    name: 'Gorro Andino Chullo (orejeras)',
    category: 'CAT-01',
    description: 'Gorro tradicional con orejeras y cordón trenzado, multicolor.',
    specs: {
      'Composición': '100% alpaca',
      'Talla': 'Única',
      'Diseño': 'Patrones andinos tradicionales',
    },
    priceList: 25,
    priceOffer: 21.5,
    stock: 35,
    featured: true,
  },
  {
    id: 'PROD-09',
    name: 'Alfombra Trenzada (200×300)',
    category: 'CAT-02',
    description: 'Alfombra grande tejida a mano con grecas tradicionales.',
    specs: {
      'Composición': '100% lana de oveja',
      'Dimensiones': '200 cm × 300 cm',
      'Tratamiento': 'Antipolilla',
      'Colores': 'Cálidos',
    },
    priceList: 150,
    priceOffer: 125,
    stock: 8,
    featured: false,
  },
  {
    id: 'PROD-10',
    name: 'Camino de Mesa (35×180)',
    category: 'CAT-02',
    description: 'Bordado andino en algodón, motivos tradicionales, lavable.',
    specs: {
      'Composición': '100% algodón',
      'Dimensiones': '35 cm × 180 cm',
      'Cuidado': 'Lavable a máquina',
    },
    priceList: 55,
    priceOffer: 45,
    stock: 22,
    featured: false,
  },
  {
    id: 'PROD-11',
    name: 'Morral Telar (40×35, cordón)',
    category: 'CAT-03',
    description: 'Morral grande tejido en telar tradicional con cierre de cordón.',
    specs: {
      'Dimensiones': '40 cm × 35 cm',
      'Forro': 'Reforzado',
      'Colores': 'Terracota, verde y azul',
    },
    priceList: 89,
    priceOffer: 75,
    stock: 14,
    featured: true,
  },
  {
    id: 'PROD-12',
    name: 'Riñonera Textil (20×12)',
    category: 'CAT-03',
    description: 'Riñonera pequeña tejida con cierre zipper y correa ajustable.',
    specs: {
      'Dimensiones': '20 cm × 12 cm',
      'Colores': 'Azul, beige y mostaza',
      'Diseño': 'Patrones tradicionales',
    },
    priceList: 39,
    priceOffer: 32.5,
    stock: 28,
    featured: false,
  },
];

export const STORE = {
  name: 'EcoAndes Textiles',
  slogan: 'Artesanía que conecta con la tierra',
  email: 'ventas@ecoandestextiles.com',
  phone: '+51 954 123 456',
  whatsapp: '51954123456',
};

export const SHIPPING = {
  freeFrom: 150,
  lima: 12,
  provincia: 18,
};

export const DEPARTAMENTOS = [
  'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca', 'Callao',
  'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín', 'La Libertad', 'Lambayeque',
  'Lima', 'Loreto', 'Madre de Dios', 'Moquegua', 'Pasco', 'Piura', 'Puno',
  'San Martín', 'Tacna', 'Tumbes', 'Ucayali',
];

export const getProduct = (id) => PRODUCTS.find((p) => p.id === id) || null;
export const getCategory = (id) => CATEGORIES.find((c) => c.id === id) || null;
export const productImg = (id, n) => `/img/${id}_foto${n}.jpg`;
export const discountPct = (p) => Math.round((1 - p.priceOffer / p.priceList) * 100);
export const formatPrice = (n) => `S/ ${n.toFixed(2)}`;

export function shippingCost(subtotal, departamento = null) {
  if (subtotal === 0) return 0;
  if (subtotal > SHIPPING.freeFrom) return 0;
  if (departamento === null) return SHIPPING.lima;
  return departamento === 'Lima' ? SHIPPING.lima : SHIPPING.provincia;
}
