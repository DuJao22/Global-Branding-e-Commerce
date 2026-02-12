import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Check, CreditCard, Truck, MapPin, QrCode, ShieldCheck, Store, Search, ExternalLink, Wallet } from 'lucide-react';

export const Checkout: React.FC = () => {
  const { cart, user, placeOrder } = useShop();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
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
  // Frete é 0 se for Retirada OU se subtotal > 300 (regra de negócio antiga mantida para entrega)
  const shippingCost = deliveryMethod === 'pickup' ? 0 : (subtotal > 300 ? 0 : 35);
  const total = subtotal + shippingCost;

  // Busca CEP
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
                // Foca no número após preencher
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      placeOrder({ 
          paymentMethod, 
          deliveryMethod,
          address: deliveryMethod === 'delivery' ? address : 'Retirada na Loja',
          total 
      });
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
                <div className={`w-12 sm:w-24 h-1 mx-2 sm:mx-4 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
                <div className={`flex items-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                    <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${step >= 2 ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>
                        {step > 2 ? <Check className="h-5 w-5" /> : 2}
                    </div>
                    <span className="ml-2 font-medium">Pagamento</span>
                </div>
                <div className={`w-12 sm:w-24 h-1 mx-2 sm:mx-4 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
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
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
                    {step === 1 && (
                        <div className="animate-fade-in">
                            <h2 className="text-xl font-bold mb-6 flex items-center"><MapPin className="mr-2" /> Como deseja receber?</h2>
                            
                            {/* Delivery Toggle */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <button
                                    type="button"
                                    onClick={() => setDeliveryMethod('delivery')}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${deliveryMethod === 'delivery' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                                >
                                    <Truck className="h-8 w-8 mb-2" />
                                    <span className="font-bold">Receber em Casa</span>
                                    <span className="text-xs mt-1">Envio Rápido</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDeliveryMethod('pickup')}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${deliveryMethod === 'pickup' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                                >
                                    <Store className="h-8 w-8 mb-2" />
                                    <span className="font-bold">Retirar na Loja</span>
                                    <span className="text-xs mt-1 text-green-600 font-bold">Frete Grátis</span>
                                </button>
                            </div>

                            {deliveryMethod === 'delivery' ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                                            <input type="text" defaultValue={user?.name} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                                        </div>

                                        {/* CEP Integrado */}
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700">CEP</label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <input 
                                                    type="text" 
                                                    name="cep"
                                                    value={address.cep}
                                                    onChange={handleInputChange}
                                                    onBlur={handleCepBlur}
                                                    placeholder="00000-000"
                                                    maxLength={9}
                                                    required 
                                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 pr-10" 
                                                />
                                                {isLoadingCep && (
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                                                    </div>
                                                )}
                                            </div>
                                            <a 
                                                href="https://buscacepinter.correios.com.br/app/endereco/index.php" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-xs text-primary-600 hover:text-primary-800 mt-1 inline-flex items-center"
                                            >
                                                Não sei meu CEP <ExternalLink className="h-3 w-3 ml-1" />
                                            </a>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Endereço (Rua/Av)</label>
                                            <input 
                                                type="text" 
                                                name="street"
                                                value={address.street}
                                                onChange={handleInputChange}
                                                required 
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-gray-50" 
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Número</label>
                                            <input 
                                                id="address-number"
                                                type="text" 
                                                name="number"
                                                value={address.number}
                                                onChange={handleInputChange}
                                                required 
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" 
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Bairro</label>
                                            <input 
                                                type="text" 
                                                name="neighborhood"
                                                value={address.neighborhood}
                                                onChange={handleInputChange}
                                                required 
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-gray-50" 
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Cidade</label>
                                            <input 
                                                type="text" 
                                                name="city"
                                                value={address.city}
                                                onChange={handleInputChange}
                                                required 
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-gray-50" 
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Estado</label>
                                            <input 
                                                type="text" 
                                                name="state"
                                                value={address.state}
                                                onChange={handleInputChange}
                                                required 
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-gray-50" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center animate-fade-in">
                                    <Store className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                                    <h3 className="font-bold text-gray-900 text-lg mb-2">Loja Global Branding Central</h3>
                                    <p className="text-gray-600 mb-1">Av. Inovação, 123 - Tech City, SP</p>
                                    <p className="text-sm text-gray-500 mb-4">Segunda a Sexta: 09:00 - 18:00</p>
                                    <div className="bg-white p-3 rounded-lg border border-blue-100 text-sm text-blue-800 font-medium">
                                        Seu pedido estará pronto para retirada em até 2 horas após a confirmação do pagamento.
                                    </div>
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
                                        <span className="font-medium text-gray-900">Cartão de Crédito</span>
                                    </div>
                                </label>
                                
                                {paymentMethod === 'card' && (
                                    <div className="pl-8 pt-2 pb-4 space-y-4 animate-fade-in">
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
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">PIX</span>
                                            <span className="text-xs text-green-600 font-bold">Aprovação Imediata + 5% OFF</span>
                                        </div>
                                    </div>
                                </label>
                                
                                {paymentMethod === 'pix' && (
                                    <div className="pl-8 pt-2 pb-4 animate-fade-in">
                                        <div className="bg-gray-100 p-4 rounded text-sm text-center">
                                            <p className="mb-2">Escaneie o QR Code abaixo após finalizar:</p>
                                            <div className="h-32 w-32 bg-gray-300 mx-auto rounded flex items-center justify-center text-xs text-gray-500">QR CODE MOCK</div>
                                        </div>
                                    </div>
                                )}

                                {/* Opção Pagar na Retirada / Offline */}
                                <label className={`border p-4 rounded-lg flex items-center cursor-pointer transition-colors ${paymentMethod === 'offline' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                                    <input type="radio" name="payment" className="h-4 w-4 text-primary-600 focus:ring-primary-500" checked={paymentMethod === 'offline'} onChange={() => setPaymentMethod('offline')} />
                                    <div className="ml-3 flex items-center">
                                        <Wallet className="h-6 w-6 text-gray-700 mr-2" />
                                        <span className="font-medium text-gray-900">
                                            {deliveryMethod === 'pickup' ? 'Pagar na Retirada' : 'Pagar na Entrega'}
                                        </span>
                                    </div>
                                </label>

                                {paymentMethod === 'offline' && (
                                    <div className="pl-8 pt-2 pb-4 text-sm text-gray-600 animate-fade-in">
                                        <p>Você poderá pagar com Dinheiro, Cartão de Débito ou Crédito no momento {deliveryMethod === 'pickup' ? 'da retirada na loja' : 'do recebimento do produto'}.</p>
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
                                
                                <div className="py-2 border-b border-gray-100">
                                    <div className="flex justify-between text-gray-600 mb-1">
                                        <span>Subtotal</span>
                                        <span>R$ {subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Frete ({deliveryMethod === 'pickup' ? 'Retirada' : 'Entrega'})</span>
                                        <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
                                            {shippingCost === 0 ? 'Grátis' : `R$ ${shippingCost.toFixed(2)}`}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-between font-bold text-xl pt-2">
                                    <span>Total a Pagar</span>
                                    <span className="text-primary-600">R$ {total.toFixed(2)}</span>
                                </div>
                                
                                <div className="mt-4 bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                                    <div className="flex items-start">
                                        {deliveryMethod === 'pickup' ? <Store className="h-5 w-5 mr-2 text-primary-600 shrink-0"/> : <MapPin className="h-5 w-5 mr-2 text-primary-600 shrink-0"/>}
                                        <div>
                                            <p className="font-bold text-gray-900">{deliveryMethod === 'pickup' ? 'Retirar na Loja' : 'Entregar em:'}</p>
                                            {deliveryMethod === 'delivery' ? (
                                                <p className="text-gray-600">{address.street}, {address.number} - {address.city}/{address.state}</p>
                                            ) : (
                                                <p className="text-gray-600">Av. Inovação, 123 - Tech City, SP</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <Wallet className="h-5 w-5 mr-2 text-primary-600 shrink-0" />
                                        <div>
                                            <p className="font-bold text-gray-900">Pagamento:</p>
                                            <p className="text-gray-600">
                                                {paymentMethod === 'card' ? 'Cartão de Crédito (Site)' : 
                                                 paymentMethod === 'pix' ? 'PIX (Site)' : 
                                                 deliveryMethod === 'pickup' ? 'Pagar na Retirada' : 'Pagar na Entrega'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex justify-between">
                        {step > 1 ? (
                            <button type="button" onClick={() => setStep(step - 1)} className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded hover:bg-gray-100 transition-colors">Voltar</button>
                        ) : (
                            <div></div>
                        )}
                        <button 
                            type="submit"
                            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-700 shadow-md transition-all transform hover:-translate-y-1"
                        >
                            {step === 3 ? `Confirmar Compra` : 'Continuar'}
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
                            <span className={shippingCost === 0 ? "text-green-400 font-bold" : ""}>
                                {shippingCost === 0 ? 'Grátis' : `R$ ${shippingCost.toFixed(2)}`}
                            </span>
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