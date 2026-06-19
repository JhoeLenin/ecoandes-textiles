import { useState } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { PRODUCTS, CATEGORIES } from '../../data/products';

const OFFERS = [
  { name:'Bienvenida EcoLana - 20% OFF', discountType:'percent', discountValue:20, budget:800, result:320, cumulative:false, startDate:'2026-06-01', endDate:'2026-07-31', active:true, productIds:['PROD-01','PROD-02','PROD-03','PROD-06','PROD-14','PROD-15'] },
  { name:'Envio Gratis en Bolsos', discountType:'fixed', discountValue:12, budget:500, result:180, cumulative:false, startDate:'2026-06-15', endDate:'2026-08-15', active:true, productIds:['PROD-08','PROD-09','PROD-10','PROD-11','PROD-12','PROD-13'] },
  { name:'Sets de Hogar - S/ 30 OFF', discountType:'fixed', discountValue:30, budget:600, result:150, cumulative:false, startDate:'2026-06-20', endDate:'2026-08-01', active:true, productIds:['PROD-19','PROD-21','PROD-22','PROD-23'] },
  { name:'Gorros y Bufandas - 25% OFF', discountType:'percent', discountValue:25, budget:400, result:100, cumulative:false, startDate:'2026-07-01', endDate:'2026-08-31', active:true, productIds:['PROD-16','PROD-17','PROD-18'] },
  { name:'Rebajas de Invierno - 30% OFF', discountType:'percent', discountValue:30, budget:1200, result:540, cumulative:false, startDate:'2026-06-01', endDate:'2026-06-30', active:false, productIds:['PROD-01','PROD-04','PROD-05','PROD-07'] },
  { name:'Combo Mamá y Bebé', discountType:'fixed', discountValue:25, budget:350, result:75, cumulative:false, startDate:'2026-05-01', endDate:'2026-05-15', active:false, productIds:['PROD-03','PROD-17','PROD-21'] },
  { name:'Black Friday EcoLana - 40% OFF', discountType:'percent', discountValue:40, budget:2000, result:1800, cumulative:false, startDate:'2025-11-25', endDate:'2025-11-30', active:false, productIds:['PROD-01','PROD-02','PROD-03','PROD-06','PROD-08','PROD-19'] },
  { name:'Cyber Lunes - 35% OFF Sweaters', discountType:'percent', discountValue:35, budget:1500, result:1100, cumulative:false, startDate:'2025-12-01', endDate:'2025-12-02', active:false, productIds:['PROD-01','PROD-02','PROD-04','PROD-05','PROD-06','PROD-07'] },
  { name:'Pack Viajero - Abrigos', discountType:'fixed', discountValue:20, budget:600, result:280, cumulative:false, startDate:'2026-03-01', endDate:'2026-03-31', active:false, productIds:['PROD-14','PROD-15','PROD-16','PROD-17','PROD-18'] },
  { name:'Sweater del Mes (julio)', discountType:'percent', discountValue:15, budget:400, result:60, cumulative:true, startDate:'2026-07-01', endDate:'2026-07-31', active:true, productIds:['PROD-01','PROD-02','PROD-03'] },
  { name:'Regalo San Valentin', discountType:'fixed', discountValue:15, budget:300, result:150, cumulative:false, startDate:'2026-02-10', endDate:'2026-02-14', active:false, productIds:['PROD-03','PROD-10','PROD-13','PROD-15'] },
  { name:'Outlet EcoLana - Hasta S/ 50 OFF', discountType:'fixed', discountValue:50, budget:1000, result:650, cumulative:false, startDate:'2026-01-15', endDate:'2026-02-15', active:false, productIds:['PROD-05','PROD-07','PROD-09','PROD-12'] },
  { name:'Descuento Primera Compra', discountType:'percent', discountValue:10, budget:200, result:40, cumulative:false, startDate:'2026-06-01', endDate:'2026-12-31', active:true, productIds:[] },
  { name:'Referido y Amigo - S/ 20 cada uno', discountType:'fixed', discountValue:20, budget:500, result:120, cumulative:true, startDate:'2026-06-01', endDate:'2026-12-31', active:true, productIds:[] },
  { name:'Envio Gratis Arequipa > S/ 150', discountType:'fixed', discountValue:15, budget:800, result:360, cumulative:false, startDate:'2026-06-01', endDate:'2026-12-31', active:true, productIds:[] },
  { name:'Feria Artesanal - 20% OFF Hogar', discountType:'percent', discountValue:20, budget:700, result:280, cumulative:false, startDate:'2026-05-20', endDate:'2026-05-25', active:false, productIds:['PROD-19','PROD-20','PROD-21','PROD-22','PROD-23','PROD-24','PROD-25'] },
  { name:'Cumpleanos EcoLana - Sorpresa', discountType:'percent', discountValue:50, budget:1000, result:500, cumulative:false, startDate:'2026-04-01', endDate:'2026-04-07', active:false, productIds:['PROD-01','PROD-08','PROD-15','PROD-19'] },
  { name:'Mini Descuentos - Gorros', discountType:'fixed', discountValue:10, budget:250, result:80, cumulative:false, startDate:'2026-08-01', endDate:'2026-08-31', active:true, productIds:['PROD-17','PROD-18'] },
  { name:'Liquidez Total - 45% OFF', discountType:'percent', discountValue:45, budget:3000, result:2700, cumulative:false, startDate:'2025-12-15', endDate:'2025-12-31', active:false, productIds:['PROD-04','PROD-05','PROD-07','PROD-09','PROD-12','PROD-13'] },
  { name:'Promo Verano - Bolsos al 25%', discountType:'percent', discountValue:25, budget:900, result:450, cumulative:false, startDate:'2026-01-10', endDate:'2026-02-28', active:false, productIds:['PROD-08','PROD-09','PROD-10','PROD-11','PROD-12','PROD-13'] },
];

