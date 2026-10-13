import { Star } from 'lucide-react';

interface RatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
  showCount?: boolean;
}

export default function Rating({ rating, reviewCount, size = 'sm', showCount = true }: RatingProps) {
  const starSize = size === 'sm' ? 14 : 16;
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => {
          const isFull = i < fullStars;
          const isHalf = i === fullStars && hasHalf;
          return (
            <Star
              key={i}
              size={starSize}
              className={
                isFull || isHalf
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-gray-200 text-gray-200'
              }
            />
          );
        })}
      </div>
      <span className={`font-medium text-gray-700 ${size === 'sm' ? 'text-sm' : 'text-base'}`}>
        {rating.toFixed(1)}
      </span>
      {showCount && reviewCount !== undefined && (
        <span className={`text-gray-400 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
