import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Trash2, Minus, Plus, ArrowLeft } from 'lucide-react';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity } = useShop();

  const subtotal = cart.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);
  const shipping = subtotal > 300 ? 0 : 35.00;
  const total = subtotal + shipping;

  const formatPrice = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
            <div className="bg-gray-100 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCartIcon className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Seu carrinho está vazio</h2>
            <p className="text-gray-500 mb-8">Parece que você ainda não adicionou nada ao seu carrinho.</p>
            <Link to="/shop" className="block w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Começar a Comprar
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrinho de Compras</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <ul className="divide-y divide-gray-100">
                        {cart.map(item => (
                            <li key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-6">
                                <img src={item.image} alt={item.name} className="h-24 w-24 object-cover rounded-md border border-gray-200" />
                                
                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="text-lg font-medium text-gray-900"><Link to={`/product/${item.id}`}>{item.name}</Link></h3>
                                    <p className="text-sm text-gray-500">{item.category}</p>
                                </div>

                                <div className="flex items-center border border-gray-300 rounded-md">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-100 text-gray-600">
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="px-4 py-2 font-medium text-gray-900 w-12 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-100 text-gray-600">
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="text-right min-w-[120px]">
                                    <p className="text-lg font-bold text-gray-900">{formatPrice((item.discountPrice || item.price) * item.quantity)}</p>
                                    <button 
                                        onClick={() => removeFromCart(item.id)} 
                                        className="text-red-500 text-sm hover:text-red-700 mt-1 inline-flex items-center"
                                    >
                                        <Trash2 className="h-3 w-3 mr-1" /> Remover
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="p-6 bg-gray-50 flex justify-between items-center">
                        <Link to="/shop" className="text-primary-600 font-medium flex items-center hover:underline">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Continuar Comprando
                        </Link>
                    </div>
                </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Resumo do Pedido</h2>
                    
                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Frete</span>
                            <span>{shipping === 0 ? 'Grátis' : formatPrice(shipping)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-xl text-gray-900">
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cupom de Desconto</label>
                        <div className="flex">
                            <input type="text" placeholder="Código promocional" className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 focus:ring-primary-500 focus:border-primary-500" />
                            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-r-md hover:bg-gray-300 font-medium">Aplicar</button>
                        </div>
                    </div>

                    <Link 
                        to="/checkout" 
                        className="w-full block bg-primary-600 text-white text-center py-4 rounded-lg font-bold text-lg hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-transform transform hover:-translate-y-1"
                    >
                        Finalizar Compra
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// Simple icon component for this file
const ShoppingCartIcon = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
);