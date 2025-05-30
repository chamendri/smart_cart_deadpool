import React from 'react';
import { Product } from '../types/models';

interface ProductCardProps {
  product: Product;
  loading?: boolean;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, loading = false, onAddToCart, onQuickView }: ProductCardProps) {
  if (loading) {
    // Skeleton loading state
    return (
      <div className="animate-pulse bg-white rounded-lg shadow p-4 w-full max-w-xs">
        <div className="bg-gray-200 h-48 w-full rounded mb-4" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
        <div className="h-8 bg-gray-200 rounded w-full" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col w-full max-w-xs hover:shadow-lg transition-shadow">
      <div className="relative mb-4">
        <img
          src={product.images[0] || '/placeholder.png'}
          alt={product.name}
          className="h-48 w-full object-cover rounded"
        />
        <button
          className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-opacity-100"
          onClick={() => onQuickView && onQuickView(product)}
          aria-label="Quick view"
        >
          <span className="material-icons text-gray-700">visibility</span>
        </button>
      </div>
      <h3 className="font-semibold text-lg mb-1 truncate" title={product.name}>{product.name}</h3>
      <div className="text-blue-600 font-bold mb-1">${product.price.toFixed(2)}</div>
      <div className="flex items-center mb-2">
        {/* Star rating */}
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={
              i < Math.round(product.rating)
                ? 'material-icons text-yellow-400 text-base'
                : 'material-icons text-gray-300 text-base'
            }
          >
            star
          </span>
        ))}
        <span className="ml-2 text-xs text-gray-500">({product.reviewCount})</span>
      </div>
      <button
        className="mt-auto bg-blue-600 text-white rounded py-2 px-4 hover:bg-blue-700 transition-colors font-medium"
        onClick={() => onAddToCart && onAddToCart(product)}
      >
        Add to Cart
      </button>
    </div>
  );
} 