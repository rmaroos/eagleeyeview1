import React, { useState } from 'react';
import { Menu, Search, Plus, Bell, ExternalLink, Sparkles, Check, RefreshCw, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../services/store';
import { useAuth } from '../../services/auth';

interface TopNavbarProps {
  onToggleSidebar: () => void;
  onOpenAddProduct?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleSidebar, onOpenAddProduct }) => {
  const navigate = useNavigate();
  const { orders, settings } = useAdminStore();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const pendingOrders = orders.filter((o) => o.status === 'pending');

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-[#0B0F17]/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      {/* Left: Mobile hamburger & title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Live Store:</span>
          <span className="font-semibold text-slate-200">{settings.storeName}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Add Product button */}
        {onOpenAddProduct ? (
          <button
            onClick={onOpenAddProduct}
            className="admin-btn-primary !py-2 !px-3.5 !text-xs hidden sm:inline-flex"
          >
            <Plus size={15} />
            <span>Add Product</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/products?action=new')}
            className="admin-btn-primary !py-2 !px-3.5 !text-xs hidden sm:inline-flex"
          >
            <Plus size={15} />
            <span>Add Product</span>
          </button>
        )}

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Bell size={18} />
            {pendingOrders.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-[#0B0F17]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-sm font-bold text-white">Notifications</h4>
                <span className="text-[11px] text-blue-400 font-medium">
                  {pendingOrders.length} pending
                </span>
              </div>
              <div className="py-2 divide-y divide-slate-800/50 max-h-60 overflow-y-auto">
                {pendingOrders.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">No pending orders to review!</p>
                ) : (
                  pendingOrders.map((o) => (
                    <div
                      key={o.id}
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/orders');
                      }}
                      className="py-2.5 px-1 hover:bg-slate-800/40 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-white">
                        <span>{o.id}</span>
                        <span className="text-amber-400 font-bold">{settings.currencySymbol}{o.total.toLocaleString()}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        New order from {o.customerName}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Admin User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 pl-2 py-1 rounded-xl hover:bg-slate-800/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
              {user?.name?.slice(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-200 leading-tight">
                {user?.name || 'Administrator'}
              </div>
              <div className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">
                {user?.email || 'admin'}
              </div>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-800 mb-1">
                <p className="text-xs font-bold text-white">{user?.name || 'Administrator'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  {user?.role || 'Super Admin'}
                </span>
              </div>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors text-left"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
