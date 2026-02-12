import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, RefreshCw, CreditCard } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES } from '../constants';

export const Home: React.FC = () => {
  const { products } = useShop();
  
  const featuredProducts = products.filter(p => p.rating >= 4.7).slice(0, 4);
  const newProducts = products.filter(p => p.isNew).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Premium Dark Theme */}
      <section className="relative bg-gray-950 text-white overflow-hidden h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=2070&auto=format&fit=crop" 
            alt="Lifestyle Background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-900/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl animate-fade-in-up">
            <span className="inline-block py-1 px-3 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-sm font-semibold tracking-wide uppercase mb-6 backdrop-blur-sm">
              Global Branding Essentials
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Tudo para seu Lar e <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Seu Estilo Pessoal</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed max-w-2xl">
              Do conforto das nossas redes e tapetes à precisão da cutelaria e tecnologia. 
              Renove seu dia a dia com nossa seleção exclusiva de carteiras, moda íntima e acessórios premium.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop" className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-base font-bold rounded-lg text-gray-950 bg-white hover:bg-gray-100 transition-all transform hover:-translate-y-1 shadow-lg shadow-white/10">
                Ver Coleção
              </Link>
              <Link to="/shop?sort=newest" className="inline-flex justify-center items-center px-8 py-4 border border-gray-700 text-base font-bold rounded-lg text-white hover:bg-gray-800 transition-all">
                Ofertas da Semana
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 bg-white border-b border-gray-100 relative z-20 -mt-8 mx-4 sm:mx-8 rounded-xl shadow-xl">
        <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="flex items-center space-x-4 p-4">
                    <div className="p-3 bg-primary-50 rounded-full text-primary-600">
                      <Truck className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Frete Grátis</h3>
                        <p className="text-sm text-gray-500">Para todo o Brasil</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4 p-4">
                    <div className="p-3 bg-primary-50 rounded-full text-primary-600">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Qualidade Garantida</h3>
                        <p className="text-sm text-gray-500">Materiais Premium</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4 p-4">
                    <div className="p-3 bg-primary-50 rounded-full text-primary-600">
                      <RefreshCw className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Troca Simplificada</h3>
                        <p className="text-sm text-gray-500">Sem burocracia</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4 p-4">
                    <div className="p-3 bg-primary-50 rounded-full text-primary-600">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Pagamento Seguro</h3>
                        <p className="text-sm text-gray-500">Até 12x no cartão</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Nossas Categorias</h2>
              <div className="h-1 w-20 bg-primary-600 mt-2 rounded-full"></div>
            </div>
            <Link to="/shop" className="text-primary-600 hover:text-primary-700 font-medium flex items-center transition-colors">
              Ver Tudo <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {CATEGORIES.map((cat, idx) => (
              <Link key={idx} to={`/shop?category=${cat}`} className="group relative rounded-xl overflow-hidden aspect-[3/4] shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                 <img 
                    src={`https://source.unsplash.com/random/400x600?${cat.replace(' ', ',')},product`} 
                    alt={cat}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                        // Fallback image if unsplash fails
                        (e.target as HTMLImageElement).src = `https://picsum.photos/400/600?random=${100+idx}`;
                    }}
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:opacity-90"></div>
                 <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="text-white font-bold text-lg block mb-1">{cat}</span>
                    <span className="text-gray-300 text-xs uppercase tracking-wider flex items-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                      Ver Produtos <ArrowRight className="h-3 w-3 ml-1" />
                    </span>
                 </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Destaques da Loja</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-primary-900 to-gray-900 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden border border-gray-800">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                
                <div className="relative z-10 mb-8 md:mb-0 max-w-xl">
                    <span className="text-primary-400 font-bold tracking-widest uppercase text-xs mb-2 block">Oferta Relâmpago</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mt-2 mb-6">Kit Churrasco & Cutelaria</h2>
                    <p className="text-gray-400 mb-8 text-lg">Leve sofisticação para sua área gourmet. Facas artesanais com 15% OFF na primeira compra.</p>
                    <div className="flex w-full max-w-md bg-white/5 p-1 rounded-lg border border-gray-700 backdrop-blur-sm">
                        <input type="email" placeholder="Seu e-mail" className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none" />
                        <button className="bg-white text-gray-900 px-8 py-3 rounded-md font-bold hover:bg-gray-100 transition-colors">
                          Eu Quero
                        </button>
                    </div>
                </div>
                <div className="relative z-10 hidden md:block">
                     <img src="https://i.postimg.cc/KjSnyJWC/unnamed-1-removebg-preview.png" alt="Emblem" className="relative w-48 h-auto opacity-80 grayscale brightness-200" />
                </div>
            </div>
        </div>
      </section>

       {/* New Arrivals */}
       <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Novidades</h2>
            <p className="text-gray-500 mt-2">Acabaram de chegar</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};