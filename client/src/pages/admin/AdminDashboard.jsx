import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import { fetchAnalytics, fetchAllOrders } from '../../slices/orderSlice';
import { loadCatalog } from '../../slices/productSlice';
import api from '../../services/api';
import { PageLoader } from '../../components/common/Spinner';

const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
  <div className="card p-5">
    <div className="flex items-center justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
    <p className="text-2xl font-bold text-gray-900 dark:text-white font-display">{value}</p>
    <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    {subtext && <p className="text-xs text-green-500 mt-1">{subtext}</p>}
  </div>
);

const STATUS_COLORS = {
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-yellow-100 text-yellow-700',
  'Out for Delivery': 'bg-orange-100 text-orange-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { analytics, orders, loading: ordersLoading } = useSelector((s) => s.orders);
  const [userCount, setUserCount] = useState(0);
  // allProducts = full catalog (DummyJSON + EXTRA_PRODUCTS), loaded by loadCatalog
  const { allProducts, catalogLoading } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchAnalytics());
    dispatch(fetchAllOrders({ limit: 5, page: 1 }));

    // Load catalog (DummyJSON + EXTRA_PRODUCTS) to get full client-side count
    dispatch(loadCatalog());

    // Fetch DB counts for users and DB-only products
    api.get('/users?limit=1')
      .then((r) => setUserCount(r.data.total || 0))
      .catch(() => {});
  }, [dispatch]);

  if (ordersLoading && !analytics) return <PageLoader />;

  const formatRevenue = (amount) => {
    if (!amount) return '₹0';
    return `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FiDollarSign}
          label="Total Revenue"
          value={formatRevenue(analytics?.totalRevenue)}
          color="bg-green-500"
        />
        <StatCard
          icon={FiPackage}
          label="Total Orders"
          value={analytics?.totalOrders ?? 0}
          color="bg-blue-500"
        />
        <StatCard
          icon={FiShoppingBag}
          label="Total Products"
          value={catalogLoading ? '...' : allProducts.length}
          color="bg-purple-500"
        />
        <StatCard
          icon={FiUsers}
          label="Customers"
          value={userCount}
          color="bg-orange-500"
        />
      </div>

      {/* Revenue chart + orders by status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue last 7 days */}
        <div className="lg:col-span-2 card p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Revenue (Last 7 Days)</h2>
          {analytics?.revenueByDay?.length ? (
            <div className="flex items-end gap-2 h-32">
              {analytics.revenueByDay.map((d) => {
                const maxRev = Math.max(...analytics.revenueByDay.map((x) => x.revenue));
                const pct = maxRev ? (d.revenue / maxRev) * 100 : 0;
                return (
                  <div key={d._id} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-gray-400">
                      ₹{Number(d.revenue).toLocaleString('en-IN', { notation: 'compact' })}
                    </span>
                    <div
                      className="w-full bg-primary-500/20 rounded-t-md relative"
                      style={{ height: `${Math.max(pct, 5)}%` }}
                    >
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-primary-500 rounded-t-md"
                        style={{ height: '100%' }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 truncate w-full text-center">
                      {d._id?.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-gray-400 text-sm">
              No revenue data yet
            </div>
          )}
        </div>

        {/* Orders by status */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Orders by Status</h2>
          <div className="space-y-3">
            {analytics?.ordersByStatus?.length ? (
              analytics.ordersByStatus.map((s) => (
                <div key={s._id} className="flex items-center justify-between">
                  <span className={`badge ${STATUS_COLORS[s._id] || 'bg-gray-100 text-gray-600'}`}>
                    {s._id}
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white text-sm">{s.count}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No data</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
          <Link
            to="/admin/orders"
            className="text-primary-500 text-sm flex items-center gap-1 hover:text-primary-600"
          >
            View All <FiArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100 dark:border-dark-border">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium hidden sm:table-cell">Customer</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                  <td className="py-3 font-mono text-xs text-gray-600 dark:text-gray-400">
                    #{order._id?.slice(-6).toUpperCase()}
                  </td>
                  <td className="py-3 hidden sm:table-cell text-gray-700 dark:text-gray-300">
                    {order.user?.name || 'N/A'}
                  </td>
                  <td className="py-3 font-semibold text-gray-900 dark:text-white">
                    ₹{Number(order.totalPrice).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3">
                    <span className={`badge ${STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 hidden md:table-cell text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-400">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
