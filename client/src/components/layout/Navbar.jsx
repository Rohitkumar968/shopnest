import { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiHeart,
  FiMenu,
  FiX,
  FiPackage,
  FiLogOut,
  FiSettings,
  FiMoon,
  FiSun,
  FiChevronDown,
  FiHome,
  FiGrid,
} from 'react-icons/fi';
import { MdAdminPanelSettings } from 'react-icons/md';

import { logout } from '../../slices/authSlice';
import { toggleDarkMode } from '../../slices/uiSlice';
import { selectCartCount } from '../../slices/cartSlice';

const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports',
  'Beauty',
  'Toys',
];

/* ---------------------------------------------
   Generate fallback avatar
--------------------------------------------- */
const makeInitialsAvatar = (name) => {
  const initials = (name || 'U')
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  try {
    const canvas = document.createElement('canvas');

    canvas.width = 100;
    canvas.height = 100;

    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f97316';
    ctx.fillRect(0, 0, 100, 100);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 38px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText(initials, 50, 52);

    return canvas.toDataURL();
  } catch {
    return '';
  }
};

/* ---------------------------------------------
   User Avatar
--------------------------------------------- */
const UserAvatar = ({ user, className = 'w-9 h-9' }) => {
  const fallback = useMemo(
    () => makeInitialsAvatar(user?.name),
    [user?.name]
  );

  const src = (user?.avatar?.url || '').trim();

  return (
    <img
      src={src || fallback}
      alt={user?.name || 'User'}
      className={`${className} rounded-full object-cover ring-2 ring-orange-400/50 shrink-0`}
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = fallback;
      }}
    />
  );
};

