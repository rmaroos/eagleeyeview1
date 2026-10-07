import Breadcrumb from '@/components/ui/Breadcrumb';

export default function PrivacyPage() {
  const sections = [
    { title: 'Information We Collect', content: 'We collect information you provide directly to us, such as your name, email address, phone number, shipping address, and payment information when you place an order or create an account.' },
    { title: 'How We Use Your Information', content: 'We use your information to process orders, communicate with you about your orders, provide customer support, send marketing communications (with your consent), and improve our services.' },
    { title: 'Cookies', content: 'We use cookies and similar technologies to enhance your browsing experience, remember your preferences, and analyze how you use our website. You can control cookies through your browser settings.' },
    { title: 'Information Sharing', content: 'We do not sell your personal information. We may share information with trusted third parties who help us operate our business, such as payment processors and delivery partners, under appropriate confidentiality agreements.' },
    { title: 'Data Security', content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.' },
    { title: 'Your Rights', content: 'You have the right to access, correct, or delete your personal information. You can also opt out of marketing communications at any time. Contact us to exercise these rights.' },
    { title: 'Changes to This Policy', content: 'We may update this privacy policy from time to time. We will notify you of significant changes by posting the updated policy on this page with a new revision date.' },
  ];

  return (
    <div className="py-6 lg:py-8">
      <div className="container-page max-w-3xl">
        <div className="mb-6">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]} />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">Last Updated: October 2026</p>

        <div className="prose prose-sm max-w-none">
          <p className="text-gray-600 mb-8">
            This privacy policy describes how Nexus collects, uses, and protects your personal information when you use our website and services.
          </p>

          {sections.map((section) => (
            <div key={section.title} className="mb-6">
              <h2 className="font-semibold text-gray-900 mb-2">{section.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}

          <div className="mt-10 rounded-xl bg-gray-50 p-5">
            <h2 className="font-semibold text-gray-900 mb-1">Contact Us</h2>
            <p className="text-sm text-gray-600">
              If you have any questions about this privacy policy, please contact us at support@nexus-store.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
