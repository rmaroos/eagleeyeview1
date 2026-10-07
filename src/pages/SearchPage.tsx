import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import ProductGrid from '@/components/commerce/ProductGrid';
import { searchProducts } from '@/data/catalog';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState<'all' | 'electronics' | 'fashion'>('all');

  const results = useMemo(() => searchProducts(query), [query]);
  const allResults = [...results.electronics, ...results.fashion];

  const displayed =
    activeTab === 'electronics'
      ? results.electronics
      : activeTab === 'fashion'
      ? results.fashion
      : allResults;

  const variant = activeTab === 'fashion' ? 'fashion' : 'electronics';

  return (
    <div className="py-8 lg:py-12">
      <div className="container-page">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SearchIcon size={24} className="text-gray-400" />
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Search results for "{query}"
            </h1>
          </div>
          <p className="text-gray-500">
            {allResults.length} {allResults.length === 1 ? 'result' : 'results'} found
          </p>
        </div>

        {allResults.length > 0 && (
          <div className="flex items-center gap-1 mb-6 border-b border-gray-100">
            {(['all', 'electronics', 'fashion'] as const).map((tab) => {
              const count =
                tab === 'electronics'
                  ? results.electronics.length
                  : tab === 'fashion'
                  ? results.fashion.length
                  : allResults.length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab} ({count})
                </button>
              );
            })}
          </div>
        )}

        {allResults.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <SearchIcon size={28} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No results found</h2>
            <p className="text-gray-500 mb-6">
              We couldn't find any products matching "{query}".
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link to="/electronics" className="btn-primary">
                Browse Electronics
              </Link>
              <Link to="/fashion" className="btn-secondary">
                Browse Fashion
              </Link>
            </div>
          </div>
        ) : activeTab === 'all' ? (
          <div className="space-y-12">
            {results.electronics.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Electronics ({results.electronics.length})
                </h2>
                <ProductGrid products={results.electronics} variant="electronics" />
              </div>
            )}
            {results.fashion.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Fashion ({results.fashion.length})
                </h2>
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
