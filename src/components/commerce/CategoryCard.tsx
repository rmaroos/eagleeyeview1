import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Category } from '@/data/catalog';

export default function CategoryCard({ category, large = false }: { category: Category; large?: boolean }) {
  const href =
    category.department === 'electronics'
      ? `/electronics/${category.slug}`
      : `/fashion/${category.slug}`;

  return (
    <Link
      to={href}
      className={`group relative block overflow-hidden rounded-xl bg-gray-100 ${
        large ? 'aspect-[4/5]' : 'aspect-[4/3]'
      }`}
    >
      <img
        src={category.image}
        alt={category.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className={`font-semibold text-white ${large ? 'text-lg' : 'text-base'}`}>
          {category.name}
        </h3>
        <div className="flex items-center gap-1 text-sm text-white/80 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Explore <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
}
