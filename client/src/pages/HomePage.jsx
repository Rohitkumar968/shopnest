import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiHeadphones } from 'react-icons/fi';
import { fetchFeaturedProducts, loadCatalog } from '../slices/productSlice';
import ProductCard from '../components/product/ProductCard';

const HERO_CATEGORIES = [
  { name: 'Electronics', emoji: '⚡', color: 'from-blue-500 to-cyan-500', link: '/products?category=Electronics' },
  { name: 'Clothing', emoji: '👗', color: 'from-pink-500 to-rose-500', link: '/products?category=Clothing' },
  { name: 'Books', emoji: '📚', color: 'from-amber-500 to-orange-500', link: '/products?category=Books' },
  { name: 'Sports', emoji: '⚽', color: 'from-green-500 to-emerald-500', link: '/products?category=Sports' },
  { name: 'Home & Garden', emoji: '🏡', color: 'from-violet-500 to-purple-500', link: '/products?category=Home+%26+Garden' },
  { name: 'Beauty', emoji: '✨', color: 'from-yellow-500 to-amber-500', link: '/products?category=Beauty' },
  { name: 'Toys', emoji: '🧸', color: 'from-red-500 to-pink-500', link: '/products?category=Toys' },
];

const FEATURES = [
  { icon: FiTruck, title: 'Free Shipping', desc: 'On orders over $50', color: 'text-blue-500' },
  { icon: FiRefreshCw, title: 'Easy Returns', desc: '30-day return policy', color: 'text-green-500' },
  { icon: FiShield, title: 'Secure Payment', desc: '100% secure checkout', color: 'text-purple-500' },
  { icon: FiHeadphones, title: '24/7 Support', desc: 'Dedicated customer care', color: 'text-orange-500' },
];

const SkeletonCard = () => (
  <div className="card overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-200 dark:bg-dark-border" />
    <div className="p-4 space-y-2">
      <div className="h-3 bg-gray-200 dark:bg-dark-border rounded w-1/3" />
      <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-full" />
      <div className="h-5 bg-gray-200 dark:bg-dark-border rounded w-1/2 mt-3" />
    </div>
  </div>
);

const HomePage = () => {
  const dispatch = useDispatch();
  const { featured, catalogLoading } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(loadCatalog()).then(() => dispatch(fetchFeaturedProducts()));
  }, [dispatch]);

  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-black dark:via-gray-900 dark:to-black min-h-[520px] flex items-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10 py-16">
          <div className="max-w-2xl">
            <span className="badge bg-primary-500/20 text-primary-400 text-sm mb-4 inline-flex">
              🔥 New arrivals every week
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Shop the <span className="text-primary-500">Future</span> of Retail
            </h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Discover thousands of premium products at unbeatable prices. Fast shipping, easy returns, and world-class customer service.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary text-base px-8 py-3">
                Shop Now <FiArrowRight />
              </Link>
              <Link to="/products?sort=rating" className="btn-outline border-white text-white hover:bg-white hover:text-gray-900 text-base px-8 py-3">
                View Deals
              </Link>
            </div>

            <div className="flex gap-8 mt-10">
              {[['200+', 'Products'], ['2M+', 'Customers'], ['98%', 'Satisfaction']].map(([num, label]) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-white">{num}</p>
                  <p className="text-gray-400 text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section className="bg-white dark:bg-dark-surface border-b border-gray-100 dark:border-dark-border">
        <div className="container-custom py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gray-50 dark:bg-dark-bg flex items-center justify-center ${f.color}`}>
                  <f.icon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{f.title}</p>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-custom py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">Shop by Category</h2>
          <Link to="/products" className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center gap-1">
            All Categories <FiArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {HERO_CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={cat.link}
              className="group relative overflow-hidden rounded-2xl aspect-square bg-gradient-to-br from-gray-100 to-gray-50 dark:from-dark-surface dark:to-dark-bg border border-gray-100 dark:border-dark-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              <div className="h-full flex flex-col items-center justify-center gap-3 p-4">
                <span className="text-3xl">{cat.emoji}</span>
                <span className="font-semibold text-xs text-gray-700 dark:text-gray-300 text-center leading-tight">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-custom py-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Handpicked just for you</p>
          </div>
          <Link to="/products?sort=rating" className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center gap-1">
            View All <FiArrowRight size={14} />
          </Link>
        </div>

        {catalogLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No featured products yet.</p>
            <Link to="/products" className="btn-primary mt-4 inline-flex">Browse All Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* Promo Banner */}
      <section className="container-custom pb-12">
        <div className="rounded-2xl bg-gradient-to-r from-primary-500 to-primary-700 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white">
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">Get 20% Off Your First Order</h3>
            <p className="text-primary-100">Join ShopNest today and enjoy exclusive member discounts.</p>
          </div>
          <Link to="/register" className="shrink-0 px-8 py-3 bg-white text-primary-600 font-bold rounded-xl hover:bg-primary-50 transition-colors">
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
