import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      <section className="relative bg-ink-950 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/196656/pexels-photo-196656.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            alt="About"
            className="w-full h-full object-cover opacity-25"
          />
        </div>
        <div className="relative container-page py-16 lg:py-24">
          <div className="max-w-2xl">
            <div className="eyebrow text-blue-300 mb-3">About Nexus</div>
            <h1 className="text-3xl lg:text-[48px] font-bold leading-tight mb-4">
              One trusted store. Two shopping worlds.
            </h1>
            <p className="text-white/70 text-lg">
              We bring premium technology and curated fashion together under one roof, delivering quality products with a seamless shopping experience.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-page max-w-3xl">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Nexus was founded with a simple idea: make premium products accessible through a trustworthy, well-designed online store. We started with Electronics — technology for work, entertainment, and everyday life — and expanded into Fashion with a carefully curated collection of Ladies Handbags.
          </p>
          <p className="text-gray-600 leading-relaxed mb-12">
            Today, we operate as one platform with two clearly separated shopping experiences. Electronics customers get technical specifications, performance details, and compatibility information. Fashion customers get editorial imagery, material details, and style guidance. Both share the same cart, checkout, and trusted service.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Shop With Us</h2>
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {[
              { title: 'Premium Products', desc: 'We curate every product to ensure quality and authenticity.' },
              { title: 'Clear Departments', desc: 'Electronics and Fashion are separate experiences, not mixed together.' },
              { title: 'Secure Checkout', desc: 'Your payment and personal information are always protected.' },
              { title: 'Easy Returns', desc: 'A simple return process gives you confidence in every purchase.' },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Two Departments</h2>
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            <div className="rounded-xl overflow-hidden border border-gray-100">
              <img
                src="https://images.pexels.com/photos/196656/pexels-photo-196656.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Electronics"
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-1">Electronics</h3>
                <p className="text-sm text-gray-500 mb-3">Technology for work, entertainment and everyday life.</p>
                <Link to="/electronics" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                  Shop Electronics <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-gray-100">
              <img
                src="https://images.pexels.com/photos/9327162/pexels-photo-9327162.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Fashion"
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-1">Fashion</h3>
                <p className="text-sm text-gray-500 mb-3">Curated style for everyday life, starting with Ladies Handbags.</p>
                <Link to="/fashion" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                  Shop Fashion <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center py-8">
            <Link to="/" className="btn-primary">Start Shopping</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