/* ---------------------------------------------
   Navbar
--------------------------------------------- */
const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { user } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.ui);

  const cartCount = useSelector(selectCartCount);

  const activeCategory = searchParams.get('category') || '';

  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userMenuRef = useRef(null);

  /* ---------------------------------------------
     Close user dropdown when clicking outside
  --------------------------------------------- */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /* ---------------------------------------------
     Search
  --------------------------------------------- */
  const handleSearch = (event) => {
    event.preventDefault();

    const value = search.trim();

    if (!value) return;

    navigate(`/products?search=${encodeURIComponent(value)}`);

    setSearch('');
    setMenuOpen(false);
  };

  /* ---------------------------------------------
     Logout
  --------------------------------------------- */
  const handleLogout = () => {
    dispatch(logout());

    setUserMenuOpen(false);
    setMenuOpen(false);

    navigate('/');
  };

  /* ---------------------------------------------
     Category class
  --------------------------------------------- */
  const categoryClass = (category) => {
    const active = activeCategory === category;

    return `
      relative px-4 py-3 text-sm font-medium whitespace-nowrap
      transition-all duration-200
      ${
        active
          ? 'text-orange-500'
          : 'text-gray-600 dark:text-gray-300 hover:text-orange-500'
      }
      after:absolute after:left-4 after:right-4 after:bottom-0
      after:h-0.5 after:rounded-full
      after:bg-orange-500
      after:transition-all after:duration-200
      ${
        active
          ? 'after:opacity-100 after:scale-100'
          : 'after:opacity-0 after:scale-0'
      }
    `;
  };

  return (
    <header className="sticky top-0 z-50">

      {/* =====================================================
          MAIN NAVBAR
      ====================================================== */}
      <div className="bg-white/95 dark:bg-[#111111]/95 backdrop-blur-xl border-b border-gray-200/80 dark:border-gray-800 shadow-sm">

        <div className="container-custom">

          <div className="flex items-center gap-3 h-[72px]">

            {/* =================================================
                LOGO
            ================================================= */}
            <Link
              to="/"
              className="flex items-center gap-2.5 shrink-0 group"
            >
              <div
                className="
                  w-10 h-10 rounded-xl
                  bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600
                  flex items-center justify-center
                  shadow-lg shadow-orange-500/20
                  group-hover:scale-105
                  transition-transform duration-200
                "
              >
                <span className="text-white font-black text-lg">
                  S
                </span>
              </div>

              <div className="hidden sm:block leading-none">
                <span className="font-display text-xl font-extrabold text-gray-900 dark:text-white">
                  Shop
                </span>

                <span className="font-display text-xl font-extrabold text-orange-500">
                  Nest
                </span>

                <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mt-1">
                  Shop Smarter
                </p>
              </div>
            </Link>

            {/* =================================================
                SEARCH
            ================================================= */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-2xl mx-auto"
            >
              <div
                className="
                  w-full h-11
                  flex items-center
                  rounded-xl
                  bg-gray-100 dark:bg-[#1b1b1b]
                  border border-transparent
                  focus-within:border-orange-400
                  focus-within:bg-white
                  dark:focus-within:bg-[#171717]
                  transition-all duration-200
                  overflow-hidden
                "
              >
                <FiSearch
                  size={18}
                  className="ml-4 text-gray-400 shrink-0"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products, brands and categories..."
                  className="
                    flex-1
                    h-full
                    px-3
                    bg-transparent
                    text-sm
                    text-gray-900
                    dark:text-white
                    placeholder-gray-400
                    focus:outline-none
                  "
                />

                <button
                  type="submit"
                  className="
                    h-9
                    mr-1
                    px-5
                    rounded-lg
                    bg-orange-500
                    hover:bg-orange-600
                    text-white
                    text-sm
                    font-semibold
                    transition-all
                    flex items-center justify-center
                  "
                >
                  Search
                </button>
              </div>
            </form>

            {/* =================================================
                RIGHT ACTIONS
            ================================================= */}
            <div className="flex items-center gap-1 ml-auto">

              {/* Dark Mode */}
              <button
                onClick={() => dispatch(toggleDarkMode())}
                className="
                  w-10 h-10
                  rounded-xl
                  flex items-center justify-center
                  text-gray-600
                  dark:text-gray-300
                  hover:text-orange-500
                  hover:bg-orange-50
                  dark:hover:bg-orange-500/10
                  transition-all
                "
                title="Toggle theme"
              >
                {darkMode ? (
                  <FiSun size={19} />
                ) : (
                  <FiMoon size={19} />
                )}
              </button>

              {/* Wishlist */}
              {user && (
                <Link
                  to="/wishlist"
                  className="
                    relative
                    w-10 h-10
                    hidden sm:flex
                    items-center justify-center
                    rounded-xl
                    text-gray-600
                    dark:text-gray-300
                    hover:text-red-500
                    hover:bg-red-50
                    dark:hover:bg-red-500/10
                    transition-all
                  "
                  title="Wishlist"
                >
                  <FiHeart size={20} />
                </Link>
              )}

              {/* Cart */}
              <Link
                to="/cart"
                className="
                  relative
                  w-10 h-10
                  flex items-center justify-center
                  rounded-xl
                  text-gray-600
                  dark:text-gray-300
                  hover:text-orange-500
                  hover:bg-orange-50
                  dark:hover:bg-orange-500/10
                  transition-all
                "
                title="Shopping Cart"
              >
                <FiShoppingCart size={20} />

                {cartCount > 0 && (
                  <span
                    className="
                      absolute -top-1 -right-1
                      min-w-[19px] h-[19px]
                      px-1
                      rounded-full
                      bg-orange-500
                      text-white
                      text-[10px]
                      font-bold
                      flex items-center justify-center
                      ring-2 ring-white dark:ring-[#111111]
                    "
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* =================================================
                  USER
              ================================================= */}
              {user ? (
                <div
                  ref={userMenuRef}
                  className="relative ml-1"
                >
                  <button
                    onClick={() =>
                      setUserMenuOpen((previous) => !previous)
                    }
                    className="
                      flex items-center gap-2
                      px-2 py-1.5
                      rounded-xl
                      hover:bg-gray-100
                      dark:hover:bg-gray-800
                      transition-all
                    "
                  >
                    <UserAvatar
                      user={user}
                      className="w-9 h-9"
                    />

                    <div className="hidden lg:block text-left">
                      <p className="text-[10px] text-gray-400 leading-none">
                        Welcome
                      </p>

                      <p className="text-sm font-bold text-gray-900 dark:text-white max-w-[85px] truncate">
                        {(user.name || 'User').split(' ')[0]}
                      </p>
                    </div>

                    <FiChevronDown
                      size={14}
                      className={`
                        hidden lg:block
                        text-gray-400
                        transition-transform duration-200
                        ${
                          userMenuOpen
                            ? 'rotate-180'
                            : ''
                        }
                      `}
                    />
                  </button>

                  {/* USER DROPDOWN */}
                  {userMenuOpen && (
                    <div
                      className="
                        absolute right-0 top-full mt-3
                        w-64
                        bg-white
                        dark:bg-[#171717]
                        border border-gray-100
                        dark:border-gray-800
                        rounded-2xl
                        shadow-2xl
                        overflow-hidden
                        animate-fade-in
                      "
                    >

                      {/* User Header */}
                      <div className="p-4 bg-gradient-to-br from-orange-50 to-white dark:from-orange-500/10 dark:to-[#171717] border-b border-gray-100 dark:border-gray-800">

                        <div className="flex items-center gap-3">

                          <UserAvatar
                            user={user}
                            className="w-11 h-11"
                          />

                          <div className="min-w-0">
                            <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                              {user.name || 'User'}
                            </p>

                            <p className="text-xs text-gray-500 truncate">
                              {user.email}
                            </p>
                          </div>

                        </div>
                      </div>

                      {/* Admin */}
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="
                            flex items-center gap-3
                            px-4 py-3
                            text-sm
                            text-orange-600
                            dark:text-orange-400
                            hover:bg-orange-50
                            dark:hover:bg-orange-500/10
                            transition-colors
                            font-semibold
                          "
                        >
                          <MdAdminPanelSettings size={18} />
                          Admin Dashboard
                        </Link>
                      )}

                      {/* Profile */}
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="
                          flex items-center gap-3
                          px-4 py-3
                          text-sm
                          text-gray-700
                          dark:text-gray-300
                          hover:bg-gray-50
                          dark:hover:bg-gray-800
                          transition-colors
                        "
                      >
                        <FiSettings size={16} />
                        Profile Settings
                      </Link>

                      {/* Orders */}
                      <Link
                        to="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="
                          flex items-center gap-3
                          px-4 py-3
                          text-sm
                          text-gray-700
                          dark:text-gray-300
                          hover:bg-gray-50
                          dark:hover:bg-gray-800
                          transition-colors
                        "
                      >
                        <FiPackage size={16} />
                        My Orders
                      </Link>

                      {/* Wishlist */}
                      <Link
                        to="/wishlist"
                        onClick={() => setUserMenuOpen(false)}
                        className="
                          flex items-center gap-3
                          px-4 py-3
                          text-sm
                          text-gray-700
                          dark:text-gray-300
                          hover:bg-gray-50
                          dark:hover:bg-gray-800
                          transition-colors
                        "
                      >
                        <FiHeart size={16} />
                        Wishlist
                      </Link>

                      {/* Logout */}
                      <div className="border-t border-gray-100 dark:border-gray-800 p-1">
                        <button
                          onClick={handleLogout}
                          className="
                            w-full
                            flex items-center gap-3
                            px-4 py-3
                            text-sm
                            text-red-500
                            hover:bg-red-50
                            dark:hover:bg-red-500/10
                            rounded-lg
                            transition-colors
                          "
                        >
                          <FiLogOut size={16} />
                          Sign Out
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="
                    hidden sm:flex
                    items-center gap-2
                    px-4 py-2.5
                    rounded-xl
                    bg-orange-500
                    hover:bg-orange-600
                    text-white
                    text-sm
                    font-bold
                    shadow-lg
                    shadow-orange-500/20
                    transition-all
                    hover:-translate-y-0.5
                  "
                >
                  <FiUser size={16} />
                  Sign In
                </Link>
              )}

              {/* Mobile Menu */}
              <button
                onClick={() =>
                  setMenuOpen((previous) => !previous)
                }
                className="
                  md:hidden
                  w-10 h-10
                  rounded-xl
                  flex items-center justify-center
                  text-gray-600
                  dark:text-gray-300
                  hover:text-orange-500
                  hover:bg-orange-50
                  dark:hover:bg-orange-500/10
                  transition-all
                "
              >
                {menuOpen ? (
                  <FiX size={22} />
                ) : (
                  <FiMenu size={22} />
                )}
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          CATEGORY NAVIGATION
      ====================================================== */}
      <div
        className="
          hidden md:block
          bg-white
          dark:bg-[#111111]
          border-b
          border-gray-100
          dark:border-gray-800
        "
      >
        <div className="container-custom">

          <nav className="flex items-center overflow-x-auto scrollbar-hide">

            <Link
              to="/"
              className="
                flex items-center gap-2
                px-4 py-3
                text-sm font-semibold
                text-gray-600
                dark:text-gray-300
                hover:text-orange-500
                transition-colors
              "
            >
              <FiHome size={15} />
              Home
            </Link>

            <Link
              to="/products"
              className={`
                flex items-center gap-2
                ${categoryClass('')}
              `}
            >
              <FiGrid size={15} />
              All Products
            </Link>

            {CATEGORIES.map((category) => (
              <Link
                key={category}
                to={`/products?category=${encodeURIComponent(category)}`}
                className={categoryClass(category)}
              >
                {category}
              </Link>
            ))}

          </nav>
        </div>
      </div>

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}
      {menuOpen && (
        <div
          className="
            md:hidden
            bg-white
            dark:bg-[#111111]
            border-b
            border-gray-200
            dark:border-gray-800
            shadow-xl
            animate-fade-in
          "
        >

          <div className="container-custom py-4">

            {/* Mobile Search */}
            <form
              onSubmit={handleSearch}
              className="relative mb-4"
            >
              <FiSearch
                size={17}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search products..."
                className="
                  w-full
                  pl-11
                  pr-4
                  py-3
                  rounded-xl
                  bg-gray-100
                  dark:bg-gray-900
                  border
                  border-gray-200
                  dark:border-gray-800
                  text-gray-900
                  dark:text-white
                  placeholder-gray-400
                  focus:outline-none
                  focus:border-orange-400
                  text-sm
                "
              />
            </form>

            {/* Mobile Sign In */}
            {!user && (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="
                  flex items-center justify-center gap-2
                  w-full
                  py-3
                  rounded-xl
                  bg-orange-500
                  hover:bg-orange-600
                  text-white
                  font-bold
                  text-sm
                  mb-4
                "
              >
                <FiUser size={17} />
                Sign In
              </Link>
            )}

            {/* Mobile Links */}
            <div className="grid grid-cols-2 gap-2">

              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="
                  flex items-center gap-2
                  px-4 py-3
                  rounded-xl
                  bg-gray-50
                  dark:bg-gray-900
                  text-sm
                  font-medium
                  text-gray-700
                  dark:text-gray-300
                "
              >
                <FiHome size={16} />
                Home
              </Link>

              <Link
                to="/products"
                onClick={() => setMenuOpen(false)}
                className="
                  flex items-center gap-2
                  px-4 py-3
                  rounded-xl
                  bg-gray-50
                  dark:bg-gray-900
                  text-sm
                  font-medium
                  text-gray-700
                  dark:text-gray-300
                "
              >
                <FiGrid size={16} />
                All Products
              </Link>

              {user && (
                <>
                  <Link
                    to="/wishlist"
                    onClick={() => setMenuOpen(false)}
                    className="
                      flex items-center gap-2
                      px-4 py-3
                      rounded-xl
                      bg-gray-50
                      dark:bg-gray-900
                      text-sm
                      font-medium
                      text-gray-700
                      dark:text-gray-300
                    "
                  >
                    <FiHeart size={16} />
                    Wishlist
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setMenuOpen(false)}
                    className="
                      flex items-center gap-2
                      px-4 py-3
                      rounded-xl
                      bg-gray-50
                      dark:bg-gray-900
                      text-sm
                      font-medium
                      text-gray-700
                      dark:text-gray-300
                    "
                  >
                    <FiPackage size={16} />
                    My Orders
                  </Link>
                </>
              )}

            </div>

            {/* Mobile Categories */}
            <div className="mt-5">

              <p className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-3">
                Categories
              </p>

              <div className="flex flex-wrap gap-2">

                {CATEGORIES.map((category) => (
                  <Link
                    key={category}
                    to={`/products?category=${encodeURIComponent(category)}`}
                    onClick={() => setMenuOpen(false)}
                    className={`
                      px-3 py-2
                      rounded-full
                      text-xs
                      font-semibold
                      transition-colors
                      ${
                        activeCategory === category
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-orange-50 hover:text-orange-500'
                      }
                    `}
                  >
                    {category}
                  </Link>
                ))}

              </div>
            </div>

          </div>
        </div>
      )}

    </header>
  );
};

export default Navbar;
