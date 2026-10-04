import { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiSearch, FiShoppingCart, FiUser, FiHeart, FiMenu, FiX,
  FiPackage, FiLogOut, FiSettings, FiMoon, FiSun, FiChevronDown,
} from 'react-icons/fi';
import { MdAdminPanelSettings } from 'react-icons/md';
import { logout } from '../../slices/authSlice';
import { toggleDarkMode } from '../../slices/uiSlice';
import { selectCartCount } from '../../slices/cartSlice';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys'];

/* ── Initials avatar (canvas-based, orange background) ── */
const makeInitialsAvatar = (name) => {
  const initials = (name || 'U')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f97316';
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, 32, 33);
    return canvas.toDataURL();
  } catch {
    return '';
  }
};

const UserAvatar = ({ user, className = 'w-8 h-8' }) => {
  const fallback = useMemo(() => makeInitialsAvatar(user?.name), [user?.name]);
  // Only use avatar URL if it's a real uploaded image (non-empty)
  const src = (user?.avatar?.url || '').trim();
  return (
    <img
      src={src || fallback}
      alt={user?.name || 'User'}
      className={`${className} rounded-full object-cover ring-2 ring-primary-400/60 shrink-0`}
      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallback; }}
    />
  );
};

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useSelector((s) => s.auth);
  const { darkMode } = useSelector((s) => s.ui);
  const cartCount = useSelector(selectCartCount);

  const activeCategory = searchParams.get('category') || '';

  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      {/* ── Top bar ── */}
      <div className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border">
        <div className="container-custom">
          <div className="flex items-center justify-between h-14 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center shadow">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-display font-bold text-xl text-gray-900 dark:text-white hidden sm:block">
                Shop<span className="text-primary-400">Nest</span>
              </span>
            </Link>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
              <div className="flex w-full rounded-xl overflow-hidden border-2 border-primary-400 focus-within:border-primary-300 transition-colors">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products, brands, categories..."
                  className="flex-1 px-4 py-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
                />
                <button
                  type="submit"
                  className="px-4 bg-primary-500 hover:bg-primary-600 text-white transition-colors flex items-center"
                >
                  <FiSearch size={18} />
                </button>
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Dark mode */}
              <button
                onClick={() => dispatch(toggleDarkMode())}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Toggle dark mode"
              >
                {darkMode ? <FiSun size={19} /> : <FiMoon size={19} />}
              </button>

              {/* Wishlist */}
              {user && (
                <Link
                  to="/wishlist"
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:flex"
                  title="Wishlist"
                >
                  <FiHeart size={19} />
                </Link>
              )}

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Cart"
              >
                <FiShoppingCart size={19} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* User menu */}
              {user ? (
                <div ref={userMenuRef} className="relative ml-1">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
                  >
                    <UserAvatar user={user} className="w-8 h-8" />
                    <div className="hidden md:block text-left">
                      <p className="text-xs text-gray-500 leading-none">Hello,</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight max-w-[90px] truncate">
                        {(user.name || 'User').split(' ')[0]}
                      </p>
                    </div>
                    <FiChevronDown
                      className={`hidden md:block text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                      size={14}
                    />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-dark-surface rounded-xl shadow-xl border border-gray-100 dark:border-dark-border py-1 animate-fade-in z-50">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-border flex items-center gap-3">
                        <UserAvatar user={user} className="w-10 h-10" />
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{user.name || 'User'}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors font-medium"
                        >
                          <MdAdminPanelSettings size={16} /> Admin Dashboard
                        </Link>
                      )}
                      <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                        <FiSettings size={14} /> Profile Settings
                      </Link>
                      <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                        <FiPackage size={14} /> My Orders
                      </Link>
                      <Link to="/wishlist" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                        <FiHeart size={14} /> Wishlist
                      </Link>
                      <div className="border-t border-gray-100 dark:border-dark-border mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <FiLogOut size={14} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold transition-colors ml-1">
                  <FiUser size={15} /> Sign In
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="ml-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border md:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Category bar ── */}
      <div className="bg-gray-50 dark:bg-dark-bg border-b border-gray-200 dark:border-dark-border hidden md:block">
        <div className="container-custom">
          <nav className="flex items-center gap-0.5 py-1 overflow-x-auto scrollbar-hide">
            <Link
              to="/products"
              className={activeCategory === '' ? 'nav-cat-link-active' : 'nav-cat-link'}
            >
              All Products
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}`}
                className={activeCategory === cat ? 'nav-cat-link-active' : 'nav-cat-link'}
              >
                {cat}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border px-4 py-3 animate-fade-in">
          <form onSubmit={handleSearch} className="relative mb-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none text-sm"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FiSearch size={16} />
            </button>
          </form>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/products"
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCategory === '' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              All
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}`}
                onClick={() => setMenuOpen(false)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeCategory === cat ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
