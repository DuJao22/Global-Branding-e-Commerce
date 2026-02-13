import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Code } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { storeConfig } = useShop();

  // Fallbacks para evitar erro caso o config ainda não tenha carregado
  const config = storeConfig || {
      storeName: 'Global Branding',
      email: 'suporte@globalbranding.com.br',
      phone: '(11) 99999-1234',
      address: 'Av. Inovação, 123',
      cityState: 'Tech City - SP',
      instagram: '#',
      facebook: '#',
      twitter: '#'
  };

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <img src="https://i.postimg.cc/KjSnyJWC/unnamed-1-removebg-preview.png" alt="Global Branding" className="h-8 w-auto grayscale brightness-200" />
                <h3 className="text-xl font-bold text-white">{config.storeName}</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Seu destino único para produtos premium. Qualidade, confiabilidade e excelente atendimento ao cliente.
            </p>
            <div className="flex space-x-4">
              {config.facebook && <a href={config.facebook} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>}
              {config.twitter && <a href={config.twitter} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>}
              {config.instagram && <a href={config.instagram} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary-400">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-primary-400">Todos os Produtos</a></li>
              <li><a href="#" className="hover:text-primary-400">Blog</a></li>
              <li><a href="#" className="hover:text-primary-400">Carreiras</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Atendimento</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary-400">Minha Conta</a></li>
              <li><a href="#" className="hover:text-primary-400">Rastrear Pedido</a></li>
              <li><a href="#" className="hover:text-primary-400">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-primary-400">Termos e Condições</a></li>
              <li><a href="#" className="hover:text-primary-400">Trocas e Devoluções</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Fale Conosco</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center"><MapPin className="h-4 w-4 mr-2" /> {config.address}, {config.cityState}</li>
              <li className="flex items-center"><Phone className="h-4 w-4 mr-2" /> {config.phone}</li>
              <li className="flex items-center"><Mail className="h-4 w-4 mr-2" /> {config.email}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col items-center justify-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} {config.storeName}. Todos os direitos reservados.</p>
          <div className="mt-4 flex items-center justify-center bg-gray-800 px-4 py-2 rounded-full border border-gray-700">
            <Code className="h-4 w-4 mr-2 text-primary-500" />
            <span>Desenvolvido por <span className="text-white font-bold tracking-wide">Joao Layon</span> - Full Stack Developer</span>
          </div>
        </div>
      </div>
    </footer>
  );
};