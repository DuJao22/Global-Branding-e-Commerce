export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  sku: string;
  category: string;
  image: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  isNew?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  avatar?: string;
  whatsapp?: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Pending' | 'Paid' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: CartItem[];
  customerName?: string; // Optional field for Admin view
}

export interface StoreConfig {
  id: number;
  storeName: string;
  email: string;
  phone: string;
  address: string;
  cityState: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
}

export type SortOption = 'price-asc' | 'price-desc' | 'popularity' | 'rating';

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  search: string;
}