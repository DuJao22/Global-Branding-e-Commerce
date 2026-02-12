import { Product } from './types';

export const CATEGORIES = [
  "Eletrônicos",
  "Moda",
  "Casa e Jardim",
  "Esportes",
  "Brinquedos"
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Smart TV 4K Ultra HD 55\"",
    description: "Experimente qualidade cinematográfica com nossa mais recente Smart TV 4K HDR. Apresenta aplicativos de streaming ilimitados e áudio cristalino.",
    price: 2999.99,
    discountPrice: 2499.99,
    sku: "ELEC-TV-001",
    category: "Eletrônicos",
    image: "https://picsum.photos/800/800?random=1",
    rating: 4.8,
    reviewsCount: 124,
    stock: 15,
    isNew: true
  },
  {
    id: 2,
    name: "Fones de Ouvido Noise Cancelling",
    description: "Mergulhe na música com o cancelamento de ruído líder da indústria. Bateria com duração de 30 horas e almofadas macias.",
    price: 1499.00,
    sku: "ELEC-AUD-002",
    category: "Eletrônicos",
    image: "https://picsum.photos/800/800?random=2",
    rating: 4.6,
    reviewsCount: 89,
    stock: 45
  },
  {
    id: 3,
    name: "Moletom Premium Masculino",
    description: "Macio, durável e estiloso. Este moletom premium é perfeito para qualquer ocasião casual. Disponível em várias cores.",
    price: 249.90,
    sku: "FASH-MEN-003",
    category: "Moda",
    image: "https://picsum.photos/800/800?random=3",
    rating: 4.5,
    reviewsCount: 230,
    stock: 100
  },
  {
    id: 4,
    name: "Cadeira de Escritório Ergonômica",
    description: "Trabalhe com conforto com suporte lombar e altura ajustável. Encosto em malha para respirabilidade.",
    price: 899.90,
    discountPrice: 759.90,
    sku: "HOME-FUR-004",
    category: "Casa e Jardim",
    image: "https://picsum.photos/800/800?random=4",
    rating: 4.7,
    reviewsCount: 56,
    stock: 8
  },
  {
    id: 5,
    name: "Relógio Fitness Inteligente",
    description: "Monitore suas métricas de saúde, passos e sono. Resistente à água e compatível com iOS e Android.",
    price: 649.50,
    sku: "ELEC-WEAR-005",
    category: "Eletrônicos",
    image: "https://picsum.photos/800/800?random=5",
    rating: 4.2,
    reviewsCount: 45,
    stock: 60
  },
  {
    id: 6,
    name: "Jogo de Facas Profissional",
    description: "Lâminas de aço inoxidável de alto carbono para corte preciso. Inclui bloco de madeira.",
    price: 399.90,
    sku: "HOME-KIT-006",
    category: "Casa e Jardim",
    image: "https://picsum.photos/800/800?random=6",
    rating: 4.9,
    reviewsCount: 312,
    stock: 22
  },
  {
    id: 7,
    name: "Tapete de Yoga Antiderrapante",
    description: "Material ecológico com excelente aderência. Perfeito para yoga, pilates e exercícios no chão.",
    price: 129.90,
    sku: "SPORT-YOG-007",
    category: "Esportes",
    image: "https://picsum.photos/800/800?random=7",
    rating: 4.4,
    reviewsCount: 150,
    stock: 200
  },
  {
    id: 8,
    name: "Mouse Gamer Sem Fio",
    description: "Tempo de resposta ultrarrápido, iluminação RGB e botões programáveis para a melhor experiência de jogo.",
    price: 399.90,
    discountPrice: 299.90,
    sku: "ELEC-GAM-008",
    category: "Eletrônicos",
    image: "https://picsum.photos/800/800?random=8",
    rating: 4.7,
    reviewsCount: 98,
    stock: 34
  }
];

export const MOCK_ORDERS = [
  { id: "PED-7782-X", date: "2023-10-15", total: 649.50, status: "Delivered", items: [] },
  { id: "PED-9921-Y", date: "2023-11-02", total: 249.90, status: "Shipped", items: [] },
  { id: "PED-1102-Z", date: "2023-11-20", total: 3299.90, status: "Processing", items: [] },
];