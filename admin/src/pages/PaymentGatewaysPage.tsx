import React, { useState } from 'react';
import { useAdminStore } from '../services/store';
import { useToast } from '../components/ui/Toast';
import { PaymentGatewayConfig, PaymentGatewayId } from '../types';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Eye,
  EyeOff,
  Save,
  Copy,
  ExternalLink,
  Zap,
  Globe,
  Truck,
  Sparkles,
} from 'lucide-react';

const GATEWAY_METADATA: Record<
  PaymentGatewayId,
  {
    title: string;
    badge: string;
    accent: string;
    methods: string[];
    docsUrl: string;
    portalName: string;
  }
> = {
  payhere: {
    title: 'PayHere (Sri Lanka)',
    badge: 'Sri Lanka #1 Gateway',
    accent: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
    methods: ['Visa', 'MasterCard', 'AMEX', 'FriMi', 'Genie', 'eZ Cash', 'mCash', 'Sampath Vishwa'],
    docsUrl: 'https://support.payhere.lk',
    portalName: 'PayHere Merchant Portal',
  },
  webxpay: {
    title: 'WEBXPAY',
    badge: 'LankaQR & Multi-Bank',
    accent: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
    methods: ['LankaQR', 'Visa', 'MasterCard', 'Diners', 'UnionPay', 'DFCC Virtual', 'HNB Momo'],
    docsUrl: 'https://webxpay.com/developer/',
    portalName: 'WEBXPAY Merchant Dashboard',
  },
  paypal: {
    title: 'PayPal Global',
    badge: 'International Payments',
    accent: 'border-sky-500/40 bg-sky-500/10 text-sky-400',
    methods: ['PayPal Wallet', 'International Visa', 'MasterCard', 'Discover', 'American Express'],
    docsUrl: 'https://developer.paypal.com/dashboard',
    portalName: 'PayPal Developer Dashboard',
  },
  cod: {
    title: 'Cash on Delivery (COD)',
    badge: 'Manual Cash Handling',
    accent: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
    methods: ['Cash on Courier Delivery', 'Exact Change Expected'],
    docsUrl: '',
    portalName: 'Direct Cash Delivery',
  },
};

