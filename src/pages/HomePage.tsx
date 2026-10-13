import { useRef, useState, type ReactNode } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Truck,
  RotateCcw,
  ShieldCheck,
  Award,
  ShoppingCart,
  Zap,
  Check,
} from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import Rating from '@/components/ui/Rating';
import WishlistButton from '@/components/ui/WishlistButton';

function Link({ href, ...props }: any) {
  return <RouterLink to={href} {...props} />;
}

/* ────────────────────────────────────────────────────────────
   THEME  (cobalt = electronics, oxblood = fashion)
──────────────────────────────────────────────────────────── */
const THEME_CSS = `
.hp { --paper:#F6F7F9; --surface:#fff; --ink:#15171C; --muted:#5B6070; --line:#E3E5EA;
      --accent:#2347F5; --accent-ink:#fff; --accent-soft:#E8ECFE;
      background:var(--paper); color:var(--ink); font-family:'Figtree',system-ui,sans-serif; line-height:1.5; }
.hp [data-dept="fashion"] { --accent:#7A2E3A; --accent-soft:#F4E6E8; }
.hp h1,.hp h2,.hp h3 { font-family:'Bricolage Grotesque',system-ui,sans-serif; letter-spacing:-.025em; line-height:1.1; }

.hp .wrap { max-width:1280px; margin-inline:auto; padding-inline:16px; }
@media (min-width:640px){ .hp .wrap{ padding-inline:24px; } }
@media (min-width:1024px){ .hp .wrap{ padding-inline:32px; } }

.hp .sec { padding-block:48px; }
@media (min-width:768px){ .hp .sec{ padding-block:72px; } }
@media (min-width:1024px){ .hp .sec{ padding-block:92px; } }

.hp .btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; min-height:48px; padding:0 26px;
           border-radius:999px; font-weight:600; font-size:15px; transition:transform .2s, background-color .2s, color .2s, filter .2s; }
.hp .btn:active { transform:scale(.97); }
.hp .btn-accent { background:var(--accent); color:var(--accent-ink); }
.hp .btn-accent:hover { filter:brightness(1.1); }
.hp .btn-light { background:#fff; color:var(--ink); }
.hp .btn-light:hover { background:var(--ink); color:#fff; }
.hp .chip { display:inline-flex; align-items:center; min-height:36px; padding:0 16px; border-radius:999px;
            border:1.5px solid var(--line); background:#fff; font-size:13px; font-weight:600; transition:border-color .2s, color .2s, transform .2s; }
.hp .chip:hover { border-color:var(--accent); color:var(--accent); transform:translateY(-1px); }
.hp .chip-dark { background:rgba(255,255,255,.14); border-color:rgba(255,255,255,.3); color:#fff; }
.hp .chip-dark:hover { background:#fff; color:var(--ink); border-color:#fff; }

.hp a:focus-visible,.hp button:focus-visible { outline:3px solid var(--accent); outline-offset:2px; border-radius:8px; }

/* HERO: Two showcase departments, interactive hover on desktop, clean responsive stack on mobile */
.hp .split { display:flex; flex-direction:column; container-type:inline-size; width:100%; }
@media (min-width:1024px){
  .hp .split { flex-direction:row; min-height:calc(100svh - 96px); max-height:760px; }
}

.hp .panel { position:relative; overflow:hidden; color:#fff; display:flex; align-items:flex-end; isolation:isolate; min-height:320px; flex:1; }
@media (min-width:640px){ .hp .panel{ min-height:380px; } }
@media (min-width:1024px){ .hp .panel{ min-height:auto; transition:flex .7s cubic-bezier(.2,.7,.2,1); } }

.hp .panel img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:-2; transition:transform 1.2s cubic-bezier(.2,.7,.2,1); }
.hp .panel::after { content:''; position:absolute; inset:0; z-index:-1; }
.hp .panel[data-dept="electronics"]::after { background:linear-gradient(to top, rgba(14,28,110,.94) 10%, rgba(35,71,245,.3) 75%, transparent); }
.hp .panel[data-dept="fashion"]::after { background:linear-gradient(to top, rgba(62,18,28,.94) 10%, rgba(122,46,58,.3) 75%, transparent); }
.hp .panel:hover img { transform:scale(1.05); }

.hp .hero-in { width:100%; padding:32px 20px; }
@media (min-width:640px){ .hp .hero-in{ padding:44px 32px; } }

@media (min-width:1024px){
  .hp .panel:first-child .hero-in { padding:0 40px 64px max(32px, calc((100cqw - 1280px) / 2 + 32px)); }
  .hp .panel:last-child .hero-in { padding:0 max(32px, calc((100cqw - 1280px) / 2 + 32px)) 64px 44px; }
  .hp .split:hover .panel { flex:.85; }
  .hp .split .panel:hover { flex:1.4; }
  .hp .panel .more { max-height:0; opacity:0; overflow:hidden; transition:max-height .5s, opacity .5s; }
  .hp .panel:hover .more { max-height:220px; opacity:1; }
}

@media (max-width:1023px){
  .hp .panel .more { max-height:none; opacity:1; }
}

/* Product rows: smooth peek snap-scroll on mobile, structured grid on desktop */
.hp .row { display:grid; grid-auto-flow:column; grid-auto-columns:min(80vw, 290px); gap:16px; overflow-x:auto;
           scroll-snap-type:x mandatory; padding-bottom:12px; scrollbar-width:none; -webkit-overflow-scrolling:touch; }
.hp .row::-webkit-scrollbar { display:none; }
.hp .row > * { scroll-snap-align:start; }
@media (min-width:640px){ .hp .row{ grid-auto-columns:min(44vw, 280px); gap:20px; } }
@media (min-width:1024px){ .hp .row{ grid-auto-flow:row; grid-template-columns:repeat(4,1fr); grid-auto-columns:auto; overflow:visible; gap:24px; } }

.hp .card-img { aspect-ratio:1/1 !important; overflow:hidden; border-radius:14px; background:#F6F7F9; position:relative; }
.hp .card-img img { width:100%; height:100%; object-fit:cover; transition:transform .6s cubic-bezier(.2,.7,.2,1); }
.hp .card:hover .card-img img { transform:scale(1.05); }

.hp .tile img { transition:transform .8s cubic-bezier(.2,.7,.2,1); }
.hp .tile:hover img { transform:scale(1.06); }
.hp .tile h3 { color:#fff !important; text-shadow:0 2px 4px rgba(0,0,0,.7); }
.hp .look .text-white h3 { color:#fff !important; text-shadow:0 2px 4px rgba(0,0,0,.7); }

/* Lookbook (handbags): responsive grid */
.hp .look { display:grid; gap:16px; grid-template-columns:repeat(2,1fr); }
.hp .look > :first-child { grid-column:span 2; aspect-ratio:16/9; }
@media (min-width:640px){
  .hp .look > :first-child { aspect-ratio:2/1; }
}
@media (min-width:1024px){
  .hp .look { grid-template-columns:repeat(4,1fr); grid-template-rows:repeat(2,1fr); gap:24px; }
  .hp .look > :first-child { grid-column:span 2; grid-row:span 2; aspect-ratio:auto; min-height:580px; }
}

@media (min-width:1024px){
  .hp .row-scroll { grid-auto-flow:column; grid-template-columns:none; grid-auto-columns:calc((100% - 72px) / 4);
                    overflow-x:auto; scroll-snap-type:x mandatory; scrollbar-width:none; }
  .hp .row-scroll::-webkit-scrollbar { display:none; }
}
`;

