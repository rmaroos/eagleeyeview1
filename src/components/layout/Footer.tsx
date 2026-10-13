import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Instagram, Facebook, Twitter, Youtube, ChevronDown, Send } from 'lucide-react';
import { useStore } from '@/store/StoreContext';

const footerSections = [
  {
    title: 'Catalog',
    links: [
      { label: 'Electronics', href: '/electronics' },
      { label: 'Fashion & Handbags', href: '/fashion' },
      { label: 'New Arrivals', href: '/new-arrivals' },
      { label: 'Best Sellers', href: '/best-sellers' },
      { label: 'Special Deals', href: '/deals' },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { label: 'Shipping Policy', href: '/shipping' },
      { label: 'Returns & Refunds', href: '/returns' },
      { label: 'FAQs & Help', href: '/faq' },
      { label: 'Contact Support', href: '/contact' },
    ],
  },
  {
    title: 'About Eagle Eye View',
    links: [
      { label: 'Our Story', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Legal & Privacy',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

export default function Footer() {
  const { showToast } = useStore();
  const [email, setEmail] = useState('');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      showToast('Thank you! You are now subscribed to our newsletter.', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#15171C] text-white border-t border-white/10">
      {/* Newsletter signup section */}
      <div className="border-b border-white/10">
        <div className="container-page py-10 sm:py-14">
          <div className="max-w-xl mx-auto text-center">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#8FA2FF] mb-2">
              Stay in the loop
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold mb-3 text-white">
              Subscribe for exclusive offers
            </h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Receive updates on flash discounts, new technology drops, and designer fashion releases.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 h-11 px-4 rounded-full bg-white/10 border border-white/15 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2347F5] focus:bg-white/15 transition-all"
              />
              <button type="submit" className="btn-primary h-11 px-6 text-xs sm:text-sm font-bold shrink-0">
                <span>Subscribe</span>
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main navigation columns */}
      <div className="container-page py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group" aria-label="Eagle Eye View home">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-[#15171C] text-base font-extrabold shadow-sm">
                E
              </span>
              <span className="font-display text-xl font-extrabold tracking-tight text-white">
                Eagle Eye View
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6">
              One trusted destination with two distinct retail worlds: precision electronics and timeless fashion accessories, delivered with islandwide care.
            </p>
            <div className="flex items-center gap-2.5">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-[#2347F5] transition-colors"
                  aria-label="Social link"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links - Desktop (hidden on mobile) */}
          <div className="hidden lg:grid grid-cols-4 col-span-8 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="font-display font-bold mb-4 text-xs uppercase tracking-wider text-white">
                  {section.title}
                </h4>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Links - Mobile Accordion */}
          <div className="lg:hidden col-span-1 divide-y divide-white/10 border-t border-b border-white/10">
            {footerSections.map((section) => (
              <div key={section.title} className="py-1">
                <button
                  onClick={() => setOpenSection(openSection === section.title ? null : section.title)}
                  className="flex items-center justify-between w-full py-3.5 text-sm font-semibold text-white"
                >
                  <span>{section.title}</span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${
                      openSection === section.title ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openSection === section.title && (
                  <ul className="pb-3 pl-1 space-y-2.5">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.href}
                          className="block text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Legal / Copyright Bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="container-page py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} Eagle Eye View Inc. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <span>Secure Payment Partners:</span>
              <div className="flex items-center gap-1.5">
                {['VISA', 'Mastercard', 'AMEX', 'PayPal'].map((method) => (
                  <span
                    key={method}
                    className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold text-gray-300 border border-white/10"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
