import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { User, Phone, Mail, Save, UserCircle, Package, LogOut, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { user, logout, updateUserProfile, orders } = useShop();
  
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    if (user) {
        setName(user.name || '');
        setWhatsapp(user.whatsapp || '');
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      setMessage(null);

      const success = await updateUserProfile(name, whatsapp);
      
      if (success) {
          setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      } else {
          setMessage({ type: 'error', text: 'Erro ao atualizar perfil. Tente novamente.' });
      }
      setIsSaving(false);
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Formata como (99) 99999-9999 simples
      const v = e.target.value.replace(/\D/g, '');
      setWhatsapp(v);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar / User Card */}
            <div className="w-full md:w-1/3">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-6 text-center border border-gray-100">
                    <div className="relative inline-block mb-4 group">
                        <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="h-32 w-32 rounded-full border-4 border-gray-50 object-cover mx-auto" 
                        />
                        <div className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-not-allowed opacity-80" title="Alterar foto (em breve)">
                             <Camera className="h-4 w-4" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                    <p className="text-gray-500 text-sm mb-6">{user.email}</p>

                    <div className="space-y-2">
                        <Link to="/orders" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
                            <span className="flex items-center"><Package className="h-5 w-5 mr-3 text-primary-500" /> Meus Pedidos</span>
                            <span className="bg-primary-100 text-primary-800 text-xs font-bold px-2 py-1 rounded-full">{orders.length}</span>
                        </Link>
                         <button onClick={logout} className="w-full flex items-center p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
                            <LogOut className="h-5 w-5 mr-3" /> Sair da Conta
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Form */}
            <div className="w-full md:w-2/3">
                <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Dados Pessoais</h1>
                        <UserCircle className="h-8 w-8 text-primary-200" />
                    </div>

                    {message && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            <span className="font-medium">{message.text}</span>
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2.5" 
                                        placeholder="Seu nome"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                                <div className="relative rounded-md shadow-sm opacity-60">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input 
                                        type="email" 
                                        value={user.email}
                                        readOnly
                                        className="bg-gray-50 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2.5 cursor-not-allowed" 
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                         <span className="text-gray-400 text-xs">Não editável</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp / Telefone</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={whatsapp}
                                        onChange={handleWhatsAppChange}
                                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2.5" 
                                        placeholder="11999999999"
                                    />
                                </div>
                                <p className="mt-1 text-sm text-gray-500">Usaremos este número para atualizações sobre seus pedidos.</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={isSaving}
                                className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isSaving ? 'Salvando...' : (
                                    <>
                                        <Save className="h-5 w-5 mr-2" /> Salvar Alterações
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};