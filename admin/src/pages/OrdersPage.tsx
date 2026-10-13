import React, { useState, useMemo } from 'react';
import { useAdminStore } from '../services/store';
import { Order, OrderStatus, PaymentStatus } from '../types';
import { OrderStatusBadge, PaymentStatusBadge } from '../components/ui/Badge';
import { OrderDetailModal } from '../components/orders/OrderDetailModal';
import { Search, Eye, Filter, ArrowUpDown, Truck } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { orders, formatCurrency } = useAdminStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | PaymentStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (paymentFilter !== 'all' && o.paymentStatus !== paymentFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchId = o.id.toLowerCase().includes(q);
        const matchCust = o.customerName.toLowerCase().includes(q);
        const matchEmail = o.customerEmail.toLowerCase().includes(q);
        if (!matchId && !matchCust && !matchEmail) return false;
      }
      return true;
    });
  }, [orders, statusFilter, paymentFilter, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Customer Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Fulfill orders, track shipping couriers, and manage customer payments.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-card p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, customer name, or email..."
              className="admin-input pl-10 !py-2 text-xs"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-[#0B0F17] p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
            {(['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map(
              (st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                    statusFilter === st
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              )
            )}
          </div>
        </div>

        {/* Payment Filter */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Payment Status:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value as any)}
              className="admin-input !py-1 !px-2.5 !w-auto text-xs"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Unpaid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <span className="text-slate-500 font-medium">
            Showing <span className="text-white font-bold">{filteredOrders.length}</span> orders
          </span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#141E33]/60 text-slate-400 border-b border-slate-800">
                <th className="py-3.5 px-4 font-semibold">Order Ref</th>
                <th className="py-3.5 px-4 font-semibold">Date</th>
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Items</th>
                <th className="py-3.5 px-4 font-semibold">Total Amount</th>
                <th className="py-3.5 px-4 font-semibold">Payment</th>
                <th className="py-3.5 px-4 font-semibold">Fulfillment</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No orders match your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr
                    key={o.id}
                    onClick={() => setSelectedOrder(o)}
                    className="hover:bg-slate-800/30 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-blue-400 group-hover:text-blue-300">
                      {o.id}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(o.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-white leading-tight">{o.customerName}</p>
                      <p className="text-[11px] text-slate-400">{o.customerEmail}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {o.items.length} item{o.items.length > 1 ? 's' : ''}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400">
                      {formatCurrency(o.total)}
                    </td>
                    <td className="py-3 px-4">
                      <PaymentStatusBadge status={o.paymentStatus} />
                    </td>
                    <td className="py-3 px-4">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(o);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors inline-flex items-center gap-1"
                        title="View Order Details"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </div>
  );
};
