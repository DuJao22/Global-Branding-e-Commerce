import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { Orders } from './pages/Orders';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

const Layout = ({ children, hideFooter = false }: { children?: React.ReactNode, hideFooter?: boolean }) => (
    <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
            {children}
        </main>
        {!hideFooter && <Footer />}
    </div>
);

const App: React.FC = () => {
  return (
    <ShopProvider>
      <HashRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/shop" element={<Layout><Shop /></Layout>} />
          <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
          <Route path="/cart" element={<Layout><Cart /></Layout>} />
          <Route path="/checkout" element={<Layout hideFooter><Checkout /></Layout>} />
          <Route path="/login" element={<Layout hideFooter><Login /></Layout>} />
          <Route path="/admin" element={<Layout hideFooter><AdminDashboard /></Layout>} />
          <Route path="/profile" element={<Layout><div className="p-20 text-center text-xl">User Profile Placeholder</div></Layout>} />
          <Route path="/orders" element={<Layout><Orders /></Layout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ShopProvider>
  );
};

export default App;