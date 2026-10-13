import React, { useState, useEffect } from 'react';
import { Category, Department } from '../../types';
import { Modal } from '../ui/Modal';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  onSave: (cat: Partial<Category>) => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  onSave,
}) => {
  const [department, setDepartment] = useState<Department>('electronics');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [subcategories, setSubcategories] = useState<{ name: string; slug: string }[]>([]);
  const [newSubcatName, setNewSubcatName] = useState('');

  useEffect(() => {
    if (category) {
      setDepartment(category.department);
      setName(category.name);
      setSlug(category.slug);
      setImage(category.image);
      setDescription(category.description || '');
      setSubcategories(category.subcategories || []);
    } else {
      setDepartment('electronics');
      setName('');
      setSlug('');
      setImage('https://images.pexels.com/photos/7068406/pexels-photo-7068406.jpeg?auto=compress&cs=tinysrgb&h=650&w=940');
      setDescription('');
      setSubcategories([]);
    }
  }, [category, isOpen]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!category) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleAddSubcat = () => {
    if (!newSubcatName.trim()) return;
    const subSlug = newSubcatName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setSubcategories([...subcategories, { name: newSubcatName.trim(), slug: subSlug }]);
    setNewSubcatName('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      department,
      image,
      description,
      subcategories,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? `Edit Category: ${category.name}` : 'Add New Category'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Department
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value as Department)}
            className="admin-input"
          >
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Category Name
          </label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="e.g. Wireless Audio"
            className="admin-input"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            URL Slug
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="wireless-audio"
            className="admin-input font-mono text-xs"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Cover Image URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="admin-input text-xs font-mono flex-1"
              required
            />
            <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
              {image ? (
                <img src={image} alt="" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={14} className="text-slate-500" />
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Short category summary..."
            className="admin-input resize-none text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Subcategories
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={newSubcatName}
              onChange={(e) => setNewSubcatName(e.target.value)}
              placeholder="New subcategory name"
              className="admin-input !py-1.5 text-xs flex-1"
            />
            <button
              type="button"
              onClick={handleAddSubcat}
              className="admin-btn-secondary !py-1.5 !px-3 !text-xs"
            >
              <Plus size={13} /> Add
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
            {subcategories.map((sub, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-full text-xs text-slate-200"
              >
                {sub.name}
                <button
                  type="button"
                  onClick={() => setSubcategories(subcategories.filter((_, idx) => idx !== i))}
                  className="text-slate-400 hover:text-rose-400"
                >
                  <Trash2 size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="admin-btn-secondary !py-1.5 !text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="admin-btn-primary !py-1.5 !text-xs"
          >
            {category ? 'Save Changes' : 'Create Category'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
