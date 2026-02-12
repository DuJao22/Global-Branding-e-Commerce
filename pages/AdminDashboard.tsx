import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Navigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Package, DollarSign, ShoppingBag, Users, Plus, Image as ImageIcon, Tag, LayoutGrid, List } from 'lucide-react';
import { CATEGORIES } from '../constants';

const data = [
  { name: 'Jan', sales: 4000 },
  { name: 'Fev', sales: 3000 },
  { name: 'Mar', sales: 2000 },
  { name: 'Abr', sales: 2780 },
  { name: 'Mai', sales: 1890 },
  { name: 'Jun', sales: 2390 },
  { name: 'Jul', sales: 3490 },
];

export const AdminDashboard: React.FC = () => {
  const { user, products, orders, addProduct } = useShop();
  const [activeTab, setActiveTab] = useState<'overview' | 'products'>('overview');
  
  // Form State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    customCategory: '',
    image: '',
    stock: '',
    sku: ''
  });

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const totalSales = 75420; 
  const totalOrders = orders.length + 42; 

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const finalCategory = newProduct.category === 'new' ? newProduct.customCategory : newProduct.category;

    const success = await addProduct({
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        discountPrice: newProduct.discountPrice ? Number(newProduct.discountPrice) : undefined,
        category: finalCategory,
        image: newProduct.image || 'https://via.placeholder.com/400',
        stock: Number(newProduct.stock) || 0,
        sku: newProduct.sku || `SKU-${Date.now()}`,
        rating: 5, // Default for new products
        reviewsCount: 0,
        isNew: true
    });

    if (success) {
        alert('Produto adicionado com sucesso!');
        setIsAddingProduct(false);
        setNewProduct({
            name: '', description: '', price: '', discountPrice: '', 
            category: '', customCategory: '', image: '', stock: '', sku: ''
        });
    } else {
        alert('Erro ao adicionar produto.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Painel Administrativo</h1>
            <div className="flex space-x-2 bg-white p-1 rounded-lg shadow-sm">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    <LayoutGrid className="inline-block w-4 h-4 mr-2" /> Visão Geral
                </button>
                <button 
                    onClick={() => setActiveTab('products')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    <List className="inline-block w-4 h-4 mr-2" /> Produtos
                </button>
            </div>
        </div>

        {activeTab === 'overview' ? (
            <div className="animate-fade-in">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                            <DollarSign className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Receita Total</p>
                            <p className="text-2xl font-bold text-gray-900">R$ {totalSales.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                            <ShoppingBag className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total de Pedidos</p>
                            <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                            <Package className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Produtos</p>
                            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                            <Users className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Clientes</p>
                            <p className="text-2xl font-bold text-gray-900">1.240</p>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Visão Geral de Receita</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="sales" stroke="#0ea5e9" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Vendas por Categoria</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{fill: '#f3f4f6'}} />
                                    <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="animate-fade-in space-y-6">
                {/* Product Management Header */}
                <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Gestão de Inventário</h2>
                        <p className="text-sm text-gray-500">Gerencie seus produtos e categorias aqui.</p>
                    </div>
                    <button 
                        onClick={() => setIsAddingProduct(!isAddingProduct)}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center transition-colors"
                    >
                        {isAddingProduct ? 'Cancelar' : <><Plus className="h-4 w-4 mr-2" /> Adicionar Produto</>}
                    </button>
                </div>

                {/* Add Product Form */}
                {isAddingProduct && (
                    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-primary-500 animate-fade-in-down">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Novo Produto</h3>
                        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2 px-3 border"
                                    placeholder="Ex: Faca Damasco Premium"
                                    value={newProduct.name}
                                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                <textarea 
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2 px-3 border"
                                    rows={3}
                                    placeholder="Detalhes do produto..."
                                    value={newProduct.description}
                                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-500">R$</span>
                                    <input 
                                        type="number" 
                                        required
                                        step="0.01"
                                        className="w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2 px-3 border"
                                        value={newProduct.price}
                                        onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preço Promocional (Opcional)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-500">R$</span>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        className="w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2 px-3 border"
                                        value={newProduct.discountPrice}
                                        onChange={e => setNewProduct({...newProduct, discountPrice: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                                <select 
                                    required
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2 px-3 border bg-white"
                                    value={newProduct.category}
                                    onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                                >
                                    <option value="">Selecione...</option>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    <option value="new">+ Criar Nova Categoria</option>
                                </select>
                                {newProduct.category === 'new' && (
                                    <input 
                                        type="text" 
                                        placeholder="Digite a nova categoria"
                                        className="mt-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2 px-3 border animate-fade-in"
                                        value={newProduct.customCategory}
                                        onChange={e => setNewProduct({...newProduct, customCategory: e.target.value})}
                                    />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                                <input 
                                    type="text" 
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2 px-3 border"
                                    placeholder="Código Único"
                                    value={newProduct.sku}
                                    onChange={e => setNewProduct({...newProduct, sku: e.target.value})}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <ImageIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <input 
                                            type="text" 
                                            className="w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2 px-3 border"
                                            placeholder="https://..."
                                            value={newProduct.image}
                                            onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                                        />
                                    </div>
                                    <input 
                                        type="number" 
                                        placeholder="Estoque"
                                        className="w-32 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2 px-3 border"
                                        value={newProduct.stock}
                                        onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Recomendamos usar imagens do Unsplash ou hospedadas.</p>
                            </div>

                            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setIsAddingProduct(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit"
                                    className="px-6 py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 shadow-md"
                                >
                                    Salvar Produto
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Product List Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900">Catálogo Atual ({products.length} itens)</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Produto</th>
                                    <th className="px-6 py-3 font-medium">Categoria</th>
                                    <th className="px-6 py-3 font-medium">Preço</th>
                                    <th className="px-6 py-3 font-medium">Estoque</th>
                                    <th className="px-6 py-3 font-medium text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <img src={product.image} alt="" className="h-10 w-10 rounded-md object-cover bg-gray-100" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                <div className="text-xs text-gray-500">{product.sku}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            R$ {product.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`${product.stock > 0 ? 'text-green-600' : 'text-red-600 font-bold'}`}>
                                                {product.stock} un.
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <button className="text-primary-600 hover:text-primary-900 mr-3">Editar</button>
                                            <button className="text-red-600 hover:text-red-900">Excluir</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};