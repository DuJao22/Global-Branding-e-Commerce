import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Check, CreditCard, Truck, MapPin, Smartphone, QrCode, ShieldCheck } from 'lucide-react';

export const Checkout: React.FC = () => {
  const { cart, user, placeOrder } = useShop();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix' | 'boleto'>('card');

  const subtotal = cart.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);
  const total = subtotal + (subtotal > 300 ? 0 : 35);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      placeOrder({ paymentMethod, total });
      navigate('/orders');
    }
  };

  if (cart.length === 0) {
      navigate('/cart');
      return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Steps */}
        <div className="mb-8">
            <div className="flex items-center justify-center">
                <div className={`flex items-center ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                    <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${step >= 1 ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>
                        {step > 1 ? <Check className="h-5 w-5" /> : 1}
                    </div>
                    <span className="ml-2 font-medium">Entrega</span>
                </div>
                <div className={`w-16 h-1 mx-4 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
                <div className={`flex items-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                    <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${step >= 2 ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>
                        {step > 2 ? <Check className="h-5 w-5" /> : 2}
                    </div>
                    <span className="ml-2 font-medium">Pagamento</span>
                </div>
                <div className={`w-16 h-1 mx-4 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
                <div className={`flex items-center ${step >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
                    <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${step >= 3 ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>
                        3
                    </div>
                    <span className="ml-2 font-medium">Revisão</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Area */}
            <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8">
                    {step === 1 && (
                        <div className="animate-fade-in">
                            <h2 className="text-xl font-bold mb-6 flex items-center"><MapPin className="mr-2" /> Endereço de Entrega</h2>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                                    <input type="text" defaultValue={user?.name} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Endereço</label>
                                    <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cidade</label>
                                    <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                                    <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">CEP</label>
                                    <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Telefone</label>
                                    <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                                </div>
                            </div>
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
                                        <span className="font-medium text-gray-900">Cartão de Crédito</span>
                                    </div>
                                </label>
                                
                                {paymentMethod === 'card' && (
                                    <div className="pl-8 pt-2 pb-4 space-y-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 uppercase">Número do Cartão</label>
                                            <input type="text" placeholder="0000 0000 0000 0000" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 uppercase">Validade</label>
                                                <input type="text" placeholder="MM/AA" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 uppercase">CVV</label>
                                                <input type="text" placeholder="123" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <label className={`border p-4 rounded-lg flex items-center cursor-pointer transition-colors ${paymentMethod === 'pix' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                                    <input type="radio" name="payment" className="h-4 w-4 text-primary-600 focus:ring-primary-500" checked={paymentMethod === 'pix'} onChange={() => setPaymentMethod('pix')} />
                                    <div className="ml-3 flex items-center">
                                        <QrCode className="h-6 w-6 text-gray-700 mr-2" />
                                        <span className="font-medium text-gray-900">PIX (Aprovação Imediata)</span>
                                    </div>
                                </label>
                                
                                {paymentMethod === 'pix' && (
                                    <div className="pl-8 pt-2 pb-4">
                                        <div className="bg-gray-100 p-4 rounded text-sm text-center">
                                            <p className="mb-2">Escaneie o QR Code abaixo após finalizar:</p>
                                            <div className="h-32 w-32 bg-gray-300 mx-auto rounded flex items-center justify-center text-xs text-gray-500">QR CODE MOCK</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-fade-in">
                            <h2 className="text-xl font-bold mb-6">Revisar Pedido</h2>
                            <div className="space-y-4">
                                <div className="border-b pb-4">
                                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Itens</h3>
                                    {cart.map(item => (
                                        <div key={item.id} className="flex justify-between text-sm py-1">
                                            <span>{item.name} <span className="text-gray-500">x{item.quantity}</span></span>
                                            <span className="font-medium">R$ {((item.discountPrice || item.price) * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2">
                                    <span>Total a Pagar</span>
                                    <span className="text-primary-600">R$ {total.toFixed(2)}</span>
                                </div>
                                <div className="bg-green-50 text-green-700 p-4 rounded-md text-sm mt-4 flex items-center">
                                    <Truck className="h-5 w-5 mr-2" /> Entrega Padrão (3-5 Dias Úteis)
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex justify-between">
                        {step > 1 ? (
                            <button type="button" onClick={() => setStep(step - 1)} className="text-gray-600 hover:text-gray-900 font-medium">Voltar</button>
                        ) : (
                            <div></div>
                        )}
                        <button 
                            type="submit"
                            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-700 shadow-md transition-colors"
                        >
                            {step === 3 ? `Pagar R$ ${total.toFixed(2)}` : 'Continuar'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Summary Sidebar (Desktop) */}
            <div className="hidden lg:block">
                <div className="bg-gray-900 text-white rounded-xl shadow-lg p-6 sticky top-24">
                    <h3 className="text-lg font-bold mb-4">Resumo do Pedido</h3>
                    <div className="space-y-3 text-sm text-gray-300">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>R$ {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Frete</span>
                            <span>{subtotal > 300 ? 'Grátis' : 'R$ 35.00'}</span>
                        </div>
                        <div className="border-t border-gray-700 pt-3 flex justify-between font-bold text-white text-base">
                            <span>Total</span>
                            <span>R$ {total.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
                        <ShieldCheck className="h-4 w-4 mr-1" /> Checkout Seguro e Criptografado
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};