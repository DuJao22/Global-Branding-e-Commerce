import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { dbService } from '../services/db';
import { Check, CreditCard, Truck, MapPin, QrCode, ShieldCheck, Store, Search, ExternalLink, Wallet } from 'lucide-react';

export const Checkout: React.FC = () => {
  const { cart, user, placeOrder, storeConfig, clearCart } = useShop();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // States de Configuração
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix' | 'offline'>('card');
  
  // Address State
  const [address, setAddress] = useState({
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  // Totais
  const subtotal = cart.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);
  const shippingCost = deliveryMethod === 'pickup' ? 0 : (subtotal > 300 ? 0 : 35);
  const total = subtotal + shippingCost;

  const formatPrice = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
        setIsLoadingCep(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (!data.erro) {
                setAddress(prev => ({
                    ...prev,
                    street: data.logradouro,
                    neighborhood: data.bairro,
                    city: data.localidade,
                    state: data.uf
                }));
                document.getElementById('address-number')?.focus();
            } else {
                alert('CEP não encontrado.');
            }
        } catch (error) {
            console.error('Erro ao buscar CEP', error);
        } finally {
            setIsLoadingCep(false);
        }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // FINALIZAR COMPRA
      if (!user) {
          alert('Faça login para continuar');
          navigate('/login');
          return;
      }

      setIsProcessing(true);

      // 1. Gera ID do pedido
      const orderId = `PED-${Math.floor(Math.random() * 100000)}`;

      if (paymentMethod === 'card') {
          // FLUXO STRIPE
          try {
              // Salva o pedido como 'Pending' antes de ir para o Stripe
              await dbService.createOrder({
                  id: orderId,
                  date: new Date().toISOString(),
                  total: total,
                  status: 'Pending',
                  items: cart
              }, user.id);

              const checkoutUrl = await dbService.createCheckoutSession(cart, orderId);
              
              if (checkoutUrl) {
                  window.location.href = checkoutUrl;
              } else {
                  alert('Erro ao iniciar pagamento Stripe. Tente novamente.');
                  setIsProcessing(false);
              }
          } catch (error) {
              console.error(error);
              alert('Erro ao processar pedido.');
              setIsProcessing(false);
          }
      } else {
          // FLUXO NORMAL (PIX / OFFLINE)
          await placeOrder({ 
              paymentMethod, 
              deliveryMethod,
              address: deliveryMethod === 'delivery' ? address : 'Retirada na Loja',
              total 
          });
          navigate('/orders');
      }
    }
  };

  if (cart.length === 0) {
      navigate('/cart');
      return null;
  }

  const config = storeConfig || {
      storeName: 'Loja Central',
      address: 'Av. Inovação, 123',
      cityState: 'Tech City - SP'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Steps */}
        <div className="mb-8">
            <div className="flex items-center justify-center">
                {/* Steps UI (Simplificado para brevidade, igual ao anterior) */}
                 <div className={`flex items-center ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                    <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${step >= 1 ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>1</div>
                    <span className="ml-2 font-medium hidden sm:inline">Entrega</span>
                </div>
                <div className={`w-8 sm:w-24 h-1 mx-2 sm:mx-4 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
                <div className={`flex items-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                    <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${step >= 2 ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>2</div>
                    <span className="ml-2 font-medium hidden sm:inline">Pagamento</span>
                </div>
                <div className={`w-8 sm:w-24 h-1 mx-2 sm:mx-4 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
                <div className={`flex items-center ${step >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
                    <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${step >= 3 ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>3</div>
                    <span className="ml-2 font-medium hidden sm:inline">Revisão</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Area */}
            <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-5 sm:p-8">
                    {step === 1 && (
                        <div className="animate-fade-in">
                            <h2 className="text-xl font-bold mb-6 flex items-center"><MapPin className="mr-2" /> Como deseja receber?</h2>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                <button
                                    type="button"
                                    onClick={() => setDeliveryMethod('delivery')}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${deliveryMethod === 'delivery' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                                >
                                    <Truck className="h-8 w-8 mb-2" />
                                    <span className="font-bold">Receber em Casa</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDeliveryMethod('pickup')}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${deliveryMethod === 'pickup' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                                >
                                    <Store className="h-8 w-8 mb-2" />
                                    <span className="font-bold">Retirar na Loja</span>
                                </button>
                            </div>

                            {deliveryMethod === 'delivery' ? (
                                <div className="space-y-4">
                                     <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                                            <input type="text" defaultValue={user?.name} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                                        </div>
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700">CEP</label>
                                            <input type="text" name="cep" value={address.cep} onChange={handleInputChange} onBlur={handleCepBlur} placeholder="00000-000" maxLength={9} required className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 pr-10 mt-1" />
                                            {isLoadingCep && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none mt-6"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div></div>}
                                        </div>
                                        {/* Outros campos de endereço simplificados */}
                                        <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700">Endereço</label><input type="text" name="street" value={address.street} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700">Número</label><input id="address-number" type="text" name="number" value={address.number} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700">Bairro</label><input type="text" name="neighborhood" value={address.neighborhood} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700">Cidade</label><input type="text" name="city" value={address.city} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700">Estado</label><input type="text" name="state" value={address.state} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50" /></div>
                                     </div>
                                </div>
                            ) : (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center animate-fade-in">
                                    <Store className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                                    <h3 className="font-bold text-gray-900 text-lg mb-2">{config.storeName}</h3>
                                    <p className="text-gray-600 mb-1">{config.address} - {config.cityState}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-fade-in">
                            <h2 className="text-xl font-bold mb-6 flex items-center"><CreditCard className="mr-2" /> Forma de Pagamento</h2>
                            <div className="space-y-4">
                                <label className={`border p-4 rounded-lg flex items-center cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                                    <input type="radio" name="payment" className="h-4 w-4 text-primary-600 focus:ring-primary-500" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                                    <div className="ml-3 flex items-center">
                                        <CreditCard className="h-6 w-6 text-gray-700 mr-2" />
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">Cartão de Crédito / Débito (Stripe)</span>
                                            <span className="text-xs text-gray-500">Checkout seguro via Stripe</span>
                                        </div>
                                    </div>
                                </label>
                                
                                <label className={`border p-4 rounded-lg flex items-center cursor-pointer transition-colors ${paymentMethod === 'pix' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                                    <input type="radio" name="payment" className="h-4 w-4 text-primary-600 focus:ring-primary-500" checked={paymentMethod === 'pix'} onChange={() => setPaymentMethod('pix')} />
                                    <div className="ml-3 flex items-center">
                                        <QrCode className="h-6 w-6 text-gray-700 mr-2" />
                                        <span className="font-medium text-gray-900">PIX (5% OFF)</span>
                                    </div>
                                </label>

                                <label className={`border p-4 rounded-lg flex items-center cursor-pointer transition-colors ${paymentMethod === 'offline' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                                    <input type="radio" name="payment" className="h-4 w-4 text-primary-600 focus:ring-primary-500" checked={paymentMethod === 'offline'} onChange={() => setPaymentMethod('offline')} />
                                    <div className="ml-3 flex items-center">
                                        <Wallet className="h-6 w-6 text-gray-700 mr-2" />
                                        <span className="font-medium text-gray-900">{deliveryMethod === 'pickup' ? 'Pagar na Retirada' : 'Pagar na Entrega'}</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-fade-in">
                            <h2 className="text-xl font-bold mb-6">Revisar Pedido</h2>
                            <div className="space-y-4">
                                <div className="border-b pb-4">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex justify-between text-sm py-1">
                                            <span>{item.name} x{item.quantity}</span>
                                            <span className="font-medium">{formatPrice((item.discountPrice || item.price) * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between font-bold text-xl pt-2">
                                    <span>Total a Pagar</span>
                                    <span className="text-primary-600">{formatPrice(total)}</span>
                                </div>
                                
                                {paymentMethod === 'card' && (
                                    <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 border border-blue-100 mt-4">
                                        <p className="font-bold flex items-center"><ShieldCheck className="h-4 w-4 mr-2"/> Pagamento Seguro com Stripe</p>
                                        <p className="mt-1">Ao clicar em confirmar, você será redirecionado para a página segura de pagamento do Stripe.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex justify-between">
                        {step > 1 ? (
                            <button type="button" onClick={() => setStep(step - 1)} className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded hover:bg-gray-100 transition-colors">Voltar</button>
                        ) : (<div></div>)}
                        
                        <button 
                            type="submit"
                            disabled={isProcessing}
                            className={`bg-primary-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-700 shadow-md transition-all transform hover:-translate-y-1 ${isProcessing ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {isProcessing ? 'Processando...' : (step === 3 ? (paymentMethod === 'card' ? 'Ir para Pagamento' : 'Finalizar Pedido') : 'Continuar')}
                        </button>
                    </div>
                </form>
            </div>

            {/* Summary Sidebar */}
            <div className="hidden lg:block">
                <div className="bg-gray-900 text-white rounded-xl shadow-lg p-6 sticky top-24">
                    <h3 className="text-lg font-bold mb-4">Resumo</h3>
                    <div className="space-y-3 text-sm text-gray-300">
                        <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                        <div className="flex justify-between"><span>Frete</span><span>{shippingCost === 0 ? 'Grátis' : formatPrice(shippingCost)}</span></div>
                        <div className="border-t border-gray-700 pt-3 flex justify-between font-bold text-white text-base"><span>Total</span><span>{formatPrice(total)}</span></div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};