import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { getCategoriesByDepartment, searchProducts, type Product } from '@/data/catalog';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Electronics', href: '/electronics' },
  { label: 'Fashion', href: '/fashion' },
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'Best Sellers', href: '/best-sellers' },
  { label: 'Deals', href: '/deals' },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, wishlist } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ electronics: Product[]; fashion: Product[] }>({ electronics: [], fashion: [] });
  const [searchFocused, setSearchFocused] = useState(false);
  const [openMegaMenu, setOpenMegaMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenMegaMenu(null);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchResults(searchProducts(searchQuery));
    } else {
      setSearchResults({ electronics: [], fashion: [] });
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchFocused(false);
      setSearchQuery('');
    }
  };

  const electronicsCategories = getCategoriesByDepartment('electronics');
  const fashionCategories = getCategoriesByDepartment('fashion');
  const totalSearchResults = searchResults.electronics.length + searchResults.fashion.length;

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          scrolled ? 'shadow-[0_4px_24px_rgba(0,0,0,0.06)] border-b border-gray-100' : 'border-b border-gray-50'
        }`}
      >
        <div className="container-page">
          <div className="flex items-center justify-between h-16 lg:h-[76px] gap-4">
            {/* Mobile menu */}
            <button
              className="lg:hidden text-gray-700 p-1.5 -ml-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-600/20 transition-transform group-hover:scale-105">
                N
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 hidden sm:inline">NEXUS</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const isMegaMenuLink = link.label === 'Electronics' || link.label === 'Fashion';
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => isMegaMenuLink && setOpenMegaMenu(link.label)}
                    onMouseLeave={() => setOpenMegaMenu(null)}
                  >
                    <Link
                      to={link.href}
                      className={`relative px-4 py-2.5 text-[14px] font-medium rounded-lg transition-all flex items-center gap-1 ${
                        isActive(link.href)
                          ? 'text-blue-600 bg-blue-50/60'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {link.label}
                      {isMegaMenuLink && <ChevronDown size={13} className={`opacity-50 transition-transform ${openMegaMenu === link.label ? 'rotate-180' : ''}`} />}
                      {isActive(link.href) && (
                        <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-blue-600 rounded-full" />
                      )}
                    </Link>
                  </div>
                );
              })}
            </nav>

            {/* Search */}
            <div ref={searchRef} className="relative flex-1 max-w-xs hidden md:block">
              <form onSubmit={handleSearch}>
                <div className="relative group">
                  <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    placeholder="Search products..."
                    className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </form>
              {searchFocused && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl max-h-[420px] overflow-y-auto z-50">
                  {totalSearchResults === 0 ? (
                    <div className="p-6 text-center text-gray-500 text-sm">
                      No results found for "{searchQuery}"
                    </div>
                  ) : (
                    <div className="p-3">
                      {searchResults.electronics.length > 0 && (
                        <div className="mb-3">
                          <div className="text-xs font-semibold uppercase tracking-wide text-blue-600 px-2 py-1.5">Electronics</div>
                          {searchResults.electronics.slice(0, 3).map((p) => (
                            <Link key={p.id} to={`/electronics/product/${p.slug}`} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                              <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">{p.name}</div>
                                <div className="text-xs text-gray-500">{p.brand}</div>
                              </div>
                              <div className="text-sm font-semibold text-gray-900">LKR {p.price.toLocaleString()}</div>
                            </Link>
                          ))}
                        </div>
                      )}
                      {searchResults.fashion.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wide text-blue-600 px-2 py-1.5">Fashion</div>
                          {searchResults.fashion.slice(0, 3).map((p) => (
                            <Link key={p.id} to={`/fashion/product/${p.slug}`} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                              <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">{p.name}</div>
                                <div className="text-xs text-gray-500">{p.brand}</div>
                              </div>
                              <div className="text-sm font-semibold text-gray-900">LKR {p.price.toLocaleString()}</div>
                            </Link>
                          ))}
                        </div>
                      )}
                      <Link to={`/search?q=${encodeURIComponent(searchQuery.trim())}`} className="block px-2 py-2 text-sm font-medium text-blue-600 hover:underline mt-2" onClick={() => setSearchFocused(false)}>
                        View all results →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
              <Link to="/wishlist" className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all" aria-label="Wishlist">
                <Heart size={21} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">{wishlist.length}</span>
                )}
              </Link>
              <Link to="/cart" className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all" aria-label="Cart">
                <ShoppingCart size={21} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">{cartCount}</span>
                )}
              </Link>
              <Link to="/account" className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all hidden sm:block" aria-label="Account">
                <User size={21} />
              </Link>
            </div>
          </div>

          {/* Mobile search */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch}>
              <div className="relative group">
                <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
            </form>
          </div>
        </div>

        {/* Mega Menu - Electronics */}
        {openMegaMenu === 'Electronics' && (
          <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl hidden lg:block" onMouseEnter={() => setOpenMegaMenu('Electronics')} onMouseLeave={() => setOpenMegaMenu(null)}>
            <div className="container-page py-8">
              <div className="grid grid-cols-5 gap-8">
                {electronicsCategories.slice(0, 5).map((cat) => (
                  <div key={cat.id}>
                    <Link to={`/electronics/${cat.slug}`} className="block font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors">{cat.name}</Link>
                    {cat.subcategories && (
                      <ul className="space-y-2">
                        {cat.subcategories.map((sub) => (
                          <li key={sub.slug}>
                            <Link to={`/electronics/${cat.slug}/${sub.slug}`} className="text-sm text-gray-500 hover:text-blue-600 transition-colors">{sub.name}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                <Link to="/electronics" className="btn-primary">Shop All Electronics</Link>
                <div className="text-sm text-gray-500">Technology for work, entertainment and everyday life.</div>
              </div>
            </div>
          </div>
        )}

        {/* Mega Menu - Fashion */}
        {openMegaMenu === 'Fashion' && (
          <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl hidden lg:block" onMouseEnter={() => setOpenMegaMenu('Fashion')} onMouseLeave={() => setOpenMegaMenu(null)}>
            <div className="container-page py-8">
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="font-semibold text-gray-900 mb-3">Ladies</div>
                  <ul className="space-y-2">
                    <li><Link to="/fashion/ladies-handbags" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Handbags</Link></li>
                    <li><Link to="/fashion/accessories" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Accessories</Link></li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-3">Men</div>
                  <ul className="space-y-2">
                    <li className="text-sm text-gray-300 cursor-default">Clothing (Coming Soon)</li>
                    <li className="text-sm text-gray-300 cursor-default">Shoes (Coming Soon)</li>
                    <li className="text-sm text-gray-300 cursor-default">Accessories (Coming Soon)</li>
                  </ul>
                </div>
                <div className="rounded-xl overflow-hidden">
                  <img src="https://images.pexels.com/photos/10919291/pexels-photo-10919291.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Ladies Handbags" className="w-full h-32 object-cover" />
                  <div className="p-3 bg-gray-50">
                    <div className="font-semibold text-sm text-gray-900">Ladies Handbags</div>
                    <Link to="/fashion/ladies-handbags" className="text-sm text-blue-600 hover:underline">Shop Now →</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white overflow-y-auto animate-slide-in">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <Link to="/" className="flex items-center gap-2.5" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-lg">N</div>
                <span className="text-xl font-bold tracking-tight text-gray-900">NEXUS</span>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500 p-1.5 rounded-lg hover:bg-gray-50" aria-label="Close menu">
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <Link to="/" className="block py-3 font-medium text-gray-900 border-b border-gray-50">Home</Link>
              <div className="py-3 border-b border-gray-50">
                <div className="font-semibold text-gray-900 mb-2">Electronics</div>
                <div className="pl-4 space-y-2">
                  {electronicsCategories.map((cat) => (<Link key={cat.id} to={`/electronics/${cat.slug}`} className="block py-1.5 text-sm text-gray-600 hover:text-blue-600">{cat.name}</Link>))}
                  <Link to="/electronics" className="block py-1.5 text-sm font-medium text-blue-600">All Electronics →</Link>
                </div>
              </div>
              <div className="py-3 border-b border-gray-50">
                <div className="font-semibold text-gray-900 mb-2">Fashion</div>
                <div className="pl-4 space-y-2">
                  {fashionCategories.map((cat) => (<Link key={cat.id} to={`/fashion/${cat.slug}`} className="block py-1.5 text-sm text-gray-600 hover:text-blue-600">{cat.name}</Link>))}
                  <Link to="/fashion" className="block py-1.5 text-sm font-medium text-blue-600">All Fashion →</Link>
                </div>
              </div>
              <Link to="/new-arrivals" className="block py-3 font-medium text-gray-900 border-b border-gray-50">New Arrivals</Link>
              <Link to="/best-sellers" className="block py-3 font-medium text-gray-900 border-b border-gray-50">Best Sellers</Link>
              <Link to="/deals" className="block py-3 font-medium text-gray-900 border-b border-gray-50">Deals</Link>
              <div className="pt-4 space-y-3">
                <Link to="/account" className="flex items-center gap-2 py-2 text-gray-700"><User size={20} /> Account</Link>
                <Link to="/wishlist" className="flex items-center gap-2 py-2 text-gray-700"><Heart size={20} /> Wishlist ({wishlist.length})</Link>
                <Link to="/cart" className="flex items-center gap-2 py-2 text-gray-700"><ShoppingCart size={20} /> Cart ({cartCount})</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
