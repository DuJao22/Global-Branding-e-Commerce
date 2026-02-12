import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Lock, Mail, User } from 'lucide-react';

export const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useShop();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Tenta fazer o login usando o serviço (que vai bater no SQLite Cloud)
    // O role 'admin' aqui é apenas um hint, o que importa é o que volta do banco
    const roleHint = email === 'DUJAO' || email.includes('admin') ? 'admin' : 'customer';
    
    const success = await login(email, roleHint);
    
    if (success) {
        if (email === 'DUJAO' || email.includes('admin')) {
             navigate('/admin');
        } else {
             navigate('/');
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-primary-600 hover:text-primary-500">
            {isLogin ? 'registre-se gratuitamente' : 'entrar em conta existente'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
               <div>
                  <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="text" required className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2" placeholder="João Silva" />
                  </div>
               </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Login ou E-mail
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                  placeholder="Seu login ou email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Lembrar de mim
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {isLogin ? 'Entrar' : 'Criar Conta'}
              </button>
            </div>
          </form>

          <div className="mt-6">
             <div className="relative">
                <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                   <span className="px-2 bg-white text-gray-500">Credenciais de Demo</span>
                </div>
             </div>
             <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-center text-gray-500">
                <div className="p-2 border rounded cursor-pointer hover:bg-gray-50" onClick={() => {setEmail('user@globalbranding.com'); setPassword('123456');}}>
                   Usuário: user@globalbranding.com
                </div>
                <div className="p-2 border rounded cursor-pointer hover:bg-gray-50" onClick={() => {setEmail('DUJAO'); setPassword('30031936Vo.');}}>
                   Admin: DUJAO
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};