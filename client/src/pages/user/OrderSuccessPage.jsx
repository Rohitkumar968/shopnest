// OrderSuccessPage.jsx
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiCheckCircle, FiPackage, FiArrowRight } from 'react-icons/fi';
import { fetchOrderById } from '../../slices/orderSlice';
import { PageLoader } from '../../components/common/Spinner';
import formatPrice from '../../utils/formatPrice';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading } = useSelector((s) => s.orders);

  useEffect(() => { dispatch(fetchOrderById(id)); }, [id, dispatch]);

  if (loading) return <PageLoader />;

  return (
    <div className="container-custom py-16 text-center max-w-lg mx-auto animate-fade-in">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <FiCheckCircle size={40} className="text-green-500" />
      </div>
      <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">Order Placed!</h1>
      <p className="text-gray-500 mb-2">Thank you for your purchase.</p>
      {order && <p className="text-sm text-gray-400 mb-8">Order ID: <span className="font-mono font-medium text-gray-600 dark:text-gray-300">#{order._id?.slice(-8).toUpperCase()}</span></p>}

      {order && (
        <div className="card p-5 text-left mb-8">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white"><FiPackage size={16} /> Order Items</h3>
          {order.orderItems?.map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-dark-border last:border-0">
              <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-gray-900 dark:text-white">{item.name}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-dark-border flex justify-between font-bold">
            <span>Total</span><span>{formatPrice(order.totalPrice)}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/orders" className="btn-primary">View My Orders <FiArrowRight /></Link>
        <Link to="/products" className="btn-secondary">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
