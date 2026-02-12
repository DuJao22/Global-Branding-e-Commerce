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
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Descubra o Futuro das <span className="text-primary-400">Compras</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Explore nossa coleção selecionada de eletrônicos premium, moda e essenciais para casa. 
              Qualidade em que você pode confiar, preços que você vai amar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop" className="inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors">
                Comprar Agora
              </Link>
              <Link to="/shop?sort=newest" className="inline-flex justify-center items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-white hover:bg-white hover:text-gray-900 transition-colors">
                Novidades
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50">
                    <Truck className="h-10 w-10 text-primary-500" />
                    <div>
                        <h3 className="font-semibold text-gray-900">Frete Grátis</h3>
                        <p className="text-sm text-gray-500">Em pedidos acima de R$ 300</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50">
                    <ShieldCheck className="h-10 w-10 text-primary-500" />
                    <div>
                        <h3 className="font-semibold text-gray-900">Pagamento Seguro</h3>
                        <p className="text-sm text-gray-500">Checkout 100% seguro</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50">
                    <RefreshCw className="h-10 w-10 text-primary-500" />
                    <div>
                        <h3 className="font-semibold text-gray-900">Devolução Fácil</h3>
                        <p className="text-sm text-gray-500">Política de devolução de 30 dias</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50">
                    <CreditCard className="h-10 w-10 text-primary-500" />
                    <div>
                        <h3 className="font-semibold text-gray-900">Pagamento Flexível</h3>
                        <p className="text-sm text-gray-500">Pague com Cartão ou Pix</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Categorias</h2>
            <Link to="/shop" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
              Ver Tudo <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((cat, idx) => (
              <Link key={idx} to={`/shop?category=${cat}`} className="group relative rounded-lg overflow-hidden aspect-[4/3] shadow-sm hover:shadow-md transition-shadow">
                 <img 
                    src={`https://picsum.photos/400/300?random=${100+idx}`} 
                    alt={cat}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                 />
                 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <span className="text-white font-semibold text-lg text-center px-2">{cat}</span>
                 </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Mais Vendidos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary-100 rounded-full opacity-50"></div>
                
                <div className="relative z-10 mb-8 md:mb-0 max-w-lg">
                    <span className="text-primary-600 font-bold tracking-wider uppercase text-sm">Oferta por Tempo Limitado</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">Ganhe 20% OFF no Primeiro Pedido</h2>
                    <p className="text-gray-600 mb-6">Assine nossa newsletter e receba um cupom especial instantaneamente. Não perca ofertas premium.</p>
                    <div className="flex w-full max-w-sm">
                        <input type="email" placeholder="Digite seu e-mail" className="flex-1 px-4 py-3 rounded-l-md border border-r-0 border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500" />
                        <button className="bg-gray-900 text-white px-6 py-3 rounded-r-md font-medium hover:bg-gray-800 transition-colors">Assinar</button>
                    </div>
                </div>
                <div className="relative z-10">
                    <img src="https://picsum.photos/400/400?random=50" alt="Promo" className="rounded-lg shadow-lg rotate-3 hover:rotate-0 transition-transform duration-500 w-64 h-64 object-cover" />
                </div>
            </div>
        </div>
      </section>

       {/* New Arrivals */}
       <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Novidades</h2>
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