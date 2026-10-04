import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { removeFromCart, updateQuantity, selectCartTotal } from '../../slices/cartSlice';
import formatPrice from '../../utils/formatPrice';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((s) => s.cart);
  const subtotal = useSelector(selectCartTotal);
  const shipping = subtotal >= 500 ? 0 : 99;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="w-24 h-24 bg-gray-100 dark:bg-dark-surface rounded-full flex items-center justify-center mx-auto mb-6">
          <FiShoppingBag size={40} className="text-gray-300 dark:text-gray-600" />
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add some products to get started!</p>
        <Link to="/products" className="btn-primary inline-flex">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 animate-fade-in">
      <h1 className="section-title mb-6">Shopping Cart <span className="text-gray-400 text-lg font-normal">({items.length} {items.length === 1 ? 'item' : 'items'})</span></h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.product} className="card p-4 flex gap-4">
              <Link to={`/products/${item.product}`}>
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover bg-gray-100 dark:bg-dark-bg shrink-0" onError={(e) => { e.target.src = 'https://via.placeholder.com/80'; }} />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product}`} className="font-semibold text-gray-900 dark:text-white text-sm hover:text-primary-500 line-clamp-2 block">
                  {item.name}
                </Link>
                <p className="text-primary-500 font-bold mt-1">{formatPrice(item.price)}</p>
              </div>
              <div className="flex flex-col items-end justify-between shrink-0">
                <button onClick={() => dispatch(removeFromCart(item.product))} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                  <FiTrash2 size={14} />
                </button>
                <div className="flex items-center border border-gray-200 dark:border-dark-border rounded-lg">
                  <button
                    onClick={() => {
                      if (item.quantity <= 1) dispatch(removeFromCart(item.product));
                      else dispatch(updateQuantity({ productId: item.product, quantity: item.quantity - 1 }));
                    }}
                    className="p-2 hover:bg-gray-50 dark:hover:bg-dark-bg rounded-l-lg transition-colors"
                  >
                    <FiMinus size={12} />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => {
                      if (item.quantity < item.stock) dispatch(updateQuantity({ productId: item.product, quantity: item.quantity + 1 }));
                    }}
                    className="p-2 hover:bg-gray-50 dark:hover:bg-dark-bg rounded-r-lg transition-colors"
                    disabled={item.quantity >= item.stock}
                  >
                    <FiPlus size={12} />
                  </button>
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-20">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 text-lg">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-500' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax (10%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              {subtotal < 500 && (
                <p className="text-xs text-gray-400 bg-gray-50 dark:bg-dark-bg p-2 rounded-lg">
                  Add {formatPrice(500 - subtotal)} more for free shipping!
                </p>
              )}
              <div className="border-t border-gray-100 dark:border-dark-border pt-3 flex justify-between font-bold text-gray-900 dark:text-white text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <button onClick={() => navigate('/checkout')} className="btn-primary w-full mt-5 py-3">
              Checkout <FiArrowRight />
            </button>
            <Link to="/products" className="btn-secondary w-full mt-2 py-2.5 text-sm">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
