import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Check,
  Lock,
  CreditCard,
  Truck,
  MapPin,
  User as UserIcon,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Wallet,
  Building2,
  Banknote,
} from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { formatPrice } from '@/data/catalog';
import {
  processPayHerePayment,
  createSupabaseOrder,
  type PaymentGatewayConfig,
  type PaymentGatewayId,
} from '@/lib/paymentService';

const steps = [
  { id: 1, label: 'Contact', icon: UserIcon },
  { id: 2, label: 'Shipping Address', icon: MapPin },
  { id: 3, label: 'Delivery Option', icon: Truck },
  { id: 4, label: 'Payment Method', icon: CreditCard },
  { id: 5, label: 'Review & Confirm', icon: Check },
];

export default function CheckoutPage() {
  const { cart, cartSubtotal, clearCart, showToast, paymentGateways } = useStore();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter enabled gateways configured from Admin
  const availableGateways = useMemo(() => {
    const enabled = paymentGateways.filter((g) => g.enabled);
    if (enabled.length > 0) return enabled;
    // Fallback if none enabled yet
    return [
      {
        id: 'cod' as PaymentGatewayId,
        name: 'Cash on Delivery (COD)',
        description: 'Pay cash directly upon delivery.',
        enabled: true,
        mode: 'live' as const,
        currency: 'LKR',
      },
    ];
  }, [paymentGateways]);

  const [form, setForm] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    deliveryMethod: 'standard',
    paymentMethod: availableGateways[0]?.id || 'payhere',
    notes: '',
  });

  // Ensure selected payment method is one of the enabled ones
  useEffect(() => {
    if (!availableGateways.some((g) => g.id === form.paymentMethod)) {
      if (availableGateways[0]) {
        setForm((prev) => ({ ...prev, paymentMethod: availableGateways[0].id }));
      }
    }
  }, [availableGateways, form.paymentMethod]);

  const deliveryFee = cartSubtotal >= 50000 ? 0 : 500;
  const total = cartSubtotal + deliveryFee;

  const selectedGateway: PaymentGatewayConfig =
    availableGateways.find((g) => g.id === form.paymentMethod) || availableGateways[0];

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      await handleExecutePayment();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleExecutePayment = async () => {
    const orderRef = `ORD-2026-${String(Math.floor(100000 + Math.random() * 900000))}`;
    setIsProcessing(true);

    const customerDetails = {
      firstName: form.firstName || 'Customer',
      lastName: form.lastName || '',
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
    };

    const orderPayload = {
      orderRef,
      customerName: `${form.firstName} ${form.lastName}`.trim(),
      customerEmail: form.email,
      customerPhone: form.phone,
      items: cart.map((item) => ({
        id: item.productId,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
      })),
      subtotal: cartSubtotal,
      shippingFee: deliveryFee,
      total,
      shippingAddress: {
        street: form.address,
        city: form.city,
        postalCode: form.postalCode,
      },
      deliveryMethod: form.deliveryMethod,
      paymentMethod: selectedGateway.id,
      notes: form.notes,
    };

    // 1. PayHere Flow
    if (selectedGateway.id === 'payhere') {
      await processPayHerePayment({
        gateway: selectedGateway,
        orderRef,
        amount: total,
        items: cart,
        customer: customerDetails,
        onSuccess: async (paidRef) => {
          await createSupabaseOrder({
            ...orderPayload,
            orderRef: paidRef || orderRef,
            paymentStatus: 'paid',
          });
          clearCart();
          showToast('Payment successful! Order confirmed.', 'success');
          setIsProcessing(false);
          navigate(`/order-confirmation/${paidRef || orderRef}`);
        },
        onDismiss: () => {
          setIsProcessing(false);
          showToast('Payment window closed. You can retry or pick another method.', 'info');
        },
        onError: (err) => {
          setIsProcessing(false);
          showToast(`PayHere: ${err}`, 'error');
        },
      });
      return;
    }

    // 2. WEBXPAY Flow
    if (selectedGateway.id === 'webxpay') {
      setTimeout(async () => {
        await createSupabaseOrder({
          ...orderPayload,
          paymentStatus: 'paid',
        });
        clearCart();
        showToast('WEBXPAY authorization verified! Order confirmed.', 'success');
        setIsProcessing(false);
        navigate(`/order-confirmation/${orderRef}`);
      }, 1200);
      return;
    }

    // 3. PayPal Flow
    if (selectedGateway.id === 'paypal') {
      setTimeout(async () => {
        await createSupabaseOrder({
          ...orderPayload,
          paymentStatus: 'paid',
        });
        clearCart();
        showToast('PayPal transaction completed! Order confirmed.', 'success');
        setIsProcessing(false);
        navigate(`/order-confirmation/${orderRef}`);
      }, 1200);
      return;
    }

    // 4. Cash on Delivery (COD)
    await createSupabaseOrder({
      ...orderPayload,
      paymentStatus: 'pending',
    });
    clearCart();
    showToast('Order placed successfully! Cash on Delivery.', 'success');
    setIsProcessing(false);
    navigate(`/order-confirmation/${orderRef}`);
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
              Secure Checkout
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

          {/* Desktop Step Indicator */}
          <div className="hidden sm:flex items-center justify-between">
            {steps.map((step, i) => {
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

        {/* Two-Column Grid: Form + Sticky Mini Cart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
              <form onSubmit={handleNext}>
                {/* Step 1: Contact Information */}
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
                          City / District
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
                        {
                          id: 'standard',
                          name: 'Standard Islandwide Delivery',
                          time: '2-4 Business Days',
                          fee: deliveryFee === 0 ? 'FREE' : 'LKR 500',
                        },
                        {
                          id: 'express',
                          name: 'Priority Express Delivery',
                          time: '1-2 Business Days',
                          fee: 'LKR 1,200',
                        },
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

                {/* Step 4: Payment Gateway Selection */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-display font-bold text-xl text-[#15171C]">
                        Choose Payment Gateway
                      </h2>
                      <span className="text-xs text-gray-500">
                        {availableGateways.length} methods available
                      </span>
                    </div>

                    <div className="space-y-3">
                      {availableGateways.map((gw) => {
                        const isSelected = form.paymentMethod === gw.id;
                        return (
                          <label
                            key={gw.id}
                            className={`flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                              isSelected
                                ? 'border-[#2347F5] bg-blue-50/30 shadow-xs'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <input
                                  type="radio"
                                  name="payment"
                                  checked={isSelected}
                                  onChange={() => updateForm('paymentMethod', gw.id)}
                                  className="accent-[#2347F5] h-4 w-4"
                                />
                                <div>
                                  <div className="font-bold text-[#15171C] text-sm sm:text-base flex items-center gap-2">
                                    {gw.name}
                                    {gw.mode === 'sandbox' && (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                                        Test Sandbox
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-0.5">{gw.description}</div>
                                </div>
                              </div>

                              <div className="shrink-0 pl-2">
                                {gw.id === 'payhere' && (
                                  <span className="text-[10px] font-extrabold uppercase px-2 py-1 rounded-md bg-blue-100 text-blue-700 tracking-wider">
                                    Cards / Mobile Pay
                                  </span>
                                )}
                                {gw.id === 'webxpay' && (
                                  <span className="text-[10px] font-extrabold uppercase px-2 py-1 rounded-md bg-emerald-100 text-emerald-700 tracking-wider">
                                    LankaQR / Cards
                                  </span>
                                )}
                                {gw.id === 'paypal' && (
                                  <span className="text-[10px] font-extrabold uppercase px-2 py-1 rounded-md bg-sky-100 text-sky-700 tracking-wider">
                                    PayPal USD
                                  </span>
                                )}
                                {gw.id === 'cod' && (
                                  <span className="text-[10px] font-extrabold uppercase px-2 py-1 rounded-md bg-gray-100 text-gray-700 tracking-wider">
                                    Cash
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Gateway Channels preview */}
                            <div className="ml-7 pt-2 border-t border-gray-100/80 flex flex-wrap gap-1.5 text-[11px] text-gray-500">
                              {gw.id === 'payhere' && (
                                <span>Accepted: Visa • MasterCard • AMEX • FriMi • Genie • eZ Cash • mCash</span>
                              )}
                              {gw.id === 'webxpay' && (
                                <span>Accepted: LankaQR • Visa • MasterCard • Sampath Vishwa • UnionPay</span>
                              )}
                              {gw.id === 'paypal' && (
                                <span>Accepted: PayPal Wallet • Visa • MasterCard • Discover • Amex</span>
                              )}
                              {gw.id === 'cod' && (
                                <span>{gw.instructions || 'Pay in cash upon doorstep delivery'}</span>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>

                    {selectedGateway.mode === 'sandbox' && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                        <AlertTriangle size={15} className="shrink-0 text-amber-600" />
                        <span>
                          <strong>Test Sandbox Active:</strong> You can safely test payments without real charges using {selectedGateway.name}'s test cards.
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 5: Review & Confirm */}
                {currentStep === 5 && (
                  <div className="space-y-5">
                    <h2 className="font-display font-bold text-xl text-[#15171C]">
                      Review &amp; Place Order
                    </h2>
                    <div className="divide-y divide-gray-100 text-sm">
                      <div className="py-2.5 flex justify-between">
                        <span className="text-gray-500">Customer:</span>
                        <span className="font-medium text-[#15171C]">{form.firstName} {form.lastName}</span>
                      </div>
                      <div className="py-2.5 flex justify-between">
                        <span className="text-gray-500">Contact:</span>
                        <span className="font-medium text-[#15171C]">{form.email || 'you@example.com'} • {form.phone}</span>
                      </div>
                      <div className="py-2.5 flex justify-between">
                        <span className="text-gray-500">Ship to:</span>
                        <span className="font-medium text-[#15171C] text-right">
                          {form.address ? `${form.address}, ${form.city}` : '123 Galle Rd, Colombo'}
                        </span>
                      </div>
                      <div className="py-2.5 flex justify-between">
                        <span className="text-gray-500">Delivery:</span>
                        <span className="font-medium text-[#15171C] capitalize">{form.deliveryMethod} Delivery</span>
                      </div>
                      <div className="py-2.5 flex justify-between">
                        <span className="text-gray-500">Selected Gateway:</span>
                        <span className="font-bold text-[#2347F5] flex items-center gap-1.5">
                          <CreditCard size={14} />
                          {selectedGateway.name}
                          {selectedGateway.mode === 'sandbox' && (
                            <span className="text-[10px] text-amber-700 font-semibold px-1.5 py-0.5 rounded bg-amber-100">
                              Sandbox
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-gray-200 text-xs text-gray-600 space-y-1">
                      <div className="font-bold text-gray-800 flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-emerald-600" />
                        Buyer Protection &amp; Security Guaranteed
                      </div>
                      <p>
                        Clicking the button below will connect with <strong>{selectedGateway.name}</strong> to finalize your transaction securely.
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between gap-3">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      disabled={isProcessing}
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
                    disabled={isProcessing}
                    className="btn-primary h-11 px-6 text-xs sm:text-sm font-bold ml-auto shadow-sm flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Connecting Gateway...</span>
                      </>
                    ) : currentStep === 5 ? (
                      <>
                        {selectedGateway.id === 'payhere' && `Pay with PayHere (${formatPrice(total)})`}
                        {selectedGateway.id === 'webxpay' && `Pay with WEBXPAY (${formatPrice(total)})`}
                        {selectedGateway.id === 'paypal' &&
                          `Pay with PayPal ($${(total / (selectedGateway.usdRate || 310)).toFixed(2)} USD)`}
                        {selectedGateway.id === 'cod' && `Confirm Order (${formatPrice(total)})`}
                        <ArrowRight size={15} />
                      </>
                    ) : (
                      <>
                        <span>Continue</span>
                        <ArrowRight size={15} />
                      </>
                    )}
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
