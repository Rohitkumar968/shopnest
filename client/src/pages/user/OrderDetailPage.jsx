import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowLeft, FiMapPin, FiCreditCard } from 'react-icons/fi';
import { fetchOrderById } from '../../slices/orderSlice';
import { PageLoader } from '../../components/common/Spinner';
import formatPrice from '../../utils/formatPrice';

const STATUS_STEPS = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading } = useSelector((s) => s.orders);

  useEffect(() => { dispatch(fetchOrderById(id)); }, [id, dispatch]);

  if (loading || !order) return <PageLoader />;

  const statusIndex = STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <div className="container-custom py-8 max-w-3xl animate-fade-in">
      <Link to="/orders" className="flex items-center gap-2 text-gray-500 hover:text-primary-500 mb-6 text-sm">
        <FiArrowLeft size={14} /> Back to Orders
      </Link>

      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="section-title text-xl">Order Details</h1>
          <p className="text-sm text-gray-400 font-mono mt-1">#{order._id?.slice(-8).toUpperCase()}</p>
          <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
        </div>
        <span className={`badge text-sm py-1.5 px-3 ${
          order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
          order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {order.orderStatus}
        </span>
      </div>

      {/* Progress tracker */}
      {order.orderStatus !== 'Cancelled' && (
        <div className="card p-5 mb-5">
          <div className="flex items-center">
            {STATUS_STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    i <= statusIndex ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-dark-border text-gray-400'
                  }`}>
                    {i <= statusIndex ? '✓' : i + 1}
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap hidden sm:block">{s}</span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${i < statusIndex ? 'bg-primary-500' : 'bg-gray-200 dark:bg-dark-border'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* Shipping */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><FiMapPin size={14} className="text-primary-500" /> Shipping Address</h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p className="font-medium text-gray-900 dark:text-white">{order.shippingAddress?.fullName}</p>
            <p>{order.shippingAddress?.address}</p>
            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
            <p>{order.shippingAddress?.country}</p>
            <p>📞 {order.shippingAddress?.phone}</p>
          </div>
        </div>

        {/* Payment */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><FiCreditCard size={14} className="text-primary-500" /> Payment Info</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span className="text-gray-500">Method</span><span className="capitalize font-medium text-gray-900 dark:text-white">{order.paymentMethod}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Status</span>
              <span className={`font-medium ${order.isPaid ? 'text-green-500' : 'text-yellow-500'}`}>{order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Pending'}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-border text-sm space-y-1.5">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatPrice(order.itemsPrice)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : formatPrice(order.shippingPrice)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Tax</span><span>{formatPrice(order.taxPrice)}</span></div>
            <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-1 border-t border-gray-100 dark:border-dark-border"><span>Total</span><span>{formatPrice(order.totalPrice)}</span></div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Order Items</h3>
        <div className="space-y-3">
          {order.orderItems?.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover bg-gray-100 dark:bg-dark-bg shrink-0" />
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product}`} className="font-medium text-sm text-gray-900 dark:text-white hover:text-primary-500 line-clamp-1">{item.name}</Link>
                <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
              </div>
              <p className="font-bold text-gray-900 dark:text-white text-sm shrink-0">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
