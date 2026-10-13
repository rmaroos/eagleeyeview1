import React, { useState } from 'react';
import { useAdminStore } from '../services/store';
import { StockBadge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';
import { Boxes, AlertTriangle, Search, Plus, Save, TrendingUp } from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { products, updateProduct, formatCurrency, settings } = useAdminStore();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  // Local state for stock adjustments before committing or direct increment
  const totalStockUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const totalValuation = products.reduce((acc, p) => acc + p.stock * p.price, 0);
  const lowStockThreshold = settings.lowStockThreshold || 5;
  const lowStockItems = products.filter((p) => p.stock <= lowStockThreshold);
  const criticalItems = products.filter((p) => p.stock === 0);

  const filteredProducts = products.filter((p) => {
    if (onlyLowStock && p.stock > lowStockThreshold) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.id.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const handleStockChange = (productId: string, newStock: number) => {
    if (newStock < 0) return;
    updateProduct(productId, { stock: newStock });
    toast(`Stock updated to ${newStock} units`, 'success');
  };

  const handleQuickAdd = (productId: string, current: number, addition: number) => {
    updateProduct(productId, { stock: current + addition });
    toast(`Added +${addition} units to stock`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Inventory & Stock Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Perform bulk restocks, monitor out-of-stock items, and evaluate inventory asset values.
        </p>
      </div>

      {/* Inventory Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="admin-card p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Total Units in Stock
          </p>
          <h3 className="text-2xl font-extrabold text-white">{totalStockUnits.toLocaleString()}</h3>
          <p className="text-[11px] text-slate-500 mt-2">Across all {products.length} products</p>
        </div>

        <div className="admin-card p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Total Inventory Valuation
          </p>
          <h3 className="text-2xl font-extrabold text-emerald-400">
            {formatCurrency(totalValuation)}
          </h3>
          <p className="text-[11px] text-slate-500 mt-2">At current retail prices</p>
        </div>

        <div className="admin-card p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Low Stock Warnings
          </p>
          <h3 className="text-2xl font-extrabold text-amber-400">{lowStockItems.length}</h3>
          <p className="text-[11px] text-slate-500 mt-2">Stock &le; {lowStockThreshold} units</p>
        </div>

        <div className="admin-card p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Out of Stock
          </p>
          <h3 className="text-2xl font-extrabold text-rose-400">{criticalItems.length}</h3>
          <p className="text-[11px] text-slate-500 mt-2">Immediate restock required</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="admin-card p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by product name or SKU..."
            className="admin-input pl-10 !py-2 text-xs"
          />
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer self-start sm:self-auto bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
          <input
            type="checkbox"
            checked={onlyLowStock}
            onChange={(e) => setOnlyLowStock(e.target.checked)}
            className="rounded text-blue-600 focus:ring-0"
          />
          <span className="font-semibold">Show Low Stock Only (&le; {lowStockThreshold})</span>
        </label>
      </div>

      {/* Bulk Stock Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#141E33]/60 text-slate-400 border-b border-slate-800">
                <th className="py-3.5 px-4 font-semibold">Product</th>
                <th className="py-3.5 px-4 font-semibold">SKU</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Current Count</th>
                <th className="py-3.5 px-4 font-semibold">Stock Valuation</th>
                <th className="py-3.5 px-4 font-semibold text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0"
                      />
                      <span className="font-bold text-white line-clamp-1">{p.name}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-400">{p.id}</td>

                  <td className="py-3 px-4">
                    <StockBadge stock={p.stock} threshold={lowStockThreshold} />
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={p.stock}
                        onChange={(e) => handleStockChange(p.id, parseInt(e.target.value) || 0)}
                        className="admin-input !py-1 !px-2.5 !w-20 text-center font-bold text-white text-xs"
                      />
                      <span className="text-slate-500">units</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-semibold text-emerald-400">
                    {formatCurrency(p.stock * p.price)}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleQuickAdd(p.id, p.stock, 5)}
                        className="admin-btn-secondary !py-1 !px-2.5 !text-[11px]"
                      >
                        +5
                      </button>
                      <button
                        onClick={() => handleQuickAdd(p.id, p.stock, 10)}
                        className="admin-btn-secondary !py-1 !px-2.5 !text-[11px]"
                      >
                        +10
                      </button>
                      <button
                        onClick={() => handleQuickAdd(p.id, p.stock, 25)}
                        className="admin-btn-secondary !py-1 !px-2.5 !text-[11px] text-blue-400"
                      >
                        +25
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
