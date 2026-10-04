import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiFilter, FiX, FiSliders, FiRefreshCw } from 'react-icons/fi';
import { fetchProducts, loadCatalog } from '../slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import Pagination from '../components/common/Pagination';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const SkeletonCard = () => (
  <div className="product-card overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-200 dark:bg-dark-border" />
    <div className="p-4 space-y-2">
      <div className="h-3 bg-gray-200 dark:bg-dark-border rounded w-1/3" />
      <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-full" />
      <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-2/3" />
      <div className="h-5 bg-gray-200 dark:bg-dark-border rounded w-1/2 mt-3" />
    </div>
  </div>
);

const ProductsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, catalogLoading, page, pages, total, error } = useSelector((s) => s.products);

  const [showFilters, setShowFilters] = useState(false);

  // ── Derive filter values directly from URL params (single source of truth) ──
  const urlCategory = searchParams.get('category') || '';
  const urlSearch   = searchParams.get('search')   || '';
  const urlSort     = searchParams.get('sort')      || 'newest';
  const urlPage     = Number(searchParams.get('page')) || 1;
  const urlMinPrice = searchParams.get('minPrice')  || '';
  const urlMaxPrice = searchParams.get('maxPrice')  || '';
  const urlRating   = searchParams.get('rating')    || '';

  // Local state only for the sidebar inputs (not yet applied to URL)
  const [localSearch,   setLocalSearch]   = useState(urlSearch);
  const [localMinPrice, setLocalMinPrice] = useState(urlMinPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(urlMaxPrice);
  const [localRating,   setLocalRating]   = useState(urlRating);

  // ── Whenever URL params change, fetch products ──
  useEffect(() => {
    const run = async () => {
      // Ensure catalog is loaded first
      await dispatch(loadCatalog());
      dispatch(fetchProducts({
        category: urlCategory,
        search:   urlSearch,
        sort:     urlSort,
        page:     urlPage,
        minPrice: urlMinPrice,
        maxPrice: urlMaxPrice,
        rating:   urlRating,
        limit:    20,
      }));
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlCategory, urlSearch, urlSort, urlPage, urlMinPrice, urlMaxPrice, urlRating]);

  // ── Helpers to update URL (which triggers the effect above) ──
  const updateParams = (overrides) => {
    const next = {
      ...(urlCategory  && { category: urlCategory }),
      ...(urlSearch    && { search:   urlSearch }),
      ...(urlSort !== 'newest' && { sort: urlSort }),
      ...(urlPage > 1  && { page:     String(urlPage) }),
      ...(urlMinPrice  && { minPrice: urlMinPrice }),
      ...(urlMaxPrice  && { maxPrice: urlMaxPrice }),
      ...(urlRating    && { rating:   urlRating }),
      ...overrides,
    };
    // Remove empty values
    Object.keys(next).forEach((k) => { if (!next[k]) delete next[k]; });
    setSearchParams(next);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ search: localSearch, page: undefined });
  };

  const handleApplyFilters = () => {
    updateParams({
      minPrice: localMinPrice,
      maxPrice: localMaxPrice,
      rating:   localRating,
      page:     undefined,
    });
    setShowFilters(false);
  };

  const resetFilters = () => {
    setLocalSearch('');
    setLocalMinPrice('');
    setLocalMaxPrice('');
    setLocalRating('');
    setSearchParams({});
  };

  const hasActiveFilters = urlCategory || urlMinPrice || urlMaxPrice || urlRating || urlSearch;
  const isLoading = loading || catalogLoading;

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wider">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio" name="cat" className="accent-primary-500"
              checked={!urlCategory}
              onChange={() => updateParams({ category: undefined, page: undefined })}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">All Categories</span>
          </label>
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio" name="cat" className="accent-primary-500"
                checked={urlCategory === cat}
                onChange={() => updateParams({ category: cat, page: undefined })}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wider">Price Range (₹)</h3>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={localMinPrice}
            onChange={(e) => setLocalMinPrice(e.target.value)}
            className="input-field text-sm py-2" min="0" />
          <input type="number" placeholder="Max" value={localMaxPrice}
            onChange={(e) => setLocalMaxPrice(e.target.value)}
            className="input-field text-sm py-2" min="0" />
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wider">Min Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio" name="rating" className="accent-primary-500"
                checked={Number(localRating) === r}
                onChange={() => setLocalRating(String(r))}
              />
              <span className="text-sm text-amber-400">{'★'.repeat(r)}{'☆'.repeat(5 - r)}</span>
              <span className="text-xs text-gray-500">& up</span>
            </label>
          ))}
        </div>
      </div>

      <button onClick={handleApplyFilters} className="btn-primary w-full text-sm py-2">Apply Filters</button>
      {hasActiveFilters && (
        <button onClick={resetFilters} className="btn-secondary w-full text-sm py-2 flex items-center justify-center gap-1">
          <FiX size={14} /> Clear All
        </button>
      )}
    </div>
  );

  return (
    <div className="container-custom py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="hidden md:block w-60 shrink-0">
          <div className="card p-5 sticky top-20">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FiSliders size={16} /> Filters
              </h2>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="text-xs text-primary-500 hover:text-primary-600">Reset</button>
              )}
            </div>
            <FilterPanel />
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h1 className="section-title text-xl">
                {urlCategory || urlSearch ? (urlCategory || `"${urlSearch}"`) : 'All Products'}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {isLoading ? 'Loading...' : `${total} results found`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(true)}
                className="md:hidden btn-secondary text-sm py-2 px-3 flex items-center gap-1"
              >
                <FiFilter size={14} /> Filters
              </button>
              <select
                value={urlSort}
                onChange={(e) => updateParams({ sort: e.target.value, page: undefined })}
                className="input-field text-sm py-2 w-auto"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-5">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search by name, brand, category..."
              className="input-field text-sm"
            />
            <button type="submit" className="btn-primary text-sm py-2 px-5 shrink-0">Search</button>
          </form>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {urlCategory && (
                <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 gap-1">
                  {urlCategory}
                  <button onClick={() => updateParams({ category: undefined, page: undefined })}><FiX size={12} /></button>
                </span>
              )}
              {(urlMinPrice || urlMaxPrice) && (
                <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 gap-1">
                  ₹{urlMinPrice || 0} – ₹{urlMaxPrice || '∞'}
                  <button onClick={() => { setLocalMinPrice(''); setLocalMaxPrice(''); updateParams({ minPrice: undefined, maxPrice: undefined }); }}><FiX size={12} /></button>
                </span>
              )}
              {urlRating && (
                <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 gap-1">
                  {urlRating}★+
                  <button onClick={() => { setLocalRating(''); updateParams({ rating: undefined }); }}><FiX size={12} /></button>
                </span>
              )}
              {urlSearch && (
                <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 gap-1">
                  "{urlSearch}"
                  <button onClick={() => { setLocalSearch(''); updateParams({ search: undefined }); }}><FiX size={12} /></button>
                </span>
              )}
            </div>
          )}

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 20 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">⚠️</p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Failed to load products</p>
              <p className="text-gray-500 mt-1 mb-4">Check your connection and try again.</p>
              <button
                onClick={() => dispatch(fetchProducts({ category: urlCategory, search: urlSearch, sort: urlSort, page: urlPage, limit: 20 }))}
                className="btn-primary inline-flex items-center gap-2"
              >
                <FiRefreshCw size={14} /> Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">No products found</p>
              <p className="text-gray-500 mt-1">Try adjusting your filters or search terms</p>
              <button onClick={resetFilters} className="btn-primary mt-4 inline-flex">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
              <Pagination
                page={page}
                pages={pages}
                onPageChange={(p) => updateParams({ page: p > 1 ? String(p) : undefined })}
              />
            </>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-dark-surface p-5 overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 dark:text-white">Filters</h2>
              <button onClick={() => setShowFilters(false)}><FiX /></button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
