import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function ContactPage() {
  const { showToast } = useStore();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', orderNumber: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Message sent! We will get back to you soon.', 'success');
    setForm({ name: '', email: '', phone: '', subject: '', message: '', orderNumber: '' });
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'support@nexus-store.com' },
    { icon: Phone, label: 'Phone', value: '+94 77 123 4567' },
    { icon: MapPin, label: 'Address', value: 'Colombo, Sri Lanka' },
    { icon: Clock, label: 'Hours', value: 'Mon - Sat: 9AM - 6PM' },
  ];

  return (
    <div className="py-6 lg:py-8">
      <div className="container-page">
        <div className="mb-6">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Get in Touch</h1>
        <p className="text-gray-500 mb-8">We're here to help. Reach out with any questions or concerns.</p>

        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8">
          {/* Contact info */}
          <div className="space-y-4">
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <div key={info.label} className="flex items-start gap-4 rounded-xl border border-gray-100 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{info.label}</div>
                    <div className="text-sm text-gray-500">{info.value}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact form */}
          <div className="rounded-xl border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input-field"
                    placeholder="+94 77 123 4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Order Number (optional)</label>
                  <input
                    type="text"
                    value={form.orderNumber}
                    onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
                    className="input-field"
                    placeholder="ORD-2026-000001"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="input-field"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-[15px] text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>
              <button type="submit" className="btn-primary">
                <Send size={18} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
