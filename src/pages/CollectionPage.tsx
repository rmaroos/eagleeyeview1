import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ProductGrid from '@/components/commerce/ProductGrid';
import SortDropdown, { type SortOption } from '@/components/commerce/SortDropdown';
import { products, getNewArrivals, getBestSellers, type Product } from '@/data/catalog';

type CollectionType = 'new-arrivals' | 'best-sellers' | 'deals';

interface CollectionPageProps {
  type: CollectionType;
}

const config: Record<CollectionType, { title: string; subtitle: string; eyebrow: string }> = {
  'new-arrivals': {
    title: 'New Arrivals',
    subtitle: 'The latest products to join our collection.',
    eyebrow: 'Just Arrived',
  },
  'best-sellers': {
    title: 'Best Sellers',
    subtitle: 'Our most popular products that customers love.',
    eyebrow: 'Most Popular',
  },
  'deals': {
    title: 'Deals & Offers',
    subtitle: 'Save on selected products for a limited time.',
    eyebrow: 'Special Offers',
  },
};

const sortOptions: SortOption[] = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating' },
];

export default function CollectionPage({ type }: CollectionPageProps) {
  const [sortBy, setSortBy] = useState('recommended');
  const [activeDept, setActiveDept] = useState<'all' | 'electronics' | 'fashion'>('all');

  const baseProducts = useMemo(() => {
    let result: Product[];
    if (type === 'new-arrivals') {
      result = getNewArrivals();
    } else if (type === 'best-sellers') {
      result = getBestSellers('electronics').concat(getBestSellers('fashion'));
    } else {
      result = products.filter((p) => p.oldPrice !== undefined);
    }
    return result;
  }, [type]);

  const filtered = useMemo(() => {
    let result = baseProducts;
    if (activeDept !== 'all') {
      result = result.filter((p) => p.department === activeDept);
    }
    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result = [...result].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }
    return result;
  }, [baseProducts, activeDept, sortBy]);

  const c = config[type];
  const electronicsCount = baseProducts.filter((p) => p.department === 'electronics').length;
  const fashionCount = baseProducts.filter((p) => p.department === 'fashion').length;

  return (
    <div>
      <section className="relative bg-ink-950 text-white overflow-hidden">
        <div className="container-page py-14 lg:py-20">
          <div className="mb-4">
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: c.title }]} />
          </div>
          <div className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-300 mb-3">{c.eyebrow}</div>
          <h1 className="text-3xl lg:text-[40px] font-bold mb-3">{c.title}</h1>
          <p className="text-white/70 max-w-lg">{c.subtitle}</p>
        </div>
      </section>

      <div className="py-8 lg:py-10">
        <div className="container-page">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-1 border-b border-gray-100">
              {(['all', 'electronics', 'fashion'] as const).map((dept) => {
                const count = dept === 'electronics' ? electronicsCount : dept === 'fashion' ? fashionCount : baseProducts.length;
                return (
                  <button
                    key={dept}
                    onClick={() => setActiveDept(dept)}
                    className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors ${
                      activeDept === dept ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {dept} ({count})
                  </button>
                );
              })}
            </div>
            <SortDropdown options={sortOptions} value={sortBy} onChange={setSortBy} />
          </div>

          {activeDept === 'all' ? (
            <div className="space-y-12">
              {filtered.filter((p) => p.department === 'electronics').length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Electronics</h2>
                  <ProductGrid products={filtered.filter((p) => p.department === 'electronics')} variant="electronics" />
                </div>
              )}
              {filtered.filter((p) => p.department === 'fashion').length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Fashion</h2>
                  <ProductGrid products={filtered.filter((p) => p.department === 'fashion')} variant="fashion" />
                </div>
              )}
            </div>
          ) : (
            <ProductGrid products={filtered} variant={activeDept} />
          )}
        </div>
      </div>
    </div>
  );
}
