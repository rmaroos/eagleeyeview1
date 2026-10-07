import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Lock, CreditCard, Truck, MapPin, User as UserIcon } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { formatPrice } from '@/data/catalog';

const steps = [
  { id: 1, label: 'Contact', icon: UserIcon },
  { id: 2, label: 'Address', icon: MapPin },
  { id: 3, label: 'Delivery', icon: Truck },
  { id: 4, label: 'Payment', icon: CreditCard },
  { id: 5, label: 'Review', icon: Check },
];

export default function CheckoutPage() {
  const { cart, cartSubtotal, clearCart } = useStore();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    deliveryMethod: 'standard',
    paymentMethod: 'card',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
  });

  const deliveryFee = cartSubtotal > 50000 ? 0 : 500;
  const total = cartSubtotal + deliveryFee;

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      const orderRef = `ORD-2026-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
      clearCart();
      navigate(`/order-confirmation/${orderRef}`);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (cart.length === 0) {
    return (
      <div className="container-page py-16 lg:py-24">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">Add products to your cart before checkout.</p>
          <Link to="/" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 lg:py-8 min-h-screen bg-gray-50">
      <div className="container-page">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto no-scrollbar">
          {steps.map((step, i) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isComplete = currentStep > step.id;
            return (
              <div key={step.id} className="flex items-center shrink-0">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : isComplete
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                      isActive
                        ? 'bg-white/20'
                        : isComplete
                        ? 'bg-green-100'
                        : 'bg-gray-100'
                    }`}
                  >
                    {isComplete ? <Check size={14} /> : <StepIcon size={14} />}
                  </div>
                  {step.label}
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-6 h-px mx-1 ${isComplete ? 'bg-green-300' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          {/* Form */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-gray-900 text-lg">Contact Information</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    placeholder="you@example.com"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateForm('phone', e.target.value)}
                    placeholder="+94 77 123 4567"
                    className="input-field"
                    required
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-gray-900 text-lg">Delivery Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => updateForm('firstName', e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => updateForm('lastName', e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => updateForm('address', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => updateForm('city', e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Postal Code</label>
                    <input
                      type="text"
                      value={form.postalCode}
                      onChange={(e) => updateForm('postalCode', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-gray-900 text-lg">Delivery Method</h2>
                {[
                  { id: 'standard', label: 'Standard Delivery', desc: '3-5 business days', price: cartSubtotal > 50000 ? 'Free' : 'LKR 500' },
                  { id: 'express', label: 'Express Delivery', desc: '1-2 business days', price: 'LKR 1,500' },
                  { id: 'pickup', label: 'Store Pickup', desc: 'Available within 24 hours', price: 'Free' },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-4 rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                      form.deliveryMethod === method.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={method.id}
                      checked={form.deliveryMethod === method.id}
                      onChange={(e) => updateForm('deliveryMethod', e.target.value)}
                      className="accent-blue-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{method.label}</div>
                      <div className="text-sm text-gray-500">{method.desc}</div>
                    </div>
                    <div className="font-semibold text-gray-900">{method.price}</div>
                  </label>
                ))}
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-gray-900 text-lg">Payment Method</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Lock size={16} className="text-green-500" />
                  Your payment information is encrypted and secure.
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Number</label>
                    <input
                      type="text"
                      value={form.cardNumber}
                      onChange={(e) => updateForm('cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Name on Card</label>
                    <input
                      type="text"
                      value={form.cardName}
                      onChange={(e) => updateForm('cardName', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
                      <input
                        type="text"
                        value={form.cardExpiry}
                        onChange={(e) => updateForm('cardExpiry', e.target.value)}
                        placeholder="MM/YY"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
                      <input
                        type="text"
                        value={form.cardCvv}
                        onChange={(e) => updateForm('cardCvv', e.target.value)}
                        placeholder="123"
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  This is a demo checkout. No real payment will be processed.
                </p>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-gray-900 text-lg">Review Your Order</h2>
                <div className="rounded-lg bg-gray-50 p-4 space-y-2 text-sm">
                  <div className="font-medium text-gray-900">Contact</div>
                  <div className="text-gray-600">{form.email || '—'} • {form.phone || '—'}</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 space-y-2 text-sm">
                  <div className="font-medium text-gray-900">Delivery Address</div>
                  <div className="text-gray-600">
                    {form.firstName || '—'} {form.lastName}
                    <br />
                    {form.address || '—'}, {form.city || '—'} {form.postalCode}
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 space-y-2 text-sm">
                  <div className="font-medium text-gray-900">Delivery Method</div>
                  <div className="text-gray-600 capitalize">{form.deliveryMethod}</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 space-y-2 text-sm">
                  <div className="font-medium text-gray-900">Payment</div>
                  <div className="text-gray-600">Card ending in {form.cardNumber.slice(-4) || '••••'}</div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="btn-ghost disabled:opacity-40"
              >
                Back
              </button>
              <button onClick={handleNext} className="btn-primary">
                {currentStep === 5 ? (
                  <>
                    <Lock size={16} />
                    Place Order
                  </>
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-gray-200 p-6 bg-white">
              <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-14 h-14 rounded-lg object-cover bg-gray-50 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">{item.product.name}</div>
                      <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-sm font-medium text-gray-900 shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 py-4 border-t border-gray-100 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium">{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</span>
                </div>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-100">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
