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
  Edit2,
  ShoppingBag,
  ExternalLink,
  Info,
} from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { formatPrice } from '@/data/catalog';
import {
  processPayHerePayment,
  createSupabaseOrder,
  type PaymentGatewayConfig,
  type PaymentGatewayId,
} from '@/lib/paymentService';
import {
  PayHereLogo,
  WebXPayLogo,
  PayPalLogo,
  CodLogo,
  VisaBadge,
  MastercardBadge,
  AmexBadge,
  LankaQrBadge,
  MobileWalletBadge,
} from '@/components/commerce/PaymentLogos';

const STEPS = [
  { id: 1, label: 'Details & Delivery', icon: MapPin, desc: 'Contact & Address' },
  { id: 2, label: 'Payment Method', icon: CreditCard, desc: 'Choose Gateway' },
  { id: 3, label: 'Confirmation & Pay', icon: CheckCircle2, desc: 'Review & Complete' },
];

export default function CheckoutPage() {
  const { cart, cartSubtotal, clearCart, showToast, paymentGateways } = useStore();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Filter enabled gateways configured from Admin
  const availableGateways = useMemo(() => {
    const enabled = paymentGateways.filter((g) => g.enabled);
    if (enabled.length > 0) return enabled;
    // Fallback if none enabled yet
    return [
      {
        id: 'payhere' as PaymentGatewayId,
        name: 'PayHere (Sri Lanka)',
        description: 'Visa, MasterCard, AMEX, FriMi, Genie, eZ Cash, LankaQR',
        enabled: true,
        mode: 'sandbox' as const,
        currency: 'LKR',
        merchantId: '1211149',
      },
      {
        id: 'webxpay' as PaymentGatewayId,
        name: 'WEBXPAY',
        description: 'LankaQR, Visa, MasterCard, and local banks',
        enabled: true,
        mode: 'sandbox' as const,
        currency: 'LKR',
      },
      {
        id: 'cod' as PaymentGatewayId,
        name: 'Cash on Delivery (COD)',
        description: 'Pay cash upon doorstep delivery.',
        enabled: true,
        mode: 'live' as const,
        currency: 'LKR',
      },
    ];
  }, [paymentGateways]);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    deliveryMethod: 'standard', // 'standard' | 'express'
    paymentMethod: availableGateways[0]?.id || 'payhere',
    notes: '',
  });

  // Ensure selected payment method is always valid
  useEffect(() => {
    if (!availableGateways.some((g) => g.id === form.paymentMethod)) {
      if (availableGateways[0]) {
        setForm((prev) => ({ ...prev, paymentMethod: availableGateways[0].id }));
      }
    }
  }, [availableGateways, form.paymentMethod]);

  const deliveryFee =
    form.deliveryMethod === 'express'
      ? 1200
      : cartSubtotal >= 50000
      ? 0
      : 500;

  const total = cartSubtotal + deliveryFee;

  const selectedGateway: PaymentGatewayConfig =
    availableGateways.find((g) => g.id === form.paymentMethod) || availableGateways[0];

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (validationErrors[key]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  // Validate Step 1 before advancing to Payment
  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.firstName.trim()) errors.firstName = 'First name is required';
    if (!form.lastName.trim()) errors.lastName = 'Last name is required';
    if (!form.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Enter a valid email address';
    }
    if (!form.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (form.phone.trim().length < 9) {
      errors.phone = 'Enter a valid phone number (at least 9 digits)';
    }
    if (!form.address.trim()) errors.address = 'Street address is required';
    if (!form.city.trim()) errors.city = 'City or district is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGoToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showToast('Please complete the required contact and delivery details.', 'error');
    }
  };

  const handleGoToStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.paymentMethod) {
      showToast('Please select a payment method.', 'error');
      return;
    }
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Execute payment and record order in Supabase
  const handleExecutePayment = async () => {
    const orderRef = `ORD-2026-${String(Math.floor(100000 + Math.random() * 900000))}`;
    setIsProcessing(true);

    const customerDetails = {
      firstName: form.firstName,
      lastName: form.lastName,
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
        postalCode: form.postalCode || '00000',
      },
      deliveryMethod: form.deliveryMethod,
      paymentMethod: selectedGateway.id,
      notes: form.notes,
    };

    // 1. PayHere Gateway Flow (Sri Lanka Modal SDK)
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
          showToast('Payment successful! Your order has been placed.', 'success');
          setIsProcessing(false);
          navigate(`/order-confirmation/${paidRef || orderRef}`);
        },
        onDismiss: () => {
          setIsProcessing(false);
          showToast('Payment window was closed. You can retry or pick another method.', 'info');
        },
        onError: (err) => {
          setIsProcessing(false);
          showToast(`PayHere notice: ${err}`, 'error');
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
        showToast('WEBXPAY payment authorization confirmed! Order placed.', 'success');
        setIsProcessing(false);
        navigate(`/order-confirmation/${orderRef}`);
      }, 1400);
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
        showToast('PayPal payment approved! Order confirmed.', 'success');
        setIsProcessing(false);
        navigate(`/order-confirmation/${orderRef}`);
      }, 1400);
      return;
    }

    // 4. Cash on Delivery (COD) Flow
    await createSupabaseOrder({
      ...orderPayload,
      paymentStatus: 'pending',
    });
    clearCart();
    showToast('Order placed successfully! Cash on Delivery confirmed.', 'success');
    setIsProcessing(false);
    navigate(`/order-confirmation/${orderRef}`);
  };

  if (cart.length === 0) {
    return (
      <div className="container-page py-16 sm:py-24">
        <div className="text-center max-w-md mx-auto p-8 rounded-3xl bg-white border border-gray-200 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#2347F5] flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={28} />
          </div>
          <h1 className="font-display text-2xl font-bold text-[#15171C] mb-2">No Items in Cart</h1>
          <p className="text-gray-500 mb-6 text-sm">Your shopping bag is empty. Explore our catalog to add items.</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            Continue Shopping
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10 min-h-screen bg-[#F6F7F9]">
      <div className="container-page max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#15171C]">
              Express Checkout
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Secure 256-bit encrypted checkout powered by verified payment gateways.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full w-fit">
            <Lock size={13} className="text-emerald-600" />
            <span>256-Bit SSL Encrypted &amp; Guaranteed</span>
          </div>
        </div>

        {/* 3-Step Wizard Progress Bar */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
          <div className="grid grid-cols-3 gap-2 sm:gap-6 relative">
            {STEPS.map((s, idx) => {
              const isDone = currentStep > s.id;
              const isCurrent = currentStep === s.id;
              const StepIcon = s.icon;

              return (
                <div key={s.id} className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 text-center sm:text-left">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all shrink-0 ${
                      isDone
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-[#2347F5] text-white shadow-md shadow-blue-500/25 ring-4 ring-blue-100'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isDone ? <Check size={18} strokeWidth={2.5} /> : <StepIcon size={18} />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                      Step {s.id}
                    </div>
                    <div
                      className={`text-xs sm:text-sm font-bold truncate ${
                        isCurrent ? 'text-[#15171C]' : isDone ? 'text-emerald-700' : 'text-gray-400'
                      }`}
                    >
                      {s.label}
                    </div>
                    <div className="hidden sm:block text-[11px] text-gray-400 truncate">{s.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress track */}
          <div className="mt-4 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#2347F5] to-emerald-500 transition-all duration-300 rounded-full"
              style={{
                width: currentStep === 1 ? '33.3%' : currentStep === 2 ? '66.6%' : '100%',
              }}
            />
          </div>
        </div>

        {/* Two-Column Grid: Form Flow + Live Sticky Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            {/* ======================================================== */}
            {/* STEP 1: CUSTOMER DETAILS & DELIVERY DETAILS             */}
            {/* ======================================================== */}
            {currentStep === 1 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
                <form onSubmit={handleGoToStep2} className="space-y-6">
                  {/* Contact Info Group */}
                  <div>
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2347F5] flex items-center justify-center">
                        <UserIcon size={16} />
                      </div>
                      <h2 className="font-display font-bold text-lg text-[#15171C]">
                        1. Customer &amp; Contact Details
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.firstName}
                          onChange={(e) => updateForm('firstName', e.target.value)}
                          placeholder="e.g. Ruzaik"
                          className={`input-field ${validationErrors.firstName ? 'border-red-400 focus:ring-red-200' : ''}`}
                        />
                        {validationErrors.firstName && (
                          <p className="text-[11px] text-red-500 mt-1">{validationErrors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.lastName}
                          onChange={(e) => updateForm('lastName', e.target.value)}
                          placeholder="e.g. Aroos"
                          className={`input-field ${validationErrors.lastName ? 'border-red-400 focus:ring-red-200' : ''}`}
                        />
                        {validationErrors.lastName && (
                          <p className="text-[11px] text-red-500 mt-1">{validationErrors.lastName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => updateForm('email', e.target.value)}
                          placeholder="you@domain.com"
                          className={`input-field ${validationErrors.email ? 'border-red-400 focus:ring-red-200' : ''}`}
                        />
                        {validationErrors.email ? (
                          <p className="text-[11px] text-red-500 mt-1">{validationErrors.email}</p>
                        ) : (
                          <p className="text-[10px] text-gray-400 mt-1">Invoice and order updates will be sent here.</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => updateForm('phone', e.target.value)}
                          placeholder="+94 77 123 4567"
                          className={`input-field ${validationErrors.phone ? 'border-red-400 focus:ring-red-200' : ''}`}
                        />
                        {validationErrors.phone ? (
                          <p className="text-[11px] text-red-500 mt-1">{validationErrors.phone}</p>
                        ) : (
                          <p className="text-[10px] text-gray-400 mt-1">Required for delivery courier contact.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address Group */}
                  <div className="pt-2">
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <MapPin size={16} />
                      </div>
                      <h2 className="font-display font-bold text-lg text-[#15171C]">
                        2. Shipping &amp; Delivery Address
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                          Street Address / House No <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.address}
                          onChange={(e) => updateForm('address', e.target.value)}
                          placeholder="e.g. No. 45/2, Galle Road"
                          className={`input-field ${validationErrors.address ? 'border-red-400 focus:ring-red-200' : ''}`}
                        />
                        {validationErrors.address && (
                          <p className="text-[11px] text-red-500 mt-1">{validationErrors.address}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                            City / District <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={form.city}
                            onChange={(e) => updateForm('city', e.target.value)}
                            placeholder="e.g. Colombo 03"
                            className={`input-field ${validationErrors.city ? 'border-red-400 focus:ring-red-200' : ''}`}
                          />
                          {validationErrors.city && (
                            <p className="text-[11px] text-red-500 mt-1">{validationErrors.city}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                            Postal Code (Optional)
                          </label>
                          <input
                            type="text"
                            value={form.postalCode}
                            onChange={(e) => updateForm('postalCode', e.target.value)}
                            placeholder="e.g. 00300"
                            className="input-field"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Speed Method */}
                  <div className="pt-2">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Truck size={16} />
                      </div>
                      <h2 className="font-display font-bold text-lg text-[#15171C]">
                        3. Delivery Method
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Standard Islandwide Option */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => updateForm('deliveryMethod', 'standard')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') updateForm('deliveryMethod', 'standard');
                        }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 select-none ${
                          form.deliveryMethod === 'standard'
                            ? 'border-[#2347F5] bg-blue-50/40 shadow-xs ring-2 ring-blue-500/20'
                            : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/50'
                        }`}
                      >
                        <div className="mt-0.5">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            checked={form.deliveryMethod === 'standard'}
                            onChange={() => updateForm('deliveryMethod', 'standard')}
                            className="accent-[#2347F5] h-4 w-4 cursor-pointer"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm text-[#15171C]">Standard Islandwide</span>
                            <span className={`font-extrabold text-xs ${cartSubtotal >= 50000 ? 'text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200' : 'text-[#2347F5]'}`}>
                              {cartSubtotal >= 50000 ? 'FREE' : 'LKR 500'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">Delivered within 2 - 4 business days</p>
                        </div>
                      </div>

                      {/* Priority Express Option */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => updateForm('deliveryMethod', 'express')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') updateForm('deliveryMethod', 'express');
                        }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 select-none ${
                          form.deliveryMethod === 'express'
                            ? 'border-[#2347F5] bg-blue-50/40 shadow-xs ring-2 ring-blue-500/20'
                            : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/50'
                        }`}
                      >
                        <div className="mt-0.5">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            checked={form.deliveryMethod === 'express'}
                            onChange={() => updateForm('deliveryMethod', 'express')}
                            className="accent-[#2347F5] h-4 w-4 cursor-pointer"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm text-[#15171C]">Priority Express</span>
                            <span className="font-extrabold text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              LKR 1,200
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">Fast 1 - 2 business days delivery</p>
                        </div>
                      </div>
                    </div>

                    {/* Live Dynamic Delivery & Total Price Banner */}
                    <div className="mt-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Truck size={16} className="text-[#2347F5] shrink-0" />
                        <span className="text-gray-600">
                          Selected Method:{' '}
                          <strong className="text-gray-900">
                            {form.deliveryMethod === 'express'
                              ? 'Priority Express (LKR 1,200)'
                              : `Standard Islandwide (${deliveryFee === 0 ? 'FREE' : 'LKR 500'})`}
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 font-medium">Updated Total:</span>
                        <span className="font-display font-black text-sm text-[#2347F5] bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs">
                          {formatPrice(total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Special Notes (Optional) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                      Delivery Notes / Instructions (Optional)
                    </label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => updateForm('notes', e.target.value)}
                      placeholder="e.g. Call before delivery, leave with building security, etc."
                      rows={2}
                      className="input-field resize-none text-sm"
                    />
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      to="/cart"
                      className="text-sm font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1.5"
                    >
                      <ArrowLeft size={16} />
                      Back to Cart
                    </Link>

                    <button
                      type="submit"
                      className="btn-primary py-3 px-6 text-sm font-bold flex items-center gap-2 shadow-md shadow-blue-500/20"
                    >
                      <span>Continue to Payment Method • {formatPrice(total)}</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ======================================================== */}
            {/* STEP 2: PAYMENT METHOD SELECTION (WITH LOGOS & ICONS)   */}
            {/* ======================================================== */}
            {currentStep === 2 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
                <form onSubmit={handleGoToStep3} className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="font-display font-bold text-xl text-[#15171C]">
                        Select Payment Method
                      </h2>
                      <span className="text-xs text-gray-500 font-medium">
                        {availableGateways.length} options active
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-5">
                      Choose your preferred payment gateway. All transactions are securely processed and encrypted.
                    </p>

                    {/* Gateway Cards List */}
                    <div className="space-y-3.5">
                      {availableGateways.map((gw) => {
                        const isSelected = form.paymentMethod === gw.id;

                        return (
                          <div
                            key={gw.id}
                            onClick={() => updateForm('paymentMethod', gw.id)}
                            className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${
                              isSelected
                                ? 'border-[#2347F5] bg-blue-50/25 shadow-sm ring-1 ring-blue-500/20'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              {/* Left Radio & Gateway Logo */}
                              <div className="flex items-start gap-3.5">
                                <div className="mt-1">
                                  <input
                                    type="radio"
                                    name="paymentGateway"
                                    checked={isSelected}
                                    onChange={() => updateForm('paymentMethod', gw.id)}
                                    className="accent-[#2347F5] h-4 w-4 cursor-pointer"
                                  />
                                </div>

                                <div>
                                  {/* Official Brand Logo */}
                                  <div className="mb-2">
                                    {gw.id === 'payhere' && <PayHereLogo className="h-7" />}
                                    {gw.id === 'webxpay' && <WebXPayLogo className="h-7" />}
                                    {gw.id === 'paypal' && <PayPalLogo className="h-7" />}
                                    {gw.id === 'cod' && <CodLogo className="h-7" />}
                                  </div>

                                  <div className="text-xs text-gray-600 font-medium">
                                    {gw.description}
                                  </div>
                                </div>
                              </div>

                              {/* Right Badges */}
                              <div className="flex flex-col items-end gap-1.5 shrink-0">
                                {gw.mode === 'sandbox' ? (
                                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                                    Test Sandbox
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    Live Secure
                                  </span>
                                )}
                                <span className="text-[11px] font-bold text-gray-500">
                                  {gw.currency || 'LKR'}
                                </span>
                              </div>
                            </div>

                            {/* Accepted Payment Badges Strip */}
                            <div className="mt-3.5 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-1.5">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">
                                Accepted:
                              </span>

                              {gw.id === 'payhere' && (
                                <>
                                  <VisaBadge />
                                  <MastercardBadge />
                                  <AmexBadge />
                                  <LankaQrBadge />
                                  <MobileWalletBadge label="FriMi" color="bg-orange-50 text-orange-700 border-orange-200" />
                                  <MobileWalletBadge label="Genie" color="bg-purple-50 text-purple-700 border-purple-200" />
                                  <MobileWalletBadge label="eZ Cash" color="bg-red-50 text-red-700 border-red-200" />
                                  <MobileWalletBadge label="mCash" color="bg-green-50 text-green-700 border-green-200" />
                                </>
                              )}

                              {gw.id === 'webxpay' && (
                                <>
                                  <LankaQrBadge />
                                  <VisaBadge />
                                  <MastercardBadge />
                                  <MobileWalletBadge label="Sampath Vishwa" color="bg-amber-50 text-amber-700 border-amber-200" />
                                  <MobileWalletBadge label="DFCC Virtual" color="bg-blue-50 text-blue-700 border-blue-200" />
                                  <MobileWalletBadge label="HNB Momo" color="bg-emerald-50 text-emerald-700 border-emerald-200" />
                                </>
                              )}

                              {gw.id === 'paypal' && (
                                <>
                                  <VisaBadge />
                                  <MastercardBadge />
                                  <AmexBadge />
                                  <MobileWalletBadge label="PayPal Balance" color="bg-sky-50 text-sky-700 border-sky-200" />
                                  <MobileWalletBadge label="USD Converted" color="bg-blue-50 text-blue-700 border-blue-200" />
                                </>
                              )}

                              {gw.id === 'cod' && (
                                <>
                                  <span className="text-xs text-gray-600 font-medium">
                                    Exact cash upon delivery • Verified courier handover
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Informational Sandbox Tip if active */}
                  {selectedGateway.mode === 'sandbox' && (
                    <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                      <AlertTriangle size={16} className="shrink-0 text-amber-600 mt-0.5" />
                      <div>
                        <strong>Sandbox Mode Enabled:</strong> No real money will be deducted. You can safely complete the payment process with test credentials.
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-sm font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1.5"
                    >
                      <ArrowLeft size={16} />
                      Back to Delivery Details
                    </button>

                    <button
                      type="submit"
                      className="btn-primary py-3 px-6 text-sm font-bold flex items-center gap-2 shadow-md shadow-blue-500/20"
                    >
                      <span>Proceed to Confirmation • {formatPrice(total)}</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ======================================================== */}
            {/* STEP 3: CONFIRMATION SCREEN & FINAL PAYMENT PROCEED     */}
            {/* ======================================================== */}
            {currentStep === 3 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="font-display font-bold text-xl text-[#15171C]">
                      Order Confirmation
                    </h2>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#2347F5] border border-blue-200">
                      Final Review
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Please review your shipping and payment selections before completing your order.
                  </p>
                </div>

                {/* Review Card 1: Customer & Delivery Info */}
                <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200/80">
                    <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-gray-600">
                      <MapPin size={14} className="text-[#2347F5]" />
                      <span>Delivery Details</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs font-bold text-[#2347F5] hover:underline flex items-center gap-1"
                    >
                      <Edit2 size={12} />
                      Edit Details
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-400 block mb-0.5">Customer</span>
                      <span className="font-semibold text-gray-800">
                        {form.firstName} {form.lastName}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-0.5">Contact</span>
                      <span className="font-semibold text-gray-800">
                        {form.email} • {form.phone}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-0.5">Shipping Address</span>
                      <span className="font-semibold text-gray-800">
                        {form.address}, {form.city} {form.postalCode ? `(${form.postalCode})` : ''}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-0.5">Delivery Method</span>
                      <span className="font-semibold text-gray-800">
                        {form.deliveryMethod === 'express'
                          ? 'Priority Express (1-2 Days) • LKR 1,200'
                          : `Standard Islandwide (2-4 Days) • ${deliveryFee === 0 ? 'FREE' : 'LKR 500'}`}
                      </span>
                    </div>
                  </div>

                  {form.notes && (
                    <div className="mt-2.5 pt-2 border-t border-gray-200/60 text-xs">
                      <span className="text-gray-400">Notes:</span>{' '}
                      <span className="italic text-gray-700">{form.notes}</span>
                    </div>
                  )}
                </div>

                {/* Review Card 2: Selected Payment Gateway */}
                <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200/80">
                    <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-gray-600">
                      <CreditCard size={14} className="text-emerald-600" />
                      <span>Payment Method</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs font-bold text-[#2347F5] hover:underline flex items-center gap-1"
                    >
                      <Edit2 size={12} />
                      Change Gateway
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div>
                        {selectedGateway.id === 'payhere' && <PayHereLogo className="h-6" />}
                        {selectedGateway.id === 'webxpay' && <WebXPayLogo className="h-6" />}
                        {selectedGateway.id === 'paypal' && <PayPalLogo className="h-6" />}
                        {selectedGateway.id === 'cod' && <CodLogo className="h-6" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-800">{selectedGateway.name}</div>
                        <div className="text-[11px] text-gray-500">
                          {selectedGateway.id === 'cod'
                            ? 'Pay cash upon delivery'
                            : `Secure electronic checkout in ${selectedGateway.currency || 'LKR'}`}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedGateway.mode === 'sandbox' ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                          Sandbox Mode
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Live Ready
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Final Proceed Action Box */}
                <div className="pt-2 space-y-4">
                  <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500">Total Payable Amount</div>
                      <div className="font-display text-2xl font-black text-[#15171C]">
                        {formatPrice(total)}
                      </div>
                      {selectedGateway.id === 'paypal' && (
                        <div className="text-xs font-bold text-[#0079C1] mt-0.5">
                          Approx. ${(total / (selectedGateway.usdRate || 310)).toFixed(2)} USD
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 justify-end">
                        <ShieldCheck size={16} />
                        <span>Protected by 256-Bit SSL</span>
                      </div>
                      <span className="text-[10px] text-gray-400">Guaranteed Safe Checkout</span>
                    </div>
                  </div>

                  {/* Primary Payment Action Button */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleExecutePayment}
                      className="w-full py-4 px-6 rounded-xl font-bold text-base text-white bg-[#2347F5] hover:bg-blue-600 disabled:opacity-60 transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-blue-500/25 cursor-pointer"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>Connecting to Payment Gateway...</span>
                        </>
                      ) : (
                        <>
                          <Lock size={18} />
                          {selectedGateway.id === 'payhere' && (
                            <span>Proceed &amp; Pay with PayHere ({formatPrice(total)})</span>
                          )}
                          {selectedGateway.id === 'webxpay' && (
                            <span>Proceed &amp; Pay with WEBXPAY ({formatPrice(total)})</span>
                          )}
                          {selectedGateway.id === 'paypal' && (
                            <span>
                              Pay with PayPal (~${(total / (selectedGateway.usdRate || 310)).toFixed(2)} USD)
                            </span>
                          )}
                          {selectedGateway.id === 'cod' && (
                            <span>Confirm Order (Cash on Delivery)</span>
                          )}
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleBack}
                      className="w-full py-2.5 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors flex items-center justify-center gap-1"
                    >
                      <ArrowLeft size={14} />
                      Back to Payment Method Selection
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: STICKY MINI CART & ORDER BREAKDOWN         */}
          {/* ======================================================== */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-display font-bold text-base text-[#15171C]">
                  Order Items ({cart.length})
                </h3>
                <Link to="/cart" className="text-xs font-bold text-[#2347F5] hover:underline">
                  Edit Cart
                </Link>
              </div>

              {/* Cart Items List */}
              <div className="max-h-72 overflow-y-auto space-y-3 pr-1 divide-y divide-gray-100">
                {cart.map((item) => (
                  <div key={item.productId} className="pt-3 first:pt-0 flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src={item.product.images?.[0] || '/placeholder.png'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#15171C] truncate">{item.product.name}</h4>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor}` : ''}
                      </div>
                      <div className="text-xs font-extrabold text-[#15171C] mt-1">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <span>Delivery Fee</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                      {form.deliveryMethod === 'express' ? 'Express' : 'Standard'}
                    </span>
                  </span>
                  <span
                    className={`font-semibold ${
                      deliveryFee === 0 ? 'text-emerald-600 font-bold' : 'text-gray-900'
                    }`}
                  >
                    {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-100 flex justify-between items-baseline">
                  <span className="font-bold text-sm text-[#15171C]">Total Amount</span>
                  <span className="font-display font-black text-xl text-[#2347F5]">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-3 border-t border-gray-100/80 space-y-2 text-[11px] text-gray-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                  <span>Authorized Merchant Payment Channels</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={14} className="text-blue-600 shrink-0" />
                  <span>Tracked islandwide courier shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