const CLIENTES = [
  { name:'Minera Aruntani SAC', type:'prospecto', sector:'Empresas', tienda:'Cayma', contactName:'Juan Perez', email:'compras@aruntani.pe', phone:'951234567', status:'activo' },
  { name:'Comercial Los Andes EIRL', type:'regular', sector:'Publico general', tienda:'Cercado', contactName:'Maria Quispe', email:'ventas@losandes.pe', phone:'952345678', status:'activo' },
  { name:'Textiles del Sur SA', type:'proveedor', sector:'Moda', tienda:'Cerro Colorado', contactName:'Carlos Mamani', email:'info@textilsur.pe', phone:'953456789', status:'activo' },
  { name:'Hotel Casona Plaza', type:'regular', sector:'Hoteles y turismo', tienda:'Cercado', contactName:'Ana Flores', email:'reservas@casona.pe', phone:'954567890', status:'activo' },
  { name:'Distribuidora JLBR', type:'agente', sector:'Empresas', tienda:'José Luis Bustamante y Rivero', contactName:'Luis Choque', email:'dist@jlbr.pe', phone:'955678901', status:'activo' },
  { name:'Bordados Yanahuara', type:'regular', sector:'Moda', tienda:'Yanahuara', contactName:'Rosa Huaman', email:'bordados@yanahuara.pe', phone:'956789012', status:'inactivo' },
  { name:'Constructora Misti', type:'prospecto', sector:'Empresas', tienda:'Cayma', contactName:'Pedro Rios', email:'logistica@misti.pe', phone:'957890123', status:'activo' },
  { name:'Artesanias Yanahuara', type:'regular', sector:'Moda', tienda:'Yanahuara', contactName:'Elena Vargas', email:'arte@yanahuara.pe', phone:'958901234', status:'migrado' },
  { name:'Alojamiento Sunqar', type:'regular', sector:'Hoteles y turismo', tienda:'Cercado', contactName:'Sofia Mendoza', email:'ventas@sunqar.pe', phone:'961234567', status:'activo' },
  { name:'Delicias del Sur EIRL', type:'regular', sector:'Publico general', tienda:'Cayma', contactName:'Gonzalo Ramos', email:'pedido@delicias.pe', phone:'962345678', status:'activo' },
  { name:'Moda Urbana Arequipa', type:'regular', sector:'Moda', tienda:'Cercado', contactName:'Camila Trujillo', email:'compras@modaurbana.pe', phone:'963456789', status:'activo' },
  { name:'Hacienda La Estancia', type:'prospecto', sector:'Hoteles y turismo', tienda:'Yanahuara', contactName:'Roberto Huamani', email:'admin@estancia.pe', phone:'964567890', status:'activo' },
  { name:'Retail Plaza Real', type:'agente', sector:'Publico general', tienda:'Cercado', contactName:'Patricia Luna', email:'compras@plazareal.pe', phone:'965678901', status:'activo' },
  { name:'Artesanos del Colca', type:'proveedor', sector:'Moda', tienda:'Cayma', contactName:'Jorge Ticona', email:'info@colcaartesanos.pe', phone:'966789012', status:'activo' },
  { name:'Inversiones Volcan SAC', type:'prospecto', sector:'Empresas', tienda:'Cerro Colorado', contactName:'Martin Ccallata', email:'compras@volcan.pe', phone:'967890123', status:'activo' },
  { name:'Centro de Eventos Misti', type:'regular', sector:'Hoteles y turismo', tienda:'Cayma', contactName:'Valeria Quispe', email:'reservas@eventosmisti.pe', phone:'968901234', status:'activo' },
  { name:'Cafeteria Altura', type:'regular', sector:'Publico general', tienda:'Cercado', contactName:'Diego Soriano', email:'diseño@altura.pe', phone:'969012345', status:'activo' },
  { name:'Tienda Andes Express', type:'agente', sector:'Publico general', tienda:'José Luis Bustamante y Rivero', contactName:'Lucia Condori', email:'ventas@andexpress.pe', phone:'970123456', status:'activo' },
  { name:'Hotel Los Tambos', type:'regular', sector:'Hoteles y turismo', tienda:'Yanahuara', contactName:'Cesar Paredes', email:'reservas@lostambos.pe', phone:'971234567', status:'activo' },
  { name:'Moda Eco Store', type:'regular', sector:'Moda', tienda:'Cercado', contactName:'Andrea Quispe', email:'tienda@modaeco.pe', phone:'972345678', status:'activo' },
  { name:'Constructora Apu SAC', type:'prospecto', sector:'Empresas', tienda:'Cayma', contactName:'Alvaro Mamani', email:'obras@apu.pe', phone:'973456789', status:'activo' },
  { name:'Exportaciones Sur', type:'proveedor', sector:'Empresas', tienda:'Cerro Colorado', contactName:'Teresa Huanca', email:'comex@sur.pe', phone:'974567890', status:'activo' },
  { name:'Tienda Artesanal Kuntur', type:'regular', sector:'Moda', tienda:'Yanahuara', contactName:'Nelson Quispe', email:'ventas@kuntur.pe', phone:'975678901', status:'activo' },
  { name:'Papeleria Creativa', type:'regular', sector:'Publico general', tienda:'Cercado', contactName:'Fiorella Meza', email:'pedidos@papelcreativa.pe', phone:'976789012', status:'activo' },
  { name:'Hotel Valle del Fuego', type:'regular', sector:'Hoteles y turismo', tienda:'Cayma', contactName:'Hector Pinto', email:'admin@vallefuego.pe', phone:'977890123', status:'activo' },
  { name:'Boutique Elegance', type:'regular', sector:'Moda', tienda:'Cercado', contactName:'Gabriela Torres', email:'compras@elegance.pe', phone:'978901234', status:'activo' },
  { name:'Agricultura Organica SAC', type:'prospecto', sector:'Empresas', tienda:'José Luis Bustamante y Rivero', contactName:'Oscar Flores', email:'logistica@agroorg.pe', phone:'979012345', status:'activo' },
  { name:'Souvenirs Arequipa', type:'regular', sector:'Publico general', tienda:'Cercado', contactName:'Claudia Ramos', email:'ventas@souvenirsarequipa.pe', phone:'980123456', status:'activo' },
  { name:'Tienda Natural Health', type:'regular', sector:'Publico general', tienda:'Cayma', contactName:'Ricardo Apaza', email:'ventas@naturalhealth.pe', phone:'981234567', status:'activo' },
  { name:'Inmobiliaria Sol Naciente', type:'prospecto', sector:'Empresas', tienda:'Cerro Colorado', contactName:'Isabel Quispe', email:'admin@solnaciente.pe', phone:'982345678', status:'activo' },
  { name:'Restaurante La Casona', type:'regular', sector:'Hoteles y turismo', tienda:'Yanahuara', contactName:'Marco Vargas', email:'pedido@lacasona.pe', phone:'983456789', status:'activo' },
  { name:'Distribuidora El Condor', type:'agente', sector:'Empresas', tienda:'Cayma', contactName:'Paula Huanca', email:'ventas@elcondor.pe', phone:'984567890', status:'activo' },
  { name:'Tienda Virtual ModaMix', type:'regular', sector:'Moda', tienda:'Cercado', contactName:'Jessica Mamani', email:'info@modamix.pe', phone:'985678901', status:'activo' },
  { name:'Clinica San Pablo', type:'prospecto', sector:'Empresas', tienda:'Cercado', contactName:'Dr. Fernando Quispe', email:'compras@sanpablo.pe', phone:'986789012', status:'activo' },
  { name:'Libreria El Saber', type:'regular', sector:'Publico general', tienda:'Cercado', contactName:'Monica Condori', email:'pedidos@elsaber.pe', phone:'987890123', status:'activo' },
  { name:'Gimnasio Fuerza Andina', type:'regular', sector:'Publico general', tienda:'Cayma', contactName:'Alex Ticona', email:'admin@fuerzaandina.pe', phone:'988901234', status:'activo' },
  { name:'Tienda Organica Verde', type:'regular', sector:'Publico general', tienda:'Cerro Colorado', contactName:'Diana Huamani', email:'ventas@verdeorganico.pe', phone:'989012345', status:'activo' },
  { name:'Estudio Juridico Andes', type:'prospecto', sector:'Empresas', tienda:'Cercado', contactName:'Lic. Carlos Soto', email:'admin@andjuridico.pe', phone:'990123456', status:'activo' },
  { name:'Catering Gourmet Arequipa', type:'regular', sector:'Hoteles y turismo', tienda:'Yanahuara', contactName:'Sandra Paredes', email:'pedido@gourmet.pe', phone:'991234567', status:'activo' },
  { name:'Ferreteria Industrial', type:'regular', sector:'Publico general', tienda:'José Luis Bustamante y Rivero', contactName:'Victor Quispe', email:'ventas@ferrein.pe', phone:'992345678', status:'activo' },
];

