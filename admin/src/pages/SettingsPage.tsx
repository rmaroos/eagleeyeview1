import React, { useState } from 'react';
import { useAdminStore } from '../services/store';
import { useToast } from '../components/ui/Toast';
import {
  Settings,
  Save,
  Download,
  Upload,
  RotateCcw,
  Store,
  Truck,
  ShieldAlert,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetToDefaultData, exportDatabaseJSON, importDatabaseJSON } =
    useAdminStore();
  const { toast } = useToast();

  const [form, setForm] = useState({
    storeName: settings.storeName,
    supportEmail: settings.supportEmail,
    supportPhone: settings.supportPhone,
    currencySymbol: settings.currencySymbol,
    freeShippingThreshold: settings.freeShippingThreshold,
    standardShippingFee: settings.standardShippingFee,
    lowStockThreshold: settings.lowStockThreshold,
  });

  const [importJsonText, setImportJsonText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName: form.storeName,
      supportEmail: form.supportEmail,
      supportPhone: form.supportPhone,
      currencySymbol: form.currencySymbol,
      freeShippingThreshold: Number(form.freeShippingThreshold),
      standardShippingFee: Number(form.standardShippingFee),
      lowStockThreshold: Number(form.lowStockThreshold),
    });
    toast('Store settings saved successfully!', 'success');
  };

  const handleExport = () => {
    const json = exportDatabaseJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eagle_eye_view_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Database backup exported!', 'success');
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const ok = importDatabaseJSON(importJsonText);
    if (ok) {
      toast('Database imported successfully!', 'success');
      setShowImportBox(false);
      setImportJsonText('');
    } else {
      toast('Invalid JSON backup file format', 'error');
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Are you sure you want to restore the default sample products and orders? Any custom changes will be overwritten.'
      )
    ) {
      resetToDefaultData();
      toast('Store data reset to default seed catalog!', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Store Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure business rules, shipping rates, currencies, and data backups.
        </p>
      </div>

      {/* General Settings Form */}
      <form onSubmit={handleSaveGeneral} className="admin-card p-6 space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Store size={18} className="text-blue-400" />
          <h3 className="text-base font-bold text-white">General Store Information</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Store Brand Name
            </label>
            <input
              type="text"
              value={form.storeName}
              onChange={(e) => setForm({ ...form, storeName: e.target.value })}
              className="admin-input"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Currency Symbol / Prefix
            </label>
            <input
              type="text"
              value={form.currencySymbol}
              onChange={(e) => setForm({ ...form, currencySymbol: e.target.value })}
              className="admin-input font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Customer Support Email
            </label>
            <input
              type="email"
              value={form.supportEmail}
              onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
              className="admin-input"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Customer Support Phone
            </label>
            <input
              type="text"
              value={form.supportPhone}
              onChange={(e) => setForm({ ...form, supportPhone: e.target.value })}
              className="admin-input"
              required
            />
          </div>
        </div>

        {/* Shipping & Inventory Thresholds */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Truck size={18} className="text-emerald-400" />
            <h4 className="text-sm font-bold text-white">Shipping & Inventory Rules</h4>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Standard Shipping Fee (LKR)
              </label>
              <input
                type="number"
                min="0"
                value={form.standardShippingFee}
                onChange={(e) => setForm({ ...form, standardShippingFee: Number(e.target.value) })}
                className="admin-input"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Free Shipping Minimum (LKR)
              </label>
              <input
                type="number"
                min="0"
                value={form.freeShippingThreshold}
                onChange={(e) => setForm({ ...form, freeShippingThreshold: Number(e.target.value) })}
                className="admin-input"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Low Stock Threshold (Units)
              </label>
              <input
                type="number"
                min="1"
                value={form.lowStockThreshold}
                onChange={(e) => setForm({ ...form, lowStockThreshold: Number(e.target.value) })}
                className="admin-input"
                required
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button type="submit" className="admin-btn-primary">
            <Save size={15} />
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>

      {/* Backup and Maintenance */}
      <div className="admin-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Data Backup & Maintenance</h3>
            <p className="text-xs text-slate-400">
              Export full product catalog and customer orders to JSON, or restore default values.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button onClick={handleExport} className="admin-btn-secondary !text-xs !py-2">
            <Download size={14} />
            <span>Export Database JSON</span>
          </button>

          <button
            onClick={() => setShowImportBox(!showImportBox)}
            className="admin-btn-secondary !text-xs !py-2"
          >
            <Upload size={14} />
            <span>Import Database JSON</span>
          </button>

          <button
            onClick={handleReset}
            className="admin-btn-secondary !text-xs !py-2 hover:text-rose-400 hover:border-rose-500/40"
          >
            <RotateCcw size={14} />
            <span>Reset to Factory Defaults</span>
          </button>
        </div>

        {showImportBox && (
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Paste Backup JSON Data:
            </label>
            <textarea
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              rows={4}
              placeholder="Paste JSON content here..."
              className="admin-input font-mono text-xs"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowImportBox(false)}
                className="admin-btn-secondary !py-1 !text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                className="admin-btn-primary !py-1 !text-xs"
              >
                Restore From JSON
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
