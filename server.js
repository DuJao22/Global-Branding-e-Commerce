import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Database } from '@sqlitecloud/drivers';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';

// Configurar variáveis de ambiente
dotenv.config();

// Configuração para __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// *** CONFIGURAÇÃO STRIPE ***
// Em produção, use process.env.STRIPE_SECRET_KEY
// Esta é uma chave de teste pública apenas para demonstração da estrutura
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_demo_key_placeholder', {
  apiVersion: '2023-10-16',
});

// *** BANCO DE DADOS (Server Side - Seguro) ***
const CONNECTION_STRING = process.env.DATABASE_URL || 'sqlitecloud://cbw4nq6vvk.g5.sqlite.cloud:8860/global-branding.db?apikey=CCfQtOyo5qbyni96cUwEdIG4q2MRcEXpRHGoNpELtNc';
const db = new Database(CONNECTION_STRING);

// Inicialização do Banco (Executa ao iniciar o servidor)
const initDatabase = async () => {
  try {
    console.log('Inicializando banco de dados...');
    
    await db.sql`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL, avatar TEXT, whatsapp TEXT)`;
    await db.sql`CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, price REAL NOT NULL, discount_price REAL, sku TEXT, category TEXT, image TEXT, rating REAL, reviews_count INTEGER, stock INTEGER, is_new INTEGER)`;
    await db.sql`CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, user_id INTEGER, date TEXT, total REAL, status TEXT, items_json TEXT, FOREIGN KEY(user_id) REFERENCES users(id))`;
    await db.sql`CREATE TABLE IF NOT EXISTS store_config (id INTEGER PRIMARY KEY AUTOINCREMENT, store_name TEXT, email TEXT, phone TEXT, address TEXT, city_state TEXT, instagram TEXT, facebook TEXT, twitter TEXT)`;
    
    // Seed Config se vazio
    const configCheck = await db.sql`SELECT id FROM store_config LIMIT 1`;
    if (configCheck.length === 0) {
        console.log('Inserindo configuração padrão...');
        await db.sql`INSERT INTO store_config (store_name, email, phone, address, city_state) VALUES ('Global Branding', 'suporte@globalbranding.com', '(11) 99999-1234', 'Av. Inovação, 123', 'Tech City - SP')`;
    }

    console.log('Tabelas verificadas/criadas.');
  } catch (error) {
    console.error('Erro ao inicializar banco:', error);
  }
};

initDatabase();

// ==================================================================
// API ENDPOINTS
// ==================================================================

// --- PRODUTOS ---
app.get('/api/products', async (req, res) => {
  try {
    const rows = await db.sql`SELECT * FROM products ORDER BY id DESC`;
    const products = rows.map(row => ({
      ...row,
      discountPrice: row.discount_price,
      reviewsCount: row.reviews_count,
      isNew: row.is_new === 1
    }));
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  const p = req.body;
  try {
    await db.sql`
      INSERT INTO products (name, description, price, discount_price, sku, category, image, rating, reviews_count, stock, is_new)
      VALUES (${p.name}, ${p.description}, ${p.price}, ${p.discountPrice || null}, ${p.sku}, ${p.category}, ${p.image}, ${p.rating}, ${p.reviewsCount}, ${p.stock}, ${p.isNew ? 1 : 0})
    `;
    // Retorna o produto criado
    const rows = await db.sql`SELECT * FROM products ORDER BY id DESC LIMIT 1`;
    const row = rows[0];
    res.json({
        ...row,
        discountPrice: row.discount_price,
        reviewsCount: row.reviews_count,
        isNew: row.is_new === 1
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- USUÁRIOS (AUTH) ---
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.sql`SELECT * FROM users WHERE email = ${email} AND password = ${password} LIMIT 1`;
    if (result && result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(401).json({ error: "Credenciais inválidas" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  const avatar = `https://ui-avatars.com/api/?name=${name}&background=0ea5e9&color=fff`;
  try {
    await db.sql`
      INSERT INTO users (name, email, password, role, avatar)
      VALUES (${name}, ${email}, ${password}, 'customer', ${avatar})
    `;
    const result = await db.sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, whatsapp } = req.body;
    try {
        await db.sql`UPDATE users SET name = ${name}, whatsapp = ${whatsapp} WHERE id = ${id}`;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- PEDIDOS ---
app.get('/api/orders', async (req, res) => {
  const userId = req.query.userId;
  try {
    let rows;
    if (userId) {
        rows = await db.sql`SELECT * FROM orders WHERE user_id = ${userId} ORDER BY date DESC`;
    } else {
        // Admin: Pega todos com info do usuário
        rows = await db.sql`
            SELECT orders.*, users.name as user_name 
            FROM orders 
            JOIN users ON orders.user_id = users.id 
            ORDER BY orders.date DESC
        `;
    }
    
    const orders = rows.map(row => ({
      id: row.id,
      date: row.date,
      total: row.total,
      status: row.status,
      items: JSON.parse(row.items_json || '[]'),
      customerName: row.user_name
    }));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  const { id, userId, date, total, status, items } = req.body;
  const itemsJson = JSON.stringify(items);
  try {
    await db.sql`
      INSERT INTO orders (id, user_id, date, total, status, items_json)
      VALUES (${id}, ${userId}, ${date}, ${total}, ${status}, ${itemsJson})
    `;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/orders/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await db.sql`UPDATE orders SET status = ${status} WHERE id = ${id}`;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- CONFIGURAÇÃO ---
app.get('/api/config', async (req, res) => {
    try {
        const rows = await db.sql`SELECT * FROM store_config LIMIT 1`;
        if (rows.length > 0) {
            const r = rows[0];
            res.json({
                id: r.id,
                storeName: r.store_name,
                email: r.email,
                phone: r.phone,
                address: r.address,
                cityState: r.city_state,
                instagram: r.instagram,
                facebook: r.facebook,
                twitter: r.twitter
            });
        } else {
            res.json(null);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/config', async (req, res) => {
    const config = req.body;
    try {
        await db.sql`
            UPDATE store_config 
            SET store_name=${config.storeName}, email=${config.email}, phone=${config.phone}, 
                address=${config.address}, city_state=${config.cityState}, 
                instagram=${config.instagram}, facebook=${config.facebook}, twitter=${config.twitter}
            WHERE id=${config.id}
        `;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- STRIPE CHECKOUT SESSION ---
app.post('/api/create-checkout-session', async (req, res) => {
  const { items, orderId } = req.body;

  try {
    // Se a chave não estiver configurada, retornar erro simulado
    if (!process.env.STRIPE_SECRET_KEY) {
        // Se não tiver chave real configurada, retornamos um sucesso falso para fins de demo
        // Em um app real, isso deve falhar.
        console.warn("⚠️ MODO DEMO: Stripe Key não encontrada. Configure STRIPE_SECRET_KEY no .env");
        return res.status(200).json({ url: `/orders?session_id=mock_demo_${orderId}` }); 
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'brl',
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round((item.discountPrice || item.price) * 100), // Centavos
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${req.headers.origin}/orders?success=true&order_id=${orderId}`,
      cancel_url: `${req.headers.origin}/cart?canceled=true`,
      metadata: {
        orderId: orderId
      }
    });

    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- SERVING FRONTEND (PRODUCTION) ---
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor e API rodando na porta ${PORT}`);
});