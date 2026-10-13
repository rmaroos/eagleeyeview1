import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Trash2, ShoppingBag, Tag, ArrowRight, ShieldCheck, Truck, Check } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { formatPrice } from '@/data/catalog';
import QuantitySelector from '@/components/ui/QuantitySelector';
import Breadcrumb from '@/components/ui/Breadcrumb';

const FREE_SHIPPING_THRESHOLD = 50000;

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, cartSubtotal, showToast } = useStore();
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const grouped = useMemo(() => {
    const electronics = cart.filter((item) => item.product.department === 'electronics');
    const fashion = cart.filter((item) => item.product.department === 'fashion');
    return { electronics, fashion };
  }, [cart]);

  const deliveryFee = cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : cart.length > 0 ? 500 : 0;
  const total = cartSubtotal - appliedDiscount + deliveryFee;
  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'SAVE10') {
      const discount = Math.round(cartSubtotal * 0.1);
      setAppliedDiscount(discount);
      showToast(`Coupon applied! You saved ${formatPrice(discount)}`, 'success');
    } else {
      showToast('Invalid coupon code. Try "SAVE10"', 'error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container-page py-16 sm:py-24">
        <div className="text-center max-w-md mx-auto p-8 rounded-3xl bg-slate-50 border border-gray-200">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-sm border border-gray-200 mb-6">
            <ShoppingBag size={32} className="text-gray-400" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#15171C] mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mb-8 leading-relaxed">
            Looks like you haven't added any products yet. Discover premium tech or stylish fashion essentials.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/electronics" className="btn-primary w-full sm:w-auto">
              Shop Electronics
            </Link>
            <Link to="/fashion" className="btn-secondary w-full sm:w-auto">
              Shop Fashion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const renderCartGroup = (title: string, items: typeof cart) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="h-2 w-2 rounded-full bg-[#2347F5]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">{title} Items</h2>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.productId + (item.selectedColor || '')}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-gray-200 p-4 bg-white shadow-2xs hover:border-gray-300 transition-colors"
            >
              <Link
                to={`/${item.product.department}/product/${item.product.slug}`}
                className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-50 border border-gray-100"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </Link>

              <div className="flex-1 min-w-0 w-full sm:w-auto">
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  {item.product.brand}
                </div>
                <Link
                  to={`/${item.product.department}/product/${item.product.slug}`}
                  className="font-semibold text-sm sm:text-[15px] text-[#15171C] hover:text-[#2347F5] transition-colors line-clamp-1"
                >
                  {item.product.name}
                </Link>
                {item.selectedColor && (
                  <div className="text-xs text-gray-500 mt-0.5">
                    Color: <span className="font-medium text-gray-700">{item.selectedColor}</span>
                  </div>
                )}

                <div className="flex items-center justify-between sm:justify-start gap-4 mt-3">
                  <QuantitySelector
                    quantity={item.quantity}
                    onChange={(q) => updateCartQuantity(item.productId, q)}
                    size="sm"
                    max={item.product.stock}
                  />
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 mt-2 sm:mt-0 flex sm:flex-col justify-between items-baseline sm:items-end">
                <div className="text-base sm:text-lg font-extrabold text-[#15171C]">
                  {formatPrice(item.price * item.quantity)}
                </div>
                {item.quantity > 1 && (
                  <div className="text-xs text-gray-400">{formatPrice(item.price)} each</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="py-6 sm:py-8 lg:py-12 bg-[#F6F7F9] min-h-screen">
      <div className="container-page">
        <div className="mb-6">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Shopping Cart' }]} />
        </div>

        <div className="flex items-baseline justify-between mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#15171C]">
            Shopping Cart
          </h1>
          <span className="text-sm text-gray-500">
            {cart.reduce((s, i) => s + i.quantity, 0)} items in total
          </span>
        </div>

        {/* Free shipping progress indicator */}
        <div className="mb-8 p-4 rounded-2xl bg-white border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold mb-2">
            <span className="flex items-center gap-2 text-gray-700">
              <Truck size={17} className="text-[#2347F5]" />
              {remainingForFreeShipping > 0 ? (
                <>Add <span className="text-[#2347F5] font-bold">{formatPrice(remainingForFreeShipping)}</span> more for Free Delivery!</>
              ) : (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check size={16} /> Congratulations! You unlocked free islandwide delivery.
                </span>
              )}
            </span>
            <span className="text-gray-400 font-mono text-xs">{freeShippingProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-[#2347F5] rounded-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Cart items list */}
          <div className="lg:col-span-8">
            {renderCartGroup('Electronics', grouped.electronics)}
            {renderCartGroup('Fashion', grouped.fashion)}
          </div>

          {/* Order Summary sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-xs">
              <h2 className="font-display font-bold text-[#15171C] text-lg mb-5">
                Order Summary
              </h2>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Promo code (SAVE10)"
                      className="w-full h-10 rounded-xl border border-gray-200 bg-slate-50 pl-9 pr-3 text-xs sm:text-sm text-[#15171C] uppercase placeholder:normal-case focus:outline-none focus:border-[#15171C]"
                    />
                  </div>
                  <button type="submit" className="btn-secondary h-10 px-4 text-xs font-bold">
                    Apply
                  </button>
                </div>
              </form>

              {/* Calculation list */}
              <div className="space-y-3 pb-5 border-b border-gray-100 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#15171C]">{formatPrice(cartSubtotal)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount (SAVE10)</span>
                    <span>-{formatPrice(appliedDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Delivery</span>
                  <span>{deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatPrice(deliveryFee)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-4 pb-6 flex justify-between items-baseline">
                <span className="font-display font-bold text-[#15171C] text-base">Estimated Total</span>
                <span className="font-display font-extrabold text-2xl text-[#15171C]">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Checkout CTA */}
              <Link
                to="/checkout"
                className="btn-primary w-full h-12 text-sm font-bold shadow-md"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck size={16} className="text-gray-400" />
                <span>256-bit SSL encrypted checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
