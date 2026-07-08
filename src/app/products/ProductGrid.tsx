"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import ProductCard from '@/components/ProductCard';
import { formatPrice, parseWooCommercePrice } from '@/utils/formatting';
import { useDebounce } from '@/hooks/useDebounce';

import FilterSidebar from '@/components/ui/FilterSidebar';
import { FilterIcon, XMarkIcon } from '@/components/ui/icons';
import { ProductNode, ProductCategory } from '@/types';

const MASTER_BRANDS_LIST = ['سیسکو', 'میکروتیک', 'اچ پی', 'Aruba', 'FortiGate'];
const PRODUCTS_PER_PAGE = 12;

// Extracted FilterSidebar into its own component.

// --- Main Grid Component ---
export default function ProductGrid({ allProducts }: { allProducts: ProductNode[] }) {
  const [sortBy, setSortBy] = useState('default');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceInputs, setPriceInputs] = useState({ min: '', max: '' });
  const [activePriceFilter, setActivePriceFilter] = useState({ min: 0, max: Infinity });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<string[]>(['category']);
  const [displayedCount, setDisplayedCount] = useState(PRODUCTS_PER_PAGE);

  const debouncedPriceInputs = useDebounce(priceInputs, 500);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const min = debouncedPriceInputs.min.trim() === '' ? 0 : parseWooCommercePrice(debouncedPriceInputs.min.toString());
    const max = debouncedPriceInputs.max.trim() === '' ? Infinity : parseWooCommercePrice(debouncedPriceInputs.max.toString());
    setActivePriceFilter({ min, max: max === 0 ? Infinity : max });
  }, [debouncedPriceInputs]);

  const handleAccordionToggle = useCallback((name: string) => {
    setOpenAccordions(prev =>
      prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
    );
  }, []);

  const { availableBrands, availableCategories } = useMemo(() => {
    const brandSet = new Set<string>();
    const categoryMap = new Map<string, ProductCategory>();

    allProducts.forEach(p => {
      MASTER_BRANDS_LIST.forEach(brand => {
        if (p.name.toLowerCase().includes(brand.toLowerCase())) {
          brandSet.add(brand);
        }
      });
      p.productCategories?.nodes?.forEach(cat => {
        if (!categoryMap.has(cat.slug)) {
          categoryMap.set(cat.slug, cat);
        }
      });
    });

    return {
      availableBrands: Array.from(brandSet),
      availableCategories: Array.from(categoryMap.values()),
    };
  }, [allProducts]);

  const [minPrice, maxPrice] = useMemo(() => {
    if (allProducts.length === 0) return [0, 1000000];
    const prices = allProducts.map(p => parseWooCommercePrice(p.price)).filter(p => p > 0);
    if (prices.length === 0) return [0, 1000000];
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [allProducts]);

  const handleBrandChange = useCallback((brand: string) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  }, []);

  const handleCategoryChange = useCallback((categorySlug: string) => {
    setSelectedCategories(prev => prev.includes(categorySlug) ? prev.filter(c => c !== categorySlug) : [...prev, categorySlug]);
  }, []);

  const handlePriceChange = useCallback((field: 'min' | 'max', value: string) => {
    setPriceInputs(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const resetPriceFilter = useCallback(() => {
    setPriceInputs({ min: '', max: '' });
    setActivePriceFilter({ min: 0, max: Infinity });
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSearchQuery('');
    resetPriceFilter();
    setSortBy('default');
  }, [resetPriceFilter]);

  const filteredAndSortedProducts = useMemo(() => {
    let products = [...allProducts];

    // Search filter
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.trim().toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(query));
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      products = products.filter(p => selectedBrands.some(brand => p.name.toLowerCase().includes(brand.toLowerCase())));
    }

    // Category filter
    if (selectedCategories.length > 0) {
      products = products.filter(p => p.productCategories?.nodes?.some(cat => selectedCategories.includes(cat.slug)));
    }

    // Price filter — products with no price (0) pass through if no min price filter is set
    const isPriceFiltering = activePriceFilter.min > 0 || activePriceFilter.max < Infinity;
    if (isPriceFiltering) {
      products = products.filter(p => {
        const price = parseWooCommercePrice(p.price);
        // Products with no valid price: show them only if no specific min is set
        if (price === 0) {
          return activePriceFilter.min === 0;
        }
        return price >= activePriceFilter.min && price <= activePriceFilter.max;
      });
    }

    // Sorting
    if (sortBy === 'price-asc') {
      products.sort((a, b) => parseWooCommercePrice(a.price) - parseWooCommercePrice(b.price));
    } else if (sortBy === 'price-desc') {
      products.sort((a, b) => parseWooCommercePrice(b.price) - parseWooCommercePrice(a.price));
    }

    return products;
  }, [allProducts, sortBy, selectedBrands, selectedCategories, activePriceFilter, debouncedSearchQuery]);

  // Reset pagination when filters change — use a stable key derived from filter values
  // instead of the array reference (which changes identity on every recalculation)
  const filterKey = `${sortBy}-${selectedBrands.join(',')}-${selectedCategories.join(',')}-${activePriceFilter.min}-${activePriceFilter.max}-${debouncedSearchQuery}`;
  useEffect(() => {
    setDisplayedCount(PRODUCTS_PER_PAGE);
  }, [filterKey]);

  const isPriceFilterActive = activePriceFilter.min > 0 || (activePriceFilter.max < Infinity && activePriceFilter.max > 0);
  const areAnyFiltersActive = selectedBrands.length > 0 || selectedCategories.length > 0 || isPriceFilterActive || debouncedSearchQuery.trim().length > 0;

  return (
    <div className="lg:grid lg:grid-cols-4 lg:gap-8">
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 text-sky-400 font-semibold rounded-lg shadow-md"
          aria-controls="filter-sidebar"
          aria-expanded={isFilterOpen}
        >
          <FilterIcon className="w-5 h-5" />
          {isFilterOpen ? 'بستن فیلترها' : 'نمایش فیلترها'}
        </button>
      </div>
      <div id="filter-sidebar" className={`${isFilterOpen ? 'block' : 'hidden'} lg:block mb-8 lg:mb-0`}>
        <FilterSidebar
          availableCategories={availableCategories}
          availableBrands={availableBrands}
          selectedCategories={selectedCategories}
          selectedBrands={selectedBrands}
          priceInputs={priceInputs}
          minPrice={minPrice}
          maxPrice={maxPrice}
          searchQuery={searchQuery}
          areAnyFiltersActive={areAnyFiltersActive}
          openAccordions={openAccordions}
          onCategoryChange={handleCategoryChange}
          onBrandChange={handleBrandChange}
          onPriceChange={handlePriceChange}
          onSearchChange={handleSearchChange}
          onClearAll={clearAllFilters}
          onAccordionToggle={handleAccordionToggle}
        />
      </div>
      <main className="lg:col-span-3">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 p-4 bg-slate-800/60 rounded-lg gap-4">
          <p className="text-sm text-gray-400">
            نمایش {Math.min(displayedCount, filteredAndSortedProducts.length)} از {areAnyFiltersActive ? `${filteredAndSortedProducts.length} (از ${allProducts.length})` : allProducts.length} محصول
          </p>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-gray-200 focus:ring-sky-500 focus:border-sky-500 transition-colors text-sm"
          >
            <option value="default">پیشنهاد ما</option>
            <option value="price-asc">قیمت: ارزان به گران</option>
            <option value="price-desc">قیمت: گران به ارزان</option>
          </select>
        </div>

        {areAnyFiltersActive && (
          <div className="mb-4 flex flex-wrap items-center gap-2 min-h-[2.25rem]">
            {debouncedSearchQuery.trim() && (
              <span className="inline-flex items-center gap-x-2 bg-sky-900/70 text-sky-300 text-sm font-medium pl-3 pr-2 py-1 rounded-full">
                <button onClick={() => setSearchQuery('')} className="text-sky-400 hover:text-white rounded-full hover:bg-sky-700 p-0.5 transition-colors" aria-label="Remove search filter">
                  <XMarkIcon className="h-4 w-4" />
                </button>
                <span>جستجو: {debouncedSearchQuery}</span>
              </span>
            )}
            {selectedCategories.map(slug => {
              const category = availableCategories.find(c => c.slug === slug);
              return category ? (
                <span key={slug} className="inline-flex items-center gap-x-2 bg-sky-900/70 text-sky-300 text-sm font-medium pl-3 pr-2 py-1 rounded-full">
                  <button onClick={() => handleCategoryChange(slug)} className="text-sky-400 hover:text-white rounded-full hover:bg-sky-700 p-0.5 transition-colors" aria-label={`Remove ${category.name} filter`}>
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                  <span>{category.name}</span>
                </span>
              ) : null;
            })}
            {selectedBrands.map(brand => (
              <span key={brand} className="inline-flex items-center gap-x-2 bg-sky-900/70 text-sky-300 text-sm font-medium pl-3 pr-2 py-1 rounded-full">
                <button onClick={() => handleBrandChange(brand)} className="text-sky-400 hover:text-white rounded-full hover:bg-sky-700 p-0.5 transition-colors" aria-label={`Remove ${brand} filter`}>
                  <XMarkIcon className="h-4 w-4" />
                </button>
                <span>{brand}</span>
              </span>
            ))}
            {isPriceFilterActive && (
              <span className="inline-flex items-center gap-x-2 bg-sky-900/70 text-sky-300 text-sm font-medium pl-3 pr-2 py-1 rounded-full">
                <button onClick={resetPriceFilter} className="text-sky-400 hover:text-white rounded-full hover:bg-sky-700 p-0.5 transition-colors" aria-label="Remove price filter">
                  <XMarkIcon className="h-4 w-4" />
                </button>
                <span>
                  {formatPrice(activePriceFilter.min, '')} - {activePriceFilter.max === Infinity ? 'بالاتر' : formatPrice(activePriceFilter.max, '')}
                </span>
              </span>
            )}
          </div>
        )}

        {filteredAndSortedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredAndSortedProducts.slice(0, displayedCount).map((product, index) => (
                <div key={product.id} className={index >= displayedCount - PRODUCTS_PER_PAGE ? 'product-fade-in' : ''}>
                  <ProductCard product={product} index={index} isFeatured={false} />
                </div>
              ))}
            </div>
            {displayedCount < filteredAndSortedProducts.length && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setDisplayedCount(prev => prev + PRODUCTS_PER_PAGE)}
                  className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-sky-300 font-semibold rounded-lg shadow-md transition-colors duration-300"
                >
                  نمایش بیشتر
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-slate-800/50 rounded-xl">
            <p className="text-xl text-gray-400">محصولی با فیلترهای انتخابی یافت نشد.</p>
          </div>
        )}
      </main>
    </div>
  );
}