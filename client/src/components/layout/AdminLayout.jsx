import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers, FiLogOut,
  FiMenu, FiX, FiChevronRight, FiHome, FiMoon, FiSun,
} from 'react-icons/fi';
import { logout } from '../../slices/authSlice';
import { toggleDarkMode } from '../../slices/uiSlice';
import Footer from './Footer';

const navItems = [
  { to: '/admin', icon: FiGrid, label: 'Dashboard', exact: true },
  { to: '/admin/products', icon: FiShoppingBag, label: 'Products' },
  { to: '/admin/orders', icon: FiPackage, label: 'Orders' },
  { to: '/admin/users', icon: FiUsers, label: 'Users' },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { darkMode } = useSelector((s) => s.ui);

  const handleLogout = () => { dispatch(logout()); navigate('/'); };

  const isActive = (item) =>
    item.exact ? pathname === item.to : pathname.startsWith(item.to);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-60'} shrink-0 bg-gray-900 dark:bg-black transition-all duration-300 flex flex-col sticky top-0 h-screen`}>
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-800">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          {!collapsed && (
            <span className="font-display font-bold text-white">
              Shop<span className="text-primary-500">Nest</span>
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto text-gray-400 hover:text-white transition-colors"
          >
            {collapsed ? <FiChevronRight /> : <FiMenu />}
          </button>
        </div>

        {/* User info */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-gray-800">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Logged in as</p>
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <span className="badge bg-primary-900/50 text-primary-400 mt-1">Admin</span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive(item)
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon size={18} className="shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-2 py-4 border-t border-gray-800 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <FiHome size={18} />
            {!collapsed && <span className="text-sm font-medium">Back to Store</span>}
          </Link>
          <button
            onClick={() => dispatch(toggleDarkMode())}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            {!collapsed && <span className="text-sm font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-900/20 transition-colors"
          >
            <FiLogOut size={18} />
            {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content column */}
      <div className="flex-1 flex flex-col min-h-screen overflow-auto">
        <header className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border px-6 py-4 sticky top-0 z-10">
          <h1 className="font-display font-bold text-gray-900 dark:text-white text-lg">
            {navItems.find((n) => isActive(n))?.label || 'Admin'}
          </h1>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
