import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types/models';
import { loadProducts } from '../types/dataUtils';

export interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  filterProducts: (categoryId: string) => Product[];
  searchProducts: (query: string) => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await loadProducts();
      setProducts(data);
    } catch (e) {
      setError('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getProductById = (id: string) => products.find(p => p.id === id);
  const filterProducts = (categoryId: string) => products.filter(p => p.categoryIds.includes(categoryId));
  const searchProducts = (query: string) =>
    products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    );

  return (
    <ProductContext.Provider
      value={{ products, isLoading, error, fetchProducts, getProductById, filterProducts, searchProducts }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within a ProductProvider');
  return ctx;
} 