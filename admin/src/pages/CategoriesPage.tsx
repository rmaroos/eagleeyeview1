import React, { useState } from 'react';
import { useAdminStore } from '../services/store';
import { Category, Department } from '../types';
import { CategoryModal } from '../components/categories/CategoryModal';
import { useToast } from '../components/ui/Toast';
import { Plus, Edit, Trash2, FolderTree, Package } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useAdminStore();
  const { toast } = useToast();

  const [selectedDept, setSelectedDept] = useState<'all' | Department>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const filteredCategories = categories.filter(
    (c) => selectedDept === 'all' || c.department === selectedDept
  );

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setIsModalOpen(true);
  };

  const handleDelete = (c: Category) => {
    if (window.confirm(`Delete category "${c.name}"? Products in this category will become unassigned.`)) {
      deleteCategory(c.id);
      toast(`Category "${c.name}" deleted.`, 'info');
    }
  };

  const handleSaveCategory = (catData: Partial<Category>) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, catData);
      toast(`Category "${catData.name}" updated!`, 'success');
    } else {
      addCategory(catData as any);
      toast(`Category "${catData.name}" created!`, 'success');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Store Categories
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Organize Electronics and Fashion navigation, subcategories, and banners.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="admin-btn-primary self-start sm:self-auto">
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Department Tabs */}
      <div className="flex items-center gap-1 bg-[#0B0F17] p-1 rounded-xl border border-slate-800 w-fit">
        {(['all', 'electronics', 'fashion'] as const).map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
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

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => {
          const count = products.filter((p) => p.category === cat.slug).length;

          return (
            <div
              key={cat.id}
              className="admin-card overflow-hidden group flex flex-col justify-between"
            >
              <div>
                {/* Image Cover */}
                <div className="relative h-40 w-full overflow-hidden bg-slate-800">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
                  <span
                    className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                      cat.department === 'electronics'
                        ? 'bg-blue-900/80 text-blue-200 border border-blue-500/30'
                        : 'bg-purple-900/80 text-purple-200 border border-purple-500/30'
                    }`}
                  >
                    {cat.department}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-white text-base leading-snug">{cat.name}</h3>
                      <p className="text-[11px] font-mono text-slate-500">/{cat.slug}</p>
                    </div>
                    <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-semibold border border-slate-700 shrink-0">
                      {count} items
                    </span>
                  </div>

                  {cat.description && (
                    <p className="text-xs text-slate-400 line-clamp-2">{cat.description}</p>
                  )}

                  {/* Subcategories */}
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1.5">
                        Subcategories
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {cat.subcategories.map((sub, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800 font-medium"
                          >
                            {sub.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-3 border-t border-slate-800/80 bg-[#0E1422] flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Edit Category"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(cat)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Delete Category"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={editingCategory}
        onSave={handleSaveCategory}
      />
    </div>
  );
};
