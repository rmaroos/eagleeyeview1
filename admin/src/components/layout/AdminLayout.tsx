import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { ProductModal } from '../products/ProductModal';
import { useAdminStore } from '../../services/store';
import { useToast } from '../ui/Toast';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const { addProduct } = useAdminStore();
  const { toast } = useToast();

  const handleSaveProduct = (productData: any) => {
    const created = addProduct(productData);
    toast(`Product "${created.name}" created successfully!`, 'success');
    setIsAddProductModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col antialiased">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen">
        <TopNavbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenAddProduct={() => setIsAddProductModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Quick Add Product Modal */}
      <ProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onSave={handleSaveProduct}
      />
    </div>
  );
};
