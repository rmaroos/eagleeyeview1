export type Department = 'electronics' | 'fashion';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  department: Department;
  category: string;
  subcategory?: string;
  brand: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  badges: string[];
  stock: number;
  isBestSeller?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  // Electronics
  specs?: ProductSpec[];
  keySpec?: string;
  // Fashion
  colors?: ProductColor[];
  material?: string;
  bagType?: string;
  closure?: string;
  dimensions?: string;
  careInstructions?: string;
  whatsIncluded?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  slug: string;
  department: Department;
  name: string;
  image: string;
  description?: string;
  subcategories?: { name: string; slug: string }[];
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'refunded' | 'failed';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  selectedColor?: string;
  department: Department;
}

export interface CustomerAddress {
  address: string;
  city: string;
  postalCode: string;
}

export interface Order {
  id: string; // e.g. ORD-2026-894123
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingAddress: CustomerAddress;
  deliveryMethod: 'standard' | 'express';
  paymentMethod: 'card' | 'cod' | 'bank_transfer';
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  firstOrderDate: string;
  lastOrderDate: string;
  city: string;
  tier: 'VIP' | 'Regular' | 'New';
}

export interface StoreSettings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  currencyCode: string; // e.g. 'LKR'
  currencySymbol: string; // 'LKR '
  freeShippingThreshold: number;
  standardShippingFee: number;
  taxRatePercent: number;
  supabaseUrl: string;
  supabaseAnonKey: string;
  useLiveSupabase: boolean;
  lowStockThreshold: number;
}
