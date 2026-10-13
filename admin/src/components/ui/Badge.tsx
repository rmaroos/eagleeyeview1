import React from 'react';
import { OrderStatus, PaymentStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'amber';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    amber: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border tracking-wide uppercase ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const map: Record<OrderStatus, { label: string; variant: BadgeProps['variant'] }> = {
    pending: { label: 'Pending', variant: 'warning' },
    processing: { label: 'Processing', variant: 'info' },
    shipped: { label: 'Shipped', variant: 'purple' },
    delivered: { label: 'Delivered', variant: 'success' },
    cancelled: { label: 'Cancelled', variant: 'danger' },
  };

  const item = map[status] || { label: status, variant: 'default' };
  return <Badge variant={item.variant}>{item.label}</Badge>;
};

export const PaymentStatusBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
  const map: Record<PaymentStatus, { label: string; variant: BadgeProps['variant'] }> = {
    paid: { label: 'Paid', variant: 'success' },
    pending: { label: 'Unpaid', variant: 'amber' },
    refunded: { label: 'Refunded', variant: 'purple' },
    failed: { label: 'Failed', variant: 'danger' },
  };

  const item = map[status] || { label: status, variant: 'default' };
  return <Badge variant={item.variant}>{item.label}</Badge>;
};

export const StockBadge: React.FC<{ stock: number; threshold?: number }> = ({ stock, threshold = 5 }) => {
  if (stock === 0) {
    return <Badge variant="danger">Out of Stock</Badge>;
  }
  if (stock <= threshold) {
    return <Badge variant="warning">Low ({stock} left)</Badge>;
  }
  return <Badge variant="success">In Stock ({stock})</Badge>;
};
