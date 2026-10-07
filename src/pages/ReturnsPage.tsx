import { RotateCcw, CheckCircle2, XCircle, Clock, CreditCard } from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function ReturnsPage() {
  return (
    <div className="py-6 lg:py-8">
      <div className="container-page max-w-3xl">
        <div className="mb-6">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Returns & Refunds' }]} />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Returns & Refunds</h1>
        <p className="text-gray-500 mb-10">
          We want you to be satisfied with your purchase. Here's how our return process works.
        </p>

        <div className="space-y-8">
          <div>
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <RotateCcw size={20} className="text-blue-600" />
              Return Policy
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Items can be returned within the return period from the date of delivery. Items must be unused, in their original packaging, and accompanied by the original receipt or proof of purchase.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-3">Eligibility by Department</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-100 p-5">
                <h3 className="font-medium text-gray-900 mb-2">Electronics</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" /> Products with manufacturer defects</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" /> Items damaged during delivery</li>
                  <li className="flex items-start gap-2"><XCircle size={16} className="text-red-400 shrink-0 mt-0.5" /> Used items (unless defective)</li>
                  <li className="flex items-start gap-2"><XCircle size={16} className="text-red-400 shrink-0 mt-0.5" /> Opened software or media</li>
                </ul>
              </div>
              <div className="rounded-xl border border-gray-100 p-5">
                <h3 className="font-medium text-gray-900 mb-2">Fashion</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" /> Unused items with tags attached</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" /> Items with manufacturing defects</li>
                  <li className="flex items-start gap-2"><XCircle size={16} className="text-red-400 shrink-0 mt-0.5" /> Used or worn items</li>
                  <li className="flex items-start gap-2"><XCircle size={16} className="text-red-400 shrink-0 mt-0.5" items-center /> Items without original packaging</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Clock size={20} className="text-blue-600" />
              Return Process
            </h2>
            <ol className="space-y-3">
              {[
                'Contact our support team with your order number and reason for return.',
                'Receive a return authorization and return shipping instructions.',
                'Pack the item securely in its original packaging.',
                'Ship the item using the provided return label.',
                'We inspect the returned item and process your refund or exchange.',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-sm text-gray-600 pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CreditCard size={20} className="text-blue-600" />
              Refunds
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Refunds are processed to the original payment method within a few business days of receiving and inspecting the returned item. The exact timing depends on your payment provider.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
