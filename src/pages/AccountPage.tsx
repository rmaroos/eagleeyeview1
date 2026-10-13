import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, UserCircle, Package, Heart, MapPin, Settings, LogOut, Shield } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import Breadcrumb from '@/components/ui/Breadcrumb';

type Tab = 'profile' | 'orders' | 'wishlist' | 'addresses' | 'security' | 'preferences';

export default function AccountPage() {
  const { wishlist } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const menuItems: { id: Tab; label: string; icon: typeof User }[] = [
    { id: 'profile', label: 'Profile', icon: UserCircle },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: `Wishlist (${wishlist.length})`, icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ];

  return (
    <div className="py-6 sm:py-8 lg:py-12 bg-[#F6F7F9] min-h-screen">
      <div className="container-page">
        <div className="mb-6">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'My Account' }]} />
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#15171C] mb-8">
          Account Settings
        </h1>

        {/* Mobile Horizontal Tab Navigation */}
        <div className="lg:hidden mb-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-white border border-gray-200 w-max shadow-2xs">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    active
                      ? 'bg-[#15171C] text-white shadow-xs'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
              <div className="flex items-center gap-3.5 mb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#2347F5] border border-blue-100 font-bold text-lg">
                  <User size={22} />
                </div>
                <div>
                  <div className="font-bold text-[#15171C] text-base">Guest Member</div>
                  <div className="text-xs text-gray-500">Sign in to sync your order history</div>
                </div>
              </div>
              <Link to="/login" className="btn-primary w-full text-xs h-10">
                Sign In or Register
              </Link>
            </div>

            <nav className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs divide-y divide-gray-100">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3 w-full px-5 py-3.5 text-sm font-semibold transition-colors ${
                      active
                        ? 'bg-blue-50/70 text-[#2347F5] border-l-4 border-[#2347F5]'
                        : 'text-gray-600 hover:bg-slate-50 hover:text-[#15171C]'
                    }`}
                  >
                    <Icon size={17} className={active ? 'text-[#2347F5]' : 'text-gray-400'} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <Link
                to="/login"
                className="flex items-center gap-3 w-full px-5 py-3.5 text-sm font-semibold text-gray-500 hover:bg-slate-50 transition-colors"
              >
                <LogOut size={17} className="text-gray-400" />
                <span>Switch Account</span>
              </Link>
            </nav>
          </aside>

          {/* Tab Content Panel */}
          <div className="lg:col-span-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
            {activeTab === 'profile' && (
              <div>
                <h2 className="font-display font-bold text-xl text-[#15171C] mb-5">
                  Personal Profile
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                      First Name
                    </label>
                    <input type="text" className="input-field" placeholder="John" defaultValue="Guest" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                      Last Name
                    </label>
                    <input type="text" className="input-field" placeholder="Doe" defaultValue="Shopper" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                      Email Address
                    </label>
                    <input type="email" className="input-field" placeholder="guest@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                      Mobile Phone
                    </label>
                    <input type="tel" className="input-field" placeholder="+94 77 123 4567" />
                  </div>
                </div>
                <button type="button" className="btn-primary mt-6 text-xs h-10 px-6">
                  Save Changes
                </button>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="text-center py-12">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-gray-400 mx-auto mb-4">
                  <Package size={28} />
                </div>
                <h2 className="font-display font-bold text-xl text-[#15171C] mb-1">No Orders Recorded</h2>
                <p className="text-sm text-gray-500 mb-6">You haven't placed any orders with this profile yet.</p>
                <Link to="/" className="btn-primary text-xs">Explore Shop</Link>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="text-center py-12">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-gray-400 mx-auto mb-4">
                  <Heart size={28} />
                </div>
                <h2 className="font-display font-bold text-xl text-[#15171C] mb-1">
                  {wishlist.length > 0 ? `${wishlist.length} Saved Products` : 'Your Wishlist is Empty'}
                </h2>
                <p className="text-sm text-gray-500 mb-6">Keep track of your favorite gadgets and bags.</p>
                <Link to="/wishlist" className="btn-primary text-xs">Go to Wishlist</Link>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="text-center py-12">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-gray-400 mx-auto mb-4">
                  <MapPin size={28} />
                </div>
                <h2 className="font-display font-bold text-xl text-[#15171C] mb-1">No Saved Addresses</h2>
                <p className="text-sm text-gray-500 mb-6">Save delivery addresses for one-click checkout.</p>
                <button type="button" className="btn-primary text-xs">Add New Address</button>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="max-w-md">
                <h2 className="font-display font-bold text-xl text-[#15171C] mb-5">Security Credentials</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Current Password</label>
                    <input type="password" className="input-field" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">New Password</label>
                    <input type="password" className="input-field" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Confirm Password</label>
                    <input type="password" className="input-field" placeholder="••••••••" />
                  </div>
                  <button type="button" className="btn-primary text-xs h-10 px-6 mt-2">Update Password</button>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div>
                <h2 className="font-display font-bold text-xl text-[#15171C] mb-5">Communication Preferences</h2>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="font-bold text-sm text-[#15171C]">Order Status Notifications</div>
                      <div className="text-xs text-gray-500 mt-0.5">Receive dispatch tracking and SMS delivery updates</div>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-[#2347F5] h-5 w-5" />
                  </label>
                  <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="font-bold text-sm text-[#15171C]">Special Deals &amp; Price Drops</div>
                      <div className="text-xs text-gray-500 mt-0.5">Get early access alerts on limited summer and winter sales</div>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-[#2347F5] h-5 w-5" />
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
