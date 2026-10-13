import { useState, useEffect, useRef, useMemo, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import type { Product } from '@/data/catalog';

const MEGA_FEATURE = {
  Electronics: {
    image: 'https://images.pexels.com/photos/11129922/pexels-photo-11129922.jpeg?auto=compress&cs=tinysrgb&h=500&w=700',
    title: 'Up to 20% off selected electronics',
    cta: 'Explore electronics deals',
    href: '/deals',
  },
  Fashion: {
    image: 'https://images.pexels.com/photos/10919291/pexels-photo-10919291.jpeg?auto=compress&cs=tinysrgb&h=500&w=700',
    title: 'Curated ladies handbags',
    cta: 'Shop collection',
    href: '/fashion/ladies-handbags',
  },
} as const;

type MegaKey = keyof typeof MEGA_FEATURE;

const navLinks: { label: string; href: string; mega?: MegaKey; accent: string }[] = [
  { label: 'Electronics', href: '/electronics', mega: 'Electronics', accent: '#2347F5' },
  { label: 'Fashion', href: '/fashion', mega: 'Fashion', accent: '#7A2E3A' },
  { label: 'New Arrivals', href: '/new-arrivals', accent: '#2347F5' },
  { label: 'Best Sellers', href: '/best-sellers', accent: '#2347F5' },
  { label: 'Deals', href: '/deals', accent: '#2347F5' },
];

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-2.5 shrink-0 group" aria-label="Eagle Eye View home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#15171C] text-white text-base font-extrabold shadow-sm transition-transform duration-200 group-hover:scale-105">
        E
      </span>
      <span className="font-display text-xl font-extrabold tracking-tight text-[#15171C]">
        Eagle Eye View
      </span>
    </Link>
  );
}

function ProductRow({ p, dept, onPick }: { p: Product; dept: 'electronics' | 'fashion'; onPick: () => void }) {
  return (
    <Link
      to={`/${dept}/product/${p.slug}`}
      onClick={onPick}
      className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-slate-50"
    >
      <img src={p.images[0]} alt="" className="h-12 w-12 rounded-lg object-cover bg-slate-100 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-[#15171C]">{p.name}</div>
        <div className="text-xs text-gray-500">{p.brand}</div>
      </div>
      <div className="text-sm font-bold text-[#15171C] whitespace-nowrap">LKR {p.price.toLocaleString()}</div>
    </Link>
  );
}

