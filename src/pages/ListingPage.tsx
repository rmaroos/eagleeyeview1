import { useState, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
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
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Best Selling', value: 'best-selling' },
];

export default function ListingPage() {
  const params = useParams();
  const location = useLocation();

  const department = location.pathname.startsWith('/fashion') ? 'fashion' : 'electronics';
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
        name: 'Rating',
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

    if (selectedFilters.Category) {
      result = result.filter((p) => selectedFilters.Category.includes(p.category));
    }

    if (selectedFilters.Brand) {
      result = result.filter((p) => selectedFilters.Brand.includes(p.brand));
    }

    if (selectedFilters.Price) {
      result = result.filter((p) => {
        return selectedFilters.Price.some((range) => {
          const [min, max] = range.split('-').map(Number);
          return p.price >= min && p.price <= max;
        });
      });
    }

    if (selectedFilters.Rating) {
      const minRating = Math.min(...selectedFilters.Rating.map(Number));
      result = result.filter((p) => p.rating >= minRating);
    }

    if (selectedFilters.Availability) {
      if (selectedFilters.Availability.includes('in-stock')) {
        result = result.filter((p) => p.stock > 0);
      }
      if (selectedFilters.Availability.includes('on-sale')) {
        result = result.filter((p) => p.oldPrice !== undefined);
      }
    }

    if (department === 'fashion') {
      if (selectedFilters.Material) {
        result = result.filter((p) => p.material && selectedFilters.Material.includes(p.material));
      }
      if (selectedFilters.Colour) {
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
    ? 'Discover technology for work, entertainment and everyday life.'
    : 'Curated style for everyday life.';

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

  return (
    <div>
      {/* Department Hero */}
      <section className="relative bg-ink-950 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt={pageTitle} className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="relative container-page py-14 lg:py-20">
          <div className="mb-4">
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <h1 className="text-3xl lg:text-[40px] font-bold mb-3">{pageTitle}</h1>
          <p className="text-white/70 max-w-lg">{pageSubtitle}</p>
        </div>
      </section>

      {/* Subcategory navigation */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container-page py-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <a
              href={`/${department}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                !categorySlug ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              All
            </a>
            {deptCategories.map((cat) => (
              <a
                key={cat.id}
                href={`/${department}/${cat.slug}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  categorySlug === cat.slug ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <section className="py-8 lg:py-10">
        <div className="container-page">
          <div className="flex gap-8">
            {/* Sidebar filters - desktop */}
            <aside className="w-60 shrink-0 hidden lg:block">
              <div className="sticky top-24">
                <FilterPanel
                  filters={filterGroups}
                  selected={selectedFilters}
                  onChange={handleFilterChange}
                  onClear={handleClearFilters}
                />
              </div>
            </aside>

            {/* Products */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-5">
                <div className="text-sm text-gray-500">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="flex items-center gap-2 h-10 px-4 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 lg:hidden"
                  >
                    <SlidersHorizontal size={16} />
                    Filters
                  </button>
                  <SortDropdown options={sortOptions} value={sortBy} onChange={setSortBy} />
                </div>
              </div>

              <ProductGrid
                products={filteredProducts}
                variant={department as 'electronics' | 'fashion'}
              />
            </div>
          </div>
        </div>
      </section>

      <MobileFilterDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filterGroups}
        selected={selectedFilters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />
    </div>
  );
}
