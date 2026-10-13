import { supabase } from './supabase';

export type PaymentGatewayId = 'payhere' | 'webxpay' | 'paypal' | 'cod';

export interface PaymentGatewayConfig {
  id: PaymentGatewayId;
  name: string;
  description: string;
  enabled: boolean;
  mode: 'sandbox' | 'live';
  merchantId?: string;
  secretKey?: string;
  publicKey?: string;
  clientId?: string;
  currency: string;
  instructions?: string;
  usdRate?: number;
  updatedAt?: string;
}

export const defaultGateways: PaymentGatewayConfig[] = [
  {
    id: 'payhere',
    name: 'PayHere (Sri Lanka)',
    description: 'Pay securely using Visa, MasterCard, AMEX, FriMi, Genie, eZ Cash, mCash, or LankaQR.',
    enabled: true,
    mode: 'sandbox',
    merchantId: '1211149',
    currency: 'LKR',
  },
  {
    id: 'webxpay',
    name: 'WEBXPAY',
    description: 'Pay via LankaQR, Sampath Vishwa, Visa, MasterCard, and local mobile wallets.',
    enabled: true,
    mode: 'sandbox',
    currency: 'LKR',
  },
  {
    id: 'paypal',
    name: 'PayPal Global',
    description: 'Pay with your PayPal balance or international credit and debit cards in USD.',
    enabled: false,
    mode: 'sandbox',
    clientId: 'sb',
    currency: 'USD',
    usdRate: 310,
  },
  {
    id: 'cod',
    name: 'Cash on Delivery (COD)',
    description: 'Pay with physical cash upon receiving your delivery at your doorstep.',
    enabled: true,
    mode: 'live',
    currency: 'LKR',
    instructions: 'Pay cash upon delivery. Please ensure exact payment is ready when the courier arrives.',
  },
];

// Fetch active payment gateways from Supabase (or fallback to defaults)
export async function fetchActivePaymentGateways(): Promise<PaymentGatewayConfig[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('payment_gateways').select('*');
      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          name: row.name,
          description: row.description || '',
          enabled: Boolean(row.enabled),
          mode: row.mode || 'sandbox',
          merchantId: row.merchant_id || undefined,
          publicKey: row.public_key || undefined,
          secretKey: row.secret_key || undefined,
          clientId: row.client_id || undefined,
          currency: row.currency || 'LKR',
          instructions: row.instructions || undefined,
          usdRate: row.usd_rate ? Number(row.usd_rate) : 310,
          updatedAt: row.updated_at,
        }));
      }
    } catch {
      // Ignore and use defaults
    }
  }

  // Fallback to localStorage if configured via admin locally
  try {
    const saved = localStorage.getItem('eev_admin_gateways_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Ignore
  }

  return defaultGateways;
}

// Record order into Supabase
export async function createSupabaseOrder(orderData: {
  orderRef: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: any[];
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingAddress: any;
  deliveryMethod: string;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  notes?: string;
}): Promise<boolean> {
  if (!supabase) return false;
  try {
    const row = {
      id: orderData.orderRef,
      customer_name: orderData.customerName,
      customer_email: orderData.customerEmail,
      customer_phone: orderData.customerPhone,
      items: orderData.items,
      subtotal: orderData.subtotal,
      shipping_fee: orderData.shippingFee,
      total: orderData.total,
      shipping_address: orderData.shippingAddress,
      delivery_method: orderData.deliveryMethod,
      payment_method: orderData.paymentMethod,
      payment_status: orderData.paymentStatus,
      status: 'pending',
      tracking_number: `TRK-${Date.now().toString().slice(-6)}`,
      notes: orderData.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('orders').insert([row]);
    if (error) {
      console.warn('Could not record order in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error saving order to Supabase:', err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// 1. PayHere Integration
// ---------------------------------------------------------------------------
declare global {
  interface Window {
    payhere?: any;
    paypal?: any;
  }
}

export function loadPayHereScript(mode: 'sandbox' | 'live'): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.payhere) {
      resolve(true);
      return;
    }

    const scriptUrl =
      mode === 'sandbox'
        ? 'https://sandbox.payhere.lk/lib/payhere.js'
        : 'https://www.payhere.lk/lib/payhere.js';

    const existing = document.querySelector(`script[src="${scriptUrl}"]`);
    if (existing) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = scriptUrl;
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Failed to load PayHere script from CDN');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export async function processPayHerePayment({
  gateway,
  orderRef,
  amount,
  items,
  customer,
  onSuccess,
  onDismiss,
  onError,
}: {
  gateway: PaymentGatewayConfig;
  orderRef: string;
  amount: number;
  items: any[];
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  onSuccess: (orderId: string) => void;
  onDismiss: () => void;
  onError: (err: string) => void;
}) {
  const loaded = await loadPayHereScript(gateway.mode);

  if (!loaded || !window.payhere) {
    onError('Could not load PayHere Payment Gateway. Please check your internet connection.');
    return;
  }

  window.payhere.onCompleted = function onCompleted(orderId: string) {
    onSuccess(orderId || orderRef);
  };

  window.payhere.onDismissed = function onDismissed() {
    onDismiss();
  };

  window.payhere.onError = function onPayHereError(error: any) {
    onError(typeof error === 'string' ? error : 'Payment process encountered an error.');
  };

  const payment = {
    sandbox: gateway.mode === 'sandbox',
    merchant_id: gateway.merchantId || '1211149',
    return_url: `${window.location.origin}/order-confirmation/${orderRef}`,
    cancel_url: window.location.href,
    notify_url: `${window.location.origin}/api/payhere-notify`,
    order_id: orderRef,
    items: items.map((i) => i.product.name).join(', ').slice(0, 200),
    amount: amount.toFixed(2),
    currency: gateway.currency || 'LKR',
    first_name: customer.firstName,
    last_name: customer.lastName,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    city: customer.city,
    country: 'Sri Lanka',
  };

  try {
    window.payhere.startPayment(payment);
  } catch (err: any) {
    onError(err?.message || 'Failed to start PayHere payment.');
  }
}

// ---------------------------------------------------------------------------
// 2. PayPal Integration
// ---------------------------------------------------------------------------
export function loadPayPalScript(clientId: string, currency: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.paypal) {
      resolve(true);
      return;
    }

    const scriptUrl = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
      clientId || 'sb'
    )}&currency=${encodeURIComponent(currency || 'USD')}`;

    const existing = document.querySelector(`script[src*="paypal.com/sdk/js"]`);
    if (existing) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
