import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import ProductGrid from '@/components/commerce/ProductGrid';
import { useStore } from '@/store/StoreContext';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function SearchPage() {
  const { searchProducts } = useStore();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState<'all' | 'electronics' | 'fashion'>('all');

  const results = useMemo(() => searchProducts(query), [query, searchProducts]);
  const allResults = [...results.electronics, ...results.fashion];

  const displayed =
    activeTab === 'electronics'
      ? results.electronics
      : activeTab === 'fashion'
      ? results.fashion
      : allResults;

  const variant = activeTab === 'fashion' ? 'fashion' : 'electronics';

  return (
    <div className="py-6 sm:py-8 lg:py-12 bg-[#F6F7F9] min-h-screen">
      <div className="container-page">
        <div className="mb-6">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: `Search: "${query}"` }]} />
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white border border-gray-200 text-[#2347F5] shadow-xs">
              <SearchIcon size={20} />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#15171C]">
                Search results for “{query}”
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Found {allResults.length} {allResults.length === 1 ? 'product' : 'products'} matching your search
              </p>
            </div>
          </div>
        </div>

        {allResults.length > 0 && (
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-white border border-gray-200 w-fit mb-8 shadow-xs">
            {(['all', 'electronics', 'fashion'] as const).map((tab) => {
              const count =
                tab === 'electronics'
                  ? results.electronics.length
                  : tab === 'fashion'
                  ? results.fashion.length
                  : allResults.length;
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                    active
                      ? 'bg-[#15171C] text-white shadow-xs'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {tab} ({count})
                </button>
              );
            })}
          </div>
        )}

        {allResults.length === 0 ? (
          <div className="text-center py-16 sm:py-24 max-w-md mx-auto p-8 rounded-3xl bg-white border border-gray-200 shadow-xs">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-gray-400 mb-4">
              <SearchIcon size={26} />
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#15171C] mb-2">
              No matching products found
            </h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              We couldn't find any items matching “{query}”. Try checking your spelling or search for broader categories like "Headphones" or "Handbags".
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/electronics" className="btn-primary w-full sm:w-auto">
                Explore Electronics
              </Link>
              <Link to="/fashion" className="btn-secondary w-full sm:w-auto">
                Explore Fashion
              </Link>
            </div>
          </div>
        ) : activeTab === 'all' ? (
          <div className="space-y-12">
            {results.electronics.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#2347F5]" />
                  <h2 className="font-display text-xl font-bold text-[#15171C]">
                    Electronics ({results.electronics.length})
                  </h2>
                </div>
                <ProductGrid products={results.electronics} variant="electronics" />
              </div>
            )}
            {results.fashion.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#7A2E3A]" />
                  <h2 className="font-display text-xl font-bold text-[#15171C]">
                    Fashion ({results.fashion.length})
                  </h2>
                </div>
                <ProductGrid products={results.fashion} variant="fashion" />
              </div>
            )}
          </div>
        ) : (
          <ProductGrid products={displayed} variant={variant} />
        )}
      </div>
    </div>
  );
}
