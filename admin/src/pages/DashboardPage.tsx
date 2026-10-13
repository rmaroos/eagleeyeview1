import React, { useState } from 'react';
import { useAdminStore } from '../services/store';
import { MetricCard } from '../components/ui/MetricCard';
import { SalesChart } from '../components/dashboard/SalesChart';
import { RecentOrdersWidget } from '../components/dashboard/RecentOrdersWidget';
import { LowStockWidget } from '../components/dashboard/LowStockWidget';
import { TopProductsWidget } from '../components/dashboard/TopProductsWidget';
import { OrderDetailModal } from '../components/orders/OrderDetailModal';
import { Order } from '../types';
import { DollarSign, ShoppingBag, Package, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { totalRevenue, ordersCount, activeProductsCount, lowStockCount, formatCurrency } =
    useAdminStore();
  const navigate = useNavigate();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time business performance and inventory tracking for Eagle Eye View.
          </p>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Store Revenue"
          value={formatCurrency(totalRevenue)}
          change="+18.4%"
          isPositive={true}
          subtext="vs last 30 days"
          icon={DollarSign}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />

        <MetricCard
          title="Total Orders Placed"
          value={ordersCount}
          change="+12.2%"
          isPositive={true}
          subtext="all channels"
          icon={ShoppingBag}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
          onClick={() => navigate('/orders')}
        />

        <MetricCard
          title="Active Products in Catalog"
          value={activeProductsCount}
          subtext="Electronics & Fashion"
          icon={Package}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
          onClick={() => navigate('/products')}
        />

        <MetricCard
          title="Low Stock Alerts"
          value={lowStockCount}
          change={lowStockCount > 0 ? `${lowStockCount} need restock` : 'Healthy'}
          isPositive={lowStockCount === 0}
          icon={AlertTriangle}
          iconColor={lowStockCount > 0 ? 'text-amber-400' : 'text-emerald-400'}
          iconBg={lowStockCount > 0 ? 'bg-amber-500/10' : 'bg-emerald-500/10'}
          onClick={() => navigate('/inventory')}
        />
      </div>

      {/* Main Chart */}
      <SalesChart />

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrdersWidget onSelectOrder={(order) => setSelectedOrder(order)} />
        </div>
        <div className="space-y-6">
          <LowStockWidget />
          <TopProductsWidget />
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
