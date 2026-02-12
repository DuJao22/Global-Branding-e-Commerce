-- ==================================================================
-- SCRIPT DE INICIALIZAÇÃO DO BANCO DE DADOS - GLOBAL BRANDING
-- ==================================================================

-- 1. Criação da Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('customer', 'admin')),
  avatar TEXT
);

-- 2. Criação da Tabela de Produtos
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

-- 3. Criação da Tabela de Pedidos
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id INTEGER,
  date TEXT,
  total REAL,
  status TEXT,
  items_json TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- ==================================================================
-- INSERÇÃO DE DADOS (SEED)
-- ==================================================================

-- 4. Inserir Usuário ADMIN (DUJAO)
INSERT INTO users (name, email, password, role, avatar) 
VALUES ('Admin Dujao', 'DUJAO', '30031936Vo.', 'admin', 'https://ui-avatars.com/api/?name=Dujao&background=0ea5e9&color=fff');

-- 5. Inserir Usuário Cliente Exemplo
INSERT INTO users (name, email, password, role, avatar) 
VALUES ('Cliente Demo', 'user@globalbranding.com', '123456', 'customer', 'https://ui-avatars.com/api/?name=User&background=64748b&color=fff');

-- 6. Inserir Produtos Iniciais
INSERT INTO products (name, description, price, discount_price, sku, category, image, rating, reviews_count, stock, is_new) VALUES
('Smart TV 4K Ultra HD 55"', 'Experimente qualidade cinematográfica com nossa mais recente Smart TV 4K HDR. Apresenta aplicativos de streaming ilimitados e áudio cristalino.', 2999.99, 2499.99, 'ELEC-TV-001', 'Eletrônicos', 'https://picsum.photos/800/800?random=1', 4.8, 124, 15, 1),
('Fones de Ouvido Noise Cancelling', 'Mergulhe na música com o cancelamento de ruído líder da indústria. Bateria com duração de 30 horas e almofadas macias.', 1499.00, NULL, 'ELEC-AUD-002', 'Eletrônicos', 'https://picsum.photos/800/800?random=2', 4.6, 89, 45, 0),
('Moletom Premium Masculino', 'Macio, durável e estiloso. Este moletom premium é perfeito para qualquer ocasião casual. Disponível em várias cores.', 249.90, NULL, 'FASH-MEN-003', 'Moda', 'https://picsum.photos/800/800?random=3', 4.5, 230, 100, 0),
('Cadeira de Escritório Ergonômica', 'Trabalhe com conforto com suporte lombar e altura ajustável. Encosto em malha para respirabilidade.', 899.90, 759.90, 'HOME-FUR-004', 'Casa e Jardim', 'https://picsum.photos/800/800?random=4', 4.7, 56, 8, 0),
('Relógio Fitness Inteligente', 'Monitore suas métricas de saúde, passos e sono. Resistente à água e compatível com iOS e Android.', 649.50, NULL, 'ELEC-WEAR-005', 'Eletrônicos', 'https://picsum.photos/800/800?random=5', 4.2, 45, 60, 0),
('Jogo de Facas Profissional', 'Lâminas de aço inoxidável de alto carbono para corte preciso. Inclui bloco de madeira.', 399.90, NULL, 'HOME-KIT-006', 'Casa e Jardim', 'https://picsum.photos/800/800?random=6', 4.9, 312, 22, 0),
('Tapete de Yoga Antiderrapante', 'Material ecológico com excelente aderência. Perfeito para yoga, pilates e exercícios no chão.', 129.90, NULL, 'SPORT-YOG-007', 'Esportes', 'https://picsum.photos/800/800?random=7', 4.4, 150, 200, 0),
('Mouse Gamer Sem Fio', 'Tempo de resposta ultrarrápido, iluminação RGB e botões programáveis para a melhor experiência de jogo.', 399.90, 299.90, 'ELEC-GAM-008', 'Eletrônicos', 'https://picsum.photos/800/800?random=8', 4.7, 98, 34, 0);
