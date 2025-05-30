import { CartItem } from '../types/models';

const CART_STORAGE_KEY = 'smartapp_cart';

// Utility to get cart from localStorage
function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(CART_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Utility to save cart to localStorage
function saveCart(cart: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// Add item to cart (or update quantity if exists)
export function addItem(productId: string, quantity: number = 1) {
  const cart = getCart();
  const idx = cart.findIndex(item => item.productId === productId);
  if (idx > -1) {
    cart[idx].quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  saveCart(cart);
}

// Remove item from cart
export function removeItem(productId: string) {
  const cart = getCart().filter(item => item.productId !== productId);
  saveCart(cart);
}

// Update item quantity
export function updateQuantity(productId: string, quantity: number) {
  const cart = getCart();
  const idx = cart.findIndex(item => item.productId === productId);
  if (idx > -1) {
    cart[idx].quantity = quantity;
    if (cart[idx].quantity <= 0) {
      cart.splice(idx, 1);
    }
    saveCart(cart);
  }
}

// Clear cart
export function clearCart() {
  saveCart([]);
}

// Get all cart items
export function getCartItems(): CartItem[] {
  return getCart();
}

// Calculate subtotal (requires product data)
export function calculateSubtotal(cart: CartItem[], products: { id: string; price: number }[]): number {
  return cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
}

// Example: Calculate estimated tax (simple 8%)
export function calculateTax(subtotal: number): number {
  return Math.round(subtotal * 0.08 * 100) / 100;
}

// Example: Calculate shipping (flat $5 if subtotal < $50)
export function calculateShipping(subtotal: number): number {
  return subtotal >= 50 ? 0 : 5;
}

// Calculate total
export function calculateTotal(subtotal: number, tax: number, shipping: number): number {
  return Math.round((subtotal + tax + shipping) * 100) / 100;
} 