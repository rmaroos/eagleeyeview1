import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Trash2, ShoppingBag, Tag, ArrowRight } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { formatPrice } from '@/data/catalog';
import QuantitySelector from '@/components/ui/QuantitySelector';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, cartSubtotal, showToast } = useStore();
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const grouped = useMemo(() => {
    const electronics = cart.filter((item) => item.product.department === 'electronics');
    const fashion = cart.filter((item) => item.product.department === 'fashion');
    return { electronics, fashion };
  }, [cart]);

  const deliveryFee = cartSubtotal > 50000 ? 0 : cart.length > 0 ? 500 : 0;
  const total = cartSubtotal - appliedDiscount + deliveryFee;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'SAVE10') {
      const discount = Math.round(cartSubtotal * 0.1);
      setAppliedDiscount(discount);
      showToast(`Coupon applied! You saved ${formatPrice(discount)}`, 'success');
    } else {
      showToast('Invalid coupon code', 'error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container-page py-16 lg:py-24">
        <div className="text-center max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
            <ShoppingBag size={36} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">
            Browse our collection and add products you love to your cart.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/electronics" className="btn-primary">Shop Electronics</Link>
            <Link to="/fashion" className="btn-secondary">Shop Fashion</Link>
          </div>
        </div>
      </div>
    );
  }

  const renderCartGroup = (title: string, items: typeof cart) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">{title}</h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.productId + (item.selectedColor || '')}
              className="flex gap-4 rounded-xl border border-gray-100 p-4 bg-white"
            >
              <Link to={`/${item.product.department}/product/${item.product.slug}`} className="shrink-0">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-24 h-24 rounded-lg object-cover bg-gray-50"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 uppercase font-medium">{item.product.brand}</div>
                <Link
                  to={`/${item.product.department}/product/${item.product.slug}`}
                  className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                >
                  {item.product.name}
                </Link>
                {item.selectedColor && (
                  <div className="text-sm text-gray-500 mt-1">Colour: {item.selectedColor}</div>
                )}
                <div className="flex items-center gap-3 mt-3">
                  <QuantitySelector
                    quantity={item.quantity}
                    onChange={(q) => updateCartQuantity(item.productId, q)}
                    size="sm"
                    max={item.product.stock}
                  />
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</div>
                {item.quantity > 1 && (
                  <div className="text-xs text-gray-500">{formatPrice(item.price)} each</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="py-6 lg:py-8">
      <div className="container-page">
        <div className="mb-6">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          {/* Cart items */}
          <div>
            {renderCartGroup('Electronics', grouped.electronics)}
            {renderCartGroup('Fashion', grouped.fashion)}
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-gray-200 p-6 bg-white">
              <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>

              <form onSubmit={handleApplyCoupon} className="mb-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon code"
                      className="input-field pl-9 text-sm"
                    />
                  </div>
                  <button type="submit" className="btn-secondary px-4 text-sm">
                    Apply
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Try code: SAVE10</p>
              </form>

              <div className="space-y-3 py-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">{formatPrice(cartSubtotal)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="font-medium text-green-600">-{formatPrice(appliedDiscount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium text-gray-900">
                    {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-t border-gray-100">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">{formatPrice(total)}</span>
              </div>

              <Link to="/checkout" className="btn-primary w-full mt-2">
                Proceed to Checkout
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/"
                className="block text-center text-sm text-gray-500 hover:text-blue-600 mt-3"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
