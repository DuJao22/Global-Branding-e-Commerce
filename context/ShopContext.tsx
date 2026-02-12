import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, User, Order } from '../types';
import { initDatabase, dbService } from '../services/db';

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  user: User | null;
  orders: Order[];
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  placeOrder: (details: any) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<boolean>;
  updateOrderStatus: (orderId: string, newStatus: Order['status']) => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Inicialização e Carregamento de Dados
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        // 1. Inicializa DB (Cria tabelas/Seeds)
        await initDatabase();
        
        // 2. Busca Produtos
        const dbProducts = await dbService.getProducts();
        setProducts(dbProducts);

        // 3. Restaura Carrinho do LocalStorage (Carrinho permanece local para performance)
        const savedCart = localStorage.getItem('gb_cart');
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }

        // 4. Restaura Sessão do Usuário
        const savedUser = localStorage.getItem('gb_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          // Carrega pedidos do usuário
          if (parsedUser.role === 'admin') {
             const allOrders = await dbService.getAllOrders();
             setOrders(allOrders);
          } else {
             const userOrders = await dbService.getOrdersByUser(parsedUser.id);
             setOrders(userOrders);
          }
        }
      } catch (error) {
        console.error("Erro ao inicializar loja:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('gb_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev =>
      prev.map(item => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const login = async (email: string, password: string) => {
    try {
        const dbUser = await dbService.login(email, password);
        
        if (dbUser) {
            setUser(dbUser);
            localStorage.setItem('gb_user', JSON.stringify(dbUser));
            
            // Carregar pedidos após login
            if (dbUser.role === 'admin') {
                const allOrders = await dbService.getAllOrders();
                setOrders(allOrders);
            } else {
                const userOrders = await dbService.getOrdersByUser(dbUser.id);
                setOrders(userOrders);
            }
            return true;
        } else {
            alert("Credenciais inválidas. Verifique seu login e senha.");
            return false;
        }
    } catch (e) {
        console.error(e);
        return false;
    }
  };

  const logout = () => {
    setUser(null);
    setOrders([]);
    localStorage.removeItem('gb_user');
  };

  const placeOrder = async (details: any) => {
    if (!user) {
        alert("Você precisa estar logado para finalizar a compra.");
        return;
    }

    const newOrder: Order = {
      id: `PED-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toISOString().split('T')[0],
      total: cart.reduce((sum, item) => sum + (item.discountPrice || item.price) * item.quantity, 0),
      status: 'Paid',
      items: [...cart]
    };

    try {
        await dbService.createOrder(newOrder, user.id);
        setOrders(prev => [newOrder, ...prev]);
        clearCart();
        alert("Pagamento realizado com sucesso! Pedido confirmado e salvo no banco de dados.");
    } catch (error) {
        console.error("Erro ao salvar pedido:", error);
        alert("Erro ao processar pedido no banco de dados.");
    }
  };

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
        setIsLoading(true);
        const newProduct = await dbService.addProduct(productData);
        setProducts(prev => [newProduct, ...prev]);
        return true;
    } catch (error) {
        console.error("Erro ao adicionar produto:", error);
        return false;
    } finally {
        setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
        await dbService.updateOrderStatus(orderId, newStatus);
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
        alert("Erro ao atualizar status do pedido.");
    }
  };

  return (
    <ShopContext.Provider
      value={{ products, cart, user, orders, isLoading, addToCart, removeFromCart, updateQuantity, clearCart, login, logout, placeOrder, addProduct, updateOrderStatus }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within a ShopProvider");
  return context;
};