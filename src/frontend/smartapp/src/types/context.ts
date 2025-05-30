/**
 * Shared context types for Auth, Cart, and Product contexts.
 */
import { User, CartItem, Product } from './models';

/**
 * AuthContextType defines the shape of the authentication context value.
 */
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

/**
 * CartContextType defines the shape of the cart context value.
 */
export interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

/**
 * ProductContextType defines the shape of the product context value.
 */
export interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  filterProducts: (categoryId: string) => Product[];
  searchProducts: (query: string) => Product[];
} 