// User roles
type UserRole = 'customer' | 'admin';

// User interface (discriminated union for Customer/Admin)
export interface UserBase {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Customer extends UserBase {
  role: 'customer';
  address: string;
  orderIds: string[];
  wishlistProductIds: string[];
}

export interface Admin extends UserBase {
  role: 'admin';
  permissions: string[];
}

export type User = Customer | Admin;

// Category interface
export interface Category {
  id: string;
  name: string;
  description?: string;
  parentCategoryId?: string;
}

// Product interface
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  categoryIds: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
}

// Cart and CartItem interfaces
export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  updatedAt: string;
}

// Order and OrderItem interfaces
export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  shippingAddress: string;
} 