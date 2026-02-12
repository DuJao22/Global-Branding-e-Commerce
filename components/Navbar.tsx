import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, LogOut, LayoutDashboard } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Navbar: React.FC = () => {
  const { cart, user, logout } = useShop();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Mobile Menu Button */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link to="/" className="flex-shrink-0 flex items-center ml-2 md:ml-0 gap-2">
              <img src="https://i.postimg.cc/KjSnyJWC/unnamed-1-removebg-preview.png" alt="Global Branding" className="h-10 w-auto" />
              <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-tighter">Global Branding</span>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 items-center justify-center px-8">
            <form onSubmit={handleSearch} className="w-full max-w-lg relative">
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-0 top-0 h-full px-4 text-gray-500 hover:text-primary-600">
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-400 hover:text-primary-600 transition-colors group">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group flex items-center gap-2">
                <Link to={user.role === 'admin' ? '/admin' : '/profile'} className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-3 rounded-full transition-colors">
                  <img src={user.avatar} alt="Perfil" className="h-8 w-8 rounded-full border border-gray-200" />
                  <span className="hidden sm:block text-sm font-medium text-gray-700">{user.name}</span>
                </Link>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 hidden group-hover:block animate-fade-in-down">
                  {user.role === 'admin' && (
                     <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        <LayoutDashboard className="h-4 w-4 mr-2"/> Dashboard
                     </Link>
                  )}
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Meu Perfil</Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Meus Pedidos</Link>
                  <button onClick={logout} className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center">
                    <LogOut className="h-4 w-4 mr-2"/> Sair
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600">
                <User className="h-6 w-6 mr-1" />
                <span className="hidden sm:inline">Entrar</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 pb-4">
          <div className="p-4">
             <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
               <button type="submit" className="absolute right-2 top-2 text-gray-500">
                <Search className="h-5 w-5" />
              </button>
            </form>
            <div className="space-y-1">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">Início</Link>
              <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">Produtos</Link>
              <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">Carrinho ({cartCount})</Link>
              {!user && <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">Entrar / Cadastrar</Link>}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};