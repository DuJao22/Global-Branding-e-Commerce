import React from 'react';
import { useShop } from '../context/ShopContext';
import { Navigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Package, DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';

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
  const { user, products, orders } = useShop();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const totalSales = 75420; // Mock total
  const totalOrders = orders.length + 42; // Mock + Context orders

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Painel Administrativo</h1>

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

        {/* Recent Orders Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Pedidos Recentes</h3>
                <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">Ver Todos</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3 font-medium">ID do Pedido</th>
                            <th className="px-6 py-3 font-medium">Cliente</th>
                            <th className="px-6 py-3 font-medium">Data</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {[
                            { id: '#PED-7782', cust: 'Alice Silva', date: '15 Out 2023', status: 'Entregue', total: 'R$ 649,50', statusColor: 'bg-green-100 text-green-800' },
                            { id: '#PED-9921', cust: 'Bruno Souza', date: '02 Nov 2023', status: 'Enviado', total: 'R$ 249,90', statusColor: 'bg-blue-100 text-blue-800' },
                            { id: '#PED-1102', cust: 'Carlos Mendes', date: '20 Nov 2023', status: 'Processando', total: 'R$ 3.299,90', statusColor: 'bg-yellow-100 text-yellow-800' },
                            { id: '#PED-5543', cust: 'Diana Prates', date: '01 Dez 2023', status: 'Pendente', total: 'R$ 449,00', statusColor: 'bg-gray-100 text-gray-800' },
                        ].map((order, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{order.cust}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.statusColor}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">{order.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};