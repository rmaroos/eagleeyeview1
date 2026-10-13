import React from 'react';
import { useAdminStore } from '../../services/store';
import { OrderStatusBadge, PaymentStatusBadge } from '../ui/Badge';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShoppingBag } from 'lucide-react';
import { Order } from '../../types';

interface RecentOrdersWidgetProps {
  onSelectOrder?: (order: Order) => void;
}

export const RecentOrdersWidget: React.FC<RecentOrdersWidgetProps> = ({ onSelectOrder }) => {
  const { orders, formatCurrency } = useAdminStore();

  const recent = orders.slice(0, 5);

  return (
    <div className="admin-card p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-blue-500" />
            <h3 className="text-base font-bold text-white">Recent Customer Orders</h3>
          </div>
          <Link
            to="/orders"
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-3 font-semibold">Order ID</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Items</th>
                <th className="pb-3 font-semibold">Total</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recent.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => onSelectOrder?.(order)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                >
                  <td className="py-3 font-mono font-bold text-blue-400 group-hover:text-blue-300">
                    {order.id}
                  </td>
                  <td className="py-3">
                    <p className="font-semibold text-white">{order.customerName}</p>
                    <p className="text-[10px] text-slate-500">{order.shippingAddress.city}</p>
                  </td>
                  <td className="py-3 text-slate-400">
                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </td>
                  <td className="py-3 font-bold text-white">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="py-3">
                    <OrderStatusBadge status={order.status} />
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