type Any = Record<string, any>;
const money = (v: any) => (typeof v === 'number' ? `LKR ${v.toLocaleString()}` : v ?? '');
const pName = (p: Any) => p.name ?? p.title ?? 'Product';
const pImg = (p: Any) => p.images?.[0] ?? p.image ?? p.thumbnail ?? '';
const pOld = (p: Any) => p.compareAtPrice ?? p.oldPrice ?? p.originalPrice ?? p.comparePrice;
const pHref = (p: Any, dept: string) => `/${dept}/product/${p.slug ?? p.id}`;

const IMG = {
  heroTech: 'https://images.pexels.com/photos/11129922/pexels-photo-11129922.jpeg?auto=compress&cs=tinysrgb&h=900&w=1400',
  heroBag: 'https://images.pexels.com/photos/10340652/pexels-photo-10340652.jpeg?auto=compress&cs=tinysrgb&h=900&w=1400',
  techIntro: 'https://images.pexels.com/photos/265144/pexels-photo-265144.jpeg?auto=compress&cs=tinysrgb&h=900&w=1400',
  promo: 'https://images.pexels.com/photos/19055620/pexels-photo-19055620.jpeg?auto=compress&cs=tinysrgb&h=900&w=1400',
  fashionIntro: 'https://images.pexels.com/photos/8386651/pexels-photo-8386651.jpeg?auto=compress&cs=tinysrgb&h=1000&w=1400',
  editorial: 'https://images.pexels.com/photos/8989582/pexels-photo-8989582.jpeg?auto=compress&cs=tinysrgb&h=1000&w=1800',
};

