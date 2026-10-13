import { useState, useMemo } from 'react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ProductGrid from '@/components/commerce/ProductGrid';
import SortDropdown, { type SortOption } from '@/components/commerce/SortDropdown';
import { useStore } from '@/store/StoreContext';
import type { Product } from '@/data/catalog';

type CollectionType = 'new-arrivals' | 'best-sellers' | 'deals';

interface CollectionPageProps {
  type: CollectionType;
}

const config: Record<CollectionType, { title: string; subtitle: string; eyebrow: string; bgImage: string }> = {
  'new-arrivals': {
    title: 'New Arrivals',
    subtitle: 'The latest precision technology and designer accessories to join our store.',
    eyebrow: 'Just Unboxed',
    bgImage: 'https://images.pexels.com/photos/10340652/pexels-photo-10340652.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  'best-sellers': {
    title: 'Best Sellers',
    subtitle: 'Our highest rated, most loved products based on verified customer purchases.',
    eyebrow: 'Top Rated & Most Popular',
    bgImage: 'https://images.pexels.com/photos/11129922/pexels-photo-11129922.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  'deals': {
    title: 'Special Deals & Offers',
    subtitle: 'Exclusive discounts and seasonal promotions for a limited time.',
    eyebrow: 'Promotions & Discounts',
    bgImage: 'https://images.pexels.com/photos/19055620/pexels-photo-19055620.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
};

const sortOptions: SortOption[] = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Customer Rating', value: 'rating' },
];

export default function CollectionPage({ type }: CollectionPageProps) {
  const { products, getNewArrivals, getBestSellers } = useStore();
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
  }, [type, products, getNewArrivals, getBestSellers]);

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
    <div className="bg-[#F6F7F9] min-h-screen">
      {/* Banner */}
      <section className="relative bg-[#15171C] text-white overflow-hidden">
        <div className="absolute inset-0">
          <img src={c.bgImage} alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#15171C] via-[#15171C]/75 to-transparent" />
        </div>
        <div className="relative container-page py-10 sm:py-14 lg:py-16">
          <div className="mb-4">
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: c.title }]} />
          </div>
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#8FA2FF] mb-2">
            {c.eyebrow}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 text-white">
            {c.title}
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-lg leading-relaxed">
            {c.subtitle}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-6 sm:py-8 lg:py-10">
        <div className="container-page">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-white border border-gray-200">
              {(['all', 'electronics', 'fashion'] as const).map((dept) => {
                const count =
                  dept === 'electronics'
                    ? electronicsCount
                    : dept === 'fashion'
                    ? fashionCount
                    : baseProducts.length;
                const active = activeDept === dept;
                return (
                  <button
                    key={dept}
                    onClick={() => setActiveDept(dept)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                      active
                        ? 'bg-[#15171C] text-white shadow-xs'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    {dept} ({count})
                  </button>
                );
              })}
            </div>

            <SortDropdown options={sortOptions} value={sortBy} onChange={setSortBy} />
          </div>

          {/* Product grid sections */}
          {activeDept === 'all' ? (
            <div className="space-y-12">
              {filtered.filter((p) => p.department === 'electronics').length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#2347F5]" />
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-[#15171C]">
                      Electronics Collection
                    </h2>
                  </div>
                  <ProductGrid
                    products={filtered.filter((p) => p.department === 'electronics')}
                    variant="electronics"
                  />
                </div>
              )}
              {filtered.filter((p) => p.department === 'fashion').length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#7A2E3A]" />
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-[#15171C]">
                      Fashion Collection
                    </h2>
                  </div>
                  <ProductGrid
                    products={filtered.filter((p) => p.department === 'fashion')}
                    variant="fashion"
                  />
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
