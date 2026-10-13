import { Truck, Clock, MapPin, Package, AlertCircle } from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function ShippingPage() {
  const sections = [
    {
      icon: MapPin,
      title: 'Delivery Areas',
      content: 'We currently deliver to all major cities and most rural areas. Delivery availability will be confirmed at checkout based on your postal code.',
    },
    {
      icon: Clock,
      title: 'Processing Time',
      content: 'Orders are processed within 1-2 business days. Orders placed on weekends or holidays are processed on the next business day.',
    },
    {
      icon: Truck,
      title: 'Delivery Methods',
      content: 'Standard Delivery: 3-5 business days. Express Delivery: 1-2 business days. Store Pickup: Available within 24 hours of order confirmation.',
    },
    {
      icon: Package,
      title: 'Delivery Fees',
      content: 'Delivery fees are calculated based on your location and selected delivery method. Free delivery is available on eligible orders above a certain value.',
    },
    {
      icon: AlertCircle,
      title: 'Failed Delivery',
      content: 'If a delivery attempt is unsuccessful, our courier will attempt to contact you to arrange a redelivery. After three failed attempts, the package will be returned to our warehouse.',
    },
  ];

  return (
    <div className="py-6 lg:py-8">
      <div className="container-page max-w-3xl">
        <div className="mb-6">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Shipping' }]} />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Shipping Information</h1>
        <p className="text-gray-500 mb-10">
          Everything you need to know about our delivery process.
        </p>

        <div className="space-y-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
                  <Icon size={24} />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 mb-1">{section.title}</h2>
                  <p className="text-gray-600 text-sm leading-relaxed">{section.content}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-xl bg-blue-50 border border-blue-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-2">Need Help?</h2>
          <p className="text-sm text-gray-600">
            If you have any questions about your delivery, please contact our support team with your order number.
          </p>
        </div>
      </div>
    </div>
  );
}
