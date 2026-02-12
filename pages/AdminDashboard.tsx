import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Navigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Package, DollarSign, ShoppingBag, Users, Plus, Image as ImageIcon, LayoutGrid, List, Eye, X, ChevronRight, Calendar, CreditCard } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { Order } from '../types';

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
  const { user, products, orders, addProduct, updateOrderStatus } = useShop();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  
  // States para Modal de Pedidos
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

  const formatPrice = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Verifica se a data é válida
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
  };

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

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Paid': return 'bg-green-100 text-green-800';
          case 'Processing': return 'bg-blue-100 text-blue-800';
          case 'Shipped': return 'bg-purple-100 text-purple-800';
          case 'Delivered': return 'bg-gray-100 text-gray-800';
          case 'Cancelled': return 'bg-red-100 text-red-800';
          default: return 'bg-yellow-100 text-yellow-800';
      }
  };

  const getStatusLabel = (status: string) => {
      switch(status) {
          case 'Pending': return 'Pendente';
          case 'Paid': return 'Pagamento Recebido';
          case 'Processing': return 'Separando Pedido';
          case 'Shipped': return 'Enviado';
          case 'Delivered': return 'Entregue';
          case 'Cancelled': return 'Cancelado';
          default: return status;
      }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 relative">
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
                <button 
                    onClick={() => setActiveTab('orders')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    <ShoppingBag className="inline-block w-4 h-4 mr-2" /> Pedidos
                </button>
            </div>
        </div>

        {activeTab === 'overview' && (
            <div className="animate-fade-in">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                            <DollarSign className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Receita Total</p>
                            <p className="text-2xl font-bold text-gray-900">{formatPrice(totalSales)}</p>
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
        )}

        {activeTab === 'products' && (
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
                                            {formatPrice(product.price)}
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

        {activeTab === 'orders' && (
             <div className="animate-fade-in space-y-6">
                 <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Gerenciamento de Pedidos</h2>
                    <p className="text-gray-500 text-sm">Acompanhe e atualize o status dos pedidos dos clientes.</p>
                 </div>

                 <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3 font-medium">ID Pedido</th>
                                    <th className="px-6 py-3 font-medium">Cliente</th>
                                    <th className="px-6 py-3 font-medium">Data/Hora</th>
                                    <th className="px-6 py-3 font-medium">Total</th>
                                    <th className="px-6 py-3 font-medium">Itens</th>
                                    <th className="px-6 py-3 font-medium">Status Atual</th>
                                    <th className="px-6 py-3 font-medium">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 group">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                            <button 
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-primary-600 font-bold hover:underline"
                                            >
                                                {order.id}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {order.customerName || `Usuário #${order.id.slice(-4)}`}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatDate(order.date)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                            {formatPrice(order.total)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {order.items.length} itens
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button 
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-2 bg-gray-100 rounded-md text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                                                    title="Ver Detalhes"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <select 
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                                                    className="block w-full max-w-[140px] text-sm border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 p-1.5 bg-white border"
                                                >
                                                    <option value="Pending">Pendente</option>
                                                    <option value="Paid">Pagamento Recebido</option>
                                                    <option value="Processing">Separando Pedido</option>
                                                    <option value="Shipped">Enviado</option>
                                                    <option value="Delivered">Entregue</option>
                                                    <option value="Cancelled">Cancelado</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                            Nenhum pedido encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                 </div>
             </div>
        )}
      </div>

      {/* Modal de Detalhes do Pedido */}
      {selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div 
                    className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" 
                    aria-hidden="true"
                    onClick={() => setSelectedOrder(null)}
                ></div>

                {/* Modal Panel */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
                    
                    {/* Header */}
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between items-center border-b border-gray-100">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center" id="modal-title">
                            <ShoppingBag className="h-5 w-5 mr-2 text-primary-600" /> Detalhes do Pedido <span className="ml-2 font-mono text-gray-500 text-sm">#{selectedOrder.id}</span>
                        </h3>
                        <button 
                            type="button" 
                            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                            onClick={() => setSelectedOrder(null)}
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="space-y-2">
                                <p className="text-sm text-gray-500">Cliente</p>
                                <p className="font-medium text-gray-900">{selectedOrder.customerName || 'Cliente'}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-500 flex items-center"><Calendar className="h-3 w-3 mr-1" /> Data</p>
                                <p className="font-medium text-gray-900">{formatDate(selectedOrder.date)}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-500 flex items-center"><DollarSign className="h-3 w-3 mr-1" /> Total</p>
                                <p className="font-bold text-lg text-primary-600">{formatPrice(selectedOrder.total)}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-500">Status Atual</p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                                    {getStatusLabel(selectedOrder.status)}
                                </span>
                            </div>
                        </div>

                        <h4 className="font-medium text-gray-900 mb-3 flex items-center border-t border-gray-100 pt-4">
                            <List className="h-4 w-4 mr-2" /> Itens do Pedido
                        </h4>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd</th>
                                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Preço Un.</th>
                                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {selectedOrder.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img className="h-10 w-10 rounded object-cover" src={item.image} alt="" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]">{item.name}</div>
                                                        <div className="text-xs text-gray-500">{item.sku}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {item.quantity}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                                                {formatPrice(item.discountPrice || item.price)}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                                {formatPrice((item.discountPrice || item.price) * item.quantity)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button 
                            type="button" 
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={() => setSelectedOrder(null)}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
          </div>
      )}
    </div>
  );
};