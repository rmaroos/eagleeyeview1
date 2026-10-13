import React, { useState, useMemo } from 'react';
import { useAdminStore } from '../services/store';
import { Product, Department } from '../types';
import { StockBadge } from '../components/ui/Badge';
import { ProductModal } from '../components/products/ProductModal';
import { useToast } from '../components/ui/Toast';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Star,
  CheckSquare,
} from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, formatCurrency } =
    useAdminStore();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<'all' | Department>('all');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [selectedStock, setSelectedStock] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Dept filter
      if (selectedDept !== 'all' && p.department !== selectedDept) return false;
      // Category filter
      if (selectedCat !== 'all' && p.category !== selectedCat) return false;
      // Stock filter
      if (selectedStock === 'in_stock' && p.stock <= 5) return false;
      if (selectedStock === 'low_stock' && (p.stock <= 0 || p.stock > 5)) return false;
      if (selectedStock === 'out_of_stock' && p.stock > 0) return false;
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = p.name.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        const matchId = p.id.toLowerCase().includes(q);
        if (!matchTitle && !matchBrand && !matchId) return false;
      }
      return true;
    });
  }, [products, selectedDept, selectedCat, selectedStock, search]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setIsModalOpen(true);
  };

  const handleDuplicate = (p: Product) => {
    const clone = {
      ...p,
      name: `${p.name} (Copy)`,
      slug: `${p.slug}-copy-${Date.now().toString().slice(-4)}`,
    };
    // remove id
    const { id, createdAt, updatedAt, ...rest } = clone as any;
    addProduct(rest);
    toast(`Product "${p.name}" duplicated!`, 'success');
  };

  const handleDelete = (p: Product) => {
    if (window.confirm(`Are you sure you want to delete "${p.name}"? This action cannot be undone.`)) {
      deleteProduct(p.id);
      toast(`Deleted "${p.name}"`, 'info');
    }
  };

  const handleSaveProduct = (productData: any) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast(`Updated "${productData.name}"`, 'success');
    } else {
      addProduct(productData);
      toast(`Created "${productData.name}"`, 'success');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Products Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your store's inventory, pricing, specifications, and media.
          </p>
        </div>

        <button
          id="btn-add-product"
          onClick={handleOpenAdd}
          className="admin-btn-primary self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-card p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name, brand, or SKU..."
              className="admin-input pl-10 !py-2 text-xs"
            />
          </div>

          {/* Department Tabs */}
          <div className="flex items-center gap-1 bg-[#0B0F17] p-1 rounded-xl border border-slate-800 self-start md:self-auto">
            {(['all', 'electronics', 'fashion'] as const).map((dept) => (
              <button
                key={dept}
                onClick={() => {
                  setSelectedDept(dept);
                  setSelectedCat('all');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  selectedDept === dept
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Category:</span>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="admin-input !py-1 !px-2.5 !w-auto text-xs"
            >
              <option value="all">All Categories</option>
              {categories
                .filter((c) => selectedDept === 'all' || c.department === selectedDept)
                .map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Stock Status:</span>
            <select
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value as any)}
              className="admin-input !py-1 !px-2.5 !w-auto text-xs"
            >
              <option value="all">All Stock Levels</option>
              <option value="in_stock">In Stock (&gt; 5)</option>
              <option value="low_stock">Low Stock (&le; 5)</option>
              <option value="out_of_stock">Out of Stock (0)</option>
            </select>
          </div>

          <div className="ml-auto text-slate-500 font-medium">
            Showing <span className="text-white font-bold">{filteredProducts.length}</span> of {products.length} products
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#141E33]/60 text-slate-400 border-b border-slate-800">
                <th className="py-3.5 px-4 font-semibold">Product</th>
                <th className="py-3.5 px-4 font-semibold">Department</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Price (LKR)</th>
                <th className="py-3.5 px-4 font-semibold">Inventory</th>
                <th className="py-3.5 px-4 font-semibold">Badges</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No products found matching your current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors group">
                    {/* Thumbnail & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover bg-slate-800 border border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-white text-xs line-clamp-1 group-hover:text-blue-400 transition-colors">
                            {p.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
                            <span>SKU: {p.id}</span>
                            <span>• {p.brand}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-semibold text-[10px] uppercase tracking-wider ${
                          p.department === 'electronics'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}
                      >
                        {p.department}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-slate-300 font-medium capitalize">
                      {p.category.replace('-', ' ')}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-xs">
                        {formatCurrency(p.price)}
                      </div>
                      {p.oldPrice && p.oldPrice > p.price && (
                        <div className="text-[10px] text-slate-500 line-through">
                          {formatCurrency(p.oldPrice)}
                        </div>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4">
                      <StockBadge stock={p.stock} />
                    </td>

                    {/* Badges */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {p.isBestSeller && (
                          <span className="bg-amber-500/15 text-amber-300 border border-amber-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold">
                            BEST SELLER
                          </span>
                        )}
                        {p.isNew && (
                          <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold">
                            NEW
                          </span>
                        )}
                        {p.oldPrice && p.oldPrice > p.price && (
                          <span className="bg-rose-500/15 text-rose-300 border border-rose-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold">
                            SALE
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit Product"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDuplicate(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                          title="Duplicate Product"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
};
