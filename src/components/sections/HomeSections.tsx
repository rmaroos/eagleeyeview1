import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import CategoryCard from '@/components/commerce/CategoryCard';
import ProductGrid from '@/components/commerce/ProductGrid';
import type { Category, Product } from '@/data/catalog';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

export function SectionHeader({ eyebrow, title, subtitle, viewAllHref, viewAllLabel = 'View All' }: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
      <div>
        {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="text-gray-500 mt-2 max-w-xl">{subtitle}</p>}
      </div>
      {viewAllHref && (
        <Link
          to={viewAllHref}
          className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors shrink-0"
        >
          {viewAllLabel} <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}

export function CategorySection({
  title,
  subtitle,
  categories,
  viewAllHref,
  large = false,
}: {
  title: string;
  subtitle?: string;
  categories: Category[];
  viewAllHref?: string;
  large?: boolean;
}) {
  return (
    <section className="py-12 lg:py-16">
      <div className="container-page">
        <SectionHeader title={title} subtitle={subtitle} viewAllHref={viewAllHref} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} large={large} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductSection({
  eyebrow,
  title,
  subtitle,
  products,
  viewAllHref,
  variant,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  variant?: 'electronics' | 'fashion';
}) {
  return (
    <section className="py-12 lg:py-16">
      <div className="container-page">
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} viewAllHref={viewAllHref} />
        <ProductGrid products={products} variant={variant} />
      </div>
    </section>
  );
}

export function PromoBanner({
  eyebrow,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  image,
  bgClass = 'bg-gradient-to-br from-blue-700 to-blue-900',
  textColor = 'text-white',
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  bgClass?: string;
  textColor?: string;
  reverse?: boolean;
}) {
  return (
    <section className="py-12 lg:py-16">
      <div className="container-page">
        <div className={`rounded-2xl overflow-hidden ${bgClass} ${textColor}`}>
          <div className={`grid lg:grid-cols-2 ${reverse ? 'lg:[direction:rtl]' : ''}`}>
            <div className={`p-10 lg:p-16 flex flex-col justify-center ${reverse ? 'lg:[direction:ltr]' : ''}`}>
              <div className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-300 mb-3">
                {eyebrow}
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-3">{title}</h2>
              <p className="text-white/80 mb-6 max-w-md">{subtitle}</p>
              <div>
                <Link to={ctaHref} className="btn bg-white text-blue-700 hover:bg-blue-50">
                  {ctaLabel}
                </Link>
              </div>
            </div>
            <div className={`relative aspect-[4/3] lg:aspect-auto ${reverse ? 'lg:[direction:ltr]' : ''}`}>
              <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DepartmentIntro({
  eyebrow,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  image,
  bgClass = 'bg-ink-50',
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  bgClass?: string;
}) {
  return (
    <section className={`py-16 lg:py-20 ${bgClass}`}>
      <div className="container-page">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="eyebrow mb-3">{eyebrow}</div>
            <h2 className="text-3xl lg:text-[40px] font-bold leading-tight mb-4">{title}</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-md">{subtitle}</p>
            <Link to={ctaHref} className="btn-primary">
              {ctaLabel}
            </Link>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <img src={image} alt={title} className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function BenefitsSection() {
  const benefits = [
    { icon: 'Truck', title: 'Free Shipping', desc: 'On eligible orders' },
    { icon: 'ShieldCheck', title: 'Secure Payment', desc: 'Safe checkout process' },
    { icon: 'RotateCcw', title: 'Easy Returns', desc: 'Simple return process' },
    { icon: 'Headphones', title: 'Online Support', desc: 'Customer support team' },
  ];

  return (
    <section className="py-12 lg:py-16 border-t border-gray-100">
      <div className="container-page">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-3">
                  <IconRenderer name={Icon} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                <p className="text-sm text-gray-500">{benefit.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function IconRenderer({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    Truck: <TruckIcon />,
    ShieldCheck: <ShieldIcon />,
    RotateCcw: <RotateIcon />,
    Headphones: <HeadphonesIcon />,
  };
  return icons[name] || null;
}

function TruckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );
}
function RotateIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
    </svg>
  );
}
function HeadphonesIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a1 1 0 0 1-1-1zm18 0h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2a1 1 0 0 0 1-1z" /><path d="M21 14a9 9 0 0 0-18 0" />
    </svg>
  );
}

export function EditorialBanner({
  image,
  eyebrow,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
}: {
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <section className="py-12 lg:py-16">
      <div className="container-page">
        <div className="grid lg:grid-cols-2 rounded-2xl overflow-hidden">
          <div className="relative aspect-[4/3] lg:aspect-auto min-h-[300px]">
            <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="bg-ink-950 text-white p-10 lg:p-16 flex flex-col justify-center">
            <div className="text-sm font-semibold uppercase tracking-[0.15em] text-gray-400 mb-3">
              {eyebrow}
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">{title}</h2>
            <p className="text-gray-400 mb-8 max-w-md">{subtitle}</p>
            <div>
              <Link to={ctaHref} className="btn bg-white text-ink-950 hover:bg-gray-100">
                {ctaLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
