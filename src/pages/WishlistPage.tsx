import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
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
      <div className="container-page py-16 lg:py-24">
        <div className="text-center max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
            <Heart size={36} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h1>
          <p className="text-gray-500 mb-8">
            Save products you love and find them later.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/electronics" className="btn-primary">Browse Electronics</Link>
            <Link to="/fashion" className="btn-secondary">Browse Fashion</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 lg:py-8">
      <div className="container-page">
        <div className="mb-6">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Wishlist' }]} />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

        {electronicsItems.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Electronics</h2>
            <ProductGrid products={electronicsItems} variant="electronics" />
          </div>
        )}
        {fashionItems.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Fashion</h2>
            <ProductGrid products={fashionItems} variant="fashion" />
          </div>
        )}
      </div>
    </div>
  );
}
