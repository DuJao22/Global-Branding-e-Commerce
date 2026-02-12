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
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Pending' | 'Paid' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: CartItem[];
}

export type SortOption = 'price-asc' | 'price-desc' | 'popularity' | 'rating';

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  search: string;
}