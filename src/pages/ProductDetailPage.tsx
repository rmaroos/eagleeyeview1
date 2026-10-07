import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, Check, Truck, ShieldCheck, RotateCcw, ChevronRight } from 'lucide-react';
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
  type Product,
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

  if (!product) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
        <p className="text-gray-500 mb-6">This product is no longer available.</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
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
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor);
    navigate('/cart');
  };

  return (
    <div className="py-6 lg:py-8">
      <div className="container-page">
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Product main section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <ProductGallery images={product.images} alt={product.name} />

          {/* Purchase panel */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.badges.map((badge) => (
                <Badge key={badge} variant={getBadgeVariant(badge)}>
                  {badge}
                </Badge>
              ))}
              {discount > 0 && !product.badges.includes('SALE') && (
                <Badge variant="sale">{`${discount}% OFF`}</Badge>
              )}
            </div>

            <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
              {product.brand}
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              {product.name}
            </h1>

            <div className="mb-4">
              <Rating rating={product.rating} reviewCount={product.reviewCount} size="md" />
            </div>

            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
            {discount > 0 && (
              <div className="text-sm text-green-600 font-medium mb-4">
                You save {formatPrice(product.oldPrice! - product.price)} ({discount}% off)
              </div>
            )}

            <div className="flex items-center gap-2 mb-6">
              {product.stock === 0 ? (
                <span className="flex items-center gap-1.5 text-sm text-red-500">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> Out of Stock
                </span>
              ) : product.stock <= 5 ? (
                <span className="flex items-center gap-1.5 text-sm text-amber-600">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Only {product.stock} left in stock
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-sm text-green-600">
                  <Check size={16} /> In Stock
                </span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {/* Electronics key spec */}
            {isElectronics && product.keySpec && (
              <div className="rounded-lg bg-blue-50 px-4 py-3 mb-6">
                <div className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-1">
                  Key Specification
                </div>
                <div className="text-sm text-gray-700">{product.keySpec}</div>
              </div>
            )}

            {/* Fashion color selector */}
            {!isElectronics && product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-900 mb-2">
                  Colour: <span className="text-gray-600">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`relative h-9 w-9 rounded-full border-2 transition-all ${
                        selectedColor === color.name
                          ? 'border-blue-600 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      aria-label={color.name}
                      title={color.name}
                    >
                      {selectedColor === color.name && (
                        <Check
                          size={14}
                          className="absolute inset-0 m-auto text-white drop-shadow"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fashion attributes */}
            {!isElectronics && (product.material || product.bagType || product.dimensions) && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                {product.material && (
                  <div className="rounded-lg border border-gray-100 px-3 py-2">
                    <div className="text-xs text-gray-500">Material</div>
                    <div className="text-sm font-medium text-gray-900">{product.material}</div>
                  </div>
                )}
                {product.bagType && (
                  <div className="rounded-lg border border-gray-100 px-3 py-2">
                    <div className="text-xs text-gray-500">Bag Type</div>
                    <div className="text-sm font-medium text-gray-900">{product.bagType}</div>
                  </div>
                )}
                {product.dimensions && (
                  <div className="rounded-lg border border-gray-100 px-3 py-2">
                    <div className="text-xs text-gray-500">Dimensions</div>
                    <div className="text-sm font-medium text-gray-900">{product.dimensions}</div>
                  </div>
                )}
                {product.closure && (
                  <div className="rounded-lg border border-gray-100 px-3 py-2">
                    <div className="text-xs text-gray-500">Closure</div>
                    <div className="text-sm font-medium text-gray-900">{product.closure}</div>
                  </div>
                )}
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="flex items-center gap-3 mb-4">
              <QuantitySelector quantity={quantity} onChange={setQuantity} max={product.stock} />
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn-primary flex-1"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
            </div>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="btn-dark w-full mb-6"
            >
              <Zap size={18} />
              Buy Now
            </button>

            {/* Delivery & returns */}
            <div className="rounded-xl border border-gray-100 p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck size={18} className="text-blue-600 shrink-0" />
                <span>Free delivery on eligible orders</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <RotateCcw size={18} className="text-blue-600 shrink-0" />
                <span>Easy returns within the return period</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <ShieldCheck size={18} className="text-blue-600 shrink-0" />
                <span>Secure payment and genuine products</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Description / Specs / Reviews */}
        <div className="mt-12 lg:mt-16">
          <div className="flex items-center gap-1 border-b border-gray-100 mb-6">
            {([
              { key: 'description' as TabKey, label: 'Description' },
              ...(isElectronics && product.specs ? [{ key: 'specs' as TabKey, label: 'Specifications' }] : []),
              { key: 'reviews' as TabKey, label: `Reviews (${product.reviewCount})` },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="max-w-3xl">
              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
              {product.whatsIncluded && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">What's Included</h3>
                  <ul className="space-y-2">
                    {product.whatsIncluded.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check size={16} className="text-green-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {!isElectronics && product.careInstructions && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Care Instructions</h3>
                  <p className="text-sm text-gray-600">{product.careInstructions}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'specs' && product.specs && (
            <div className="max-w-3xl">
              <h3 className="font-semibold text-gray-900 mb-4">Technical Specifications</h3>
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {product.specs.map((spec, i) => (
                      <tr key={spec.label} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 w-1/3">
                          {spec.label}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-3xl">
              <div className="flex items-center gap-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900">{product.rating.toFixed(1)}</div>
                  <Rating rating={product.rating} showCount={false} />
                  <div className="text-xs text-gray-500 mt-1">{product.reviewCount} reviews</div>
                </div>
                <div className="h-16 w-px bg-gray-200" />
                <div className="text-sm text-gray-600">
                  Based on verified purchases from our customers.
                </div>
              </div>
              <div className="rounded-xl border border-gray-100 p-6 text-center">
                <p className="text-gray-500 mb-2">No detailed reviews to display yet.</p>
                <p className="text-sm text-gray-400">Be the first to review this product after purchase.</p>
              </div>
            </div>
          )}
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-12 lg:mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Related Products</h2>
              <Link
                to={`/${deptPath}`}
                className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <ProductGrid products={related} variant={deptPath as 'electronics' | 'fashion'} />
          </div>
        )}
      </div>

      {/* Mobile sticky bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex items-center gap-3 z-40">
        <div className="flex-1">
          <div className="text-xs text-gray-500">{product.name.slice(0, 25)}...</div>
          <div className="font-bold text-gray-900">{formatPrice(product.price)}</div>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="btn-primary px-6"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
