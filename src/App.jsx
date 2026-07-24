import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { CatalogProvider } from './context/CatalogContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import TiendaVendedor from './pages/TiendaVendedor';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import Shipping from './pages/Shipping';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Categories from './pages/admin/Categories';
import Offers from './pages/admin/Offers';
import Orders from './pages/admin/Orders';
import Users from './pages/admin/Users';
import VendedoresAdmin from './pages/admin/Vendedores';
import Proveedores from './pages/admin/Proveedores';
import OrdenesCompra from './pages/admin/OrdenesCompra';
import Inventario from './pages/admin/Inventario';
import Clientes from './pages/admin/Clientes';
import Campanas from './pages/admin/Campanas';
import Reclamos from './pages/admin/Reclamos';
import Sugerencias from './pages/admin/Sugerencias';
import ReportesCRM from './pages/admin/ReportesCRM';
import SeedDb from './pages/admin/SeedDb';
import Cuenta from './pages/Cuenta';
import MisPedidos from './pages/MisPedidos';
import Perfil from './pages/Perfil';
import Favoritos from './pages/Favoritos';
import VendedorLayout from './components/VendedorLayout';
import VendedorRegistro from './pages/VendedorRegistro';
import VendedorPanel from './pages/VendedorPanel';
import VendedorProductos from './pages/VendedorProductos';
import VendedorVentas from './pages/VendedorVentas';
import { Toaster } from 'react-hot-toast';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PublicLayout() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tienda" element={<Shop />} />
          <Route path="/tienda/vendedor/:id" element={<TiendaVendedor />} />
          <Route path="/producto/:id" element={<Product />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/envios" element={<Shipping />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CatalogProvider>
          <CartProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#FAF6F0',
                  color: '#2B2420',
                  border: '1px solid #E3D9CB',
                  borderRadius: '12px',
                  boxShadow: '0 8px 30px rgba(43, 36, 32, 0.16)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                },
                success: { iconTheme: { primary: '#46603C', secondary: '#FAF6F0' } },
                error: { iconTheme: { primary: '#C0653B', secondary: '#FAF6F0' } },
              }}
            />
            <ScrollToTop />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/cuenta" element={<Cuenta />} />
            <Route path="/mis-pedidos" element={<MisPedidos />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/favoritos" element={<Favoritos />} />
            <Route path="/vendedor/registro" element={<VendedorRegistro />} />
            <Route path="/vendedor" element={<VendedorLayout />}>
              <Route index element={<VendedorPanel />} />
              <Route path="productos" element={<VendedorProductos />} />
              <Route path="ventas" element={<VendedorVentas />} />
            </Route>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="productos" element={<Products />} />
                <Route path="categorias" element={<Categories />} />
                <Route path="ofertas" element={<Offers />} />
                <Route path="pedidos" element={<Orders />} />
                <Route path="usuarios" element={<Users />} />
                <Route path="vendedores" element={<VendedoresAdmin />} />
                <Route path="proveedores" element={<Proveedores />} />
                <Route path="ordenes-compra" element={<OrdenesCompra />} />
                <Route path="inventario" element={<Inventario />} />
                <Route path="clientes" element={<Clientes />} />
                <Route path="campanas" element={<Campanas />} />
                <Route path="reclamos" element={<Reclamos />} />
                <Route path="sugerencias" element={<Sugerencias />} />
                <Route path="reportes" element={<ReportesCRM />} />
              <Route path="seed" element={<SeedDb />} />
              </Route>
              <Route path="/*" element={<PublicLayout />} />
            </Routes>
          </CartProvider>
        </CatalogProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