const CAMPANAS = [
  { name:'Campaña Invierno B2B', channel:'email', targetSectors:['Empresas'], budget:1500, result:1820, startDate:'2026-06-01', endDate:'2026-06-30', status:'activa' },
  { name:'Feria Regional Arequipa', channel:'visita', targetSectors:['Publico general','Moda'], budget:3000, result:2400, startDate:'2026-04-10', endDate:'2026-04-20', status:'finalizada' },
  { name:'Promo Dia de la Madre', channel:'virtual', targetSectors:['Publico general'], budget:800, result:1100, startDate:'2026-05-01', endDate:'2026-05-12', status:'finalizada' },
  { name:'Captacion Hoteles', channel:'telefono', targetSectors:['Hoteles y turismo'], budget:1200, result:350, startDate:'2026-06-10', endDate:'2026-07-10', status:'activa' },
  { name:'Navidad EcoLana', channel:'email', targetSectors:['Publico general'], budget:2000, result:3200, startDate:'2025-12-01', endDate:'2025-12-25', status:'finalizada' },
  { name:'Año Nuevo - Descuentos', channel:'virtual', targetSectors:['Publico general','Moda'], budget:1500, result:2100, startDate:'2026-01-01', endDate:'2026-01-15', status:'finalizada' },
  { name:'Black Friday B2B', channel:'email', targetSectors:['Empresas'], budget:2500, result:4500, startDate:'2025-11-25', endDate:'2025-11-30', status:'finalizada' },
  { name:'Feria de Artesanias', channel:'visita', targetSectors:['Moda','Publico general'], budget:1800, result:1650, startDate:'2026-03-15', endDate:'2026-03-20', status:'finalizada' },
  { name:'Promo San Valentin', channel:'virtual', targetSectors:['Publico general'], budget:600, result:950, startDate:'2026-02-10', endDate:'2026-02-14', status:'finalizada' },
  { name:'Lanzamiento Abrigos', channel:'email', targetSectors:['Publico general','Hoteles y turismo'], budget:900, result:720, startDate:'2026-03-01', endDate:'2026-03-31', status:'finalizada' },
  { name:'Outlet Invierno 2026', channel:'virtual', targetSectors:['Publico general'], budget:1200, result:1800, startDate:'2026-06-15', endDate:'2026-07-15', status:'activa' },
  { name:'Captacion Restaurantes', channel:'telefono', targetSectors:['Hoteles y turismo'], budget:800, result:200, startDate:'2026-07-01', endDate:'2026-07-31', status:'activa' },
  { name:'Promo Dia del Padre', channel:'email', targetSectors:['Publico general'], budget:500, result:680, startDate:'2026-06-15', endDate:'2026-06-21', status:'finalizada' },
  { name:'Campaña Verano Bolsos', channel:'visita', targetSectors:['Moda'], budget:1000, result:1400, startDate:'2026-01-20', endDate:'2026-02-28', status:'finalizada' },
  { name:'Weekend Sale - Sweaters', channel:'virtual', targetSectors:['Publico general'], budget:700, result:950, startDate:'2026-05-10', endDate:'2026-05-12', status:'finalizada' },
  { name:'Capacitacion Artesanos', channel:'visita', targetSectors:['Moda'], budget:400, result:0, startDate:'2026-08-01', endDate:'2026-08-05', status:'activa' },
  { name:'Reactivacion Clientes Dormidos', channel:'telefono', targetSectors:['Publico general'], budget:300, result:150, startDate:'2026-07-15', endDate:'2026-08-15', status:'activa' },
  { name:'Cupon Bienvenida APP', channel:'virtual', targetSectors:['Publico general'], budget:600, result:420, startDate:'2026-06-01', endDate:'2026-12-31', status:'activa' },
  { name:'EcoLana en Instagram', channel:'virtual', targetSectors:['Publico general','Moda'], budget:500, result:380, startDate:'2026-06-01', endDate:'2026-06-30', status:'activa' },
  { name:'Descuento Escolar Abrigos', channel:'email', targetSectors:['Publico general'], budget:700, result:520, startDate:'2026-03-10', endDate:'2026-03-25', status:'finalizada' },
];

const USERS = [
  { uid:'admin001', name:'Admin EcoLana', email:'admin@ecoandes.com', role:'admin' },
  { uid:'admin002', name:'Sub-Admin Arequipa', email:'subadmin@ecoandes.com', role:'admin' },
  { uid:'user001', name:'Maria Quispe', email:'maria.quispe@gmail.com', role:'cliente' },
  { uid:'user002', name:'Carlos Mamani', email:'carlos.mamani@gmail.com', role:'cliente' },
  { uid:'user003', name:'Ana Flores', email:'ana.flores@gmail.com', role:'cliente' },
  { uid:'user004', name:'Luis Choque', email:'luis.choque@gmail.com', role:'cliente' },
  { uid:'user005', name:'Elena Vargas', email:'elena.vargas@gmail.com', role:'cliente' },
  { uid:'user006', name:'Sofia Mendoza', email:'sofia.mendoza@gmail.com', role:'cliente' },
  { uid:'user007', name:'Gonzalo Ramos', email:'gonzalo.ramos@gmail.com', role:'cliente' },
  { uid:'user008', name:'Camila Trujillo', email:'camila.trujillo@gmail.com', role:'cliente' },
  { uid:'user009', name:'Roberto Huamani', email:'roberto.huamani@gmail.com', role:'cliente' },
  { uid:'user010', name:'Patricia Luna', email:'patricia.luna@gmail.com', role:'cliente' },
  { uid:'user011', name:'Jorge Ticona', email:'jorge.ticona@gmail.com', role:'cliente' },
  { uid:'user012', name:'Valeria Quispe', email:'valeria.quispe@gmail.com', role:'cliente' },
  { uid:'user013', name:'Diego Soriano', email:'diego.soriano@gmail.com', role:'cliente' },
  { uid:'user014', name:'Lucia Condori', email:'lucia.condori@gmail.com', role:'cliente' },
  { uid:'user015', name:'Cesar Paredes', email:'cesar.paredes@gmail.com', role:'cliente' },
  { uid:'user016', name:'Andrea Quispe', email:'andrea.quispe@gmail.com', role:'cliente' },
  { uid:'user017', name:'Alvaro Mamani', email:'alvaro.mamani@gmail.com', role:'cliente' },
  { uid:'user018', name:'Teresa Huanca', email:'teresa.huanca@gmail.com', role:'cliente' },
  { uid:'user019', name:'Nelson Quispe', email:'nelson.quispe@gmail.com', role:'cliente' },
  { uid:'user020', name:'Fiorella Meza', email:'fiorella.meza@gmail.com', role:'cliente' },
  { uid:'user021', name:'Hector Pinto', email:'hector.pinto@gmail.com', role:'cliente' },
  { uid:'user022', name:'Gabriela Torres', email:'gabriela.torres@gmail.com', role:'cliente' },
  { uid:'user023', name:'Oscar Flores', email:'oscar.flores@gmail.com', role:'cliente' },
  { uid:'user024', name:'Claudia Ramos', email:'claudia.ramos@gmail.com', role:'cliente' },
  { uid:'user025', name:'Ricardo Apaza', email:'ricardo.apaza@gmail.com', role:'cliente' },
  { uid:'user026', name:'Isabel Quispe', email:'isabel.quispe@gmail.com', role:'cliente' },
  { uid:'user027', name:'Marco Vargas', email:'marco.vargas@gmail.com', role:'cliente' },
  { uid:'user028', name:'Paula Huanca', email:'paula.huanca@gmail.com', role:'cliente' },
];

