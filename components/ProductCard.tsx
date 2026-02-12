import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useShop();

  return (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link to={`/product/${product.id}`}>
            <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
        </Link>
        {product.discountPrice && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            OFERTA
          </span>
        )}
        {product.isNew && !product.discountPrice && (
          <span className="absolute top-2 left-2 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded">
            NOVO
          </span>
        )}
        <button 
            onClick={() => addToCart(product)}
            className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-md text-gray-800 hover:text-primary-600 hover:bg-primary-50 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
            title="Adicionar ao Carrinho"
        >
            <ShoppingCart className="h-5 w-5" />
        </button>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-gray-500 mb-1">{product.category}</div>
        <Link to={`/product/${product.id}`} className="block">
            <h3 className="text-gray-900 font-semibold text-lg mb-1 truncate hover:text-primary-600 transition-colors">{product.name}</h3>
        </Link>
        
        <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
                ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({product.reviewsCount})</span>
        </div>
        
        <div className="mt-auto flex items-end justify-between">
            <div className="flex flex-col">
                {product.discountPrice ? (
                    <>
                        <span className="text-xs text-gray-400 line-through">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        <span className="text-lg font-bold text-gray-900">R$ {product.discountPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </>
                ) : (
                    <span className="text-lg font-bold text-gray-900">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};