import React from 'react';
import Image from 'next/image';
import { CartItem } from '../types/models';
import { Product } from '../types/models';

interface CartItemProps {
  item: CartItem;
  product: Product;
  onQuantityChange?: (productId: string, newQty: number) => void;
  onRemove?: (productId: string) => void;
  context?: 'sidebar' | 'page';
}

export const CartItemComponent: React.FC<CartItemProps> = ({
  item,
  product,
  onQuantityChange,
  onRemove,
  context = 'page',
}) => {
  const [quantity, setQuantity] = React.useState(item.quantity);
  const [removing, setRemoving] = React.useState(false);

  React.useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
      onQuantityChange?.(item.productId, quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(q => q + 1);
      onQuantityChange?.(item.productId, quantity + 1);
    }
  };

  const handleRemove = () => {
    if (context === 'sidebar' || confirm('Remove this item from cart?')) {
      setRemoving(true);
      onRemove?.(item.productId);
    }
  };

  const subtotal = product.price * quantity;

  return (
    <div
      className={`flex items-center gap-4 py-4 border-b last:border-b-0 ${
        context === 'sidebar' ? 'text-sm' : 'text-base'
      } ${removing ? 'opacity-50 pointer-events-none' : ''}`}
      data-testid="cart-item"
    >
      <div className="w-16 h-16 flex-shrink-0 relative">
        <Image
          src={product.images[0] || '/placeholder.png'}
          alt={product.name}
          fill
          className="object-cover rounded"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{product.name}</div>
        <div className="text-gray-500">${product.price.toFixed(2)}</div>
        <div className="flex items-center gap-2 mt-2">
          <button
            className="px-2 py-1 border rounded disabled:opacity-50"
            onClick={handleDecrement}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="w-8 text-center">{quantity}</span>
          <button
            className="px-2 py-1 border rounded disabled:opacity-50"
            onClick={handleIncrement}
            disabled={quantity >= product.stock}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 min-w-[80px]">
        <div className="font-semibold">${subtotal.toFixed(2)}</div>
        <button
          className="text-red-500 hover:underline text-xs"
          onClick={handleRemove}
          aria-label="Remove from cart"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItemComponent; 