const ORDERS = [
  { userId:'user001', customer:{ name:'Maria Quispe', email:'maria.quispe@gmail.com', phone:'951234567', address:'Av. Dolores 123', distrito:'Cercado', departamento:'Arequipa' }, items:[ { id:'PROD-01', name:'Sweater Cuello Alto Alpaca (verde oliva)', price:99, qty:2, img:'/img/5.jpg' }, { id:'PROD-14', name:'Bufanda Alpaca Tierra (franja marron)', price:45, qty:1, img:'/img/1.jpg' } ], paymentMethod:'culqi', subtotal:243, shipping:12, total:255, status:'entregado' },
  { userId:'user002', customer:{ name:'Carlos Mamani', email:'carlos.mamani@gmail.com', phone:'952345678', address:'Calle Mercaderes 456', distrito:'Yanahuara', departamento:'Arequipa' }, items:[ { id:'PROD-08', name:'Mochila Andina Cuero y Tejido', price:159, qty:1, img:'/img/16.jpg' }, { id:'PROD-11', name:'Bandolera Wayuu Multicolor', price:75, qty:1, img:'/img/15.jpg' } ], paymentMethod:'transferencia', subtotal:234, shipping:0, total:234, status:'enviado' },
  { userId:'user003', customer:{ name:'Ana Flores', email:'ana.flores@gmail.com', phone:'953456789', address:'Jr. San Martin 789', distrito:'Cayma', departamento:'Arequipa' }, items:[ { id:'PROD-19', name:'Manta Lana Amarillo y Crema', price:159, qty:1, img:'/img/9.jpg' }, { id:'PROD-21', name:'Cojin Terracota Rayas Tejidas', price:55, qty:2, img:'/img/11.jpg' } ], paymentMethod:'culqi', subtotal:269, shipping:12, total:281, status:'procesando' },
  { userId:'user004', customer:{ name:'Luis Choque', email:'luis.choque@gmail.com', phone:'954567890', address:'Av. Ejercito 321', distrito:'Cercado', departamento:'Arequipa' }, items:[ { id:'PROD-06', name:'Sweater Navy Clasico (varon)', price:89, qty:1, img:'/img/e1.webp' }, { id:'PROD-17', name:'Gorro Beige Clasico (cable knit)', price:29, qty:2, img:'/img/7.jpg' }, { id:'PROD-16', name:'Cuello Tejido Verde Bosque', price:39, qty:1, img:'/img/6.jpg' } ], paymentMethod:'contraentrega', subtotal:186, shipping:12, total:198, status:'pendiente' },
  { userId:'user005', customer:{ name:'Elena Vargas', email:'elena.vargas@gmail.com', phone:'956789012', address:'Calle San Francisco 654', distrito:'Yanahuara', departamento:'Arequipa' }, items:[ { id:'PROD-15', name:'Chal Mohair Multicolor', price:115, qty:1, img:'/img/2.jpg' }, { id:'PROD-03', name:'Sweater Diamond Cream (diamantes)', price:119, qty:1, img:'/img/a3.webp' } ], paymentMethod:'culqi', subtotal:234, shipping:0, total:234, status:'entregado' },
  { userId:'user001', customer:{ name:'Maria Quispe', email:'maria.quispe@gmail.com', phone:'951234567', address:'Av. Dolores 123', distrito:'Cercado', departamento:'Arequipa' }, items:[ { id:'PROD-10', name:'Rinonera Tejida Artesanal', price:49, qty:3, img:'/img/14.jpg' }, { id:'PROD-13', name:'Clutch Tejido Rosa y Gris', price:59, qty:1, img:'/img/19.jpg' } ], paymentMethod:'transferencia', subtotal:206, shipping:12, total:218, status:'entregado' },
  { userId:'user003', customer:{ name:'Ana Flores', email:'ana.flores@gmail.com', phone:'953456789', address:'Jr. San Martin 789', distrito:'Cayma', departamento:'Arequipa' }, items:[ { id:'PROD-23', name:'Alfombra Redonda Azul y Crema', price:189, qty:1, img:'/img/20.jpg' } ], paymentMethod:'culqi', subtotal:189, shipping:12, total:201, status:'cancelado' },
  { userId:'user002', customer:{ name:'Carlos Mamani', email:'carlos.mamani@gmail.com', phone:'952345678', address:'Calle Mercaderes 456', distrito:'Yanahuara', departamento:'Arequipa' }, items:[ { id:'PROD-22', name:'Set Cojines Decorativos (3 piezas)', price:119, qty:1, img:'/img/12.jpg' }, { id:'PROD-24', name:'Camino de Mesa Macrame Crema', price:65, qty:2, img:'/img/21.jpg' } ], paymentMethod:'contraentrega', subtotal:249, shipping:12, total:261, status:'enviado' },
  { userId:'user006', customer:{ name:'Sofia Mendoza', email:'sofia.mendoza@gmail.com', phone:'961234567', address:'Av. La Marina 201', distrito:'Cercado', departamento:'Arequipa' }, items:[ { id:'PROD-02', name:'Sweater Cuello Alto Azul Rey', price:109, qty:2, img:'/img/4.jpg' } ], paymentMethod:'culqi', subtotal:218, shipping:12, total:230, status:'entregado' },
  { userId:'user007', customer:{ name:'Gonzalo Ramos', email:'gonzalo.ramos@gmail.com', phone:'962345678', address:'Calle San Juan de Dios 333', distrito:'Cayma', departamento:'Arequipa' }, items:[ { id:'PROD-09', name:'Morral Hemp Himalaya (lino y canamo)', price:119, qty:1, img:'/img/17.jpg' }, { id:'PROD-12', name:'Morral Tejido Llama (crochet)', price:65, qty:2, img:'/img/cc8.jpg' } ], paymentMethod:'transferencia', subtotal:249, shipping:0, total:249, status:'entregado' },
  { userId:'user008', customer:{ name:'Camila Trujillo', email:'camila.trujillo@gmail.com', phone:'963456789', address:'Jr. Tacna 567', distrito:'Cercado', departamento:'Arequipa' }, items:[ { id:'PROD-04', name:'Sweater a Rayas Multicolor', price:95, qty:1, img:'/img/b1.webp' }, { id:'PROD-18', name:'Gorro y Bufanda Set Marron', price:65, qty:1, img:'/img/8.jpg' } ], paymentMethod:'culqi', subtotal:160, shipping:12, total:172, status:'procesando' },
  { userId:'user009', customer:{ name:'Roberto Huamani', email:'roberto.huamani@gmail.com', phone:'964567890', address:'Calle Mercaderes 890', distrito:'Yanahuara', departamento:'Arequipa' }, items:[ { id:'PROD-20', name:'Manta Plaid Azul y Rojo', price:175, qty:1, img:'/img/10.jpg' }, { id:'PROD-25', name:'Camino de Mesa Chevron Negro y Beige', price:69, qty:1, img:'/img/22.jpg' } ], paymentMethod:'contraentrega', subtotal:244, shipping:12, total:256, status:'enviado' },
  { userId:'user010', customer:{ name:'Patricia Luna', email:'patricia.luna@gmail.com', phone:'965678901', address:'Av. Ejercito 456', distrito:'Cercado', departamento:'Arequipa' }, items:[ { id:'PROD-05', name:'Sweater Gris Acanalado', price:79, qty:3, img:'/img/cc1.webp' } ], paymentMethod:'culqi', subtotal:237, shipping:12, total:249, status:'entregado' },
  { userId:'user011', customer:{ name:'Jorge Ticona', email:'jorge.ticona@gmail.com', phone:'966789012', address:'Calle San Martin 111', distrito:'Cayma', departamento:'Arequipa' }, items:[ { id:'PROD-07', name:'Sweater Rojo y Gris Colorblock', price:89, qty:1, img:'/img/g1.webp' }, { id:'PROD-14', name:'Bufanda Alpaca Tierra (franja marron)', price:45, qty:2, img:'/img/1.jpg' } ], paymentMethod:'transferencia', subtotal:179, shipping:12, total:191, status:'pendiente' },
  { userId:'user012', customer:{ name:'Valeria Quispe', email:'valeria.quispe@gmail.com', phone:'968901234', address:'Calle Misti 222', distrito:'Cercado', departamento:'Arequipa' }, items:[ { id:'PROD-15', name:'Chal Mohair Multicolor', price:115, qty:1, img:'/img/2.jpg' }, { id:'PROD-17', name:'Gorro Beige Clasico (cable knit)', price:29, qty:2, img:'/img/7.jpg' }, { id:'PROD-16', name:'Cuello Tejido Verde Bosque', price:39, qty:1, img:'/img/6.jpg' } ], paymentMethod:'culqi', subtotal:212, shipping:0, total:212, status:'entregado' },
  { userId:'user013', customer:{ name:'Diego Soriano', email:'diego.soriano@gmail.com', phone:'969012345', address:'Av. Dolores 777', distrito:'Yanahuara', departamento:'Arequipa' }, items:[ { id:'PROD-21', name:'Cojin Terracota Rayas Tejidas', price:55, qty:4, img:'/img/11.jpg' } ], paymentMethod:'contraentrega', subtotal:220, shipping:12, total:232, status:'cancelado' },
  { userId:'user014', customer:{ name:'Lucia Condori', email:'lucia.condori@gmail.com', phone:'970123456', address:'Calle San Francisco 888', distrito:'Cercado', departamento:'Arequipa' }, items:[ { id:'PROD-11', name:'Bandolera Wayuu Multicolor', price:75, qty:2, img:'/img/15.jpg' }, { id:'PROD-10', name:'Rinonera Tejida Artesanal', price:49, qty:1, img:'/img/14.jpg' } ], paymentMethod:'culqi', subtotal:199, shipping:12, total:211, status:'enviado' },
  { userId:'user015', customer:{ name:'Cesar Paredes', email:'cesar.paredes@gmail.com', phone:'971234567', address:'Jr. Tacna 999', distrito:'Cayma', departamento:'Arequipa' }, items:[ { id:'PROD-08', name:'Mochila Andina Cuero y Tejido', price:159, qty:1, img:'/img/16.jpg' }, { id:'PROD-13', name:'Clutch Tejido Rosa y Gris', price:59, qty:2, img:'/img/19.jpg' } ], paymentMethod:'transferencia', subtotal:277, shipping:0, total:277, status:'procesando' },
  { userId:'user016', customer:{ name:'Andrea Quispe', email:'andrea.quispe@gmail.com', phone:'972345678', address:'Av. La Marina 333', distrito:'Cercado', departamento:'Arequipa' }, items:[ { id:'PROD-19', name:'Manta Lana Amarillo y Crema', price:159, qty:1, img:'/img/9.jpg' }, { id:'PROD-22', name:'Set Cojines Decorativos (3 piezas)', price:119, qty:1, img:'/img/12.jpg' } ], paymentMethod:'culqi', subtotal:278, shipping:12, total:290, status:'entregado' },
  { userId:'user017', customer:{ name:'Alvaro Mamani', email:'alvaro.mamani@gmail.com', phone:'973456789', address:'Calle Mercaderes 444', distrito:'Yanahuara', departamento:'Arequipa' }, items:[ { id:'PROD-06', name:'Sweater Navy Clasico (varon)', price:89, qty:2, img:'/img/e1.webp' }, { id:'PROD-05', name:'Sweater Gris Acanalado', price:79, qty:1, img:'/img/cc1.webp' } ], paymentMethod:'contraentrega', subtotal:257, shipping:12, total:269, status:'pendiente' },
  { userId:'user018', customer:{ name:'Teresa Huanca', email:'teresa.huanca@gmail.com', phone:'974567890', address:'Calle San Juan de Dios 555', distrito:'Cayma', departamento:'Arequipa' }, items:[ { id:'PROD-23', name:'Alfombra Redonda Azul y Crema', price:189, qty:1, img:'/img/20.jpg' }, { id:'PROD-24', name:'Camino de Mesa Macrame Crema', price:65, qty:1, img:'/img/21.jpg' } ], paymentMethod:'culqi', subtotal:254, shipping:12, total:266, status:'enviado' },
  { userId:'user019', customer:{ name:'Nelson Quispe', email:'nelson.quispe@gmail.com', phone:'975678901', address:'Jr. San Martin 666', distrito:'Cercado', departamento:'Arequipa' }, items:[ { id:'PROD-01', name:'Sweater Cuello Alto Alpaca (verde oliva)', price:99, qty:1, img:'/img/5.jpg' }, { id:'PROD-03', name:'Sweater Diamond Cream (diamantes)', price:119, qty:1, img:'/img/a3.webp' }, { id:'PROD-17', name:'Gorro Beige Clasico (cable knit)', price:29, qty:1, img:'/img/7.jpg' } ], paymentMethod:'transferencia', subtotal:247, shipping:0, total:247, status:'entregado' },
  { userId:'user020', customer:{ name:'Fiorella Meza', email:'fiorella.meza@gmail.com', phone:'976789012', address:'Av. Ejercito 777', distrito:'Cercado', departamento:'Arequipa' }, items:[ { id:'PROD-02', name:'Sweater Cuello Alto Azul Rey', price:109, qty:1, img:'/img/4.jpg' }, { id:'PROD-15', name:'Chal Mohair Multicolor', price:115, qty:1, img:'/img/2.jpg' } ], paymentMethod:'culqi', subtotal:224, shipping:12, total:236, status:'procesando' },
  { userId:'user021', customer:{ name:'Hector Pinto', email:'hector.pinto@gmail.com', phone:'977890123', address:'Calle Misti 888', distrito:'Yanahuara', departamento:'Arequipa' }, items:[ { id:'PROD-09', name:'Morral Hemp Himalaya (lino y canamo)', price:119, qty:1, img:'/img/17.jpg' } ], paymentMethod:'contraentrega', subtotal:119, shipping:12, total:131, status:'cancelado' },
  { userId:'user022', customer:{ name:'Gabriela Torres', email:'gabriela.torres@gmail.com', phone:'978901234', address:'Calle San Francisco 999', distrito:'Cercado', departamento:'Arequipa' }, items:[ { id:'PROD-20', name:'Manta Plaid Azul y Rojo', price:175, qty:1, img:'/img/10.jpg' }, { id:'PROD-21', name:'Cojin Terracota Rayas Tejidas', price:55, qty:2, img:'/img/11.jpg' } ], paymentMethod:'culqi', subtotal:285, shipping:12, total:297, status:'entregado' },
  { userId:'user023', customer:{ name:'Oscar Flores', email:'oscar.flores@gmail.com', phone:'979012345', address:'Av. Dolores 000', distrito:'Cayma', departamento:'Arequipa' }, items:[ { id:'PROD-04', name:'Sweater a Rayas Multicolor', price:95, qty:1, img:'/img/b1.webp' }, { id:'PROD-07', name:'Sweater Rojo y Gris Colorblock', price:89, qty:1, img:'/img/g1.webp' }, { id:'PROD-18', name:'Gorro y Bufanda Set Marron', price:65, qty:1, img:'/img/8.jpg' } ], paymentMethod:'transferencia', subtotal:249, shipping:0, total:249, status:'enviado' },
  { userId:'user024', customer:{ name:'Claudia Ramos', email:'claudia.ramos@gmail.com', phone:'980123456', address:'Calle Mercaderes 111', distrito:'Cercado', departamento:'Arequipa' }, items:[ { id:'PROD-12', name:'Morral Tejido Llama (crochet)', price:65, qty:2, img:'/img/cc8.jpg' }, { id:'PROD-10', name:'Rinonera Tejida Artesanal', price:49, qty:2, img:'/img/14.jpg' } ], paymentMethod:'culqi', subtotal:228, shipping:12, total:240, status:'pendiente' },
  { userId:'user025', customer:{ name:'Ricardo Apaza', email:'ricardo.apaza@gmail.com', phone:'981234567', address:'Calle San Juan de Dios 222', distrito:'Yanahuara', departamento:'Arequipa' }, items:[ { id:'PROD-25', name:'Camino de Mesa Chevron Negro y Beige', price:69, qty:2, img:'/img/22.jpg' }, { id:'PROD-19', name:'Manta Lana Amarillo y Crema', price:159, qty:1, img:'/img/9.jpg' } ], paymentMethod:'contraentrega', subtotal:297, shipping:12, total:309, status:'entregado' },
  { userId:'user026', customer:{ name:'Isabel Quispe', email:'isabel.quispe@gmail.com', phone:'982345678', address:'Jr. Tacna 333', distrito:'Cercado', departamento:'Arequipa' }, items:[ { id:'PROD-08', name:'Mochila Andina Cuero y Tejido', price:159, qty:1, img:'/img/16.jpg' }, { id:'PROD-11', name:'Bandolera Wayuu Multicolor', price:75, qty:1, img:'/img/15.jpg' }, { id:'PROD-13', name:'Clutch Tejido Rosa y Gris', price:59, qty:1, img:'/img/19.jpg' } ], paymentMethod:'culqi', subtotal:293, shipping:0, total:293, status:'procesando' },
  { userId:'user027', customer:{ name:'Marco Vargas', email:'marco.vargas@gmail.com', phone:'983456789', address:'Av. La Marina 444', distrito:'Cayma', departamento:'Arequipa' }, items:[ { id:'PROD-16', name:'Cuello Tejido Verde Bosque', price:39, qty:3, img:'/img/6.jpg' } ], paymentMethod:'transferencia', subtotal:117, shipping:12, total:129, status:'entregado' },
  { userId:'user028', customer:{ name:'Paula Huanca', email:'paula.huanca@gmail.com', phone:'984567890', address:'Calle San Martin 777', distrito:'Cercado', departamento:'Arequipa' }, items:[ { id:'PROD-22', name:'Set Cojines Decorativos (3 piezas)', price:119, qty:1, img:'/img/12.jpg' }, { id:'PROD-23', name:'Alfombra Redonda Azul y Crema', price:189, qty:1, img:'/img/20.jpg' } ], paymentMethod:'culqi', subtotal:308, shipping:12, total:320, status:'enviado' },
  { userId:'user006', customer:{ name:'Sofia Mendoza', email:'sofia.mendoza@gmail.com', phone:'961234567', address:'Av. La Marina 201', distrito:'Cercado', departamento:'Arequipa' }, items:[ { id:'PROD-03', name:'Sweater Diamond Cream (diamantes)', price:119, qty:1, img:'/img/a3.webp' }, { id:'PROD-14', name:'Bufanda Alpaca Tierra (franja marron)', price:45, qty:2, img:'/img/1.jpg' } ], paymentMethod:'contraentrega', subtotal:209, shipping:12, total:221, status:'entregado' },
  { userId:'user007', customer:{ name:'Gonzalo Ramos', email:'gonzalo.ramos@gmail.com', phone:'962345678', address:'Calle San Juan de Dios 333', distrito:'Cayma', departamento:'Arequipa' }, items:[ { id:'PROD-05', name:'Sweater Gris Acanalado', price:79, qty:2, img:'/img/cc1.webp' }, { id:'PROD-18', name:'Gorro y Bufanda Set Marron', price:65, qty:1, img:'/img/8.jpg' } ], paymentMethod:'culqi', subtotal:223, shipping:12, total:235, status:'entregado' },
  { userId:'user008', customer:{ name:'Camila Trujillo', email:'camila.trujillo@gmail.com', phone:'963456789', address:'Jr. Tacna 567', distrito:'Cercado', departamento:'Arequipa' }, items:[ { id:'PROD-24', name:'Camino de Mesa Macrame Crema', price:65, qty:2, img:'/img/21.jpg' } ], paymentMethod:'transferencia', subtotal:130, shipping:12, total:142, status:'enviado' },
  { userId:'user009', customer:{ name:'Roberto Huamani', email:'roberto.huamani@gmail.com', phone:'964567890', address:'Calle Mercaderes 890', distrito:'Yanahuara', departamento:'Arequipa' }, items:[ { id:'PROD-01', name:'Sweater Cuello Alto Alpaca (verde oliva)', price:99, qty:1, img:'/img/5.jpg' }, { id:'PROD-02', name:'Sweater Cuello Alto Azul Rey', price:109, qty:1, img:'/img/4.jpg' }, { id:'PROD-06', name:'Sweater Navy Clasico (varon)', price:89, qty:1, img:'/img/e1.webp' } ], paymentMethod:'culqi', subtotal:297, shipping:0, total:297, status:'cancelado' },
  { userId:'user010', customer:{ name:'Patricia Luna', email:'patricia.luna@gmail.com', phone:'965678901', address:'Av. Ejercito 456', distrito:'Cercado', departamento:'Arequipa' }, items:[ { id:'PROD-09', name:'Morral Hemp Himalaya (lino y canamo)', price:119, qty:1, img:'/img/17.jpg' }, { id:'PROD-12', name:'Morral Tejido Llama (crochet)', price:65, qty:1, img:'/img/cc8.jpg' } ], paymentMethod:'contraentrega', subtotal:184, shipping:12, total:196, status:'pendiente' },
];

