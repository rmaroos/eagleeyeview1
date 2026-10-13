import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Lock, CreditCard, Truck, MapPin, User as UserIcon, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { formatPrice } from '@/data/catalog';

const steps = [
  { id: 1, label: 'Contact', icon: UserIcon },
  { id: 2, label: 'Shipping Address', icon: MapPin },
  { id: 3, label: 'Delivery Option', icon: Truck },
  { id: 4, label: 'Payment Method', icon: CreditCard },
  { id: 5, label: 'Review & Confirm', icon: Check },
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

  const deliveryFee = cartSubtotal >= 50000 ? 0 : 500;
  const total = cartSubtotal + deliveryFee;

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const orderRef = `ORD-2026-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
      clearCart();
      navigate(`/order-confirmation/${orderRef}`);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container-page py-16 sm:py-24">
        <div className="text-center max-w-md mx-auto p-8 rounded-3xl bg-white border border-gray-200">
          <h1 className="font-display text-2xl font-bold text-[#15171C] mb-2">No Items to Checkout</h1>
          <p className="text-gray-500 mb-6 text-sm">Your cart is currently empty.</p>
          <Link to="/" className="btn-primary">Return to Store</Link>
        </div>
      </div>
    );
  }

  const activeStepObj = steps.find((s) => s.id === currentStep)!;

  return (
    <div className="py-6 sm:py-10 min-h-screen bg-[#F6F7F9]">
      <div className="container-page">
        {/* Header with security note */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#15171C]">
              Express Checkout
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Complete your details to place the order.</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full w-fit">
            <Lock size={13} />
            <span>256-Bit Encrypted &amp; Secure</span>
          </div>
        </div>

        {/* Responsive Step Progress Wizard */}
        <div className="mb-8 p-4 rounded-2xl bg-white border border-gray-200 shadow-xs">
          {/* Mobile Step Indicator */}
          <div className="sm:hidden">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-[#2347F5]">Step {currentStep} of 5</span>
              <span className="text-gray-900">{activeStepObj.label}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-[#2347F5] rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Desktop/Tablet Step Indicator */}
          <div className="hidden sm:flex items-center justify-between">
            {steps.map((step, i) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isComplete = currentStep > step.id;
              return (
                <div key={step.id} className="flex items-center flex-1 last:flex-initial">
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#2347F5] text-white shadow-sm'
                        : isComplete
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-gray-400'
                    }`}
                  >
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                        isActive
                          ? 'bg-white/20'
                          : isComplete
                          ? 'bg-emerald-200 text-emerald-800'
                          : 'bg-gray-100'
                      }`}
                    >
                      {isComplete ? <Check size={12} className="stroke-[3]" /> : step.id}
                    </div>
                    <span>{step.label}</span>
                  </div>

                  {i < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 rounded-full ${
                        isComplete ? 'bg-emerald-300' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Grid: Form Left, Summary Right */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Checkout Steps Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
              <form onSubmit={handleNext}>
                {/* Step 1: Contact */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h2 className="font-display font-bold text-xl text-[#15171C]">
                      Contact Details
                    </h2>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                        Email Address
                      </label>
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
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                        Phone Number
                      </label>
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

                {/* Step 2: Shipping Address */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h2 className="font-display font-bold text-xl text-[#15171C]">
                      Shipping Address
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={form.firstName}
                          onChange={(e) => updateForm('firstName', e.target.value)}
                          placeholder="John"
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={form.lastName}
                          onChange={(e) => updateForm('lastName', e.target.value)}
                          placeholder="Doe"
                          className="input-field"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={form.address}
                        onChange={(e) => updateForm('address', e.target.value)}
                        placeholder="123 Galle Road"
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                          City
                        </label>
                        <input
                          type="text"
                          value={form.city}
                          onChange={(e) => updateForm('city', e.target.value)}
                          placeholder="Colombo"
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          value={form.postalCode}
                          onChange={(e) => updateForm('postalCode', e.target.value)}
                          placeholder="00300"
                          className="input-field"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Delivery Options */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <h2 className="font-display font-bold text-xl text-[#15171C]">
                      Select Delivery Method
                    </h2>
                    <div className="space-y-3">
                      {[
                        { id: 'standard', name: 'Standard Islandwide Delivery', time: '2-4 Business Days', fee: deliveryFee === 0 ? 'FREE' : 'LKR 500' },
                        { id: 'express', name: 'Priority Express Delivery', time: '1-2 Business Days', fee: 'LKR 1,200' },
                      ].map((m) => (
                        <label
                          key={m.id}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            form.deliveryMethod === m.id
                              ? 'border-[#2347F5] bg-blue-50/40'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="delivery"
                              checked={form.deliveryMethod === m.id}
                              onChange={() => updateForm('deliveryMethod', m.id)}
                              className="accent-[#2347F5]"
                            />
                            <div>
                              <div className="font-bold text-[#15171C] text-sm">{m.name}</div>
                              <div className="text-xs text-gray-500">{m.time}</div>
                            </div>
                          </div>
                          <span className="font-bold text-sm text-[#15171C]">{m.fee}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Payment */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <h2 className="font-display font-bold text-xl text-[#15171C]">
                      Payment Details
                    </h2>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[
                        { id: 'card', label: 'Credit / Debit Card' },
                        { id: 'cod', label: 'Cash on Delivery' },
                      ].map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => updateForm('paymentMethod', p.id)}
                          className={`p-3 rounded-xl border-2 text-xs font-bold transition-all ${
                            form.paymentMethod === p.id
                              ? 'border-[#2347F5] bg-blue-50 text-[#2347F5]'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>

                    {form.paymentMethod === 'card' ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                            Card Number
                          </label>
                          <input
                            type="text"
                            value={form.cardNumber}
                            onChange={(e) => updateForm('cardNumber', e.target.value)}
                            placeholder="4532 •••• •••• 8892"
                            className="input-field"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              value={form.cardExpiry}
                              onChange={(e) => updateForm('cardExpiry', e.target.value)}
                              placeholder="MM/YY"
                              className="input-field"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                              CVV / CVC
                            </label>
                            <input
                              type="password"
                              value={form.cardCvv}
                              onChange={(e) => updateForm('cardCvv', e.target.value)}
                              placeholder="•••"
                              maxLength={4}
                              className="input-field"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 leading-relaxed">
                        Pay cash upon delivery. Please ensure you have the exact amount ready when your driver arrives.
                      </div>
                    )}
                  </div>
                )}

                {/* Step 5: Review */}
                {currentStep === 5 && (
                  <div className="space-y-4">
                    <h2 className="font-display font-bold text-xl text-[#15171C]">
                      Review Order Details
                    </h2>
                    <div className="divide-y divide-gray-100 text-sm">
                      <div className="py-2.5 flex justify-between">
                        <span className="text-gray-500">Contact:</span>
                        <span className="font-medium text-[#15171C]">{form.email || 'you@example.com'}</span>
                      </div>
                      <div className="py-2.5 flex justify-between">
                        <span className="text-gray-500">Ship to:</span>
                        <span className="font-medium text-[#15171C] text-right">
                          {form.address ? `${form.address}, ${form.city}` : '123 Galle Rd, Colombo'}
                        </span>
                      </div>
                      <div className="py-2.5 flex justify-between">
                        <span className="text-gray-500">Method:</span>
                        <span className="font-medium text-[#15171C] capitalize">{form.deliveryMethod}</span>
                      </div>
                      <div className="py-2.5 flex justify-between">
                        <span className="text-gray-500">Payment:</span>
                        <span className="font-medium text-[#15171C] uppercase">{form.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between gap-3">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="btn-secondary h-11 px-5 text-xs font-bold"
                    >
                      <ArrowLeft size={15} /> Back
                    </button>
                  ) : (
                    <Link
                      to="/cart"
                      className="text-xs font-bold text-gray-500 hover:text-gray-800 flex items-center gap-1"
                    >
                      <ArrowLeft size={14} /> Back to Cart
                    </Link>
                  )}

                  <button
                    type="submit"
                    className="btn-primary h-11 px-6 text-xs sm:text-sm font-bold ml-auto shadow-sm"
                  >
                    {currentStep === 5 ? 'Confirm & Place Order' : 'Continue'}
                    <ArrowRight size={15} />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sticky Mini Cart Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
              <h3 className="font-display font-bold text-lg text-[#15171C] mb-4">
                Items in Order ({cart.length})
              </h3>

              <div className="max-h-60 overflow-y-auto space-y-3 pr-1 mb-5 divide-y divide-gray-100">
                {cart.map((item) => (
                  <div key={item.productId} className="pt-3 first:pt-0 flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover bg-slate-50 border border-gray-100 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-[#15171C] truncate">{item.product.name}</div>
                      <div className="text-[11px] text-gray-400">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-xs font-bold text-[#15171C] whitespace-nowrap">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 pt-4 border-t border-gray-100 text-xs sm:text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#15171C]">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-gray-100 text-base font-bold text-[#15171C]">
                  <span>Total Amount</span>
                  <span className="font-display text-xl font-extrabold">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
