import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, Check, Truck, ShieldCheck, RotateCcw, ChevronRight, Award } from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Rating from '@/components/ui/Rating';
import Badge, { getBadgeVariant } from '@/components/ui/Badge';
import QuantitySelector from '@/components/ui/QuantitySelector';
import ProductGallery from '@/components/commerce/ProductGallery';
import ProductGrid from '@/components/commerce/ProductGrid';
import { useStore } from '@/store/StoreContext';
import {
  getProductBySlug,
  getRelatedProducts,
  formatPrice,
} from '@/data/catalog';

export default function ProductDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { addToCart } = useStore();

  const slug = params.slug;
  const product = slug ? getProductBySlug(slug) : undefined;

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product?.colors?.[0]?.name);
  type TabKey = 'description' | 'specs' | 'reviews';
  const [activeTab, setActiveTab] = useState<TabKey>('description');
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-3xl font-extrabold text-[#15171C] mb-4">Product Not Found</h1>
        <p className="text-gray-500 mb-6">The product you are looking for is no longer in our catalog.</p>
        <Link to="/" className="btn-primary">Return to Storefront</Link>
      </div>
    );
  }

  const isElectronics = product.department === 'electronics';
  const deptPath = isElectronics ? 'electronics' : 'fashion';
  const related = getRelatedProducts(product, 4);

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: isElectronics ? 'Electronics' : 'Fashion', href: `/${deptPath}` },
    { label: product.name },
  ];

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor);
    navigate('/cart');
  };

  return (
    <div className="py-6 sm:py-8 lg:py-12 pb-24 lg:pb-16 bg-white min-h-screen">
      <div className="container-page">
        {/* Breadcrumb navigation */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Product showcase main grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Gallery area */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} alt={product.name} />
          </div>

          {/* Details & Purchase Panel */}
          <div className="lg:col-span-5 flex flex-col">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {product.badges.map((badge) => (
                <Badge key={badge} variant={getBadgeVariant(badge)}>
                  {badge}
                </Badge>
              ))}
              {discount > 0 && !product.badges.includes('SALE') && (
                <span className="inline-flex items-center rounded-full bg-[#DC2626] px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
                  {discount}% OFF
                </span>
              )}
            </div>

            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              {product.brand}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#15171C] leading-snug mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mb-4">
              <Rating rating={product.rating} reviewCount={product.reviewCount} size="md" />
            </div>

            {/* Price section */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-gray-100 mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#15171C]">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-base sm:text-lg text-gray-400 line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <div className="text-xs font-semibold text-green-700 mt-1">
                  You save {formatPrice(product.oldPrice! - product.price)} ({discount}% off)
                </div>
              )}
            </div>

            {/* Stock pill */}
            <div className="flex items-center gap-2 mb-5">
              {product.stock === 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Currently Out of Stock
                </span>
              ) : product.stock <= 5 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Only {product.stock} items remaining
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Check size={14} /> Ready to ship (In Stock)
                </span>
              )}
            </div>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Electronics Key Spec Highlight */}
            {isElectronics && product.keySpec && (
              <div className="rounded-xl bg-blue-50/80 border border-blue-100 p-3.5 mb-6">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#2347F5] mb-1">
                  Key Specification
                </div>
                <div className="text-sm font-semibold text-slate-800">{product.keySpec}</div>
              </div>
            )}

            {/* Fashion Color Selector */}
            {!isElectronics && product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Selected Color: <span className="text-[#15171C] font-semibold">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`relative h-9 w-9 rounded-full border-2 transition-transform ${
                        selectedColor === color.name
                          ? 'border-[#15171C] scale-110 shadow-md ring-2 ring-black/10'
                          : 'border-white hover:scale-105 shadow-sm'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      aria-label={color.name}
                      title={color.name}
                    >
                      {selectedColor === color.name && (
                        <Check
                          size={13}
                          className="absolute inset-0 m-auto text-white drop-shadow"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fashion Attributes Grid */}
            {!isElectronics && (product.material || product.bagType || product.dimensions) && (
              <div className="grid grid-cols-2 gap-2.5 mb-6">
                {product.material && (
                  <div className="rounded-xl border border-gray-200 bg-slate-50/50 p-2.5">
                    <div className="text-[11px] text-gray-400 font-semibold">Material</div>
                    <div className="text-xs font-bold text-[#15171C]">{product.material}</div>
                  </div>
                )}
                {product.bagType && (
                  <div className="rounded-xl border border-gray-200 bg-slate-50/50 p-2.5">
                    <div className="text-[11px] text-gray-400 font-semibold">Silhouette</div>
                    <div className="text-xs font-bold text-[#15171C]">{product.bagType}</div>
                  </div>
                )}
                {product.dimensions && (
                  <div className="rounded-xl border border-gray-200 bg-slate-50/50 p-2.5">
                    <div className="text-[11px] text-gray-400 font-semibold">Dimensions</div>
                    <div className="text-xs font-bold text-[#15171C]">{product.dimensions}</div>
                  </div>
                )}
                {product.closure && (
                  <div className="rounded-xl border border-gray-200 bg-slate-50/50 p-2.5">
                    <div className="text-[11px] text-gray-400 font-semibold">Closure Type</div>
                    <div className="text-xs font-bold text-[#15171C]">{product.closure}</div>
                  </div>
                )}
              </div>
            )}

            {/* Quantity & Add to Cart Controls */}
            <div className="flex items-center gap-3 mb-3">
              <QuantitySelector quantity={quantity} onChange={setQuantity} max={product.stock} />
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn-primary flex-1 h-12 text-sm font-bold shadow-sm"
              >
                {added ? (
                  <>
                    <Check size={18} /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} /> Add to Cart
                  </>
                )}
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="btn-dark w-full h-12 text-sm font-bold mb-6"
            >
              <Zap size={18} /> Buy Now Instantly
            </button>

            {/* Trust Badges */}
            <div className="rounded-2xl border border-gray-200 bg-slate-50/50 p-4 space-y-3">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-700">
                <Truck size={18} className="text-[#2347F5] shrink-0" />
                <span>Free delivery across the island on eligible orders</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-700">
                <RotateCcw size={18} className="text-[#2347F5] shrink-0" />
                <span>Hassle-free returns within the 14-day policy</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-700">
                <ShieldCheck size={18} className="text-[#2347F5] shrink-0" />
                <span>Genuine product warranty &amp; secure checkout encryption</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Info Section */}
        <div className="mt-14 lg:mt-20 border-t border-gray-200 pt-8">
          <div className="flex items-center gap-2 border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
            {([
              { key: 'description' as TabKey, label: 'Overview & Details' },
              ...(isElectronics && product.specs ? [{ key: 'specs' as TabKey, label: 'Specifications' }] : []),
              { key: 'reviews' as TabKey, label: `Customer Reviews (${product.reviewCount})` },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? 'border-[#2347F5] text-[#2347F5]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="max-w-3xl space-y-6">
              <p className="text-gray-700 leading-relaxed text-base">{product.description}</p>
              {product.whatsIncluded && (
                <div className="rounded-2xl border border-gray-200 p-5 bg-slate-50">
                  <h3 className="font-bold text-[#15171C] text-sm uppercase tracking-wider mb-3">
                    What's in the Box
                  </h3>
                  <ul className="space-y-2">
                    {product.whatsIncluded.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                        <Check size={15} className="text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {!isElectronics && product.careInstructions && (
                <div className="rounded-2xl border border-gray-200 p-5 bg-slate-50">
                  <h3 className="font-bold text-[#15171C] text-sm uppercase tracking-wider mb-2">
                    Material Care
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{product.careInstructions}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'specs' && product.specs && (
            <div className="max-w-3xl">
              <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-sm">
                  <tbody>
                    {product.specs.map((spec, i) => (
                      <tr key={spec.label} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                        <td className="px-5 py-3.5 font-semibold text-gray-900 w-1/3 border-b border-gray-100">
                          {spec.label}
                        </td>
                        <td className="px-5 py-3.5 text-gray-600 border-b border-gray-100">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-3xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-2xl bg-slate-50 border border-gray-200 mb-6">
                <div>
                  <div className="text-4xl font-extrabold text-[#15171C]">{product.rating.toFixed(1)}</div>
                  <Rating rating={product.rating} showCount={false} size="md" />
                  <div className="text-xs text-gray-500 mt-1">{product.reviewCount} verified customer ratings</div>
                </div>
                <div className="hidden sm:block h-16 w-px bg-gray-200" />
                <div className="text-sm text-gray-600 leading-relaxed">
                  Every review is gathered from customers with verified delivery confirmations.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16 lg:mt-24 border-t border-gray-200 pt-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#15171C]">
                You May Also Like
              </h2>
              <Link
                to={`/${deptPath}`}
                className="inline-flex items-center gap-1 text-sm font-bold text-[#2347F5] hover:underline"
              >
                Browse All <ChevronRight size={16} />
              </Link>
            </div>
            <ProductGrid products={related} variant={deptPath as 'electronics' | 'fashion'} />
          </div>
        )}
      </div>

      {/* Mobile Sticky Bottom Checkout Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 sm:p-4 flex items-center justify-between gap-3 z-30 shadow-lg">
        <div className="min-w-0 flex-1">
          <div className="text-xs text-gray-500 truncate">{product.name}</div>
          <div className="text-base font-extrabold text-[#15171C]">{formatPrice(product.price)}</div>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="btn-primary h-11 px-6 text-xs sm:text-sm font-bold shrink-0 shadow-sm"
        >
          {added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