const NEWSLETTER = [
  { email:'maria.quispe@gmail.com' }, { email:'carlos.mamani@gmail.com' }, { email:'ana.flores@gmail.com' },
  { email:'luis.choque@gmail.com' }, { email:'elena.vargas@gmail.com' }, { email:'pedro.rios@gmail.com' },
  { email:'sofia.mendoza@gmail.com' }, { email:'gonzalo.ramos@gmail.com' }, { email:'camila.trujillo@gmail.com' },
  { email:'roberto.huamani@gmail.com' }, { email:'patricia.luna@gmail.com' }, { email:'jorge.ticona@gmail.com' },
  { email:'valeria.quispe@gmail.com' }, { email:'diego.soriano@gmail.com' }, { email:'lucia.condori@gmail.com' },
  { email:'cesar.paredes@gmail.com' }, { email:'andrea.quispe@gmail.com' }, { email:'alvaro.mamani@gmail.com' },
  { email:'teresa.huanca@gmail.com' }, { email:'nelson.quispe@gmail.com' }, { email:'fiorella.meza@gmail.com' },
  { email:'hector.pinto@gmail.com' }, { email:'gabriela.torres@gmail.com' }, { email:'oscar.flores@gmail.com' },
  { email:'claudia.ramos@gmail.com' }, { email:'ricardo.apaza@gmail.com' }, { email:'isabel.quispe@gmail.com' },
  { email:'marco.vargas@gmail.com' }, { email:'paula.huanca@gmail.com' }, { email:'info@ecoandes.com' },
];