function SearchResults({
  query,
  onPick,
  quick,
}: {
  query: string;
  onPick: () => void;
  quick: { name: string; to: string }[];
}) {
  const { searchProducts } = useStore();
  const q = query.trim();
  const res = useMemo(() => (q ? searchProducts(q) : { electronics: [], fashion: [] }), [q, searchProducts]);
  const total = res.electronics.length + res.fashion.length;

  if (!q) {
    return (
      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Popular categories</p>
        <div className="flex flex-wrap gap-2">
          {quick.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              onClick={onPick}
              className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:border-[#15171C] hover:text-[#15171C] transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="p-8 text-center">
        <p className="font-semibold text-[#15171C]">No results found for “{q}”</p>
        <p className="mt-1 text-sm text-gray-500">Check spelling or try broader terms like “headphones” or “tote”.</p>
      </div>
    );
  }

  return (
    <div className="p-3">
      {res.electronics.length > 0 && (
        <div className="mb-2">
          <p className="px-2 pt-1 pb-1.5 text-xs font-bold uppercase tracking-wider text-[#2347F5]">Electronics</p>
          {res.electronics.slice(0, 3).map((p) => (
            <ProductRow key={p.id} p={p} dept="electronics" onPick={onPick} />
          ))}
        </div>
      )}
      {res.fashion.length > 0 && (
        <div className="mb-2">
          <p className="px-2 pt-1 pb-1.5 text-xs font-bold uppercase tracking-wider text-[#7A2E3A]">Fashion</p>
          {res.fashion.slice(0, 3).map((p) => (
            <ProductRow key={p.id} p={p} dept="fashion" onPick={onPick} />
          ))}
        </div>
      )}
      <Link
        to={`/search?q=${encodeURIComponent(q)}`}
        onClick={onPick}
        className="mt-2 flex items-center justify-between rounded-xl bg-[#15171C] px-4 py-3 text-sm font-semibold text-white hover:bg-black transition-colors"
      >
        <span>See all {total} matching items</span>
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

function NavBadge({ n, tone }: { n: number; tone: 'accent' | 'ink' }) {
  if (n <= 0) return null;
  return (
    <span
      className={`absolute -top-1 -right-1 grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white ${
        tone === 'accent' ? 'bg-[#2347F5]' : 'bg-[#15171C]'
      }`}
    >
      {n > 99 ? '99+' : n}
    </span>
  );
}

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, wishlist, getCategoriesByDepartment } = useStore();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accordion, setAccordion] = useState<MegaKey | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchOverlay, setSearchOverlay] = useState(false);
  const [openMenu, setOpenMenu] = useState<MegaKey | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const searchWrapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const overlayInputRef = useRef<HTMLInputElement>(null);

  const dept: 'electronics' | 'fashion' = location.pathname.startsWith('/fashion') ? 'fashion' : 'electronics';
  const isActive = (href: string) => (href === '/' ? location.pathname === '/' : location.pathname.startsWith(href));

  const electronicsCategories = getCategoriesByDepartment('electronics');
  const fashionCategories = getCategoriesByDepartment('fashion');
  const megaCategories: Record<MegaKey, any[]> = { Electronics: electronicsCategories, Fashion: fashionCategories };
  const quick = [
    ...electronicsCategories.slice(0, 4).map((c) => ({ name: c.name, to: `/electronics/${c.slug}` })),
    ...fashionCategories.slice(0, 3).map((c) => ({ name: c.name, to: `/fashion/${c.slug}` })),
  ];

  /* scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* close navigation menus on route changes */
  useEffect(() => {
    setDrawerOpen(false);
    setOpenMenu(null);
    setSearchOverlay(false);
    setSearchFocused(false);
  }, [location.pathname]);

  /* click outside desktop search */
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  /* Esc closes modals; "/" focuses search */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenu(null);
        setDrawerOpen(false);
        setSearchOverlay(false);
        setSearchFocused(false);
      }
      const t = e.target as HTMLElement;
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if (e.key === '/' && !typing) {
        e.preventDefault();
        if (window.matchMedia('(min-width:1024px)').matches) {
          searchInputRef.current?.focus();
        } else {
          setSearchOverlay(true);
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  /* lock body scroll when drawer or search overlay is open */
  useEffect(() => {
    document.body.style.overflow = drawerOpen || searchOverlay ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen, searchOverlay]);

  useEffect(() => {
    if (searchOverlay) {
      setTimeout(() => overlayInputRef.current?.focus(), 50);
    }
  }, [searchOverlay]);

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setSearchFocused(false);
    setSearchOverlay(false);
    setSearchQuery('');
  };

  const closeSearch = () => {
    setSearchFocused(false);
    setSearchOverlay(false);
  };

  return (
    <>
      <header
        onMouseLeave={() => setOpenMenu(null)}
        className={`sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur-md transition-all duration-200 ${
          scrolled ? 'border-gray-200 shadow-[0_4px_24px_rgba(21,23,28,0.06)]' : 'border-gray-100'
        }`}
      >
        <div className="container-page flex h-16 items-center justify-between gap-3 lg:gap-8">
          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              className="grid h-10 w-10 place-items-center rounded-xl text-gray-700 hover:bg-slate-100 transition-colors"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
            >
              <Menu size={22} />
            </button>
            <Logo />
          </div>

          {/* Desktop Logo */}
          <div className="hidden lg:flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center self-stretch space-x-1" aria-label="Main navigation">
            {navLinks.map((l) => {
              const active = isActive(l.href);
              const open = l.mega && openMenu === l.mega;
              return (
                <div key={l.label} className="relative h-full" onMouseEnter={() => setOpenMenu(l.mega ?? null)}>
                  <div className="flex h-full items-center">
                    <Link
                      to={l.href}
                      aria-current={active ? 'page' : undefined}
                      className={`relative flex h-full items-center whitespace-nowrap px-3 text-sm font-medium transition-colors ${
                        active ? 'text-[#15171C] font-semibold' : 'text-gray-600 hover:text-[#15171C]'
                      }`}
                    >
                      {l.label}
                      {l.label === 'Deals' && (
                        <span className="ml-1.5 flex h-2 w-2 rounded-full bg-[#2347F5]" aria-hidden />
                      )}
                      {active && (
                        <span
                          className="absolute inset-x-3 bottom-0 h-[2.5px] rounded-full"
                          style={{ background: l.accent }}
                        />
                      )}
                    </Link>
                    {l.mega && (
                      <button
                        onClick={() => setOpenMenu(open ? null : l.mega!)}
                        aria-expanded={!!open}
                        aria-label={`${l.label} categories`}
                        className="grid h-8 w-5 -ml-1 place-items-center rounded text-gray-400 hover:text-gray-700"
                      >
                        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Search bar & Action icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop search */}
            <div
              ref={searchWrapRef}
              className="relative hidden lg:block w-52 xl:w-72"
              onMouseEnter={() => setOpenMenu(null)}
            >
              <form onSubmit={submitSearch} role="search">
                <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  placeholder="Search products..."
                  aria-label="Search products"
                  className="h-10 w-full rounded-full border border-gray-200 bg-slate-50 pl-9 pr-10 text-sm text-[#15171C] placeholder:text-gray-400 transition-all focus:border-[#15171C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5"
                />
                {!searchQuery && (
                  <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-mono font-medium text-gray-400">
                    /
                  </kbd>
                )}
              </form>
              {searchFocused && (
                <div className="animate-fade-in absolute right-0 top-[calc(100%+8px)] z-50 w-96 max-h-[70vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-[0_20px_50px_rgba(21,23,28,0.15)]">
                  <SearchResults query={searchQuery} onPick={closeSearch} quick={quick} />
                </div>
              )}
            </div>

            {/* Mobile / Tablet search button */}
            <button
              className="grid h-10 w-10 place-items-center rounded-xl text-gray-700 hover:bg-slate-100 transition-colors lg:hidden"
              onClick={() => setSearchOverlay(true)}
              aria-label="Search store"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label={`Wishlist, ${wishlist.length} items`}
              className="relative hidden sm:grid h-10 w-10 place-items-center rounded-xl text-gray-700 hover:bg-slate-100 transition-colors"
            >
              <Heart size={20} />
              <NavBadge n={wishlist.length} tone="ink" />
            </Link>

            {/* Account */}
            <Link
              to="/account"
              aria-label="My Account"
              className="hidden sm:grid h-10 w-10 place-items-center rounded-xl text-gray-700 hover:bg-slate-100 transition-colors"
            >
              <User size={20} />
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              aria-label={`Shopping Cart, ${cartCount} items`}
              className="relative flex items-center justify-center h-10 px-3.5 rounded-full bg-[#15171C] text-white hover:bg-black transition-all active:scale-95 shadow-sm"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="ml-1.5 text-xs font-bold font-mono">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        {openMenu && (
          <>
            <div
              className="pointer-events-none fixed inset-0 top-[100px] z-30 bg-black/20 backdrop-blur-[2px] transition-opacity"
              aria-hidden
            />
            <div
              className="animate-fade-in absolute inset-x-0 top-full z-40 border-b border-gray-200 bg-white shadow-[0_24px_48px_rgba(21,23,28,0.1)]"
            >
              <div className="container-page py-8 lg:py-10 grid grid-cols-12 gap-8 lg:gap-12">
                <div className="col-span-8">
                  <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
                    <h3 className="font-display text-2xl font-bold text-[#15171C]">
                      {openMenu === 'Electronics' ? 'Electronics Catalog' : 'Fashion Catalog'}
                    </h3>
                    <Link
                      to={`/${openMenu.toLowerCase()}`}
                      className="text-xs font-bold uppercase tracking-wider text-[#2347F5] hover:underline flex items-center gap-1"
                    >
                      View all {openMenu.toLowerCase()} <ArrowRight size={13} />
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 gap-x-8 gap-y-6">
                    {megaCategories[openMenu].slice(0, 6).map((cat) => (
                      <div key={cat.id}>
                        <Link
                          to={`/${openMenu.toLowerCase()}/${cat.slug}`}
                          className="mb-2 block text-sm font-bold text-[#15171C] hover:text-[#2347F5] transition-colors"
                        >
                          {cat.name}
                        </Link>
                        {cat.subcategories && (
                          <ul className="space-y-1.5">
                            {cat.subcategories.slice(0, 4).map((sub: { slug: string; name: string }) => (
                              <li key={sub.slug}>
                                <Link
                                  to={`/${openMenu.toLowerCase()}/${cat.slug}/${sub.slug}`}
                                  className="text-xs text-gray-500 hover:text-[#15171C] transition-colors"
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mega feature banner */}
                <div className="col-span-4">
                  <Link
                    to={MEGA_FEATURE[openMenu].href}
                    className="group relative flex h-full min-h-[260px] flex-col justify-end overflow-hidden rounded-2xl p-6 text-white"
                  >
                    <img
                      src={MEGA_FEATURE[openMenu].image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="relative z-10">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-semibold text-white mb-2">
                        <Sparkles size={11} /> Featured
                      </span>
                      <p className="font-display text-xl font-bold leading-tight">{MEGA_FEATURE[openMenu].title}</p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white group-hover:translate-x-1 transition-transform">
                        {MEGA_FEATURE[openMenu].cta} <ArrowRight size={13} />
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Mobile search overlay */}
      {searchOverlay && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white" role="dialog" aria-modal="true" aria-label="Search">
          <form onSubmit={submitSearch} className="flex items-center gap-2 border-b border-gray-200 p-3 sm:p-4">
            <div className="relative flex-1">
              <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={overlayInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, categories..."
                aria-label="Search products"
                className="h-11 w-full rounded-full bg-slate-100 pl-10 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
            <button
              type="button"
              onClick={closeSearch}
              className="grid h-11 w-11 place-items-center rounded-full text-gray-600 hover:bg-slate-100"
              aria-label="Close search"
            >
              <X size={20} />
            </button>
          </form>
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-2xl">
              <SearchResults query={searchQuery} onPick={closeSearch} quick={quick} />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation Menu">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setDrawerOpen(false)} />
          <div className="animate-slide-in-left absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <Logo onClick={() => setDrawerOpen(false)} />
              <button
                onClick={() => setDrawerOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-xl text-gray-500 hover:bg-slate-100"
                aria-label="Close navigation"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-gray-100" aria-label="Mobile Navigation">
              {(['Electronics', 'Fashion'] as MegaKey[]).map((k) => {
                const open = accordion === k;
                const cats = megaCategories[k];
                return (
                  <div key={k} className="py-2">
                    <button
                      onClick={() => setAccordion(open ? null : k)}
                      aria-expanded={open}
                      className="font-display flex w-full items-center justify-between py-2 text-xl font-bold text-[#15171C]"
                    >
                      {k}
                      <ChevronDown size={18} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </button>
                    {open && (
                      <ul className="py-2 pl-2 space-y-2">
                        {cats.map((c) => (
                          <li key={c.id}>
                            <Link
                              to={`/${k.toLowerCase()}/${c.slug}`}
                              className="block py-1 text-sm font-medium text-gray-600 hover:text-[#15171C]"
                            >
                              {c.name}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link
                            to={`/${k.toLowerCase()}`}
                            className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2347F5]"
                          >
                            View all {k.toLowerCase()} <ArrowRight size={13} />
                          </Link>
                        </li>
                      </ul>
                    )}
                  </div>
                );
              })}

              <div className="py-3 space-y-3">
                {[
                  { label: 'New Arrivals', href: '/new-arrivals' },
                  { label: 'Best Sellers', href: '/best-sellers' },
                  { label: 'Special Deals', href: '/deals' },
                ].map((l) => (
                  <Link
                    key={l.href}
                    to={l.href}
                    className="font-display block text-lg font-bold text-[#15171C] hover:text-[#2347F5]"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Bottom drawer bar */}
            <div className="grid grid-cols-3 gap-2 border-t border-gray-100 p-4 bg-slate-50">
              <Link
                to="/account"
                className="flex flex-col items-center gap-1 rounded-xl bg-white p-2.5 text-xs font-semibold text-gray-700 border border-gray-200"
              >
                <User size={18} /> Account
              </Link>
              <Link
                to="/wishlist"
                className="flex flex-col items-center gap-1 rounded-xl bg-white p-2.5 text-xs font-semibold text-gray-700 border border-gray-200"
              >
                <Heart size={18} /> Wishlist ({wishlist.length})
              </Link>
              <Link
                to="/cart"
                className="flex flex-col items-center gap-1 rounded-xl bg-[#15171C] p-2.5 text-xs font-semibold text-white"
              >
                <ShoppingBag size={18} /> Cart ({cartCount})
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}