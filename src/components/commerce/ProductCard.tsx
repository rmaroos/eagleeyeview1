import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
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
  const dept = variant || product.department;
  const href = `/${dept}/product/${product.slug}`;

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div className="group flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden hover:border-gray-300 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-200">
      {/* Image area — fixed aspect ratio for uniformity */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden shrink-0">
        <Link to={href}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        {/* Badges — absolute positioned, won't affect layout */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badges.slice(0, 2).map((badge) => (
            <Badge key={badge} variant={getBadgeVariant(badge)}>
              {badge}
            </Badge>
          ))}
          {discount > 0 && !product.badges.includes('SALE') && (
            <Badge variant="sale">{`${discount}% OFF`}</Badge>
          )}
        </div>
        <div className="absolute top-2 right-2">
          <WishlistButton productId={product.id} />
        </div>
      </div>

      {/* Content area — flex-1 fills remaining height, flex-col with mt-auto on button */}
      <div className="flex flex-col flex-1 p-4">
        <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">
          {product.brand}
        </div>
        <Link to={href}>
          <h3 className="font-medium text-gray-900 text-sm leading-snug line-clamp-2 hover:text-blue-600 transition-colors mb-1.5 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        <div className="mb-2.5">
          <Rating rating={product.rating} reviewCount={product.reviewCount} />
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        <div className="mb-3 min-h-[1.25rem]">
          <StockStatus stock={product.stock} />
        </div>

        {/* mt-auto pushes button to bottom for uniform card height */}
        <button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className="mt-auto btn-primary w-full text-sm"
        >
          <ShoppingCart size={16} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

function StockStatus({ stock }: { stock: number }) {
  if (stock === 0) {
    return <div className="flex items-center gap-1.5 text-xs text-red-500"><span className="w-1.5 h-1.5 rounded-full bg-red-500" />Out of Stock</div>;
  }
  if (stock <= 5) {
    return <div className="flex items-center gap-1.5 text-xs text-amber-600"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Only {stock} left</div>;
  }
  return <div className="flex items-center gap-1.5 text-xs text-green-600"><span className="w-1.5 h-1.5 rounded-full bg-green-500" />In Stock</div>;
}
