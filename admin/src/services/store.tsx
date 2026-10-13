import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Category, Order, Customer, StoreSettings, OrderStatus, PaymentStatus, PaymentGatewayConfig } from '../types';
import { initialProducts, initialCategories, initialOrders, initialCustomers, initialSettings, initialPaymentGateways } from './mockData';
import {
  fetchSupabaseProducts,
  fetchSupabaseCategories,
  upsertSupabaseProduct,
  deleteSupabaseProduct,
  upsertSupabaseCategory,
  deleteSupabaseCategory,
  fetchPaymentGateways,
  upsertPaymentGateway,
} from './supabase';

interface AdminContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  settings: StoreSettings;
  paymentGateways: PaymentGatewayConfig[];
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  // Category actions
  addCategory: (category: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  // Payment Gateway actions
  updatePaymentGateway: (id: string, updates: Partial<PaymentGatewayConfig>) => void;
  // Order actions
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;
  updateOrderPayment: (orderId: string, paymentStatus: PaymentStatus) => void;
  deleteOrder: (orderId: string) => void;
  // Settings actions
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  // Data management
  resetToDefaultData: () => void;
  exportDatabaseJSON: () => string;
  importDatabaseJSON: (jsonString: string) => boolean;
  // Metrics & helpers
  totalRevenue: number;
  ordersCount: number;
  lowStockCount: number;
  activeProductsCount: number;
  formatCurrency: (amount: number) => string;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'eev_admin_products_v1',
  CATEGORIES: 'eev_admin_categories_v1',
  ORDERS: 'eev_admin_orders_v1',
  CUSTOMERS: 'eev_admin_customers_v1',
  SETTINGS: 'eev_admin_settings_v1',
  GATEWAYS: 'eev_admin_gateways_v1',
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : initialCategories;
    } catch {
      return initialCategories;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : initialOrders;
    } catch {
      return initialOrders;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return saved ? JSON.parse(saved) : initialCustomers;
    } catch {
      return initialCustomers;
    }
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : initialSettings;
    } catch {
      return initialSettings;
    }
  });

  const [paymentGateways, setPaymentGateways] = useState<PaymentGatewayConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GATEWAYS);
      return saved ? JSON.parse(saved) : initialPaymentGateways;
    } catch {
      return initialPaymentGateways;
    }
  });

  // Initial load from Supabase if connected
  useEffect(() => {
    let isMounted = true;
    async function loadFromSupabase() {
      try {
        const [liveProds, liveCats, liveGateways] = await Promise.all([
          fetchSupabaseProducts(),
          fetchSupabaseCategories(),
          fetchPaymentGateways(),
        ]);
        if (!isMounted) return;
        if (liveProds && liveProds.length > 0) {
          setProducts(liveProds);
        }
        if (liveCats && liveCats.length > 0) {
          setCategories(liveCats);
        }
        if (liveGateways && liveGateways.length > 0) {
          setPaymentGateways(liveGateways);
        }
      } catch (err) {
        console.warn('Could not auto-fetch from Supabase:', err);
      }
    }
    loadFromSupabase();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GATEWAYS, JSON.stringify(paymentGateways));
  }, [paymentGateways]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Format currency
  const formatCurrency = useCallback(
    (amount: number) => {
      return `${settings.currencySymbol || 'LKR '}${amount.toLocaleString('en-US')}`;
    },
    [settings.currencySymbol]
  );

  // Product Actions
  const addProduct = useCallback((productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: `p-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    // Persist to Supabase
    upsertSupabaseProduct(newProduct);
    return newProduct;
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) => {
      const next = prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates, updatedAt: new Date().toISOString() };
          // Persist to Supabase
          upsertSupabaseProduct(updated);
          return updated;
        }
        return p;
      });
      return next;
    });
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // Persist to Supabase
    deleteSupabaseProduct(id);
  }, []);

  // Category Actions
  const addCategory = useCallback((categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: `cat-${categoryData.slug || Date.now().toString().slice(-4)}`,
    };
    setCategories((prev) => [...prev, newCategory]);
    // Persist to Supabase
    upsertSupabaseCategory(newCategory);
    return newCategory;
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    setCategories((prev) => {
      const next = prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, ...updates };
          // Persist to Supabase
          upsertSupabaseCategory(updated);
          return updated;
        }
        return c;
      });
      return next;
    });
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    // Persist to Supabase
    deleteSupabaseCategory(id);
  }, []);

  // Payment Gateway Actions
  const updatePaymentGateway = useCallback((id: string, updates: Partial<PaymentGatewayConfig>) => {
    setPaymentGateways((prev) => {
      const next = prev.map((g) => {
        if (g.id === id) {
          const updated = { ...g, ...updates, updatedAt: new Date().toISOString() };
          // Persist to Supabase
          upsertPaymentGateway(updated);
          return updated;
        }
        return g;
      });
      return next;
    });
  }, []);

  // Order Actions
  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus, trackingNumber?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              ...(trackingNumber ? { trackingNumber } : {}),
              updatedAt: new Date().toISOString(),
            }
          : o
      )
    );
  }, []);

  const updateOrderPayment = useCallback((orderId: string, paymentStatus: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              paymentStatus,
              updatedAt: new Date().toISOString(),
            }
          : o
      )
    );
  }, []);

  const deleteOrder = useCallback((orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  }, []);

  // Settings Actions
  const updateSettings = useCallback((newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // Data helpers
  const resetToDefaultData = useCallback(() => {
    setProducts(initialProducts);
    setCategories(initialCategories);
    setOrders(initialOrders);
    setCustomers(initialCustomers);
    setSettings(initialSettings);
  }, []);

  const exportDatabaseJSON = useCallback(() => {
    return JSON.stringify(
      {
        products,
        categories,
        orders,
        customers,
        settings,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  }, [products, categories, orders, customers, settings]);

  const importDatabaseJSON = useCallback((jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.products && Array.isArray(data.products)) setProducts(data.products);
      if (data.categories && Array.isArray(data.categories)) setCategories(data.categories);
      if (data.orders && Array.isArray(data.orders)) setOrders(data.orders);
      if (data.customers && Array.isArray(data.customers)) setCustomers(data.customers);
      if (data.settings) setSettings((prev) => ({ ...prev, ...data.settings }));
      return true;
    } catch {
      return false;
    }
  }, []);

  // Calculations
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'paid' && o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const ordersCount = orders.length;
  const lowStockCount = products.filter((p) => p.stock <= (settings.lowStockThreshold || 5)).length;
  const activeProductsCount = products.length;

  return (
    <AdminContext.Provider
      value={{
        products,
        categories,
        orders,
        customers,
        settings,
        paymentGateways,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        updatePaymentGateway,
        updateOrderStatus,
        updateOrderPayment,
        deleteOrder,
        updateSettings,
        resetToDefaultData,
        exportDatabaseJSON,
        importDatabaseJSON,
        totalRevenue,
        ordersCount,
        lowStockCount,
        activeProductsCount,
        formatCurrency,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminStore = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminStore must be used within an AdminProvider');
  }
  return context;
};
