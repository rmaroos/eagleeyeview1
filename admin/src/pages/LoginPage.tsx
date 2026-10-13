import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle, Database, KeyRound } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, isSupabaseAuthConnected } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in with a valid Supabase session, redirect immediately
  React.useEffect(() => {
    if (isAuthenticated) {
      const origin = (location.state as any)?.from?.pathname || '/';
      navigate(origin, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      const origin = (location.state as any)?.from?.pathname || '/';
      navigate(origin, { replace: true });
    } else {
      setError(result.error || 'Invalid credentials. Only users created in Supabase can sign in.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 shadow-xl shadow-blue-600/25 mb-3 border border-blue-400/30">
            <span className="text-2xl font-black text-white">E</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white font-display">
            Eagle Eye View
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Admin Management Portal
            </span>
          </div>

          {/* Supabase Status Pill */}
          {isSupabaseAuthConnected ? (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-semibold text-emerald-300">
              <Database size={12} className="text-emerald-400" />
              <span>Supabase Auth Connected</span>
            </div>
          ) : (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-[11px] font-semibold text-amber-300">
              <AlertCircle size={12} className="text-amber-400" />
              <span>Supabase Not Configured</span>
            </div>
          )}
        </div>

        {/* Login Box */}
        <div className="admin-card p-6 sm:p-8 bg-[#0D121D]/90 backdrop-blur-xl border border-slate-800 shadow-2xl relative">
          <div className="mb-6 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 shrink-0 mt-0.5">
              <KeyRound size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Administrator Sign In</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Sign in with your verified Supabase administrator account.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle size={16} className="shrink-0 text-rose-400 mt-0.5" />
              <div>
                <p className="font-bold">Access Denied</p>
                <p className="mt-0.5 opacity-90">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Supabase Admin Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yourdomain.com"
                  className="admin-input pl-10 text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="admin-input pl-10 pr-10 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="admin-btn-primary w-full !py-2.5 !text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying with Supabase...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed text-center">
            🔒 Admin accounts are provisioned exclusively via the{' '}
            <strong className="text-slate-200">Supabase Dashboard</strong>. Public registration is disabled.
          </div>
        </div>

        {/* Footer Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-xs font-medium">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>Strict Supabase Authentication &amp; PostgreSQL RLS</span>
        </div>
      </div>
    </div>
  );
};
