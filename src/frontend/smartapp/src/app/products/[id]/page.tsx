import React from 'react';
import { notFound } from 'next/navigation';
import { getProductById, loadProducts, loadCategories } from '../../../types/dataUtils';
import { Product } from '../../../types/models';
import ProductImageGallery from '../../../components/ProductImageGallery';
import { Metadata } from 'next';

interface ProductDetailPageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  const products = await loadProducts();
  return products.map((product: Product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const product = await getProductById(params.id);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getProductById(params.id);
  if (!product) return notFound();
  const categories = await loadCategories();
  const categoryNames = categories.filter(c => product.categoryIds.includes(c.id)).map(c => c.name).join(', ');

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image gallery */}
        <div className="flex-1">
          <ProductImageGallery images={product.images} />
        </div>
        {/* Product info */}
        <div className="flex-1">
          <div className="text-blue-600 font-bold text-xl mb-2">${product.price.toFixed(2)}</div>
          <div className="mb-2 text-gray-700">{product.description}</div>
          <div className="text-sm text-gray-500 mb-2">Stock: {product.stock > 0 ? 'In Stock' : 'Out of Stock'}</div>
          <div className="text-sm text-gray-500 mb-2">Category: {categoryNames || 'Uncategorized'}</div>
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
          {/* Placeholder for actions (add to cart, etc.) */}
          <div className="mt-4">
            <button className="bg-blue-600 text-white rounded px-4 py-2 font-medium">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
} 