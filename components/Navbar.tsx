import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, LogOut, LayoutDashboard, ChevronRight, Terminal } from 'lucide-react';
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
    <>
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo & Mobile Menu Button */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 -ml-2 mr-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none md:hidden transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <img src="https://i.postimg.cc/KjSnyJWC/unnamed-1-removebg-preview.png" alt="Global Branding" className="h-8 md:h-10 w-auto" />
                <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-tighter">Global Branding</span>
              </Link>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 items-center justify-center px-8">
              <form onSubmit={handleSearch} className="w-full max-w-lg relative">
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow bg-gray-50 hover:bg-white focus:bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute right-0 top-0 h-full px-4 text-gray-400 hover:text-primary-600">
                  <Search className="h-5 w-5" />
                </button>
              </form>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Mobile Search Icon Toggle could go here if needed, keeping simple for now */}
              
              <Link to="/cart" className="relative p-2 text-gray-500 hover:text-primary-600 transition-colors group">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative group flex items-center hidden md:flex">
                  <Link to={user.role === 'admin' ? '/admin' : '/profile'} className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-gray-200">
                    <img src={user.avatar} alt="Perfil" className="h-8 w-8 rounded-full border border-gray-200" />
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  </Link>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl py-1 ring-1 ring-black ring-opacity-5 hidden group-hover:block animate-fade-in-down">
                    {user.role === 'admin' && (
                       <Link to="/admin" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                          <LayoutDashboard className="h-4 w-4 mr-2 text-gray-400"/> Dashboard
                       </Link>
                    )}
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Meu Perfil</Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Meus Pedidos</Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center">
                      <LogOut className="h-4 w-4 mr-2"/> Sair
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="hidden md:flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors">
                  <User className="h-5 w-5 mr-2" />
                  <span>Entrar</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="absolute top-0 left-0 w-[85%] max-w-sm h-full bg-gray-900 text-white shadow-2xl flex flex-col animate-slide-in-right transform transition-transform duration-300 ease-in-out">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="https://i.postimg.cc/KjSnyJWC/unnamed-1-removebg-preview.png" alt="Logo" className="h-8 w-auto grayscale brightness-200" />
                <span className="font-bold text-lg tracking-tight">Global Branding</span>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-400 hover:text-white transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Sidebar Search */}
            <div className="p-6 pb-2">
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        placeholder="O que você procura?"
                        className="w-full pl-4 pr-10 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="absolute right-3 top-3 text-gray-500">
                        <Search className="h-5 w-5" />
                    </button>
                </form>
            </div>

            {/* Sidebar Links */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="px-4 space-y-1">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                    <span className="font-medium">Início</span>
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                </Link>
                <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                    <span className="font-medium">Produtos</span>
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                </Link>
                <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                    <div className="flex items-center">
                        <span className="font-medium">Carrinho</span>
                        {cartCount > 0 && <span className="ml-2 bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">{cartCount}</span>}
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                </Link>
                
                <div className="my-4 border-t border-gray-800"></div>

                {user ? (
                    <>
                        <div className="px-4 py-2">
                             <div className="flex items-center gap-3 mb-4">
                                <img src={user.avatar} alt="Avatar" className="h-10 w-10 rounded-full border border-gray-700" />
                                <div>
                                    <p className="text-sm font-medium text-white">{user.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                             </div>
                        </div>
                        {user.role === 'admin' && (
                             <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white">
                                <LayoutDashboard className="h-5 w-5 mr-3" /> Painel Admin
                             </Link>
                        )}
                        <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white">
                            <User className="h-5 w-5 mr-3" /> Meu Perfil
                        </Link>
                        <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white">
                            <ShoppingCart className="h-5 w-5 mr-3" /> Meus Pedidos
                        </Link>
                        <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full flex items-center px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800 hover:text-red-300">
                            <LogOut className="h-5 w-5 mr-3" /> Sair
                        </button>
                    </>
                ) : (
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-3 rounded-lg text-primary-400 hover:bg-gray-800 hover:text-primary-300 font-medium">
                        <User className="h-5 w-5 mr-3" /> Entrar / Cadastrar
                    </Link>
                )}
              </nav>
            </div>

            {/* Sidebar Footer */}
            <div className="p-6 border-t border-gray-800 text-xs text-center text-gray-500">
                <p className="mb-2">&copy; {new Date().getFullYear()} Global Branding</p>
                <div className="flex items-center justify-center text-gray-400">
                    <Terminal className="h-3 w-3 mr-1 text-primary-500" />
                    <span>Dev: <strong className="text-gray-300">Joao Layon</strong></span>
                </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};