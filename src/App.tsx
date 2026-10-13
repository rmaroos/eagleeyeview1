import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from '@/store/StoreContext';
import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';
import ListingPage from '@/pages/ListingPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import SearchPage from '@/pages/SearchPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderConfirmationPage from '@/pages/OrderConfirmationPage';
import WishlistPage from '@/pages/WishlistPage';
import AccountPage from '@/pages/AccountPage';
import AuthPage from '@/pages/AuthPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import FAQPage from '@/pages/FAQPage';
import ShippingPage from '@/pages/ShippingPage';
import ReturnsPage from '@/pages/ReturnsPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import NotFoundPage from '@/pages/NotFoundPage';
import CollectionPage from '@/pages/CollectionPage';

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* Homepage */}
            <Route path="/" element={<HomePage />} />

            {/* Electronics */}
            <Route path="/electronics" element={<ListingPage />} />
            <Route path="/electronics/:categorySlug" element={<ListingPage />} />
            <Route path="/electronics/product/:slug" element={<ProductDetailPage />} />

            {/* Fashion */}
            <Route path="/fashion" element={<ListingPage />} />
            <Route path="/fashion/:categorySlug" element={<ListingPage />} />
            <Route path="/fashion/product/:slug" element={<ProductDetailPage />} />

            {/* Collections */}
            <Route path="/new-arrivals" element={<CollectionPage type="new-arrivals" />} />
            <Route path="/best-sellers" element={<CollectionPage type="best-sellers" />} />
            <Route path="/deals" element={<CollectionPage type="deals" />} />

            {/* Search */}
            <Route path="/search" element={<SearchPage />} />

            {/* Shopping */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderRef" element={<OrderConfirmationPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />

            {/* Account & Auth */}
            <Route path="/account" element={<AccountPage />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/register" element={<AuthPage mode="register" />} />
            <Route path="/forgot-password" element={<AuthPage mode="forgot" />} />

            {/* Content */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/returns" element={<ReturnsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
