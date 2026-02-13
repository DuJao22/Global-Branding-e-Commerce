import { Product, User, Order, StoreConfig } from '../types';
import { MOCK_PRODUCTS, MOCK_ORDERS } from '../constants';

// A URL agora é sempre relativa (vazia) porque configuramos um Proxy no vite.config.ts
// Isso redireciona /api para http://localhost:3000 automaticamente em desenvolvimento
// e funciona nativamente em produção (mesmo domínio).
const API_URL = ''; 

export const initDatabase = async () => {
  // A inicialização agora ocorre no servidor ao iniciar (server.js)
  console.log("App conectado à API.");
};

// --- FUNÇÕES DE SERVIÇO (FRONTEND -> API) ---

export const dbService = {
  // Store Config
  getStoreConfig: async (): Promise<StoreConfig | null> => {
      try {
          const res = await fetch(`${API_URL}/api/config`);
          if (!res.ok) throw new Error('Falha ao buscar config');
          return await res.json();
      } catch (e) {
          // Fallback silencioso para não quebrar a UI se o backend estiver offline
          console.warn("Backend não detectado ou erro de conexão. Usando padrões.");
          return null;
      }
  },

  updateStoreConfig: async (config: StoreConfig): Promise<boolean> => {
      try {
          const res = await fetch(`${API_URL}/api/config`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(config)
          });
          return res.ok;
      } catch (e) {
          console.error(e);
          return false;
      }
  },

  // Produtos
  getProducts: async (): Promise<Product[]> => {
    try {
        const res = await fetch(`${API_URL}/api/products`);
        if (!res.ok) throw new Error('API Offline');
        return await res.json();
    } catch (e) {
        console.warn("API Offline, carregando produtos mockados.");
        return MOCK_PRODUCTS;
    }
  },

  addProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Erro ao criar produto');
    return await res.json();
  },

  // Usuários
  login: async (email: string, password: string): Promise<User | null> => {
    try {
        const res = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (res.ok) {
            return await res.json();
        }
        return null;
    } catch (e) {
        console.warn("API Offline, tentando login demo local.");
        // Fallback para demonstração sem backend
        if (email === 'user@globalbranding.com' && password === '123456') {
             return { id: 999, name: 'Cliente Demo', email, role: 'customer', avatar: 'https://ui-avatars.com/api/?name=User' };
        }
        if (email === 'DUJAO' && password === '30031936Vo.') {
             return { id: 1, name: 'Admin Dujao', email, role: 'admin', avatar: 'https://ui-avatars.com/api/?name=Admin' };
        }
        return null;
    }
  },

  updateUserProfile: async (userId: number, name: string, whatsapp: string): Promise<boolean> => {
    try {
        const res = await fetch(`${API_URL}/api/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, whatsapp })
        });
        return res.ok;
    } catch (e) {
        console.error(e);
        return false;
    }
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    if (!res.ok) throw new Error('Erro ao registrar');
    return await res.json();
  },

  // Pedidos
  createOrder: async (order: Order, userId: number) => {
    try {
        await fetch(`${API_URL}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: order.id,
                userId,
                date: order.date,
                total: order.total,
                status: order.status,
                items: order.items
            })
        });
    } catch (e) {
        console.error("Erro ao criar pedido (Backend Offline?)", e);
    }
  },

  updateOrderStatus: async (orderId: string, newStatus: string) => {
    try {
        await fetch(`${API_URL}/api/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
    } catch (e) {
        console.error(e);
    }
  },

  getOrdersByUser: async (userId: number): Promise<Order[]> => {
    try {
        const res = await fetch(`${API_URL}/api/orders?userId=${userId}`);
        if (!res.ok) throw new Error('API Error');
        return await res.json();
    } catch (e) {
        console.warn("API Offline, sem histórico de pedidos.");
        return [];
    }
  },

  getAllOrders: async (): Promise<Order[]> => {
    try {
        const res = await fetch(`${API_URL}/api/orders`); // Admin endpoint (sem userId)
        if (!res.ok) throw new Error('API Error');
        return await res.json();
    } catch (e) {
        console.warn("API Offline, carregando pedidos mockados.");
        return MOCK_ORDERS.map(o => ({...o, items: []} as any));
    }
  },

  // Stripe
  createCheckoutSession: async (items: any[], orderId: string): Promise<string | null> => {
      try {
          const res = await fetch(`${API_URL}/api/create-checkout-session`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items, orderId })
          });
          const data = await res.json();
          return data.url;
      } catch (e) {
          console.error("Erro no Stripe:", e);
          return null;
      }
  }
};