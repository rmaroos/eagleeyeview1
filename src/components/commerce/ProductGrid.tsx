import type { Product } from '@/data/catalog';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  variant?: 'electronics' | 'fashion';
  columns?: 2 | 3 | 4;
}

export default function ProductGrid({ products, variant, columns = 4 }: ProductGridProps) {
  const colClass = {
    2: 'grid-cols-1 xs:grid-cols-2',
    3: 'grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[columns];

  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-gray-200 bg-slate-50">
        <p className="text-base font-semibold text-gray-700">No products match your criteria.</p>
        <p className="text-sm text-gray-500 mt-1">Try resetting or adjusting your filter selection.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${colClass} gap-4 sm:gap-6`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} variant={variant} />
      ))}
    </div>
  );
}
