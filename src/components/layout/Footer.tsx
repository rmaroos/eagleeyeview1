import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Instagram, Facebook, Twitter, Youtube, ChevronDown, Send } from 'lucide-react';
import { useStore } from '@/store/StoreContext';

const footerSections = [
  {
    title: 'Shop',
    links: [
      { label: 'Electronics', href: '/electronics' },
      { label: 'Fashion', href: '/fashion' },
      { label: 'New Arrivals', href: '/new-arrivals' },
      { label: 'Best Sellers', href: '/best-sellers' },
      { label: 'Deals', href: '/deals' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Shipping', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
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
      showToast('Subscribed! Check your inbox for updates.', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-ink-950 text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="container-page py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-semibold mb-2">Stay in the loop</h3>
            <p className="text-gray-400 mb-6">
              Get updates on new arrivals, offers and useful product guides.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 h-12 px-4 rounded-lg bg-white/10 border border-white/15 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="btn-primary px-6">
                Subscribe
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-page py-14">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg">
                N
              </div>
              <span className="text-xl font-bold tracking-tight">NEXUS</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              One trusted store. Two clearly separated shopping worlds. Premium technology and fashion, delivered with care.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-blue-600 transition-colors"
                  aria-label="Social media link"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Footer links - desktop */}
          <div className="hidden lg:grid grid-cols-4 col-span-4 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer links - mobile accordion */}
          <div className="lg:hidden col-span-1">
            {footerSections.map((section) => (
              <div key={section.title} className="border-b border-white/10">
                <button
                  onClick={() => setOpenSection(openSection === section.title ? null : section.title)}
                  className="flex items-center justify-between w-full py-4 font-semibold"
                >
                  {section.title}
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${openSection === section.title ? 'rotate-180' : ''}`}
                  />
                </button>
                {openSection === section.title && (
                  <ul className="pb-4 space-y-2">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link to={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
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

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-page py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Nexus. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">We accept</span>
              <div className="flex items-center gap-2">
                {['VISA', 'MC', 'AMEX', 'PayPal'].map((method) => (
                  <div
                    key={method}
                    className="px-2.5 py-1 rounded bg-white/10 text-[10px] font-semibold text-gray-300"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
