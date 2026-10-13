import React from 'react';
import { useAdminStore } from '../../services/store';
import { AlertTriangle, Plus, Package } from 'lucide-react';
import { useToast } from '../ui/Toast';
import { Link } from 'react-router-dom';

export const LowStockWidget: React.FC = () => {
  const { products, settings, updateProduct } = useAdminStore();
  const { toast } = useToast();

  const threshold = settings.lowStockThreshold || 5;
  const lowStockItems = products.filter((p) => p.stock <= threshold);

  const handleQuickRestock = (productId: string, currentStock: number) => {
    updateProduct(productId, { stock: currentStock + 10 });
    toast('Added +10 units to inventory stock!', 'success');
  };

  return (
    <div className="admin-card p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" />
            <h3 className="text-base font-bold text-white">Low Stock Alerts</h3>
          </div>
          <span className="text-xs bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded-full border border-amber-500/20">
            {lowStockItems.length} items
          </span>
        </div>

        {lowStockItems.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            <Package size={28} className="mx-auto mb-2 opacity-40 text-emerald-400" />
            All inventory levels are currently healthy!
          </div>
        ) : (
          <div className="space-y-3">
            {lowStockItems.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.images[0]}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0"
                  />
                  <div>
                    <h5 className="text-xs font-semibold text-white line-clamp-1">{p.name}</h5>
                    <p className="text-[11px] text-amber-400 font-bold">
                      {p.stock === 0 ? 'Out of Stock' : `Only ${p.stock} units remaining`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleQuickRestock(p.id, p.stock)}
                  className="admin-btn-secondary !py-1 !px-2.5 !text-[11px] shrink-0 hover:border-amber-500/40 text-amber-300"
                  title="Add 10 units"
                >
                  <Plus size={12} />
                  <span>+10</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
        <Link
          to="/inventory"
          className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
        >
          Manage All Inventory &rarr;
        </Link>
      </div>
    </div>
  );
};
