import React, { useState, useEffect } from 'react';
import { Product, Department, ProductSpec, ProductColor } from '../../types';
import { Modal } from '../ui/Modal';
import { useAdminStore } from '../../services/store';
import { Plus, Trash2, Image as ImageIcon, Sparkles, Layers } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: (product: any) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onSave,
}) => {
  const { categories } = useAdminStore();

  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'attributes' | 'media'>('basic');

  // Form states
  const [department, setDepartment] = useState<Department>('electronics');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  const [price, setPrice] = useState<number>(0);
  const [oldPrice, setOldPrice] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState<number>(10);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  // Electronics specs
  const [keySpec, setKeySpec] = useState('');
  const [specs, setSpecs] = useState<ProductSpec[]>([]);

  // Fashion attributes
  const [material, setMaterial] = useState('');
  const [bagType, setBagType] = useState('');
  const [closure, setClosure] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [colors, setColors] = useState<ProductColor[]>([]);

  // Media
  const [images, setImages] = useState<string[]>(['']);

  // Reset or populate form
  useEffect(() => {
    if (product) {
      setDepartment(product.department);
      setCategory(product.category);
      setSubcategory(product.subcategory || '');
      setBrand(product.brand);
      setName(product.name);
      setSlug(product.slug);
      setDescription(product.description);
      setPrice(product.price);
      setOldPrice(product.oldPrice);
      setStock(product.stock);
      setIsBestSeller(!!product.isBestSeller);
      setIsNew(!!product.isNew);
      setIsFeatured(!!product.isFeatured);
      setKeySpec(product.keySpec || '');
      setSpecs(product.specs || []);
      setMaterial(product.material || '');
      setBagType(product.bagType || '');
      setClosure(product.closure || '');
      setDimensions(product.dimensions || '');
      setColors(product.colors || []);
      setImages(product.images.length > 0 ? product.images : ['']);
    } else {
      setDepartment('electronics');
      setCategory(categories[0]?.slug || 'mobile-phones');
      setSubcategory('');
      setBrand('');
      setName('');
      setSlug('');
      setDescription('');
      setPrice(0);
      setOldPrice(undefined);
      setStock(10);
      setIsBestSeller(false);
      setIsNew(true);
      setIsFeatured(false);
      setKeySpec('');
      setSpecs([{ label: 'Display', value: '' }]);
      setMaterial('');
      setBagType('');
      setClosure('');
      setDimensions('');
      setColors([{ name: 'Black', hex: '#000000' }]);
      setImages(['https://images.pexels.com/photos/7068406/pexels-photo-7068406.jpeg?auto=compress&cs=tinysrgb&h=650&w=940']);
    }
    setActiveTab('basic');
  }, [product, isOpen, categories]);

  // Auto-generate slug when name changes if creating new
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!product) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  // Filter categories by department
  const filteredCategories = categories.filter((c) => c.department === department);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price <= 0) {
      alert('Please fill in product name and a valid price.');
      return;
    }

    const badges: string[] = [];
    if (isBestSeller) badges.push('BEST SELLER');
    if (isNew) badges.push('NEW');
    if (oldPrice && oldPrice > price) badges.push('SALE');
    if (isFeatured) badges.push('FEATURED');

    const cleanImages = images.filter((img) => img.trim() !== '');

    const payload: Partial<Product> = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      department,
      category,
      subcategory: subcategory || undefined,
      brand: brand || 'Eagle Eye View',
      description,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      stock: Number(stock),
      rating: product?.rating || 5.0,
      reviewCount: product?.reviewCount || 0,
      images: cleanImages.length > 0 ? cleanImages : ['https://images.pexels.com/photos/7068406/pexels-photo-7068406.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
      badges,
      isBestSeller,
      isNew,
      isFeatured,
      // Department-specific
      keySpec: department === 'electronics' ? keySpec : undefined,
      specs: department === 'electronics' ? specs.filter((s) => s.label && s.value) : undefined,
      material: department === 'fashion' ? material : undefined,
      bagType: department === 'fashion' ? bagType : undefined,
      closure: department === 'fashion' ? closure : undefined,
      dimensions: department === 'fashion' ? dimensions : undefined,
      colors: department === 'fashion' ? colors.filter((c) => c.name) : undefined,
    };

    onSave(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? `Edit Product: ${product.name}` : 'Add New Product'}
      subtitle={product ? `SKU: ${product.id}` : 'Create a new product for the catalog'}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-2 pb-2">
          {(['basic', 'pricing', 'attributes', 'media'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab === 'attributes' ? (department === 'electronics' ? 'Specs' : 'Fashion Details') : tab}
            </button>
          ))}
        </div>

        {/* Tab 1: Basic Info */}
        {activeTab === 'basic' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => {
                    const nextDept = e.target.value as Department;
                    setDepartment(nextDept);
                    const defaultCat = categories.find((c) => c.department === nextDept);
                    if (defaultCat) setCategory(defaultCat.slug);
                  }}
                  className="admin-input"
                >
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="admin-input"
                >
                  {filteredCategories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Aurora, Milano, Apple"
                  className="admin-input"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Subcategory (Optional)
                </label>
                <input
                  type="text"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  placeholder="e.g. smartphones, earbuds"
                  className="admin-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Product Title / Name
              </label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. Aurora X5 Pro Smartphone"
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
                placeholder="aurora-x5-pro-smartphone"
                className="admin-input text-slate-400 font-mono text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Write an engaging product description..."
                className="admin-input resize-none"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Pricing & Inventory */}
        {activeTab === 'pricing' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Selling Price (LKR)
                </label>
                <input
                  type="number"
                  min="0"
                  value={price || ''}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="89990"
                  className="admin-input text-emerald-400 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Original / Old Price (LKR - optional)
                </label>
                <input
                  type="number"
                  min="0"
                  value={oldPrice ?? ''}
                  onChange={(e) => setOldPrice(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="99990"
                  className="admin-input text-slate-400"
                />
                <span className="text-[10px] text-slate-500">
                  Set higher than price to automatically trigger a SALE badge.
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Available Stock Count
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="admin-input"
                required
              />
              <span className="text-[10px] text-slate-500">
                Products with stock &le; 5 will automatically trigger low stock warnings.
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-3">
                Feature Badges & Highlights
              </label>
              <div className="grid grid-cols-3 gap-3">
                <label className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-0"
                  />
                  <span>Best Seller</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-0"
                  />
                  <span>New Arrival</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-0"
                  />
                  <span>Featured Hero</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Attributes (Specs / Fashion) */}
        {activeTab === 'attributes' && (
          <div className="space-y-4">
            {department === 'electronics' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Key Spec Highlight Line
                  </label>
                  <input
                    type="text"
                    value={keySpec}
                    onChange={(e) => setKeySpec(e.target.value)}
                    placeholder="e.g. 6.7'' AMOLED • 5G • 256GB"
                    className="admin-input"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Technical Specifications
                    </label>
                    <button
                      type="button"
                      onClick={() => setSpecs([...specs, { label: '', value: '' }])}
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
                    >
                      <Plus size={13} /> Add Spec
                    </button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {specs.map((spec, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={spec.label}
                          onChange={(e) => {
                            const updated = [...specs];
                            updated[i].label = e.target.value;
                            setSpecs(updated);
                          }}
                          placeholder="Spec Name (e.g. RAM)"
                          className="admin-input !py-1.5 w-1/3 text-xs"
                        />
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => {
                            const updated = [...specs];
                            updated[i].value = e.target.value;
                            setSpecs(updated);
                          }}
                          placeholder="Value (e.g. 16GB)"
                          className="admin-input !py-1.5 flex-1 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))}
                          className="p-1 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Material
                    </label>
                    <input
                      type="text"
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      placeholder="e.g. Heavyweight Canvas + Vegan Leather"
                      className="admin-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Bag Type
                    </label>
                    <input
                      type="text"
                      value={bagType}
                      onChange={(e) => setBagType(e.target.value)}
                      placeholder="e.g. Tote Bag, Crossbody"
                      className="admin-input text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Closure
                    </label>
                    <input
                      type="text"
                      value={closure}
                      onChange={(e) => setClosure(e.target.value)}
                      placeholder="e.g. Magnetic Snap, Zip-around"
                      className="admin-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Dimensions
                    </label>
                    <input
                      type="text"
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                      placeholder="e.g. 38cm x 30cm x 14cm"
                      className="admin-input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Color Variants
                    </label>
                    <button
                      type="button"
                      onClick={() => setColors([...colors, { name: '', hex: '#2563EB' }])}
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
                    >
                      <Plus size={13} /> Add Color
                    </button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {colors.map((c, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="color"
                          value={c.hex}
                          onChange={(e) => {
                            const updated = [...colors];
                            updated[i].hex = e.target.value;
                            setColors(updated);
                          }}
                          className="w-8 h-8 rounded border border-slate-700 bg-slate-900 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={c.name}
                          onChange={(e) => {
                            const updated = [...colors];
                            updated[i].name = e.target.value;
                            setColors(updated);
                          }}
                          placeholder="Color Name (e.g. Oatmeal & Tan)"
                          className="admin-input !py-1.5 flex-1 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setColors(colors.filter((_, idx) => idx !== i))}
                          className="p-1 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Media Gallery */}
        {activeTab === 'media' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                Image URLs (Direct link or CDN)
              </label>
              <button
                type="button"
                onClick={() => setImages([...images, ''])}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
              >
                <Plus size={13} /> Add Image URL
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {images.map((img, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                    {img ? (
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={14} className="text-slate-500" />
                    )}
                  </div>
                  <input
                    type="url"
                    value={img}
                    onChange={(e) => {
                      const updated = [...images];
                      updated[i] = e.target.value;
                      setImages(updated);
                    }}
                    placeholder="https://images.pexels.com/..."
                    className="admin-input !py-1.5 flex-1 text-xs font-mono"
                  />
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                      className="p-1 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
              💡 Tip: The first image will be used as the primary catalog thumbnail across the store.
            </div>
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="admin-btn-secondary !text-xs !py-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="admin-btn-primary !text-xs !py-2"
          >
            {product ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
