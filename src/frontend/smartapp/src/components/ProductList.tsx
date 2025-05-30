import React from 'react';
import { Product } from '../types/models';

interface ProductListProps {
  products: Product[];
  loading?: boolean;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

function ProductListItem({ product, onAddToCart, onQuickView }: { product: Product; onAddToCart?: (product: Product) => void; onQuickView?: (product: Product) => void }) {
  return (
    <div className="flex flex-col sm:flex-row bg-white rounded-lg shadow p-4 mb-4 w-full hover:shadow-lg transition-shadow">
      <div className="flex-shrink-0 w-full sm:w-40 h-40 mb-4 sm:mb-0 sm:mr-6">
        <img
          src={product.images[0] || '/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-cover rounded"
        />
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg truncate" title={product.name}>{product.name}</h3>
          <button
            className="bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-opacity-100"
            onClick={() => onQuickView && onQuickView(product)}
            aria-label="Quick view"
          >
            <span className="material-icons text-gray-700">visibility</span>
          </button>
        </div>
        <div className="text-blue-600 font-bold mb-1">${product.price.toFixed(2)}</div>
        <div className="flex items-center mb-2">
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
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        <button
          className="mt-auto bg-blue-600 text-white rounded py-2 px-4 hover:bg-blue-700 transition-colors font-medium w-max"
          onClick={() => onAddToCart && onAddToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default function ProductList({ products, loading = false, onAddToCart, onQuickView }: ProductListProps) {
  if (loading) {
    return (
      <div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col sm:flex-row bg-white rounded-lg shadow p-4 mb-4 w-full">
            <div className="bg-gray-200 w-full sm:w-40 h-40 rounded mb-4 sm:mb-0 sm:mr-6" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-6 bg-gray-200 rounded w-full" />
              <div className="h-8 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {products.map(product => (
        <ProductListItem
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
} 