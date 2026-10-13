import React, { useState } from 'react';
import { useAdminStore } from '../../services/store';

export const SalesChart: React.FC = () => {
  const { formatCurrency } = useAdminStore();
  const [range, setRange] = useState<'7d' | '30d' | '12m'>('7d');

  // Realistic mock data points for sales curve
  const dataMap = {
    '7d': [
      { label: 'Mon', value: 48000, orders: 3 },
      { label: 'Tue', value: 72000, orders: 5 },
      { label: 'Wed', value: 59000, orders: 4 },
      { label: 'Thu', value: 94000, orders: 7 },
      { label: 'Fri', value: 125000, orders: 9 },
      { label: 'Sat', value: 185000, orders: 12 },
      { label: 'Sun', value: 142000, orders: 8 },
    ],
    '30d': [
      { label: 'Week 1', value: 380000, orders: 28 },
      { label: 'Week 2', value: 490000, orders: 35 },
      { label: 'Week 3', value: 410000, orders: 30 },
      { label: 'Week 4', value: 650000, orders: 48 },
    ],
    '12m': [
      { label: 'May', value: 920000, orders: 60 },
      { label: 'Jun', value: 1100000, orders: 75 },
      { label: 'Jul', value: 1250000, orders: 82 },
      { label: 'Aug', value: 1400000, orders: 95 },
      { label: 'Sep', value: 1680000, orders: 110 },
      { label: 'Oct', value: 1950000, orders: 135 },
    ],
  };

  const currentData = dataMap[range];
  const maxValue = Math.max(...currentData.map((d) => d.value));
  const totalPeriodRevenue = currentData.reduce((acc, d) => acc + d.value, 0);

  // SVG coordinates calculation
  const width = 600;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  const points = currentData.map((d, i) => {
    const x = paddingX + (i / (currentData.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - (d.value / (maxValue * 1.15)) * (height - paddingY * 2);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    // Smooth bezier curve
    const prev = points[i - 1];
    const cp1x = prev.x + (p.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (p.x - prev.x) / 2;
    const cp2y = p.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${
    height - paddingY
  } Z`;

  return (
    <div className="admin-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-white">Revenue & Sales Trends</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Total for selected period:{' '}
            <span className="font-bold text-emerald-400">{formatCurrency(totalPeriodRevenue)}</span>
          </p>
        </div>

        {/* Range Buttons */}
        <div className="flex items-center gap-1 bg-[#0B0F17] p-1 rounded-xl border border-slate-800">
          {(['7d', '30d', '12m'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase transition-all ${
                range === r
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive SVG Chart */}
      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56 overflow-visible">
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="#1F2937"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={height / 2}
            x2={width - paddingX}
            y2={height / 2}
            stroke="#1F2937"
            strokeDasharray="4 4"
          />

          {/* Gradient Area Fill */}
          <path d={areaD} fill="url(#revenueGradient)" />

          {/* Glowing Stroke Curve */}
          <path
            d={pathD}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Point Dots & X Labels */}
          {points.map((p, i) => (
            <g key={i} className="group cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                className="fill-blue-500 stroke-[#111827] stroke-2 group-hover:r-6 transition-all"
              />
              <text
                x={p.x}
                y={height - 8}
                textAnchor="middle"
                className="text-[10px] fill-slate-500 font-semibold"
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};
