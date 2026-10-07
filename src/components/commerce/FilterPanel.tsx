import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, X, Check } from 'lucide-react';

export interface FilterGroup {
  name: string;
  options: { label: string; value: string }[];
}

interface FilterPanelProps {
  filters: FilterGroup[];
  selected: Record<string, string[]>;
  onChange: (name: string, value: string) => void;
  onClear: () => void;
  isMobile?: boolean;
}

export default function FilterPanel({ filters, selected, onChange, onClear, isMobile }: FilterPanelProps) {
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(filters.map((f) => f.name)));

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const activeCount = Object.values(selected).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className={isMobile ? '' : 'hidden lg:block'}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-gray-700" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {activeCount > 0 && (
            <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={onClear} className="text-xs text-blue-600 hover:underline">
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-1">
        {filters.map((group) => {
          const isOpen = openGroups.has(group.name);
          const selectedValues = selected[group.name] || [];
          return (
            <div key={group.name} className="border-b border-gray-100">
              <button
                onClick={() => toggleGroup(group.name)}
                className="flex items-center justify-between w-full py-3 text-sm font-medium text-gray-900"
              >
                {group.name}
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isOpen && (
                <div className="pb-3 space-y-2">
                  {group.options.map((option) => {
                    const checked = selectedValues.includes(option.value);
                    return (
                      <label
                        key={option.value}
                        className="flex items-center gap-2.5 cursor-pointer group"
                      >
                        <button
                          onClick={() => onChange(group.name, option.value)}
                          className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                            checked
                              ? 'bg-blue-600 border-blue-600'
                              : 'border-gray-300 group-hover:border-gray-400'
                          }`}
                        >
                          {checked && <Check size={12} className="text-white" />}
                        </button>
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                          {option.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MobileFilterDrawer({
  open,
  onClose,
  filters,
  selected,
  onChange,
  onClear,
}: {
  open: boolean;
  onClose: () => void;
  filters: FilterGroup[];
  selected: Record<string, string[]>;
  onChange: (name: string, value: string) => void;
  onClear: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] lg:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white overflow-y-auto animate-slide-in">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="font-semibold text-gray-900">Filters</h3>
          <button onClick={onClose} className="text-gray-500" aria-label="Close filters">
            <X size={22} />
          </button>
        </div>
        <div className="p-4">
          <FilterPanel
            filters={filters}
            selected={selected}
            onChange={onChange}
            onClear={onClear}
            isMobile
          />
          <button onClick={onClose} className="btn-primary w-full mt-6">
            Show Results
          </button>
        </div>
      </div>
    </div>
  );
}