export const PaymentGatewaysPage: React.FC = () => {
  const { paymentGateways, updatePaymentGateway } = useAdminStore();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<PaymentGatewayId>('payhere');
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [showSql, setShowSql] = useState(false);

  // Local form state for selected gateway
  const selectedGateway = paymentGateways.find((g) => g.id === activeTab) || paymentGateways[0];
  const [formData, setFormData] = useState<PaymentGatewayConfig>(selectedGateway);

  // Sync formData when tab changes
  const handleTabChange = (id: PaymentGatewayId) => {
    setActiveTab(id);
    const gw = paymentGateways.find((g) => g.id === id);
    if (gw) {
      setFormData(gw);
    }
  };

  const toggleSecretVisibility = (fieldKey: string) => {
    setShowSecrets((prev) => ({ ...prev, [fieldKey]: !prev[fieldKey] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentGateway(formData.id, formData);
    toast(`${formData.name} settings saved successfully!`, 'success');
  };

  const meta = GATEWAY_METADATA[activeTab];

  const sqlSnippet = `-- Optional: Run in Supabase SQL Editor if payment_gateways table is not created yet
CREATE TABLE IF NOT EXISTS public.payment_gateways (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    enabled BOOLEAN DEFAULT false,
    mode TEXT DEFAULT 'sandbox' CHECK (mode IN ('sandbox', 'live')),
    merchant_id TEXT,
    public_key TEXT,
    secret_key TEXT,
    client_id TEXT,
    currency TEXT DEFAULT 'LKR',
    instructions TEXT,
    usd_rate NUMERIC DEFAULT 310,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Payment Gateways Read" ON public.payment_gateways;
DROP POLICY IF EXISTS "Payment Gateways Management" ON public.payment_gateways;
CREATE POLICY "Public Payment Gateways Read" ON public.payment_gateways FOR SELECT USING (true);
CREATE POLICY "Payment Gateways Management" ON public.payment_gateways FOR ALL USING (true);
`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSnippet);
    toast('SQL schema copied to clipboard!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <CreditCard className="text-blue-500" />
            Payment Gateway Integration
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure real online payment gateways for your customer storefront.
          </p>
        </div>

        <button
          onClick={() => setShowSql(!showSql)}
          className="admin-btn-secondary !text-xs !py-2 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles size={14} className="text-blue-400" />
          <span>{showSql ? 'Hide SQL Script' : 'Supabase SQL Script'}</span>
        </button>
      </div>

      {/* SQL Script Box (Optional Helper) */}
      {showSql && (
        <div className="admin-card p-5 border-blue-500/30 bg-blue-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck size={16} className="text-blue-400" />
              Database Table Definition (Supabase SQL)
            </h3>
            <button onClick={copySql} className="admin-btn-secondary !py-1 !text-xs flex items-center gap-1">
              <Copy size={13} />
              <span>Copy SQL</span>
            </button>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            If your Supabase database does not have the <code className="text-blue-300">payment_gateways</code> table yet, copy and run this in your Supabase SQL Editor.
          </p>
          <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-48">
            {sqlSnippet}
          </pre>
        </div>
      )}

      {/* Gateway Selection Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {paymentGateways.map((gw) => {
          const isSelected = gw.id === activeTab;
          const gm = GATEWAY_METADATA[gw.id];
          return (
            <button
              key={gw.id}
              type="button"
              onClick={() => handleTabChange(gw.id)}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-850 border-blue-500/80 shadow-lg shadow-blue-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${gm.accent}`}>
                  {gm.badge}
                </span>
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    gw.enabled ? 'bg-emerald-400 ring-4 ring-emerald-400/20' : 'bg-slate-600'
                  }`}
                  title={gw.enabled ? 'Enabled' : 'Disabled'}
                />
              </div>

              <div className="text-sm font-bold text-white tracking-tight">{gw.name}</div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                {gw.enabled ? (
                  <span className="text-emerald-400 font-medium">● Active ({gw.mode.toUpperCase()})</span>
                ) : (
                  <span className="text-slate-500">○ Disabled in Storefront</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Gateway Configuration Card */}
      <form onSubmit={handleSave} className="admin-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white">{meta.title} Configuration</h2>
              {formData.enabled ? (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  Active
                </span>
              ) : (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold border border-slate-700">
                  Inactive
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">{formData.description}</p>
          </div>

          {meta.docsUrl && (
            <a
              href={meta.docsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold self-start sm:self-auto"
            >
              <span>{meta.portalName}</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>

        {/* Global Controls: Enabled & Mode */}
        <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-white block">Enable on Storefront</span>
              <span className="text-xs text-slate-400">
                Show this payment option to customers during checkout.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {formData.id !== 'cod' && (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-white block">Environment Mode</span>
                <span className="text-xs text-slate-400">
                  Use Sandbox for testing without real charges.
                </span>
              </div>
              <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, mode: 'sandbox' })}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                    formData.mode === 'sandbox'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sandbox (Test)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, mode: 'live' })}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                    formData.mode === 'live'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Live (Production)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* PayHere Specific Fields */}
        {formData.id === 'payhere' && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  PayHere Merchant ID <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.merchantId || ''}
                  onChange={(e) => setFormData({ ...formData, merchantId: e.target.value })}
                  placeholder="e.g. 1211149"
                  className="admin-input"
                  required={formData.enabled}
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Default Sandbox ID is <code className="text-slate-400">1211149</code>. Replace with your live merchant ID.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  PayHere Merchant Secret <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showSecrets['payhere_secret'] ? 'text' : 'password'}
                    value={formData.secretKey || ''}
                    onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                    placeholder="Enter PayHere merchant secret"
                    className="admin-input pr-10"
                    required={formData.enabled}
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecretVisibility('payhere_secret')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showSecrets['payhere_secret'] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Found in your PayHere Dashboard &rarr; Settings &rarr; Domains &amp; Credentials.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Charge Currency
              </label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="admin-input font-bold max-w-xs"
              />
            </div>
          </div>
        )}

        {/* WEBXPAY Specific Fields */}
        {formData.id === 'webxpay' && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  WEBXPAY Public / App Key <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.publicKey || ''}
                  onChange={(e) => setFormData({ ...formData, publicKey: e.target.value })}
                  placeholder="e.g. WX-PUBLIC-KEY-..."
                  className="admin-input"
                  required={formData.enabled}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  WEBXPAY Secret Key <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showSecrets['webxpay_secret'] ? 'text' : 'password'}
                    value={formData.secretKey || ''}
                    onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                    placeholder="Enter WEBXPAY secret key"
                    className="admin-input pr-10"
                    required={formData.enabled}
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecretVisibility('webxpay_secret')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showSecrets['webxpay_secret'] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Processing Currency
              </label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="admin-input font-bold max-w-xs"
              />
            </div>
          </div>
        )}

        {/* PayPal Specific Fields */}
        {formData.id === 'paypal' && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  PayPal REST App Client ID <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.clientId || ''}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  placeholder="e.g. sb or live-client-id"
                  className="admin-input"
                  required={formData.enabled}
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Default sandbox testing ID is <code className="text-slate-400">sb</code>.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  PayPal Secret (Optional for client SDK)
                </label>
                <div className="relative">
                  <input
                    type={showSecrets['paypal_secret'] ? 'text' : 'password'}
                    value={formData.secretKey || ''}
                    onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                    placeholder="Enter PayPal secret"
                    className="admin-input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecretVisibility('paypal_secret')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showSecrets['paypal_secret'] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  PayPal Currency (e.g. USD)
                </label>
                <input
                  type="text"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="admin-input font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  LKR to USD Conversion Rate (1 USD = X LKR)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  value={formData.usdRate || 310}
                  onChange={(e) => setFormData({ ...formData, usdRate: Number(e.target.value) })}
                  className="admin-input"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  PayPal charges in USD. Cart total in LKR is divided by this rate.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* COD Specific Fields */}
        {formData.id === 'cod' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Customer Delivery Instructions
              </label>
              <textarea
                value={formData.instructions || ''}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                rows={3}
                placeholder="Instructions displayed to customer during checkout..."
                className="admin-input text-xs"
              />
            </div>
          </div>
        )}

        {/* Supported Payment Channels Preview */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs font-bold text-slate-300 mb-2">Supported Payment Channels:</div>
          <div className="flex flex-wrap gap-2">
            {meta.methods.map((method) => (
              <span
                key={method}
                className="text-xs font-medium px-3 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700/60"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button type="submit" className="admin-btn-primary flex items-center gap-2">
            <Save size={16} />
            <span>Save {formData.name} Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
