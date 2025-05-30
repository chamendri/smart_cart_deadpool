import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { ProductProvider } from './ProductContext';
import { CartProvider } from './CartContext';

/**
 * RootProvider nests all context providers in a logical order:
 * AuthProvider → ProductProvider → CartProvider
 * This ensures all contexts are available throughout the app.
 */
export default function RootProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
} 