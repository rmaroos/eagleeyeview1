import { Heart } from 'lucide-react';
import { useStore } from '@/store/StoreContext';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: number;
}

export default function WishlistButton({ productId, className = '', size = 20 }: WishlistButtonProps) {
  const { toggleWishlist, isInWishlist } = useStore();
  const active = isInWishlist(productId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(productId);
      }}
      className={`flex items-center justify-center rounded-full p-1.5 transition-all hover:bg-white/90 bg-white/80 backdrop-blur-sm ${
        active ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'
      } ${className}`}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart size={size} className={active ? 'fill-red-500' : ''} />
    </button>
  );
}
