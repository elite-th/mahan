import React from 'react';
import { ProductCategory } from '@/types';
import { formatPrice } from '@/utils/formatting';
import { ChevronDownIcon, SearchIcon } from '@/components/ui/icons';

// --- Checkbox Component (fixed peer selector issue) ---
const FilterCheckbox: React.FC<{
  label: string;
  checked: boolean;
  onChange: () => void;
}> = ({ label, checked, onChange }) => (
  <label className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer group p-1">
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${checked
        ? 'bg-[var(--accent)] border-[var(--accent)]'
        : 'border-[var(--border)] group-hover:border-[var(--accent)]'
        }`}
    >
      {checked && (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 text-[var(--text)]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      )}
    </button>
    <span className={`font-medium transition-colors ${checked ? 'text-[var(--accent-hover)]' : 'text-[var(--text-muted)] group-hover:text-[var(--accent-hover)]'}`}>{label}</span>
  </label>
);

// --- Accordion Component ---
type AccordionItemProps = {
  title: string;
  name: string;
  isOpen: boolean;
  onToggle: (name: string) => void;
  children: React.ReactNode;
};

const AccordionItem: React.FC<AccordionItemProps> = ({ title, name, isOpen, onToggle, children }) => {
  return (
    <div className="border-b border-[var(--border)]">
      <button onClick={() => onToggle(name)} className="w-full flex justify-between items-center py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-md" aria-expanded={isOpen}>
        <h4 className="text-lg font-semibold text-[var(--text)]">{title}</h4>
        <ChevronDownIcon className={`w-5 h-5 text-[var(--accent)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden pb-4">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Filter Sidebar Component (extracted outside to prevent remounts) ---
export interface FilterSidebarProps {
  availableCategories: ProductCategory[];
  availableBrands: string[];
  selectedCategories: string[];
  selectedBrands: string[];
  priceInputs: { min: string; max: string };
  minPrice: number;
  maxPrice: number;
  searchQuery: string;
  areAnyFiltersActive: boolean;
  openAccordions: string[];
  onCategoryChange: (slug: string) => void;
  onBrandChange: (brand: string) => void;
  onPriceChange: (field: 'min' | 'max', value: string) => void;
  onSearchChange: (value: string) => void;
  onClearAll: () => void;
  onAccordionToggle: (name: string) => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  availableCategories,
  availableBrands,
  selectedCategories,
  selectedBrands,
  priceInputs,
  minPrice,
  maxPrice,
  searchQuery,
  areAnyFiltersActive,
  openAccordions,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onSearchChange,
  onClearAll,
  onAccordionToggle,
}) => (
  <aside className="lg:col-span-1">
    <div className="sticky top-24 space-y-2 bg-[var(--surface-1)] p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-[var(--accent-hover)]">فیلترها</h3>
        {areAnyFiltersActive && (
          <button onClick={onClearAll} className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] hover:underline transition-colors">
            پاک کردن همه
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-2">
        <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none" />
        <input
          type="text"
          placeholder="جستجوی محصول..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pr-10 pl-4 py-2.5 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors text-sm placeholder:text-[var(--text-muted)]"
          aria-label="جستجوی محصول"
        />
      </div>

      <AccordionItem title="دسته‌بندی" name="category" isOpen={openAccordions.includes('category')} onToggle={onAccordionToggle}>
        <div className="space-y-1">
          {availableCategories.length > 0 ? (
            availableCategories.map(cat => (
              <FilterCheckbox
                key={cat.slug}
                label={cat.name}
                checked={selectedCategories.includes(cat.slug)}
                onChange={() => onCategoryChange(cat.slug)}
              />
            ))
          ) : (
            <p className="text-sm text-[var(--text-faint)] py-2">دسته‌بندی موجود نیست</p>
          )}
        </div>
      </AccordionItem>

      <AccordionItem title="قیمت" name="price" isOpen={openAccordions.includes('price')} onToggle={onAccordionToggle}>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder={`از ${formatPrice(minPrice, '')}`}
            value={priceInputs.min}
            onChange={(e) => onPriceChange('min', e.target.value)}
            className="w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors text-sm placeholder:text-[var(--text-muted)]"
            aria-label="حداقل قیمت"
            min="0"
          />
          <span className="text-[var(--text-muted)] flex-shrink-0">-</span>
          <input
            type="number"
            placeholder={`تا ${formatPrice(maxPrice, '')}`}
            value={priceInputs.max}
            onChange={(e) => onPriceChange('max', e.target.value)}
            className="w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors text-sm placeholder:text-[var(--text-muted)]"
            aria-label="حداکثر قیمت"
            min="0"
          />
        </div>
      </AccordionItem>

      <AccordionItem title="برند" name="brand" isOpen={openAccordions.includes('brand')} onToggle={onAccordionToggle}>
        <div className="space-y-1">
          {availableBrands.length > 0 ? (
            availableBrands.map(brand => (
              <FilterCheckbox
                key={brand}
                label={brand}
                checked={selectedBrands.includes(brand)}
                onChange={() => onBrandChange(brand)}
              />
            ))
          ) : (
            <p className="text-sm text-[var(--text-faint)] py-2">برندی موجود نیست</p>
          )}
        </div>
      </AccordionItem>
    </div>
  </aside>
);

export default FilterSidebar;
