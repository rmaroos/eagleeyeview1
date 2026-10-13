import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  products as initialProducts,
  categories as initialCategories,
  syncCatalog,
  type Product,
  type Category,
  type Department,
} from '@/data/catalog';
import {
  fetchProductsFromSupabase,
  fetchCategoriesFromSupabase,
  subscribeToCatalogChanges,
} from '@/lib/catalogService';
import {
  fetchActivePaymentGateways,
  defaultGateways,
  type PaymentGatewayConfig,
} from '@/lib/paymentService';

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  price: number;
}

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface StoreContextType {
  cart: CartItem[];
  wishlist: string[];
  toasts: Toast[];
  products: Product[];
  categories: Category[];
  paymentGateways: PaymentGatewayConfig[];
  isLoadingCatalog: boolean;
  refreshCatalog: () => Promise<void>;
  addToCart: (product: Product, quantity?: number, selectedColor?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  showToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: number) => void;
  // Helpers dynamically computed from current live products
  getProductsByDepartment: (dept: Department) => Product[];
  getProductsByCategory: (categorySlug: string) => Product[];
  getProductBySlug: (slug: string) => Product | undefined;
  getCategoriesByDepartment: (dept: Department) => Category[];
  getBestSellers: (dept: Department) => Product[];
  getNewArrivals: (dept?: Department) => Product[];
  getFeaturedProducts: (dept: Department) => Product[];
  getRelatedProducts: (product: Product, count?: number) => Product[];
  searchProducts: (query: string) => { electronics: Product[]; fashion: Product[] };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [paymentGateways, setPaymentGateways] = useState<PaymentGatewayConfig[]>(defaultGateways);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Refresh products & categories from Supabase
  const refreshCatalog = useCallback(async () => {
    try {
      setIsLoadingCatalog(true);
      const [liveProds, liveCats, liveGateways] = await Promise.all([
        fetchProductsFromSupabase(),
        fetchCategoriesFromSupabase(),
        fetchActivePaymentGateways(),
      ]);
      if (liveProds && liveProds.length > 0) {
        setProducts(liveProds);
      }
      if (liveCats && liveCats.length > 0) {
        setCategories(liveCats);
      }
      if (liveGateways && liveGateways.length > 0) {
        setPaymentGateways(liveGateways);
      }
      syncCatalog(liveProds, liveCats);
    } catch (err) {
      console.warn('Failed to load live catalog:', err);
    } finally {
      setIsLoadingCatalog(false);
    }
  }, []);

  useEffect(() => {
    refreshCatalog();
    const unsubscribe = subscribeToCatalogChanges(() => {
      refreshCatalog();
    });
    return () => {
      unsubscribe();
    };
  }, [refreshCatalog]);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) setCart(JSON.parse(savedCart));
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch {
      // localStorage may be unavailable
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToCart = useCallback(
    (product: Product, quantity = 1, selectedColor?: string) => {
      setCart((prev) => {
        const existing = prev.find((item) => item.productId === product.id);
        if (existing) {
          return prev.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { productId: product.id, product, quantity, selectedColor, price: product.price }];
      });
      showToast(`Added to cart: ${product.name}`, 'success');
    },
    [showToast]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prev) => prev.filter((item) => item.productId !== productId));
      showToast('Item removed from cart', 'info');
    },
    [showToast]
  );

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => {
        if (prev.includes(productId)) {
          showToast('Removed from wishlist', 'info');
          return prev.filter((id) => id !== productId);
        }
        showToast('Added to wishlist', 'success');
        return [...prev, productId];
      });
    },
    [showToast]
  );

  const isInWishlist = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const addToWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => {
        if (prev.includes(productId)) return prev;
        showToast('Added to wishlist', 'success');
        return [...prev, productId];
      });
    },
    [showToast]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      showToast('Removed from wishlist', 'info');
    },
    [showToast]
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Dynamic catalog helpers
  const getProductsByDepartment = useCallback(
    (dept: Department): Product[] => products.filter((p) => p.department === dept),
    [products]
  );

  const getProductsByCategory = useCallback(
    (categorySlug: string): Product[] => products.filter((p) => p.category === categorySlug),
    [products]
  );

  const getProductBySlug = useCallback(
    (slug: string): Product | undefined => products.find((p) => p.slug === slug),
    [products]
  );

  const getCategoriesByDepartment = useCallback(
    (dept: Department): Category[] => categories.filter((c) => c.department === dept),
    [categories]
  );

  const getBestSellers = useCallback(
    (dept: Department): Product[] => products.filter((p) => p.department === dept && p.isBestSeller),
    [products]
  );

  const getNewArrivals = useCallback(
    (dept?: Department): Product[] =>
      products.filter((p) => (dept ? p.department === dept : true) && p.isNew),
    [products]
  );

  const getFeaturedProducts = useCallback(
    (dept: Department): Product[] => products.filter((p) => p.department === dept && p.isFeatured),
    [products]
  );

  const getRelatedProducts = useCallback(
    (product: Product, count = 4): Product[] =>
      products
        .filter((p) => p.department === product.department && p.category === product.category && p.id !== product.id)
        .slice(0, count),
    [products]
  );

  const searchProducts = useCallback(
    (query: string): { electronics: Product[]; fashion: Product[] } => {
      const q = query.toLowerCase().trim();
      if (!q) return { electronics: [], fashion: [] };
      const matches = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
      return {
        electronics: matches.filter((p) => p.department === 'electronics'),
        fashion: matches.filter((p) => p.department === 'fashion'),
      };
    },
    [products]
  );

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        toasts,
        products,
        categories,
        paymentGateways,
        isLoadingCatalog,
        refreshCatalog,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        toggleWishlist,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        showToast,
        dismissToast,
        getProductsByDepartment,
        getProductsByCategory,
        getProductBySlug,
        getCategoriesByDepartment,
        getBestSellers,
        getNewArrivals,
        getFeaturedProducts,
        getRelatedProducts,
        searchProducts,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