function buildHistory(order, finalStatus) {
  const end = order.indexOf(finalStatus);
  const steps = end >= 0 ? order.slice(0, end + 1) : [finalStatus];
  return steps.map((status, i) => ({
    status,
    date: new Date(Date.now() - (steps.length - i) * 86400000).toISOString(),
    note: i === 0 ? 'Registrado' : `Pasó a ${status}`,
  }));
}

const ORDER_RECLAMO = ['abierto', 'en_proceso', 'resuelto'];
const ORDER_SUGERENCIA = ['nueva', 'revisada', 'aplicada'];

const RECLAMOS_DATA = [
  { clienteIdx:3, asunto:'Entrega tardia', detalle:'El pedido llego 5 dias despues de lo acordado.', status:'resuelto', respuesta:'Se reprogramo envio y se aplico descuento del 10%.' },
  { clienteIdx:1, asunto:'Producto defectuoso', detalle:'Dos chompas llegaron con costuras abiertas.', status:'en_proceso', respuesta:'' },
  { clienteIdx:0, asunto:'Factura incorrecta', detalle:'La factura no coincide con el monto del pedido.', status:'abierto', respuesta:'' },
  { clienteIdx:4, asunto:'Faltante en pedido', detalle:'Faltaron 3 unidades del lote de bufandas.', status:'abierto', respuesta:'' },
  { clienteIdx:2, asunto:'Demora en respuesta', detalle:'No respondieron la cotizacion en 1 semana.', status:'resuelto', respuesta:'Se asigno un ejecutivo de cuenta dedicado.' },
  { clienteIdx:5, asunto:'Color diferente al catalogo', detalle:'El sweater recibido es de un tono distinto al mostrado en la foto.', status:'resuelto', respuesta:'Se enviaron fotos reales y se ofrecio cambio.' },
  { clienteIdx:8, asunto:'Talla incorrecta', detalle:'Pedí talla M y recibí talla S.', status:'en_proceso', respuesta:'' },
  { clienteIdx:9, asunto:'Producto no llego', detalle:'El pedido no fue entregado en la fecha acordada.', status:'abierto', respuesta:'' },
  { clienteIdx:10, asunto:'Costo de envio excesivo', detalle:'Cobraron S/ 25 por envio local, el doble de lo cotizado.', status:'resuelto', respuesta:'Se reembolsó la diferencia.' },
  { clienteIdx:11, asunto:'Materiales de baja calidad', detalle:'La manta recibida tiene hilos sueltos y textura áspera.', status:'en_proceso', respuesta:'' },
  { clienteIdx:12, asunto:'Pedido duplicado', detalle:'Recibí dos pedidos iguales y me cobraron el doble.', status:'abierto', respuesta:'' },
  { clienteIdx:13, asunto:'Sin stock pero cobraron', detalle:'Pagué por 5 sweaters pero solo enviaron 2.', status:'resuelto', respuesta:'Se reembolsó la diferencia y se dio cupón de S/ 30.' },
  { clienteIdx:14, asunto:'Retraso en produccion', detalle:'El pedido especial lleva 3 semanas sin confirmación.', status:'en_proceso', respuesta:'' },
  { clienteIdx:15, asunto:'Daño en transporte', detalle:'La alfombra llegó con una mancha grande.', status:'abierto', respuesta:'' },
  { clienteIdx:16, asunto:'Error en dirección', detalle:'El pedido fue enviado a una dirección antigua.', status:'resuelto', respuesta:'Se reenvió al domicilio correcto sin costo.' },
  { clienteIdx:17, asunto:'Producto no disponible', detalle:'Pedí el morral y me dicen que no existe en stock.', status:'abierto', respuesta:'' },
  { clienteIdx:18, asunto:'Calidad inconsistente', detalle:'Las dos bufandas del mismo lote son de textura diferente.', status:'en_proceso', respuesta:'' },
  { clienteIdx:19, asunto:'Descuento no aplicado', detalle:'No me aplicaron el cupón de bienvenida que tenía.', status:'resuelto', respuesta:'Se aplicó el descuento manualmente.' },
  { clienteIdx:20, asunto:'Reclamo por retraso', detalle:'El pedido de hoteles llegó 10 días después.', status:'abierto', respuesta:'' },
  { clienteIdx:21, asunto:'Empaque dañado', detalle:'La caja llegó aplastada, pero el producto ilesa.', status:'resuelto', respuesta:'Se mejoró el embalaje para futuros envíos.' },
  { clienteIdx:22, asunto:'Facturación duplicada', detalle:'Me facturaron dos veces el mismo pedido.', status:'en_proceso', respuesta:'' },
  { clienteIdx:23, asunto:'Tiempo de respuesta largo', detalle:'Esperé 3 días para una cotización simple.', status:'resuelto', respuesta:'Se implementó respuesta en 24h.' },
  { clienteIdx:24, asunto:'Producto diferente al pedido', detalle:'Recibí un gorro beige en vez del verde solicitado.', status:'abierto', respuesta:'' },
  { clienteIdx:25, asunto:'No aceptan devolución', detalle:'Quiero devolver un producto sin usar y no me dan solución.', status:'en_proceso', respuesta:'' },
];

