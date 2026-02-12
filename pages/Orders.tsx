import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Package, Truck, CheckCircle, Clock, MapPin, ChevronRight, ShoppingBag } from 'lucide-react';

export const Orders: React.FC = () => {
  const { user, orders, isLoading } = useShop();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const formatPrice = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
            <div className="bg-blue-50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-10 w-10 text-primary-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Você ainda não fez pedidos</h2>
            <p className="text-gray-500 mb-8">Aproveite nossas ofertas exclusivas e renove seu estilo hoje mesmo.</p>
            <Link to="/shop" className="block w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Ir para a Loja
            </Link>
        </div>
      </div>
    );
  }

  // Helper para calcular progresso do status
  const getStatusStep = (status: string) => {
    switch(status) {
        case 'Pending': return 1;
        case 'Paid': return 2;
        case 'Processing': return 3;
        case 'Shipped': return 4;
        case 'Delivered': return 5;
        case 'Cancelled': return 0;
        default: return 1;
    }
  };

  const getStatusLabel = (status: string) => {
      switch(status) {
          case 'Pending': return 'Aguardando Pagamento';
          case 'Paid': return 'Pagamento Confirmado';
          case 'Processing': return 'Em Separação';
          case 'Shipped': return 'Em Trânsito';
          case 'Delivered': return 'Entregue';
          case 'Cancelled': return 'Cancelado';
          default: return status;
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Meus Pedidos</h1>
            <Link to="/shop" className="text-primary-600 hover:text-primary-800 font-medium flex items-center">
                Continuar Comprando <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
        </div>

        <div className="space-y-6">
          {orders.map((order) => {
            const currentStep = getStatusStep(order.status);
            const isCancelled = order.status === 'Cancelled';

            return (
              <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all hover:shadow-md">
                {/* Header do Pedido */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Data do Pedido</span>
                        <span className="text-gray-900 font-medium">{formatDate(order.date)}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Total</span>
                        <span className="text-gray-900 font-bold">{formatPrice(order.total)}</span>
                    </div>
                    <div className="flex flex-col">
                         <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Nº do Pedido</span>
                         <span className="text-gray-700 font-mono">{order.id}</span>
                    </div>
                    <div className="sm:ml-auto">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                            ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                              order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                              order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'}`}>
                            {getStatusLabel(order.status)}
                        </span>
                    </div>
                </div>

                {/* Status Bar */}
                {!isCancelled && (
                    <div className="px-6 py-8">
                        <div className="relative">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
                            <div 
                                className="absolute top-1/2 left-0 h-1 bg-primary-600 -translate-y-1/2 z-0 transition-all duration-1000"
                                style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                            ></div>
                            
                            <div className="relative z-10 flex justify-between w-full">
                                <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-gray-300 text-gray-300'}`}>
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-medium mt-2 text-gray-600 hidden sm:block">Pedido Confirmado</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 3 ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-gray-300 text-gray-300'}`}>
                                        <Package className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-medium mt-2 text-gray-600 hidden sm:block">Em Separação</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 4 ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-gray-300 text-gray-300'}`}>
                                        <Truck className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-medium mt-2 text-gray-600 hidden sm:block">Em Trânsito</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 5 ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-300 text-gray-300'}`}>
                                        <CheckCircle className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-medium mt-2 text-gray-600 hidden sm:block">Entregue</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Lista de Itens */}
                <div className="px-6 pb-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <ShoppingBag className="h-4 w-4 mr-2 text-gray-400" /> Itens do Pedido
                    </h4>
                    <div className="space-y-4">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center py-2 border-b border-gray-50 last:border-0">
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="h-16 w-16 object-cover rounded-md border border-gray-200" 
                                />
                                <div className="ml-4 flex-1">
                                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                    <p className="text-xs text-gray-500">{item.category} | Qtd: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">{formatPrice((item.discountPrice || item.price) * item.quantity)}</p>
                                    {item.quantity > 1 && (
                                        <p className="text-xs text-gray-400">{formatPrice(item.discountPrice || item.price)} un.</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <div className="flex items-center text-sm text-gray-500">
                           <MapPin className="h-4 w-4 mr-1" /> Entrega Padrão
                        </div>
                        <button className="text-primary-600 text-sm font-medium hover:text-primary-800">
                            Ver Detalhes / Nota Fiscal
                        </button>
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};