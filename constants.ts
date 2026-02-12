import { Product } from './types';

export const CATEGORIES = [
  "Casa e Decoração",
  "Eletrônicos",
  "Acessórios Pessoais",
  "Moda Íntima",
  "Cutelaria"
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Kit Facas Artesanais Damasco",
    description: "Conjunto premium de 3 facas em aço damasco com cabo de madeira nobre. Corte preciso para churrasco e cozinha.",
    price: 499.90,
    discountPrice: 389.90,
    sku: "CUT-001",
    category: "Cutelaria",
    image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?q=80&w=1000&auto=format&fit=crop",
    rating: 4.9,
    reviewsCount: 85,
    stock: 12,
    isNew: true
  },
  {
    id: 2,
    name: "Smart TV 55\" 4K UHD",
    description: "Experiência de cinema em casa. Resolução 4K real, bordas infinitas e processador rápido para seus streamings favoritos.",
    price: 2899.00,
    discountPrice: 2499.00,
    sku: "ELE-TV-002",
    category: "Eletrônicos",
    image: "https://images.unsplash.com/photo-1593784697501-8434372a4885?q=80&w=1000&auto=format&fit=crop",
    rating: 4.8,
    reviewsCount: 120,
    stock: 8
  },
  {
    id: 3,
    name: "Carteira de Couro Slim",
    description: "Design minimalista em couro legítimo. Comporta cartões e CNH sem fazer volume no bolso. Elegância e praticidade.",
    price: 129.90,
    sku: "ACE-WAL-003",
    category: "Acessórios Pessoais",
    image: "https://images.unsplash.com/photo-1627123424574-18bd75f3194c?q=80&w=1000&auto=format&fit=crop",
    rating: 4.7,
    reviewsCount: 210,
    stock: 50,
    isNew: true
  },
  {
    id: 4,
    name: "Rede de Descanso Casal Premium",
    description: "Rede reforçada em algodão 100% orgânico. Varanda feita à mão, ideal para varandas e áreas de lazer.",
    price: 189.90,
    sku: "CAS-HAM-004",
    category: "Casa e Decoração",
    image: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?q=80&w=1000&auto=format&fit=crop",
    rating: 4.9,
    reviewsCount: 150,
    stock: 30
  },
  {
    id: 5,
    name: "Kit 5 Cuecas Boxer Algodão",
    description: "Conforto absoluto para o dia a dia. Tecido respirável, elástico macio que não marca a cintura.",
    price: 149.90,
    discountPrice: 119.90,
    sku: "MOD-UND-005",
    category: "Moda Íntima",
    image: "https://images.unsplash.com/photo-1579294273295-5853f631248c?q=80&w=1000&auto=format&fit=crop",
    rating: 4.6,
    reviewsCount: 340,
    stock: 100
  },
  {
    id: 6,
    name: "Tapete Aveludado Sala 2,00x2,50",
    description: "Toque super macio, base antiderrapante e design moderno geométrico. Transforma o ambiente.",
    price: 299.90,
    sku: "CAS-RUG-006",
    category: "Casa e Decoração",
    image: "https://images.unsplash.com/photo-1575414723321-df6320a7b469?q=80&w=1000&auto=format&fit=crop",
    rating: 4.5,
    reviewsCount: 95,
    stock: 15
  },
  {
    id: 7,
    name: "Kit 6 Pares Meias Cano Médio",
    description: "Meias esportivas e casuais com reforço no calcanhar. Alta durabilidade e absorção de suor.",
    price: 89.90,
    sku: "MOD-SOC-007",
    category: "Moda Íntima",
    image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=1000&auto=format&fit=crop",
    rating: 4.8,
    reviewsCount: 400,
    stock: 200,
    isNew: true
  },
  {
    id: 8,
    name: "Canivete Tático Multifuncional",
    description: "Ferramenta robusta para camping e uso diário. Aço inox, trava de segurança e clipe de bolso.",
    price: 159.90,
    sku: "CUT-TAC-008",
    category: "Cutelaria",
    image: "https://images.unsplash.com/photo-1585868662495-927943c72b22?q=80&w=1000&auto=format&fit=crop",
    rating: 4.7,
    reviewsCount: 65,
    stock: 25
  }
];

export const MOCK_ORDERS = [
  { id: "PED-7782-X", date: "2023-10-15", total: 649.50, status: "Delivered", items: [] },
  { id: "PED-9921-Y", date: "2023-11-02", total: 249.90, status: "Shipped", items: [] },
  { id: "PED-1102-Z", date: "2023-11-20", total: 3299.90, status: "Processing", items: [] },
];