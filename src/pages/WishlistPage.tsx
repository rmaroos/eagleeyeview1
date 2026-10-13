import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { products } from '@/data/catalog';
import ProductGrid from '@/components/commerce/ProductGrid';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function WishlistPage() {
  const { wishlist } = useStore();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));
  const electronicsItems = wishlistProducts.filter((p) => p.department === 'electronics');
  const fashionItems = wishlistProducts.filter((p) => p.department === 'fashion');

  if (wishlistProducts.length === 0) {
    return (
      <div className="container-page py-16 sm:py-24">
        <div className="text-center max-w-md mx-auto p-8 rounded-3xl bg-white border border-gray-200">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 border border-gray-200 mb-6">
            <Heart size={32} className="text-gray-400" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#15171C] mb-2">
            Your Wishlist is Empty
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mb-8 leading-relaxed">
            Save favorite devices or handbags by clicking the heart icon while you browse.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/electronics" className="btn-primary w-full sm:w-auto">
              Browse Electronics
            </Link>
            <Link to="/fashion" className="btn-secondary w-full sm:w-auto">
              Browse Fashion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-8 lg:py-12 bg-[#F6F7F9] min-h-screen">
      <div className="container-page">
        <div className="mb-6">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'My Wishlist' }]} />
        </div>

        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#15171C]">
              My Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {wishlistProducts.length} saved {wishlistProducts.length === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>

        {electronicsItems.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-[#2347F5]" />
              <h2 className="font-display text-xl font-bold text-[#15171C]">Electronics</h2>
            </div>
            <ProductGrid products={electronicsItems} variant="electronics" />
          </div>
        )}

        {fashionItems.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-[#7A2E3A]" />
              <h2 className="font-display text-xl font-bold text-[#15171C]">Fashion</h2>
            </div>
            <ProductGrid products={fashionItems} variant="fashion" />
          </div>
        )}
      </div>
    </div>
  );
}
