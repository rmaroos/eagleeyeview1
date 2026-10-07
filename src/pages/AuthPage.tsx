import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { useStore } from '@/store/StoreContext';

interface AuthPageProps {
  mode: 'login' | 'register' | 'forgot';
}

export default function AuthPage({ mode }: AuthPageProps) {
  const { showToast } = useStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const titles = {
    login: { title: 'Welcome Back', subtitle: 'Sign in to your account to continue.', cta: 'Sign In' },
    register: { title: 'Create Account', subtitle: 'Join us and start shopping.', cta: 'Create Account' },
    forgot: { title: 'Forgot Password?', subtitle: 'Enter your email to receive a reset link.', cta: 'Send Reset Link' },
  };

  const config = titles[mode];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(
      mode === 'login' ? 'Signed in successfully' : mode === 'register' ? 'Account created successfully' : 'Reset link sent to your email',
      'success'
    );
    navigate('/');
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xl">
              N
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900">NEXUS</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{config.title}</h1>
          <p className="text-gray-500 text-sm">{config.subtitle}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" required className="input-field pl-10" placeholder="John Doe" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" required className="input-field pl-10" placeholder="you@example.com" />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" className="input-field pl-10" placeholder="+94 77 123 4567" />
                </div>
              </div>
            )}

            {mode !== 'forgot' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="input-field pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="password" required className="input-field pl-10" placeholder="••••••••" />
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary w-full">{config.cta}</button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center text-sm">
            {mode === 'login' && (
              <>
                <Link to="/forgot-password" className="text-blue-600 hover:underline block mb-2">
                  Forgot password?
                </Link>
                <span className="text-gray-500">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-blue-600 hover:underline font-medium">
                    Create Account
                  </Link>
                </span>
              </>
            )}
            {mode === 'register' && (
              <span className="text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:underline font-medium">
                  Sign In
                </Link>
              </span>
            )}
            {mode === 'forgot' && (
              <Link to="/login" className="text-blue-600 hover:underline">
                Back to Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
