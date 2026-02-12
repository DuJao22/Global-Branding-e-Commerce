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

-- 6. Inserir Produtos Iniciais (Baseado no Inventário Real)
INSERT INTO products (name, description, price, discount_price, sku, category, image, rating, reviews_count, stock, is_new) VALUES
('Kit Facas Artesanais Damasco', 'Conjunto premium de 3 facas em aço damasco com cabo de madeira nobre. Corte preciso para churrasco e cozinha.', 499.90, 389.90, 'CUT-001', 'Cutelaria', 'https://images.unsplash.com/photo-1593618998160-e34014e67546?q=80&w=1000&auto=format&fit=crop', 4.9, 85, 12, 1),

('Smart TV 55" 4K UHD', 'Experiência de cinema em casa. Resolução 4K real, bordas infinitas e processador rápido para seus streamings favoritos.', 2899.00, 2499.00, 'ELE-TV-002', 'Eletrônicos', 'https://images.unsplash.com/photo-1593784697501-8434372a4885?q=80&w=1000&auto=format&fit=crop', 4.8, 120, 8, 0),

('Carteira de Couro Slim', 'Design minimalista em couro legítimo. Comporta cartões e CNH sem fazer volume no bolso. Elegância e praticidade.', 129.90, NULL, 'ACE-WAL-003', 'Acessórios Pessoais', 'https://images.unsplash.com/photo-1627123424574-18bd75f3194c?q=80&w=1000&auto=format&fit=crop', 4.7, 210, 50, 1),

('Rede de Descanso Casal Premium', 'Rede reforçada em algodão 100% orgânico. Varanda feita à mão, ideal para varandas e áreas de lazer.', 189.90, NULL, 'CAS-HAM-004', 'Casa e Decoração', 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?q=80&w=1000&auto=format&fit=crop', 4.9, 150, 30, 0),

('Kit 5 Cuecas Boxer Algodão', 'Conforto absoluto para o dia a dia. Tecido respirável, elástico macio que não marca a cintura.', 149.90, 119.90, 'MOD-UND-005', 'Moda Íntima', 'https://images.unsplash.com/photo-1579294273295-5853f631248c?q=80&w=1000&auto=format&fit=crop', 4.6, 340, 100, 0),

('Tapete Aveludado Sala 2,00x2,50', 'Toque super macio, base antiderrapante e design moderno geométrico. Transforma o ambiente.', 299.90, NULL, 'CAS-RUG-006', 'Casa e Decoração', 'https://images.unsplash.com/photo-1575414723321-df6320a7b469?q=80&w=1000&auto=format&fit=crop', 4.5, 95, 15, 0),

('Kit 6 Pares Meias Cano Médio', 'Meias esportivas e casuais com reforço no calcanhar. Alta durabilidade e absorção de suor.', 89.90, NULL, 'MOD-SOC-007', 'Moda Íntima', 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=1000&auto=format&fit=crop', 4.8, 400, 200, 1),

('Canivete Tático Multifuncional', 'Ferramenta robusta para camping e uso diário. Aço inox, trava de segurança e clipe de bolso.', 159.90, NULL, 'CUT-TAC-008', 'Cutelaria', 'https://images.unsplash.com/photo-1585868662495-927943c72b22?q=80&w=1000&auto=format&fit=crop', 4.7, 65, 25, 0);