/* ────────────────────────────────────────────────────────────
   Hero Section
──────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section aria-label="Shop by department" className="split">
      <Link href="/electronics" data-dept="electronics" className="panel group">
        <img src={IMG.heroTech} alt="Eagle Eye View Electronics" />
        <div className="hero-in">
          <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold uppercase tracking-wider text-white mb-3">
            Electronics Store
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white">
            Technology that powers your day
          </h1>
          <div className="more">
            <p className="mt-3 max-w-md text-sm sm:text-base text-white/90">
              Mobile, computing, audio and wearable tech, with verified warranties and up to 20% off selected gear.
            </p>
            <span className="btn btn-light mt-5">
              Explore Electronics <ArrowRight size={16} />
            </span>
          </div>
        </div>
      </Link>

      <Link href="/fashion" data-dept="fashion" className="panel group">
        <img src={IMG.heroBag} alt="Eagle Eye View Fashion" />
        <div className="hero-in">
          <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold uppercase tracking-wider text-white mb-3">
            Fashion Boutique
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white">
            Style for every occasion
          </h1>
          <div className="more">
            <p className="mt-3 max-w-md text-sm sm:text-base text-white/90">
              Handbags and accessories crafted for timeless elegance, everyday function, and refined taste.
            </p>
            <span className="btn btn-light mt-5">
              Explore Fashion <ArrowRight size={16} />
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}

function SectionHead({
  id,
  title,
  subtitle,
  href,
  cta = 'View all',
  extra,
}: {
  id: string;
  title: string;
  subtitle?: string;
  href?: string;
  cta?: string;
  extra?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8 lg:mb-10">
      <div>
        <h2 id={id} className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#15171C]">
          {title}
        </h2>
        {subtitle && <p className="mt-1.5 text-sm sm:text-base text-gray-500 max-w-xl">{subtitle}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {extra}
        {href && (
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2347F5] hover:text-[#1635D6] group"
          >
            <span>{cta}</span>
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  );
}

function DeptIntro({
  dept,
  eyebrow,
  title,
  copy,
  cta,
  href,
  image,
  links,
  reverse,
}: {
  dept: 'electronics' | 'fashion';
  eyebrow: string;
  title: string;
  copy: string;
  cta: string;
  href: string;
  image: string;
  links: Any[];
  reverse?: boolean;
}) {
  return (
    <section className="sec overflow-hidden" data-dept={dept} aria-label={eyebrow}>
      <div className="wrap grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
        <div className={`lg:col-span-5 ${reverse ? 'lg:order-2' : ''}`}>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#15171C]">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">{copy}</p>
          <Link href={href} className="btn btn-accent mt-6 sm:mt-8">
            {cta} <ArrowRight size={16} />
          </Link>
          {links.length > 0 && (
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-2">
              {links.slice(0, 5).map((c) => (
                <Link key={c.id ?? c.slug} href={`/${dept}/${c.slug}`} className="chip">
                  {c.name}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className={`relative lg:col-span-7 ${reverse ? 'lg:order-1' : ''}`}>
          <div className="relative overflow-hidden rounded-3xl bg-slate-100 shadow-lg">
            <img
              src={image}
              alt=""
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Categories({
  dept,
  title,
  items,
  large,
}: {
  dept: 'electronics' | 'fashion';
  title: string;
  items: Any[];
  large?: boolean;
}) {
  if (!items?.length) return null;
  const id = `cat-${dept}`;
  return (
    <section className="sec pt-0 lg:pt-0" data-dept={dept} aria-labelledby={id}>
      <div className="wrap">
        <SectionHead id={id} title={title} href={`/${dept}`} />
        <div className={`grid grid-cols-2 gap-3 sm:gap-5 ${large ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
          {items.map((c) => (
            <Link
              key={c.id ?? c.slug}
              href={`/${dept}/${c.slug}`}
              className="tile group relative flex aspect-[4/5] sm:aspect-[5/6] items-end overflow-hidden rounded-2xl bg-slate-200"
            >
              {c.image && (
                <img
                  src={c.image}
                  alt={c.name}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              <div className="relative flex w-full items-center justify-between p-4 sm:p-5 text-white">
                <h3 className="text-base sm:text-xl font-bold !text-white text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-tight">
                  {c.name}
                </h3>
                <span
                  aria-hidden
                  className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-white text-[#15171C] transition-transform duration-300 group-hover:translate-x-1 shrink-0 shadow-sm"
                >
                  <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomeProductCard({ p, dept }: { p: Any; dept: string }) {
  const navigate = useNavigate();
  const { addToCart, showToast } = useStore();
  const [added, setAdded] = useState(false);

  const old = pOld(p);
  const onSale = typeof old === 'number' && typeof p.price === 'number' && old > p.price;
  const off = onSale ? Math.round((1 - p.price / old) * 100) : 0;
  const href = pHref(p, dept);
  const isOutOfStock = p.stock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(p as any);
    setAdded(true);
    showToast(`Added ${pName(p)} to cart!`, 'success');
    setTimeout(() => setAdded(false), 1600);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(p as any);
    navigate('/checkout');
  };

  return (
    <article className="card group relative flex flex-col h-full bg-white rounded-2xl border border-gray-200/90 hover:border-gray-300 p-3 sm:p-4 hover:shadow-[0_16px_32px_rgba(21,23,28,0.08)] hover:-translate-y-1 transition-all duration-300">
      {/* Product Image Area */}
      <div className="card-img relative aspect-square overflow-hidden rounded-xl bg-[#F6F7F9] mb-3 shrink-0">
        <RouterLink to={href} className="block w-full h-full">
          {pImg(p) ? (
            <img
              src={pImg(p)}
              alt={pName(p)}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-gray-400">
              No Image
            </div>
          )}
        </RouterLink>

        {/* Sale / Discount Badge (Top Left) */}
        {onSale && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-[#DC2626] px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm pointer-events-none">
            -{off}%
          </span>
        )}

        {/* Wishlist Button (Top Right) */}
        <div className="absolute right-2.5 top-2.5 z-10">
          <WishlistButton
            productId={p.id}
            size={16}
            className="h-8 w-8 bg-white/90 shadow-sm hover:scale-105 transition-transform"
          />
        </div>
      </div>

      {/* Product Details Area */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Stock Row */}
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-gray-400 min-h-[16px] mb-1">
            <span className="truncate max-w-[65%]">{p.brand || (dept === 'fashion' ? 'Fashion' : 'Tech')}</span>
            {isOutOfStock ? (
              <span className="text-red-500 font-semibold normal-case text-[10px]">Out of stock</span>
            ) : (
              <span className="text-emerald-600 font-semibold normal-case text-[10px]">In Stock</span>
            )}
          </div>

          {/* Product Title */}
          <RouterLink to={href} className="block group/title">
            <h3 className="line-clamp-2 text-sm sm:text-[15px] font-semibold text-[#15171C] group-hover/title:text-[#2347F5] transition-colors leading-snug min-h-[2.6rem]">
              {pName(p)}
            </h3>
          </RouterLink>

          {/* Star Rating */}
          <div className="mt-1.5 mb-2">
            <Rating rating={p.rating ?? 4.5} reviewCount={p.reviewCount ?? 18} size="sm" />
          </div>
        </div>

        {/* Bottom Area: Pricing and Action Buttons */}
        <div className="mt-auto pt-2">
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-bold text-[#15171C]">
              {money(p.price)}
            </span>
            {onSale && (
              <span className="text-xs sm:text-sm text-gray-400 line-through">
                {money(old)}
              </span>
            )}
          </div>

          {/* Action Buttons: Add to cart & BUY NOW */}
          <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-gray-100">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`h-9 sm:h-10 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'border border-gray-200 bg-slate-50 hover:bg-slate-100 hover:border-gray-300 text-gray-800'
              }`}
              title="Add to Cart"
            >
              {added ? (
                <>
                  <Check size={14} className="stroke-[2.5]" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={14} />
                  <span>Add to cart</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="h-9 sm:h-10 rounded-xl bg-[#2347F5] hover:bg-[#1635D6] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 shadow-sm shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md"
              title="Buy Now"
            >
              <Zap size={14} className="fill-current" />
              <span>BUY NOW</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function Products({
  title,
  subtitle,
  items,
  href,
  cta,
  dept,
  tint,
  deptOf,
  carousel,
}: {
  title: string;
  subtitle?: string;
  items: Any[];
  href: string;
  cta?: string;
  dept?: 'electronics' | 'fashion';
  tint?: boolean;
  deptOf?: (p: Any) => string;
  carousel?: boolean;
  ranked?: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const scrollRow = (dir: number) => {
    const el = rowRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };
  if (!items?.length) return null;
  const id = `prod-${title.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <section className={`sec ${tint ? 'bg-white' : ''}`} aria-labelledby={id}>
      <div className="wrap" data-dept={dept}>
        <SectionHead
          id={id}
          title={title}
          subtitle={subtitle}
          href={href}
          cta={cta}
          extra={
            carousel && items.length > 4 ? (
              <div className="hidden gap-2 sm:flex">
                <button
                  onClick={() => scrollRow(-1)}
                  aria-label="Scroll left"
                  className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:border-[#15171C] hover:bg-[#15171C] hover:text-white transition-all shadow-xs active:scale-95"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => scrollRow(1)}
                  aria-label="Scroll right"
                  className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:border-[#15171C] hover:bg-[#15171C] hover:text-white transition-all shadow-xs active:scale-95"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            ) : null
          }
        />
        {carousel ? (
          <div
            ref={rowRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 px-0.5 scroll-smooth no-scrollbar snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {items.map((p) => (
              <div
                key={p.id ?? p.slug}
                className="w-[280px] sm:w-[290px] lg:w-[calc((100%-72px)/4)] shrink-0 snap-start flex flex-col"
              >
                <HomeProductCard
                  p={p}
                  dept={dept ?? deptOf?.(p) ?? 'electronics'}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch">
            {items.map((p) => (
              <div key={p.id ?? p.slug} className="flex flex-col h-full">
                <HomeProductCard
                  p={p}
                  dept={dept ?? deptOf?.(p) ?? 'electronics'}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Brands({ brands }: { brands: string[] }) {
  if (brands.length < 3) return null;
  return (
    <section className="pb-10 lg:pb-16" data-dept="electronics" aria-label="Popular brands">
      <div className="wrap flex flex-wrap items-center gap-2 sm:gap-3">
        <span className="mr-2 text-xs font-bold uppercase tracking-wider text-gray-400">Featured Brands:</span>
        {brands.slice(0, 8).map((b) => (
          <Link key={b} href={`/search?q=${encodeURIComponent(b)}`} className="chip">
            {b}
          </Link>
        ))}
      </div>
    </section>
  );
}

function Promo({ cats }: { cats: Any[] }) {
  return (
    <section className="sec pt-0 lg:pt-0" aria-label="Summer sale" data-dept="electronics">
      <div className="wrap">
        <div className="relative grid items-stretch overflow-hidden rounded-3xl bg-[#1B38D6] text-white lg:grid-cols-2 shadow-xl">
          <div className="relative z-10 p-6 sm:p-10 lg:p-14 flex flex-col justify-center">
            <span className="inline-flex w-fit rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Limited Offer
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Up to 20% off selected electronics
            </h2>
            <p className="mt-4 max-w-md text-sm sm:text-base text-white/90 leading-relaxed">
              Upgrade your work and gaming setup with top-tier gear, fast delivery, and full manufacturer warranties.
            </p>
            <div className="mt-6 sm:mt-8">
              <Link href="/deals" className="btn btn-light shadow-md">
                Claim Deals Now <ArrowRight size={16} />
              </Link>
            </div>
            {cats.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {cats.slice(0, 4).map((c) => (
                  <Link key={c.id ?? c.slug} href={`/electronics/${c.slug}`} className="chip chip-dark">
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="relative min-h-[260px] sm:min-h-[340px] lg:min-h-[440px]">
            <img src={IMG.promo} alt="Promotion" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 hidden bg-gradient-to-r from-[#1B38D6] to-transparent lg:block" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1B38D6] to-transparent lg:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Lookbook({ items }: { items: Any[] }) {
  if (!items?.length) return null;
  const [first, ...rest] = items;
  return (
    <section className="sec bg-white" data-dept="fashion" aria-labelledby="look">
      <div className="wrap">
        <SectionHead
          id="look"
          title="Ladies Handbags Lookbook"
          subtitle="Handbags thoughtfully chosen for everyday style, versatility, and elegance."
          href="/fashion/ladies-handbags"
          cta="Explore all handbags"
        />
        <div className="look">
          <Link
            href={pHref(first, 'fashion')}
            className="group relative block overflow-hidden rounded-2xl bg-slate-200 shadow-sm"
          >
            {pImg(first) && (
              <img
                src={pImg(first)}
                alt={pName(first)}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <div className="absolute bottom-0 p-5 sm:p-7 text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300">Customer Favorite</span>
              <h3 className="mt-1 text-xl sm:text-2xl lg:text-3xl font-extrabold !text-white text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{pName(first)}</h3>
              <p className="mt-2 text-base sm:text-lg font-bold !text-white text-white drop-shadow-sm">{money(first.price)}</p>
            </div>
          </Link>
          {rest.slice(0, 4).map((p) => (
            <article
              key={p.id ?? p.slug}
              className="card flex flex-col p-3 sm:p-4 bg-white hover:shadow-md transition-all"
            >
              <Link href={pHref(p, 'fashion')} className="block flex-1 flex flex-col">
                <div className="card-img !aspect-[4/5] !rounded-xl overflow-hidden bg-slate-100">
                  {pImg(p) && (
                    <img
                      src={pImg(p)}
                      alt={pName(p)}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  )}
                </div>
                <h3 className="mt-2.5 line-clamp-1 text-sm font-semibold text-[#15171C]">{pName(p)}</h3>
                <p className="mt-auto pt-1 text-sm font-bold text-[#15171C]">{money(p.price)}</p>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Editorial() {
  return (
    <section className="relative isolate overflow-hidden text-white" aria-label="Fashion collection" data-dept="fashion">
      <img src={IMG.editorial} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" loading="lazy" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#3E121C]/95 via-[#3E121C]/65 to-black/30" />
      <div className="wrap py-20 sm:py-28 lg:py-40">
        <span className="inline-flex rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
          Curated Collection
        </span>
        <h2 className="mt-4 max-w-2xl text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
          Carry your everyday elegance
        </h2>
        <p className="mt-4 max-w-lg text-base sm:text-lg text-white/90 leading-relaxed">
          Premium handbags designed for modern lifestyles. Timeless craftsmanship, durable materials, and comfortable silhouettes.
        </p>
        <Link href="/fashion/ladies-handbags" className="btn btn-light mt-8 shadow-lg">
          Shop the Handbags <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    { t: 'Free islandwide delivery', d: 'On all eligible orders', icon: Truck },
    { t: 'Hassle-free returns', d: 'Easy returns and quick refunds', icon: RotateCcw },
    { t: 'Encrypted checkout', d: '100% secure payment methods', icon: ShieldCheck },
    { t: 'Authenticity guaranteed', d: 'Only genuine products and trusted brands', icon: Award },
  ];
  return (
    <section className="sec bg-[#15171C] text-white" aria-label="Why shop with Eagle Eye View">
      <div className="wrap grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {items.map((b) => {
          const Icon = b.icon;
          return (
            <div
              key={b.t}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-start hover:bg-white/10 transition-colors"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-600/20 text-[#8FA2FF] mb-4">
                <Icon size={24} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">{b.t}</h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-400">{b.d}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   PAGE COMPONENT
──────────────────────────────────────────────────────────── */
export default function HomePage() {
  const { getCategoriesByDepartment, getBestSellers, getFeaturedProducts, getNewArrivals } = useStore();
  const eCats = getCategoriesByDepartment('electronics');
  const fCats = getCategoriesByDepartment('fashion');
  const eBest = getBestSellers('electronics').slice(0, 8);
  const eFeat = getFeaturedProducts('electronics').slice(0, 4);
  const fFeat = getFeaturedProducts('fashion');
  const fBest = getBestSellers('fashion');

  const handbags = (fBest.length ? fBest : fFeat).slice(0, 5);
  const shownFashion = new Set(handbags.map((p: Any) => p.id));
  const moreFashion = fFeat.filter((p: Any) => !shownFashion.has(p.id)).slice(0, 4);

  const fashionIds = new Set([...fFeat, ...fBest].map((p: Any) => p.id));
  const shown = new Set([...eBest, ...eFeat, ...handbags, ...moreFashion].map((p: Any) => p.id));
  const fresh = getNewArrivals().filter((p: Any) => !shown.has(p.id)).slice(0, 8);
  const brands = Array.from(new Set([...eBest, ...eFeat].map((p: Any) => p.brand).filter(Boolean))) as string[];
  const deptOf = (p: Any) => p.departmentSlug ?? p.department ?? (fashionIds.has(p.id) ? 'fashion' : 'electronics');

  return (
    <div className="hp">
      <style dangerouslySetInnerHTML={{ __html: THEME_CSS }} />

      <Hero />

      {/* Electronics Section */}
      <DeptIntro
        dept="electronics"
        eyebrow="Department of Electronics"
        title="Technology for work, entertainment, and everyday life"
        copy="Smart technology engineered to power your lifestyle. Discover laptops, audio gear, smartwatches, and smart home essentials."
        cta="Browse All Electronics"
        href="/electronics"
        image={IMG.techIntro}
        links={eCats}
      />
      <Categories dept="electronics" title="Electronics Categories" items={eCats} />
      <Brands brands={brands} />
      <Products
        title="Best Selling Electronics"
        subtitle="Customer favorites backed by top reviews."
        items={eBest}
        href="/best-sellers"
        cta="View Top Sellers"
        dept="electronics"
        tint
        carousel
      />
      <Promo cats={eCats} />
      <Products
        title="Featured Electronics"
        subtitle="Handpicked devices with cutting-edge capabilities."
        items={eFeat}
        href="/electronics"
        dept="electronics"
      />

      {/* Fashion Section */}
      <DeptIntro
        dept="fashion"
        eyebrow="Department of Fashion"
        title="Timeless style and everyday elegance"
        copy="Explore our curated Fashion collection, starting with Ladies Handbags, designed for modern elegance, comfort, and premium textures."
        cta="Browse Fashion Collection"
        href="/fashion"
        image={IMG.fashionIntro}
        links={fCats}
        reverse
      />
      <Categories dept="fashion" title="Fashion Categories" items={fCats} large />
      <Lookbook items={handbags} />
      <Products
        title="Featured Accessories"
        subtitle="Complete your wardrobe with thoughtful details."
        items={moreFashion}
        href="/fashion"
        dept="fashion"
      />
      <Editorial />

      {/* Cross-department New Arrivals */}
      <Products
        title="Fresh Arrivals"
        subtitle="The latest arrivals across both Electronics & Fashion."
        items={fresh}
        href="/new-arrivals"
        deptOf={deptOf}
      />

      <Benefits />
    </div>
  );
}