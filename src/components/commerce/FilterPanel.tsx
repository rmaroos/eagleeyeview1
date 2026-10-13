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
    <div className={`bg-white rounded-2xl ${isMobile ? '' : 'p-5 border border-gray-200'}`}>
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={17} className="text-[#15171C]" />
          <h3 className="font-bold text-[#15171C] text-base">Filters</h3>
          {activeCount > 0 && (
            <span className="text-xs font-bold bg-[#2347F5] text-white px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onClear}
            className="text-xs font-semibold text-[#2347F5] hover:underline transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="divide-y divide-gray-100">
        {filters.map((group) => {
          const isOpen = openGroups.has(group.name);
          const selectedValues = selected[group.name] || [];
          return (
            <div key={group.name} className="py-3">
              <button
                type="button"
                onClick={() => toggleGroup(group.name)}
                className="flex items-center justify-between w-full py-1 text-sm font-bold text-[#15171C] hover:text-[#2347F5] transition-colors"
              >
                <span>{group.name}</span>
                <ChevronDown
                  size={15}
                  className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isOpen && (
                <div className="pt-2.5 pb-1 space-y-2">
                  {group.options.map((option) => {
                    const checked = selectedValues.includes(option.value);
                    return (
                      <div
                        key={option.value}
                        onClick={() => onChange(group.name, option.value)}
                        className="flex items-center gap-2.5 cursor-pointer group py-0.5 select-none"
                      >
                        <div
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                            checked
                              ? 'bg-[#2347F5] border-[#2347F5]'
                              : 'border-gray-300 bg-white group-hover:border-gray-400'
                          }`}
                        >
                          {checked && <Check size={11} className="text-white stroke-[3]" />}
                        </div>
                        <span className={`text-sm transition-colors ${checked ? 'font-semibold text-[#15171C]' : 'text-gray-600 group-hover:text-[#15171C]'}`}>
                          {option.label}
                        </span>
                      </div>
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
  resultsCount,
}: {
  open: boolean;
  onClose: () => void;
  filters: FilterGroup[];
  selected: Record<string, string[]>;
  onChange: (name: string, value: string) => void;
  onClear: () => void;
  resultsCount?: number;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="animate-slide-in-left absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-[#15171C]" />
            <h3 className="font-display font-bold text-lg text-[#15171C]">Filter Products</h3>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-gray-500 hover:bg-slate-100"
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <FilterPanel
            filters={filters}
            selected={selected}
            onChange={onChange}
            onClear={onClear}
            isMobile
          />
        </div>

        <div className="p-4 border-t border-gray-100 bg-slate-50 flex gap-2">
          <button
            onClick={onClear}
            className="btn-secondary flex-1 text-xs"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="btn-primary flex-1 text-xs"
          >
            Apply {resultsCount !== undefined ? `(${resultsCount})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
