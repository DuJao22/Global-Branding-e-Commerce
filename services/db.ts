import { Database } from '@sqlitecloud/drivers';
import { Product, User, Order } from '../types';
import { MOCK_PRODUCTS } from '../constants';

// *** CONNECTION STRING DO SQLITE CLOUD ***
const CONNECTION_STRING = 'sqlitecloud://cbw4nq6vvk.g5.sqlite.cloud:8860/global-branding.db?apikey=CCfQtOyo5qbyni96cUwEdIG4q2MRcEXpRHGoNpELtNc';

let dbInstance: Database | null = null;

export const getDb = async () => {
  if (dbInstance) return dbInstance;

  if (CONNECTION_STRING.includes('x.x.x.x')) {
    console.warn("⚠️ AVISO: A Connection String do SQLite Cloud não foi configurada em services/db.ts. O app pode não carregar dados.");
  }

  dbInstance = new Database(CONNECTION_STRING);
  return dbInstance;
};

// Inicializa o Banco de Dados (Cria tabelas se não existirem e popula dados iniciais)
export const initDatabase = async () => {
  const db = await getDb();

  // 1. Tabela de Usuários
  await db.sql`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('customer', 'admin')),
      avatar TEXT
    );
  `;

  // 2. Tabela de Produtos
  await db.sql`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      discount_price REAL,
      sku TEXT,
      category TEXT,
      image TEXT,
      rating REAL,
      reviews_count INTEGER,
      stock INTEGER,
      is_new INTEGER
    );
  `;

  // 3. Tabela de Pedidos
  await db.sql`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id INTEGER,
      date TEXT,
      total REAL,
      status TEXT,
      items_json TEXT, 
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `;

  // --- SEEDING (Popular dados se as tabelas estiverem vazias) ---

  // Check Products
  const productsCountResult = await db.sql`SELECT COUNT(*) as count FROM products`;
  const productsCount = productsCountResult[0].count;
  
  if (productsCount === 0) {
    console.log("Populando tabela de produtos...");
    for (const p of MOCK_PRODUCTS) {
      await db.sql`
        INSERT INTO products (name, description, price, discount_price, sku, category, image, rating, reviews_count, stock, is_new)
        VALUES (${p.name}, ${p.description}, ${p.price}, ${p.discountPrice || null}, ${p.sku}, ${p.category}, ${p.image}, ${p.rating}, ${p.reviewsCount}, ${p.stock}, ${p.isNew ? 1 : 0})
      `;
    }
  }

  // Seed Usuários
  const usersCountResult = await db.sql`SELECT COUNT(*) as count FROM users`;
  const usersCount = usersCountResult[0].count;

  if (usersCount === 0) {
    console.log("Populando usuários iniciais...");
    
    // Admin Personalizado (DUJAO)
    await db.sql`
      INSERT INTO users (name, email, password, role, avatar)
      VALUES ('Admin Dujao', 'DUJAO', '30031936Vo.', 'admin', 'https://ui-avatars.com/api/?name=Dujao&background=0ea5e9&color=fff')
    `;

    // Cliente Demo
    await db.sql`
      INSERT INTO users (name, email, password, role, avatar)
      VALUES ('Cliente Demo', 'user@globalbranding.com', '123456', 'customer', 'https://ui-avatars.com/api/?name=User&background=64748b&color=fff')
    `;
  }
};

// --- FUNÇÕES DE SERVIÇO ---

export const dbService = {
  // Produtos
  getProducts: async (): Promise<Product[]> => {
    const db = await getDb();
    const rows = await db.sql`SELECT * FROM products ORDER BY id DESC`;
    return rows.map((row: any) => ({
      ...row,
      discountPrice: row.discount_price,
      reviewsCount: row.reviews_count,
      isNew: row.is_new === 1
    }));
  },

  addProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const db = await getDb();
    const result = await db.sql`
      INSERT INTO products (name, description, price, discount_price, sku, category, image, rating, reviews_count, stock, is_new)
      VALUES (${product.name}, ${product.description}, ${product.price}, ${product.discountPrice || null}, ${product.sku}, ${product.category}, ${product.image}, ${product.rating}, ${product.reviewsCount}, ${product.stock}, ${product.isNew ? 1 : 0})
    `;
    
    // SQLite Cloud usually returns meta info. We fetch the last inserted item.
    // Assuming simple sequential ID for this context or fetching back via SKU/Name
    const rows = await db.sql`SELECT * FROM products ORDER BY id DESC LIMIT 1`;
    const row = rows[0];

    return {
      ...row,
      discountPrice: row.discount_price,
      reviewsCount: row.reviews_count,
      isNew: row.is_new === 1
    };
  },

  // Usuários
  login: async (email: string, password: string): Promise<User | null> => {
    const db = await getDb();
    const result = await db.sql`SELECT * FROM users WHERE email = ${email} AND password = ${password} LIMIT 1`;
    
    if (result && result.length > 0) {
      return result[0] as User;
    }
    return null;
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    const db = await getDb();
    const avatar = `https://ui-avatars.com/api/?name=${name}&background=0ea5e9&color=fff`;
    
    await db.sql`
      INSERT INTO users (name, email, password, role, avatar)
      VALUES (${name}, ${email}, ${password}, 'customer', ${avatar})
    `;
    
    const result = await db.sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
    return result[0] as User;
  },

  // Pedidos
  createOrder: async (order: Order, userId: number) => {
    const db = await getDb();
    const itemsJson = JSON.stringify(order.items);
    
    await db.sql`
      INSERT INTO orders (id, user_id, date, total, status, items_json)
      VALUES (${order.id}, ${userId}, ${order.date}, ${order.total}, ${order.status}, ${itemsJson})
    `;
  },

  updateOrderStatus: async (orderId: string, newStatus: string) => {
    const db = await getDb();
    await db.sql`UPDATE orders SET status = ${newStatus} WHERE id = ${orderId}`;
  },

  getOrdersByUser: async (userId: number): Promise<Order[]> => {
    const db = await getDb();
    const rows = await db.sql`SELECT * FROM orders WHERE user_id = ${userId} ORDER BY date DESC`;
    
    return rows.map((row: any) => ({
      id: row.id,
      date: row.date,
      total: row.total,
      status: row.status,
      items: JSON.parse(row.items_json || '[]')
    }));
  },

  getAllOrders: async (): Promise<Order[]> => {
    const db = await getDb();
    // JOIN para pegar o nome do usuário
    const rows = await db.sql`
        SELECT orders.*, users.name as user_name 
        FROM orders 
        JOIN users ON orders.user_id = users.id 
        ORDER BY orders.date DESC
    `;
    
    return rows.map((row: any) => ({
      id: row.id,
      date: row.date,
      total: row.total,
      status: row.status,
      items: JSON.parse(row.items_json || '[]'),
      customerName: row.user_name
    }));
  }
};