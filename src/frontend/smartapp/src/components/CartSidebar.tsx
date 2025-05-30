import React from 'react';
import { CartItem } from '../types/models';
import { Product } from '../types/models';
import CartItemComponent from './CartItem';
import {
  calculateSubtotal,
  calculateTax,
  calculateShipping,
  calculateTotal,
} from '../services/cartService';

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  products: Product[];
  onQuantityChange: (productId: string, newQty: number) => void;
  onRemove: (productId: string) => void;
  onCheckout?: () => void;
  onContinueShopping?: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  open,
  onClose,
  cartItems,
  products,
  onQuantityChange,
  onRemove,
  onCheckout,
  onContinueShopping,
}) => {
  // Enrich cart items with product data
  const enrichedItems = cartItems
    .map(item => {
      const product = products.find(p => p.id === item.productId);
      return product ? { item, product } : null;
    })
    .filter(Boolean) as { item: CartItem; product: Product }[];

  const subtotal = calculateSubtotal(cartItems, products);
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = calculateTotal(subtotal, tax, shipping);

  return (
    <div
      className={`fixed inset-0 z-40 transition-all duration-300 ${
        open ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      {/* Sidebar */}
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button
            className="text-gray-500 hover:text-gray-800 text-2xl"
            onClick={onClose}
            aria-label="Close cart sidebar"
          >
            &times;
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-4">
          {enrichedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 gap-4">
              <span className="text-4xl">🛒</span>
              <p>Your cart is empty.</p>
              <button
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={onContinueShopping}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <ul className="divide-y">
                {enrichedItems.map(({ item, product }) => (
                  <li key={item.productId}>
                    <CartItemComponent
                      item={item}
                      product={product}
                      onQuantityChange={onQuantityChange}
                      onRemove={onRemove}
                      context="sidebar"
                    />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        {/* Cart summary */}
        {enrichedItems.length > 0 && (
          <footer className="p-4 border-t bg-gray-50">
            <div className="flex justify-between mb-1">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Tax (est.)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={onCheckout}
            >
              Checkout
            </button>
            <button
              className="w-full mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={onContinueShopping}
            >
              Continue Shopping
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
};

export default CartSidebar; 