const SUGERENCIAS_DATA = [
  { clienteIdx:1, categoria:'producto', texto:'Ampliar la gama de colores en las chompas de alpaca.', status:'nueva' },
  { clienteIdx:3, categoria:'servicio', texto:'Atencion mas rapida en el canal de WhatsApp.', status:'revisada' },
  { clienteIdx:5, categoria:'entrega', texto:'Habilitar entregas los dias sabado.', status:'aplicada' },
  { clienteIdx:6, categoria:'precio', texto:'Ofrecer descuentos por compras de gran volumen.', status:'nueva' },
  { clienteIdx:7, categoria:'otro', texto:'Publicar un catalogo digital descargable en PDF.', status:'revisada' },
  { clienteIdx:8, categoria:'producto', texto:'Crear linea de ropa para niños con los mismos tejidos.', status:'nueva' },
  { clienteIdx:9, categoria:'servicio', texto:'Implementar chat en vivo en la pagina web.', status:'nueva' },
  { clienteIdx:10, categoria:'precio', texto:'Ofrecer packs combinados con descuento adicional.', status:'revisada' },
  { clienteIdx:11, categoria:'entrega', texto:'Enviar fotos del producto antes de despachar.', status:'aplicada' },
  { clienteIdx:12, categoria:'producto', texto:'Agregar tallas plus size en los sweaters.', status:'nueva' },
  { clienteIdx:13, categoria:'servicio', texto:'Crear programa de fidelidad con puntos.', status:'nueva' },
  { clienteIdx:14, categoria:'precio', texto:'Precios mas competitivos para pedidos al por mayor.', status:'revisada' },
  { clienteIdx:15, categoria:'entrega', texto:'Opcion de entrega el mismo dia en Arequipa.', status:'nueva' },
  { clienteIdx:16, categoria:'otro', texto:'Tener redes sociales mas activas con contenido.', status:'aplicada' },
  { clienteIdx:17, categoria:'producto', texto:'Mochilas con compartimento para laptop.', status:'nueva' },
  { clienteIdx:18, categoria:'servicio', texto:'Atencion personalizada por videoconsulta.', status:'nueva' },
  { clienteIdx:19, categoria:'precio', texto:'Descuento por compra de 3 o mas productos.', status:'aplicada' },
  { clienteIdx:20, categoria:'entrega', texto:'Envio internacional a Bolivia y Chile.', status:'nueva' },
  { clienteIdx:21, categoria:'otro', texto:'Incluir tarjeta artesanal con cada pedido.', status:'aplicada' },
  { clienteIdx:22, categoria:'producto', texto:'Linea de accesorios para mascotas tejidos.', status:'nueva' },
  { clienteIdx:23, categoria:'servicio', texto:'Guia de cuidado del producto en cada envio.', status:'aplicada' },
  { clienteIdx:24, categoria:'precio', texto:'Sorteo mensual de productos entre clientes.', status:'nueva' },
  { clienteIdx:25, categoria:'entrega', texto:'Puntos de retiro en tiendas asociadas.', status:'revisada' },
  { clienteIdx:26, categoria:'otro', texto:'Colaboracion con influencers locales.', status:'nueva' },
  { clienteIdx:27, categoria:'producto', texto:'Ediciones limitadas con artistas arequipeños.', status:'nueva' },
];

