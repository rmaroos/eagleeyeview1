import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, UserCircle, Package, Heart, MapPin, Settings, LogOut, Shield } from 'lucide-react';
import { useStore } from '@/store/StoreContext';

type Tab = 'profile' | 'orders' | 'wishlist' | 'addresses' | 'security' | 'preferences';

export default function AccountPage() {
  const { wishlist, cartCount } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const menuItems: { id: Tab; label: string; icon: typeof User }[] = [
    { id: 'profile', label: 'Profile', icon: UserCircle },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: `Wishlist (${wishlist.length})`, icon: Heart },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ];

  return (
    <div className="py-6 lg:py-8">
      <div className="container-page">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8">My Account</h1>

        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar */}
          <aside>
            <div className="rounded-xl border border-gray-200 bg-white p-4 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <User size={24} />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Guest User</div>
                  <div className="text-xs text-gray-500">Not signed in</div>
                </div>
              </div>
              <Link to="/login" className="btn-primary w-full text-sm">Sign In</Link>
            </div>

            <nav className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
              <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <LogOut size={18} />
                Logout
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                    <input type="text" className="input-field" placeholder="Enter your first name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                    <input type="text" className="input-field" placeholder="Enter your last name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input type="email" className="input-field" placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                    <input type="tel" className="input-field" placeholder="+94 77 123 4567" />
                  </div>
                </div>
                <button className="btn-primary mt-4">Save Changes</button>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="text-center py-12">
                <Package size={40} className="mx-auto text-gray-300 mb-3" />
                <h2 className="font-semibold text-gray-900 mb-1">No orders yet</h2>
                <p className="text-sm text-gray-500 mb-4">Your order history will appear here.</p>
                <Link to="/" className="btn-primary">Start Shopping</Link>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="text-center py-12">
                <Heart size={40} className="mx-auto text-gray-300 mb-3" />
                <h2 className="font-semibold text-gray-900 mb-1">
                  {wishlist.length > 0 ? `${wishlist.length} items in wishlist` : 'Wishlist is empty'}
                </h2>
                <p className="text-sm text-gray-500 mb-4">Save products you love to find them later.</p>
                <Link to="/wishlist" className="btn-primary">View Wishlist</Link>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="text-center py-12">
                <MapPin size={40} className="mx-auto text-gray-300 mb-3" />
                <h2 className="font-semibold text-gray-900 mb-1">No saved addresses</h2>
                <p className="text-sm text-gray-500 mb-4">Add a delivery address to speed up checkout.</p>
                <button className="btn-primary">Add Address</button>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                    <input type="password" className="input-field" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                    <input type="password" className="input-field" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                    <input type="password" className="input-field" placeholder="••••••••" />
                  </div>
                  <button className="btn-primary">Update Password</button>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">Email notifications</div>
                      <div className="text-xs text-gray-500">Receive updates about new arrivals and offers</div>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-blue-600 h-5 w-5" />
                  </label>
                  <label className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">SMS notifications</div>
                      <div className="text-xs text-gray-500">Receive order updates via SMS</div>
                    </div>
                    <input type="checkbox" className="accent-blue-600 h-5 w-5" />
                  </label>
                  <label className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">Marketing emails</div>
                      <div className="text-xs text-gray-500">Promotional content and product guides</div>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-blue-600 h-5 w-5" />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
