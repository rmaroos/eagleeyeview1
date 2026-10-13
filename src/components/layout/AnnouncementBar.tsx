import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const messages = [
  { icon: Truck, text: 'Free delivery on eligible orders across the island' },
  { icon: ShieldCheck, text: 'Secure payments, 100% genuine products, easy returns' },
  { icon: Sparkles, text: 'New season arrivals are here', cta: 'Shop new arrivals', href: '/new-arrivals' },
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = messages.length;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % total), 4500);
    return () => clearInterval(t);
  }, [paused, total]);

  const go = (d: number) => setIndex((i) => (i + d + total) % total);

  return (
    <div
      className="relative h-9 bg-[#15171C] text-white text-xs select-none border-b border-white/10 overflow-hidden"
      role="region"
      aria-label="Store announcements"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="container-page h-full flex items-center justify-between relative">
        <div className="flex-1 relative h-full flex items-center justify-center overflow-hidden">
          {messages.map((m, i) => {
            const Icon = m.icon;
            const on = i === index;
            return (
              <div
                key={m.text}
                className={`absolute inset-0 flex items-center justify-center gap-2 px-4 transition-all duration-500 ease-out ${
                  on
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 -translate-y-3 pointer-events-none'
                }`}
                aria-hidden={!on}
              >
                <Icon size={13} className="shrink-0 text-[#8FA2FF]" aria-hidden />
                <span className="truncate font-medium text-slate-200">{m.text}</span>
                {m.href && (
                  <Link
                    to={m.href}
                    tabIndex={on ? 0 : -1}
                    className="shrink-0 font-semibold text-white underline underline-offset-4 hover:text-[#8FA2FF] transition-colors"
                  >
                    {m.cta}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        <div className="hidden sm:flex items-center gap-1 z-10 shrink-0">
          <button
            onClick={() => go(-1)}
            className="grid h-6 w-6 place-items-center rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Previous announcement"
          >
            <ChevronLeft size={13} />
          </button>
          <span className="text-[10px] text-white/40 tabular-nums font-mono px-0.5">
            {index + 1}/{total}
          </span>
          <button
            onClick={() => go(1)}
            className="grid h-6 w-6 place-items-center rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Next announcement"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}