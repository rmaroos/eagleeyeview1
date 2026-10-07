import Breadcrumb from '@/components/ui/Breadcrumb';

export default function TermsPage() {
  const sections = [
    { title: 'Acceptance of Terms', content: 'By accessing and using our website, you accept and agree to be bound by these terms and conditions. If you do not agree, please do not use our services.' },
    { title: 'Accounts', content: 'When you create an account, you are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.' },
    { title: 'Products and Pricing', content: 'We strive to display accurate product information and pricing. However, errors may occur. We reserve the right to correct errors and update product information at any time.' },
    { title: 'Orders', content: 'All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order. Payment must be received before orders are processed.' },
    { title: 'Payments', content: 'We accept major credit cards and PayPal. Payment is processed through secure third-party payment gateways. We do not store your card details.' },
    { title: 'Delivery', content: 'Delivery times are estimates and not guaranteed. We are not liable for delays caused by couriers or circumstances beyond our control. See our Shipping page for details.' },
    { title: 'Returns', content: 'Returns are subject to our return policy. Items must meet eligibility criteria. See our Returns & Refunds page for full details.' },
    { title: 'Intellectual Property', content: 'All content on this website, including text, graphics, logos, and images, is the property of Nexus or its licensors and is protected by intellectual property laws.' },
    { title: 'Limitation of Liability', content: 'To the maximum extent permitted by law, Nexus shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.' },
    { title: 'Governing Law', content: 'These terms shall be governed by and construed in accordance with applicable local laws. Any disputes shall be subject to the exclusive jurisdiction of the local courts.' },
  ];

  return (
    <div className="py-6 lg:py-8">
      <div className="container-page max-w-3xl">
        <div className="mb-6">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Terms & Conditions' }]} />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Terms & Conditions</h1>
        <p className="text-sm text-gray-400 mb-10">Last Updated: October 2026</p>

        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-semibold text-gray-900 mb-2">{section.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl bg-gray-50 p-5">
          <h2 className="font-semibold text-gray-900 mb-1">Contact Us</h2>
          <p className="text-sm text-gray-600">
            If you have any questions about these terms, please contact us at support@nexus-store.com.
          </p>
        </div>
      </div>
    </div>
  );
}
