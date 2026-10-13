import React, { useState } from 'react';
import { Order, OrderStatus, PaymentStatus } from '../../types';
import { Modal } from '../ui/Modal';
import { OrderStatusBadge, PaymentStatusBadge } from '../ui/Badge';
import { useAdminStore } from '../../services/store';
import { useToast } from '../ui/Toast';
import {
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  Truck,
  CreditCard,
  Printer,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  const { updateOrderStatus, updateOrderPayment, formatCurrency } = useAdminStore();
  const { toast } = useToast();

  const [trackingNumber, setTrackingNumber] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('pending');
  const [selectedPayment, setSelectedPayment] = useState<PaymentStatus>('pending');

  React.useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
      setSelectedPayment(order.paymentStatus);
      setTrackingNumber(order.trackingNumber || '');
    }
  }, [order]);

  if (!order) return null;

  const handleUpdateStatus = () => {
    updateOrderStatus(order.id, selectedStatus, trackingNumber.trim() || undefined);
    updateOrderPayment(order.id, selectedPayment);
    toast(`Order ${order.id} updated successfully!`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order ${order.id}`}
      subtitle={`Placed on ${new Date(order.createdAt).toLocaleString('en-US')}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Quick Status Bar */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">Current Status:</span>
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>

          <button
            onClick={handlePrint}
            className="admin-btn-secondary !text-xs !py-1.5 flex items-center gap-1.5"
          >
            <Printer size={14} />
            <span>Print Invoice</span>
          </button>
        </div>

        {/* Fulfillment Control Box */}
        <div className="p-4 rounded-xl bg-[#131B2E] border border-blue-900/40">
          <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">
            Update Fulfillment & Tracking
          </h4>
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Fulfillment Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                className="admin-input !py-1.5 !text-xs"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Payment Status
              </label>
              <select
                value={selectedPayment}
                onChange={(e) => setSelectedPayment(e.target.value as PaymentStatus)}
                className="admin-input !py-1.5 !text-xs"
              >
                <option value="paid">Paid</option>
                <option value="pending">Unpaid / Pending</option>
                <option value="refunded">Refunded</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Courier Tracking No.
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. EEV-EX-9921"
                className="admin-input !py-1.5 !text-xs"
              />
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              onClick={handleUpdateStatus}
              className="admin-btn-primary !py-1.5 !px-3 !text-xs"
            >
              Update Order Record
            </button>
          </div>
        </div>

        {/* Customer & Shipping Info Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 pb-2 border-b border-slate-800">
              <User size={15} className="text-blue-400" />
              <span>Customer Information</span>
            </div>
            <p className="text-sm font-semibold text-white">{order.customerName}</p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Mail size={13} />
              <span>{order.customerEmail}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Phone size={13} />
              <span>{order.customerPhone}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 pb-2 border-b border-slate-800">
              <MapPin size={15} className="text-emerald-400" />
              <span>Shipping Address & Method</span>
            </div>
            <p className="text-sm text-slate-200">{order.shippingAddress.address}</p>
            <p className="text-xs text-slate-400">
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
            <div className="flex items-center gap-2 text-xs text-blue-400 pt-1">
              <Truck size={13} />
              <span className="capitalize">{order.deliveryMethod} Delivery</span>
              {order.trackingNumber && (
                <span className="text-slate-400 font-mono text-[11px]">
                  ({order.trackingNumber})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Order Items List */}
        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            Ordered Items ({order.items.length})
          </h4>
          <div className="rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
            {order.items.map((item, index) => (
              <div key={index} className="p-3 bg-slate-900/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.productImage}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover bg-slate-800 border border-slate-700"
                  />
                  <div>
                    <h5 className="text-xs font-semibold text-white">{item.productName}</h5>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="capitalize">{item.department}</span>
                      {item.selectedColor && (
                        <span>• Color: <span className="text-slate-200 font-medium">{item.selectedColor}</span></span>
                      )}
                      <span>• Qty: {item.quantity}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-white">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {formatCurrency(item.price)} each
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Summary */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-end gap-1.5 text-xs">
          <div className="flex justify-between w-64 text-slate-400">
            <span>Subtotal:</span>
            <span className="font-semibold text-slate-200">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between w-64 text-slate-400">
            <span>Delivery Fee:</span>
            <span className="font-semibold text-slate-200">
              {order.shippingFee === 0 ? 'FREE' : formatCurrency(order.shippingFee)}
            </span>
          </div>
          <div className="flex justify-between w-64 pt-2 border-t border-slate-800 text-sm font-extrabold text-white">
            <span>Grand Total:</span>
            <span className="text-emerald-400 font-display text-base">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
