import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

interface Slide {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  primaryHref: string;
  secondaryCta?: string;
  secondaryHref?: string;
  image: string;
  thumb: string;
  gradient: string;
}

const slides: Slide[] = [
  {
    eyebrow: 'Tech That Moves With You',
    title: 'Powering Your Digital Lifestyle',
    subtitle: 'Discover premium technology designed for work, entertainment, and everyday life.',
    primaryCta: 'Shop Electronics',
    primaryHref: '/electronics',
    secondaryCta: 'Explore Deals',
    secondaryHref: '/deals',
    image: 'https://images.pexels.com/photos/196656/pexels-photo-196656.jpeg?auto=compress&cs=tinysrgb&w=1920',
    thumb: 'https://images.pexels.com/photos/8533587/pexels-photo-8533587.jpeg?auto=compress&cs=tinysrgb&w=600',
    gradient: 'from-blue-950/95 via-blue-900/80 to-blue-800/50',
  },
  {
    eyebrow: 'New Arrivals',
    title: 'Designed for Everyday Performance',
    subtitle: 'The latest laptops, earbuds, and smart watches — engineered for the way you live.',
    primaryCta: 'Shop New Arrivals',
    primaryHref: '/new-arrivals',
    image: 'https://images.pexels.com/photos/8533587/pexels-photo-8533587.jpeg?auto=compress&cs=tinysrgb&w=1920',
    thumb: 'https://images.pexels.com/photos/196656/pexels-photo-196656.jpeg?auto=compress&cs=tinysrgb&w=600',
    gradient: 'from-slate-950/95 via-slate-900/80 to-blue-950/50',
  },
  {
    eyebrow: 'Special Offer',
    title: 'Premium Tech At Special Prices',
    subtitle: 'Save on selected electronics for a limited time. Up to 20% off top brands.',
    primaryCta: 'View Deals',
    primaryHref: '/deals',
    image: 'https://images.pexels.com/photos/33298188/pexels-photo-33298188.jpeg?auto=compress&cs=tinysrgb&w=1920',
    thumb: 'https://images.pexels.com/photos/33298188/pexels-photo-33298188.jpeg?auto=compress&cs=tinysrgb&w=600',
    gradient: 'from-cyan-950/95 via-blue-900/80 to-teal-800/50',
  },
  {
    eyebrow: 'New Fashion Collection',
    title: 'Carry Your Everyday Style',
    subtitle: 'Discover our curated ladies handbag collection — crafted for elegance and convenience.',
    primaryCta: 'Shop Fashion',
    primaryHref: '/fashion',
    image: 'https://images.pexels.com/photos/21897309/pexels-photo-21897309.jpeg?auto=compress&cs=tinysrgb&w=1920',
    thumb: 'https://images.pexels.com/photos/10919291/pexels-photo-10919291.jpeg?auto=compress&cs=tinysrgb&w=600',
    gradient: 'from-stone-950/95 via-neutral-900/80 to-zinc-800/50',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slide = slides[current];

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, 5500);
    return () => clearInterval(interval);
  }, [next, isPaused]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [next, prev]);

  return (
    <section
      className="relative h-[600px] lg:h-[680px] overflow-hidden bg-ink-950"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Promotional slides"
    >
      {/* Full-bleed background image per slide */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={s.image} alt="" className="w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-r ${s.gradient}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      ))}

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Content */}
      <div className="relative h-full container-page flex items-center">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 items-center w-full">
          {/* Text */}
          <div key={`text-${current}`} className="animate-fade-in max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 mb-6 ring-1 ring-white/15">
              <Sparkles size={14} className="text-blue-300" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
                {slide.eyebrow}
              </span>
            </div>

            <h1 className="text-[40px] sm:text-5xl lg:text-[68px] font-bold leading-[1.02] tracking-tight text-white mb-6">
              {slide.title}
            </h1>

            <p className="text-lg lg:text-xl text-white/65 mb-8 max-w-lg leading-relaxed font-light">
              {slide.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={slide.primaryHref}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-[15px] font-semibold text-gray-900 hover:bg-blue-50 transition-all hover:shadow-2xl hover:shadow-blue-500/30"
              >
                {slide.primaryCta}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              {slide.secondaryCta && (
                <Link
                  to={slide.secondaryHref!}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md px-8 py-4 text-[15px] font-semibold text-white hover:bg-white/15 transition-all"
                >
                  {slide.secondaryCta}
                </Link>
              )}
            </div>
          </div>

          {/* Floating product thumbnail card */}
          <div key={`card-${current}`} className="hidden lg:flex justify-end animate-fade-in">
            <div className="relative">
              <div className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-white/5 to-white/10 blur-2xl" />
              <div className="relative w-72 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/15 backdrop-blur-sm">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={slide.thumb} alt={slide.title} className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="text-xs font-semibold uppercase tracking-wider text-blue-300 mb-1">{slide.eyebrow}</div>
                  <div className="text-sm font-medium text-white">Explore the collection</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators + controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
        <button onClick={prev} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/25 transition-all" aria-label="Previous slide">
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${i === current ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/50'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button onClick={next} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/25 transition-all" aria-label="Next slide">
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
