import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (q: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
}

export default function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
}: QuantitySelectorProps) {
  const btnSize = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  const iconSize = size === 'sm' ? 14 : 16;

  return (
    <div className="inline-flex items-center rounded-lg border border-gray-200">
      <button
        onClick={() => onChange(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
        className={`${btnSize} flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors`}
        aria-label="Decrease quantity"
      >
        <Minus size={iconSize} />
      </button>
      <span className={`w-10 text-center font-semibold text-gray-900 ${size === 'sm' ? 'text-sm' : ''}`}>
        {quantity}
      </span>
      <button
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className={`${btnSize} flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors`}
        aria-label="Increase quantity"
      >
        <Plus size={iconSize} />
      </button>
    </div>
  );
}
