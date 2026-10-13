import { useState, useMemo } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ProductGrid from '@/components/commerce/ProductGrid';
import FilterPanel, { MobileFilterDrawer, type FilterGroup } from '@/components/commerce/FilterPanel';
import SortDropdown, { type SortOption } from '@/components/commerce/SortDropdown';
import {
  products,
  categories,
  brands,
  type Department,
  type Product,
} from '@/data/catalog';

const sortOptions: SortOption[] = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Customer Rating', value: 'rating' },
  { label: 'Best Selling', value: 'best-selling' },
];

export default function ListingPage() {
  const params = useParams();
  const location = useLocation();

  const department: Department = location.pathname.startsWith('/fashion') ? 'fashion' : 'electronics';
  const categorySlug = params.categorySlug;

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState('recommended');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const deptCategories = categories.filter((c) => c.department === department);
  const currentCategory = categorySlug
    ? deptCategories.find((c) => c.slug === categorySlug)
    : null;

  const filterGroups: FilterGroup[] = useMemo(() => {
    const groups: FilterGroup[] = [
      {
        name: 'Category',
        options: deptCategories.map((c) => ({ label: c.name, value: c.slug })),
      },
      {
        name: 'Brand',
        options: brands[department as keyof typeof brands].map((b) => ({
          label: b,
          value: b,
        })),
      },
      {
        name: 'Price',
        options: [
          { label: 'Under LKR 10,000', value: '0-10000' },
          { label: 'LKR 10,000 - 25,000', value: '10000-25000' },
          { label: 'LKR 25,000 - 50,000', value: '25000-50000' },
          { label: 'LKR 50,000 - 100,000', value: '50000-100000' },
          { label: 'Over LKR 100,000', value: '100000-999999' },
        ],
      },
      {
        name: 'Customer Rating',
        options: [
          { label: '4.5 & above', value: '4.5' },
          { label: '4.0 & above', value: '4.0' },
          { label: '3.5 & above', value: '3.5' },
        ],
      },
      {
        name: 'Availability',
        options: [
          { label: 'In Stock', value: 'in-stock' },
          { label: 'On Sale', value: 'on-sale' },
        ],
      },
    ];

    if (department === 'fashion') {
      groups.push(
        {
          name: 'Material',
          options: [
            { label: 'Leather', value: 'Leather' },
            { label: 'Premium Leather', value: 'Premium Leather' },
            { label: 'Textured Leather', value: 'Textured Leather' },
            { label: 'Vegan Leather', value: 'Vegan Leather' },
          ],
        },
        {
          name: 'Colour',
          options: [
            { label: 'Black', value: 'Black' },
            { label: 'Brown', value: 'Brown' },
            { label: 'Beige', value: 'Beige' },
            { label: 'Orange', value: 'Orange' },
            { label: 'Red', value: 'Red' },
          ],
        }
      );
    }

    return groups;
  }, [department, deptCategories]);

  const filteredProducts = useMemo(() => {
    let result: Product[] = products.filter((p) => p.department === department);

    if (categorySlug) {
      result = result.filter((p) => p.category === categorySlug);
    }

    if (selectedFilters.Category?.length) {
      result = result.filter((p) => selectedFilters.Category.includes(p.category));
    }

    if (selectedFilters.Brand?.length) {
      result = result.filter((p) => selectedFilters.Brand.includes(p.brand));
    }

    if (selectedFilters.Price?.length) {
      result = result.filter((p) => {
        return selectedFilters.Price.some((range) => {
          const [min, max] = range.split('-').map(Number);
          return p.price >= min && p.price <= max;
        });
      });
    }

    if (selectedFilters['Customer Rating']?.length) {
      const minRating = Math.min(...selectedFilters['Customer Rating'].map(Number));
      result = result.filter((p) => p.rating >= minRating);
    }

    if (selectedFilters.Availability?.length) {
      if (selectedFilters.Availability.includes('in-stock')) {
        result = result.filter((p) => p.stock > 0);
      }
      if (selectedFilters.Availability.includes('on-sale')) {
        result = result.filter((p) => p.oldPrice !== undefined);
      }
    }

    if (department === 'fashion') {
      if (selectedFilters.Material?.length) {
        result = result.filter((p) => p.material && selectedFilters.Material.includes(p.material));
      }
      if (selectedFilters.Colour?.length) {
        result = result.filter((p) =>
          p.colors && p.colors.some((c) => selectedFilters.Colour.includes(c.name))
        );
      }
    }

    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result = [...result].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'best-selling':
        result = [...result].sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
    }

    return result;
  }, [department, categorySlug, selectedFilters, sortBy]);

  const handleFilterChange = (name: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[name] || [];
      const exists = current.includes(value);
      return {
        ...prev,
        [name]: exists ? current.filter((v) => v !== value) : [...current, value],
      };
    });
  };

  const handleClearFilters = () => setSelectedFilters({});

  const pageTitle = currentCategory
    ? currentCategory.name
    : department === 'electronics'
    ? 'Electronics'
    : 'Fashion';

  const pageSubtitle = currentCategory
    ? currentCategory.description || ''
    : department === 'electronics'
    ? 'Discover cutting-edge technology for work, entertainment, and smart living.'
    : 'Curated apparel, handbags, and accessories designed for modern sophistication.';

  const heroImage = currentCategory
    ? currentCategory.image
    : department === 'electronics'
    ? 'https://images.pexels.com/photos/196656/pexels-photo-196656.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
    : 'https://images.pexels.com/photos/9327162/pexels-photo-9327162.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

  const breadcrumbItems: { label: string; href?: string }[] = [
    { label: 'Home', href: '/' },
    { label: department === 'electronics' ? 'Electronics' : 'Fashion', href: `/${department}` },
  ];
  if (currentCategory) {
    breadcrumbItems.push({ label: currentCategory.name });
  }

  const activeFilterList = useMemo(() => {
    const list: { group: string; value: string }[] = [];
    Object.entries(selectedFilters).forEach(([group, values]) => {
      values.forEach((value) => list.push({ group, value }));
    });
    return list;
  }, [selectedFilters]);

  const isFashion = department === 'fashion';
  const accentColor = isFashion ? 'bg-[#7A2E3A] text-white' : 'bg-[#2347F5] text-white';

  return (
    <div className="bg-[#F6F7F9] min-h-screen">
      {/* Department Hero Header */}
      <section className="relative bg-[#15171C] text-white overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt={pageTitle} className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#15171C] via-[#15171C]/80 to-transparent" />
        </div>
        <div className="relative container-page py-10 sm:py-14 lg:py-16">
          <div className="mb-4">
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            {department === 'electronics' ? 'Technology Division' : 'Fashion Studio'}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 text-white">
            {pageTitle}
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-xl leading-relaxed">
            {pageSubtitle}
          </p>
        </div>
      </section>

      {/* Subcategory Pill Bar */}
      <div className="border-b border-gray-200 bg-white sticky top-16 z-20 shadow-xs">
        <div className="container-page py-2.5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <Link
              to={`/${department}`}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                !categorySlug
                  ? accentColor
                  : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
              }`}
            >
              All {department}
            </Link>
            {deptCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/${department}/${cat.slug}`}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  categorySlug === cat.slug
                    ? accentColor
                    : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <section className="py-6 sm:py-8 lg:py-10">
        <div className="container-page">
          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="w-64 shrink-0 hidden lg:block">
              <div className="sticky top-32">
                <FilterPanel
                  filters={filterGroups}
                  selected={selectedFilters}
                  onChange={handleFilterChange}
                  onClear={handleClearFilters}
                />
              </div>
            </aside>

            {/* Products Column */}
            <div className="flex-1 min-w-0">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div className="text-sm font-medium text-gray-600">
                  Showing <span className="font-bold text-[#15171C]">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'item' : 'items'}
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="flex items-center gap-2 h-10 px-4 rounded-full border border-gray-200 bg-white text-xs sm:text-sm font-semibold text-[#15171C] lg:hidden hover:bg-slate-50 transition-colors shadow-xs"
                  >
                    <SlidersHorizontal size={15} />
                    Filters
                    {activeFilterList.length > 0 && (
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-[#2347F5] text-[10px] font-bold text-white">
                        {activeFilterList.length}
                      </span>
                    )}
                  </button>
                  <SortDropdown options={sortOptions} value={sortBy} onChange={setSortBy} />
                </div>
              </div>

              {/* Active Filter Chips */}
              {activeFilterList.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-xl bg-white border border-gray-200">
                  <span className="text-xs font-semibold text-gray-500">Active filters:</span>
                  {activeFilterList.map(({ group, value }) => (
                    <button
                      key={`${group}-${value}`}
                      onClick={() => handleFilterChange(group, value)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 hover:bg-slate-200 px-3 py-1 text-xs font-semibold text-gray-700 transition-colors"
                    >
                      <span>{value}</span>
                      <X size={12} className="text-gray-400 hover:text-gray-700" />
                    </button>
                  ))}
                  <button
                    onClick={handleClearFilters}
                    className="text-xs font-bold text-[#2347F5] hover:underline ml-1"
                  >
                    Reset all
                  </button>
                </div>
              )}

              {/* Product Grid */}
              <ProductGrid
                products={filteredProducts}
                variant={department}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filters Drawer */}
      <MobileFilterDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filterGroups}
        selected={selectedFilters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
        resultsCount={filteredProducts.length}
      />
    </div>
  );
}
