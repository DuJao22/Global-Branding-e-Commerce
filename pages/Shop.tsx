import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { CATEGORIES } from '../constants';

export const Shop: React.FC = () => {
  const { products } = useShop();
  const [searchParams] = useSearchParams();
  
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [priceRange, setPriceRange] = useState(5000);
  const [sortOption, setSortOption] = useState('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const searchTerm = searchParams.get('search') || '';

  useEffect(() => {
    let result = products;

    // Search Filter
    if (searchTerm) {
        result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Price Filter
    result = result.filter(p => (p.discountPrice || p.price) <= priceRange);

    // Sorting
    if (sortOption === 'price-asc') {
      result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sortOption === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, priceRange, sortOption, searchTerm]);

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">
                {searchTerm ? `Resultados para "${searchTerm}"` : 'Todos os Produtos'}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
                Mostrando {filteredProducts.length} resultados
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
            
          {/* Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Filter className="h-5 w-5 mr-2" /> Categorias
                </h3>
                <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                        <input 
                            type="radio" 
                            name="category" 
                            className="text-primary-600 focus:ring-primary-500" 
                            checked={selectedCategory === 'All'}
                            onChange={() => setSelectedCategory('All')}
                        />
                        <span className="ml-2 text-gray-700">Todas as Categorias</span>
                    </label>
                    {CATEGORIES.map(cat => (
                        <label key={cat} className="flex items-center cursor-pointer">
                             <input 
                                type="radio" 
                                name="category" 
                                className="text-primary-600 focus:ring-primary-500" 
                                checked={selectedCategory === cat}
                                onChange={() => setSelectedCategory(cat)}
                            />
                            <span className="ml-2 text-gray-700">{cat}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                 <h3 className="text-lg font-medium text-gray-900 mb-4">Faixa de Preço</h3>
                 <input 
                    type="range" 
                    min="0" 
                    max="5000"
                    step="50" 
                    value={priceRange} 
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                 />
                 <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>R$ 0</span>
                    <span>R$ {priceRange}</span>
                 </div>
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
              <button 
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
                <SlidersHorizontal className="h-4 w-4 mr-2" /> Filtros
              </button>
              
              {mobileFiltersOpen && (
                  <div className="mt-4 p-4 bg-white rounded-lg shadow space-y-4">
                       <div>
                            <h4 className="font-medium mb-2">Categorias</h4>
                            <select 
                                value={selectedCategory} 
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            >
                                <option value="All">Todas as Categorias</option>
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                       </div>
                       <div>
                            <h4 className="font-medium mb-2">Preço Máximo: R$ {priceRange}</h4>
                            <input 
                                type="range" 
                                min="0" 
                                max="5000" 
                                step="50"
                                value={priceRange} 
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full"
                            />
                       </div>
                  </div>
              )}
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
                <div className="hidden sm:block"></div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Ordenar por:</span>
                    <select 
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500 p-1"
                    >
                        <option value="featured">Destaques</option>
                        <option value="price-asc">Preço: Menor para Maior</option>
                        <option value="price-desc">Preço: Maior para Menor</option>
                        <option value="rating">Melhor Avaliados</option>
                    </select>
                </div>
            </div>

            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24">
                    <p className="text-gray-500 text-lg">Nenhum produto encontrado com estes filtros.</p>
                    <button 
                        onClick={() => { setSelectedCategory('All'); setPriceRange(5000); }}
                        className="mt-4 text-primary-600 font-medium hover:underline"
                    >
                        Limpar filtros
                    </button>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};