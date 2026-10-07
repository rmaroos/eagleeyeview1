import HeroSlider from '@/components/sections/HeroSlider';
import {
  DepartmentIntro,
  CategorySection,
  ProductSection,
  PromoBanner,
  EditorialBanner,
  BenefitsSection,
} from '@/components/sections/HomeSections';
import {
  getCategoriesByDepartment,
  getBestSellers,
  getFeaturedProducts,
  getNewArrivals,
} from '@/data/catalog';

export default function HomePage() {
  const electronicsCategories = getCategoriesByDepartment('electronics');
  const fashionCategories = getCategoriesByDepartment('fashion');
  const electronicsBestSellers = getBestSellers('electronics');
  const electronicsFeatured = getFeaturedProducts('electronics');
  const fashionFeatured = getFeaturedProducts('fashion');
  const newArrivals = getNewArrivals();

  return (
    <>
      <HeroSlider />

      {/* Electronics Introduction */}
      <DepartmentIntro
        eyebrow="Explore Electronics"
        title="Technology for work, entertainment and everyday life"
        subtitle="Smart technology designed to power your day. Discover the latest in mobile, computing, audio and more."
        ctaLabel="Shop All Electronics"
        ctaHref="/electronics"
        image="https://images.pexels.com/photos/265144/pexels-photo-265144.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
      />

      {/* Electronics Categories */}
      <CategorySection
        title="Shop Electronics"
        subtitle="Browse our technology departments"
        categories={electronicsCategories}
        viewAllHref="/electronics"
      />

      {/* Electronics Best Sellers */}
      <ProductSection
        eyebrow="Most Popular"
        title="Best Sellers in Electronics"
        subtitle="Popular technology customers are choosing now."
        products={electronicsBestSellers}
        viewAllHref="/best-sellers"
        variant="electronics"
      />

      {/* Electronics Promo Banner */}
      <PromoBanner
        eyebrow="Summer Sale"
        title="Up to 20% off selected electronics"
        subtitle="Upgrade your setup with premium technology at special prices for a limited time."
        ctaLabel="Shop Now"
        ctaHref="/deals"
        image="https://images.pexels.com/photos/11129922/pexels-photo-11129922.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
        bgClass="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800"
      />

      {/* Electronics Featured Collection */}
      <ProductSection
        eyebrow="Curated Picks"
        title="Featured Electronics"
        subtitle="Selected products we think you'll love."
        products={electronicsFeatured}
        viewAllHref="/electronics"
        variant="electronics"
      />

      {/* Fashion Introduction */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container-page text-center max-w-2xl mx-auto">
          <div className="eyebrow mb-3">Discover Fashion</div>
          <h2 className="text-3xl lg:text-[40px] font-bold leading-tight mb-4">
            Style for every day
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Explore our curated Fashion collection, starting with Ladies Handbags — designed for everyday elegance and convenience.
          </p>
          <a href="/fashion" className="btn-dark">
            Explore Fashion
          </a>
        </div>
      </section>

      {/* Fashion Categories */}
      <CategorySection
        title="Explore Fashion"
        subtitle="Browse our fashion departments"
        categories={fashionCategories}
        viewAllHref="/fashion"
        large
      />

      {/* Ladies Handbags Featured Section */}
      <ProductSection
        eyebrow="Signature Collection"
        title="Ladies Handbags"
        subtitle="Discover handbags selected for everyday style and convenience."
        products={fashionFeatured.slice(0, 4)}
        viewAllHref="/fashion/ladies-handbags"
        variant="fashion"
      />

      {/* Fashion Featured Products */}
      <ProductSection
        eyebrow="More to Explore"
        title="Featured Fashion"
        subtitle="Complete your look with our curated accessories."
        products={fashionFeatured.slice(2).concat(fashionFeatured.slice(0, 2))}
        viewAllHref="/fashion"
        variant="fashion"
      />

      {/* Fashion Editorial Banner */}
      <EditorialBanner
        image="https://images.pexels.com/photos/8989582/pexels-photo-8989582.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
        eyebrow="Find Your Style"
        title="Carry your everyday elegance"
        subtitle="Premium leather handbags designed for the modern woman. Timeless craftsmanship meets contemporary design."
        ctaLabel="Shop Collection"
        ctaHref="/fashion/ladies-handbags"
      />

      {/* New Arrivals */}
      <ProductSection
        eyebrow="Just Arrived"
        title="New Arrivals"
        subtitle="The latest additions across both departments."
        products={newArrivals}
        viewAllHref="/new-arrivals"
      />

      {/* Benefits / Trust */}
      <BenefitsSection />
    </>
  );
}
