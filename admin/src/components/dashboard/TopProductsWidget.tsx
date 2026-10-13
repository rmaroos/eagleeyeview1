import React from 'react';
import { useAdminStore } from '../../services/store';
import { Award, Star } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const TopProductsWidget: React.FC = () => {
  const { products, formatCurrency } = useAdminStore();

  const topProducts = [...products]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 4);

  return (
    <div className="admin-card p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-purple-400" />
            <h3 className="text-base font-bold text-white">Top Performing Products</h3>
          </div>
          <span className="text-xs text-slate-400">By Customer Popularity</span>
        </div>

        <div className="space-y-3">
          {topProducts.map((p, index) => (
            <div
              key={p.id}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="w-5 text-center text-xs font-bold text-slate-500">
                  #{index + 1}
                </span>
                <img
                  src={p.images[0]}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0"
                />
                <div>
                  <h5 className="text-xs font-semibold text-white line-clamp-1">{p.name}</h5>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-0.5 text-amber-400">
                      <Star size={11} fill="currentColor" />
                      {p.rating}
                    </span>
                    <span>({p.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-emerald-400">{formatCurrency(p.price)}</div>
                <div className="text-[10px] text-slate-500 capitalize">{p.department}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
