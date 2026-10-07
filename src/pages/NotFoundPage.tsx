import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="container-page py-16 lg:py-24">
      <div className="text-center max-w-lg mx-auto">
        <div className="text-8xl font-bold text-blue-100 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="btn-primary">Back to Home</Link>
          <Link to="/electronics" className="btn-secondary">Shop Electronics</Link>
          <Link to="/fashion" className="btn-secondary">Shop Fashion</Link>
        </div>
      </div>
    </div>
  );
}
