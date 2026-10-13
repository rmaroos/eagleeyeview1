import React, { useState } from 'react';
import { useAdminStore } from '../services/store';
import { testSupabaseConnection, seedSupabaseDatabase, SUPABASE_SQL_SCHEMA } from '../services/supabase';
import { useToast } from '../components/ui/Toast';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Server,
  Key,
  Globe,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Upload,
} from 'lucide-react';

export const DatabaseSetupPage: React.FC = () => {
  const { settings, updateSettings, products, categories } = useAdminStore();
  const { toast } = useToast();

  const [supabaseUrl, setSupabaseUrl] = useState(
    settings.supabaseUrl || import.meta.env.VITE_SUPABASE_URL || ''
  );
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(
    settings.supabaseAnonKey || import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  );
  const [testing, setTesting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSeedDatabase = async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      toast('Please enter Supabase credentials first', 'error');
      return;
    }
    setSeeding(true);
    const res = await seedSupabaseDatabase(supabaseUrl, supabaseAnonKey, categories, products);
    setSeeding(false);
    if (res.success) {
      toast(res.message, 'success');
    } else {
      toast(res.message, 'error');
    }
  };

  const handleTestConnection = async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      toast('Please enter both Supabase URL and Anon Key first', 'error');
      return;
    }

    setTesting(true);
    setTestResult(null);

    const result = await testSupabaseConnection(supabaseUrl, supabaseAnonKey);
    setTesting(false);
    setTestResult(result);

    if (result.success) {
      updateSettings({
        supabaseUrl,
        supabaseAnonKey,
        useLiveSupabase: true,
      });
      toast('Connection verified & credentials saved!', 'success');
    } else {
      toast('Could not verify Supabase connection', 'error');
    }
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    toast('SQL Schema copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Supabase & Database Synchronization
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Connect this Admin Panel and your Customer Storefront to the same live PostgreSQL backend.
        </p>
      </div>

      {/* Architecture Card */}
      <div className="admin-card p-6 bg-gradient-to-br from-[#111827] via-[#141E33] to-[#0D1527] border-blue-900/40">
        <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Server size={16} />
          <span>Shared Database Architecture</span>
        </h3>
        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          Both the <strong className="text-white">Customer Storefront</strong> and this{' '}
          <strong className="text-white">Admin Management App</strong> connect to the same Supabase database.
          Any product you create or order you fulfill here is instantly synchronized live.
        </p>

        <div className="mt-5 grid sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="font-bold text-white block mb-0.5">1. Public Storefront</span>
            <span className="text-slate-400 text-[11px]">Reads products & creates customer orders</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40">
            <span className="font-bold text-blue-400 block mb-0.5">2. Central Supabase</span>
            <span className="text-slate-400 text-[11px]">Stores PostgreSQL products, categories & orders</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="font-bold text-white block mb-0.5">3. Admin Dashboard</span>
            <span className="text-slate-400 text-[11px]">Full CRUD product, order & stock management</span>
          </div>
        </div>
      </div>

      {/* Connection Credentials Form */}
      <div className="admin-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Supabase API Credentials</h3>
            <p className="text-xs text-slate-400">
              Found in your Supabase Dashboard under <strong>Project Settings &rarr; API</strong>
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              settings.useLiveSupabase
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}
          >
            {settings.useLiveSupabase ? 'Connected to Live DB' : 'Standalone Local Mode'}
          </span>
        </div>

        <div className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Supabase Project URL
            </label>
            <div className="relative">
              <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="url"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xyzabcdefghijklm.supabase.co"
                className="admin-input pl-10 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Supabase Anon Public API Key
            </label>
            <div className="relative">
              <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="admin-input pl-10 text-xs font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="admin-btn-primary !py-2 !px-4 !text-xs disabled:opacity-50"
            >
              {testing ? 'Testing Connection...' : 'Test & Save Supabase Credentials'}
            </button>
          </div>

          {testResult && (
            <div
              className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
                testResult.success
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 size={18} className="shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <AlertCircle size={18} className="shrink-0 text-rose-400 mt-0.5" />
              )}
              <div>
                <p className="font-bold">{testResult.success ? 'Success!' : 'Connection Failed'}</p>
                <p className="mt-0.5 opacity-90">{testResult.message}</p>
              </div>
            </div>
          )}

          {/* Seed Database Action */}
          <div className="pt-4 border-t border-slate-800/80">
            <h4 className="text-xs font-bold text-slate-200 mb-1">
              Upload Catalog to Supabase
            </h4>
            <p className="text-[11px] text-slate-400 mb-3">
              After executing the SQL schema below, click this button to upload all {products.length} products and {categories.length} categories directly to your Supabase tables.
            </p>
            <button
              onClick={handleSeedDatabase}
              disabled={seeding || !supabaseUrl || !supabaseAnonKey}
              className="admin-btn-secondary !py-2 !px-4 !text-xs disabled:opacity-40 flex items-center gap-2 border-emerald-500/30 hover:border-emerald-500/60 text-emerald-300"
            >
              <Upload size={14} className="text-emerald-400" />
              <span>{seeding ? 'Syncing to Supabase...' : `Sync ${products.length} Products & Categories to Supabase`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SQL Setup Script */}
      <div className="admin-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal size={17} className="text-blue-400" />
              <span>Production Supabase SQL Schema</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Copy and execute this script in your <strong>Supabase SQL Editor</strong> to create the tables and policies in seconds.
            </p>
          </div>

          <button
            onClick={handleCopySchema}
            className="admin-btn-secondary !py-2 !px-3.5 !text-xs flex items-center gap-2 self-start sm:self-auto"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
          </button>
        </div>

        <div className="relative">
          <pre className="p-4 rounded-xl bg-[#080B11] border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-72">
            <code>{SUPABASE_SQL_SCHEMA}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
