import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';

const faqCategories = [
  {
    name: 'Shopping',
    questions: [
      { q: 'How do I place an order?', a: 'Browse products, add them to your cart, and proceed to checkout. Follow the steps to enter your contact, address, delivery and payment information.' },
      { q: 'Can I buy Electronics and Fashion in one order?', a: 'Yes. Both departments share the same cart and checkout. You can purchase products from both departments in a single order.' },
      { q: 'Do I need an account to shop?', a: 'No, you can check out as a guest. Creating an account gives you access to order history, saved addresses, and faster checkout.' },
    ],
  },
  {
    name: 'Electronics',
    questions: [
      { q: 'Are all products genuine?', a: 'Yes, all our products are sourced from authorized distributors and are 100% genuine.' },
      { q: 'Do electronics come with a warranty?', a: 'Warranty periods vary by product and brand. Check the product detail page for specific warranty information.' },
    ],
  },
  {
    name: 'Fashion',
    questions: [
      { q: 'What fashion categories are available?', a: 'Currently, our Fashion department focuses on Ladies Handbags and Accessories. Additional categories will be introduced over time.' },
      { q: 'How do I choose the right handbag?', a: 'Each product page includes material, dimensions, and bag type information to help you make the right choice.' },
    ],
  },
  {
    name: 'Payment',
    questions: [
      { q: 'What payment methods do you accept?', a: 'We accept major credit cards (Visa, Mastercard, American Express) and PayPal.' },
      { q: 'Is my payment information secure?', a: 'Yes, all payments are processed through encrypted, secure payment gateways. We never store your card details.' },
    ],
  },
  {
    name: 'Delivery',
    questions: [
      { q: 'How long does delivery take?', a: 'Standard delivery takes 3-5 business days. Express delivery is available for 1-2 business day delivery.' },
      { q: 'Do you offer free delivery?', a: 'Free delivery is available on eligible orders. See our Shipping page for details.' },
    ],
  },
  {
    name: 'Returns',
    questions: [
      { q: 'What is your return policy?', a: 'We offer returns within the return period. Items must be unused and in original packaging. See our Returns page for full details.' },
      { q: 'How do I return an item?', a: 'Contact our support team with your order number, and we will guide you through the return process.' },
    ],
  },
];

export default function FAQPage() {
  const [search, setSearch] = useState('');
  const [openCategory, setOpenCategory] = useState<string | null>(faqCategories[0].name);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const filtered = faqCategories
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (item) =>
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((cat) => cat.questions.length > 0);

  return (
    <div className="py-6 lg:py-8">
      <div className="container-page">
        <div className="mb-6">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]} />
        </div>

        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">How Can We Help?</h1>
          <div className="relative max-w-md mx-auto">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No questions found matching "{search}"
            </div>
          ) : (
            filtered.map((category) => (
              <div key={category.name} className="rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setOpenCategory(openCategory === category.name ? null : category.name)}
                  className="flex items-center justify-between w-full px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{category.name}</span>
                  <ChevronDown
                    size={20}
                    className={`text-gray-400 transition-transform ${openCategory === category.name ? 'rotate-180' : ''}`}
                  />
                </button>
                {openCategory === category.name && (
                  <div className="divide-y divide-gray-50">
                    {category.questions.map((item) => {
                      const qKey = `${category.name}-${item.q}`;
                      const isOpen = openQuestion === qKey;
                      return (
                        <div key={qKey}>
                          <button
                            onClick={() => setOpenQuestion(isOpen ? null : qKey)}
                            className="flex items-center justify-between w-full px-5 py-3.5 text-left hover:bg-gray-50 transition-colors"
                          >
                            <span className="text-sm font-medium text-gray-900">{item.q}</span>
                            <ChevronDown
                              size={16}
                              className={`text-gray-400 transition-transform shrink-0 ml-3 ${isOpen ? 'rotate-180' : ''}`}
                            />
                          </button>
                          {isOpen && (
                            <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
                              {item.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