const ALL_COLLECTIONS = ['categories','products','offers','clientes','campanas','reclamos','sugerencias','users','orders','newsletter'];

export default function SeedDb() {
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState([]);
  const [clearing, setClearing] = useState(false);

  const addLog = (msg) => setLog((l) => [...l, msg]);

  const clearCollection = async (name) => {
    const snap = await getDocs(collection(db, name));
    for (const d of snap.docs) {
      await deleteDoc(doc(db, name, d.id));
    }
    return snap.size;
  };

  const handleClear = async () => {
    if (!confirm('Eliminar TODOS los datos de Firestore?')) return;
    setClearing(true);
    setLog([]);
    try {
      for (const col of ALL_COLLECTIONS) {
        const n = await clearCollection(col);
        addLog(`  ✓ ${col}: ${n} documentos eliminados`);
      }
      addLog('\n✅ Base de datos limpiada.');
    } catch (err) {
      addLog(`\n❌ Error al limpiar: ${err.message}`);
    } finally {
      setClearing(false);
    }
  };

  const handleSeed = async () => {
    if (!confirm('Poblar Firestore con TODOS los datos (40 pedidos, 40 clientes, 30 usuarios, etc.)?')) return;
    setLoading(true);
    setLog([]);
    const now = () => new Date().toISOString();

    try {
      addLog('═══ CATEGORÍAS ═══');
      for (const cat of CATEGORIES) {
        await addDoc(collection(db, 'categories'), { name: cat.name, image: cat.img || '', description: cat.description || '' });
        addLog(`  ✓ ${cat.name}`);
      }

      addLog('\n═══ PRODUCTOS ═══');
      for (const p of PRODUCTS) {
        await addDoc(collection(db, 'products'), {
          id: p.id, name: p.name, category: p.category, gender: p.gender,
          description: p.description, specs: p.specs,
          priceList: p.priceList, priceOffer: p.priceOffer,
          stock: p.stock, featured: p.featured, images: p.images || [],
          createdAt: now(),
        });
        addLog(`  ✓ ${p.id} — ${p.name} (${(p.images || []).length} imgs)`);
      }

      addLog('\n═══ OFERTAS ═══');
      for (const o of OFFERS) {
        await addDoc(collection(db, 'offers'), { ...o, createdAt: now() });
        addLog(`  ✓ ${o.name}`);
      }

      addLog('\n═══ CLIENTES ═══');
      for (const c of CLIENTES) {
        await addDoc(collection(db, 'clientes'), { ...c, createdAt: now() });
        addLog(`  ✓ ${c.name}`);
      }

      addLog('\n═══ CAMPAÑAS ═══');
      for (const c of CAMPANAS) {
        await addDoc(collection(db, 'campanas'), { ...c, createdAt: now() });
        addLog(`  ✓ ${c.name}`);
      }

      addLog('\n═══ USUARIOS ═══');
      for (const u of USERS) {
        await addDoc(collection(db, 'users'), { ...u, createdAt: now() });
        addLog(`  ✓ ${u.name} (${u.role})`);
      }

      addLog('\n═══ PEDIDOS ═══');
      for (const o of ORDERS) {
        await addDoc(collection(db, 'orders'), { ...o, createdAt: now() });
        addLog(`  ✓ Pedido ${o.customer.name} — S/ ${o.total} (${o.status})`);
      }

      addLog('\n═══ NEWSLETTER ═══');
      for (const n of NEWSLETTER) {
        await addDoc(collection(db, 'newsletter'), { ...n, createdAt: now() });
        addLog(`  ✓ ${n.email}`);
      }

      addLog(`\n✅ ${CATEGORIES.length} categorías · ${PRODUCTS.length} productos · ${OFFERS.length} ofertas`);
      addLog(`   ${CLIENTES.length} clientes · ${CAMPANAS.length} campañas · ${USERS.length} usuarios`);
      addLog(`   ${ORDERS.length} pedidos · ${NEWSLETTER.length} newsletter`);
      addLog('   Imágenes: vacías (asignar desde el admin)');
    } catch (err) {
      addLog(`\n❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <h1 className="admin-title">Poblar Base de Datos</h1>
      <p style={{ marginBottom: '1rem', color: '#666' }}>
        Seeder completo: <strong>4 categorías</strong>, <strong>25 productos</strong>, <strong>20 ofertas</strong>,{' '}
        <strong>40 clientes</strong>, <strong>20 campañas</strong>, <strong>25 reclamos</strong>,{' '}
        <strong>25 sugerencias</strong>, <strong>30 usuarios</strong>, <strong>40 pedidos</strong>,{' '}
        <strong>30 newsletter</strong>.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button className="btn btn-primary" onClick={handleSeed} disabled={loading || clearing}>
          {loading ? 'Poblando...' : 'Poblar Todo'}
        </button>
        <button className="btn btn-outline" onClick={handleClear} disabled={loading || clearing}
          style={{ borderColor: '#e74c3c', color: '#e74c3c' }}>
          {clearing ? 'Limpiando...' : 'Limpiar Todo'}
        </button>
      </div>
      {log.length > 0 && (
        <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', whiteSpace: 'pre-wrap', fontSize: '0.85rem', maxHeight: '500px', overflowY: 'auto' }}>
          {log.join('\n')}
        </pre>
      )}
    </div>
  );
}
