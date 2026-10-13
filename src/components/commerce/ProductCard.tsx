import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '@/data/catalog';
import { formatPrice } from '@/data/catalog';
import { useStore } from '@/store/StoreContext';
import Rating from '@/components/ui/Rating';
import Badge, { getBadgeVariant } from '@/components/ui/Badge';
import WishlistButton from '@/components/ui/WishlistButton';

interface ProductCardProps {
  product: Product;
  variant?: 'electronics' | 'fashion';
}

export default function ProductCard({ product, variant }: ProductCardProps) {
  const { addToCart } = useStore();
  const [added, setAdded] = useState(false);
  const dept = variant || product.department;
  const href = `/${dept}/product/${product.slug}`;

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isFashion = dept === 'fashion';

  return (
    <div className="group relative flex flex-col h-full rounded-2xl border border-[#E3E5EA] bg-white overflow-hidden transition-all duration-300 hover:border-gray-300 hover:shadow-[0_12px_28px_rgba(21,23,28,0.08)] hover:-translate-y-1">
      {/* Product Image */}
      <div className={`relative ${isFashion ? 'aspect-[4/5]' : 'aspect-square'} bg-[#F6F7F9] overflow-hidden shrink-0`}>
        <Link to={href} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 pointer-events-none z-10">
          {product.badges.slice(0, 2).map((badge) => (
            <Badge key={badge} variant={getBadgeVariant(badge)}>
              {badge}
            </Badge>
          ))}
          {discount > 0 && !product.badges.includes('SALE') && (
            <span className="inline-flex items-center rounded-full bg-[#DC2626] px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <WishlistButton productId={product.id} className="h-8 w-8 bg-white/90 shadow-sm hover:scale-105 transition-transform" />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
          <span>{product.brand}</span>
          <StockStatus stock={product.stock} />
        </div>

        <Link to={href} className="group-hover:text-[#2347F5] transition-colors mb-2">
          <h3 className="font-semibold text-[#15171C] text-sm sm:text-[15px] leading-snug line-clamp-2 min-h-[2.6rem]">
            {product.name}
          </h3>
        </Link>

        <div className="mb-3">
          <Rating rating={product.rating} reviewCount={product.reviewCount} />
        </div>

        <div className="flex items-baseline gap-2 mb-4 mt-auto">
          <span className="text-base sm:text-lg font-bold text-[#15171C]">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart button */}
        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className={`w-full h-10 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${
            added
              ? 'bg-[#16A34A] text-white'
              : product.stock === 0
              ? 'bg-gray-100 text-gray-400'
              : isFashion
              ? 'bg-[#15171C] text-white hover:bg-[#7A2E3A]'
              : 'bg-[#2347F5] text-white hover:bg-[#1635D6]'
          }`}
        >
          {added ? (
            <>
              <Check size={15} /> Added
            </>
          ) : product.stock === 0 ? (
            'Out of Stock'
          ) : (
            <>
              <ShoppingCart size={15} /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function StockStatus({ stock }: { stock: number }) {
  if (stock === 0) {
    return <span className="text-[10px] text-red-500 font-semibold">Out of Stock</span>;
  }
  if (stock <= 5) {
    return <span className="text-[10px] text-amber-600 font-semibold">Only {stock} left</span>;
  }
  return <span className="text-[10px] text-green-600 font-semibold">In Stock</span>;
}
