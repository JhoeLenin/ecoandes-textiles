import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
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
import Clientes from './pages/admin/Clientes';
import Campanas from './pages/admin/Campanas';
import Reclamos from './pages/admin/Reclamos';
import Sugerencias from './pages/admin/Sugerencias';
import ReportesCRM from './pages/admin/ReportesCRM';
import SeedDb from './pages/admin/SeedDb';
import Cuenta from './pages/Cuenta';
import MisPedidos from './pages/MisPedidos';
import Perfil from './pages/Perfil';
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
        <CartProvider>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <ScrollToTop />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/cuenta" element={<Cuenta />} />
          <Route path="/mis-pedidos" element={<MisPedidos />} />
          <Route path="/perfil" element={<Perfil />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="productos" element={<Products />} />
              <Route path="categorias" element={<Categories />} />
              <Route path="ofertas" element={<Offers />} />
              <Route path="pedidos" element={<Orders />} />
              <Route path="usuarios" element={<Users />} />
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
      </AuthProvider>
    </BrowserRouter>
  );
}
