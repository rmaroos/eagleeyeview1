import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import AnnouncementBar from './AnnouncementBar';
import Header from './Header';
import Footer from './Footer';
import ToastContainer from '@/components/ui/ToastContainer';

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isCheckout = location.pathname === '/checkout';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {!isCheckout && <AnnouncementBar />}
      {!isCheckout ? <Header /> : <CheckoutHeader />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isCheckout && <Footer />}
      <ToastContainer />
    </div>
  );
}

function CheckoutHeader() {
  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="container-page h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg">
            N
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">NEXUS</span>
        </a>
        <div className="text-sm text-gray-500">Secure Checkout</div>
      </div>
    </header>
  );
}
