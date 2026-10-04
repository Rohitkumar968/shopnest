import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import ProductCard from '../../components/product/ProductCard';
import { PageLoader } from '../../components/common/Spinner';

const MONGO_ID = /^[a-f\d]{24}$/i;

const WishlistPage = () => {
  const { user } = useSelector((s) => s.auth);
  const { allProducts } = useSelector((s) => s.products); // full DummyJSON + local catalog
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchWishlist = async () => {
      setLoading(true);
      setError('');
      try {
        // Always fetch fresh wishlist IDs from the server for the current user
        const res = await api.get('/auth/me');
        const wishlistIds = res.data.user?.wishlist || [];

        if (!wishlistIds.length) {
          setProducts([]);
          return;
        }

        const found = [];
        const missingMongoIds = [];

        for (const id of wishlistIds) {
          const idStr = id?.toString?.() || String(id);
          // Try to find in the Redux catalog first (covers dj_, bk_, ty_, etc.)
          const catalogMatch = allProducts.find((p) => p._id === idStr);
          if (catalogMatch) {
            found.push(catalogMatch);
          } else if (MONGO_ID.test(idStr)) {
            // MongoDB ObjectId — fetch from backend
            missingMongoIds.push(idStr);
          }
        }

        // Fetch any MongoDB products not in the catalog
        if (missingMongoIds.length) {
          const results = await Promise.allSettled(
            missingMongoIds.map((id) => api.get(`/products/${id}`))
          );
          results.forEach((r) => {
            if (r.status === 'fulfilled' && r.value.data?.product) {
              found.push(r.value.data.product);
            }
          });
        }

        setProducts(found);
      } catch (err) {
        console.error(err);
        setError('Failed to load wishlist. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user?._id, allProducts]);

  if (loading) return <PageLoader />;

  return (
    <div className="container-custom py-8 animate-fade-in">
      <h1 className="section-title mb-6 flex items-center gap-3">
        <FiHeart className="text-red-500" /> My Wishlist
        <span className="text-gray-400 text-lg font-normal">({products.length} items)</span>
      </h1>

      {error && (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary inline-flex">
            Retry
          </button>
        </div>
      )}

      {!error && products.length === 0 && (
        <div className="text-center py-16">
          <FiHeart size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save items you love to revisit them later.</p>
          <Link to="/products" className="btn-primary inline-flex">Browse Products</Link>
        </div>
      )}

      {!error && products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
