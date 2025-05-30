import React, { useState } from 'react';
import { Category } from '../types/models';

export interface ProductFilterState {
  categories: string[];
  priceMin: number | '';
  priceMax: number | '';
  rating: number | '';
  inStock: boolean;
}

interface ProductFilterProps {
  categories: Category[];
  value: ProductFilterState;
  onChange: (value: ProductFilterState) => void;
  onClear: () => void;
}

export default function ProductFilter({ categories, value, onChange, onClear }: ProductFilterProps) {
  // Handlers for each filter type
  const handleCategoryChange = (id: string) => {
    const newCategories = value.categories.includes(id)
      ? value.categories.filter(cid => cid !== id)
      : [...value.categories, id];
    onChange({ ...value, categories: newCategories });
  };
  const handlePriceChange = (field: 'priceMin' | 'priceMax', val: string) => {
    onChange({ ...value, [field]: val === '' ? '' : Number(val) });
  };
  const handleRatingChange = (rating: number) => {
    onChange({ ...value, rating: value.rating === rating ? '' : rating });
  };
  const handleInStockChange = () => {
    onChange({ ...value, inStock: !value.inStock });
  };

  return (
    <aside className="w-full sm:w-64 bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Filters</h2>
        <button className="text-blue-600 text-sm underline" onClick={onClear}>Clear All</button>
      </div>
      {/* Category Filter */}
      <div className="mb-4">
        <h3 className="font-medium mb-2">Category</h3>
        <div className="flex flex-col space-y-1">
          {categories.map(cat => (
            <label key={cat.id} className="flex items-center">
              <input
                type="checkbox"
                checked={value.categories.includes(cat.id)}
                onChange={() => handleCategoryChange(cat.id)}
                className="mr-2"
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>
      {/* Price Range Filter */}
      <div className="mb-4">
        <h3 className="font-medium mb-2">Price Range</h3>
        <div className="flex space-x-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={value.priceMin}
            onChange={e => handlePriceChange('priceMin', e.target.value)}
            className="w-20 border rounded px-2 py-1"
          />
          <span>-</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={value.priceMax}
            onChange={e => handlePriceChange('priceMax', e.target.value)}
            className="w-20 border rounded px-2 py-1"
          />
        </div>
      </div>
      {/* Rating Filter */}
      <div className="mb-4">
        <h3 className="font-medium mb-2">Rating</h3>
        <div className="flex space-x-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              className={
                i < (value.rating || 0)
                  ? 'material-icons text-yellow-400'
                  : 'material-icons text-gray-300'
              }
              onClick={() => handleRatingChange(i + 1)}
            >
              star
            </button>
          ))}
        </div>
      </div>
      {/* In Stock Filter */}
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={value.inStock}
            onChange={handleInStockChange}
            className="mr-2"
          />
          In Stock Only
        </label>
      </div>
    </aside>
  );
} 