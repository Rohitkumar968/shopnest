import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiPackage } from 'react-icons/fi';
import { loadCatalog, deleteProduct } from '../../slices/productSlice';
import { PageLoader } from '../../components/common/Spinner';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';

const PAGE_SIZE = 20;

// Only MongoDB products have a 24-char hex _id — catalog products use dj_/bk_/ty_/etc.
const isMongoId = (id) => /^[a-f\d]{24}$/i.test(String(id));

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { allProducts, catalogLoading } = useSelector((s) => s.products);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load the full catalog on mount (cache-aware — won't re-fetch if already loaded)
  useEffect(() => {
    dispatch(loadCatalog());
  }, [dispatch]);

  // Client-side search + pagination over the full catalog
  const filtered = useMemo(() => {
    if (!search) return allProducts;
    const q = search.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }, [allProducts, search]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage]
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearch(searchInput);
  };

  const handleClear = () => {
    setSearchInput('');
    setSearch('');
    setCurrentPage(1);
  };

  const handleDelete = useCallback(async (id) => {
    setDeleting(true);
    const result = await dispatch(deleteProduct(id));
    setDeleting(false);
    if (deleteProduct.fulfilled.match(result)) {
      setDeleteConfirm(null);
      // allProducts in Redux is updated by the slice's deleteProduct.fulfilled handler
    } else {
      toast.error(result.payload || 'Failed to delete product');
    }
  }, [dispatch]);

  if (catalogLoading && allProducts.length === 0) return <PageLoader />;

  return (
    <div className="animate-fade-in space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white">Products</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {search
              ? `${total} result${total !== 1 ? 's' : ''} for "${search}" — ${allProducts.length} total`
              : `${total} total products`}
          </p>
        </div>
        <Link to="/admin/products/new" className="btn-primary text-sm py-2">
          <FiPlus size={16} /> Add Product
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, brand, category..."
            className="input-field pl-9 text-sm py-2"
          />
        </div>
        <button type="submit" className="btn-secondary text-sm py-2 px-4">Search</button>
        {search && (
          <button type="button" onClick={handleClear} className="btn-secondary text-sm py-2 px-4">
            Clear
          </button>
        )}
      </form>

      {/* Table */}
      <div className="card overflow-hidden">
        {paginated.length === 0 ? (
          <div className="text-center py-16">
            <FiPackage size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">
              {search ? `No products found for "${search}"` : 'No products in catalog yet'}
            </p>
            {!search && (
              <Link to="/admin/products/new" className="btn-primary inline-flex mt-4 text-sm">
                Add First Product
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-dark-bg text-left text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium hidden sm:table-cell">Category</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">Stock</th>
                  <th className="px-5 py-3 font-medium hidden lg:table-cell">Rating</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                {paginated.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images?.[0]?.url}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-dark-bg shrink-0"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate max-w-[160px]">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-400">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span className="badge bg-gray-100 dark:bg-dark-surface text-gray-600 dark:text-gray-400">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ₹{Number(product.discountPrice || product.price).toLocaleString('en-IN')}
                        </span>
                        {product.discountPrice > 0 && (
                          <span className="text-xs text-gray-400 line-through ml-1">
                            ₹{Number(product.price).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span className={`font-medium ${
                        product.stock === 0
                          ? 'text-red-500'
                          : product.stock <= 5
                          ? 'text-amber-500'
                          : 'text-green-500'
                      }`}>
                        {product.stock === 0 ? 'Out of Stock' : product.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <span className="text-amber-400">★</span>
                      <span className="text-gray-700 dark:text-gray-300 ml-1">{product.ratings}</span>
                      <span className="text-gray-400 text-xs ml-1">({product.numReviews})</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {isMongoId(product._id) ? (
                          <>
                            <Link
                              to={`/admin/products/${product._id}/edit`}
                              className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-400 hover:text-blue-500 transition-colors"
                              title="Edit product"
                            >
                              <FiEdit2 size={15} />
                            </Link>
                            <button
                              onClick={() => setDeleteConfirm(product._id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                              title="Delete product"
                            >
                              <FiTrash2 size={15} />
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 italic pr-1">catalog</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination page={currentPage} pages={pages} onPageChange={setCurrentPage} />

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !deleting && setDeleteConfirm(null)} />
          <div className="relative card p-6 max-w-sm w-full animate-slide-up">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Delete Product?</h3>
            <p className="text-gray-500 text-sm mb-5">
              This action cannot be undone. The product will be permanently removed from the database.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="btn-secondary flex-1 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="flex-1 py-2 text-sm bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
