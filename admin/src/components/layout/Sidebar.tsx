import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderTree,
  Users,
  Boxes,
  Database,
  Settings,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  LogOut,
} from 'lucide-react';
import { useAdminStore } from '../../services/store';
import { useAuth } from '../../services/auth';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { orders, lowStockCount } = useAdminStore();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  const navItems = [
    {
      label: 'Dashboard',
      to: '/',
      icon: LayoutDashboard,
    },
    {
      label: 'Products',
      to: '/products',
      icon: Package,
    },
    {
      label: 'Orders',
      to: '/orders',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold',
    },
    {
      label: 'Categories',
      to: '/categories',
      icon: FolderTree,
    },
    {
      label: 'Inventory',
      to: '/inventory',
      icon: Boxes,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'bg-rose-500 text-white font-bold',
    },
    {
      label: 'Customers',
      to: '/customers',
      icon: Users,
    },
    {
      label: 'Supabase Sync',
      to: '/database',
      icon: Database,
    },
    {
      label: 'Settings',
      to: '/settings',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0B0F17] border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-600/30">
              E
            </div>
            <div>
              <span className="font-display font-extrabold text-base tracking-tight text-white block leading-tight">
                Eagle Eye View
              </span>
              <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest block">
                Admin Console
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 py-6 px-3 overflow-y-auto space-y-1">
          <div className="px-3 mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Management
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className="transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Low Stock Alert Pill */}
        {lowStockCount > 0 && (
          <div className="px-4 py-3 mx-3 mb-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
              <ShieldAlert size={14} />
              <span>Stock Notice</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              {lowStockCount} product{lowStockCount > 1 ? 's are' : ' is'} running low on inventory.
            </p>
          </div>
        )}

        {/* External Link & Sign Out */}
        <div className="p-4 border-t border-slate-800/80 bg-[#0E131F] space-y-2">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-semibold transition-all group"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>View Customer Store</span>
            </div>
            <ExternalLink size={13} className="text-slate-400 group-hover:text-white" />
          </a>

          <button
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
