import { Outlet, useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Lock } from 'lucide-react';
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
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="container-page h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group" aria-label="Eagle Eye View home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#15171C] text-white text-base font-extrabold shadow-sm transition-transform duration-200 group-hover:scale-105">
            E
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight text-[#15171C]">
            Eagle Eye View
          </span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
          <Lock size={13} />
          <span>Encrypted Checkout</span>
        </div>
      </div>
    </header>
  );
}
