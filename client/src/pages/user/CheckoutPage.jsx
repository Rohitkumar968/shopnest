import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiCreditCard, FiTruck, FiCheck } from 'react-icons/fi';
import { createOrder } from '../../slices/orderSlice';
import {
  clearCart,
  saveShippingAddress,
  savePaymentMethod,
  selectCartTotal,
} from '../../slices/cartSlice';
import Spinner from '../../components/common/Spinner';
import formatPrice from '../../utils/formatPrice';
import toast from 'react-hot-toast';

const STEPS = ['Shipping', 'Payment', 'Review'];

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, shippingAddress, paymentMethod } = useSelector((s) => s.cart);
  const { loading: orderLoading } = useSelector((s) => s.orders);
  const { user } = useSelector((s) => s.auth);

  const subtotal = useSelector(selectCartTotal);
  const shipping = subtotal >= 500 ? 0 : 99;
  const tax = +(subtotal * 0.1).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);

  const [step, setStep] = useState(0);

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    address: shippingAddress?.address || '',
    city: shippingAddress?.city || '',
    state: shippingAddress?.state || '',
    zipCode: shippingAddress?.zipCode || '',
    country: shippingAddress?.country || 'India',
    phone: user?.phone || '',
  });

  const [payment, setPayment] = useState(paymentMethod || 'cod');

  const setA = (field) => (e) => {
    setAddress((current) => ({
      ...current,
      [field]: e.target.value,
    }));
  };

  const handleShippingNext = (e) => {
    e.preventDefault();

    dispatch(saveShippingAddress(address));
    setStep(1);
  };

  const handlePaymentNext = (e) => {
    e.preventDefault();

    dispatch(savePaymentMethod(payment));
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    if (!items.length) {
      toast.error('Your cart is empty.');
      return;
    }

    const orderItems = items.map((item) => ({
      product: item.product,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    }));

    const result = await dispatch(
      createOrder({
        orderItems,
        shippingAddress: address,
        paymentMethod: payment,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total,
      })
    );

    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(clearCart());
      navigate(`/order-success/${result.payload._id}`);
    }
  };

  return (
    <div className="container-custom py-8 max-w-4xl animate-fade-in">
      <h1 className="section-title mb-6">Checkout</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((stepName, index) => (
          <div
            key={stepName}
            className="flex items-center flex-1 last:flex-none"
          >
            <button
              type="button"
              onClick={() => index < step && setStep(index)}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                step === index
                  ? 'text-primary-500'
                  : index < step
                    ? 'text-green-500 cursor-pointer'
                    : 'text-gray-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step === index
                    ? 'bg-primary-500 text-white'
                    : index < step
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-dark-surface text-gray-400'
                }`}
              >
                {index < step ? <FiCheck size={14} /> : index + 1}
              </div>

              <span className="hidden sm:block">{stepName}</span>
            </button>

            {index < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-3 ${
                  index < step
                    ? 'bg-green-500'
                    : 'bg-gray-200 dark:bg-dark-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">

          {/* Step 0: Shipping */}
          {step === 0 && (
            <div className="card p-6">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                <FiTruck className="text-primary-500" />
                Shipping Address
              </h2>

              <form
                onSubmit={handleShippingNext}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>

                  <input
                    value={address.fullName}
                    onChange={setA('fullName')}
                    required
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    Street Address
                  </label>

                  <input
                    value={address.address}
                    onChange={setA('address')}
                    required
                    className="input-field"
                    placeholder="123 Main St"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    City
                  </label>

                  <input
                    value={address.city}
                    onChange={setA('city')}
                    required
                    className="input-field"
                    placeholder="Mumbai"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    State
                  </label>

                  <input
                    value={address.state}
                    onChange={setA('state')}
                    required
                    className="input-field"
                    placeholder="Maharashtra"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    PIN Code
                  </label>

                  <input
                    value={address.zipCode}
                    onChange={setA('zipCode')}
                    required
                    className="input-field"
                    placeholder="400001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    Country
                  </label>

                  <input
                    value={address.country}
                    onChange={setA('country')}
                    required
                    className="input-field"
                    placeholder="India"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    Phone Number
                  </label>

                  <input
                    value={address.phone}
                    onChange={setA('phone')}
                    required
                    className="input-field"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="btn-primary w-full py-3"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <div className="card p-6">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                <FiCreditCard className="text-primary-500" />
                Payment Method
              </h2>

              <form
                onSubmit={handlePaymentNext}
                className="space-y-3"
              >
                <label
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    payment === 'cod'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-dark-border'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={payment === 'cod'}
                    onChange={() => setPayment('cod')}
                    className="accent-primary-500"
                  />

                  <span className="text-2xl">💵</span>

                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Cash on Delivery
                    </p>

                    <p className="text-xs text-gray-500">
                      Pay when you receive your order
                    </p>
                  </div>

                  <span className="ml-auto text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                    Available
                  </span>
                </label>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="btn-secondary flex-1 py-3"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    className="btn-primary flex-1 py-3"
                  >
                    Review Order
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="card p-6">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-5">
                Review Your Order
              </h2>

              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div
                    key={item.product}
                    className="flex items-center gap-3 text-sm"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {item.name}
                      </p>

                      <p className="text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold text-gray-900 dark:text-white shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-gray-50 dark:bg-dark-bg rounded-xl text-sm mb-5">
                <p className="font-medium mb-1 text-gray-900 dark:text-white">
                  Ship to:
                </p>

                <p className="text-gray-500">
                  {address.fullName}, {address.address}, {address.city},{' '}
                  {address.state} {address.zipCode}
                </p>

                <p className="font-medium mt-2 mb-1 text-gray-900 dark:text-white">
                  Payment:{' '}
                  <span className="text-gray-500 capitalize">
                    {payment === 'cod'
                      ? 'Cash on Delivery'
                      : payment}
                  </span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary flex-1 py-3"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={orderLoading}
                  className="btn-primary flex-1 py-3"
                >
                  {orderLoading ? (
                    <>
                      <Spinner size="sm" color="white" />
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary sidebar */}
        <div className="card p-5 h-fit sticky top-20">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Order Summary
          </h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Subtotal ({items.length} items)</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Shipping</span>

              <span className={shipping === 0 ? 'text-green-500' : ''}>
                {shipping === 0
                  ? 'FREE'
                  : formatPrice(shipping)}
              </span>
            </div>

            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Tax (10%)</span>
              <span>{formatPrice(tax)}</span>
            </div>

            <div className="border-t border-gray-100 dark:border-dark-border pt-2 flex justify-between font-bold text-gray-900 dark:text-white">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-400">
            Payment will be collected through Cash on Delivery.
          </p>
        </div>
      </div>
    </div>
  );
};
export default CheckoutPage;
