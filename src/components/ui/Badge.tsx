interface BadgeProps {
  variant: 'sale' | 'new' | 'bestseller' | 'limited' | 'comingsoon' | 'custom';
  children: string;
  className?: string;
}

const variantStyles: Record<BadgeProps['variant'], string> = {
  sale: 'bg-red-500 text-white',
  new: 'bg-blue-600 text-white',
  bestseller: 'bg-amber-500 text-white',
  limited: 'bg-orange-500 text-white',
  comingsoon: 'bg-gray-700 text-white',
  custom: 'bg-gray-100 text-gray-700',
};

export default function Badge({ variant, children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold leading-tight ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function getBadgeVariant(badge: string): BadgeProps['variant'] {
  const lower = badge.toLowerCase();
  if (lower === 'sale') return 'sale';
  if (lower === 'new') return 'new';
  if (lower === 'best seller') return 'bestseller';
  if (lower === 'limited') return 'limited';
  if (lower === 'coming soon') return 'comingsoon';
  return 'custom';
}
