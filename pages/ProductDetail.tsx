import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Star, Truck, ShieldCheck, Heart, Share2, Plus, Minus, ShoppingCart } from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart } = useShop();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews'>('desc');

  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return <div className="p-12 text-center text-gray-500">Produto não encontrado.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Image Gallery Mock */}
            <div className="p-6 md:p-8 bg-white">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4 border border-gray-100">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="grid grid-cols-4 gap-2 sm:gap-4">
                    {[1,2,3,4].map(i => (
                        <div key={i} className={`aspect-square rounded-md overflow-hidden bg-gray-50 cursor-pointer border-2 ${i===1 ? 'border-primary-500' : 'border-transparent hover:border-gray-300'}`}>
                            <img src={product.image} alt="Thumbnail" className="w-full h-full object-cover opacity-80 hover:opacity-100" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Product Info */}
            <div className="p-6 md:p-8 md:border-l border-gray-100">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="text-sm font-medium text-primary-600">{product.category}</span>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 mb-2">{product.name}</h1>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">{product.rating} ({product.reviewsCount} avaliações)</span>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors">
                            <Heart className="h-6 w-6" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-500 transition-colors">
                            <Share2 className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    {product.discountPrice ? (
                        <div className="flex items-baseline space-x-3">
                            <span className="text-3xl font-bold text-gray-900">R$ {product.discountPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            <span className="text-lg text-gray-500 line-through">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">-{Math.round((1 - product.discountPrice/product.price)*100)}%</span>
                        </div>
                    ) : (
                        <span className="text-3xl font-bold text-gray-900">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    )}
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed text-sm sm:text-base">{product.description}</p>

                {/* SKU & Stock */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 text-sm text-gray-500 mb-8">
                    <span>SKU: <span className="text-gray-900">{product.sku}</span></span>
                    <span>Disponibilidade: <span className={product.stock > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>{product.stock > 0 ? "Em Estoque" : "Esgotado"}</span></span>
                </div>

                <div className="border-t border-gray-100 pt-8">
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex items-center border border-gray-300 rounded-md w-full sm:w-32">
                            <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-3 text-gray-600 hover:bg-gray-100 w-10 flex justify-center">
                                <Minus className="h-4 w-4" />
                            </button>
                            <input type="text" value={qty} readOnly className="w-full text-center border-none focus:ring-0 bg-transparent" />
                            <button onClick={() => setQty(qty + 1)} className="px-3 py-3 text-gray-600 hover:bg-gray-100 w-10 flex justify-center">
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                        <button 
                            onClick={() => addToCart(product, qty)}
                            className="flex-1 bg-primary-600 text-white px-8 py-3 rounded-md font-bold text-lg hover:bg-primary-700 transition-colors flex items-center justify-center shadow-lg shadow-primary-500/30"
                        >
                            <ShoppingCart className="mr-2 h-5 w-5" /> Adicionar ao Carrinho
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center text-sm text-gray-500">
                            <Truck className="h-5 w-5 text-gray-400 mr-2" /> Frete grátis acima de R$ 300
                        </div>
                         <div className="flex items-center text-sm text-gray-500">
                            <ShieldCheck className="h-5 w-5 text-gray-400 mr-2" /> 2 anos de garantia
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Tabs Description/Reviews */}
          <div className="border-t border-gray-100">
             <div className="flex border-b border-gray-100 overflow-x-auto">
                 <button 
                    onClick={() => setActiveTab('desc')}
                    className={`px-6 sm:px-8 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === 'desc' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                 >
                    Descrição
                 </button>
                 <button 
                    onClick={() => setActiveTab('reviews')}
                    className={`px-6 sm:px-8 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === 'reviews' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                 >
                    Avaliações ({product.reviewsCount})
                 </button>
             </div>
             <div className="p-6 sm:p-8 bg-gray-50/50">
                 {activeTab === 'desc' ? (
                     <div className="prose max-w-none text-gray-600 text-sm sm:text-base">
                         <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                         <p className="mt-4">Características:</p>
                         <ul className="list-disc pl-5 mt-2 space-y-1">
                             <li>Materiais premium usados para durabilidade.</li>
                             <li>Projetado para estética moderna e conforto.</li>
                             <li>Embalagem ecológica.</li>
                         </ul>
                     </div>
                 ) : (
                     <div className="space-y-6">
                         {[1, 2].map(r => (
                             <div key={r} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                                 <div className="flex items-center justify-between mb-2">
                                     <div className="flex items-center">
                                         <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold mr-3">U{r}</div>
                                         <div>
                                             <h4 className="font-medium text-gray-900">Nome do Usuário</h4>
                                             <div className="flex text-yellow-400 text-xs">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`h-3 w-3 fill-current`} />
                                                ))}
                                             </div>
                                         </div>
                                     </div>
                                     <span className="text-sm text-gray-500">2 dias atrás</span>
                                 </div>
                                 <p className="text-gray-600 text-sm">Ótimo produto! Altamente recomendado para quem procura qualidade. A entrega foi super rápida também.</p>
                             </div>
                         ))}
                     </div>
                 )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};