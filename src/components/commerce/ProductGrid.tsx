import type { Product } from '@/data/catalog';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  variant?: 'electronics' | 'fashion';
  columns?: 2 | 3 | 4;
}

export default function ProductGrid({ products, variant, columns = 4 }: ProductGridProps) {
  const colClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[columns];

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">No products found.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${colClass} gap-4 sm:gap-5`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} variant={variant} />
      ))}
    </div>
  );
}
