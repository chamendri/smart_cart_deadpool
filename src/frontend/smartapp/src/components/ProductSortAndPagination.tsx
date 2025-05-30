import React from 'react';

export type SortOption = 'price-asc' | 'price-desc' | 'popularity' | 'newest';

interface ProductSortAndPaginationProps {
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'newest', label: 'Newest' },
];

export default function ProductSortAndPagination({ sort, onSortChange, page, totalPages, onPageChange }: ProductSortAndPaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
      {/* Sort Dropdown */}
      <div>
        <label className="mr-2 font-medium" htmlFor="sort">Sort by:</label>
        <select
          id="sort"
          value={sort}
          onChange={e => onSortChange(e.target.value as SortOption)}
          className="border rounded px-2 py-1"
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      {/* Pagination */}
      <div className="flex items-center space-x-2">
        <button
          className="px-2 py-1 rounded border disabled:opacity-50"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i + 1}
            className={`px-2 py-1 rounded border ${page === i + 1 ? 'bg-blue-600 text-white' : ''}`}
            onClick={() => onPageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="px-2 py-1 rounded border disabled:opacity-50"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
} 