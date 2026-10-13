import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtext?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  subtext,
  icon: Icon,
  iconColor = 'text-blue-500',
  iconBg = 'bg-blue-500/10',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`admin-card admin-card-hover p-6 relative overflow-hidden group ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${iconBg} ${iconColor} transition-transform group-hover:scale-110`}>
          <Icon size={22} />
        </div>
      </div>

      {(change || subtext) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {change && (
            <span
              className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full ${
                isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
              }`}
            >
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {change}
            </span>
          )}
          {subtext && <span className="text-slate-500">{subtext}</span>}
        </div>
      )}

      {/* Decorative subtle ambient gradient glow */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
    </div>
  );
};
