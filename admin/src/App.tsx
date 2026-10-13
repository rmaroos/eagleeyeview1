import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider } from './services/store';
import { ToastProvider } from './components/ui/Toast';
import { AuthProvider } from './services/auth';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminLayout } from './components/layout/AdminLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { OrdersPage } from './pages/OrdersPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { InventoryPage } from './pages/InventoryPage';
import { CustomersPage } from './pages/CustomersPage';
import { DatabaseSetupPage } from './pages/DatabaseSetupPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Authentication Portal */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Admin Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/inventory" element={<InventoryPage />} />
                  <Route path="/customers" element={<CustomersPage />} />
                  <Route path="/database" element={<DatabaseSetupPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
