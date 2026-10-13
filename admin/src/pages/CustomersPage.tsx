import React, { useState } from 'react';
import { useAdminStore } from '../services/store';
import { Search, Users, Crown, Mail, Phone, MapPin } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export const CustomersPage: React.FC = () => {
  const { customers, formatCurrency } = useAdminStore();
  const [search, setSearch] = useState('');

  const filteredCustomers = customers.filter((c) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const vipCount = customers.filter((c) => c.tier === 'VIP').length;
  const avgSpend =
    customers.length > 0
      ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Customer Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review customer buying histories, geographic locations, and VIP reward statuses.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="admin-card p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Registered Customers
          </p>
          <h3 className="text-2xl font-extrabold text-white">{customers.length}</h3>
          <p className="text-[11px] text-slate-500 mt-2">Active shopper profiles</p>
        </div>

        <div className="admin-card p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            VIP Tier Members
          </p>
          <h3 className="text-2xl font-extrabold text-amber-400">{vipCount}</h3>
          <p className="text-[11px] text-slate-500 mt-2">High lifetime spenders</p>
        </div>

        <div className="admin-card p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Average Spend / Customer
          </p>
          <h3 className="text-2xl font-extrabold text-emerald-400">
            {formatCurrency(Math.round(avgSpend))}
          </h3>
          <p className="text-[11px] text-slate-500 mt-2">Across all accounts</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="admin-card p-4">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email, or city..."
            className="admin-input pl-10 !py-2 text-xs"
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#141E33]/60 text-slate-400 border-b border-slate-800">
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Contact Info</th>
                <th className="py-3.5 px-4 font-semibold">City / Location</th>
                <th className="py-3.5 px-4 font-semibold">Orders Placed</th>
                <th className="py-3.5 px-4 font-semibold">Total Spent</th>
                <th className="py-3.5 px-4 font-semibold">Customer Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs">{c.name}</h4>
                        <span className="text-[10px] text-slate-500">ID: {c.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-300">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Mail size={12} className="text-slate-500" />
                      <span>{c.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                      <Phone size={12} />
                      <span>{c.phone}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-300">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="text-emerald-400" />
                      <span>{c.city}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-bold text-white">
                    {c.totalOrders} order{c.totalOrders > 1 ? 's' : ''}
                  </td>

                  <td className="py-3 px-4 font-bold text-emerald-400">
                    {formatCurrency(c.totalSpent)}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        c.tier === 'VIP'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : c.tier === 'Regular'
                          ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {c.tier === 'VIP' && <Crown size={11} />}
                      {c.tier}
                    </span>
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
