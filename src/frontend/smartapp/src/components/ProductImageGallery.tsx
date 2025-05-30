import React, { useState } from 'react';

interface ProductImageGalleryProps {
  images: string[];
}

export default function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [selected, setSelected] = useState(0);
  const mainImage = images[selected] || '/placeholder.png';

  return (
    <div className="w-full">
      {/* Main image with zoom on hover */}
      <div className="relative w-full h-80 bg-gray-100 rounded overflow-hidden group mb-4">
        <img
          src={mainImage}
          alt="Product"
          className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-110"
        />
      </div>
      {/* Thumbnails */}
      <div className="flex space-x-2 justify-center">
        {images.map((img, i) => (
          <button
            key={i}
            className={`w-16 h-16 rounded border ${i === selected ? 'border-blue-600' : 'border-gray-200'} overflow-hidden focus:outline-none`}
            onClick={() => setSelected(i)}
            aria-label={`Show image ${i + 1}`}
          >
            <img src={img || '/placeholder.png'} alt="Thumbnail" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
} 