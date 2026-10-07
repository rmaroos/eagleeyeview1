import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { orderRef } = useParams();

  return (
    <div className="container-page py-12 lg:py-20">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
          <CheckCircle2 size={40} className="text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Confirmed</h1>
        <p className="text-gray-500 mb-6">Thank you for your order. We'll send you a confirmation email shortly.</p>

        <div className="rounded-xl border border-gray-200 bg-white p-6 mb-8 text-left">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
            <div>
              <div className="text-sm text-gray-500">Order Number</div>
              <div className="text-lg font-bold text-gray-900">{orderRef || 'ORD-2026-000001'}</div>
            </div>
            <Package size={32} className="text-blue-600" />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Status</span>
              <span className="font-medium text-green-600">Confirmed</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Delivery</span>
              <span className="font-medium text-gray-900">3-5 business days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Status</span>
              <span className="font-medium text-gray-900">Paid</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link to="/" className="btn-primary">
            Continue Shopping
            <ArrowRight size={18} />
          </Link>
          <Link to="/account" className="btn-secondary">
            View Account
          </Link>
        </div>
      </div>
    </div>
  );
}
