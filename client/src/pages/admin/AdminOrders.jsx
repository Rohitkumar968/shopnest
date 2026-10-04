import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiEye, FiChevronDown } from 'react-icons/fi';
import { fetchAllOrders, updateOrderStatus } from '../../slices/orderSlice';
import { PageLoader } from '../../components/common/Spinner';
import Pagination from '../../components/common/Pagination';

const ORDER_STATUSES = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

const STATUS_COLORS = {
  Processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Shipped: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  'Out for Delivery': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, total, pages } = useSelector((s) => s.orders);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const params = { page: currentPage, limit: 15 };
    if (statusFilter) params.status = statusFilter;
    dispatch(fetchAllOrders(params));
  }, [dispatch, currentPage, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    await dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
    setUpdatingId(null);
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="animate-fade-in space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white">Orders</h2>
          <p className="text-sm text-gray-500 mt-0.5">{total} total orders</p>
        </div>

        {/* Filter by status */}
        <select
          value={statusFilter}
          onChange={handleFilterChange}
          className="input-field text-sm py-2 w-auto"
        >
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <PageLoader />
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No orders found</p>
            {statusFilter && (
              <button
                onClick={() => setStatusFilter('')}
                className="mt-3 text-primary-500 text-sm hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-dark-bg text-left text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 font-medium">Order ID</th>
                  <th className="px-5 py-3 font-medium hidden sm:table-cell">Customer</th>
                  <th className="px-5 py-3 font-medium">Items</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium hidden md:table-cell">Payment</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium hidden lg:table-cell">Date</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                        #{order._id?.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-xs">
                          {order.user?.name || 'Deleted User'}
                        </p>
                        <p className="text-gray-400 text-xs">{order.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {order.orderItems?.length} item{order.orderItems?.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ₹{Number(order.totalPrice).toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <div className="flex flex-col gap-0.5">
                        <span className="capitalize text-gray-600 dark:text-gray-400 text-xs">
                          {order.paymentMethod}
                        </span>
                        <span className={`text-xs font-medium ${order.isPaid ? 'text-green-500' : 'text-yellow-500'}`}>
                          {order.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="relative">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={updatingId === order._id}
                          className={`text-xs font-medium rounded-lg px-2 py-1 pr-6 border-0 cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-600'
                          } ${updatingId === order._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <FiChevronDown
                          size={10}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60"
                        />
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        to={`/orders/${order._id}`}
                        className="p-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-gray-400 hover:text-primary-500 transition-colors inline-flex"
                        title="View order details"
                      >
                        <FiEye size={15} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination page={currentPage} pages={pages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default AdminOrders;
